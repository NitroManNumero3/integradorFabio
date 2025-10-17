/**
 * Clase base Persona
 * Representa los datos comunes de cualquier persona en el sistema
 * Esta clase es heredada por Alumno y Profesor
 */
export default class persona {
  /**
   * Constructor de la clase Persona
   * @param {string} nombre - Nombre de la persona
   * @param {string} apellidos - Apellidos de la persona
   * @param {string} direccion - Dirección completa
   * @param {string} poblacion - Ciudad o población
   * @param {string} dni - Documento Nacional de Identidad
   * @param {Date} fecha_nacimiento - Fecha de nacimiento
   * @param {string} codigo_postal - Código postal
   * @param {string} telefono - Número de teléfono
   */
  constructor(nombre, apellidos, direccion, poblacion, dni, fecha_nacimiento, codigo_postal, telefono) {
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.direccion = direccion;
    this.poblacion = poblacion;
    this.dni = dni;
    this.fecha_nacimiento = fecha_nacimiento;
    this.codigo_postal = codigo_postal;
    this.telefono = telefono;
  }

  /**
   * Método para mostrar los datos básicos de la persona
   * @returns {string} Cadena con nombre, apellidos y DNI
   */
  mostrarDatos() {
    return `${this.nombre} ${this.apellidos} (${this.dni})`;
  }
}
