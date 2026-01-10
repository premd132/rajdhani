function clearDraw(){
  document.querySelectorAll("td").forEach(td=>{
    td.classList.remove("circle","line");
  });
}

function runAnalysis(){
  clearDraw();
  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  const resultBox=document.getElementById("checkLines");
  resultBox.innerHTML="";

  if(rows.length<6) return;

  let patterns=[];

  for(let col=1; col<=6; col++){
  let famSeq = rows.map(r=>getFamily(r.children[col].innerText.trim()));

  let foundAny = false;

  for(let i=0;i<famSeq.length-4;i++){
    let base = famSeq.slice(i,i+4);
    if(base.includes(null)) continue;

    for(let j=i+4;j<famSeq.length-4;j++){
      let test = famSeq.slice(j,j+4);
      if(test.includes(null)) continue;

      let same = base.every((v,k)=>v===test[k]);
      let reverse = base.every((v,k)=>v===test[3-k]);

      if(same || reverse){
        foundAny = true;
        patterns.push({
          col,
          matches:[
            base.map((_,k)=>({row:i+k,col})),
            test.map((_,k)=>({row:j+k,col}))
          ]
        });
      }
    }
  }

  // Agar is column me kuch bhi real match nahi mila, to skip
  if(!foundAny){
    patterns = patterns.filter(p=>p.col!==col);
  }
  }

    let matches=[];
    for(let i=0;i<=rows.length-6;i++){
      let ok=true;
      let found=[];
      for(let j=0;j<6;j++){
        let f=getFamily(rows[i+j].children[col].innerText.trim());
        if(f!==last6[j]){ ok=false; break;}
        found.push({row:i+j,col});
      }
      if(ok) matches.push(found);
    }
    if(matches.length) patterns.push({col,matches});
  }

  if(!patterns.length){
    resultBox.innerHTML="<i>No family pattern found</i>";
    return;
  }

  patterns.forEach((p,pi)=>{
    p.matches.forEach((m,mi)=>{
      const div=document.createElement("div");
      div.className="check-line";
      div.innerText=`Pattern ${pi+1}.${mi+1} | Column ${p.col}`;
      div.onclick=()=>drawMatch(m);
      resultBox.appendChild(div);
    });
  });
}

function drawMatch(match){
  clearDraw();
  match.forEach((step,i)=>{
    const td=document.querySelectorAll("#recordTable tbody tr")[step.row]
      .children[step.col];
    td.classList.add("circle");
    if(i>0) td.classList.add("line");
  });
}
