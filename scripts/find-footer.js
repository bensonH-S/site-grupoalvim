const j = require("fs").readFileSync("assets/index-CgtScmUm.js", "utf8");
const i = j.indexOf("footer-brand-col");
console.log(j.substring(i, i + 500));
