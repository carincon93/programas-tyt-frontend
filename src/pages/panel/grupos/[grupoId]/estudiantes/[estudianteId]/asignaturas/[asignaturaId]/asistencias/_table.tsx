import type { Estudiante, Asistencia } from "@/lib/types";
import {
  deleteAsistencia,
  fetchAsistenciasByEstudianteData,
} from "@/services/asistencia.service";
import { fetchEstudianteByIdData } from "@/services/estudiante.service";
import { useEffect, useState } from "react";
import AsistenciaForm from "./_form";

interface EstudianteAsistenciasTableProps {
  asignaturaId: string | undefined;
  estudianteId: string | undefined;
}

export default function EstudianteAsistenciasTable({
  asignaturaId,
  estudianteId,
}: EstudianteAsistenciasTableProps) {
  const [asistenciaSelected, setAsistenciaSelected] = useState<Asistencia>();
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [estudiante, setEstudiante] = useState<Estudiante>();

  const fetchAsistenciasByEstudiante = async () => {
    if (!estudianteId) return;

    const response = await fetchAsistenciasByEstudianteData(+estudianteId);
    if (response.data) setAsistencias(response.data);
  };

  const fetchEstudianteById = async () => {
    if (!estudianteId) return;

    const response = await fetchEstudianteByIdData(+estudianteId);
    if (response.data) setEstudiante(response.data);
  };

  const refreshAsistencias = async () => {
    fetchAsistenciasByEstudiante();
    setAsistenciaSelected(undefined);
  };

  const removeAsistencia = async (asistencia: Asistencia) => {
    const response = await deleteAsistencia(asistencia);
    if (response.ok) refreshAsistencias();
  };

  useEffect(() => {
    fetchAsistenciasByEstudiante();
    fetchEstudianteById();
  }, []);

  console.log(asistencias);

  return (
    <div>
      <h1 className="uppercase">{estudiante?.user.nombres}</h1>
      <div>
        {estudianteId && asignaturaId && (
          <AsistenciaForm
            key={asistenciaSelected?.id}
            asistencia={asistenciaSelected}
            estudianteId={+estudianteId}
            asignaturaId={+asignaturaId}
            onAsistenciaCreatedOrUpdated={refreshAsistencias}
          />
        )}
      </div>
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="text-left">Asignatura</th>
            <th className="text-left">¿Asistió?</th>
            <th className="text-left">Fecha</th>
            <th className="text-left">Observación</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map((asistencia) => (
            <tr>
              <td>{asistencia.asignatura.nombre}</td>
              <td>{asistencia.asiste ? "Si" : "No"}</td>
              <td>{asistencia.fecha}</td>
              <td>{asistencia.observacion}</td>
              <td>
                Acciones
                <button
                  onClick={() => setAsistenciaSelected(asistencia)}
                  className="btn btn-primary"
                >
                  Editar
                </button>
                <button
                  onClick={() => removeAsistencia(asistencia)}
                  className="btn btn-danger"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
