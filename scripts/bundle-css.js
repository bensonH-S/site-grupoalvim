const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "..", "assets");
const indexPath = path.join(__dirname, "..", "index.html");
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

const fullCss = banner + content;
fs.writeFileSync(output, fullCss, "utf8");
console.log(`CSS consolidado: ${output} (${(Buffer.byteLength(fullCss) / 1024).toFixed(1)} KB)`);

const inline = `<style id="site-custom-inline">\n${fullCss}\n</style>`;
let html = fs.readFileSync(indexPath, "utf8");

if (html.includes("<!--SITE_CUSTOM_CSS-->")) {
  html = html.replace("<!--SITE_CUSTOM_CSS-->", inline);
} else if (html.includes('id="site-custom-inline"')) {
  html = html.replace(/<style id="site-custom-inline">[\s\S]*?<\/style>/, inline);
} else {
  html = html.replace("</head>", `  ${inline}\n  </head>`);
}

fs.writeFileSync(indexPath, html, "utf8");
console.log("CSS inline gravado em index.html");
