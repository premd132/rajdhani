function normalize(v){
  if(!v || v==="**") return null;
  v=v.toString().trim();
  if(v.length===1) return "0"+v;
  return v;
}

const FAMILY=[
 ["11","16","61","66"],
 ["22","27","72","77"],
 ["33","38","83","88"],
 ["44","49","94","99"],
 ["55","00","05","50"]
];

function sameFamily(a,b){
  if(!a||!b) return false;
  return FAMILY.some(f=>f.includes(a)&&f.includes(b));
}
