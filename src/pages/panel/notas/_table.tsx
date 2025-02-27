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
            <TableHead className="text-left">Asignatura</TableHead>
            <TableHead className="text-left">Profesor</TableHead>
            <TableHead className="text-left">Estudiante</TableHead>
            <TableHead className="text-left">Nota</TableHead>
            <TableHead className="text-left">Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notas.length > 0 ? (
            notas.map((nota) => (
              <TableRow key={nota.id}>
                <TableCell>
                  {nota.asignaturaProfesor.asignatura.nombre}
                </TableCell>
                <TableCell>
                  {nota.asignaturaProfesor.profesor.user.nombres +
                    " " +
                    nota.asignaturaProfesor.profesor.user.apellidos}
                </TableCell>
                <TableCell>
                  {nota.estudiante.user.nombres +
                    " " +
                    nota.estudiante.user.apellidos}
                </TableCell>
                <TableCell>{nota.nota}</TableCell>
                <TableCell>{nota.fecha}</TableCell>
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
