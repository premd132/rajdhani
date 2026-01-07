const tbody = document.querySelector("#recordTable tbody");

document.getElementById("csvFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    tbody.innerHTML = "";
    reader.result.split(/\r?\n/).forEach((line,i)=>{
      if(!line.trim()) return;
      const cols=line.split(",");
      const tr=document.createElement("tr");
      tr.innerHTML="<td>W"+(i+1)+"</td>"+
        cols.map(v=>`<td>${normalize(v.trim())||"**"}</td>`).join("");
      tbody.appendChild(tr);
    });
  };
  reader.readAsText(file);
});

function enableEdit(){
  document.querySelectorAll("#recordTable td")
    .forEach((td,i)=>{
      if(i%7!==0){ td.contentEditable=true; td.classList.add("editable"); }
    });
}

function saveData(){
  const data=[];
  document.querySelectorAll("#recordTable tbody tr").forEach(tr=>{
    data.push([...tr.children].slice(1).map(td=>td.innerText.trim()));
  });
  localStorage.setItem("record",JSON.stringify(data));
  alert("Saved");
}

(function load(){
  const saved=JSON.parse(localStorage.getItem("record")||"null");
  if(!saved) return;
  tbody.innerHTML="";
  saved.forEach((row,i)=>{
    const tr=document.createElement("tr");
    tr.innerHTML="<td>W"+(i+1)+"</td>"+row.map(v=>`<td>${v}</td>`).join("");
    tbody.appendChild(tr);
  });
})();
