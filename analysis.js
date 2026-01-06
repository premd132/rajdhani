function runAnalysis() {
  clearMarks();
  document.getElementById("checkLines").innerHTML = "";

  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const history = [];

  rows.forEach((tr, week) => {
    [...tr.querySelectorAll("td")].slice(1).forEach((td, day) => {
      const val = td.innerText.trim();
      if (val) {
        history.push({
          jodi: val,
          week,
          cell: td
        });
      }
    });
  });

  const lastSeen = {};
  history.forEach(h => lastSeen[h.jodi] = h.week);

  const currentWeek = rows.length - 1;

  // 🔵 NICHE JODI (6–7 week gap)
  const nicheJodi = Object.keys(lastSeen).filter(j =>
    currentWeek - lastSeen[j] >= 6
  );

  nicheJodi.forEach(jodi => {
    history.forEach(h => {
      if (h.jodi === jodi) {
        markNiche(h.cell);
      }
    });
    addCheckLine(`NICHE BASE JODI FOUND: ${jodi}`);
  });
}

function markNiche(cell) {
  cell.classList.add("niche");
}

function addCheckLine(text) {
  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = text;
  document.getElementById("checkLines").appendChild(div);
}

function clearMarks() {
  document.querySelectorAll(".niche").forEach(c =>
    c.classList.remove("niche")
  );
}
