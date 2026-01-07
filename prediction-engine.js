function calculatePrediction(pattern, rows){
  let total = 0;
  let hit = 0;

  for(let i=0;i<=rows.length-pattern.base.length;i++){
    total++;
    let ok=true;

    for(let k=0;k<pattern.base.length;k++){
      const val = rows[i+k][pattern.type==="column"
        ? pattern.col
        : pattern.type==="diagonal"
          ? pattern.col+k
          : (k%2?pattern.col-1:pattern.col)
      ]?.val;

      if(pattern.base[k] && val && !sameFamily(pattern.base[k],val)){
        ok=false; break;
      }
    }
    if(ok) hit++;
  }
  return ((hit/total)*100).toFixed(1);
}
