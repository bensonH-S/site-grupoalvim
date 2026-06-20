const fs = require("fs");
const j = fs.readFileSync("assets/index-CgtScmUm.js", "utf8");
const idx = j.indexOf('L_="');
console.log("L_", j.substring(idx, idx + 80));
const fl = j.indexOf("jL=()=>");
const i = j.indexOf("onSubmit", fl);
console.log("form", j.substring(i - 50, i + 700));
