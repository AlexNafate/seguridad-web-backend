const RegistrarUsuarioUseCase = require("../../../application/usecases/RegistrarUsuarioUseCase");
const IniciarSesionUseCase = require("../../../application/usecases/IniciarSesionUseCase");
const MySQLUsuarioRepository = require("../../database/MySQLUsuarioRepository");

// Inyección de dependencias: el controlador no conoce MySQL directamente
const usuarioRepository = new MySQLUsuarioRepository();
const registrarUsuarioUseCase = new RegistrarUsuarioUseCase(usuarioRepository);
const iniciarSesionUseCase = new IniciarSesionUseCase(usuarioRepository);

// =============================================
// REGISTRO DE USUARIO
// =============================================
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios (nombre, correo, contrasena).",
      });
    }

    const usuario = await registrarUsuarioUseCase.ejecutar({ nombre, correo, contrasena });

    console.log(`✅ Usuario registrado: ${usuario.correo} (ID: ${usuario.id})`);

    return res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente.",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("❌ Error en registro:", error.message);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error interno del servidor al registrar el usuario.",
    });
  }
};

// =============================================
// INICIO DE SESIÓN
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

    const resultado = await iniciarSesionUseCase.ejecutar({ correo, contrasena });

    console.log(`✅ Login exitoso: ${resultado.usuario.correo} (${resultado.usuario.rol})`);

    return res.status(200).json({
      success: true,
      message: "Inicio de sesión correcto.",
      token: resultado.token,
      usuario: resultado.usuario,
    });
  } catch (error) {
    console.error("❌ Error en login:", error.message);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error interno del servidor al iniciar sesión.",
    });
  }
};

// =============================================
// OBTENER PERFIL (ruta protegida)
// =============================================
const obtenerPerfil = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Acceso autorizado.",
    usuario: req.usuario,
  });
};

// =============================================
// DATOS REALES PARA EL DASHBOARD (usuarios y roles)
// =============================================
const obtenerDashboardData = async (req, res) => {
  try {
    const data = await usuarioRepository.obtenerUsuariosYEstadisticas();
    return res.status(200).json({
      success: true,
      usuarioActual: req.usuario,
      estadisticas: {
        total: data.total,
        admins: data.admins,
        usuariosRegulares: data.usuariosRegulares,
      },
      usuarios: data.usuarios,
    });
  } catch (error) {
    console.error("❌ Error al obtener dashboard data:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas del dashboard.",
    });
  }
};

// =============================================
// EDITAR USUARIO (Solo Administradores)
// =============================================
const editarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, rol } = req.body;

    if (!nombre || !correo || !rol) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos (nombre, correo, rol).",
      });
    }

    if (!["admin", "usuario"].includes(rol)) {
      return res.status(400).json({
        success: false,
        message: "El rol debe ser 'admin' o 'usuario'.",
      });
    }

    const usuarioActualizado = await usuarioRepository.actualizar(id, {
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      rol,
    });

    if (!usuarioActualizado) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado.",
      });
    }

    console.log(`✏️ Admin ${req.usuario.correo} editó al usuario ID ${id}`);

    return res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente.",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error("❌ Error al editar usuario:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar usuario en la base de datos.",
    });
  }
};

// =============================================
// ELIMINAR USUARIO (Solo Administradores)
// =============================================
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Protección: El admin no puede borrarse a sí mismo para no bloquearse
    if (parseInt(id) === req.usuario.id) {
      return res.status(400).json({
        success: false,
        message: "No puedes eliminar tu propia cuenta de Administrador mientras tienes la sesión activa.",
      });
    }

    const eliminado = await usuarioRepository.eliminar(id);

    if (!eliminado) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado.",
      });
    }

    console.log(`🗑️ Admin ${req.usuario.correo} eliminó al usuario ID ${id}`);

    return res.status(200).json({
      success: true,
      message: "Usuario eliminado correctamente de la base de datos.",
    });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar usuario de la base de datos.",
    });
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
  obtenerDashboardData,
  editarUsuario,
  eliminarUsuario,
};
