const bcrypt = require("bcrypt");

// Temporalmente guardaremos los usuarios en memoria.
// Después lo reemplazaremos por una base de datos.
const usuarios = [];

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios.",
      });
    }

    // Comprobar si ya existe el correo
    const usuarioExistente = usuarios.find(
      (usuario) => usuario.correo === correo
    );

    if (usuarioExistente) {
      return res.status(409).json({
        success: false,
        message: "El correo ya está registrado.",
      });
    }

    // Generar hash de la contraseña
    const passwordHash = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = {
      id: usuarios.length + 1,
      nombre,
      correo,
      passwordHash,
    };

    usuarios.push(nuevoUsuario);

    console.log("Usuario registrado:", correo);

    return res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente.",
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
};

module.exports = {
  registrarUsuario,
  usuarios,
};