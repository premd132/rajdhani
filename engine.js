const tbody = document.querySelector("#recordTable tbody");

document.getElementById("csvFile").addEventListener("change", e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    tbody.innerHTML="";
    const lines = reader.result.trim().split(/\r?\n/);
    lines.forEach((line,i)=>{
      const cols=line.split(",");
      const tr=document.createElement("tr");
      tr.innerHTML=`<td>W${i+1}</td>`+
        cols.map(v=>`<td>${norm(v)||""}</td>`).join("");
      tbody.appendChild(tr);
    });
  };
  reader.readAsText(file);
});

function clearDraw(){
  document.querySelectorAll("td").forEach(td=>{
    td.classList.remove("circle","line");
  });
}

function runAnalysis(){
  clearDraw();
  const rows=[...tbody.querySelectorAll("tr")];
  if(rows.length<6) return alert("कम से कम 6 rows चाहिए");

  const last6 = rows.slice(-6);
  const patterns=[];

  // सिर्फ Column pattern (पहला version)
  for(let c=1;c<=6;c++){
    let famSeq=[];
    last6.forEach(r=>{
      famSeq.push(getFamily(r.children[c].innerText));
    });
    patterns.push({col:c, seq:famSeq});
  }

  const results=[];
  patterns.forEach(p=>{
    for(let r=0;r<=rows.length-6;r++){
      let ok=true, steps=[];
      for(let i=0;i<6;i++){
        const td=rows[r+i].children[p.col];
        if(getFamily(td.innerText)!==p.seq[i]){ok=false;break;}
        steps.push({row:r+i,col:p.col});
      }
      if(ok) results.push({col:p.col,steps});
    }
  });

  const box=document.getElementById("checkLines");
  box.innerHTML="";
  if(!results.length){ box.innerHTML="<i>No pattern found</i>"; return;}

  results.forEach((res,i)=>{
    const div=document.createElement("div");
    div.className="check-line";
    div.innerText=`Pattern ${i+1} | Column ${res.col}`;
    let on=false;
    div.onclick=()=>{
      on=!on;
      clearDraw();
      if(on){
        div.classList.add("active");
        res.steps.forEach((s,j)=>{
          const td=rows[s.row].children[s.col];
          td.classList.add("circle");
          if(j>0) td.classList.add("line");
        });
      }else{
        div.classList.remove("active");
      }
    };
    box.appendChild(div);
  });
}
