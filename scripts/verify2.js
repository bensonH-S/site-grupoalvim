const fs = require("fs");
const j = fs.readFileSync("assets/index-CgtScmUm.js", "utf8");
const checks = [
  "hero-investidor",
  "/franqueado#hero-investidor",
  "Grupo Alvim - Nossas Lojas",
  "Brasília, DF, Brasil",
  "src:_h,alt:\"Fachada restaurante",
];
for (const c of checks) {
  console.log(c, j.includes(c) ? "OK" : "MISSING");
}
