function clearMarks(){
  document.querySelectorAll("td").forEach(td=>{
    td.classList.remove("circle");
  });
  document.getElementById("checkLines").innerHTML="";
}

function runAnalysis(){
  clearMarks();
  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  if(rows.length<5){ alert("कम से कम 5 row चाहिए"); return; }

  const bottom = rows.slice(-4); // sirf niche ke 4 row
  let foundPatterns=[];

  for(let col=1;col<=6;col++){
    let fams = bottom.map(r=>{
      const v=r.children[col].innerText.trim();
      return getFamily(v);
    });

    let count={};
    fams.forEach(f=>{ if(f) count[f]=(count[f]||0)+1; });

    for(let f in count){
      if(count[f]>=2){
        // niche circle
        bottom.forEach(r=>{
          const td=r.children[col];
          if(getFamily(td.innerText.trim())===f){
            td.classList.add("circle");
          }
        });
        foundPatterns.push({col,f});
      }
    }
  }

  // upar same family search
  foundPatterns.forEach(p=>{
    rows.forEach(r=>{
      const td=r.children[p.col];
      if(getFamily(td.innerText.trim())===p.f){
        td.classList.add("circle");
      }
    });
  });

  // check lines
  const box=document.getElementById("checkLines");
  if(!foundPatterns.length){
    box.innerHTML="<i>No family repeat in last 4 rows</i>";
    return;
  }
  foundPatterns.forEach((p,i)=>{
    const d=document.createElement("div");
    d.className="check-line";
    d.innerText=`Check ${i+1} | Column ${p.col} | Family ${p.f}`;
    box.appendChild(d);
  });
}
