import express from 'express';
import pool from '../db/pool.js';

// Crea un router de Express para gestionar las rutas de aulas
const router = express.Router();

/**
 * GET /aulas
 * Muestra el listado completo de todas las aulas
 * Incluye el número de pupitres y la cantidad de horarios asignados
 */
router.get('/', async (req, res) => {
  try {
    // Consulta que obtiene todas las aulas y cuenta sus horarios
    // LEFT JOIN permite incluir aulas sin horarios asignados
    // GROUP BY agrupa por aula para contar los horarios
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
    // Renderiza la vista con el listado de aulas
    res.render('aulas', { aulas: rows });
  } catch (err) {
    console.error('❌ Error al obtener aulas:', err);
    res.status(500).send('Error al obtener aulas');
  }
});

/**
 * GET /aulas/:id
 * Muestra el detalle de un aula específica con todos sus horarios
 * @param {number} id - ID del aula
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extrae el ID de los parámetros de la URL
    
    // Primera consulta: obtiene los datos del aula
    const [aula] = await pool.query(`
      SELECT id, codigo, piso, num_pupitres
      FROM aula
      WHERE id = ?
    `, [id]);
    
    // Verifica si el aula existe
    if (aula.length === 0) {
      return res.status(404).send('Aula no encontrada');
    }
    
    // Segunda consulta: obtiene todos los horarios asignados al aula
    // Incluye información de la asignatura y curso
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
    
    // Renderiza la vista de detalle con los datos del aula y sus horarios
    res.render('aulaDetalle', { aula: aula[0], horarios });
  } catch (err) {
    console.error('❌ Error al obtener detalle del aula:', err);
    res.status(500).send('Error al obtener detalle del aula');
  }
});

export default router;