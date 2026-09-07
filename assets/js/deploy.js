/* Tomcat 11.0.24 deployment metadata for every JSP lab program */
window.JSP_DEPLOY = {
  tomcat: "11.0.24",
  app: "jsp",
  jdk: "17+",
  catalina: "C:\\apache-tomcat-11.0.24",
  baseUrl: "http://localhost:8080/jsp",

  javaBeans: {
    "Student.java": `public class Student implements java.io.Serializable {
  private String name;
  private int marks;

  public Student() {}

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public int getMarks() { return marks; }
  public void setMarks(int marks) { this.marks = marks; }
}`,
    "Cart.java": `public class Cart implements java.io.Serializable {
  private String item;
  private int price;
  private int qty;

  public Cart() {}

  public String getItem() { return item; }
  public void setItem(String item) { this.item = item; }

  public int getPrice() { return price; }
  public void setPrice(int price) { this.price = price; }

  public int getQty() { return qty; }
  public void setQty(int qty) { this.qty = qty; }
}`
  },

  /* Per-program: extra JSP files, Java classes, compile notes, run URL with sample params */
  meta: {
    hello: {
      files: ["hello.jsp"],
      java: [],
      compile: "JSP only — Tomcat Jasper auto-translates on first request. No manual javac.",
      run: "/hello.jsp?name=Sagar",
      note: "Single file. Place directly in webapps/jsp/"
    },
    scriptlet_table: {
      files: ["table.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/table.jsp?n=12",
      note: "Pass query parameter n."
    },
    expression_calc: {
      files: ["expr.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/expr.jsp?a=25&b=4",
      note: "Two query parameters required."
    },
    declaration_counter: {
      files: ["counter.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/counter.jsp",
      note: "Refresh browser multiple times to see counter increase."
    },
    comments_mix: {
      files: ["comments.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/comments.jsp",
      note: "View page source in browser to compare HTML vs JSP comments."
    },
    page_import: {
      files: ["pageDir.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/pageDir.jsp",
      note: "Rename file to pageDir.jsp when copying from notes."
    },
    include_static: {
      files: ["home.jsp", "header.jsp", "footer.jsp"],
      java: [],
      compile: "Auto by Tomcat. All three files compiled into one servlet.",
      run: "/home.jsp?user=WIT%20Student",
      note: "header.jsp and footer.jsp must be in SAME folder as home.jsp (static include)."
    },
    implicit_request: {
      files: ["req.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/req.jsp?roll=21IT045&course=Advanced%20Java",
      note: "Demonstrates request.getParameter()."
    },
    implicit_session: {
      files: ["login.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/login.jsp?uname=admin&pass=admin123",
      note: "Session cookie JSESSIONID created automatically."
    },
    implicit_application: {
      files: ["hits.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/hits.jsp",
      note: "Application scope counter shared by all users."
    },
    implicit_out: {
      files: ["out.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/out.jsp?city=Solapur",
      note: "Uses JspWriter out object."
    },
    action_forward: {
      files: ["route.jsp", "studentHome.jsp", "adminHome.jsp"],
      java: [],
      compile: "Auto by Tomcat. Three separate JSP resources.",
      run: "/route.jsp?role=student",
      altRun: "/route.jsp?role=admin",
      note: "Forward/include dispatches to studentHome or adminHome."
    },
    action_include: {
      files: ["layout.jsp", "nav.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/layout.jsp?pageTitle=Results%202026",
      note: "nav.jsp included at request time."
    },
    usebean_student: {
      files: ["bean.jsp"],
      java: ["Student.java"],
      compile: "Compile Student.java manually → WEB-INF/classes/Student.class",
      run: "/bean.jsp?name=Aditi%20Patil&marks=88",
      note: "JavaBean MUST be compiled before running bean.jsp."
    },
    exception_try: {
      files: ["safeDiv.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/safeDiv.jsp?num=100&den=0",
      altRun: "/safeDiv.jsp?num=100&den=5",
      note: "Try-catch inside scriptlet."
    },
    exception_errorpage: {
      files: ["risky.jsp", "error.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/risky.jsp?age=abc",
      altRun: "/risky.jsp?age=20",
      note: "risky.jsp has errorPage=\"error.jsp\". error.jsp needs isErrorPage=\"true\"."
    },
    error_view: {
      files: ["error.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/error.jsp",
      note: "Standalone error page demo. In production it is reached via errorPage forwarding."
    },
    ica1_elements: {
      files: ["product_pricing.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/product_pricing.jsp?price=999&discount=15",
      note: "E-commerce pricing. Change price and discount in URL."
    },
    ica1_datetime: {
      files: ["sales_forecast.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/sales_forecast.jsp?months=6",
      note: "Sales analytics report. Change months in URL."
    },
    ica2_register: {
      files: ["employee_register.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/employee_register.jsp?empId=E1024&name=Rahul&dept=IT",
      note: "HR onboarding. Run before employee_dashboard.jsp."
    },
    ica2_profile: {
      files: ["employee_dashboard.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/employee_dashboard.jsp",
      note: "Session dashboard. Run employee_register.jsp first in same browser."
    },
    ica3_cart: {
      files: ["shop_cart.jsp", "cart_nav.jsp", "Cart.java"],
      java: ["Cart.java"],
      compile: "Compile Cart.java to WEB-INF/classes. JSP auto-compiled.",
      run: "/shop_cart.jsp?sku=BOOK101&price=450&qty=2",
      note: "E-commerce cart. Run before shop_invoice.jsp."
    },
    ica3_bill: {
      files: ["shop_invoice.jsp", "invoice_header.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/shop_invoice.jsp",
      note: "GST invoice. Run shop_cart.jsp first in same session."
    },
    ica4_result: {
      files: ["insurance_premium.jsp", "error.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/insurance_premium.jsp?age=35&sum=500000&term=20",
      altRun: "/insurance_premium.jsp?age=abc&sum=500000&term=20",
      note: "Insurance premium. Invalid age forwards to error.jsp."
    },
    ica4_bank: {
      files: ["atm_withdraw.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/atm_withdraw.jsp?balance=5000&amount=12000",
      altRun: "/atm_withdraw.jsp?balance=5000&amount=2000",
      note: "ATM withdrawal. amount must be multiple of 100."
    },
    real_login_portal: {
      files: ["portal.jsp"],
      java: [],
      compile: "Auto by Tomcat.",
      run: "/portal.jsp?userid=21IT045&pwd=wit@123",
      note: "Demo password: wit@123"
    }
  },

  folderTree: function () {
    return [
      "apache-tomcat-11.0.24/",
      "  webapps/",
      "    jsp/                         -- application folder (context path /jsp)",
      "      forms/                     -- HTML input pages (one per program)",
      "        hello_form.html          -- user types → Submit → hello.jsp",
      "        table_form.html",
      "        ... (all *_form.html)",
      "      hello.jsp",
      "      table.jsp",
      "      ... (all .jsp files)",
      "      header.jsp, footer.jsp   -- static include partner files",
      "      nav.jsp                  -- jsp:include partner file",
      "      error.jsp                -- error page files",
      "      WEB-INF/",
      "        web.xml                -- optional (Tomcat 11 default is OK)",
      "        classes/",
      "          Student.class        -- compiled JavaBean",
      "          Cart.class",
      "        lib/                   -- JDBC driver JAR files",
      "  logs/",
      "  work/                        -- Jasper generates *_jsp.java here",
      "  bin/startup.bat              -- start server on Windows",
      "  bin/shutdown.bat             -- stop server on Windows"
    ].join("\n");
  },

  compileBean: function (className) {
    return [
      "REM --- Compile JavaBean for Tomcat 11 (JDK 17+) ---",
      "set CATALINA=C:\\apache-tomcat-11.0.24",
      "set APP=%CATALINA%\\webapps\\jsp",
      "",
      "mkdir %APP%\\WEB-INF\\classes 2>nul",
      "copy " + className + ".java %APP%\\WEB-INF\\classes\\",
      "cd /d %APP%\\WEB-INF\\classes",
      "",
      "REM Jakarta Servlet API from Tomcat (needed for some beans; plain beans need no jar)",
      "javac -encoding UTF-8 " + className + ".java",
      "",
      "REM Output: " + className + ".class in WEB-INF\\classes\\",
      "REM Restart Tomcat if already running, then open browser URL"
    ].join("\n");
  },

  startTomcat: function () {
    return [
      "REM ========== Apache Tomcat 11.0.24 — Start / Stop (Windows) ==========",
      "set CATALINA_HOME=C:\\apache-tomcat-11.0.24",
      "",
      "REM 1) Set JAVA_HOME (JDK 17 or 21 required for Tomcat 11)",
      "set JAVA_HOME=C:\\Program Files\\Java\\jdk-21",
      "",
      "REM 2) Start Tomcat",
      "%CATALINA_HOME%\\bin\\startup.bat",
      "",
      "REM 3) Stop Tomcat",
      "%CATALINA_HOME%\\bin\\shutdown.bat",
      "",
      "REM 4) Check logs if error",
      "type %CATALINA_HOME%\\logs\\catalina.out",
      "",
      "REM 5) Default URL: http://localhost:8080/",
      "REM    Your app:    http://localhost:8080/jsp/hello.jsp"
    ].join("\n");
  },

  jspCompileNote: function () {
    return [
      "JSP files (.jsp) — NO manual compilation needed.",
      "Tomcat 11 Jasper engine automatically:",
      "  1) Translates hello.jsp → work/.../hello_jsp.java",
      "  2) Compiles hello_jsp.java → hello_jsp.class",
      "  3) Executes _jspService() and sends HTML",
      "",
      "Pass input using HTML form (recommended) or URL query string:",
      "  Step 1: http://localhost:8080/jsp/forms/hello_form.html",
      "  Step 2: Type name → Submit → Tomcat runs hello.jsp",
      "",
      "Or direct URL (also works):",
      "  http://localhost:8080/jsp/table.jsp?n=12",
      "",
      "Optional precompile (production):",
      "  %CATALINA_HOME%\\bin\\jspc.bat -webapp webapps\\jsp -compile"
    ].join("\n");
  },

  getRequiredFiles: function (exId, ex) {
    const m = this.meta[exId] || {};
    const list = [];
    const main = ex.file || m.files && m.files[0];
    if (main && window.JSP_HTML_FORMS) {
      list.push({
        name: "forms/" + JSP_HTML_FORMS.formFileName(main),
        type: "HTML",
        required: true,
        role: "Step 1 — user types input here, then Submit"
      });
    }
    if (main) list.push({ name: main, type: "JSP", required: true, role: "Step 2 — JSP reads request.getParameter()" });
    if (ex.files) {
      Object.keys(ex.files).forEach(function (f) {
        if (f !== main) list.push({ name: f, type: "JSP", required: true, role: "Partner / include / error page" });
      });
    }
    (m.java || []).forEach(function (j) {
      list.push({ name: j, type: "Java", required: true, role: "JavaBean — compile to WEB-INF/classes/" });
    });
    if (!list.length && m.files) {
      m.files.forEach(function (f, i) {
        list.push({ name: f, type: "JSP", required: true, role: i === 0 ? "Main page" : "Support file" });
      });
    }
    return list;
  },

  buildPanel: function (exId, ex) {
    const m = this.meta[exId] || {};
    const files = this.getRequiredFiles(exId, ex);
    const main = ex.file || (m.files && m.files[0]);
    let html = "<div class='deploy-panel'>";

    html += "<h4>Run process — HTML form pehle, phir JSP</h4>";
    html += "<div class='flow-strip deploy-flow'>";
    html += "<span>① HTML form</span><i></i><span>② User types</span><i></i><span>③ Submit POST</span><i></i><span>④ JSP runs</span><i></i><span>⑤ Output</span>";
    html += "</div>";

    if (main && window.JSP_HTML_FORMS) {
      const formPath = "forms/" + JSP_HTML_FORMS.formFileName(main);
      html += "<ol class='deploy-steps deploy-process'>";
      html += "<li><b>Deploy files</b> — copy <code>" + formPath + "</code> + <code>" + main + "</code> (+ partner JSP/Java if any) to <code>webapps/jsp/</code></li>";
      html += "<li><b>Start Tomcat</b> — <code>bin\\startup.bat</code></li>";
      html += "<li><b>Open HTML form</b> — browser mein <code>" + this.baseUrl + "/" + formPath + "</code></li>";
      html += "<li><b>User input</b> — text fields mein values type karo (name, price, etc.)</li>";
      html += "<li><b>Submit</b> — form <code>action=\"/jsp/" + main + "\" method=\"post\"</code> se JSP ko data bhejta hai</li>";
      html += "<li><b>JSP execute</b> — Tomcat <code>" + main + "</code> chalata hai, <code>request.getParameter()</code> se data read hota hai</li>";
      html += "<li><b>Response</b> — browser mein JSP ka HTML output dikhta hai</li>";
      html += "</ol>";
    }

    html += "<h4>Required source files (Tomcat " + this.tomcat + ")</h4>";
    html += "<table class='deploy-table'><tr><th>#</th><th>File</th><th>Type</th><th>Role</th></tr>";
    files.forEach(function (f, i) {
      html += "<tr><td>" + (i + 1) + "</td><td><code>" + f.name + "</code></td><td>" + f.type + "</td><td>" + f.role + "</td></tr>";
    });
    html += "</table>";

    html += "<h4>Deploy folder</h4>";
    html += "<pre class='syntax'>" + this.escape(this.catalina + "\\webapps\\" + this.app + "\\") + "</pre>";

    html += "<h4>Compile</h4>";
    html += "<pre class='syntax'>" + this.escape(m.compile || this.jspCompileNote()) + "</pre>";

    if (m.java && m.java.length) {
      m.java.forEach(function (j) {
        html += "<h4>" + j + " source</h4>";
        html += "<pre class='syntax'>" + JspRuntime.escapeHtml(window.JSP_DEPLOY.javaBeans[j] || "// see deploy.js") + "</pre>";
        html += "<h4>Compile command</h4>";
        html += "<pre class='syntax'>" + JspRuntime.escapeHtml(window.JSP_DEPLOY.compileBean(j.replace(".java", ""))) + "</pre>";
      });
    }

    html += "<h4>Tomcat URLs</h4>";
    if (main && window.JSP_HTML_FORMS) {
      const formPath = "forms/" + JSP_HTML_FORMS.formFileName(main);
      html += "<p class='lab-meta'><b>Step 1 — HTML form URL:</b></p>";
      html += "<pre class='syntax'>" + this.escape(this.baseUrl + "/" + formPath) + "</pre>";
      html += "<p class='lab-meta'><b>Step 2 — JSP (form submit ke baad):</b></p>";
      html += "<pre class='syntax'>" + this.escape(this.baseUrl + "/" + main) + "  ← POST with form data</pre>";
    } else {
      html += "<pre class='syntax'>" + this.escape(this.buildUrl(exId, ex, null)) + "</pre>";
    }
    if (m.altRun) html += "<p class='lab-meta'>Alternate test URL: <code>" + this.baseUrl + m.altRun + "</code></p>";
    if (m.note) html += "<p class='lab-meta'><b>Note:</b> " + m.note + "</p>";

    html += "<h4>Start Tomcat 11.0.24</h4>";
    html += "<pre class='syntax'>" + this.escape(this.startTomcat()) + "</pre>";
    html += "</div>";
    return html;
  },

  buildUrl: function (exId, ex, params) {
    const m = this.meta[exId] || {};
    const pathOnly = (m.run || "/" + (ex.file || "page.jsp")).split("?")[0];
    const p = params || {};
    if (!Object.keys(p).length && ex.params) {
      ex.params.forEach(function (pr) { p[pr.name] = pr.value; });
    }
    const keys = Object.keys(p).filter(function (k) { return p[k] !== "" && p[k] != null; });
    if (!keys.length) return this.baseUrl + pathOnly;
    const qs = keys.map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(p[k]);
    }).join("&");
    return this.baseUrl + pathOnly + "?" + qs;
  },

  escape: function (s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
};
