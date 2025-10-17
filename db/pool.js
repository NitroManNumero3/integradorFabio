import mysql from 'mysql2/promise';

/**
 * Pool de conexiones a MySQL
 * Utiliza mysql2/promise para trabajar con async/await
 * El pool gestiona automáticamente múltiples conexiones simultáneas
 */
const pool = mysql.createPool({
  host: 'localhost',      // Dirección del servidor MySQL
  user: 'root',           // Usuario de la base de datos
  password: '1234',       // Contraseña del usuario
  database: 'centro',     // Nombre de la base de datos del centro de enseñanza
  port: 3306              // Puerto por defecto de MySQL
});

/**
 * Verificación automática de la conexión al iniciar la aplicación
 * Intenta obtener una conexión del pool y la libera inmediatamente
 * Si falla, muestra el error pero no detiene la aplicación
 */
try {
  const connection = await pool.getConnection();
  console.log('✅ Conectado correctamente a la base de datos.');
  connection.release(); // Libera la conexión para que vuelva al pool
} catch (error) {
  console.error('❌ Error al conectar con la base de datos:', error.message);
}

// Exporta el pool para ser usado en los routers y modelos
export default pool;
