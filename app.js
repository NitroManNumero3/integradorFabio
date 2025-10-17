process.on('uncaughtException', err => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', err => console.error('Unhandled Rejection:', err));

import express from 'express';
import path from 'path';
import alumnosRoutes from './routes/alumnos.js';
import profesoresRoutes from './routes/profesores.js';
import asignaturasRoutes from './routes/asignaturas.js';
import cursosRoutes from './routes/cursos.js';
import aulasRoutes from './routes/aulas.js';
import horariosRoutes from './routes/horarios.js';

const app = express();

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public')); // Para archivos estáticos (CSS, JS, imágenes)

// Middleware de debug
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/alumnos', alumnosRoutes);
app.use('/profesores', profesoresRoutes);
app.use('/asignaturas', asignaturasRoutes);
app.use('/cursos', cursosRoutes);
app.use('/aulas', aulasRoutes);
app.use('/horarios', horariosRoutes);

// Ruta raíz - Página de inicio
app.get('/', (_req, res) => {
  res.render('index');
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).send('<h1>404 - Página no encontrada</h1><p><a href="/">Volver al inicio</a></p>');
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Gestión de Centro de Enseñanza`);
});