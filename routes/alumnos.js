import express from 'express';
import pool from '../db/pool.js'; // Ajustá la ruta si tu carpeta está en otro lugar

const router = express.Router();

// 📋 Listado de alumnos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        al.id AS alumno_id, 
        p.*, 
        TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) AS edad
      FROM alumno al 
      JOIN persona p ON p.id = al.persona_id
    `);
    res.render('alumnos', { alumnos: rows });
  } catch (err) {
    console.error('❌ Error en la base de datos:', err);
    res.status(500).send('Error al obtener los alumnos');
  }
});

// 🧾 Formulario para matricular un alumno (GET)
router.get('/matricular/:alumnoId', async (req, res) => {
  try {
    const { alumnoId } = req.params;
    const [asigs] = await pool.query('SELECT id, nombre FROM asignatura');
    res.render('matricular', { alumnoId, asigs });
  } catch (err) {
    console.error('❌ Error al cargar las asignaturas:', err);
    res.status(500).send('Error al cargar las asignaturas');
  }
});

// 🧠 Procesar matrícula (POST)
router.post('/matricular', async (req, res) => {
  try {
    const { alumno_id, asignatura_id, nota } = req.body;
    await pool.query(
      'INSERT INTO matricula (alumno_id, asignatura_id, nota) VALUES (?, ?, ?)',
      [alumno_id, asignatura_id, nota || null]
    );
    res.redirect('/alumnos');
  } catch (err) {
    console.error('❌ Error al matricular al alumno:', err);
    res.status(500).send('Error al matricular al alumno');
  }
});

export default router;
