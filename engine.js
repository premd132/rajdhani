function clearDraw(){
  document.querySelectorAll("td")
    .forEach(td=>td.classList.remove("circle","line"));
}

function runAnalysis(){
  clearDraw();
  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  const box=document.getElementById("checkLines");
  box.innerHTML="";

  if(rows.length<2){
    box.innerHTML="<i>Data kam hai</i>";
    return;
  }

  let allMatches=[];
  let id=1;

  // 2,3,4,5 rows ke pattern
  [2,3,4,5].forEach(size=>{
    if(rows.length<size) return;

    const baseRows = rows.slice(-size);

    // har column ke liye
    for(let col=1; col<=6; col++){
      const baseFam = baseRows.map(r =>
        getFamily(r.children[col].innerText.trim())
      );
      if(baseFam.includes(null)) return;

      // poore record me search
      for(let r=0; r<=rows.length-size; r++){
        let ok=true;
        let steps=[];
        for(let i=0;i<size;i++){
          const fam = getFamily(rows[r+i].children[col].innerText.trim());
          if(fam!==baseFam[i]){
            ok=false; break;
          }
          steps.push({row:r+i,col});
        }
        if(ok){
          allMatches.push({
            id:id++,
            col,
            size,
            steps
          });
        }
      }
    }
  });

  if(!allMatches.length){
    box.innerHTML="<i>No pattern found</i>";
    return;
  }

  // Check Lines बनाओ
  allMatches.forEach(m=>{
    const d=document.createElement("div");
    d.className="check-line";
    d.innerText=`Check ${m.id} | Col ${m.col} | ${m.size} Row Pattern`;
    let on=false;
    d.onclick=()=>{
      on=!on;
      clearDraw();
      if(on){
        m.steps.forEach((s,i)=>{
          const td=rows[s.row].children[s.col];
          td.classList.add("circle");
          if(i>0) td.classList.add("line");
        });
      }
    };
    box.appendChild(d);
  });
}
