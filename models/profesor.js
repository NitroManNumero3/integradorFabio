import Persona from './persona.js';

export default class Profesor extends Persona {
  constructor(nombre, apellidos, direccion, poblacion, dni, fecha_nacimiento, codigo_postal, telefono, especialidad) {
    super(nombre, apellidos, direccion, poblacion, dni, fecha_nacimiento, codigo_postal, telefono);
    this.especialidad = especialidad;
    this.asignaturas = []; // Asignaturas que imparte
    this.esTutor = false;
    this.cursoTutor = null; // Curso del que es tutor (solo uno)
  }

  agregarAsignatura(asignatura) {
    this.asignaturas.push(asignatura);
  }

  asignarTutoria(curso) {
    this.esTutor = true;
    this.cursoTutor = curso;
  }

  removerTutoria() {
    this.esTutor = false;
    this.cursoTutor = null;
  }

  mostrarDatos() {
    const tutoria = this.esTutor ? ` - Tutor de ${this.cursoTutor.nombre}` : '';
    return `Profesor: ${super.mostrarDatos()} - Especialidad: ${this.especialidad}${tutoria}`;
  }
}
