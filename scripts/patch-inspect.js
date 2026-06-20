const fs = require('fs');
const j = fs.readFileSync('assets/index-CgtScmUm.js', 'utf8');

// Ceilândia store
const idx = j.indexOf('Ceilândia');
console.log('Ceilândia:', j.substring(idx - 50, idx + 200));

// Form handler jL
const jL = j.indexOf('jL=');
console.log('\njL:', j.substring(jL, jL + 1500));

// Nossa história
const nh = j.indexOf('Nossa História');
console.log('\nNossa História:', j.substring(nh - 100, nh + 2500));

// Toast export - find after sonner
const xp = j.indexOf('XP=');
console.log('\nXP Toaster context:', j.substring(xp - 200, xp + 400));

// Find toast variable - search for dismiss, success pattern
const patterns = ['toast.success', 'toast.error', 'mC=', 'gC=', 'vC='];
for (const p of patterns) {
  const i = j.indexOf(p);
  if (i >= 0) console.log(p, ':', j.substring(i, i + 150));
}

// Nav sobre link
const sobre = j.indexOf('"/sobre"');
console.log('\n/sobre links:', [...j.matchAll(/to:"\/sobre[^"]*"/g)].map(m => m[0]));

// store modal brand
const sm = j.indexOf('store-modal-brand');
console.log('\nmodal brand:', j.substring(sm - 300, sm + 200));
