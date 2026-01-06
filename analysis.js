console.log("analysis.js loaded");

function runAnalysis() {
  alert("Run Analysis Clicked");

  // clear old
  document.querySelectorAll("td").forEach(td=>{
    td.classList.remove("circle","connect-top");
  });

  const rows = document.querySelectorAll("#recordTable tbody tr");

  if (rows.length < 5) {
    alert("Not enough rows");
    return;
  }

  // 🔥 FORCE DRAW (no logic)
  for (let i = rows.length - 5; i < rows.length; i++) {
    const td = rows[i].children[1]; // Mon column
    td.classList.add("circle");
    if (i !== rows.length - 5) td.classList.add("connect-top");
  }

  document.getElementById("checkLines").innerHTML =
    "<div class='check-line'>TEST LINE (CLICK NOT NEEDED)</div>";
}

window.runAnalysis = runAnalysis;
