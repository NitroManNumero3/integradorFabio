import Persona from './persona.js';

/**
 * Clase Profesor
 * Extiende la clase Persona y añade funcionalidad específica para profesores
 * Gestiona las asignaturas que imparte y la tutoría de cursos
 */
export default class Profesor extends Persona {
  /**
   * Constructor de la clase Profesor
   * @param {string} especialidad - Especialidad del profesor (ej: Matemáticas, Historia)
   */
  constructor(nombre, apellidos, direccion, poblacion, dni, fecha_nacimiento, codigo_postal, telefono, especialidad) {
    super(nombre, apellidos, direccion, poblacion, dni, fecha_nacimiento, codigo_postal, telefono);
    this.especialidad = especialidad;
    this.asignaturas = []; // Array de asignaturas que imparte el profesor
    this.esTutor = false;  // Indica si el profesor es tutor de algún curso
    this.cursoTutor = null; // Referencia al curso del que es tutor (solo puede ser tutor de uno)
  }

  /**
   * Agrega una asignatura a la lista de asignaturas que imparte el profesor
   * @param {Object} asignatura - Objeto con los datos de la asignatura
   */
  agregarAsignatura(asignatura) {
    this.asignaturas.push(asignatura);
  }

  /**
   * Asigna una tutoría de curso al profesor
   * @param {Object} curso - Objeto con los datos del curso
   */
  asignarTutoria(curso) {
    this.esTutor = true;
    this.cursoTutor = curso;
  }

  /**
   * Remueve la tutoría del profesor
   * Establece esTutor en false y elimina la referencia al curso
   */
  removerTutoria() {
    this.esTutor = false;
    this.cursoTutor = null;
  }

  /**
   * Muestra los datos del profesor incluyendo especialidad y tutoría
   * @returns {string} Cadena con la información completa del profesor
   */
  mostrarDatos() {
    // Añade información de tutoría solo si el profesor es tutor
    const tutoria = this.esTutor ? ` - Tutor de ${this.cursoTutor.nombre}` : '';
    return `Profesor: ${super.mostrarDatos()} - Especialidad: ${this.especialidad}${tutoria}`;
  }
}
