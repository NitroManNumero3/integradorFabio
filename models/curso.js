export default class Curso {
  constructor(codigo, nombre, tutor = null) {
    this.codigo = codigo;
    this.nombre = nombre;
    this.tutor = tutor;
    this.asignaturas = [];
  }

  agregarAsignatura(asignatura) {
    this.asignaturas.push(asignatura);
  }

  asignarTutor(profesor) {
    this.tutor = profesor;
  }

  mostrarDatos() {
    return `Curso: ${this.codigo} - ${this.nombre}`;
  }
}