const DIRECTIONS = [
  { name: "down", dr: 1, dc: 0 },
  { name: "diag-right", dr: 1, dc: 1 },
  { name: "diag-left", dr: 1, dc: -1 },
  { name: "zigzag-r", dr: 1, dc: (i)=> i%2===0 ? 1 : -1 },
  { name: "zigzag-l", dr: 1, dc: (i)=> i%2===0 ? -1 : 1 },
];
function runEngine() {
  clearDrawing();

  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const last = rows.slice(-6);

  const box = document.getElementById("checkLines");
  box.innerHTML = "";

  let found = false;

  for (let col = 1; col <= 6; col++) {
    let famSeq = [];

    last.forEach((r, i) => {
      const td = r.children[col];
      if (!td) return;
      const fam = getFamily(td.innerText.trim());
      if (fam) famSeq.push({ row: rows.length - 6 + i, col, fam });
    });

    if (famSeq.length >= 3) {
      found = true;

      const div = document.createElement("div");
      div.className = "check-line";
      div.innerText = `Family Pattern | Column ${col}`;

      div.onclick = () => drawMatch(famSeq);
      box.appendChild(div);
    }
  }

  if (!found) {
    box.innerHTML = "<i>No family pattern found</i>";
  }
}

/* ===== DRAW ===== */
function drawMatch(seq) {
  clearDrawing();
  seq.forEach((s, i) => {
    const td = document.querySelectorAll("#recordTable tbody tr")[s.row]
      .children[s.col];
    td.classList.add("circle");
    if (i > 0) td.classList.add("v-line");
  });
}

/* ===== CLEAR ===== */
function clearDrawing() {
  document.querySelectorAll("#recordTable td").forEach(td => {
    td.classList.remove("circle", "v-line");
  });
}
