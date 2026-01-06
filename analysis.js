function runAnalysis() {
  const box = document.getElementById("checkLines");
  box.innerHTML = "";

  const rows = document.querySelectorAll("#recordTable tbody tr");

  if (rows.length < 10) {
    box.innerHTML = "<div>Not enough data</div>";
    return;
  }

  // Dummy example output
  for (let i = 1; i <= 5; i++) {
    const div = document.createElement("div");
    div.className = "check-line";
    div.innerText = "PATTERN FOUND : " + i;
    box.appendChild(div);
  }
}
