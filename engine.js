function clearDrawing(){
  document.querySelectorAll("#recordTable td")
    .forEach(td=>td.classList.remove("circle","v-line"));
}

function runStep4(){
  clearDrawing();
  const box=document.getElementById("checkLines");
  box.innerHTML="";

  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  if(rows.length<7){
    box.innerHTML="<i>Minimum 7 rows required</i>";
    return;
  }

  const last=rows.slice(-7);
  let patternId=1;

  for(let col=1;col<=6;col++){
    const famSeq=last.map(r=>getFamily(r.children[col]?.innerText.trim()));
    if(famSeq.some(f=>!f)) continue;

    const matches=[];
    for(let r=0;r<=rows.length-7;r++){
      let ok=true,found=[];
      for(let i=0;i<7;i++){
        const td=rows[r+i]?.children[col];
        if(!td || getFamily(td.innerText.trim())!==famSeq[i]) ok=false;
        else found.push({row:r+i,col});
      }
      if(ok) matches.push(found);
    }

    matches.forEach((m,i)=>{
      const d=document.createElement("div");
      d.className="check-line";
      d.innerText=`Pattern ${patternId++} | Column ${col}`;
      d.onclick=()=>{
        clearDrawing();
        m.forEach((p,i)=>{
          const td=rows[p.row].children[p.col];
          td.classList.add("circle");
          if(i>0) td.classList.add("v-line");
        });
      };
      box.appendChild(d);
    });
  }

  if(!box.innerHTML) box.innerHTML="<i>No family pattern found</i>";
}
