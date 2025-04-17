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
            <TableHead className="text-left border font-bold text-black">
              Estudiante
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Asignatura
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Profesor
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              ¿Asistió?
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Observación
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Fecha
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Periodo
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asistencias.length > 0 ? (
            asistencias.map((asistencia) => (
              <TableRow key={asistencia.id}>
                <TableCell className="border">
                  {asistencia.estudiante.user.nombres +
                    " " +
                    asistencia.estudiante.user.apellidos}
                </TableCell>
                <TableCell className="border">
                  {asistencia.asignaturaProfesor.asignatura.nombre}
                </TableCell>
                <TableCell className="border">
                  {asistencia.asignaturaProfesor.profesor.user.nombres +
                    " " +
                    asistencia.asignaturaProfesor.profesor.user.apellidos}
                </TableCell>
                <TableCell className="border">
                  {asistencia.asiste ? "Si" : "No"}
                </TableCell>
                <TableCell className="border">
                  {asistencia.observacion}
                </TableCell>
                <TableCell className="border">{asistencia.fecha}</TableCell>
                <TableCell className="border">{asistencia.periodo}</TableCell>
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
