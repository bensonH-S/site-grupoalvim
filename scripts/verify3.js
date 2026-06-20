const j = require("fs").readFileSync("assets/index-CgtScmUm.js", "utf8");
console.log("Inicio", j.includes('label:"Início"'));
console.log("footer-brand-block", j.includes("footer-brand-block"));
console.log("footer-icon-link", j.includes("footer-icon-link"));
console.log("id inicio", j.includes('id:"inicio"'));
console.log("nav active fn", j.includes("const c=u=>"));
console.log("Home removed", !j.includes('children:"Home"'));
