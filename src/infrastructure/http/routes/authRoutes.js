const express = require("express");
const router = express.Router();

const {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
  obtenerDashboardData,
  editarUsuario,
  eliminarUsuario,
} = require("../controllers/authController");
const { verificarToken, verificarAdmin } = require("../../../middleware/authMiddleware");

// Rutas públicas
router.post("/register", registrarUsuario);
router.post("/login", iniciarSesion);

// Rutas protegidas con JWT
router.get("/perfil", verificarToken, obtenerPerfil);
router.get("/dashboard-data", verificarToken, obtenerDashboardData);

// Rutas exclusivas para Administradores
router.put("/usuarios/:id", verificarToken, verificarAdmin, editarUsuario);
router.delete("/usuarios/:id", verificarToken, verificarAdmin, eliminarUsuario);

module.exports = router;
