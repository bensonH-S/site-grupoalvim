const fs = require("fs");
const j = fs.readFileSync("assets/index-CgtScmUm.js", "utf8");
const fl = j.indexOf("jL=()=>");
const i = j.indexOf('type:"submit"', fl);
console.log(j.substring(i - 100, i + 200));
