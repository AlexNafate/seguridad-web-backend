const express = require("express");
const router = express.Router();

const {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
} = require("../controllers/authController");

const verificarToken = require("../src/middleware/authMiddleware");

// Rutas públicas
router.post("/register", registrarUsuario);
router.post("/login", iniciarSesion);

// Ruta protegida con JWT
router.get("/perfil", verificarToken, obtenerPerfil);

module.exports = router;