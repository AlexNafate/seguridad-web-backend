const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/infrastructure/http/routes/authRoutes");
const { probarConexion } = require("./src/config/db");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas de autenticación (Arquitectura Hexagonal)
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend de SecureWeb funcionando correctamente",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    estado: "OK",
    servicio: "SecureWeb Backend",
  });
});

app.listen(PORT, async () => {
  console.log(`Backend ejecutándose en http://localhost:${PORT}`);
  await probarConexion();
});