const fs = require('fs');
const j = fs.readFileSync('assets/index-CgtScmUm.js', 'utf8');
const i = j.indexOf('{img:xL.url,label:"DF');
console.log(j.substring(i - 200, i + 900));
