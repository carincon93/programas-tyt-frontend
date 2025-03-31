import type { Nota } from "@/lib/types";
import { fetchNotasData } from "@/services/nota.service";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function NotasTable() {
  const [notas, setNotas] = useState<Nota[]>([]);

  const fetchProgramas = async () => {
    const response = await fetchNotasData();
    if (response.data) setNotas(response.data);
  };

  useEffect(() => {
    fetchProgramas();
  }, []);

  console.log(notas);

  return (
    <div>
      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left border font-bold text-black">
              Asignatura
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Profesor
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Estudiante
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Nota
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Fecha
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notas.length > 0 ? (
            notas.map((nota) => (
              <TableRow key={nota.id}>
                <TableCell className="border">
                  {nota.asignaturaProfesor.asignatura.nombre}
                </TableCell>
                <TableCell className="border">
                  {nota.asignaturaProfesor.profesor.user.nombres +
                    " " +
                    nota.asignaturaProfesor.profesor.user.apellidos}
                </TableCell>
                <TableCell className="border">
                  {nota.estudiante.user.nombres +
                    " " +
                    nota.estudiante.user.apellidos}
                </TableCell>
                <TableCell className="border">{nota.nota}</TableCell>
                <TableCell className="border">{nota.fecha}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>No hay datos para mostrar</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
