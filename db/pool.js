import mysql from 'mysql2/promise';

// 🔧 Configuración directa de la base de datos
const pool = mysql.createPool({
  host: 'localhost',      // o el host que uses (por ej. 127.0.0.1)
  user: 'root',           // tu usuario de MySQL
  password: '1234',           // tu contraseña (si tenés)
  database: 'centro', // nombre de la base de datos
  port: 3306
});

// 🧪 Verificación automática al iniciar
try {
  const connection = await pool.getConnection();
  console.log('✅ Conectado correctamente a la base de datos.');
  connection.release();
} catch (error) {
  console.error('❌ Error al conectar con la base de datos:', error.message);
}

export default pool;
