const fs = require('fs');
const j = fs.readFileSync('assets/index-CgtScmUm.js', 'utf8');
// find toast export near YP
const i = j.indexOf('YP=({');
console.log(j.substring(i, i + 800));
const t = j.indexOf('success:(e,t)');
console.log('success at', t, j.substring(t-100, t+200));
