const families={
"1":["01","11","16","61","66"],
"2":["02","22","27","72","77"],
"3":["03","33","38","83","88"],
"4":["04","44","49","94","99"],
"5":["05","55","50","00"]
};

function familyOf(v){
  for(let k in families) if(families[k].includes(v)) return k;
  return null;
}

let ACTIVE={};

function runAnalysis(){
  clearAll();
  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  if(rows.length<10){ alert("Min 10 rows"); return; }

  const last10=rows.slice(-10);
  const out=document.getElementById("checkLines");
  out.innerHTML="";
  ACTIVE={};

  for(let c=1;c<=6;c++){
    const base=normalize(last10[0].children[c].innerText);
    if(!base) continue;
    const fam=familyOf(base);
    if(!fam) continue;

    const id=`col-${c}`;
    ACTIVE[id]=[];

    rows.forEach((r,i)=>{
      const v=normalize(r.children[c].innerText);
      if(v && familyOf(v)===fam){
        ACTIVE[id].push([i,c]);
      }
    });

    const div=document.createElement("div");
    div.className="check-line";
    div.innerText=`Pattern Column ${c}`;
    div.onclick=()=>toggle(id);
    out.appendChild(div);
  }

  renderAI(ACTIVE);
}
