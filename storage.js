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
    `<td>W${week}</td
