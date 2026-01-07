// ================= FAMILY LOGIC =================

// Always return 2-digit jodi
function normalizeJodi(v){
  if(!v) return "";
  v = v.trim();
  if(v === "**") return "";
  return v.padStart(2,"0");
}

// Family mapping (example – you can extend)
const FAMILY_MAP = {
  "0": ["00","05","50","55"],
  "1": ["01","06","61","66"],
  "2": ["02","07","72","77"],
  "3": ["03","08","83","88"],
  "4": ["04","09","94","99"]
};

// Get family key
function getFamily(jodi){
  jodi = normalizeJodi(jodi);
  if(!jodi) return "";

  const d = jodi[0];
  for(const k in FAMILY_MAP){
    if(FAMILY_MAP[k].includes(jodi)) return k;
  }
  return d; // fallback
}
