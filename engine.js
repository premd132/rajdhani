function clearDraw(){
  document.querySelectorAll("td")
    .forEach(td=>td.classList.remove("circle","line"));
}

// नीचे की rows से strong family चुनो
function pickStrongFamilies(lastRows){
  const count = {};
  lastRows.forEach(r=>{
    r.forEach(v=>{
      const f = getFamily(v);
      if(!f) return;
      count[f] = (count[f]||0)+1;
    });
  });
  // 2+ बार आई family
  return Object.keys(count).filter(f=>count[f]>=2).slice(0,3); // max 2–3
}

// यह तय करता है कि circle लगे या नहीं
function isImportant(prevRow, currRow){
  if(!prevRow) return true;               // पहला हमेशा circle
  if(currRow.row - prevRow.row >= 2) return true; // gap के बाद
  if(currRow.col !== prevRow.col) return true;    // direction बदली
  return false; // लगातार सीधा है तो ignore
}

function runAnalysis(){
  clearDraw();
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  const box = document.getElementById("checkLines");
  box.innerHTML="";

  if(rows.length < 5){
    box.innerHTML="<i>कम से कम 5 rows चाहिए</i>";
    return;
  }

  // नीचे की 5 rows से strong family
  const last5 = rows.slice(-5).map(r=>
    [...r.children].slice(1).map(td=>td.innerText.trim())
  );
  const strongFams = pickStrongFamilies(last5);

  if(!strongFams.length){
    box.innerHTML="<i>No strong family found</i>";
    return;
  }

  const byFamily = {};

  // पूरे रिकॉर्ड में search
  rows.forEach((r,ri)=>{
    [...r.children].slice(1).forEach((td,ci)=>{
      const fam = getFamily(td.innerText.trim());
      if(strongFams.includes(fam)){
        if(!byFamily[fam]) byFamily[fam]=[];
        byFamily[fam].push({row:ri,col:ci+1});
      }
    });
  });

  let id=1;
  Object.keys(byFamily).forEach(fam=>{
    const all = byFamily[fam];
    const important = [];

    // सिर्फ “चुनिंदा” जगह चुनो
    let prev=null;
    all.forEach(p=>{
      if(isImportant(prev,p)){
        important.push(p);
        prev=p;
      }
    });

    const div=document.createElement("div");
    div.className="check-line";
    div.innerText=`Check ${id++} | Family ${fam}`;
    let on=false;
    div.onclick=()=>{
      on=!on;
      clearDraw();
      if(on){
        let prevDraw=null;
        important.forEach(p=>{
          const td = rows[p.row].children[p.col];
          td.classList.add("circle");
          if(prevDraw && 
             (p.col===prevDraw.col || Math.abs(p.col-prevDraw.col)===1)){
            td.classList.add("line");
          }
          prevDraw=p;
        });
      }
    };
    box.appendChild(div);
  });
}
