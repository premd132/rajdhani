const tbody = document.querySelector("#recordTable tbody");

document.getElementById("csvFile")
  .addEventListener("change", loadCSV);

function smartSplit(line) {
  return line
    .split(/[,\t;]/)
    .map(v => v.trim())
    .filter(v => v !== "");
}

function loadCSV(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const lines = reader.result.split(/\r?\n/);
    tbody.innerHTML = "";

    let week = 1;

    for (let i = 1; i < lines.length; i++) { // header skip
      if (!lines[i].trim()) continue;

      const cols = smartSplit(lines[i]);
      if (cols.length < 6) continue;

      addRow(cols.slice(0, 6), week++);
    }
  };
  reader.readAsText(file);
}

function addRow(values, week) {
  const tr = document.createElement("tr");
  tr.innerHTML =
    `<td>W${week}</td>` +
    values.map(v => `<td>${v}</td>`).join("");
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
  saved.forEach((row, i) => addRow(row, i + 1));
})();
