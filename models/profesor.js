import Persona from './persona.js';

export default class Profesor extends Persona {
  constructor(nombre, apellidos, direccion, poblacion, dni, fecha_nacimiento, codigo_postal, telefono, especialidad, cursos = []) {
    super(nombre, apellidos, direccion, poblacion, dni, fecha_nacimiento, codigo_postal, telefono);
    this.especialidad = especialidad;
    this.cursos = cursos;
  }

  agregarCurso(curso) {
    this.cursos.push(curso);
  }

  mostrarDatos() {
    return `Profesor: ${super.mostrarDatos()} - Especialidad: ${this.especialidad}`;
  }
}
