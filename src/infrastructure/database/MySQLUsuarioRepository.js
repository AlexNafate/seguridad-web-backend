const UsuarioRepositoryPort = require("../../domain/ports/UsuarioRepositoryPort");
const Usuario = require("../../domain/entities/Usuario");
const { pool } = require("../../config/db");

/**
 * Adaptador Secundario (Driven/Outbound Adapter)
 * Implementa el UsuarioRepositoryPort usando MySQL con mysql2/promise.
 * Es el único lugar donde existen consultas SQL.
 */
class MySQLUsuarioRepository extends UsuarioRepositoryPort {
  async guardar(usuario) {
    const rol = usuario.rol || "usuario";
    const [resultado] = await pool.execute(
      "INSERT INTO usuarios (nombre, correo, rol, password_hash) VALUES (?, ?, ?, ?)",
      [usuario.nombre, usuario.correo, rol, usuario.passwordHash]
    );

    return new Usuario({
      id: resultado.insertId,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: rol,
      passwordHash: usuario.passwordHash,
    });
  }

  async buscarPorCorreo(correo) {
    const [filas] = await pool.execute(
      "SELECT id, nombre, correo, rol, password_hash, created_at, updated_at FROM usuarios WHERE correo = ? LIMIT 1",
      [correo]
    );

    if (filas.length === 0) return null;

    const fila = filas[0];
    return new Usuario({
      id: fila.id,
      nombre: fila.nombre,
      correo: fila.correo,
      rol: fila.rol || "usuario",
      passwordHash: fila.password_hash,
      createdAt: fila.created_at,
      updatedAt: fila.updated_at,
    });
  }

  async buscarPorId(id) {
    const [filas] = await pool.execute(
      "SELECT id, nombre, correo, rol, created_at, updated_at FROM usuarios WHERE id = ? LIMIT 1",
      [id]
    );

    if (filas.length === 0) return null;

    const fila = filas[0];
    return new Usuario({
      id: fila.id,
      nombre: fila.nombre,
      correo: fila.correo,
      rol: fila.rol || "usuario",
      createdAt: fila.created_at,
      updatedAt: fila.updated_at,
    });
  }

  async obtenerUsuariosYEstadisticas() {
    const [filas] = await pool.execute(
      "SELECT id, nombre, correo, rol, created_at FROM usuarios ORDER BY id ASC"
    );

    const total = filas.length;
    const admins = filas.filter((u) => u.rol === "admin").length;
    const usuariosRegulares = total - admins;

    return {
      usuarios: filas,
      total,
      admins,
      usuariosRegulares,
    };
  }

  async actualizar(id, { nombre, correo, rol }) {
    await pool.execute(
      "UPDATE usuarios SET nombre = ?, correo = ?, rol = ? WHERE id = ?",
      [nombre, correo, rol, id]
    );
    return this.buscarPorId(id);
  }

  async eliminar(id) {
    const [resultado] = await pool.execute(
      "DELETE FROM usuarios WHERE id = ?",
      [id]
    );
    return resultado.affectedRows > 0;
  }
}

module.exports = MySQLUsuarioRepository;
