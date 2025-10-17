export default class HorarioClase {
  constructor(asignatura, aula, diaSemana, mes, horaInicio, horaFin) {
    this.asignatura = asignatura;
    this.aula = aula;
    this.diaSemana = diaSemana;
    this.mes = mes;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
  }

  mostrarDatos() {
    return `${this.asignatura.nombre} - ${this.aula.codigo} (${this.diaSemana} ${this.horaInicio}-${this.horaFin})`;
  }
}