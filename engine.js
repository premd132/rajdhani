function clearDrawing(){
  document.querySelectorAll("#recordTable td")
    .forEach(td=>td.classList.remove("circle","v-line"));
}

function getLastValidRows(count){
  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  return rows.filter(r=>{
    return [...r.children].slice(1).some(td=>td.innerText.trim() && td.innerText!=="**");
  }).slice(-count);
}

function runStep4(){
  clearDrawing();
  const out=document.getElementById("checkLines");
  out.innerHTML="";

  const allRows=[...document.querySelectorAll("#recordTable tbody tr")];
  const baseRows=getLastValidRows(6);

  if(baseRows.length<6){
    out.innerHTML="<i>Not enough data</i>";
    return;
  }

  let patternId=1;

  for(let col=1;col<=6;col++){
    // 🔹 Build family template from bottom
    const template=[];
    baseRows.forEach(r=>{
      const v=r.children[col]?.innerText.trim();
      const fam=getFamily(v);
      if(fam) template.push(fam.join("-"));
    });

    if(template.length<4) continue;

    // 🔹 Scan full record
    for(let r=0;r<=allRows.length-template.length;r++){
      let found=[];
      let ok=true;

      for(let i=0;i<template.length;i++){
        const td=allRows[r+i]?.children[col];
        if(!td) { ok=false; break; }

        const fam=getFamily(td.innerText.trim());
        if(!fam || fam.join("-")!==template[i]){
          ok=false; break;
        }
        found.push({row:r+i,col});
      }

      if(ok){
        const div=document.createElement("div");
        div.className="check-line";
        div.innerText=`Pattern ${patternId++} | Column ${col}`;
        div.onclick=()=>{
          clearDrawing();
          found.forEach((p,i)=>{
            const td=allRows[p.row].children[p.col];
            td.classList.add("circle");
            if(i>0) td.classList.add("v-line");
          });
        };
        out.appendChild(div);
      }
    }
  }

  if(!out.innerHTML){
    out.innerHTML="<i>No family pattern found</i>";
  }
}
