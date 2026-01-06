const FAMILIES = [
  ["11","16","61","66"],
  ["22","27","72","77"],
  ["33","38","83","88"],
  ["44","49","94","99"],
  ["55","00","05","50"]
];

let patternMap = {};

function getFamily(j) {
  return FAMILIES.find(f => f.includes(j)) || [j];
}

function runAnalysis() {
  clearVisuals();
  patternMap = {};
  document.getElementById("checkLines").innerHTML = "";

  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  if (rows.length < 10) {
    alert("At least 10 rows required");
    return;
  }

  const base = rows.slice(-10);

  for (let col = 1; col <= 6; col++) {
    const basePattern = base.map(r =>
      getFamily(r.children[col].innerText.trim())
    );

    for (let start = 0; start <= rows.length - 10; start++) {
      if (start >= rows.length - 10) continue;

      let cells = [];
      let match = true;

      for (let i = 0; i < 10; i++) {
        const cell = rows[start + i].children[col];
        const val = cell.innerText.trim();
        if (!/^\d{1,2}$/.test(val)) {
  match = false;
  break;
        }
        if (!basePattern[i].includes(val)) {
          match = false;
          break;
        }
        cells.push(cell);
      }

      if (match) {
        const id = `COL${col}_ROW${start}`;
        patternMap[id] = cells;
        addCheckLine(id, `Pattern Match → Col ${col}`);
      }
    }
  }
}

function addCheckLine(id, text) {
  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = text;
  div.onclick = () => highlightPattern(id);
  document.getElementById("checkLines").appendChild(div);
}

function highlightPattern(id) {
  clearVisuals();
  const cells = patternMap[id];
  if (!cells) return;

  // 🔴 Circle first
  cells.forEach(c => c.classList.add("circle"));

  // ➖ Then connect
  for (let i = 1; i < cells.length; i++) {
    drawLine(cells[i - 1], cells[i]);
  }
}

function drawLine(c1, c2) {
  let svg = document.getElementById("svgLines");
  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "svgLines";
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";
    document.body.appendChild(svg);
  }

  const r1 = c1.getBoundingClientRect();
  const r2 = c2.getBoundingClientRect();

  const x1 = r1.left + r1.width / 2 + window.scrollX;
  const y1 = r1.top + r1.height / 2 + window.scrollY;
  const x2 = r2.left + r2.width / 2 + window.scrollX;
  const y2 = r2.top + r2.height / 2 + window.scrollY;

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "red");
  line.setAttribute("stroke-width", "3");

  svg.appendChild(line);
}

function clearVisuals() {
  document.querySelectorAll(".circle").forEach(c =>
    c.classList.remove("circle")
  );
  const svg = document.getElementById("svgLines");
  if (svg) svg.innerHTML = "";
}
