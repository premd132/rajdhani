/* ================= ENGINE – STEP 3 ================= */

function getLastRows(count = 7){
  const rows = [...document.querySelectorAll("#recordTable tbody tr")];
  return rows.slice(-count);
}

/* Extract families from last rows */
function extractFamilyGrid(lastRows){
  return lastRows.map(tr=>{
    return [...tr.children].slice(1).map(td=>{
      const v = td.innerText.trim();
      if(!v) return null;
      return getFamily(v);
    });
  });
}

/* Build pattern templates */
function buildPatternTemplates(){
  const lastRows = getLastRows(7);
  if(lastRows.length < 6){
    console.warn("Need minimum 6 rows");
    return [];
  }

  const grid = extractFamilyGrid(lastRows);
  const templates = [];

  const ROWS = grid.length;
  const COLS = grid[0].length;

  // ---------- VERTICAL ----------
  for(let c=0;c<COLS;c++){
    let fam = null;
    let steps = [];
    for(let r=0;r<ROWS;r++){
      const f = grid[r][c];
      if(f === null) continue;
      if(fam === null) fam = f;
      if(f === fam){
        steps.push({row:r,col:c,family:f});
      }
    }
    if(steps.length >= 3){
      templates.push({
        type:"vertical",
        family:fam,
        steps
      });
    }
  }

  // ---------- DIAGONAL ↘ ----------
  for(let c=0;c<=COLS-3;c++){
    let fam = null;
    let steps = [];
    for(let r=0;r<ROWS && c+r<COLS;r++){
      const f = grid[r][c+r];
      if(f === null) continue;
      if(fam === null) fam = f;
      if(f === fam){
        steps.push({row:r,col:c+r,family:f});
      }
    }
    if(steps.length >= 3){
      templates.push({
        type:"diagonal",
        family:fam,
        steps
      });
    }
  }

  // ---------- ZIG-ZAG ----------
  for(let c=0;c<=COLS-2;c++){
    let fam = null;
    let steps = [];
    for(let r=0;r<ROWS;r++){
      const col = (r % 2 === 0) ? c : c+1;
      const f = grid[r][col];
      if(f === null) continue;
      if(fam === null) fam = f;
      if(f === fam){
        steps.push({row:r,col:col,family:f});
      }
    }
    if(steps.length >= 3){
      templates.push({
        type:"zigzag",
        family:fam,
        steps
      });
    }
  }

  console.log("PATTERN TEMPLATES:", templates);
  return templates;
}

/* TEMP manual trigger */
window.testStep3 = function(){
  const patterns = buildPatternTemplates();
  alert(`Patterns found: ${patterns.length}\nSee console`);
};
