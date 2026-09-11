/* Educational JSP subset runtime: translate, trace, and execute in the browser. */
(function (global) {
  const sessionStore = Object.create(null);
  const applicationStore = { hitCount: 0, users: 0 };

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlightJsp(src) {
    const esc = escapeHtml(src);
    const javaKw = /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|extends|final|finally|float|for|if|implements|import|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|String|Integer|Double|Object|List|ArrayList|Math|System|out|println|print|request|response|session|application|pageContext|page|config|exception|PrintWriter|HttpServletRequest|HttpServletResponse|HttpServlet|void|doGet|doPost)\b/g;

    function highlightJava(code) {
      return code
        .replace(javaKw, '<span class="jkw">$1</span>')
        .replace(/(&quot;(?:\\.|[^&quot;\\])*&quot;|&#39;(?:\\.|[^&#39;\\])*&#39;)/g, '<span class="str">$1</span>')
        .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="num">$1</span>');
    }

    function highlightHtmlText(code) {
      return code
        .replace(/(&lt;\/?[\w:-]+[^&gt;]*&gt;)/g, '<span class="htag">$1</span>')
        .replace(/(&amp;[\w#]+;)/g, '<span class="ent">$1</span>');
    }

    function wrapJsp(openLen, raw, cls) {
      const open = raw.slice(0, openLen);
      const body = raw.slice(openLen, -4);
      const close = raw.slice(-4);
      return '<span class="jsp-delim ' + cls + '">' + open + '</span>' +
        highlightJava(body) +
        '<span class="jsp-delim ' + cls + '">' + close + '</span>';
    }

    const re = /(&lt;%--[\s\S]*?--%&gt;|&lt;%@[\s\S]*?%&gt;|&lt;%![\s\S]*?%&gt;|&lt;%=[\s\S]*?%&gt;|&lt;%[\s\S]*?%&gt;)/g;
    let out = "";
    let last = 0;
    let m;
    while ((m = re.exec(esc))) {
      if (m.index > last) {
        out += highlightHtmlText(highlightJava(esc.slice(last, m.index)));
      }
      const raw = m[0];
      if (raw.indexOf("&lt;%--") === 0) out += '<span class="cmt">' + raw + '</span>';
      else if (raw.indexOf("&lt;%@") === 0) out += '<span class="dir">' + raw + '</span>';
      else if (raw.indexOf("&lt;%!") === 0) out += wrapJsp(6, raw, "decl-delim");
      else if (raw.indexOf("&lt;%=") === 0) out += wrapJsp(6, raw, "expr-delim");
      else out += wrapJsp(5, raw, "scr-delim");
      last = m.index + raw.length;
    }
    if (last < esc.length) out += highlightHtmlText(highlightJava(esc.slice(last)));
    if (!out) out = highlightJava(esc);
    return out;
  }

  function highlightHtml(src) {
    const esc = escapeHtml(src);
    return esc
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="cmt">$1</span>')
      .replace(/(&lt;\/?[\w:-]+)/g, '<span class="htag">$1</span>')
      .replace(/([\w:-]+=)(&quot;[^&quot;]*&quot;|&#39;[^&#39;]*&#39;)/g, '$1<span class="attr">$2</span>')
      .replace(/(&gt;)/g, '<span class="htag">$1</span>')
      .replace(/(&lt;%@[\s\S]*?%&gt;)/g, '<span class="dir">$1</span>')
      .replace(/(&lt;%[\s\S]*?%&gt;)/g, '<span class="scr">$1</span>')
      .replace(/(&lt;%= [\s\S]*?%&gt;)/g, '<span class="expr">$1</span>');
  }

  function highlightStaticBlocks() {
    document.querySelectorAll(".content pre.syntax:not(.syntax-html)").forEach(function (el) {
      el.innerHTML = highlightJsp(el.textContent);
    });
  }

  function tokenize(jsp) {
    const tokens = [];
    const re = /<%--[\s\S]*?--%>|<%@[\s\S]*?%>|<%![\s\S]*?%>|<%=[\s\S]*?%>|<%[\s\S]*?%>/g;
    let last = 0;
    let m;
    while ((m = re.exec(jsp))) {
      if (m.index > last) tokens.push({ type: "html", raw: jsp.slice(last, m.index) });
      const raw = m[0];
      if (raw.startsWith("<%--")) tokens.push({ type: "comment", raw });
      else if (raw.startsWith("<%@")) tokens.push({ type: "directive", raw, body: raw.slice(3, -2).trim() });
      else if (raw.startsWith("<%!")) tokens.push({ type: "declaration", raw, body: raw.slice(3, -2) });
      else if (raw.startsWith("<%=")) tokens.push({ type: "expression", raw, body: raw.slice(3, -2).trim() });
      else tokens.push({ type: "scriptlet", raw, body: raw.slice(2, -2) });
      last = m.index + raw.length;
    }
    if (last < jsp.length) tokens.push({ type: "html", raw: jsp.slice(last) });
    return tokens;
  }

  function parsePageDirective(body) {
    const attrs = {};
    const re = /(\w+)\s*=\s*"([^"]*)"/g;
    let m;
    while ((m = re.exec(body))) attrs[m[1]] = m[2];
    return attrs;
  }

  function stripJavaLineComments(code) {
    return code.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\/\/.*$/gm, function (m, str) {
      return str != null ? str : "";
    });
  }

  function javaToJs(code) {
    let s = code;
    s = stripJavaLineComments(s);
    s = s.replace(/\/\*[\s\S]*?\*\//g, "");
    s = s.replace(/\bSystem\.currentTimeMillis\s*\(\s*\)/g, "Date.now()");
    s = s.replace(/\(\s*int\s*\)\s*(\([^)]*\)|[\w.]+)/g, "Math.trunc($1)");
    s = s.replace(/\(\s*double\s*\)\s*(\([^)]*\)|[\w.]+)/g, "Number($1)");
    s = s.replace(/\bInteger\.parseInt\s*\(/g, "jParseInt(");
    s = s.replace(/\bDouble\.parseDouble\s*\(/g, "jParseFloat(");
    s = s.replace(/\bFloat\.parseFloat\s*\(/g, "jParseFloat(");
    s = s.replace(/\bLong\.parseLong\s*\(/g, "jParseInt(");
    s = s.replace(/\bString\.valueOf\s*\(/g, "String(");
    s = s.replace(/new\s+java\.util\.Date\s*\(\s*\)/g, "new Date()");
    s = s.replace(/new\s+Date\s*\(\s*\)/g, "new Date()");
    s = s.replace(/System\.out\.println\s*\(([\s\S]*?)\)\s*;/g, "out.println($1);");
    s = s.replace(/System\.out\.print\s*\(([\s\S]*?)\)\s*;/g, "out.print($1);");
    s = s.replace(/\b(?:public|private|protected|static|final|synchronized)\s+/g, "");
    s = s.replace(/\b(?:String|int|double|float|long|boolean|void|char|byte|short|Object|Integer|Double)\s+(\w+)\s*\(([^)]*)\)/g, function (_, name, args) {
      const jsArgs = args.split(",").map(function (a) {
        a = a.trim();
        if (!a) return "";
        return a.split(/\s+/).pop();
      }).filter(Boolean).join(", ");
      return "function " + name + "(" + jsArgs + ")";
    });
    s = s.replace(/\bint\s+(\w+)\s*=\s*([^;]+);/g, function (_, name, expr) {
      expr = expr.trim();
      if (/^[\w.]+\s*\/\s*[\w.]+$/.test(expr)) {
        const parts = expr.split("/");
        return "var " + name + " = idiv(" + parts[0].trim() + ", " + parts[1].trim() + ");";
      }
      return "var " + name + " = Math.trunc(" + expr + ");";
    });
    s = s.replace(/\b(String|int|double|float|long|boolean|char|byte|short|Object|Integer|Double)\s+(\w+)\s*=/g, "var $2 =");
    s = s.replace(/\b(String|int|double|float|long|boolean|char|byte|short|Object|Integer|Double)\s+(\w+)\s*;/g, "var $2;");
    s = s.replace(/\bfor\s*\(\s*(int|long|double|float)\s+/g, "for (var ");
    s = s.replace(/\bfor\s*\(\s*(?!var\b)(\w+)\s*=/g, "for (var $1 =");
    s = s.replace(/catch\s*\(\s*\w+\s+(\w+)\s*\)/g, "catch ($1)");
    s = s.replace(/((?:"[^"]*"|'[^']*'|[A-Za-z_]\w*))\s*\.equals\s*\(/g, "($1)==(");
    s = s.replace(/(\w+)\s*\.length\s*\(\s*\)/g, "$1.length");
    s = s.replace(/(\w+)\s*\.getClass\s*\(\s*\)\s*\.getName\s*\(\s*\)/g, "(typeof $1)");
    s = s.replace(/(\w+)\s*\.getMessage\s*\(\s*\)/g, "($1 && $1.message)");
    s = s.replace(/throw\s+new\s+\w+\s*\(([\s\S]*?)\)\s*;/g, "throw new Error($1);");
    return s;
  }

  function createOut() {
    let buf = "";
    return {
      print(v) { buf += v == null ? "" : String(v); },
      println(v) { buf += (v == null ? "" : String(v)) + "\n"; },
      write(v) { buf += v == null ? "" : String(v); },
      get() { return buf; }
    };
  }

  function createRequest(params, attributes) {
    const p = params || {};
    const a = Object.assign({}, attributes || {});
    return {
      getParameter(name) {
        if (p[name] === undefined || p[name] === "") return null;
        return String(p[name]);
      },
      getParameterValues(name) {
        const v = p[name];
        if (v == null || v === "") return null;
        return Array.isArray(v) ? v.map(String) : [String(v)];
      },
      getAttribute(name) { return a[name] == null ? null : a[name]; },
      setAttribute(name, value) { a[name] = value; },
      getMethod() { return p.__method || "GET"; },
      getRequestURI() { return p.__uri || "/demo.jsp"; },
      getHeader(h) { return h.toLowerCase() === "user-agent" ? "JSP Notes Simulator" : null; },
      getRemoteAddr() { return "127.0.0.1"; },
      _attrs: a
    };
  }

  function createSession() {
    return {
      getAttribute(name) { return sessionStore[name] == null ? null : sessionStore[name]; },
      setAttribute(name, value) { sessionStore[name] = value; },
      removeAttribute(name) { delete sessionStore[name]; },
      invalidate() { Object.keys(sessionStore).forEach((k) => delete sessionStore[k]); },
      getId() { return "JSPSESSION01"; },
      isNew() { return Object.keys(sessionStore).length === 0; }
    };
  }

  function createApplication() {
    return {
      getAttribute(name) { return applicationStore[name] == null ? null : applicationStore[name]; },
      setAttribute(name, value) { applicationStore[name] = value; },
      getServerInfo() { return "JSP Notes Educational Container/1.0"; }
    };
  }

  function translateToServlet(tokens, fileName) {
    const decls = [];
    const service = [];
    const dirs = [];
    service.push("public void _jspService(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {");
    service.push("  JspWriter out = response.getWriter();");
    service.push("  HttpSession session = request.getSession();");
    service.push("  ServletContext application = getServletContext();");
    service.push("  PageContext pageContext = _jspxFactory.getPageContext(this, request, response, null, true, 8192, true);");
    service.push("  Object page = this;");
    tokens.forEach((t) => {
      if (t.type === "directive") dirs.push("  // directive: " + t.body.replace(/\s+/g, " "));
      if (t.type === "declaration") decls.push(t.body.replace(/\n/g, "\n  "));
      if (t.type === "html") {
        const chunk = t.raw.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, "\\n");
        if (chunk) service.push('  out.write("' + chunk + '");');
      }
      if (t.type === "scriptlet") {
        t.body.split("\n").forEach((line) => service.push("  " + line));
      }
      if (t.type === "expression") service.push("  out.print(" + t.body + ");");
      if (t.type === "comment") service.push("  // JSP comment omitted from servlet");
    });
    service.push("}");
    return [
      "// Auto-generated from " + (fileName || "page.jsp") + " by Jasper (educational view)",
      "public class " + ((fileName || "page_jsp").replace(/[^A-Za-z0-9]/g, "_")) + " extends HttpJspBase {",
      dirs.join("\n"),
      decls.map((d) => "  " + d).join("\n"),
      "  public void jspInit() { /* container calls once */ }",
      "  public void jspDestroy() { /* container calls on unload */ }",
      service.join("\n"),
      "}"
    ].filter(Boolean).join("\n");
  }

  function buildTrace(tokens, fileName) {
    const steps = [
      { title: "Client request arrives", detail: "Browser sends HTTP GET/POST to " + (fileName || "page.jsp") + "." },
      { title: "Translation (JSP → Servlet)", detail: "Jasper reads the JSP and generates a servlet class with jspInit, _jspService and jspDestroy." },
      { title: "Compilation", detail: "Generated .java is compiled to .class and loaded by the JVM." },
      { title: "jspInit()", detail: "Called once after instantiation. Declarations (<%! %>) become class members here." }
    ];
    let n = 1;
    tokens.forEach((t) => {
      if (t.type === "html" && t.raw.trim()) {
        steps.push({ title: "_jspService step " + n + " — template text", detail: "Write HTML/text to JspWriter:\n" + t.raw.trim().slice(0, 240) });
        n++;
      } else if (t.type === "scriptlet") {
        steps.push({ title: "_jspService step " + n + " — scriptlet", detail: "Embedded Java runs inside _jspService():\n" + t.body.trim() });
        n++;
      } else if (t.type === "expression") {
        steps.push({ title: "_jspService step " + n + " — expression", detail: "Translated to out.print(" + t.body + "); The value is converted to String and flushed to the page." });
        n++;
      } else if (t.type === "declaration") {
        steps.push({ title: "Class member from declaration", detail: "<%! %> is NOT inside _jspService. It becomes a field or method of the servlet:\n" + t.body.trim() });
      } else if (t.type === "directive") {
        steps.push({ title: "Directive (translation time)", detail: "<%@ " + t.body.replace(/\s+/g, " ") + " %> is processed while generating the servlet, not at request time." });
      }
    });
    steps.push({ title: "Response committed", detail: "Container sends the buffered HTML back to the browser. jspDestroy() runs only when the JSP is unloaded, not after every request." });
    return steps;
  }

  function run(jsp, params, extras) {
    const tokens = tokenize(jsp);
    let pageAttrs = { session: "true", isErrorPage: "false", errorPage: "" };
    tokens.forEach((t) => {
      if (t.type === "directive" && /^page\b/i.test(t.body)) {
        pageAttrs = Object.assign(pageAttrs, parsePageDirective(t.body.replace(/^page\b/i, "")));
      }
    });

    const decls = tokens.filter((t) => t.type === "declaration").map((t) => javaToJs(t.body)).join("\n");
    const bodyParts = [];
    tokens.forEach((t) => {
      if (t.type === "html") bodyParts.push("out.write(" + JSON.stringify(t.raw) + ");");
      if (t.type === "scriptlet") bodyParts.push(javaToJs(t.body));
      if (t.type === "expression") bodyParts.push("out.print(" + javaToJs(t.body) + ");");
    });

    const out = createOut();
    const request = createRequest(params, extras && extras.attributes);
    const response = {
      setContentType(t) { this.contentType = t; },
      sendRedirect(url) { const e = new Error("REDIRECT:" + url); e.redirect = url; throw e; },
      contentType: pageAttrs.contentType || "text/html"
    };
    const session = pageAttrs.session === "false" ? {
      getAttribute() { throw new Error("Cannot access session: page session=\"false\""); },
      setAttribute() { throw new Error("Cannot access session: page session=\"false\""); },
      getId() { return null; }
    } : createSession();
    const application = createApplication();
    const config = { getInitParameter(n) { return n === "admin" ? "hod@college.edu" : null; }, getServletName() { return "jsp"; } };
    const pageContext = {
      setAttribute(n, v) { request.setAttribute(n, v); },
      getAttribute(n) { return request.getAttribute(n); },
      forward(path) { out.println("[forwarded to " + path + "]"); }
    };
    const exception = (extras && extras.exception) || null;
    if (pageAttrs.isErrorPage === "true" && !exception) {
      /* still allow running error pages with a demo exception */
    }
    const page = {};
    const impl = { out, request, response, session, application, config, pageContext, page, exception: exception || new Error("Demo exception") };

    applicationStore.hitCount = (applicationStore.hitCount || 0) + 1;

    try {
      function jParseInt(v) {
        if (v == null || !/^-?\d+$/.test(String(v).trim())) {
          throw new Error('java.lang.NumberFormatException: For input string "' + v + '"');
        }
        return parseInt(String(v).trim(), 10);
      }
      function jParseFloat(v) {
        if (v == null || isNaN(Number(v))) {
          throw new Error('java.lang.NumberFormatException: For input string "' + v + '"');
        }
        return parseFloat(v);
      }
      function idiv(a, b) {
        a = Number(a); b = Number(b);
        if (b === 0) throw new Error("java.lang.ArithmeticException: / by zero");
        return Math.trunc(a / b);
      }
      const fn = new Function(
        "out", "request", "response", "session", "application", "config", "pageContext", "page", "exception",
        "jParseInt", "jParseFloat", "idiv",
        decls + "\n" + bodyParts.join("\n")
      );
      fn(
        impl.out, impl.request, impl.response, impl.session, impl.application,
        impl.config, impl.pageContext, impl.page,
        pageAttrs.isErrorPage === "true" ? impl.exception : null,
        jParseInt, jParseFloat, idiv
      );
      return { ok: true, html: out.get(), servlet: translateToServlet(tokens, extras && extras.fileName), steps: buildTrace(tokens, extras && extras.fileName), pageAttrs };
    } catch (err) {
      if (err.redirect) {
        return { ok: true, html: "<p>Redirecting to <b>" + escapeHtml(err.redirect) + "</b></p>", servlet: translateToServlet(tokens, extras && extras.fileName), steps: buildTrace(tokens, extras && extras.fileName), pageAttrs, redirect: err.redirect };
      }
      if (pageAttrs.errorPage) {
        return {
          ok: false,
          error: err.message,
          errorPage: pageAttrs.errorPage,
          html: "",
          servlet: translateToServlet(tokens, extras && extras.fileName),
          steps: buildTrace(tokens, extras && extras.fileName).concat([{ title: "Exception thrown", detail: err.message + " → forward to " + pageAttrs.errorPage }]),
          pageAttrs,
          exception: err
        };
      }
      return { ok: false, error: err.message, html: "", servlet: translateToServlet(tokens, extras && extras.fileName), steps: buildTrace(tokens, extras && extras.fileName), pageAttrs };
    }
  }

  global.JspRuntime = {
    tokenize, run, highlightJsp, highlightHtml, highlightStaticBlocks, escapeHtml, translateToServlet,
    resetSession() {
      Object.keys(sessionStore).forEach((k) => delete sessionStore[k]);
    },
    resetApp() {
      Object.keys(applicationStore).forEach((k) => delete applicationStore[k]);
      applicationStore.hitCount = 0;
    },
    sessionStore, applicationStore
  };
})(window);
