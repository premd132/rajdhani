/* ===== CSV UPLOAD (ROBUST – MIXED FORMAT SUPPORT) ===== */
function uploadCSV() {
  const input = document.getElementById("csvFile");
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    let text = reader.result || "";

    // clean text
    text = text
      .replace(/^\uFEFF/, "")
      .replace(/\r/g, "")
      .trim();

    if (!text) {
      alert("CSV empty hai");
      return;
    }

    let lines = text.split("\n");

    // remove header if present
    if (lines[0].toLowerCase().includes("mon")) {
      lines.shift();
    }

    const rows = document.querySelectorAll("#recordTable tbody tr");

    // clear table
    rows.forEach(tr => {
      tr.querySelectorAll("td").forEach((td, i) => {
        if (i > 0) td.innerText = "";
      });
    });

    // fill data
    lines.forEach((line, i) => {
      if (!rows[i]) return;

      let values = line
        .replace(/\*\*/g, "")      // remove **
        .trim()
        .split(/[\s,]+/)           // comma OR space
        .map(v => v.padStart(2, "0"));

      const cells = rows[i].querySelectorAll("td");
      for (let d = 0; d < 6; d++) {
        cells[d + 1].innerText = values[d] || "";
      }
    });

    alert("CSV load ho gayi. Ab Save dabao.");
  };

  reader.readAsText(file);
}

/* ===== ANALYSIS (SAME LOGIC AS BEFORE) ===== */
function runAnalysis() {
  document.querySelectorAll(".circle").forEach(c =>
    c.classList.remove("circle")
  );
  document.getElementById("checkLines").innerHTML = "";

  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const history = [];

  rows.forEach((tr, week) => {
    [...tr.querySelectorAll("td")].slice(1).forEach(td => {
      const v = td.innerText.trim();
      if (v) history.push({ jodi: v, week, cell: td });
    });
  });

  const lastSeen = {};
  history.forEach(h => lastSeen[h.jodi] = h.week);
  const currentWeek = rows.length - 1;

  Object.keys(lastSeen)
    .filter(j => currentWeek - lastSeen[j] >= 6)
    .forEach(j => {
      history
        .filter(h => h.jodi === j)
        .forEach(h => h.cell.classList.add("circle"));
      addCheckLine("PATTERN FOUND: " + j);
    });
}

function addCheckLine(text) {
  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = text;
  document.getElementById("checkLines").appendChild(div);
}
