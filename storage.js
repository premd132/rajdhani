const tbody = document.querySelector("#recordTable tbody");
/* normalize value */
function norm(v) {
  v = v.trim();
  if (v === "**" || v === "") return "";
  if (/^\d$/.test(v)) return "0" + v;
  if (/^\d{2}$/.test(v)) return v;
  return "";
}
/* CSV split */
function smartSplit(line) {
  return line.split(/[,\t ]+/).map(v => v.trim());
}
/* CSV LOAD */
document.getElementById("csvFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const lines = reader.result.split(/\r?\n/);
    tbody.innerHTML = "";
    let w = 1;
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const cols = smartSplit(lines[i]);
      const data = cols.length >= 7 ? cols.slice(1, 7) : cols.slice(0, 6);
      addRow(data.map(norm), w++);
    }
  };
  reader.readAsText(file);
});
/* ADD ROW */
function addRow(values, week) {
  const tr = document.createElement("tr");
  tr.innerHTML =
    `<td>W${week}</td>` +
    values.map(v => `<td>${v}</td>`).join("");
  tbody.appendChild(tr);
}
/* EDIT */
function enableEdit() {
  document.querySelectorAll("#recordTable td").forEach((td, i) => {
    if (i % 7 !== 0) {
      td.contentEditable = true;
      td.classList.add("editable");
    }
  });
}
/* SAVE */
function saveData() {
  const data = [];
  document.querySelectorAll("#recordTable tbody tr").forEach(tr => {
    data.push([...tr.children].slice(1).map(td => norm(td.innerText)));
  });
  localStorage.setItem("recordData", JSON.stringify(data));
  alert("Data Saved");
}
/* LOAD SAVED */
(() => {
  const saved = JSON.parse(localStorage.getItem("recordData"));
  if (!saved) return;
  tbody.innerHTML = "";
  saved.forEach((r, i) => addRow(r, i + 1));
})();
