const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Caso de Uso: Iniciar Sesión
 * Contiene la lógica de negocio del login y generación de JWT.
 * Recibe el repositorio por inyección de dependencias.
 */
class IniciarSesionUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar({ correo, contrasena }) {
    const correoLimpio = correo.trim().toLowerCase();

    // 1. Buscar el usuario en la base de datos
    const usuario = await this.usuarioRepository.buscarPorCorreo(correoLimpio);
    if (!usuario) {
      const error = new Error("Correo o contraseña incorrectos.");
      error.statusCode = 401;
      throw error;
    }

    // 2. Verificar la contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.passwordHash);
    if (!contrasenaValida) {
      const error = new Error("Correo o contraseña incorrectos.");
      error.statusCode = 401;
      throw error;
    }

    // 3. Generar token JWT con el rol real
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    };
  }
}

module.exports = IniciarSesionUseCase;
