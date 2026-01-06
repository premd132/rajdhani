const tbody = document.querySelector("#recordTable tbody");
document.getElementById("csvFile").addEventListener("change", loadCSV);

function smartSplit(line) {
  // comma | semicolon | tab | multiple spaces
  return line.split(/[,;\t ]+/).map(v => v.trim()).filter(v => v !== "");
}

function loadCSV(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result;
    const lines = text.split(/\r?\n/);

    tbody.innerHTML = "";

    for (let i = 1; i < lines.length; i++) { // header skip
      if (!lines[i].trim()) continue;

      const cols = smartSplit(lines[i]);

      // Expect: Week + 6 values OR only 6 values
      let data;
      if (cols.length >= 7) {
        data = cols.slice(1, 7);
      } else if (cols.length === 6) {
        data = cols;
      } else {
        continue;
      }

      addRow(data, i);
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

// EDIT MODE
function enableEdit() {
  document.querySelectorAll("#recordTable td").forEach((td, i) => {
    if (i % 7 !== 0) {
      td.contentEditable = true;
      td.classList.add("editable");
    }
  });
}

// SAVE
function saveData() {
  const data = [];
  document.querySelectorAll("#recordTable tbody tr").forEach(tr => {
    const row = [...tr.children].slice(1).map(td => td.innerText.trim());
    data.push(row);
  });
  localStorage.setItem("recordData", JSON.stringify(data));
  alert("Data Saved");
}

// LOAD SAVED
(function () {
  const saved = JSON.parse(localStorage.getItem("recordData"));
  if (!saved) return;

  tbody.innerHTML = "";
  saved.forEach((r, i) => addRow(r, i + 1));
})();
