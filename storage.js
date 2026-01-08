const tbody = document.querySelector("#recordTable tbody");

/* ===== CSV LOAD ===== */
document.getElementById("csvFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    tbody.innerHTML = "";

    const lines = reader.result
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l);

    lines.forEach((line, i) => {
      // split by comma OR space
      const cols = line.split(/[, \t]+/);

      const tr = document.createElement("tr");
      tr.innerHTML =
        `<td>W${i + 1}</td>` +
        cols.map(v => `<td>${pad(v)}</td>`).join("");

      tbody.appendChild(tr);
    });
  };
  reader.readAsText(file);
});

/* ===== PAD / NORMALIZE ===== */
function pad(v) {
  if (!v) return "";
  if (v === "**") return "**";
  v = v.toString().trim();
  return v.length === 1 ? "0" + v : v;
}

/* ===== EDIT MODE ===== */
function enableEdit() {
  document.querySelectorAll("#recordTable td").forEach((td, i) => {
    if (i % 7 !== 0) {
      td.contentEditable = true;
      td.classList.add("editable");
    }
  });
}

/* ===== SAVE DATA ===== */
function saveData() {
  const data = [];
  document.querySelectorAll("#recordTable tbody tr").forEach(tr => {
    const row = [...tr.children].slice(1).map(td => td.innerText.trim());
    data.push(row);
  });
  localStorage.setItem("record", JSON.stringify(data));
  alert("Data saved");
}

/* ===== LOAD SAVED ===== */
(function load() {
  const saved = JSON.parse(localStorage.getItem("record") || "null");
  if (!saved) return;

  tbody.innerHTML = "";
  saved.forEach((row, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML =
      `<td>W${i + 1}</td>` +
      row.map(v => `<td>${pad(v)}</td>`).join("");
    tbody.appendChild(tr);
  });
})();
