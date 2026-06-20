const fs = require('fs');
const j = fs.readFileSync('assets/index-CgtScmUm.js', 'utf8');
const keys = [
  'CNM 1, Bloco K', 'Ceilândia', 'jL=()=>', 'handleSubmit', 'onSubmit',
  'toast(', 'Toaster', 'XP', 'Nossa Presença', 'mapa-df', 'mapa-minas',
  'Nossa História', 'A história do Grupo', 'label:"Sobre Nós"',
  'store-modal-brand', 'Minas Gerais', 'Distrito Federal'
];
for (const k of keys) {
  const i = j.indexOf(k);
  if (i >= 0) console.log('\n===', k, '===\n', j.substring(Math.max(0,i-80), i + 500));
}
