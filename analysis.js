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
  if (rows.length < 10) return;

  const base = rows.slice(-10);

  for (let col = 1; col <= 6; col++) {
    const basePattern = base.map(r => getFamily(r.children[col].innerText));

    for (let start = 0; start <= rows.length - 10; start++) {
      if (start >= rows.length - 10) continue;

      let match = true;
      let cells = [];

      for (let i = 0; i < 10; i++) {
        const cell = rows[start + i].children[col];
        if (!basePattern[i].includes(cell.innerText)) {
          match = false;
          break;
        }
        cells.push(cell);
      }

      if (match) {
        const id = `C${col}_R${start}`;
        patternMap[id] = cells;
        addCheckLine(id, `Pattern Match – Col ${col}`);
      }
    }
  }
}

function addCheckLine(id, text) {
  const d = document.createElement("div");
  d.className = "check-line";
  d.innerText = text;
  d.onclick = () => highlight(id);
  document.getElementById("checkLines").appendChild(d);
}

function highlight(id) {
  clearVisuals();
  const cells = patternMap[id];
  if (!cells) return;

  cells.forEach(c => c.classList.add("circle"));
  for (let i = 1; i < cells.length; i++) {
    drawLine(cells[i - 1], cells[i]);
  }
}

function drawLine(a, b) {
  let svg = document.getElementById("svgLines");
  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "svgLines";
    svg.style.position = "absolute";
    svg.style.top = 0;
    svg.style.left = 0;
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";
    document.body.appendChild(svg);
  }

  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();

  const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
  l.setAttribute("x1", r1.left + r1.width / 2);
  l.setAttribute("y1", r1.top + r1.height / 2);
  l.setAttribute("x2", r2.left + r2.width / 2);
  l.setAttribute("y2", r2.top + r2.height / 2);
  l.setAttribute("stroke", "red");
  l.setAttribute("stroke-width", "2");
  svg.appendChild(l);
}

function clearVisuals() {
  document.querySelectorAll(".circle").forEach(c => c.classList.remove("circle"));
  const svg = document.getElementById("svgLines");
  if (svg) svg.innerHTML = "";
}
