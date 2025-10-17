export default class Aula {
  constructor(codigo, piso, numPupitres) {
    this.codigo = codigo;
    this.piso = piso;
    this.numPupitres = numPupitres;
    this.horarios = [];
  }

  agregarHorario(horario) {
    this.horarios.push(horario);
  }

  mostrarDatos() {
    return `Aula ${this.codigo} - Piso ${this.piso} (${this.numPupitres} pupitres)`;
  }
}