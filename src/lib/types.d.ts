export interface User {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  telefono: string;
  direccion: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

export interface Universidad {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface Institucion {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface Grupo {
  id: number;
  codigoGrupo: string;
  programaId: number;

  programa: Programa;
  estudiantes: Estudiante[];
}

export interface Profesor {
  id: number;
  universidadId: number;

  universidad: Universidad;
  user: Partial<User>;
}

export interface Estudiante {
  id: number;
  codigoEstudiante: string;
  institucionId: number;
  userId: number;
  grupoId: number;

  institucion: Institucion;
  user: Partial<User>;
  grupo: Partial<Grupo>;
}

export interface Asignatura {
  id: number;
  codigoAsignatura: string;
  nombre: string;

  asignaturaProfesores: AsignaturaProfesor[];
}

export interface AsignaturaGrupo {
  id: number;

  fecha: string;
  horaInicio: string;
  horaFin: string;

  asignaturaProfesorId: number;
  asignaturaProfesor: AsignaturaProfesor;

  grupo: Grupo;
  grupoId: number;
}

export interface AsignaturaProfesor {
  id: number;

  profesor: Profesor;
  asignatura: Asignatura;
  horarios: AsignaturaGrupo[];
}

export interface Programa {
  id: number;
  codigoPrograma: string;
  nombre: string;
  universidadId: number;

  universidad: Universidad;
}

export interface Nota {
  id: number;
  nota: number;
  fecha: string;
  observacion: string;
  estudianteId: number;
  asignaturaProfesorId: number;
  estudiante: Estudiante;
  asignaturaProfesor: AsignaturaProfesor;
}

export interface Asistencia {
  id: number;
  asiste: boolean;
  fecha: string;
  observacion: string;
  estudianteId: number;
  asignaturaProfesorId: number;
  estudiante: Estudiante;
  asignaturaProfesor: AsignaturaProfesor;
}

export interface Login {
  email: string;
  password: string;
}
