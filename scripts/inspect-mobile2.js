const j = require("fs").readFileSync("assets/index-CgtScmUm.js", "utf8");
const terms = ["h-[500", "h-[450", "h-[400", "h-[600", "TileLayer", "O que nos move", "inspiram", "Vantagens", "Pronto para", "grid-cols-2 md:grid-cols-4"];
for (const t of terms) {
  const i = j.indexOf(t);
  if (i >= 0) console.log(t, ":", j.substring(i, i + 200));
}
