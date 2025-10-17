import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// 📋 Listar todas las asignaturas
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.id, 
        a.nombre, 
        a.horas_semanales, 
        c.nombre AS curso, 
        p.nombre AS profesor
      FROM asignatura a
      LEFT JOIN curso c ON a.curso_id = c.id
      LEFT JOIN profesor pr ON a.profesor_id = pr.id
      LEFT JOIN persona p ON pr.persona_id = p.id
    `);
    res.render('asignaturas', { asignaturas: rows });
  } catch (err) {
    console.error('❌ Error al obtener asignaturas:', err);
    res.status(500).send('Error al obtener asignaturas');
  }
});

// ➕ Formulario para agregar una nueva asignatura
router.get('/nueva', async (req, res) => {
  try {
    const [profesores] = await pool.query(`
      SELECT pr.id, per.nombre, per.apellidos 
      FROM profesor pr 
      JOIN persona per ON per.id = pr.persona_id
    `);
    const [cursos] = await pool.query(`SELECT id, nombre FROM curso`);
    res.render('nuevaAsignatura', { profesores, cursos });
  } catch (err) {
    console.error('❌ Error al cargar formulario:', err);
    res.status(500).send('Error al cargar formulario');
  }
});

// 🧠 Procesar nueva asignatura
router.post('/nueva', async (req, res) => {
  try {
    const { nombre, horas_semanales, curso_id, profesor_id } = req.body;
    await pool.query(`
      INSERT INTO asignatura (nombre, horas_semanales, curso_id, profesor_id)
      VALUES (?, ?, ?, ?)
    `, [nombre, horas_semanales, curso_id, profesor_id]);
    res.redirect('/asignaturas');
  } catch (err) {
    console.error('❌ Error al guardar asignatura:', err);
    res.status(500).send('Error al guardar asignatura');
  }
});

export default router;
