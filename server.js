const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const publicDir = path.join(__dirname, "public");
const dataDir = path.join(__dirname, "data");
const credentialsPath = path.join(dataDir, "credenciais.txt");
const configPath = path.join(dataDir, "roleta-config.json");

const defaultCredentials = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "1234",
};

const defaultConfig = {
  title: "Roleta de Brindes",
  subtitle: "Gire a roleta, descubra seu brinde e tire um print da tela.",
  spinButtonText: "Girar roleta",
  pointerColor: "#f4f1de",
  centerColor: "#ffffff",
  backgroundStart: "#17324d",
  backgroundEnd: "#0a1724",
  wheelBorderColor: "#ffffff",
  textColor: "#ffffff",
  shadowColor: "rgba(0, 0, 0, 0.25)",
  wheelSize: 420,
  fontFamily: "'Trebuchet MS', sans-serif",
  items: [
    { label: "Caneca", color: "#e76f51" },
    { label: "Chaveiro", color: "#2a9d8f" },
    { label: "Desconto 10%", color: "#e9c46a" },
    { label: "Camiseta", color: "#264653" },
    { label: "Brinde Surpresa", color: "#f4a261" },
    { label: "Squeeze", color: "#8ab17d" },
  ],
};

function ensureDataFiles() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(credentialsPath)) {
    const credentialsText = [
      `username=${defaultCredentials.username}`,
      `password=${defaultCredentials.password}`,
    ].join("\n");
    fs.writeFileSync(credentialsPath, credentialsText, "utf-8");
  }

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), "utf-8");
  }
}

function readCredentials() {
  const raw = fs.readFileSync(credentialsPath, "utf-8");
  const lines = raw.split(/\r?\n/);
  const entries = {};

  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (!key || rest.length === 0) continue;
    entries[key.trim()] = rest.join("=").trim();
  }

  return {
    username: entries.username || defaultCredentials.username,
    password: entries.password || defaultCredentials.password,
  };
}

function saveCredentials(username, password) {
  const content = `username=${username}\npassword=${password}\n`;
  fs.writeFileSync(credentialsPath, content, "utf-8");
}

function readConfig() {
  const raw = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(raw);
}

function saveConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
}

ensureDataFiles();

app.use(express.json({ limit: "1mb" }));
app.use(express.static(publicDir));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/config", (req, res) => {
  res.json(readConfig());
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  const savedCredentials = readCredentials();
  const ok =
    username === savedCredentials.username && password === savedCredentials.password;

  res.json({ ok });
});

app.post("/api/admin/config", (req, res) => {
  const nextConfig = req.body;

  if (
    !nextConfig ||
    typeof nextConfig !== "object" ||
    !Array.isArray(nextConfig.items) ||
    nextConfig.items.length < 2
  ) {
    return res.status(400).json({ error: "Configuracao invalida." });
  }

  saveConfig(nextConfig);
  res.json({ ok: true });
});

app.post("/api/admin/credentials", (req, res) => {
  const { currentUsername, currentPassword, newUsername, newPassword } = req.body || {};
  const savedCredentials = readCredentials();

  if (
    currentUsername !== savedCredentials.username ||
    currentPassword !== savedCredentials.password
  ) {
    return res.status(401).json({ error: "Credenciais atuais invalidas." });
  }

  if (!newUsername || !newPassword) {
    return res.status(400).json({ error: "Novo login e senha sao obrigatorios." });
  }

  saveCredentials(newUsername, newPassword);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
