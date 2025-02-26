import type { AsignaturaGrupo, Estudiante } from "@/lib/types";
import { fetchAsignaturaGrupoByEstudianteData } from "@/services/asignatura-grupo.service";
import { fetchEstudianteByIdData } from "@/services/estudiante.service";
import { useEffect, useState } from "react";

interface EstudianteAsignaturasTableProps {
  grupoId: string | undefined;
  estudianteId: string | undefined;
}

export default function EstudianteAsignaturasTable({
  grupoId,
  estudianteId,
}: EstudianteAsignaturasTableProps) {
  const [asignaturasGrupo, setAsignaturasGrupo] = useState<AsignaturaGrupo[]>(
    []
  );
  const [estudiante, setEstudiante] = useState<Estudiante>();

  const fetchAsignaturaById = async () => {
    if (!estudianteId) return;

    const response = await fetchAsignaturaGrupoByEstudianteData(+estudianteId);
    if (response.data) setAsignaturasGrupo(response.data);
  };

  const fetchEstudianteById = async () => {
    if (!estudianteId) return;

    const response = await fetchEstudianteByIdData(+estudianteId);
    if (response.data) setEstudiante(response.data);
  };

  useEffect(() => {
    fetchAsignaturaById();
    fetchEstudianteById();
  }, []);

  return (
    <div>
      <h1 className="uppercase">{estudiante?.user.nombres}</h1>

      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="text-left">Asignatura</th>
            <th className="text-left">Fecha</th>
            <th className="text-left">Hora inicio / Hora fin</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asignaturasGrupo.map((asignaturaGrupo) => (
            <tr>
              <td>{asignaturaGrupo.asignaturaProfesor.asignatura.nombre}</td>
              <td>{asignaturaGrupo.fecha}</td>
              <td>
                {asignaturaGrupo.horaInicio + " - " + asignaturaGrupo.horaFin}
              </td>
              <td>
                Acciones
                <a
                  href={`/panel/grupos/${grupoId}/estudiantes/${estudiante?.id}/asignaturas/${asignaturaGrupo.asignaturaProfesor.asignatura.id}/notas`}
                >
                  Notas
                </a>
                <a
                  href={`/panel/grupos/${grupoId}/estudiantes/${estudiante?.id}/asignaturas/${asignaturaGrupo.asignaturaProfesor.asignatura.id}/asistencias`}
                >
                  Asistencias
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
