const fs = require("fs");
const j = fs.readFileSync("assets/index-CgtScmUm.js", "utf8");

console.log("=== titles ===");
[...j.matchAll(/document\.title="[^"]+"/g)].forEach((m) => console.log(m[0]));

console.log("\n=== nav ===");
const vh = j.indexOf("vh=()=>");
console.log(j.substring(vh, vh + 1200));

console.log("\n=== jL hero ===");
const jl = j.indexOf("jL=()=>");
console.log(j.substring(jl, jl + 900));

console.log("\n=== history imgs ===");
const nh = j.indexOf("site-history-media");
console.log(j.substring(nh - 200, nh + 600));

console.log("\n=== home component ===");
const tk = j.indexOf("Tk=()=>");
console.log(j.substring(tk, tk + 400));

console.log("\n=== routes ===");
const routes = j.indexOf('path:"/');
console.log(j.substring(routes - 100, routes + 800));

console.log("\n=== footer location ===");
const fl = j.indexOf("footer-location");
console.log(j.substring(fl - 80, fl + 120));

console.log("\n=== nossas lojas section id ===");
["nossas-lojas", "id:\"nossas"].forEach((s) => {
  const i = j.indexOf(s);
  if (i >= 0) console.log(s, j.substring(i, i + 120));
});
