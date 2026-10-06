const bcrypt = require("bcrypt");
const Usuario = require("../../domain/entities/Usuario");

/**
 * Caso de Uso: Registrar Usuario
 * Contiene la lógica de negocio del registro.
 * Recibe el repositorio por inyección de dependencias (no importa cuál BD es).
 */
class RegistrarUsuarioUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar({ nombre, correo, contrasena, rol = "usuario" }) {
    const correoLimpio = correo.trim().toLowerCase();
    const nombreLimpio = nombre.trim();

    // 1. Verificar si el correo ya existe
    const usuarioExistente = await this.usuarioRepository.buscarPorCorreo(correoLimpio);
    if (usuarioExistente) {
      const error = new Error("El correo ya está registrado.");
      error.statusCode = 409;
      throw error;
    }

    // 2. Hashear la contraseña
    const passwordHash = await bcrypt.hash(contrasena, 10);

    // 3. Crear la entidad y persistir
    const nuevoUsuario = new Usuario({
      nombre: nombreLimpio,
      correo: correoLimpio,
      rol,
      passwordHash,
    });

    return await this.usuarioRepository.guardar(nuevoUsuario);
  }
}

module.exports = RegistrarUsuarioUseCase;
