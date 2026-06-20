const j = require("fs").readFileSync("assets/index-CgtScmUm.js", "utf8");

const tk = j.indexOf("Tk=()=>");
console.log("TK HERO:", j.substring(tk, tk + 1200));

const lk = j.indexOf("Lk=()=>");
console.log("\nLK:", j.substring(lk, lk + 1500));

const px = j.indexOf("const px=S.forwardRef");
console.log("\nDIALOG px:", j.substring(px, px + 400));

const modal = j.indexOf("store-modal-footer");
console.log("\nMODAL before:", j.substring(modal - 800, modal + 100));

const navBtn = j.indexOf('M3 12h18');
console.log("\nNAV BTN:", j.substring(navBtn - 200, navBtn + 150));
