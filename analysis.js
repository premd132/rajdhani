function runAnalysis(){
  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  const out=document.getElementById("checkLines");
  out.innerHTML="";

  if(rows.length<10){
    alert("Minimum 10 rows required");
    return;
  }

  const last10 = rows.slice(-10);

  for(let col=1; col<=6; col++){
    let family=null;
    let ok=true;

    last10.forEach(r=>{
      const v=r.children[col].innerText;
      if(!v){ ok=false; }
      else if(!family) family=v[0];
      else if(v[0]!==family) ok=false;
    });

    if(ok){
      const div=document.createElement("div");
      div.className="check-line";
      div.innerText=`Column ${col} – Family ${family}`;
      div.onclick=()=>{
        last10.forEach(r=>{
          const td=r.children[col];
          td.classList.toggle("circle");
        });
      };
      out.appendChild(div);
    }
  }
}
