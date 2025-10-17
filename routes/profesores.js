import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// 📋 Listar profesores
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        pr.id AS profesor_id,
        p.*, 
        TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) AS edad
      FROM profesor pr
      JOIN persona p ON p.id = pr.persona_id
    `);
    res.render('profesores', { profesores: rows });
  } catch (err) {
    console.error('❌ Error al obtener profesores:', err);
    res.status(500).send('Error al obtener los profesores');
  }
});

// 📚 Ver asignaturas que imparte un profesor
router.get('/:id/asignaturas', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT a.id, a.nombre, a.horas_semanales
      FROM asignatura a
      WHERE a.profesor_id = ?
    `, [id]);
    res.render('asignaturasProfesor', { asignaturas: rows, profesorId: id });
  } catch (err) {
    console.error('❌ Error al obtener asignaturas del profesor:', err);
    res.status(500).send('Error al obtener asignaturas');
  }
});

export default router;
