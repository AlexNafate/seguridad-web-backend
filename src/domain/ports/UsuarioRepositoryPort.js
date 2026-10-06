/**
 * Puerto de Repositorio de Usuario (Contrato / Interfaz)
 * Define QUÉ operaciones necesita el Dominio de cualquier base de datos.
 * No sabe si es MySQL, PostgreSQL, MongoDB, etc.
 */
class UsuarioRepositoryPort {
  async guardar(usuario) {
    throw new Error("El método 'guardar' debe ser implementado.");
  }

  async buscarPorCorreo(correo) {
    throw new Error("El método 'buscarPorCorreo' debe ser implementado.");
  }

  async buscarPorId(id) {
    throw new Error("El método 'buscarPorId' debe ser implementado.");
  }

  async obtenerUsuariosYEstadisticas() {
    throw new Error("El método 'obtenerUsuariosYEstadisticas' debe ser implementado.");
  }

  async actualizar(id, { nombre, correo, rol }) {
    throw new Error("El método 'actualizar' debe ser implementado.");
  }

  async eliminar(id) {
    throw new Error("El método 'eliminar' debe ser implementado.");
  }
}

module.exports = UsuarioRepositoryPort;
