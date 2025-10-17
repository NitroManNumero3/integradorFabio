// Manejo global de errores no capturados para evitar que la aplicación se cierre inesperadamente
process.on('uncaughtException', err => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', err => console.error('Unhandled Rejection:', err));

// Importación de dependencias principales
import express from 'express';
import path from 'path';

// Importación de todos los routers del sistema de gestión
import alumnosRoutes from './routes/alumnos.js';
import profesoresRoutes from './routes/profesores.js';
import asignaturasRoutes from './routes/asignaturas.js';
import cursosRoutes from './routes/cursos.js';
import aulasRoutes from './routes/aulas.js';
import horariosRoutes from './routes/horarios.js';

// Inicialización de la aplicación Express
const app = express();

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// Middlewares para procesamiento de datos
app.use(express.json()); // Permite recibir datos en formato JSON
app.use(express.urlencoded({ extended: false })); // Permite procesar formularios HTML
app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta 'public' (CSS, JS, imágenes)

// Middleware de debug: registra todas las peticiones HTTP en consola
app.use((req, res, next) => {
  console.log(` ${req.method} ${req.path}`);
  next(); // Continúa con el siguiente middleware o ruta
});

// Registro de rutas: cada prefijo delega las peticiones a su router correspondiente
app.use('/alumnos', alumnosRoutes);        // Rutas para gestión de alumnos
app.use('/profesores', profesoresRoutes);  // Rutas para gestión de profesores
app.use('/asignaturas', asignaturasRoutes); // Rutas para gestión de asignaturas
app.use('/cursos', cursosRoutes);          // Rutas para gestión de cursos
app.use('/aulas', aulasRoutes);            // Rutas para gestión de aulas
app.use('/horarios', horariosRoutes);      // Rutas para gestión de horarios

// Ruta raíz - Página de inicio
app.get('/', (_req, res) => {
  res.render('index');
});

// Manejo de errores 404: captura todas las rutas no definidas
app.use((req, res) => {
  res.status(404).send('<h1>404 - Página no encontrada</h1><p><a href="/">Volver al inicio</a></p>');
});

// Configuración del puerto: usa variable de entorno o puerto 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
  console.log(` Gestión de Centro de Enseñanza`);
});