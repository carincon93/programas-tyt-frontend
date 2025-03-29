import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Asistencia, Estudiante } from "@/lib/types";
import { fetchAsistenciasByEstudianteData } from "@/services/asistencia.service";
import { fetchEstudianteByIdData } from "@/services/estudiante.service";
import { useEffect, useState } from "react";

interface AsistenciasTableProps {
  estudianteId: string | undefined;
}

export default function AsistenciasTable({
  estudianteId,
}: AsistenciasTableProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [estudiante, setEstudiante] = useState<Estudiante>();

  const fetchAsistencia = async () => {
    if (!estudianteId) return;

    const response = await fetchAsistenciasByEstudianteData(+estudianteId);
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
        <span className="bg-amber-500 py-1 px-4 rounded-md text-white">
          <strong>Estudiante:</strong>
          {estudiante ? (
            <span className="ml-2">
              {estudiante?.user.nombres + " " + estudiante?.user.apellidos}
            </span>
          ) : (
            <>Cargando..</>
          )}
        </span>
      </h1>
      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Fecha</TableHead>
            <TableHead className="text-left">Asignatura</TableHead>
            <TableHead className="text-left">Profesor</TableHead>
            <TableHead className="text-left">¿Asistió?</TableHead>
            <TableHead className="text-left">Observación</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asistencias.length > 0 ? (
            asistencias.map((asistencia) => (
              <TableRow key={asistencia.id}>
                <TableCell>{asistencia.fecha}</TableCell>
                <TableCell>
                  {asistencia.asignaturaProfesor.asignatura.nombre}
                </TableCell>
                <TableCell>
                  {asistencia.asignaturaProfesor.profesor.user.nombres +
                    " " +
                    asistencia.asignaturaProfesor.profesor.user.apellidos}
                </TableCell>
                <TableCell>{asistencia.asiste ? "Si" : "No"}</TableCell>
                <TableCell>{asistencia.observacion}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No hay datos para mostrar</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
