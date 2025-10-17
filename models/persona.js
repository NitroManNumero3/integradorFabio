export default class persona {
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

  mostrarDatos() {
    return `${this.nombre} ${this.apellidos} (${this.dni})`;
  }
}
