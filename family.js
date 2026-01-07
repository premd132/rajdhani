function normalize(v) {
  if (!v) return null;
  if (v === "**") return null;
  return v.padStart(2, "0");
}

function getFamily(v) {
  const f = {
    "0": ["00","05","50","55"],
    "1": ["11","16","61","66"],
    "2": ["22","27","72","77"],
    "3": ["33","38","83","88"],
    "4": ["44","49","94","99"]
  };
  return f[v[0]] || [v];
}
