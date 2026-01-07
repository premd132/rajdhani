function normalize(v){
  if(!v || v==="**") return null;
  return v.toString().padStart(2,"0");
}

function getFamily(v){
  v = normalize(v);
  if(!v) return null;

  const families = {
    "0": ["00","05","50","55"],
    "1": ["01","06","10","15","51","56"],
    "2": ["02","07","20","25","52","57"],
    "3": ["03","08","30","35","53","58"],
    "4": ["04","09","40","45","54","59"],
    "5": ["11","16","61","66"],
    "6": ["12","17","21","26","67","72"],
    "7": ["13","18","31","36","68","73"],
    "8": ["14","19","41","46","69","74"],
    "9": ["22","27","32","37","77","82","87","92","97"]
  };

  for(const fam in families){
    if(families[fam].includes(v)){
      return fam;   // ✅ ALWAYS single family id
    }
  }
  return null;
}
