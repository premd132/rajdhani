const TOTAL_WEEKS = 300;
const tbody = document.querySelector("#recordTable tbody");

/* 🔒 CSV ONLY MODE
   - Page load par koi purana data nahi
   - localStorage completely ignored
*/

// force remove any old saved data
localStorage.removeItem("recordData");

function loadData() {
  tbody.innerHTML = "";
  for (let i = 0; i < TOTAL_WEEKS; i++) {
    addRow(["", "", "", "", "", ""], i + 1);
  }
}

function addRow(values, week) {
  const tr = document.createElement("tr");
  tr.innerHTML =
    `<td>W${week}</td>` +
    values.map(v => `<td contenteditable="false">${v}</td>`).join("");
  tbody.appendChild(tr);
}

function enableEdit() {
  tbody.querySelectorAll("td").forEach((td, i) => {
    if (i % 7 !== 0) {
      td.contentEditable = true;
      td.classList.add("editable");
    }
  });
}

function saveData() {
  alert("CSV mode active. Local save disabled.");
}

loadData();
