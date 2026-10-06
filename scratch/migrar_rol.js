const { pool } = require('../src/config/db');

async function migrar() {
  try {
    const [cols] = await pool.execute("DESCRIBE usuarios");
    const yaExiste = cols.some(c => c.Field === 'rol');

    if (!yaExiste) {
      await pool.execute("ALTER TABLE usuarios ADD COLUMN rol ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario' AFTER correo");
      console.log("✅ Columna 'rol' agregada exitosamente.");
    } else {
      console.log("ℹ️ La columna 'rol' ya existe.");
    }

    // Asegurar que el usuario id=1 (o alex@test.com) sea admin
    await pool.execute("UPDATE usuarios SET rol = 'admin' WHERE id = 1 OR correo = 'alex@test.com'");
    console.log("✅ Usuario principal establecido como 'admin'.");

    const [filas] = await pool.execute("SELECT id, nombre, correo, rol FROM usuarios");
    console.log("Usuarios en BD con roles:", filas);
  } catch (error) {
    console.error("Error en migración:", error);
  } finally {
    process.exit(0);
  }
}

migrar();
