const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../src/config/db");

// =============================================
// REGISTRO DE USUARIO EN MYSQL
// =============================================
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    // Validación básica de campos
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios (nombre, correo, contrasena).",
      });
    }

    const correoLimpio = correo.trim().toLowerCase();
    const nombreLimpio = nombre.trim();

    // 1. Verificar si el usuario ya existe en la base de datos
    const [usuariosExistentes] = await pool.execute(
      "SELECT id FROM usuarios WHERE correo = ? LIMIT 1",
      [correoLimpio]
    );

    if (usuariosExistentes.length > 0) {
      return res.status(409).json({
        success: false,
        message: "El correo ya está registrado.",
      });
    }

    // 2. Hashear la contraseña de forma segura
    const passwordHash = await bcrypt.hash(contrasena, 10);

    // 3. Guardar el nuevo usuario en MySQL
    const [resultado] = await pool.execute(
      "INSERT INTO usuarios (nombre, correo, password_hash) VALUES (?, ?, ?)",
      [nombreLimpio, correoLimpio, passwordHash]
    );

    console.log(`✅ Usuario registrado en MySQL: ${correoLimpio} (ID: ${resultado.insertId})`);

    return res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente.",
      usuario: {
        id: resultado.insertId,
        nombre: nombreLimpio,
        correo: correoLimpio,
      },
    });
  } catch (error) {
    console.error("❌ Error en registro de usuario:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al registrar el usuario.",
    });
  }
};

// =============================================
// INICIO DE SESIÓN CON MYSQL Y JWT
// =============================================
const iniciarSesion = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({
        success: false,
        message: "El correo y la contraseña son obligatorios.",
      });
    }

    const correoLimpio = correo.trim().toLowerCase();

    // 1. Buscar al usuario en la base de datos
    const [filas] = await pool.execute(
      "SELECT id, nombre, correo, password_hash FROM usuarios WHERE correo = ? LIMIT 1",
      [correoLimpio]
    );

    if (filas.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Correo o contraseña incorrectos.",
      });
    }

    const usuario = filas[0];

    // 2. Comparar la contraseña proporcionada con el hash almacenado
    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.password_hash
    );

    if (!contrasenaValida) {
      return res.status(401).json({
        success: false,
        message: "Correo o contraseña incorrectos.",
      });
    }

    // 3. Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    console.log(`✅ Inicio de sesión exitoso: ${usuario.correo}`);

    return res.status(200).json({
      success: true,
      message: "Inicio de sesión correcto.",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al iniciar sesión.",
    });
  }
};

// =============================================
// OBTENER PERFIL DEL USUARIO AUTENTICADO
// =============================================
const obtenerPerfil = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Acceso autorizado.",
    usuario: req.usuario,
  });
};

module.exports = {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
};