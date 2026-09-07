(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  function preprocess(jsp, files) {
    files = files || {};
    let src = jsp;
    src = src.replace(/<%@\s*include\s+file\s*=\s*"([^"]+)"\s*%>/g, function (_, f) {
      return files[f] != null ? files[f] : "<!-- missing include " + f + " -->";
    });
    src = src.replace(/<jsp:include\s+page\s*=\s*"([^"]+)"\s*\/?\s*>/g, function (_, f) {
      return files[f] != null ? files[f] : "<!-- missing include " + f + " -->";
    });
    src = src.replace(/<jsp:include\s+page\s*=\s*"([^"]+)"\s*>\s*<\/jsp:include>/g, function (_, f) {
      return files[f] != null ? files[f] : "<!-- missing include " + f + " -->";
    });
    src = src.replace(/<jsp:useBean([^>]*)\/?>/g, function (_, attrs) {
      const id = (attrs.match(/\bid\s*=\s*"([^"]+)"/) || [])[1] || "bean";
      const scope = (attrs.match(/\bscope\s*=\s*"([^"]+)"/) || [])[1] || "page";
      const store = scope === "session" ? "session" : scope === "application" ? "application" : "request";
      return "<% var " + id + " = " + store + ".getAttribute(\"" + id + "\"); if (" + id + " == null) { " + id + " = {}; " + store + ".setAttribute(\"" + id + "\", " + id + "); } %>";
    });
    src = src.replace(/<jsp:setProperty\s+name="([^"]+)"\s+property="([^"]+)"\s+param="([^"]+)"\s*\/?\s*>/g,
      function (_, name, prop, param) {
        return "<% " + name + "." + prop + " = request.getParameter(\"" + param + "\"); %>";
      });
    src = src.replace(/<jsp:setProperty\s+name="([^"]+)"\s+property="([^"]+)"\s+value="([^"]*)"\s*\/?\s*>/g,
      function (_, name, prop, val) {
        return "<% " + name + "." + prop + " = \"" + val.replace(/"/g, '\\"') + "\"; %>";
      });
    src = src.replace(/<jsp:getProperty\s+name="([^"]+)"\s+property="([^"]+)"\s*\/?\s*>/g,
      function (_, name, prop) {
        return "<%= " + name + "." + prop + " %>";
      });
    const fwd = src.match(/<jsp:forward\s+page\s*=\s*"([^"]+)"\s*\/?\s*>/);
    if (fwd && files[fwd[1]]) {
      src = files[fwd[1]];
    } else {
      src = src.replace(/<jsp:forward\s+page\s*=\s*"<%=([\s\S]*?)%>"\s*\/?\s*>/g, function (_, expr) {
        return "<% pageContext.forward(String(" + expr + ")); %>";
      });
    }
    return src;
  }

  function collectParams(box) {
    const params = {};
    $$("[data-param]", box).forEach((inp) => { params[inp.getAttribute("data-param")] = inp.value; });
    return params;
  }

  function buildQuery(params) {
    const keys = Object.keys(params || {}).filter(function (k) { return params[k] !== "" && params[k] != null; });
    if (!keys.length) return "";
    return "?" + keys.map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]); }).join("&");
  }

  function openModal(title, html, viewType) {
    const back = $("#modalBack");
    const modal = $(".modal", back);
    $("#modalTitle").textContent = title;
    $("#modalBody").innerHTML = html;
    back.classList.add("open");
    back.classList.remove("view-source", "view-deploy", "view-trace", "view-run");
    if (viewType) back.classList.add("view-" + viewType);
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    $("#modalBack").classList.remove("open", "view-source", "view-deploy", "view-trace", "view-run");
    document.body.classList.remove("modal-open");
  }

  /* SOURCE — HTML form + JSP (both files) */
  function sourceView(exId, ex) {
    const formFile = window.JSP_HTML_FORMS ? JSP_HTML_FORMS.formFileName(ex.file) : "";
    let html = "<div class='modal-section modal-section-source'>";
    html += "<div class='run-steps run-steps-static'><span class='done'>1. HTML form</span><i></i><span class='done'>2. JSP page</span></div>";
    html += "<p class='lab-meta'>Dono alag files — user <b>HTML form</b> mein type karta hai → Submit → <b>JSP</b> <code>request.getParameter()</code> se data leti hai.</p>";
    if (window.JSP_HTML_FORMS) {
      html += "<h4 class='file-heading'>File 1 — HTML form — <code>forms/" + formFile + "</code></h4>";
      html += "<pre class='syntax syntax-html'>" + JspRuntime.escapeHtml(JSP_HTML_FORMS.buildFormHtml(exId, ex)) + "</pre>";
    }
    html += "<h4 class='file-heading'>File 2 — JSP page — <code>" + ex.file + "</code></h4>";
    html += "<pre class='syntax'>" + JspRuntime.highlightJsp(ex.jsp) + "</pre>";
    if (ex.files) {
      Object.keys(ex.files).forEach(function (f) {
        html += "<h4 class='file-heading'>Partner JSP — <code>" + f + "</code></h4>";
        html += "<pre class='syntax'>" + JspRuntime.highlightJsp(ex.files[f]) + "</pre>";
      });
    }
    html += "</div>";
    return html;
  }

  function formFieldsHtml(exId, ex) {
    const params = ex.params || [];
    if (params.length === 0) return "<p class='lab-meta'>No input fields — click Submit to run <code>" + ex.file + "</code>.</p>";
    let h = "";
    params.forEach(function (p) {
      const type = window.JSP_HTML_FORMS ? JSP_HTML_FORMS.inputType(p.name) : "text";
      h += "<label class='modal-form-label'>" + (p.label || p.name) +
        "<input type='" + type + "' name='" + p.name + "' value='" + JspRuntime.escapeHtml(p.value || "") + "' /></label>";
    });
    return h;
  }

  function formView(exId, ex) {
    const formFile = JSP_HTML_FORMS.formFileName(ex.file);
    let html = "<div class='modal-section modal-form'>";
    html += "<p class='lab-meta'>Same as <code>forms/" + formFile + "</code> — type here and Submit. Simulator runs <code>" + ex.file + "</code>.</p>";
    html += "<form id='labLiveForm' class='live-form'>";
    html += formFieldsHtml(exId, ex);
    html += "<button type='submit' class='btn btn-teal'>Submit → " + ex.file + "</button>";
    html += "</form>";
    html += "<p class='lab-meta' style='margin-top:12px'>On Tomcat: open <code>forms/" + formFile + "</code> in browser, then form posts to <code>" + ex.file + "</code>.</p>";
    html += "</div>";
    return html;
  }

  function bindLiveForm(exId, ex) {
    const form = $("#labLiveForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const params = {};
      $$("input, select", form).forEach(function (inp) {
        if (inp.name) params[inp.name] = inp.value;
      });
      openModal("Run — " + ex.file, runFlowView(exId, ex, params, "jsp"), "run");
      bindRunBack(exId, ex);
    });
  }

  /* DEPLOY — steps only */
  function deployView(exId, ex) {
    if (!window.JSP_DEPLOY) return "<p>Deploy info not loaded.</p>";
    return "<div class='modal-section modal-section-deploy'>" + JSP_DEPLOY.buildPanel(exId, ex) + "</div>";
  }

  /* TRACE — execution flow only */
  function traceView(ex, params) {
    const src = preprocess(ex.jsp, ex.files);
    const result = JspRuntime.run(src, params, { fileName: ex.file });
    const steps = result.steps || [];
    let html = "<div class='modal-section modal-section-trace'>";
    html += "<p class='lab-meta'>JSP life-cycle flow for <code>" + ex.file + "</code> — translation to response (no source code here).</p>";
    html += "<div class='flow-strip'>";
    html += "<span>Browser</span><i></i><span>Jasper</span><i></i><span>Servlet</span><i></i><span>_jspService</span><i></i><span>HTML</span>";
    html += "</div>";
    html += "<div class='prog'><span id='traceBar'></span></div>";
    steps.forEach(function (s, i) {
      html += "<div class='trace-step'><span class='n'>" + (i + 1) + "</span>";
      html += "<div class='trace-body'><b>" + JspRuntime.escapeHtml(s.title) + "</b>";
      html += "<p>" + JspRuntime.escapeHtml(s.detail).replace(/\n/g, "<br>") + "</p></div></div>";
    });
    html += "</div>";
    return html;
  }

  function jspResultHtml(ex, params) {
    const src = preprocess(ex.jsp, ex.files);
    const extras = { fileName: ex.file };
    if (ex.extras && ex.extras.exceptionMessage) extras.exception = new Error(ex.extras.exceptionMessage);
    let result = JspRuntime.run(src, params, extras);
    if (!result.ok && result.errorPage && ex.files && ex.files[result.errorPage]) {
      const errSrc = preprocess(ex.files[result.errorPage], ex.files);
      result = JspRuntime.run(errSrc, params, { fileName: result.errorPage, exception: result.exception || new Error(result.error) });
    }
    const status = result.ok
      ? "<span class='out-ok'>HTTP 200 · JSP executed</span>"
      : "<span class='out-err'>HTTP 500 · " + JspRuntime.escapeHtml(result.error || "error") + "</span>";
    const page = result.ok
      ? result.html
      : "<pre class='out-err'>" + JspRuntime.escapeHtml(result.error || "Error") + "</pre>";
    const postNote = Object.keys(params || {}).length
      ? "<div class='post-data'>POST data: " + Object.keys(params).map(function (k) {
          return "<code>" + JspRuntime.escapeHtml(k) + "=" + JspRuntime.escapeHtml(params[k]) + "</code>";
        }).join(" · ") + "</div>"
      : "";
    return {
      status: status,
      page: page,
      postNote: postNote,
      jspUrl: "http://localhost:8080/jsp/" + ex.file
    };
  }

  function runFlowView(exId, ex, params, phase) {
    const formFile = JSP_HTML_FORMS.formFileName(ex.file);
    const formPath = JSP_HTML_FORMS.formPath(ex.file);
    const formUrl = "http://localhost:8080/jsp/" + formPath;

    if (phase !== "jsp") {
      let html = "<div class='modal-section modal-section-run run-flow'>";
      html += "<div class='run-steps'><span class='active'>1. HTML form</span><i></i><span>2. JSP execute</span></div>";
      html += "<p class='lab-meta'><b>Step 1:</b> HTML form mein values type karo → Submit dabao → phir JSP chalegi.</p>";
      html += "<div class='browser-frame browser-frame-sm'>";
      html += "<div class='browser-bar'><span class='dots'><i></i><i></i><i></i></span>";
      html += "<div class='url'>" + formUrl + "</div></div>";
      html += "<div class='browser-page browser-form-page'>";
      html += "<form id='labRunForm' class='live-form'>";
      html += formFieldsHtml(exId, ex);
      html += "<button type='submit' class='btn btn-teal'>Submit → " + ex.file + "</button>";
      html += "</form></div></div>";
      html += "<p class='lab-meta'>Form file: <code>forms/" + formFile + "</code> · action=<code>/jsp/" + ex.file + "</code> method=<code>post</code></p>";
      html += "</div>";
      return html;
    }

    const out = jspResultHtml(ex, params);
    let html = "<div class='modal-section modal-section-run run-flow'>";
    html += "<div class='run-steps'><span class='done'>1. HTML form ✓</span><i></i><span class='active'>2. JSP execute</span></div>";
    html += "<p class='lab-meta'><b>Step 1 done</b> — form submit hua. <b>Step 2</b> — Tomcat ab JSP chalata hai.</p>";
    html += "<div class='flow-strip run-flow-mini'>";
    html += "<span>" + formFile + "</span><i></i><span>POST</span><i></i><span>" + ex.file + "</span><i></i><span>HTML output</span>";
    html += "</div>";
    html += "<p>" + out.status + "</p>";
    html += out.postNote;
    html += "<div class='browser-frame'>";
    html += "<div class='browser-bar'><span class='dots'><i></i><i></i><i></i></span>";
    html += "<div class='url'>" + out.jspUrl + "</div></div>";
    html += "<div class='browser-page'>" + out.page + "</div></div>";
    html += "<button type='button' class='btn btn-outline btn-sm run-back-form' id='runBackForm'>← Wapas HTML form</button>";
    html += "</div>";
    return html;
  }

  function bindRunFlow(exId, ex) {
    const form = $("#labRunForm");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const params = {};
        $$("input, select", form).forEach(function (inp) {
          if (inp.name) params[inp.name] = inp.value;
        });
        openModal("Run — " + ex.file, runFlowView(exId, ex, params, "jsp"), "run");
        bindRunBack(exId, ex);
      });
    }
    bindRunBack(exId, ex);
  }

  function bindRunBack(exId, ex) {
    const back = $("#runBackForm");
    if (back) {
      back.addEventListener("click", function () {
        openModal("Run — " + JSP_HTML_FORMS.formFileName(ex.file) + " → " + ex.file, runFlowView(exId, ex, null, "form"), "run");
        bindRunFlow(exId, ex);
      });
    }
  }

  function runView(ex, params) {
    const out = jspResultHtml(ex, params);
    return "<div class='modal-section modal-section-run'>" +
      "<p>" + out.status + "</p>" + out.postNote +
      "<div class='browser-frame'><div class='browser-bar'><span class='dots'><i></i><i></i><i></i></span>" +
      "<div class='url'>" + out.jspUrl + "</div></div>" +
      "<div class='browser-page'>" + out.page + "</div></div></div>";
  }

  function filesSummary(exId, ex, box) {
    if (!window.JSP_DEPLOY) return "";
    const files = JSP_DEPLOY.getRequiredFiles(exId, ex);
    const names = files.map(function (f) {
      return "<code>" + f.name + "</code>" + (f.type === "Java" ? " (Java)" : "") + (f.type === "HTML" ? " (form)" : "");
    }).join(", ");
    const formFile = window.JSP_HTML_FORMS ? JSP_HTML_FORMS.formPath(ex.file) : "";
    let html = "<div class='lab-files lab-form-flow'>";
    if (formFile) {
      html += "<b>Flow:</b> <a href='" + formFile + "' target='_blank' rel='noopener'>" + formFile + "</a>";
      html += " → <code>" + ex.file + "</code><br>";
    }
    html += "<b>All files:</b> " + names;
    html += "<br><b>Tomcat:</b> copy <code>forms/</code> + JSP files to <code>webapps/jsp/</code>";
    if (ex.industry) html += "<br><b>Industry:</b> " + ex.industry;
    html += "</div>";
    return html;
  }

  function formFileLabel(ex) {
    return window.JSP_HTML_FORMS ? JSP_HTML_FORMS.formFileName(ex.file) + " + " + ex.file : ex.file;
  }

  function wireLabs() {
    $$("[data-example]").forEach(function (box) {
      if (box.getAttribute("data-wired")) return;
      box.setAttribute("data-wired", "1");
      const id = box.getAttribute("data-example");
      const ex = window.JSP_EXAMPLES[id];
      if (!ex) return;
      const actions = $(".lab-actions", box);
      if (actions && !actions.innerHTML.trim()) {
        actions.innerHTML =
          "<button class='btn btn-gold btn-sm' data-act='trace' title='Show execution flow'>Trace</button>" +
          "<button class='btn btn-outline btn-sm' data-act='form' title='Open HTML input form'>HTML form</button>" +
          "<button class='btn btn-outline btn-sm' data-act='source' title='HTML + JSP source code'>Source code</button>" +
          "<button class='btn btn-navy btn-sm' data-act='deploy' title='Show deploy steps only'>Deploy</button>" +
          "<button class='btn btn-teal btn-sm' data-act='run' title='Step 1: HTML form → Step 2: JSP execute'>Run online</button>";
      }
      const body = $(".lab-body", box);
      if (body) {
        $$(".params", body).forEach(function (p) { p.style.display = "none"; });
      }
      if (body && !body.querySelector(".lab-files")) {
        body.insertAdjacentHTML("beforeend", filesSummary(id, ex, box));
      }
      actions && actions.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-act]");
        if (!btn) return;
        const params = {};
        (ex.params || []).forEach(function (p) { params[p.name] = p.value; });
        const act = btn.getAttribute("data-act");
        if (act === "source") openModal("Source — " + formFileLabel(ex), sourceView(id, ex), "source");
        if (act === "form") {
          openModal("HTML form — " + JSP_HTML_FORMS.formFileName(ex.file), formView(id, ex), "form");
          bindLiveForm(id, ex);
        }
        if (act === "deploy") openModal("Deploy — " + formFileLabel(ex), deployView(id, ex), "deploy");
        if (act === "run") {
          openModal("Run — " + JSP_HTML_FORMS.formFileName(ex.file) + " → " + ex.file, runFlowView(id, ex, null, "form"), "run");
          bindRunFlow(id, ex);
        }
        if (act === "trace") {
          openModal("Execution flow — " + ex.file, traceView(ex, params), "trace");
          requestAnimationFrame(function () {
            const bar = $("#traceBar");
            if (bar) bar.style.width = "100%";
          });
        }
      });
    });
  }

  function filterNav(q) {
    q = (q || "").toLowerCase();
    $$(".nav-link").forEach(function (a) {
      const t = a.textContent.toLowerCase();
      a.style.display = !q || t.indexOf(q) >= 0 ? "" : "none";
    });
  }

  function setActive() {
    const links = $$(".nav-link");
    const secs = $$(".section");
    let current = secs[0];
    secs.forEach(function (s) {
      if (s.getBoundingClientRect().top < 120) current = s;
    });
    links.forEach(function (a) {
      a.classList.toggle("active", current && a.getAttribute("href") === "#" + current.id);
    });
  }

  function isMobile() { return window.innerWidth <= 980; }

  function syncMenuState(open) {
    document.body.classList.toggle("menu-open", open);
    document.body.classList.toggle("sidebar-collapsed", !open && !isMobile());
    const btn = $("#menuBtn");
    const overlay = $("#sidebarOverlay");
    if (btn) {
      btn.textContent = open ? "Close" : "Menu";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }
    if (overlay) overlay.setAttribute("aria-hidden", open ? "false" : "true");
  }

  function openMenu() { syncMenuState(true); }

  function closeMenu() { syncMenuState(false); }

  function toggleMenu() {
    const open = document.body.classList.contains("menu-open");
    syncMenuState(!open);
  }

  function initMenu() {
    syncMenuState(!isMobile());
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireLabs();
    initMenu();
    $("#modalBack").addEventListener("click", function (e) {
      if (e.target.id === "modalBack" || e.target.classList.contains("close-x")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeModal();
        if (isMobile()) closeMenu();
      }
    });
    const search = $("#q");
    if (search) search.addEventListener("input", function () { filterNav(search.value); });
    $("#menuBtn") && $("#menuBtn").addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMenu();
    });
    $("#sidebarOverlay") && $("#sidebarOverlay").addEventListener("click", closeMenu);
    $$(".nav-link").forEach(function (a) {
      a.addEventListener("click", function () { if (isMobile()) closeMenu(); });
    });
    window.addEventListener("resize", function () {
      if (!isMobile()) syncMenuState(true);
    });
    $("#resetSess") && $("#resetSess").addEventListener("click", function () {
      JspRuntime.resetSession();
      JspRuntime.resetApp();
      alert("Simulator session and application scopes were cleared.");
    });
    window.addEventListener("scroll", setActive, { passive: true });
    setActive();
  });
})();
