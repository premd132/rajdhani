function toggle(id){
  const list=ACTIVE[id];
  const rows=[...document.querySelectorAll("#recordTable tbody tr")];
  let on=rows[list[0][0]].children[list[0][1]].classList.contains("circle");

  list.forEach(([r,c],i)=>{
    const td=rows[r].children[c];
    if(on){
      td.classList.remove("circle","line");
    }else{
      td.classList.add("circle");
      if(i>0) td.classList.add("line");
    }
  });
}

function clearAll(){
  document.querySelectorAll("td").forEach(td=>{
    td.classList.remove("circle","line");
  });
}
