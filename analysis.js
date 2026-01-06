const tbody = document.querySelector("#recordTable tbody");
const checkLinesBox = document.getElementById("checkLines");

const FAMILY = [
  ["11","16","61","66"],
  ["22","27","72","77"],
  ["33","38","83","88"],
  ["44","49","94","99"],
  ["55","00","05","50"]
];

function familyOf(v){
  return FAMILY.find(f => f.includes(v)) || null;
}

function runAnalysis(){
  checkLinesBox.innerHTML="";
  clearVisuals();

  const rows = [...tbody.querySelectorAll("tr")];
  if (rows.length < 10){
    alert("At least 10 rows required");
    return;
  }

  // 🔹 LAST 10 ROWS → BASE PATTERN
  const last10 = rows.slice(-10);

  for (let col = 0; col < 6; col++){
    const baseFamilies = last10.map((tr,i)=>{
      const td = tr.children[col+1];
      return familyOf(td?.innerText.trim());
    });

    if (baseFamilies.includes(null)) continue;

    // 🔍 SEARCH FULL RECORD
    for (let r = 0; r <= rows.length - 10; r++){
      let cells = [];
      let valid = true;

      for (let i = 0; i < 10; i++){
        const zigzagCol =
          i % 2 === 0 ? col : Math.min(col + 1, 5);

        const td = rows[r+i]?.children[zigzagCol+1];
        if (!td) { valid=false; break; }

        const val = td.innerText.trim();
      const fam = familyOf(val);
if (!fam || fam !== baseFamilies[i]) {
  valid = false;
  break;
}
        }

        cells.push(td);
      }

      if (valid){
        addCheckLine(cells, col);
      }
    }
  }
}

function addCheckLine(cells, col){
  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = `PATTERN FOUND | Column ${["Mon","Tue","Wed","Thu","Fri","Sat"][col]}`;

  let active = false;

  div.onclick = () => {
    if (active){
      clearVisuals();
      active = false;
    } else {
      clearVisuals();
      cells.forEach((td,i)=>{
        td.classList.add("circle");
        if (i > 0) td.classList.add("connect-top");
      });
      active = true;
    }
  };

  checkLinesBox.appendChild(div);
}

function clearVisuals(){
  document
    .querySelectorAll(".circle,.connect-top")
    .forEach(el=>{
      el.classList.remove("circle","connect-top");
    });
}
