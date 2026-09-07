import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

global.window = global;
eval(fs.readFileSync(path.join(root, "assets/js/examples.js"), "utf8"));
eval(fs.readFileSync(path.join(root, "assets/js/html-forms.js"), "utf8"));

const formsDir = path.join(root, "forms");
fs.mkdirSync(formsDir, { recursive: true });

const all = window.JSP_HTML_FORMS.getAllForms();
Object.keys(all).forEach(function (rel) {
  const name = path.basename(rel);
  fs.writeFileSync(path.join(formsDir, name), all[rel], "utf8");
  console.log("Wrote forms/" + name);
});
console.log("Total:", Object.keys(all).length, "HTML forms");
