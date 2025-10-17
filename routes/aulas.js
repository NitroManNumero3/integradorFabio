import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// 📋 Listar todas las aulas
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.id,
        a.codigo,
        a.piso,
        a.num_pupitres,
        COUNT(h.id) AS num_horarios
      FROM aula a
      LEFT JOIN horario_clase h ON h.aula_id = a.id
      GROUP BY a.id, a.codigo, a.piso, a.num_pupitres
      ORDER BY a.piso, a.codigo
    `);
    res.render('aulas', { aulas: rows });
  } catch (err) {
    console.error('❌ Error al obtener aulas:', err);
    res.status(500).send('Error al obtener aulas');
  }
});

// 📝 Ver detalle de un aula
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Datos del aula
    const [aula] = await pool.query(`
      SELECT id, codigo, piso, num_pupitres
      FROM aula
      WHERE id = ?
    `, [id]);
    
    if (aula.length === 0) {
      return res.status(404).send('Aula no encontrada');
    }
    
    // Horarios del aula
    const [horarios] = await pool.query(`
      SELECT 
        h.id,
        a.codigo AS asignatura_codigo,
        a.nombre AS asignatura,
        c.nombre AS curso,
        h.dia_semana,
        h.mes,
        h.hora_inicio,
        h.hora_fin
      FROM horario_clase h
      JOIN asignatura a ON h.asignatura_id = a.id
      JOIN curso c ON a.curso_id = c.id
      WHERE h.aula_id = ?
      ORDER BY h.mes, h.dia_semana, h.hora_inicio
    `, [id]);
    
    res.render('aulaDetalle', { aula: aula[0], horarios });
  } catch (err) {
    console.error('❌ Error al obtener detalle del aula:', err);
    res.status(500).send('Error al obtener detalle del aula');
  }
});

export default router;