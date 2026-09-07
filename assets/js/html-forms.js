/* HTML input forms — one per program; submits to matching JSP via POST */
window.JSP_HTML_FORMS = {
  formFileName: function (jspFile) {
    return jspFile.replace(/\.jsp$/i, "_form.html");
  },

  formPath: function (jspFile) {
    return "forms/" + this.formFileName(jspFile);
  },

  /* Tomcat context path — absolute URL so form always posts to /jsp/xxx.jsp */
  jspAction: function (jspFile) {
    const app = (window.JSP_DEPLOY && JSP_DEPLOY.app) || "jsp";
    return "/" + app + "/" + jspFile;
  },

  formOpenUrl: function (jspFile) {
    const base = (window.JSP_DEPLOY && JSP_DEPLOY.baseUrl) || "http://localhost:8080/jsp";
    return base + "/" + this.formPath(jspFile);
  },

  inputType: function (name) {
    if (name === "pass" || name === "pwd" || name === "password") return "password";
    if (name === "marks" || name === "price" || name === "qty" || name === "n" ||
        name === "a" || name === "b" || name === "num" || name === "den" ||
        name === "age" || name === "sum" || name === "term" || name === "balance" ||
        name === "amount" || name === "discount" || name === "months") return "number";
    return "text";
  },

  buildFormHtml: function (exId, ex) {
    const title = ex.title || ex.file;
    const jsp = ex.file;
    const formName = this.formFileName(jsp);
    const params = ex.params || [];
    const noInput = params.length === 0;
    const special = this.specialForms[exId];

    let fields = "";
    if (special && special.fieldsHtml) {
      fields = special.fieldsHtml;
    } else if (noInput) {
      fields = "<p class='hint'>This program needs no input. Click Submit to open the JSP page.</p>";
    } else {
      params.forEach(function (p) {
        const type = JSP_HTML_FORMS.inputType(p.name);
        const step = type === "number" && (p.name === "price" || p.name === "balance") ? " step='any'" : "";
        fields += "<label for='" + p.name + "'>" + (p.label || p.name) + "</label>\n";
        fields += "<input type='" + type + "' id='" + p.name + "' name='" + p.name + "' value='" +
          String(p.value || "").replace(/'/g, "&#39;") + "' required" + step + " />\n";
      });
    }

    const hint = special && special.hint
      ? special.hint
      : "Open this form at <code>http://localhost:8080/jsp/forms/" + formName + "</code>. Type values and click <b>Submit</b> → data goes to <code>" + jsp + "</code> via POST.";

    const note = special && special.note ? "<p class='note'>" + special.note + "</p>" : "";
    const jspAction = JSP_HTML_FORMS.jspAction(jsp);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — Input Form</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: "Segoe UI", system-ui, sans-serif; max-width: 440px; margin: 32px auto; padding: 20px; color: #1a2332; background: #f6f3ee; }
    .card { background: #fff; border: 1px solid #e4ddd2; border-radius: 14px; padding: 22px; box-shadow: 0 8px 24px rgba(15,39,68,0.06); }
    h2 { margin: 0 0 6px; font-size: 20px; color: #0f2744; }
    .hint { color: #5b677a; font-size: 14px; line-height: 1.5; margin: 0 0 16px; }
    .note { background: #fff7e8; border-left: 4px solid #e8a317; padding: 10px 12px; font-size: 13px; margin: 0 0 14px; border-radius: 0 8px 8px 0; }
    label { display: block; margin: 12px 0 4px; font-weight: 600; font-size: 14px; color: #0f2744; }
    input, select { width: 100%; padding: 10px 12px; border: 1px solid #e4ddd2; border-radius: 8px; font: inherit; }
    button { margin-top: 18px; width: 100%; padding: 12px; background: #0d7377; color: #fff; border: 0; border-radius: 10px; font: inherit; font-weight: 600; cursor: pointer; }
    button:hover { background: #14919b; }
    .flow { margin-top: 16px; font-size: 12px; color: #5b677a; text-align: center; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>${title}</h2>
    <p class="hint">${hint}</p>
    ${note}
    <form action="${jspAction}" method="post">
${fields}      <button type="submit">Submit → ${jsp}</button>
    </form>
    <p class="flow">${formName} → POST → ${jspAction}</p>
  </div>
</body>
</html>`;
  },

  specialForms: {
    ica2_profile: {
      hint: "Dashboard reads data from <b>session</b> — no form fields needed here.",
      note: "Step 1: Submit <a href='/jsp/forms/employee_register_form.html'>employee_register_form.html</a> first.<br>Step 2: Then open dashboard below.",
      fieldsHtml: "<p class='hint'>After registration in the same browser session, click Submit.</p>\n"
    },
    ica3_bill: {
      hint: "Invoice reads bill amount from <b>session</b>.",
      note: "Step 1: Submit <a href='/jsp/forms/shop_cart_form.html'>shop_cart_form.html</a> first.<br>Step 2: Then generate invoice.",
      fieldsHtml: "<p class='hint'>After adding items to cart, click Submit.</p>\n"
    },
    error_view: {
      hint: "This is the error page itself (<code>isErrorPage=true</code>).",
      note: "To trigger it naturally, use <a href='/jsp/forms/insurance_premium_form.html'>insurance_premium_form.html</a> with invalid age, or risky.jsp demo.",
      fieldsHtml: "<p class='hint'>Click Submit to preview the standalone error page layout.</p>\n"
    }
  },

  getAllForms: function () {
    const out = {};
    if (!window.JSP_EXAMPLES) return out;
    Object.keys(window.JSP_EXAMPLES).forEach(function (id) {
      const ex = window.JSP_EXAMPLES[id];
      out[JSP_HTML_FORMS.formPath(ex.file)] = JSP_HTML_FORMS.buildFormHtml(id, ex);
    });
    return out;
  }
};
