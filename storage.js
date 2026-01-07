const tbody = document.querySelector("#recordTable tbody");

/* CSV split */
function smartSplit(line) {
  return line.split(/[,\t;]/).map(v => v.trim()).filter(v => v !== "");
}

/* CSV LOAD */
document.getElementById("csvFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const lines = reader.result.split(/\r?\n/);
    tbody.innerHTML = "";

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const cols = smartSplit(lines[i]);
      const data = cols.length >= 7 ? cols.slice(1, 7) : cols;
      addRow(data, i);
    }
  };
  reader.readAsText(file);
});

function addRow(values, week) {
  const tr = document.createElement("tr");

  tr.innerHTML =
    `<td>W${week}</td>` +
    values.map(v => `<td>${normalizeJodi(v)}</td>`).join("");

  tbody.appendChild(tr);
}
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
    const row = [...tr.children]
  .slice(1)
  .map(td => normalizeJodi(td.innerText.trim()));
    data.push(row);
  });
  localStorage.setItem("recordData", JSON.stringify(data));
  alert("Data Saved");
}

/* LOAD SAVED */
(function () {
  const saved = JSON.parse(localStorage.getItem("recordData"));
  if (!saved) return;
  tbody.innerHTML = "";
  saved.forEach((r, i) => addRow(r, i + 1));
})();
