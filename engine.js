function clearDraw(){
  document.querySelectorAll("td")
    .forEach(td=>td.classList.remove("circle","line"));
}

// नीचे की rows से strong family निकालो
function getStrongFamilies(rows){
  const count = {};
  rows.forEach(r=>{
    r.forEach(v=>{
      const f = getFamily(v);
      if(!f) return;
      count[f] = (count[f]||0)+1;
    });
  });
  return Object.keys(count).filter(f=>count[f]>=2); // 2+ बार आई हो
}

function runAnalysis(){
  clearDraw();
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const box = document.getElementById("checkLines");
  box.innerHTML = "";

  if(rows.length < 5){
    box.innerHTML = "<i>कम से कम 5 rows चाहिए</i>";
    return;
  }

  // नीचे की 5 rows से strong family
  const last5 = rows.slice(-5).map(r=>
    [...r.children].slice(1).map(td=>td.innerText.trim())
  );
  const strongFams = getStrongFamilies(last5);

  if(!strongFams.length){
    box.innerHTML = "<i>No strong family in bottom rows</i>";
    return;
  }

  const matchesByFamily = {};

  // पूरे रिकॉर्ड में search
  rows.forEach((r,ri)=>{
    [...r.children].slice(1).forEach((td,ci)=>{
      const fam = getFamily(td.innerText.trim());
      if(strongFams.includes(fam)){
        if(!matchesByFamily[fam]) matchesByFamily[fam] = [];
        matchesByFamily[fam].push({row:ri,col:ci+1});
      }
    });
  });

  let id=1;
  Object.keys(matchesByFamily).forEach(fam=>{
    const list = matchesByFamily[fam];
    const div = document.createElement("div");
    div.className = "check-line";
    div.innerText = `Check ${id++} | Family ${fam}`;
    let on=false;
    div.onclick = ()=>{
      on=!on;
      clearDraw();
      if(on){
        let prev=null;
        list.forEach(p=>{
          const td = rows[p.row].children[p.col];
          td.classList.add("circle");
          if(prev && (p.col===prev.col || Math.abs(p.col-prev.col)===1)){
            td.classList.add("line"); // flow मिला तो line
          }
          prev = p;
        });
      }
    };
    box.appendChild(div);
  });
}
