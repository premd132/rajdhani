const FAMILIES = [
  ["11","16","61","66"],
  ["22","27","72","77"],
  ["33","38","83","88"],
  ["44","49","94","99"],
  ["55","00","05","50"]
];

function getFamily(num) {
  for (let fam of FAMILIES) {
    if (fam.includes(num)) return fam;
  }
  return null;
}

function runAnalysis() {
  clearHighlights();

  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const box = document.getElementById("checkLines");
  box.innerHTML = "";

  if (rows.length < 10) {
    box.innerHTML = "<div>Not enough data</div>";
    return;
  }

  const last10 = rows.slice(-10);

  // column wise pattern
  for (let col = 1; col <= 6; col++) {
    const baseFamily = getFamily(
      last10[0].children[col].innerText.trim()
    );
    if (!baseFamily) continue;

    let ok = true;
    for (let r of last10) {
      const v = r.children[col].innerText.trim();
      if (!baseFamily.includes(v)) {
        ok = false;
        break;
      }
    }

    if (!ok) continue;

    // search full record
    rows.forEach((row, idx) => {
      if (idx < 10) return;

      const fam = getFamily(row.children[col].innerText.trim());
      if (fam && fam === baseFamily) {
        addCheckLine(col, idx, baseFamily);
      }
    });
  }
}

function addCheckLine(col, startRow, family) {
  const box = document.getElementById("checkLines");

  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = `PATTERN FOUND → Column ${col} | Family ${family.join(",")}`;

  div.onclick = () => highlightPattern(col, startRow, family);
  box.appendChild(div);
}

/* ---------- VISUAL PART ---------- */

function clearHighlights() {
  document
    .querySelectorAll(".circle")
    .forEach(td => td.classList.remove("circle"));
  document
    .querySelectorAll(".line")
    .forEach(el => el.remove());
}

function highlightPattern(col, startRow, family) {
  clearHighlights();

  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  let lastCell = null;

  for (let i = startRow; i < startRow + 10 && i < rows.length; i++) {
    const cell = rows[i].children[col];
    const val = cell.innerText.trim();

    if (family.includes(val)) {
      cell.classList.add("circle");

      if (lastCell) drawLine(lastCell, cell);
      lastCell = cell;
    }
  }
}

function drawLine(from, to) {
  const r1 = from.getBoundingClientRect();
  const r2 = to.getBoundingClientRect();

  const line = document.createElement("div");
  line.className = "line";

  const x1 = r1.left + r1.width / 2;
  const y1 = r1.top + r1.height / 2;
  const x2 = r2.left + r2.width / 2;
  const y2 = r2.top + r2.height / 2;

  const len = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  line.style.width = len + "px";
  line.style.transform =
    `translate(${x1}px, ${y1}px) rotate(${angle}deg)`;

  document.body.appendChild(line);
}
