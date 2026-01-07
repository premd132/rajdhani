// ================= HELPERS =================

// safe cell getter
function safeCell(row, col) {
  return row.children[col] || null;
}

// normalize value
function normalize(val) {
  if (!val) return null;
  val = val.trim();
  if (val === "**") return null;

  if (/^\d$/.test(val)) return "0" + val;
  if (/^\d{2}$/.test(val)) return val;

  return null;
}

// family logic
function familyOf(v) {
  if (!v) return [];
  const map = {
    "0": ["00","05","50","55"],
    "1": ["01","06","51","56"],
    "2": ["02","07","52","57"],
    "3": ["03","08","53","58"],
    "4": ["04","09","54","59"],
    "5": ["10","15","60","65"],
    "6": ["11","16","61","66"],
    "7": ["12","17","62","67"],
    "8": ["13","18","63","68"],
    "9": ["14","19","64","69"]
  };
  return map[v[1]] || [];
}

// ================= MAIN =================

function runAnalysis() {
  const tbody = document.querySelector("#recordTable tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));
  const out = document.getElementById("checkLines");
  out.innerHTML = "";

  if (rows.length < 10) {
    alert("Minimum 10 rows chahiye");
    return;
  }

  const last10 = rows.slice(-10);
  let patternCount = 0;

  // ---------- COLUMN PATTERN ----------
  for (let col = 1; col <= 6; col++) {
    let seq = [];

    last10.forEach(r => {
      const td = safeCell(r, col);
      seq.push(td ? normalize(td.innerText) : null);
    });

    const base = seq.find(v => v);
    if (!base) continue;

    patternCount++;
    createCheckLine(
      `Pattern ${patternCount} (Column ${col})`,
      seq,
      last10.map(r => safeCell(r, col))
    );
  }

  // ---------- DIAGONAL PATTERN ----------
  for (let startCol = 1; startCol <= 4; startCol++) {
    let seq = [];
    let cells = [];

    for (let i = 0; i < 6; i++) {
      const r = last10[i];
      const td = safeCell(r, startCol + i);
      seq.push(td ? normalize(td.innerText) : null);
      cells.push(td);
    }

    const base = seq.find(v => v);
    if (!base) continue;

    patternCount++;
    createCheckLine(
      `Pattern ${patternCount} (Diagonal ${startCol})`,
      seq,
      cells
    );
  }

  if (patternCount === 0) {
    out.innerHTML = "<i>No valid pattern found</i>";
  }
}

// ================= UI =================

function createCheckLine(title, seq, cells) {
  const out = document.getElementById("checkLines");

  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = title;

  let active = false;

  div.onclick = () => {
    active = !active;
    cells.forEach(td => {
      if (!td) return;
      td.classList.toggle("circle", active);
    });
  };

  out.appendChild(div);
}

// ================= TEST =================
console.log("analysis.js loaded OK");
