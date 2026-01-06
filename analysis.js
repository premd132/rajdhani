<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Mon–Sat Record Pattern Analyzer</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
body { font-family: Arial, sans-serif; padding:10px; background:#f4f4f4; }
h2,h3 { text-align:center; }
.controls,.paste-box { text-align:center; margin-bottom:10px; }
button { padding:6px 12px; margin:4px; }

#pasteArea {
  width:100%; max-width:520px;
  padding:8px; font-size:14px;
}

.table-wrap { position:relative; overflow:auto; }
table { width:100%; border-collapse:collapse; background:#fff; }
th,td { border:1px solid #ccc; padding:6px; text-align:center; position:relative; }
td.editable { background:#eef; }

.circle { border:3px solid red; border-radius:50%; font-weight:bold; }
.circle.family { border-color:orange; }
.circle.niche { border-color:blue; }

#lineLayer {
  position:absolute; top:0; left:0;
  width:100%; height:100%;
  pointer-events:none;
}

.check-line {
  margin:6px 0; padding:6px;
  background:#eaffea;
  border-left:5px solid green;
  font-size:14px;
}

.note { font-size:12px; text-align:center; color:#555; margin-top:12px; }
</style>
</head>

<body>

<h2>Mon–Sat Record Pattern Analysis (1 Row = 1 Week)</h2>

<div class="controls">
  <button onclick="enableEdit()">Edit</button>
  <button onclick="saveData()">Save</button>
  <button onclick="runAnalysis()">Run Analysis</button>
</div>

<div class="paste-box">
  <textarea id="pasteArea" rows="6"
    placeholder="Yahan poora record paste karo (har line = 1 week, Mon–Sat)">
  </textarea><br>
  <button onclick="pasteRecord()">Paste Record</button>
</div>

<div class="paste-box">
  <input type="file" id="csvFile" accept=".csv,text/csv">
  <button onclick="importCSV()">Import CSV</button>
</div>

<div class="table-wrap">
  <svg id="lineLayer"></svg>
  <table id="recordTable">
    <thead>
      <tr>
        <th>Week</th>
        <th>Mon</th><th>Tue</th><th>Wed</th>
        <th>Thu</th><th>Fri</th><th>Sat</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</div>

<h3>✔ Check Lines</h3>
<div id="checkLines"></div>

<p class="note">
This tool is for historical record analysis only. No prediction.
</p>

<script>
/* ================= TABLE + STORAGE ================= */
const TOTAL_WEEKS = 300;
const tableBody = document.querySelector("#recordTable tbody");

function loadData(){
  const saved = JSON.parse(localStorage.getItem("recordData"));
  tableBody.innerHTML="";
  if(!saved){
    for(let i=0;i<TOTAL_WEEKS;i++) addRow(["","","","","",""],i+1);
  } else {
    saved.forEach((r,i)=>addRow(r,i+1));
    for(let i=saved.length;i<TOTAL_WEEKS;i++)
      addRow(["","","","","",""],i+1);
  }
}

function addRow(values,week){
  const tr=document.createElement("tr");
  tr.innerHTML=`<td>W${week}</td>`+
    values.map(v=>`<td contenteditable="false">${v||""}</td>`).join("");
  tableBody.appendChild(tr);
}

function enableEdit(){
  tableBody.querySelectorAll("td").forEach((td,i)=>{
    if(i%7!==0){ td.contentEditable=true; td.classList.add("editable"); }
  });
}

function saveData(){
  const data=[];
  tableBody.querySelectorAll("tr").forEach(tr=>{
    const cells=[...tr.querySelectorAll("td")].slice(1);
    data.push(cells.map(td=>td.innerText.trim()));
  });
  localStorage.setItem("recordData",JSON.stringify(data));
  alert("Data Saved");
}

loadData();

/* ================= ANALYSIS (SAME LOGIC) ================= */
function runAnalysis(){
  clearAll();
  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  const history=[];

  rows.forEach((tr,w)=>{
    [...tr.querySelectorAll("td")].slice(1).forEach(td=>{
      const v=td.innerText.trim();
      if(v) history.push({jodi:v,week:w,cell:td});
    });
  });

  const lastSeen={};
  history.forEach(h=>lastSeen[h.jodi]=h.week);
  const cur=rows.length-1;

  const niche=Object.keys(lastSeen).filter(j=>cur-lastSeen[j]>=6);

  niche.forEach(j=>{
    const seq=history.filter(h=>h.jodi===j);
    if(seq.length<2) return;

    seq.forEach((h,i)=>{
      h.cell.classList.add("circle","niche");
      if(i>0) drawLine(seq[i-1].cell,h.cell);
    });

    addCheckLine("FULL PATTERN MATCH: "+j);
  });
}

/* ================= SVG LINE ================= */
function drawLine(c1,c2){
  const svg=document.getElementById("lineLayer");
  const r1=c1.getBoundingClientRect();
  const r2=c2.getBoundingClientRect();
  const sr=svg.getBoundingClientRect();

  const x1=r1.left+r1.width/2-sr.left;
  const y1=r1.top+r1.height/2-sr.top;
  const x2=r2.left+r2.width/2-sr.left;
  const y2=r2.top+r2.height/2-sr.top;

  const l=document.createElementNS("http://www.w3.org/2000/svg","line");
  l.setAttribute("x1",x1);
  l.setAttribute("y1",y1);
  l.setAttribute("x2",x2);
  l.setAttribute("y2",y2);
  l.setAttribute("stroke","red");
  l.setAttribute("stroke-width","2");
  svg.appendChild(l);
}

function addCheckLine(t){
  const d=document.createElement("div");
  d.className="check-line";
  d.innerText=t;
  document.getElementById("checkLines").appendChild(d);
}

function clearAll(){
  document.querySelectorAll(".circle").forEach(c=>c.className="");
  document.getElementById("checkLines").innerHTML="";
  document.getElementById("lineLayer").innerHTML="";
}

/* ================= DIRECT PASTE ================= */
function pasteRecord(){
  const text=document.getElementById("pasteArea").value.trim();
  if(!text) return;

  const lines=text.split(/\n+/);
  const rows=document.querySelectorAll("#recordTable tbody tr");

  lines.forEach((line,i)=>{
    if(!rows[i]) return;
    let v=line.replace(/\*/g,"00").split(/\s+|,/)
      .map(x=>x.padStart(2,"0"));
    const cells=rows[i].querySelectorAll("td");
    for(let d=0;d<6;d++) cells[d+1].innerText=v[d]||"";
  });

  alert("Record pasted. Ab Save dabao.");
}

/* ================= CSV IMPORT (100% WORKING) ================= */
function importCSV(){
  const file=document.getElementById("csvFile").files[0];
  if(!file){ alert("CSV file select karo"); return; }

  const reader=new FileReader();
  reader.onload=function(){
    let text=reader.result||"";
    text=text.replace(/^\uFEFF/,"").replace(/\r/g,"").trim();
    let lines=text.split("\n");

    if(lines[0].toLowerCase().includes("mon")) lines.shift();
    lines=lines.filter(l=>l.trim()!=="");

    document.getElementById("pasteArea").value=lines.join("\n");
    pasteRecord();
  };
  reader.readAsBinaryString(file);
}
</script>

</body>
</html>
