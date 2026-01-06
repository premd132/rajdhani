const tbody = document.querySelector("#recordTable tbody");

/* ---------- CSV PARSER ---------- */
function smartSplit(line) {
  return line
    .split(/[,;\t ]+/)
    .map(v => v.trim())
    .filter(v => v !== "");
}

/* ---------- LOAD CSV ---------- */
function loadCSV(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const lines = reader.result.split(/\r?\n/);

    tbody.innerHTML = "";

    let week = 1;

    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const cols = smartSplit(lines[i]);

      // Allow: with or without week column
      let data;
      if (cols.length >= 7) data = cols.slice(1, 7);
      else if (cols.length === 6) data = cols;
      else continue;

      addRow(data, week++);
    }
  };
  reader.readAsText(file);
}

/* ---------- ADD ROW ---------- */
function addRow(values, week) {
  const tr = document.createElement("tr");
  tr.innerHTML =
    `<td>W${week}</td>` +
    values.map(v => `<td>${v}</td>`).join("");
  tbody.appendChild(tr);
}

/* ---------- EDIT MODE ---------- */
function enableEdit() {
  document.querySelectorAll("#recordTable tbody td").forEach((td, i) => {
    if (i % 7 !== 0) {
      td.contentEditable = true;
      td.classList.add("editable");
    }
  });
}

/* ---------- SAVE DATA ---------- */
function saveData() {
  const data = [];
  document.querySelectorAll("#recordTable tbody tr").forEach(tr => {
    const row = [...tr.children].slice(1).map(td => td.innerText.trim());
    data.push(row);
  });
  localStorage.setItem("recordData", JSON.stringify(data));
  alert("Data Saved");
}

/* ---------- LOAD SAVED ---------- */
(function () {
  const saved = JSON.parse(localStorage.getItem("recordData"));
  if (!saved) return;

  tbody.innerHTML = "";
  saved.forEach((row, i) => addRow(row, i + 1));
})();

/* ---------- EVENT BIND ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const csvInput = document.getElementById("csvFile");
  csvInput.addEventListener("change", loadCSV);
});
