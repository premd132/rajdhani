console.log("FINAL analysis.js loaded");

const FAMILIES = [
  ["11","16","61","66"],
  ["22","27","72","77"],
  ["33","38","83","88"],
  ["44","49","94","99"],
  ["55","00","05","50"]
];

function getFamily(num){
  if(!num || num==="**") return null;
  num = num.toString().padStart(2,"0");
  return FAMILIES.find(f=>f.includes(num)) || null;
}

function runAnalysis(){
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const checkLines = document.getElementById("checkLines");
  checkLines.innerHTML = "";

  // clear old marks
  document.querySelectorAll("td").forEach(td=>{
    td.classList.remove("circle","connect-top");
  });

  if(rows.length < 11){
    alert("At least 11 rows needed");
    return;
  }

  const last10 = rows.slice(-10);

  // build pattern (Mon column only for now – stable base)
  const basePattern = last10.map(r=>{
    const td = r.children[1];
    return getFamily(td.innerText.trim());
  });

  rows.forEach((row,rowIndex)=>{
    if(rowIndex > rows.length-11) return;

    let match = true;
    for(let i=0;i<10;i++){
      const td = rows[rowIndex+i].children[1];
      const fam = getFamily(td.innerText.trim());
      if(!fam || fam !== basePattern[i]){
        match = false;
        break;
      }
    }

    if(match){
      createCheckLine(rowIndex, basePattern);
    }
  });
}

function createCheckLine(startIndex, pattern){
  const div = document.createElement("div");
  div.className = "check-line";
  div.innerText = "PATTERN @ W" + (startIndex+1);

  let active = false;

  div.onclick = ()=>{
    active = !active;

    // clear all first
    document.querySelectorAll("td").forEach(td=>{
      td.classList.remove("circle","connect-top");
    });

    if(!active) return;

    for(let i=0;i<10;i++){
      const td = document.querySelectorAll("#recordTable tbody tr")[startIndex+i].children[1];
      td.classList.add("circle");
      if(i>0) td.classList.add("connect-top");
    }
  };

  document.getElementById("checkLines").appendChild(div);
}

window.runAnalysis = runAnalysis;
