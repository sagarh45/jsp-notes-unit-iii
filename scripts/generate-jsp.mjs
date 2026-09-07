import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

global.window = global;
eval(fs.readFileSync(path.join(root, "assets/js/examples.js"), "utf8"));
eval(fs.readFileSync(path.join(root, "assets/js/deploy.js"), "utf8"));

const outDir = path.join(root, "tomcat", "jsp");
const formsOut = path.join(outDir, "forms");
fs.mkdirSync(formsOut, { recursive: true });

const written = new Set();

function writeJsp(name, content) {
  if (!name || !content || written.has(name)) return;
  fs.writeFileSync(path.join(outDir, name), content, "utf8");
  written.add(name);
  console.log("Wrote tomcat/jsp/" + name);
}

Object.keys(window.JSP_EXAMPLES).forEach(function (id) {
  const ex = window.JSP_EXAMPLES[id];
  if (ex.file && ex.jsp) writeJsp(ex.file, ex.jsp);
  if (ex.files) {
    Object.keys(ex.files).forEach(function (f) {
      writeJsp(f, ex.files[f]);
    });
  }
});

eval(fs.readFileSync(path.join(root, "assets/js/html-forms.js"), "utf8"));
const allForms = window.JSP_HTML_FORMS.getAllForms();
Object.keys(allForms).forEach(function (rel) {
  const name = path.basename(rel);
  fs.writeFileSync(path.join(formsOut, name), allForms[rel], "utf8");
  console.log("Wrote tomcat/jsp/forms/" + name);
});

Object.keys(window.JSP_DEPLOY.javaBeans).forEach(function (name) {
  const classesDir = path.join(outDir, "WEB-INF", "classes");
  fs.mkdirSync(classesDir, { recursive: true });
  fs.writeFileSync(path.join(classesDir, name), window.JSP_DEPLOY.javaBeans[name], "utf8");
  console.log("Wrote tomcat/jsp/WEB-INF/classes/" + name);
});

console.log("\nCopy folder tomcat/jsp/ → C:\\apache-tomcat-11.0.24\\webapps\\jsp\\");
console.log("Open: http://localhost:8080/jsp/forms/hello_form.html");
