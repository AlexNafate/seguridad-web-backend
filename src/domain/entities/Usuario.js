/**
 * Entidad de Dominio: Usuario
 * Representa al usuario en el núcleo del negocio.
 * No depende de ninguna base de datos ni framework.
 */
class Usuario {
  constructor({ id = null, nombre, correo, rol = "usuario", passwordHash, createdAt = null, updatedAt = null }) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
    this.rol = rol;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = Usuario;
