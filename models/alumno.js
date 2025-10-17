import Persona from './persona.js';

/**
 * Clase Alumno
 * Extiende la clase Persona y añade funcionalidad específica para alumnos
 * Gestiona las matrículas, notas e incidencias del alumno
 */
export default class Alumno extends Persona {
  /**
   * Constructor de la clase Alumno
   * Hereda todos los parámetros de Persona
   */
  constructor(nombre, apellidos, direccion, poblacion, dni, fecha_nacimiento, codigo_postal, telefono) {
    super(nombre, apellidos, direccion, poblacion, dni, fecha_nacimiento, codigo_postal, telefono);
    // Array que almacena las matrículas del alumno
    // Cada elemento es un objeto: { asignatura, nota, incidencias }
    this.matriculas = [];
  }

  /**
   * Matricula al alumno en una asignatura
   * @param {Object} asignatura - Objeto con los datos de la asignatura
   * @param {number|null} nota - Nota del alumno (opcional)
   * @param {string|null} incidencias - Incidencias registradas (opcional)
   */
  matricularEnAsignatura(asignatura, nota = null, incidencias = null) {
    this.matriculas.push({
      asignatura,
      nota,
      incidencias
    });
  }

  /**
   * Agrega una incidencia a una matrícula específica
   * @param {number} asignaturaId - ID de la asignatura
   * @param {string} incidencia - Texto de la incidencia a agregar
   */
  agregarIncidencia(asignaturaId, incidencia) {
    // Busca la matrícula correspondiente a la asignatura
    const matricula = this.matriculas.find(m => m.asignatura.id === asignaturaId);
    if (matricula) {
      // Si no hay incidencias previas, asigna la nueva
      if (!matricula.incidencias) {
        matricula.incidencias = incidencia;
      } else {
        // Si ya hay incidencias, las concatena con punto y coma
        matricula.incidencias += '; ' + incidencia;
      }
    }
  }

  /**
   * Actualiza la nota de una matrícula específica
   * @param {number} asignaturaId - ID de la asignatura
   * @param {number} nota - Nueva nota a asignar
   */
  actualizarNota(asignaturaId, nota) {
    // Busca la matrícula y actualiza su nota
    const matricula = this.matriculas.find(m => m.asignatura.id === asignaturaId);
    if (matricula) {
      matricula.nota = nota;
    }
  }

  /**
   * Muestra los datos del alumno incluyendo el número de matrículas
   * @returns {string} Cadena con la información del alumno
   */
  mostrarDatos() {
    return `Alumno: ${super.mostrarDatos()} - ${this.matriculas.length} asignaturas matriculadas`;
  }
}
