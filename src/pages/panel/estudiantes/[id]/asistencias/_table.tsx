import type { Asistencia, Estudiante } from "@/lib/types";
import { fetchAsistenciasData } from "@/services/asistencia.service";
import { fetchEstudianteByIdData } from "@/services/estudiante.service";
import { useEffect, useState } from "react";

interface AsistenciasTableProps {
  estudianteId: string | undefined;
}

export default function AsistenciasTable({
  estudianteId,
}: AsistenciasTableProps) {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [estudiante, setEstudiante] = useState<Estudiante>();

  const fetchAsistencia = async () => {
    if (!estudianteId) return;

    const response = await fetchAsistenciasData(+estudianteId);
    if (response.data) setAsistencias(response.data);
  };

  const fetchEstudiante = async () => {
    if (!estudianteId) return;

    const response = await fetchEstudianteByIdData(+estudianteId);
    if (response.data) setEstudiante(response.data);
  };

  useEffect(() => {
    fetchAsistencia();
    fetchEstudiante();
  }, []);

  console.log(asistencias);

  return (
    <div>
      <h1>
        Asistencia estudiante{" "}
        {estudiante?.user.nombres + " " + estudiante?.user.apellidos}
      </h1>
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="text-left">Asignatura</th>
            <th className="text-left">Asistencia</th>
            <th className="text-left">Fecha</th>
            <th className="text-left">Observación</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map((asistencia) => (
            <tr key={asistencia.id}>
              <td>{asistencia.asignatura.nombre}</td>
              <td>{asistencia.asiste ? "Si" : "No"}</td>
              <td>{asistencia.fecha}</td>
              <td>{asistencia.observacion}</td>
              <td>Acciones</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
