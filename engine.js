function clearDraw(){
  document.querySelectorAll("td")
    .forEach(td=>td.classList.remove("circle","line"));
}

function runAnalysis(){
  clearDraw();
  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  const last3=rows.slice(-3);
  const box=document.getElementById("checkLines");
  box.innerHTML="";

  let foundAny=false;

  for(let col=0;col<6;col++){
    const fams=last3.map(r=>getFamily(r.children[col].innerText.trim()));
    if(fams.every(f=>f && f===fams[0])){
      foundAny=true;
      const div=document.createElement("div");
      div.className="check-line";
      div.innerText=`Family Pattern | Column ${col+1}`;
      div.onclick=()=>{
        div.classList.toggle("active");
        clearDraw();
        last3.forEach((r,i)=>{
          const td=r.children[col];
          td.classList.add("circle");
          if(i>0) td.classList.add("line");
        });
      };
      box.appendChild(div);
    }
  }

  if(!foundAny) box.innerHTML="<i>No family pattern found</i>";
}
