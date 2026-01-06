console.log("analysis.js loaded");

/* FAMILY GROUPS */
const FAMILY = [
  ["11","16","61","66"],
  ["22","27","72","77"],
  ["33","38","83","88"],
  ["44","49","94","99"],
  ["55","00","05","50"]
];

function familyOf(val) {
  if (!val) return null;
  for (const f of FAMILY) if (f.includes(val)) return f.join("-");
  return null;
}

/* MAIN ANALYSIS */
function runAnalysis() {
  alert("Run Analysis Clicked");

  clearMarks();
  document.getElementById("checkLines").innerHTML = "";

  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  if (rows.length < 11) return alert("At least 10 rows required");

  const last10 = rows.slice(-10);
  const patterns = [];

  for (let col = 1; col <= 6; col++) {
    const famSeq = last10.map(r => familyOf(r.children[col].innerText));
    if (famSeq.includes(null)) continue;

    rows.slice(0, -10).forEach((_, i) => {
      if (i + 10 > rows.length - 10) return;

      let match = true;
      for (let k = 0; k < 10; k++) {
        const f = familyOf(rows[i+k].children[col].innerText);
        if (f !== famSeq[k]) { match = false; break; }
      }

      if (match) patterns.push({ col, start: i, len: 10 });
    });
  }

  patterns.forEach((p, idx) => createCheckLine(p, idx));
}

/* CHECK LINE */
function createCheckLine(p, idx) {
  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = `Pattern ${idx+1} | Column ${p.col}`;
  let on = false;

  div.onclick = () => {
    on = !on;
    if (on) drawPattern(p);
    else clearMarks();
  };

  document.getElementById("checkLines").appendChild(div);
}

/* DRAW */
function drawPattern(p) {
  clearMarks();
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];

  for (let i = 0; i < p.len; i++) {
    const td = rows[p.start + i].children[p.col];
    td.classList.add("circle");
    if (i > 0) td.classList.add("connect-top");
  }
}

/* CLEAR */
function clearMarks() {
  document.querySelectorAll(".circle,.connect-top")
    .forEach(td => td.classList.remove("circle","connect-top"));
}

/* expose */
window.runAnalysis = runAnalysis;
