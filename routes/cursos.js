import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// 📋 Listar todos los cursos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id,
        c.codigo,
        c.nombre,
        CONCAT(p.nombre, ' ', p.apellidos) AS tutor,
        pr.id AS tutor_id,
        COUNT(DISTINCT a.id) AS num_asignaturas
      FROM curso c
      LEFT JOIN profesor pr ON c.tutor_id = pr.id
      LEFT JOIN persona p ON pr.persona_id = p.id
      LEFT JOIN asignatura a ON a.curso_id = c.id
      GROUP BY c.id, c.codigo, c.nombre, p.nombre, p.apellidos, pr.id
      ORDER BY c.codigo
    `);
    res.render('cursos', { cursos: rows });
  } catch (err) {
    console.error('❌ Error al obtener cursos:', err);
    res.status(500).send('Error al obtener cursos');
  }
});

// 📝 Ver detalle de un curso
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Datos del curso
    const [curso] = await pool.query(`
      SELECT 
        c.id,
        c.codigo,
        c.nombre,
        pr.id AS tutor_id,
        CONCAT(p.nombre, ' ', p.apellidos) AS tutor
      FROM curso c
      LEFT JOIN profesor pr ON c.tutor_id = pr.id
      LEFT JOIN persona p ON pr.persona_id = p.id
      WHERE c.id = ?
    `, [id]);
    
    if (curso.length === 0) {
      return res.status(404).send('Curso no encontrado');
    }
    
    // Asignaturas del curso
    const [asignaturas] = await pool.query(`
      SELECT 
        a.id,
        a.codigo,
        a.nombre,
        a.horas_semanales,
        CONCAT(p.nombre, ' ', p.apellidos) AS profesor
      FROM asignatura a
      JOIN profesor pr ON a.profesor_id = pr.id
      JOIN persona p ON pr.persona_id = p.id
      WHERE a.curso_id = ?
      ORDER BY a.nombre
    `, [id]);
    
    res.render('cursoDetalle', { curso: curso[0], asignaturas });
  } catch (err) {
    console.error('❌ Error al obtener detalle del curso:', err);
    res.status(500).send('Error al obtener detalle del curso');
  }
});

export default router;