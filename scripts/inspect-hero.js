const fs = require("fs");
const j = fs.readFileSync("assets/index-CgtScmUm.js", "utf8");
const i = j.indexOf("Faça parte de uma holding");
console.log(j.substring(i - 800, i + 200));
