const j = require("fs").readFileSync("assets/index-CgtScmUm.js", "utf8");
const i = j.indexOf("id:\"nossas-lojas-mapa\"");
console.log(j.substring(i, i + 1500));
