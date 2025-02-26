import type { Estudiante } from "@/lib/types";
import {
  fetchEstudiantesData,
  deleteEstudiante,
} from "@/services/estudiante.service";
import { useEffect, useState } from "react";
import EstudianteForm from "./_form";

export default function EstudiantesTable() {
  const [estudianteSelected, setEstudianteSelected] = useState<Estudiante>();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);

  const fetchEstudiantes = async () => {
    const response = await fetchEstudiantesData();
    if (response.data) setEstudiantes(response.data);
  };

  const refreshEstudiantes = async () => {
    fetchEstudiantes();
    setEstudianteSelected(undefined);
  };

  const removeEstudiante = async (estudiante: Estudiante) => {
    const response = await deleteEstudiante(estudiante);
    if (response.ok) refreshEstudiantes();
  };

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  console.log(estudiantes);

  return (
    <div>
      <h1>Estudiantes</h1>
      <div>
        <EstudianteForm
          key={estudianteSelected?.id}
          estudiante={estudianteSelected}
          onEstudianteCreatedOrUpdated={refreshEstudiantes}
        />
      </div>

      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="text-left">Código</th>
            <th className="text-left">Nombre</th>
            <th className="text-left">Institución</th>
            <th className="text-left">Programa / Grupo</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((estudiante) => (
            <tr key={estudiante.id}>
              <td>{estudiante.codigoEstudiante}</td>
              <td>
                {estudiante.user.nombres + " " + estudiante.user.apellidos}
              </td>
              <td>{estudiante.institucion.nombre}</td>
              <td>
                {estudiante.estudianteGrupos.map((estudianteGrupo) => (
                  <div key={estudianteGrupo.id}>
                    {estudianteGrupo.grupo.programa.nombre}
                    {" / "}
                    {estudianteGrupo.grupo.codigoGrupo}
                  </div>
                ))}
              </td>
              <td>
                <a href={`/panel/estudiantes/${estudiante.id}/notas`}>Notas</a>
                <a href={`/panel/estudiantes/${estudiante.id}/asistencias`}>
                  Asistencia
                </a>
                <button
                  onClick={() => setEstudianteSelected(estudiante)}
                  className="btn btn-primary"
                >
                  Editar
                </button>
                <button
                  onClick={() => removeEstudiante(estudiante)}
                  className="btn btn-danger"
                >
                  Eliminar
                </button>
                Acciones
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
