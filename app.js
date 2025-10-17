process.on('uncaughtException', err => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', err => console.error('Unhandled Rejection:', err));

import express from 'express';
import path from 'path';
import alumnosRoutes from './routes/alumnos.js';
import profesoresRoutes from './routes/profesores.js';
import asignaturasRoutes from './routes/asignaturas.js';

const app = express();

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware de debug (temporal)
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// ✅ CAMBIO IMPORTANTE: Usa prefijos específicos
app.use('/alumnos', alumnosRoutes);
app.use('/profesores', profesoresRoutes);
app.use('/asignaturas', asignaturasRoutes);

// Ruta raíz
app.get('/', (_req, res) => {
  res.send('✅ Servidor funcionando. Visita <a href="/alumnos">/alumnos</a>');
});

// Puerto
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));