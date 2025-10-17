import express from 'express';
import pool from '../db/pool.js';

// Crea un router de Express para gestionar las rutas de profesores
const router = express.Router();

/**
 * GET /profesores
 * Muestra el listado completo de todos los profesores
 * Incluye su especialidad y el curso del que son tutores (si aplica)
 */
router.get('/', async (req, res) => {
  try {
    // Consulta que une profesor con persona y curso (LEFT JOIN para incluir profesores sin tutoría)
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
    // Renderiza la vista con el listado de profesores
    res.render('profesores', { profesores: rows });
  } catch (err) {
    console.error('❌ Error al obtener profesores:', err);
    res.status(500).send('Error al obtener los profesores');
  }
});

/**
 * GET /profesores/:id
 * Muestra el detalle de un profesor específico con todas las asignaturas que imparte
 * @param {number} id - ID del profesor
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extrae el ID de los parámetros de la URL
    
    // Primera consulta: obtiene los datos personales del profesor y su tutoría
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
    
    // Verifica si el profesor existe
    if (profesor.length === 0) {
      return res.status(404).send('Profesor no encontrado');
    }
    
    // Segunda consulta: obtiene todas las asignaturas que imparte el profesor
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
    
    // Renderiza la vista de detalle con los datos del profesor y sus asignaturas
    res.render('profesorDetalle', { profesor: profesor[0], asignaturas });
  } catch (err) {
    console.error('❌ Error al obtener detalle del profesor:', err);
    res.status(500).send('Error al obtener detalle del profesor');
  }
});

/**
 * GET /profesores/:id/asignaturas
 * Muestra una vista específica con todas las asignaturas que imparte un profesor
 * Ruta alternativa a la vista de detalle del profesor
 * @param {number} id - ID del profesor
 */
router.get('/:id/asignaturas', async (req, res) => {
  try {
    const { id } = req.params;
    // Obtiene todas las asignaturas del profesor con información del curso
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
    // Renderiza una vista específica para las asignaturas del profesor
    res.render('asignaturasProfesor', { asignaturas: rows, profesorId: id });
  } catch (err) {
    console.error('❌ Error al obtener asignaturas del profesor:', err);
    res.status(500).send('Error al obtener asignaturas');
  }
});

export default router;
