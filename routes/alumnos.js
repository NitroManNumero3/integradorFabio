import express from 'express';
import pool from '../db/pool.js';

// Crea un router de Express para gestionar las rutas de alumnos
const router = express.Router();

/**
 * GET /alumnos
 * Muestra el listado completo de todos los alumnos
 * Calcula la edad automáticamente a partir de la fecha de nacimiento
 */
router.get('/', async (req, res) => {
  try {
    // Consulta que une la tabla alumno con persona para obtener todos los datos
    // TIMESTAMPDIFF calcula la edad en años desde la fecha de nacimiento hasta hoy
    const [rows] = await pool.query(`
      SELECT 
        al.id AS alumno_id, 
        p.*, 
        TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) AS edad
      FROM alumno al 
      JOIN persona p ON p.id = al.persona_id
      ORDER BY p.apellidos, p.nombre
    `);
    // Renderiza la vista 'alumnos.ejs' pasando el array de alumnos
    res.render('alumnos', { alumnos: rows });
  } catch (err) {
    console.error('❌ Error en la base de datos:', err);
    res.status(500).send('Error al obtener los alumnos');
  }
});

/**
 * GET /alumnos/:id
 * Muestra el detalle de un alumno específico con todas sus matrículas
 * @param {number} id - ID del alumno
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extrae el ID de los parámetros de la URL
    
    // Primera consulta: obtiene los datos personales del alumno
    const [alumno] = await pool.query(`
      SELECT 
        al.id AS alumno_id, 
        p.*,
        TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) AS edad
      FROM alumno al 
      JOIN persona p ON p.id = al.persona_id
      WHERE al.id = ?
    `, [id]);
    
    // Verifica si el alumno existe
    if (alumno.length === 0) {
      return res.status(404).send('Alumno no encontrado');
    }
    
    // Segunda consulta: obtiene todas las matrículas del alumno
    // Incluye datos de asignatura, curso, profesor, nota e incidencias
    const [matriculas] = await pool.query(`
      SELECT 
        m.id,
        a.codigo,
        a.nombre AS asignatura,
        a.horas_semanales,
        c.nombre AS curso,
        CONCAT(p.nombre, ' ', p.apellidos) AS profesor,
        m.nota,
        m.incidencias
      FROM matricula m
      JOIN asignatura a ON m.asignatura_id = a.id
      JOIN curso c ON a.curso_id = c.id
      JOIN profesor pr ON a.profesor_id = pr.id
      JOIN persona p ON pr.persona_id = p.id
      WHERE m.alumno_id = ?
      ORDER BY c.nombre, a.nombre
    `, [id]);
    
    // Renderiza la vista de detalle con los datos del alumno y sus matrículas
    res.render('alumnoDetalle', { alumno: alumno[0], matriculas });
  } catch (err) {
    console.error('❌ Error al obtener detalle del alumno:', err);
    res.status(500).send('Error al obtener detalle del alumno');
  }
});

/**
 * GET /alumnos/matricular/:alumnoId
 * Muestra el formulario para matricular un alumno en una asignatura
 * Solo muestra asignaturas en las que el alumno NO está matriculado
 * @param {number} alumnoId - ID del alumno a matricular
 */
router.get('/matricular/:alumnoId', async (req, res) => {
  try {
    const { alumnoId } = req.params;
    
    // Obtiene los datos básicos del alumno
    const [alumno] = await pool.query(`
      SELECT al.id, CONCAT(p.nombre, ' ', p.apellidos) AS nombre_completo
      FROM alumno al
      JOIN persona p ON al.persona_id = p.id
      WHERE al.id = ?
    `, [alumnoId]);
    
    if (alumno.length === 0) {
      return res.status(404).send('Alumno no encontrado');
    }
    
    // Obtiene solo las asignaturas disponibles (no matriculadas)
    // Usa NOT IN para excluir asignaturas en las que ya está matriculado
    const [asignaturas] = await pool.query(`
      SELECT 
        a.id, 
        a.codigo,
        a.nombre,
        c.nombre AS curso
      FROM asignatura a
      JOIN curso c ON a.curso_id = c.id
      WHERE a.id NOT IN (
        SELECT asignatura_id FROM matricula WHERE alumno_id = ?
      )
      ORDER BY c.nombre, a.nombre
    `, [alumnoId]);
    
    // Renderiza el formulario de matrícula
    res.render('matricular', { alumno: alumno[0], asignaturas });
  } catch (err) {
    console.error('❌ Error al cargar formulario de matrícula:', err);
    res.status(500).send('Error al cargar formulario');
  }
});

/**
 * POST /alumnos/matricular
 * Procesa el formulario de matrícula y crea una nueva matrícula en la BD
 * Recibe los datos del formulario y los inserta en la tabla matricula
 */
router.post('/matricular', async (req, res) => {
  try {
    // Extrae los datos del cuerpo de la petición (formulario)
    const { alumno_id, asignatura_id, nota, incidencias } = req.body;
    
    // Inserta la nueva matrícula en la base de datos
    // Si nota o incidencias están vacíos, inserta NULL
    await pool.query(
      'INSERT INTO matricula (alumno_id, asignatura_id, nota, incidencias) VALUES (?, ?, ?, ?)',
      [alumno_id, asignatura_id, nota || null, incidencias || null]
    );
    
    // Redirige a la página de detalle del alumno
    res.redirect(`/alumnos/${alumno_id}`);
  } catch (err) {
    console.error('❌ Error al matricular al alumno:', err);
    res.status(500).send('Error al matricular al alumno');
  }
});

/**
 * POST /alumnos/matricula/:id/nota
 * Actualiza la nota de una matrícula específica
 * @param {number} id - ID de la matrícula a actualizar
 */
router.post('/matricula/:id/nota', async (req, res) => {
  try {
    const { id } = req.params;  // ID de la matrícula
    const { nota } = req.body;  // Nueva nota desde el formulario
    
    // Actualiza la nota en la base de datos
    const [result] = await pool.query(
      'UPDATE matricula SET nota = ? WHERE id = ?',
      [nota, id]
    );
    
    // Verifica si se actualizó algún registro
    if (result.affectedRows === 0) {
      return res.status(404).send('Matrícula no encontrada');
    }
    
    // Redirige a la página anterior
    res.redirect('back');
  } catch (err) {
    console.error('❌ Error al actualizar nota:', err);
    res.status(500).send('Error al actualizar nota');
  }
});

/**
 * POST /alumnos/matricula/:id/incidencia
 * Agrega una nueva incidencia a una matrícula existente
 * Si ya hay incidencias previas, las concatena con punto y coma
 * @param {number} id - ID de la matrícula
 */
router.post('/matricula/:id/incidencia', async (req, res) => {
  try {
    const { id } = req.params;        // ID de la matrícula
    const { incidencia } = req.body;  // Nueva incidencia desde el formulario
    
    // Primero obtiene las incidencias actuales de la matrícula
    const [current] = await pool.query(
      'SELECT incidencias FROM matricula WHERE id = ?',
      [id]
    );
    
    if (current.length === 0) {
      return res.status(404).send('Matrícula no encontrada');
    }
    
    // Si ya hay incidencias, las concatena con punto y coma
    // Si no hay incidencias previas, usa solo la nueva
    const nuevasIncidencias = current[0].incidencias 
      ? `${current[0].incidencias}; ${incidencia}`
      : incidencia;
    
    // Actualiza las incidencias en la base de datos
    await pool.query(
      'UPDATE matricula SET incidencias = ? WHERE id = ?',
      [nuevasIncidencias, id]
    );
    
    res.redirect('back');
  } catch (err) {
    console.error('❌ Error al agregar incidencia:', err);
    res.status(500).send('Error al agregar incidencia');
  }
});

/**
 * POST /alumnos/matricula/:id/eliminar
 * Elimina una matrícula de la base de datos
 * @param {number} id - ID de la matrícula a eliminar
 */
router.post('/matricula/:id/eliminar', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Elimina la matrícula de la base de datos
    await pool.query('DELETE FROM matricula WHERE id = ?', [id]);
    
    // Redirige a la página anterior
    res.redirect('back');
  } catch (err) {
    console.error('❌ Error al eliminar matrícula:', err);
    res.status(500).send('Error al eliminar matrícula');
  }
});

export default router;
