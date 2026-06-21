const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "..", "assets");
const sources = [
  "responsive.css",
  "typography-responsive.css",
  "overrides.css",
  "cookies.css",
];
const output = path.join(assetsDir, "site-custom.css");

const banner = `/* Gerado automaticamente — nao edite. Fonte: ${sources.join(", ")} */\n`;
const content = sources
  .map((file) => {
    const filePath = path.join(assetsDir, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo CSS nao encontrado: ${file}`);
    }
    return `/* === ${file} === */\n${fs.readFileSync(filePath, "utf8")}`;
  })
  .join("\n\n");

fs.writeFileSync(output, banner + content, "utf8");
console.log(`CSS consolidado: ${output} (${(Buffer.byteLength(content) / 1024).toFixed(1)} KB)`);
