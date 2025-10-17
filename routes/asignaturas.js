import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// 📋 Listar todas las asignaturas
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.id,
        a.codigo,
        a.nombre, 
        a.horas_semanales, 
        c.nombre AS curso,
        c.codigo AS codigo_curso,
        CONCAT(p.nombre, ' ', p.apellidos) AS profesor
      FROM asignatura a
      LEFT JOIN curso c ON a.curso_id = c.id
      LEFT JOIN profesor pr ON a.profesor_id = pr.id
      LEFT JOIN persona p ON pr.persona_id = p.id
      ORDER BY c.nombre, a.nombre
    `);
    res.render('asignaturas', { asignaturas: rows });
  } catch (err) {
    console.error('❌ Error al obtener asignaturas:', err);
    res.status(500).send('Error al obtener asignaturas');
  }
});

// 📝 Ver detalle de una asignatura
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Datos de la asignatura
    const [asignatura] = await pool.query(`
      SELECT 
        a.id,
        a.codigo,
        a.nombre,
        a.horas_semanales,
        c.id AS curso_id,
        c.nombre AS curso,
        pr.id AS profesor_id,
        CONCAT(p.nombre, ' ', p.apellidos) AS profesor
      FROM asignatura a
      JOIN curso c ON a.curso_id = c.id
      JOIN profesor pr ON a.profesor_id = pr.id
      JOIN persona p ON pr.persona_id = p.id
      WHERE a.id = ?
    `, [id]);
    
    if (asignatura.length === 0) {
      return res.status(404).send('Asignatura no encontrada');
    }
    
    // Alumnos matriculados
    const [alumnos] = await pool.query(`
      SELECT 
        m.id AS matricula_id,
        al.id AS alumno_id,
        CONCAT(p.nombre, ' ', p.apellidos) AS alumno,
        m.nota,
        m.incidencias
      FROM matricula m
      JOIN alumno al ON m.alumno_id = al.id
      JOIN persona p ON al.persona_id = p.id
      WHERE m.asignatura_id = ?
      ORDER BY p.apellidos, p.nombre
    `, [id]);
    
    // Horarios de la asignatura
    const [horarios] = await pool.query(`
      SELECT 
        h.id,
        au.codigo AS aula,
        au.piso,
        h.dia_semana,
        h.mes,
        h.hora_inicio,
        h.hora_fin
      FROM horario_clase h
      JOIN aula au ON h.aula_id = au.id
      WHERE h.asignatura_id = ?
      ORDER BY h.mes, h.dia_semana, h.hora_inicio
    `, [id]);
    
    res.render('asignaturaDetalle', { 
      asignatura: asignatura[0], 
      alumnos, 
      horarios 
    });
  } catch (err) {
    console.error('❌ Error al obtener detalle de asignatura:', err);
    res.status(500).send('Error al obtener detalle de asignatura');
  }
});

// ➕ Formulario para agregar una nueva asignatura
router.get('/nueva', async (req, res) => {
  try {
    const [profesores] = await pool.query(`
      SELECT pr.id, CONCAT(per.nombre, ' ', per.apellidos) AS nombre_completo
      FROM profesor pr 
      JOIN persona per ON per.id = pr.persona_id
      ORDER BY per.apellidos, per.nombre
    `);
    const [cursos] = await pool.query(`
      SELECT id, codigo, nombre 
      FROM curso
      ORDER BY codigo
    `);
    res.render('nuevaAsignatura', { profesores, cursos });
  } catch (err) {
    console.error('❌ Error al cargar formulario:', err);
    res.status(500).send('Error al cargar formulario');
  }
});

// 🧠 Procesar nueva asignatura
router.post('/nueva', async (req, res) => {
  try {
    const { codigo, nombre, horas_semanales, curso_id, profesor_id } = req.body;
    await pool.query(`
      INSERT INTO asignatura (codigo, nombre, horas_semanales, curso_id, profesor_id)
      VALUES (?, ?, ?, ?, ?)
    `, [codigo, nombre, horas_semanales, curso_id, profesor_id]);
    res.redirect('/asignaturas');
  } catch (err) {
    console.error('❌ Error al guardar asignatura:', err);
    res.status(500).send('Error al guardar asignatura');
  }
});

export default router;
