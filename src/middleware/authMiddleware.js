const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token no proporcionado.",
      });
    }

    const partes = authHeader.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Formato de token inválido.",
      });
    }

    const token = partes[1];

    const usuario = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.usuario = usuario;

    next();
  } catch (error) {
    console.error("Error al verificar JWT:", error.message);

    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado.",
    });
  }
}

function verificarAdmin(req, res, next) {
  if (!req.usuario || req.usuario.rol !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado: Se requieren permisos de Administrador para realizar esta acción.",
    });
  }
  next();
}

module.exports = { verificarToken, verificarAdmin };