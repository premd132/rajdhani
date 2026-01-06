// ===== FIXED FAMILY SET =====
function getFamily(jodi) {
  const FAMILIES = [
    ["11","16","61","66"],
    ["22","27","72","77"],
    ["33","38","83","88"],
    ["44","49","94","99"],
    ["55","00","05","50"]
  ];

  for (let fam of FAMILIES) {
    if (fam.includes(jodi)) {
      return fam;
    }
  }
  return [jodi];
}

// ===== ANALYSIS WITH FAMILY + SAME DAY + 6-7 WEEK FILTER =====
let patternMap = {};

function runAnalysis() {
  clearVisuals();
  patternMap = {};

  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const history = [];

  rows.forEach((tr, week) => {
    [...tr.querySelectorAll("td")].slice(1).forEach((td, day) => {
      const val = td.innerText.trim();
      if (val) history.push({ jodi: val, week, day, cell: td });
    });
  });

  const lastWeek = rows.length - 1;
  let pid = 0;

  history.forEach(base => {
    if (lastWeek - base.week > 7) return;

    const family = getFamily(base.jodi);
    const matches = history.filter(h =>
      family.includes(h.jodi) &&
      h.day === base.day &&
      lastWeek - h.week >= 6
    );

    if (matches.length >= 2) {
      const id = "P" + (++pid);
      patternMap[id] = matches.map(m => m.cell);
      addCheckLine(id, `FAMILY PATTERN: ${base.jodi}`);
    }
  });
}

// ===== CLICKABLE CHECK LINE =====
function addCheckLine(id, text) {
  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = text;
  div.onclick = () => highlightPattern(id);
  document.getElementById("checkLines").appendChild(div);
}

// ===== HIGHLIGHT + LINE =====
function highlightPattern(id) {
  clearVisuals();
  const cells = patternMap[id];
  if (!cells) return;

  cells.forEach(c => c.classList.add("circle"));

  for (let i = 1; i < cells.length; i++) {
    drawLine(cells[i - 1], cells[i]);
  }
}

// ===== DRAW LINE =====
function drawLine(c1, c2) {
  let svg = document.getElementById("lineLayer");
  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "lineLayer";
    svg.style.position = "absolute";
    svg.style.top = 0;
    svg.style.left = 0;
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";
    document.body.appendChild(svg);
  }

  const r1 = c1.getBoundingClientRect();
  const r2 = c2.getBoundingClientRect();

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", r1.left + r1.width / 2);
  line.setAttribute("y1", r1.top + r1.height / 2);
  line.setAttribute("x2", r2.left + r2.width / 2);
  line.setAttribute("y2", r2.top + r2.height / 2);
  line.setAttribute("stroke", "red");
  line.setAttribute("stroke-width", "2");

  svg.appendChild(line);
}

// ===== CLEAR =====
function clearVisuals() {
  document.querySelectorAll(".circle").forEach(c =>
    c.classList.remove("circle")
  );
  document.getElementById("checkLines").innerHTML = "";
  const svg = document.getElementById("lineLayer");
  if (svg) svg.innerHTML = "";
}
