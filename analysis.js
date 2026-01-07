// ================= SAFE HELPERS =================
function normalize(v) {
  if (v === "**" || v === "" || v == null) return null;
  v = v.toString().trim();
  if (v.length === 1) v = "0" + v;
  return v;
}

function safeCell(row, col) {
  if (!row || !row.children[col]) return null;
  return row.children[col];
}

function familyOf(v) {
  if (!v) return null;
  const f = {
    "0": ["00","05","50","55"],
    "1": ["11","16","61","66"],
    "2": ["22","27","72","77"],
    "3": ["33","38","83","88"],
    "4": ["44","49","94","99"]
  };
  return f[v[0]] || [v];
}

// ================= MAIN ANALYSIS =================
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

  let patterns = [];

  // -------- COLUMN PATTERN --------
  for (let col = 1; col <= 6; col++) {
    let seq = [];
    last10.forEach(r => {
      const td = safeCell(r, col);
      seq.push(td ? normalize(td.innerText) : null);
    });

    const base = seq.find(v => v);
    if (!base) continue;
    const fam = familyOf(base);

    patterns.push({
      type: "column",
      col,
      family: fam,
      seq
    });
  }

  // -------- DIAGONAL PATTERN --------
  for (let col = 1; col <= 4; col++) {
    let seq = [];
    for (let i = 0; i < 6; i++) {
      const td = safeCell(last10[i], col + i);
      seq.push(td ? normalize(td.innerText) : null);
    }
    const base = seq.find(v => v);
    if (!base) continue;

    patterns.push({
      type: "diagonal",
      col,
      family: familyOf(base),
      seq
    });
  }

  // ================= MATCH FIND =================
  let index = 1;
  patterns.forEach(p => {
    let matches = [];

    rows.forEach((r, ri) => {
      let ok = true;
      for (let i = 0; i < p.seq.length; i++) {
        const td = p.type === "column"
          ? safeCell(rows[ri + i], p.col)
          : safeCell(rows[ri + i], p.col + i);

        if (!td) { ok = false; break; }

        const val = normalize(td.innerText);
        if (val && !p.family.includes(val)) {
          ok = false; break;
        }
      }
      if (ok) matches.push({ row: ri });
    });

    if (matches.length) {
      const div = document.createElement("div");
      div.className = "check-line";
      div.innerText = `Pattern ${index++} (${p.type})`;
      div.onclick = () => toggleMarks(matches, p);
      out.appendChild(div);
    }
  });
}

// ================= DRAW / REMOVE =================
let ACTIVE = false;

function toggleMarks(matches, pat) {
  const rows = document.querySelectorAll("#recordTable tbody tr");
  ACTIVE = !ACTIVE;

  rows.forEach(r =>
    r.querySelectorAll(".circle,.connect-top")
      .forEach(c => c.classList.remove("circle","connect-top"))
  );

  if (!ACTIVE) return;

  matches.forEach(m => {
    for (let i = 0; i < pat.seq.length; i++) {
      const td = pat.type === "column"
        ? safeCell(rows[m.row + i], pat.col)
        : safeCell(rows[m.row + i], pat.col + i);

      if (!td) continue;
      td.classList.add("circle");
      if (i > 0) td.classList.add("connect-top");
    }
  });
    }
