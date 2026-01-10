const tbody=document.querySelector("#recordTable tbody");

/* ---------- FAMILY ---------- */
function normalize(v){
 if(!v||v=="**") return null;
 return v.toString().padStart(2,"0");
}
function getFamily(v){
 if(!v) return null;
 const f={
 "0":["00","05","50","55"],
 "1":["11","16","61","66"],
 "2":["22","27","72","77"],
 "3":["33","38","83","88"],
 "4":["44","49","94","99"]
 };
 return f[v[0]]||[v];
}

/* ---------- CSV LOAD ---------- */
document.getElementById("csvFile").addEventListener("change",e=>{
 const f=e.target.files[0]; if(!f) return;
 const r=new FileReader();
 r.onload=()=>{
  tbody.innerHTML="";
  r.result.split(/\r?\n/).forEach((l,i)=>{
   if(!l.trim()) return;
   const c=l.split(",");
   const tr=document.createElement("tr");
   tr.innerHTML=`<td>W${i+1}</td>`+c.map(v=>`<td>${normalize(v)||""}</td>`).join("");
   tbody.appendChild(tr);
  });
 };
 r.readAsText(f);
});

/* ---------- EDIT + SAVE ---------- */
function enableEdit(){
 document.querySelectorAll("#recordTable td").forEach((td,i)=>{
  if(i%7!=0){ td.contentEditable=true; td.classList.add("editable"); }
 });
}
function saveData(){
 const data=[];
 document.querySelectorAll("#recordTable tbody tr").forEach(tr=>{
  data.push([...tr.children].slice(1).map(td=>td.innerText.trim()));
 });
 localStorage.setItem("record",JSON.stringify(data));
 alert("Saved");
}
(function load(){
 const d=JSON.parse(localStorage.getItem("record")||"null");
 if(!d) return;
 tbody.innerHTML="";
 d.forEach((row,i)=>{
  const tr=document.createElement("tr");
  tr.innerHTML=`<td>W${i+1}</td>`+row.map(v=>`<td>${v}</td>`).join("");
  tbody.appendChild(tr);
 });
})();

/* ---------- DRAW ---------- */
function clearDraw(){
 document.querySelectorAll("#recordTable td")
 .forEach(td=>td.classList.remove("circle","line"));
}
function draw(match){
 clearDraw();
 match.forEach((s,i)=>{
  const td=tbody.children[s.row].children[s.col];
  td.classList.add("circle");
  if(i>0) td.classList.add("line");
 });
}

/* ---------- ENGINE ---------- */
function runEngine(){
 clearDraw();
 const rows=[...tbody.children];
 if(rows.length<6){ alert("Minimum 6 rows"); return; }

 const last=rows.slice(-6);
 const templates=[];

 for(let col=1;col<=6;col++){
  const famSeq=[];
  last.forEach((r,i)=>{
   const v=normalize(r.children[col].innerText);
   famSeq.push({fam:getFamily(v),row:i,col});
  });
  templates.push(famSeq);
 }

 const results=[];
 templates.forEach((tpl,tIndex)=>{
  for(let r=0;r<=rows.length-6;r++){
   let ok=true,found=[];
   for(let i=0;i<6;i++){
    const td=rows[r+i].children[tpl[i].col];
    const fam=getFamily(normalize(td.innerText));
    if(!fam||!tpl[i].fam.some(x=>fam.includes(x))) ok=false;
    else found.push({row:r+i,col:tpl[i].col});
   }
   if(ok) results.push({name:`Pattern ${results.length+1} | Column ${tpl[0].col}`,found});
  }
 });

 const box=document.getElementById("checkLines");
 box.innerHTML="";
 if(!results.length){ box.innerHTML="<i>No family pattern found</i>"; return; }

 results.forEach(r=>{
  const d=document.createElement("div");
  d.className="check-line";
  d.innerText=r.name;
  d.onclick=()=>{
   const a=d.classList.toggle("active");
   if(a) draw(r.found); else clearDraw();
  };
  box.appendChild(d);
 });
}
