import Persona from './persona.js';

export default class Alumno extends Persona {
  constructor(nombre, apellidos, direccion, poblacion, dni, fecha_nacimiento, codigo_postal, telefono) {
    super(nombre, apellidos, direccion, poblacion, dni, fecha_nacimiento, codigo_postal, telefono);
    this.matriculas = []; // Array de objetos { asignatura, nota, incidencias }
  }

  matricularEnAsignatura(asignatura, nota = null, incidencias = null) {
    this.matriculas.push({
      asignatura,
      nota,
      incidencias
    });
  }

  agregarIncidencia(asignaturaId, incidencia) {
    const matricula = this.matriculas.find(m => m.asignatura.id === asignaturaId);
    if (matricula) {
      if (!matricula.incidencias) {
        matricula.incidencias = incidencia;
      } else {
        matricula.incidencias += '; ' + incidencia;
      }
    }
  }

  actualizarNota(asignaturaId, nota) {
    const matricula = this.matriculas.find(m => m.asignatura.id === asignaturaId);
    if (matricula) {
      matricula.nota = nota;
    }
  }

  mostrarDatos() {
    return `Alumno: ${super.mostrarDatos()} - ${this.matriculas.length} asignaturas matriculadas`;
  }
}
