const j = require("fs").readFileSync("assets/index-CgtScmUm.js", "utf8");
const tk = j.indexOf("Especialistas em operar");
console.log(j.substring(tk - 400, tk + 900));
