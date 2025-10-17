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
        pr.especialidad,
        TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) AS edad,
        c.nombre AS curso_tutor
      FROM profesor pr
      JOIN persona p ON p.id = pr.persona_id
      LEFT JOIN curso c ON c.tutor_id = pr.id
      ORDER BY p.apellidos, p.nombre
    `);
    res.render('profesores', { profesores: rows });
  } catch (err) {
    console.error('❌ Error al obtener profesores:', err);
    res.status(500).send('Error al obtener los profesores');
  }
});

// 📝 Ver detalle de un profesor
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Datos del profesor
    const [profesor] = await pool.query(`
      SELECT 
        pr.id AS profesor_id,
        p.*,
        pr.especialidad,
        TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) AS edad,
        c.id AS curso_tutor_id,
        c.nombre AS curso_tutor
      FROM profesor pr
      JOIN persona p ON p.id = pr.persona_id
      LEFT JOIN curso c ON c.tutor_id = pr.id
      WHERE pr.id = ?
    `, [id]);
    
    if (profesor.length === 0) {
      return res.status(404).send('Profesor no encontrado');
    }
    
    // Asignaturas que imparte
    const [asignaturas] = await pool.query(`
      SELECT 
        a.id,
        a.codigo,
        a.nombre,
        a.horas_semanales,
        c.nombre AS curso
      FROM asignatura a
      JOIN curso c ON a.curso_id = c.id
      WHERE a.profesor_id = ?
      ORDER BY c.nombre, a.nombre
    `, [id]);
    
    res.render('profesorDetalle', { profesor: profesor[0], asignaturas });
  } catch (err) {
    console.error('❌ Error al obtener detalle del profesor:', err);
    res.status(500).send('Error al obtener detalle del profesor');
  }
});

// 📚 Ver asignaturas que imparte un profesor
router.get('/:id/asignaturas', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        a.id, 
        a.codigo,
        a.nombre, 
        a.horas_semanales,
        c.nombre AS curso
      FROM asignatura a
      JOIN curso c ON a.curso_id = c.id
      WHERE a.profesor_id = ?
      ORDER BY c.nombre, a.nombre
    `, [id]);
    res.render('asignaturasProfesor', { asignaturas: rows, profesorId: id });
  } catch (err) {
    console.error('❌ Error al obtener asignaturas del profesor:', err);
    res.status(500).send('Error al obtener asignaturas');
  }
});

export default router;
