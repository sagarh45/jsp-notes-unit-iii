(function () {
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderTheory(practical) {
    let html = "<div class='ica-theory card'>";

    html += "<div class='ica-step-label'>Step 1 · Complete problem statement</div>";
    html += "<h3 class='ica-main-title'>" + esc(practical.number) + " — " + esc(practical.title) + "</h3>";
    html += "<p class='ica-industry'><b>Industry:</b> " + esc(practical.industry) + "</p>";
    html += "<div class='ica-problem'>" + esc(practical.problemStatement).replace(/\n/g, "<br>") + "</div>";

    html += "<div class='ica-step-label'>Step 2 · Important details</div>";
    html += "<div class='callout def'><strong>Aim</strong>" + esc(practical.aim) + "</div>";

    html += "<div class='ica-details-grid'>";
    html += "<div class='ica-detail-box'><h4>Given</h4><ul>";
    practical.given.forEach(function (g) { html += "<li>" + esc(g) + "</li>"; });
    html += "</ul></div>";
    html += "<div class='ica-detail-box'><h4>Requirements</h4><ul>";
    practical.requirements.forEach(function (r) { html += "<li>" + esc(r) + "</li>"; });
    html += "</ul></div>";
    html += "</div>";

    html += "<h4>Algorithm / deployment steps</h4>";
    html += "<ol class='ica-algo'>";
    practical.algorithm.forEach(function (a) { html += "<li>" + esc(a) + "</li>"; });
    html += "</ol>";

    html += "<h4>Programs overview</h4>";
    html += "<table class='ica-programs-table'><tr><th>Program</th><th>File</th><th>Sample input (URL)</th><th>Expected output</th><th>Tomcat run URL</th></tr>";
    practical.programs.forEach(function (prog) {
      html += "<tr>";
      html += "<td>" + esc(prog.name) + "</td>";
      html += "<td><code>" + esc(prog.file) + "</code></td>";
      html += "<td>" + esc(prog.sampleInput) + "</td>";
      html += "<td>" + esc(prog.sampleOutput) + "</td>";
      html += "<td><code class='run-url-sm'>" + esc(prog.runUrl) + "</code></td>";
      html += "</tr>";
    });
    html += "</table>";

    html += "<h4>Viva questions</h4>";
    html += "<ol class='viva'>";
    practical.viva.forEach(function (v) { html += "<li>" + esc(v) + "</li>"; });
    html += "</ol>";

    html += "</div>";
    return html;
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.ICA_PRACTICALS) return;
    ICA_PRACTICALS.forEach(function (p) {
      const el = document.getElementById(p.id + "-theory");
      if (el) el.innerHTML = renderTheory(p);
    });
  });
})();
