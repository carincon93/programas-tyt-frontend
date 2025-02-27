import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Nota } from "@/lib/types";
import { fetchNotasByEstudianteData } from "@/services/nota.service";
import { useEffect, useState } from "react";

interface NotasTableProps {
  estudianteId: string | undefined;
}

export default function NotasTable({ estudianteId }: NotasTableProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [notas, setNotas] = useState<Nota[]>([]);

  const fetchNotas = async () => {
    if (!estudianteId) return;

    const response = await fetchNotasByEstudianteData(+estudianteId);
    if (response.data) setNotas(response.data);
  };

  useEffect(() => {
    fetchNotas();
  }, []);

  console.log(notas);

  return (
    <div>
      <h1>Nota estudiante</h1>
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Nombre</TableHead>
            <TableHead className="text-left">Asignatura</TableHead>
            <TableHead className="text-left">Nota</TableHead>
            <TableHead className="text-left">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notas.map((nota) => (
            <TableRow key={nota.id}>
              <TableCell>
                {nota.estudiante.user.nombres +
                  " " +
                  nota.estudiante.user.apellidos}
              </TableCell>
              <TableCell>{nota.asignaturaProfesor.asignatura.nombre}</TableCell>
              <TableCell>{nota.nota}</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
