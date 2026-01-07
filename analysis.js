/* ================= HELPERS ================= */

// **, blank, empty handle + single digit => 01
function normalize(v) {
  if (!v) return null;
  v = v.trim();
  if (v === "**") return null;
  if (!/^\d+$/.test(v)) return null;
  return v.length === 1 ? "0" + v : v;
}

// safe td access
function safeCell(row, col) {
  if (!row || !row.children[col]) return null;
  return row.children[col];
}

// family logic
function familyOf(v) {
  const f = {
    "0": ["00","05","50","55"],
    "1": ["11","16","61","66"],
    "2": ["22","27","72","77"],
    "3": ["33","38","83","88"],
    "4": ["44","49","94","99"]
  };
  return f[v[0]] || [v];
}

/* ================= MAIN ANALYSIS ================= */

function runAnalysis() {
  const tbody = document.querySelector("#recordTable tbody");
  const rows = [...tbody.querySelectorAll("tr")];
  const out = document.getElementById("checkLines");
  out.innerHTML = "";

  if (rows.length < 10) {
    alert("Minimum 10 rows chahiye");
    return;
  }

  const last10 = rows.slice(-10);
  let matches = [];

  /* -------- COLUMN PATTERN -------- */
  for (let col = 1; col <= 6; col++) {
    let seq = [];

    last10.forEach(r => {
      const td = safeCell(r, col);
      seq.push(td ? normalize(td.innerText) : null);
    });

    const base = seq.find(v => v);
    if (!base) continue;

    const fam = familyOf(base);

    rows.forEach((r, ri) => {
      const td = safeCell(r, col);
      const v = td ? normalize(td.innerText) : null;
      if (v && fam.includes(v)) {
        matches.push({ r: ri, c: col });
      }
    });

    addCheckLine(`Pattern (Column ${col})`, matches);
  }

  /* -------- DIAGONAL PATTERN -------- */
  for (let col = 1; col <= 4; col++) {
    let seq = [];

    for (let i = 0; i < 6; i++) {
      const td = safeCell(last10[i], col + i);
      seq.push(td ? normalize(td.innerText) : null);
    }

    const base = seq.find(v => v);
    if (!base) continue;

    const fam = familyOf(base);

    rows.forEach((r, ri) => {
      const td = safeCell(r, col);
      const v = td ? normalize(td.innerText) : null;
      if (v && fam.includes(v)) {
        matches.push({ r: ri, c: col });
      }
    });

    addCheckLine(`Pattern (Diagonal ${col})`, matches);
  }

  renderAI(matches);
}

/* ================= UI ================= */

function addCheckLine(title, points) {
  if (!points.length) return;

  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = title;

  let active = false;

  div.onclick = () => {
    active = !active;
    clearMarks();

    if (active) {
      points.forEach((p, i) => {
        const row = document.querySelectorAll("#recordTable tbody tr")[p.r];
        const td = row.children[p.c];
        td.classList.add("circle");
        if (i > 0) td.classList.add("connect-top");
      });
    }
  };

  document.getElementById("checkLines").appendChild(div);
}

function clearMarks() {
  document.querySelectorAll(".circle,.connect-top")
    .forEach(td => td.classList.remove("circle","connect-top"));
}

/* ================= AI PANEL ================= */

function renderAI(matches) {
  const panel = document.getElementById("aiPanel");
  if (!panel) return;

  const strength = Math.min(95, matches.length * 5);

  panel.innerHTML = `
    <div style="border:1px solid #ccc;padding:10px">
      <b>Prediction Strength:</b> ${strength}%<br>
      <b>Matches Found:</b> ${matches.length}<br>
      <small>AI uses last-10 pattern + family logic</small>
    </div>
  `;
}
