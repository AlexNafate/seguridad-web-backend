const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());
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

app.listen(PORT, () => {
  console.log(`Backend ejecutándose en http://localhost:${PORT}`);
});