import express from 'express';
import pool from '../db/pool.js';

// Crea un router de Express para gestionar las rutas de cursos
const router = express.Router();

/**
 * GET /cursos
 * Muestra el listado completo de todos los cursos
 * Incluye el tutor asignado y el número de asignaturas de cada curso
 */
router.get('/', async (req, res) => {
  try {
    // Consulta que une curso con profesor y persona, y cuenta las asignaturas
    // LEFT JOIN permite incluir cursos sin tutor o sin asignaturas
    // GROUP BY agrupa por curso para contar las asignaturas
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
    // Renderiza la vista con el listado de cursos
    res.render('cursos', { cursos: rows });
  } catch (err) {
    console.error('❌ Error al obtener cursos:', err);
    res.status(500).send('Error al obtener cursos');
  }
});

/**
 * GET /cursos/:id
 * Muestra el detalle de un curso específico con todas sus asignaturas
 * @param {number} id - ID del curso
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extrae el ID de los parámetros de la URL
    
    // Primera consulta: obtiene los datos del curso y su tutor
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
    
    // Verifica si el curso existe
    if (curso.length === 0) {
      return res.status(404).send('Curso no encontrado');
    }
    
    // Segunda consulta: obtiene todas las asignaturas del curso
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
    
    // Renderiza la vista de detalle con los datos del curso y sus asignaturas
    res.render('cursoDetalle', { curso: curso[0], asignaturas });
  } catch (err) {
    console.error('❌ Error al obtener detalle del curso:', err);
    res.status(500).send('Error al obtener detalle del curso');
  }
});

export default router;