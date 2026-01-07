function renderAI(pattern, rows){
  const panel = document.getElementById("aiPanel");
  panel.innerHTML = "";

  const percent = calculatePrediction(pattern, rows);
  const guess = nextWeekGuess(pattern, rows);

  panel.innerHTML = `
    <div style="border:1px solid #ccc;padding:10px;margin:5px 0">
      <b>Prediction Strength:</b> ${percent}%<br>
      <b>Next Week Family Guess:</b> ${guess.join(", ") || "No data"}<br>
      <small>*AI is pattern & probability based, not guarantee*</small>
    </div>
  `;
}
