import Persona from './persona.js';

export default class Alumno extends Persona {
  constructor(nombre, apellidos, direccion, poblacion, dni, fecha_nacimiento, codigo_postal, telefono, matriculas = []) {
    super(nombre, apellidos, direccion, poblacion, dni, fecha_nacimiento, codigo_postal, telefono);
    this.matriculas = matriculas; // lista de asignaturas o notas
  }

  agregarMatricula(matricula) {
    this.matriculas.push(matricula);
  }

  mostrarDatos() {
    return `Alumno: ${super.mostrarDatos()} - ${this.matriculas.length} materias`;
  }
}
