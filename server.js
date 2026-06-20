require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;
const rootDir = __dirname;
const assetsDir = path.join(rootDir, "assets");
const indexPath = path.join(rootDir, "index.html");
const customCssPath = path.join(assetsDir, "site-custom.css");

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

function loadIndexHtml() {
  let html = fs.readFileSync(indexPath, "utf8");

  if (fs.existsSync(customCssPath)) {
    const css = fs.readFileSync(customCssPath, "utf8");
    const inline = `<style id="site-custom-inline">\n${css}\n</style>`;
    html = html.replace("<!--SITE_CUSTOM_CSS-->", inline);
  } else {
    html = html.replace("<!--SITE_CUSTOM_CSS-->", "");
  }

  return html;
}

let cachedIndexHtml = loadIndexHtml();

function serveIndex(_req, res) {
  if (process.env.NODE_ENV !== "production") {
    cachedIndexHtml = loadIndexHtml();
  }
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.type("html").send(cachedIndexHtml);
}

app.use(
  "/assets",
  express.static(assetsDir, {
    maxAge: process.env.NODE_ENV === "production" ? "1h" : 0,
    setHeaders(res, filePath) {
      if (filePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css; charset=utf-8");
        if (filePath.endsWith("site-custom.css")) {
          res.setHeader("Cache-Control", "no-cache");
        }
      } else if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
      }
    },
  })
);

app.use(
  express.static(rootDir, {
    extensions: ["html"],
    index: false,
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      }
    },
  })
);

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Variável ${name} não configurada no .env`);
  return value;
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    process.env.SMTP_SECURE === "true" || String(port) === "465";

  return nodemailer.createTransport({
    host: requiredEnv("SMTP_HOST"),
    port,
    secure,
    auth: {
      user: requiredEnv("SMTP_USER"),
      pass: requiredEnv("SMTP_PASS"),
    },
  });
}

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, city, investment, experience, message } =
    req.body || {};

  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    return res.status(400).json({
      error: "Preencha nome, e-mail e telefone.",
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(String(email).trim())) {
    return res.status(400).json({ error: "E-mail inválido." });
  }

  try {
    const transporter = createTransport();
    const to = process.env.SMTP_TO || process.env.SMTP_USER;
    const from =
      process.env.SMTP_FROM ||
      `"Site Grupo Alvim" <${process.env.SMTP_USER}>`;

    const lines = [
      "Nova mensagem do formulário Seja um investidor",
      "",
      `Nome: ${String(name).trim()}`,
      `E-mail: ${String(email).trim()}`,
      `Telefone: ${String(phone).trim()}`,
      `Cidade: ${city?.trim() || "—"}`,
      `Investimento: ${investment?.trim() || "—"}`,
      `Experiência: ${experience?.trim() || "—"}`,
      "",
      "Mensagem:",
      message?.trim() || "—",
    ];

    await transporter.sendMail({
      from,
      to,
      replyTo: String(email).trim(),
      subject: `[Grupo Alvim] Novo contato — ${String(name).trim()}`,
      text: lines.join("\n"),
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err.message);
    res.status(500).json({
      error: "Não foi possível enviar a mensagem. Tente novamente mais tarde.",
    });
  }
});

app.get("/", serveIndex);

app.get("/sobre", serveIndex);

app.get("/franqueado", serveIndex);

app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});
