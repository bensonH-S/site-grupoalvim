const fs = require("fs");
const file = "assets/index-CgtScmUm.js";
let j = fs.readFileSync(file, "utf8");
const before = (j.match(/\u2014/g) || []).length;
j = j.split(" \u2014 ").join(", ");
const after = (j.match(/\u2014/g) || []).length;
fs.writeFileSync(file, j);
console.log("Replaced", before - after, "em-dashes (remaining:", after, ")");
