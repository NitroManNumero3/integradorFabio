export default class Asignatura {
  constructor(codigo, nombre, horasSemanales, curso, profesor) {
    this.codigo = codigo;
    this.nombre = nombre;
    this.horasSemanales = horasSemanales;
    this.curso = curso;
    this.profesor = profesor;
    this.alumnos = [];
    this.horarios = [];
  }

  matricularAlumno(alumno) {
    this.alumnos.push(alumno);
  }

  agregarHorario(horario) {
    this.horarios.push(horario);
  }

  mostrarDatos() {
    return `${this.codigo} - ${this.nombre} (${this.horasSemanales}h/semana)`;
  }
}