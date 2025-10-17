import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// 📋 Listar todos los horarios
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        h.id,
        a.codigo AS asignatura_codigo,
        a.nombre AS asignatura,
        c.nombre AS curso,
        au.codigo AS aula,
        au.piso,
        h.dia_semana,
        h.mes,
        h.hora_inicio,
        h.hora_fin
      FROM horario_clase h
      JOIN asignatura a ON h.asignatura_id = a.id
      JOIN curso c ON a.curso_id = c.id
      JOIN aula au ON h.aula_id = au.id
      ORDER BY h.mes, h.dia_semana, h.hora_inicio
    `);
    res.render('horarios', { horarios: rows });
  } catch (err) {
    console.error('❌ Error al obtener horarios:', err);
    res.status(500).send('Error al obtener horarios');
  }
});

export default router;