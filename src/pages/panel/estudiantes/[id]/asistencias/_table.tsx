import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const [open, setOpen] = useState<boolean>(false);
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
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Asignatura</TableHead>
            <TableHead className="text-left">Asistencia</TableHead>
            <TableHead className="text-left">Fecha</TableHead>
            <TableHead className="text-left">Observación</TableHead>
            <TableHead className="text-left">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asistencias.map((asistencia) => (
            <TableRow key={asistencia.id}>
              <TableCell>{asistencia.asignaturaProfesor.asignatura.nombre}</TableCell>
              <TableCell>{asistencia.asiste ? "Si" : "No"}</TableCell>
              <TableCell>{asistencia.fecha}</TableCell>
              <TableCell>{asistencia.observacion}</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
