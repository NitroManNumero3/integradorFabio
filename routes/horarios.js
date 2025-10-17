import express from 'express';
import pool from '../db/pool.js';

// Crea un router de Express para gestionar las rutas de horarios
const router = express.Router();

/**
 * GET /horarios
 * Muestra el listado completo de todos los horarios de clase
 * Incluye información de asignatura, curso y aula
 */
router.get('/', async (req, res) => {
  try {
    // Consulta que une horario_clase con asignatura, curso y aula
    // Obtiene toda la información necesaria para mostrar el horario completo
    // Ordena por mes, día de la semana y hora de inicio
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
    // Renderiza la vista con el listado de horarios
    res.render('horarios', { horarios: rows });
  } catch (err) {
    console.error('❌ Error al obtener horarios:', err);
    res.status(500).send('Error al obtener horarios');
  }
});

export default router;