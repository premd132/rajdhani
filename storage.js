const tbody = document.querySelector("#recordTable tbody");
const TOTAL_WEEKS = 300;

document.getElementById("csvFile").addEventListener("change", loadCSV);

function loadCSV(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const lines = reader.result.trim().split(/\r?\n/);
    tbody.innerHTML = "";

    lines.forEach((line, i) => {
      const cols = line.split(",");
      addRow(cols, i + 1);
    });
  };
  reader.readAsText(file);
}

function addRow(values, week) {
  const tr = document.createElement("tr");
  tr.innerHTML =
    `<td>W${week}</td>` +
    values.slice(0, 6).map(v => `<td>${v.trim()}</td>`).join("");
  tbody.appendChild(tr);
}

function enableEdit() {
  document.querySelectorAll("#recordTable td").forEach((td, i) => {
    if (i % 7 !== 0) {
      td.contentEditable = true;
      td.classList.add("editable");
    }
  });
}

function saveData() {
  const data = [];
  document.querySelectorAll("#recordTable tbody tr").forEach(tr => {
    const row = [...tr.children].slice(1).map(td => td.innerText.trim());
    data.push(row);
  });
  localStorage.setItem("recordData", JSON.stringify(data));
  alert("Data Saved");
}

(function loadSaved() {
  const saved = JSON.parse(localStorage.getItem("recordData"));
  if (!saved) return;
  tbody.innerHTML = "";
  saved.forEach((r, i) => addRow(r, i + 1));
})();
