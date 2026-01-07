let checkBox;
document.addEventListener("DOMContentLoaded", () => {
  checkBox = document.getElementById("checkLines");
});
/* FAMILY */
const FAMILY = [
  ["11","16","61","66"],
  ["22","27","72","77"],
  ["33","38","83","88"],
  ["44","49","94","99"],
  ["55","00","05","50"]
];
function isFamily(a,b){
  return FAMILY.some(f => f.includes(a) && f.includes(b));
}
/* get clean table data */
function getTableData(){
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  return rows.map((tr,r)=>({
    row:r,
    cells:[...tr.children].slice(1).map((td,c)=>({
      value:td.innerText.trim(),
      td
    }))
  }));
}
/* last 10 valid rows */
function last10Valid(data){
  return data.filter(r =>
    r.cells.every(c => c.value !== "**")
  ).slice(-10);
}
/* MAIN */
function runAnalysis(){
  checkBox.innerHTML = "";
  document.querySelectorAll("td").forEach(td=>{
    td.classList.remove("circle","connect");
  });
  const table = getTableData();
  const last10 = last10Valid(table);

  if(last10.length < 10){
    alert("Not enough valid rows");
    return;
  }
  const patterns = [];
  /* COLUMN */
  for(let c=0;c<6;c++){
    let seq=[];
    for(let i=1;i<last10.length;i++){
      const a = last10[i-1].cells[c].value;
      const b = last10[i].cells[c].value;
      if(isFamily(a,b)) seq.push(last10[i].cells[c]);
    }
    if(seq.length>=2)
      patterns.push({type:"Column", cells:seq});
  }
  /* DIAGONAL */
  for(let c=0;c<5;c++){
    let seq=[];
    for(let i=1;i<last10.length;i++){
      const a = last10[i-1].cells[c].value;
      const b = last10[i].cells[c+1].value;
      if(isFamily(a,b)) seq.push(last10[i].cells[c+1]);
    }
    if(seq.length>=2)
      patterns.push({type:"Diagonal", cells:seq});
  }
  /* ZIG-ZAG */
  for(let c=1;c<5;c++){
    let seq=[];
    for(let i=1;i<last10.length;i++){
      const a = last10[i-1].cells[c].value;
      const b = last10[i].cells[c-1].value;
      if(isFamily(a,b)) seq.push(last10[i].cells[c-1]);
    }
    if(seq.length>=2)
      patterns.push({type:"ZigZag", cells:seq});
  }
  patterns.forEach((p,i)=>addCheckLine(p,i));
}
/* CHECK LINE */
function addCheckLine(pattern,i){
  const div = document.createElement("div");
  div.className="check-line";
  div.innerText=`Pattern ${i+1} (${pattern.type})`;
  div.onclick=()=>toggle(pattern,div);
  checkBox.appendChild(div);
}
/* TOGGLE */
function toggle(pattern,div){
  div.classList.toggle("active");
  pattern.cells.forEach((c,i)=>{
    c.td.classList.toggle("circle");
    if(i>0) c.td.classList.toggle("connect");
  });
}
