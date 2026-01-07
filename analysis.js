/***********************
 * GLOBAL HELPERS
 ***********************/
function normalize(v) {
  if (!v || v === "**") return null;
  v = v.toString().trim();
  if (v.length === 1) return "0" + v;
  return v;
}

const FAMILY = [
  ["11","16","61","66"],
  ["22","27","72","77"],
  ["33","38","83","88"],
  ["44","49","94","99"],
  ["55","00","05","50"]
];

function sameFamily(a, b) {
  if (!a || !b) return false;
  return FAMILY.some(f => f.includes(a) && f.includes(b));
}

/***********************
 * MAIN ANALYSIS
 ***********************/
function runAnalysis() {
  const table = document.getElementById("recordTable");
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  const checkBox = document.getElementById("checkLines");

  checkBox.innerHTML = "";

  if (rows.length < 10) {
    alert("Need at least 10 rows");
    return;
  }

  const last10 = rows.slice(-10);

  const patterns = [];

  // ---- COLUMN PATTERNS ----
  for (let col = 1; col <= 6; col++) {
    let seq = [];
    for (let i = 0; i < 10; i++) {
      seq.push(normalize(last10[i].children[col].innerText));
    }
    if (seq.every(v => v !== null)) {
      patterns.push({ type: "Column", col, seq });
    }
  }

  // ---- DIAGONAL PATTERNS ----
  for (let startCol = 1; startCol <= 6; startCol++) {
    let seq = [];
    let col = startCol;
    for (let i = 0; i < 10 && col <= 6; i++, col++) {
      seq.push(normalize(last10[i].children[col].innerText));
    }
    if (seq.length >= 5 && seq.every(v => v !== null)) {
      patterns.push({ type: "Diagonal", startCol, seq });
    }
  }

  // ---- SEARCH IN FULL RECORD ----
  patterns.forEach((pat, index) => {
    const matches = [];

    for (let r = 0; r <= rows.length - pat.seq.length; r++) {
      let ok = true;
      for (let i = 0; i < pat.seq.length; i++) {
        let cell;
        if (pat.type === "Column") {
          cell = normalize(rows[r+i].children[pat.col].innerText);
        } else {
          const c = pat.startCol + i;
          if (c > 6) { ok = false; break; }
          cell = normalize(rows[r+i].children[c].innerText);
        }

        if (!cell || !sameFamily(cell, pat.seq[i])) {
          ok = false;
          break;
        }
      }
      if (ok) matches.push({ row: r, pat });
    }

    if (matches.length) {
      const div = document.createElement("div");
      div.className = "check-line";
      div.innerText = `Pattern ${index+1} (${pat.type})`;

      div.onclick = () => togglePattern(matches, rows);

      checkBox.appendChild(div);
    }
  });
}

/***********************
 * DRAW / REMOVE
 ***********************/
function togglePattern(matches, rows) {
  matches.forEach(m => {
    for (let i = 0; i < m.pat.seq.length; i++) {
      let td;
      if (m.pat.type === "Column") {
        td = rows[m.row+i].children[m.pat.col];
      } else {
        td = rows[m.row+i].children[m.pat.startCol+i];
      }
      td.classList.toggle("circle");
      if (i > 0) td.classList.toggle("connect-top");
    }
  });
}
