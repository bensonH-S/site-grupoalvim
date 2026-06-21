const fs = require("fs");
const j = fs.readFileSync("assets/index-CgtScmUm.js", "utf8");
const checks = [
  'brand:"popeyes"',
  "/sobre#nossa-historia",
  'id:"nossa-historia"',
  "/assets/mapa-df-goias.jpg",
  "Distrito Federal",
  "zP.success",
  "site-presence-card",
  'type:"submit",disabled:l,className:"w-full bg-primary',
  "Enviar Formulário",
];
for (const c of checks) {
  console.log(c, j.includes(c) ? "OK" : "MISSING");
}
