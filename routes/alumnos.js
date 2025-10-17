import express from 'express';
import pool from '../db/pool.js';

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
      ORDER BY p.apellidos, p.nombre
    `);
    res.render('alumnos', { alumnos: rows });
  } catch (err) {
    console.error('❌ Error en la base de datos:', err);
    res.status(500).send('Error al obtener los alumnos');
  }
});

// 📝 Ver detalle de un alumno con sus matrículas
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Datos del alumno
    const [alumno] = await pool.query(`
      SELECT 
        al.id AS alumno_id, 
        p.*,
        TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) AS edad
      FROM alumno al 
      JOIN persona p ON p.id = al.persona_id
      WHERE al.id = ?
    `, [id]);
    
    if (alumno.length === 0) {
      return res.status(404).send('Alumno no encontrado');
    }
    
    // Matrículas del alumno
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
    
    res.render('alumnoDetalle', { alumno: alumno[0], matriculas });
  } catch (err) {
    console.error('❌ Error al obtener detalle del alumno:', err);
    res.status(500).send('Error al obtener detalle del alumno');
  }
});

// 🧾 Formulario para matricular un alumno (GET)
router.get('/matricular/:alumnoId', async (req, res) => {
  try {
    const { alumnoId } = req.params;
    
    // Obtener alumno
    const [alumno] = await pool.query(`
      SELECT al.id, CONCAT(p.nombre, ' ', p.apellidos) AS nombre_completo
      FROM alumno al
      JOIN persona p ON al.persona_id = p.id
      WHERE al.id = ?
    `, [alumnoId]);
    
    if (alumno.length === 0) {
      return res.status(404).send('Alumno no encontrado');
    }
    
    // Obtener asignaturas disponibles (no matriculadas)
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
    
    res.render('matricular', { alumno: alumno[0], asignaturas });
  } catch (err) {
    console.error('❌ Error al cargar formulario de matrícula:', err);
    res.status(500).send('Error al cargar formulario');
  }
});

// 🧠 Procesar matrícula (POST)
router.post('/matricular', async (req, res) => {
  try {
    const { alumno_id, asignatura_id, nota, incidencias } = req.body;
    
    await pool.query(
      'INSERT INTO matricula (alumno_id, asignatura_id, nota, incidencias) VALUES (?, ?, ?, ?)',
      [alumno_id, asignatura_id, nota || null, incidencias || null]
    );
    
    res.redirect(`/alumnos/${alumno_id}`);
  } catch (err) {
    console.error('❌ Error al matricular al alumno:', err);
    res.status(500).send('Error al matricular al alumno');
  }
});

// ✏️ Actualizar nota de una matrícula
router.post('/matricula/:id/nota', async (req, res) => {
  try {
    const { id } = req.params;
    const { nota } = req.body;
    
    const [result] = await pool.query(
      'UPDATE matricula SET nota = ? WHERE id = ?',
      [nota, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).send('Matrícula no encontrada');
    }
    
    res.redirect('back');
  } catch (err) {
    console.error('❌ Error al actualizar nota:', err);
    res.status(500).send('Error al actualizar nota');
  }
});

// 📝 Agregar incidencia a una matrícula
router.post('/matricula/:id/incidencia', async (req, res) => {
  try {
    const { id } = req.params;
    const { incidencia } = req.body;
    
    // Obtener incidencias actuales
    const [current] = await pool.query(
      'SELECT incidencias FROM matricula WHERE id = ?',
      [id]
    );
    
    if (current.length === 0) {
      return res.status(404).send('Matrícula no encontrada');
    }
    
    const nuevasIncidencias = current[0].incidencias 
      ? `${current[0].incidencias}; ${incidencia}`
      : incidencia;
    
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

// 🗑️ Eliminar matrícula
router.post('/matricula/:id/eliminar', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM matricula WHERE id = ?', [id]);
    
    res.redirect('back');
  } catch (err) {
    console.error('❌ Error al eliminar matrícula:', err);
    res.status(500).send('Error al eliminar matrícula');
  }
});

export default router;
