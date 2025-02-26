export interface User {
  id: number | undefined;
  nombres: string;
  apellidos: string;
  correo: string;
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
  estudianteGrupos: EstudianteGrupo[];
}

export interface Profesor {
  id: number;
  universidadId: number;

  universidad: Universidad;
  user: User;
}

export interface Estudiante {
  id: number;
  codigoEstudiante: string;
  institucionId: number;

  institucion: Institucion;
  user: User;
  estudianteGrupos: EstudianteGrupo[];
}

export interface EstudianteGrupo {
  id: number;

  estudiante: Estudiante;
  grupo: Grupo;
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
  asignaturaId: number;
  estudiante: Estudiante;
  asignatura: Asignatura;
}

export interface Asistencia {
  id: number;
  asiste: boolean;
  fecha: string;
  observacion: string;
  estudianteId: number;
  asignaturaId: number;
  estudiante: Estudiante;
  asignatura: Asignatura;
}
