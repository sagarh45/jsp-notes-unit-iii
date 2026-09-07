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

  /* SOURCE — code only */
  function sourceView(ex) {
    let html = "<div class='modal-section modal-section-source'>";
    html += "<p class='lab-meta'>Copy these files into <code>webapps/jsp/</code>. Source code only — no deploy steps here.</p>";
    html += "<h4 class='file-heading'>Main file — <code>" + ex.file + "</code></h4>";
    html += "<pre class='syntax'>" + JspRuntime.highlightJsp(ex.jsp) + "</pre>";
    if (ex.files) {
      Object.keys(ex.files).forEach(function (f) {
        html += "<h4 class='file-heading'>Partner file — <code>" + f + "</code></h4>";
        html += "<pre class='syntax'>" + JspRuntime.highlightJsp(ex.files[f]) + "</pre>";
      });
    }
    html += "</div>";
    return html;
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

  function runView(ex, params) {
    const src = preprocess(ex.jsp, ex.files);
    const extras = { fileName: ex.file };
    if (ex.extras && ex.extras.exceptionMessage) extras.exception = new Error(ex.extras.exceptionMessage);
    let result = JspRuntime.run(src, params, extras);
    if (!result.ok && result.errorPage && ex.files && ex.files[result.errorPage]) {
      const errSrc = preprocess(ex.files[result.errorPage], ex.files);
      result = JspRuntime.run(errSrc, params, { fileName: result.errorPage, exception: result.exception || new Error(result.error) });
    }
    const status = result.ok
      ? "<span class='out-ok'>HTTP 200 · executed in educational container</span>"
      : "<span class='out-err'>HTTP 500 · " + JspRuntime.escapeHtml(result.error || "error") + "</span>";
    const page = result.ok
      ? result.html
      : "<pre class='out-err'>" + JspRuntime.escapeHtml(result.error || "Error") + "</pre>";
    return "<div class='modal-section modal-section-run'>" +
      "<p>" + status + "</p>" +
      "<div class='browser-frame'><div class='browser-bar'><span class='dots'><i></i><i></i><i></i></span>" +
      "<div class='url'>http://localhost:8080/jsp/" + ex.file + buildQuery(params) + "</div></div>" +
      "<div class='browser-page'>" + page + "</div></div></div>";
  }

  function filesSummary(exId, ex, box) {
    if (!window.JSP_DEPLOY) return "";
    const files = JSP_DEPLOY.getRequiredFiles(exId, ex);
    const names = files.map(function (f) {
      return "<code>" + f.name + "</code>" + (f.type === "Java" ? " (Java)" : "");
    }).join(", ");
    const url = JSP_DEPLOY.buildUrl(exId, ex, collectParams(box));
    let html = "<div class='lab-files'><b>Files:</b> " + names;
    html += "<br><b>Run URL:</b> <code class='run-url'>" + url + "</code>";
    if (ex.industry) html += "<br><b>Industry:</b> " + ex.industry;
    html += "</div>";
    return html;
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
          "<button class='btn btn-outline btn-sm' data-act='source' title='Show source code only'>Source code</button>" +
          "<button class='btn btn-navy btn-sm' data-act='deploy' title='Show deploy steps only'>Deploy</button>" +
          "<button class='btn btn-teal btn-sm' data-act='run' title='Run in browser simulator'>Run online</button>";
      }
      const body = $(".lab-body", box);
      if (body && !body.querySelector(".lab-files")) {
        body.insertAdjacentHTML("beforeend", filesSummary(id, ex, box));
      }
      $$("[data-param]", box).forEach(function (inp) {
        inp.addEventListener("input", function () {
          const el = body && body.querySelector(".run-url");
          if (el) el.textContent = JSP_DEPLOY.buildUrl(id, ex, collectParams(box));
        });
      });
      actions && actions.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-act]");
        if (!btn) return;
        const params = collectParams(box);
        const act = btn.getAttribute("data-act");
        if (act === "source") openModal("Source code — " + ex.file, sourceView(ex), "source");
        if (act === "deploy") openModal("Deploy steps — Tomcat 11 / " + ex.file, deployView(id, ex), "deploy");
        if (act === "run") openModal("Run online — " + ex.file, runView(ex, params), "run");
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
