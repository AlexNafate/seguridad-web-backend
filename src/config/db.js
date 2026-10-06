const mysql = require("mysql2/promise");
require("dotenv").config();

// Pool de conexiones a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "secureweb_db",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Función para verificar la conexión al iniciar el servidor
const probarConexion = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("🟢 Conexión a la base de datos MySQL establecida correctamente.");
    connection.release();
    return true;
  } catch (error) {
    console.error("🔴 Error al conectar con la base de datos MySQL:", error.message);
    return false;
  }
};

module.exports = {
  pool,
  probarConexion,
};