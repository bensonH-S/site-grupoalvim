const j = require("fs").readFileSync("assets/index-CgtScmUm.js", "utf8");
const dash = "\u2014"; // em dash
const matches = j.match(new RegExp(`name:"[^"]*${dash}[^"]*"`, "g"));
console.log([...new Set(matches || [])].join("\n"));
console.log("\nTotal:", matches ? matches.length : 0);
