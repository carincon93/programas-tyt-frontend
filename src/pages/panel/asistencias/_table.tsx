import type { Asistencia } from "@/lib/types";
import { fetchAsistenciasData } from "@/services/asistencia.service";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ListaAsistenciasTable() {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);

  const fetchAsistencias = async () => {
    const response = await fetchAsistenciasData();
    if (response.data) setAsistencias(response.data);
  };

  useEffect(() => {
    fetchAsistencias();
  }, []);

  console.log(asistencias);

  return (
    <div>
      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Estudiante</TableHead>
            <TableHead className="text-left">Asignatura</TableHead>
            <TableHead className="text-left">Profesor</TableHead>
            <TableHead className="text-left">¿Asistió?</TableHead>
            <TableHead className="text-left">Observación</TableHead>
            <TableHead className="text-left">Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asistencias.length > 0 ? (
            asistencias.map((asistencia) => (
              <TableRow key={asistencia.id}>
                <TableCell>
                  {asistencia.estudiante.user.nombres +
                    " " +
                    asistencia.estudiante.user.apellidos}
                </TableCell>
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
                <TableCell>{asistencia.fecha}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>No hay datos para mostrar</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
