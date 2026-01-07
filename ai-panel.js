/* =========================
   AI PANEL – FULL WORKING
   ========================= */

// Family groups
const FAMILY = {
  "11": ["11","16","61","66"],
  "22": ["22","27","72","77"],
  "33": ["33","38","83","88"],
  "44": ["44","49","94","99"],
  "55": ["55","00","05","50"]
};

// ---------- helpers ----------
function normalize(val){
  if(!val || val === "**") return null;
  val = val.toString().trim();
  if(val.length === 1) return "0"+val;
  return val;
}

function getFamily(num){
  for(const k in FAMILY){
    if(FAMILY[k].includes(num)) return k;
  }
  return null;
}

// ---------- prediction strength ----------
function calculatePrediction(patternRows){
  if(!patternRows || patternRows.length === 0) return 0;

  let strength = patternRows.length * 8;

  if(patternRows.length >= 5) strength += 20;
  if(patternRows.length >= 8) strength += 25;

  return Math.min(strength, 95);
}

// ---------- next week guess ----------
function nextWeekGuess(patternRows){
  const freq = {};

  patternRows.forEach(row=>{
    row.forEach(v=>{
      const n = normalize(v);
      if(!n) return;
      const fam = getFamily(n);
      if(!fam) return;
      freq[fam] = (freq[fam] || 0) + 1;
    });
  });

  let best = null;
  let max = 0;
  for(const k in freq){
    if(freq[k] > max){
      max = freq[k];
      best = k;
    }
  }

  return best ? `Family ${best}` : "No strong family";
}

// ---------- render AI panel ----------
function renderAI(patternRows){
  const panel = document.getElementById("aiPanel");
  if(!panel) return;

  const percent = calculatePrediction(patternRows);
  const guess = nextWeekGuess(patternRows);

  panel.innerHTML = `
    <div style="
      border:2px solid #4caf50;
      background:#e8ffe8;
      padding:10px;
      margin-top:10px;
      border-radius:6px;
    ">
      <b>Prediction Strength:</b> ${percent}%<br>
      <b>Next Week Guess:</b> ${guess}<br>
      <small>
        AI prediction based on last 10-row pattern,
        family frequency & repetition logic.
      </small>
    </div>
  `;
}

// ---------- GLOBAL (used by analysis.js) ----------
window.renderAI = renderAI;
