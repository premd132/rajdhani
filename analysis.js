function clearMarks(){
  document.querySelectorAll(".circle,.connect-top")
    .forEach(el=>{
      el.classList.remove("circle","connect-top");
    });
}

function markPattern(rows,col,start){
  clearMarks();
  let prev=null;

  for(let i=0;i<10;i++){
    const td = rows[start+i].children[col];
    td.classList.add("circle");
    if(prev) td.classList.add("connect-top");
    prev=td;
  }
}

function runAnalysis(){
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const out = document.getElementById("checkLines");
  out.innerHTML="";

  if(rows.length<10) return;

  for(let col=1;col<=6;col++){
    for(let i=0;i<=rows.length-10;i++){
      const div=document.createElement("div");
      div.className="check-line";
      div.textContent=`Pattern found → Col ${col} Rows ${i+1}-${i+10}`;
      div.onclick=()=>markPattern(rows,col,i);
      out.appendChild(div);
    }
  }
}
