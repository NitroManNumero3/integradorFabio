-- ============================================
-- ESQUEMA DE BASE DE DATOS: CENTRO DE ENSEÑANZA
-- ============================================

DROP DATABASE IF EXISTS centro;
CREATE DATABASE centro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE centro;

-- ============================================
-- TABLA: persona
-- Almacena datos comunes de alumnos y profesores
-- ============================================
CREATE TABLE persona (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(200) NOT NULL,
    direccion VARCHAR(255),
    poblacion VARCHAR(100),
    dni VARCHAR(20) UNIQUE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    codigo_postal VARCHAR(10),
    telefono VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: alumno
-- Extiende persona para alumnos
-- ============================================
CREATE TABLE alumno (
    id INT AUTO_INCREMENT PRIMARY KEY,
    persona_id INT UNIQUE NOT NULL,
    FOREIGN KEY (persona_id) REFERENCES persona(id) ON DELETE CASCADE
);

-- ============================================
-- TABLA: profesor
-- Extiende persona para profesores
-- ============================================
CREATE TABLE profesor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    persona_id INT UNIQUE NOT NULL,
    especialidad VARCHAR(100),
    FOREIGN KEY (persona_id) REFERENCES persona(id) ON DELETE CASCADE
);

-- ============================================
-- TABLA: curso
-- Almacena los cursos del centro
-- ============================================
CREATE TABLE curso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tutor_id INT UNIQUE,
    FOREIGN KEY (tutor_id) REFERENCES profesor(id) ON DELETE SET NULL
);

-- ============================================
-- TABLA: asignatura
-- Almacena las asignaturas del centro
-- ============================================
CREATE TABLE asignatura (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    horas_semanales INT NOT NULL,
    curso_id INT NOT NULL,
    profesor_id INT NOT NULL,
    FOREIGN KEY (curso_id) REFERENCES curso(id) ON DELETE CASCADE,
    FOREIGN KEY (profesor_id) REFERENCES profesor(id) ON DELETE RESTRICT
);

-- ============================================
-- TABLA: matricula
-- Relación muchos a muchos entre alumno y asignatura
-- ============================================
CREATE TABLE matricula (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumno_id INT NOT NULL,
    asignatura_id INT NOT NULL,
    nota DECIMAL(4,2) CHECK (nota >= 0 AND nota <= 10),
    incidencias TEXT,
    fecha_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alumno_id) REFERENCES alumno(id) ON DELETE CASCADE,
    FOREIGN KEY (asignatura_id) REFERENCES asignatura(id) ON DELETE CASCADE,
    UNIQUE KEY unique_matricula (alumno_id, asignatura_id)
);

-- ============================================
-- TABLA: aula
-- Almacena las aulas del centro
-- ============================================
CREATE TABLE aula (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    piso INT NOT NULL,
    num_pupitres INT NOT NULL CHECK (num_pupitres > 0)
);

-- ============================================
-- TABLA: horario_clase
-- Registro de asignaturas impartidas en aulas
-- ============================================
CREATE TABLE horario_clase (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asignatura_id INT NOT NULL,
    aula_id INT NOT NULL,
    dia_semana ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado') NOT NULL,
    mes INT NOT NULL CHECK (mes >= 1 AND mes <= 12),
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    FOREIGN KEY (asignatura_id) REFERENCES asignatura(id) ON DELETE CASCADE,
    FOREIGN KEY (aula_id) REFERENCES aula(id) ON DELETE CASCADE,
    CHECK (hora_fin > hora_inicio)
);

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================

-- Insertar personas (profesores)
INSERT INTO persona (nombre, apellidos, direccion, poblacion, dni, fecha_nacimiento, codigo_postal, telefono) VALUES
('Juan', 'García Pérez', 'Calle Mayor 123', 'Madrid', '12345678A', '1980-05-15', '28001', '600111222'),
('María', 'López Martínez', 'Av. Constitución 45', 'Madrid', '23456789B', '1975-08-20', '28002', '600222333'),
('Carlos', 'Rodríguez Sánchez', 'Plaza España 7', 'Madrid', '34567890C', '1982-03-10', '28003', '600333444'),
('Ana', 'Fernández Gómez', 'Calle Luna 89', 'Madrid', '45678901D', '1978-11-25', '28004', '600444555');

-- Insertar profesores
INSERT INTO profesor (persona_id, especialidad) VALUES
(1, 'Matemáticas'),
(2, 'Lengua y Literatura'),
(3, 'Ciencias Naturales'),
(4, 'Historia');

-- Insertar personas (alumnos)
INSERT INTO persona (nombre, apellidos, direccion, poblacion, dni, fecha_nacimiento, codigo_postal, telefono) VALUES
('Pedro', 'Martín Ruiz', 'Calle Sol 12', 'Madrid', '56789012E', '2005-01-15', '28005', '600555666'),
('Laura', 'González Torres', 'Av. Libertad 34', 'Madrid', '67890123F', '2006-04-22', '28006', '600666777'),
('Diego', 'Sánchez Moreno', 'Calle Paz 56', 'Madrid', '78901234G', '2005-09-30', '28007', '600777888'),
('Sofía', 'Jiménez Ramos', 'Plaza Mayor 78', 'Madrid', '89012345H', '2006-12-05', '28008', '600888999');

-- Insertar alumnos
INSERT INTO alumno (persona_id) VALUES (5), (6), (7), (8);

-- Insertar cursos
INSERT INTO curso (codigo, nombre, tutor_id) VALUES
('1ESO', '1º ESO', 1),
('2ESO', '2º ESO', 2),
('3ESO', '3º ESO', NULL),
('4ESO', '4º ESO', NULL);

-- Insertar asignaturas
INSERT INTO asignatura (codigo, nombre, horas_semanales, curso_id, profesor_id) VALUES
('MAT1', 'Matemáticas I', 4, 1, 1),
('LEN1', 'Lengua y Literatura I', 4, 1, 2),
('CNA1', 'Ciencias Naturales I', 3, 1, 3),
('HIS1', 'Historia I', 3, 1, 4),
('MAT2', 'Matemáticas II', 4, 2, 1),
('LEN2', 'Lengua y Literatura II', 4, 2, 2),
('CNA2', 'Ciencias Naturales II', 3, 2, 3);

-- Insertar matrículas
INSERT INTO matricula (alumno_id, asignatura_id, nota, incidencias) VALUES
(1, 1, 8.5, NULL),
(1, 2, 7.0, 'Falta ocasional de deberes'),
(1, 3, 9.0, NULL),
(2, 1, 6.5, NULL),
(2, 2, 8.0, NULL),
(3, 5, 7.5, NULL),
(3, 6, 8.5, NULL),
(4, 5, 9.0, 'Excelente participación');

-- Insertar aulas
INSERT INTO aula (codigo, piso, num_pupitres) VALUES
('A101', 1, 30),
('A102', 1, 25),
('A201', 2, 30),
('A202', 2, 28),
('LAB1', 0, 20);

-- Insertar horarios de clase
INSERT INTO horario_clase (asignatura_id, aula_id, dia_semana, mes, hora_inicio, hora_fin) VALUES
(1, 1, 'Lunes', 1, '08:00:00', '09:00:00'),
(1, 1, 'Miércoles', 1, '08:00:00', '09:00:00'),
(2, 2, 'Martes', 1, '09:00:00', '10:00:00'),
(2, 2, 'Jueves', 1, '09:00:00', '10:00:00'),
(3, 5, 'Viernes', 1, '10:00:00', '11:00:00'),
(5, 3, 'Lunes', 1, '10:00:00', '11:00:00'),
(6, 3, 'Martes', 1, '11:00:00', '12:00:00');