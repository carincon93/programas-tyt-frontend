import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Estudiante, Nota } from "@/lib/types";
import { fetchEstudianteByIdData } from "@/services/estudiante.service";
import { fetchNotasByEstudianteData } from "@/services/nota.service";
import { useEffect, useState } from "react";

interface NotasTableProps {
  estudianteId: string | undefined;
}

export default function NotasTable({ estudianteId }: NotasTableProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [estudiante, setEstudiante] = useState<Estudiante>();

  const fetchNotas = async () => {
    if (!estudianteId) return;

    const response = await fetchNotasByEstudianteData(+estudianteId);
    if (response.data) setNotas(response.data);
  };

  const fetchEstudiante = async () => {
    if (!estudianteId) return;

    const response = await fetchEstudianteByIdData(+estudianteId);
    if (response.data) setEstudiante(response.data);
  };

  useEffect(() => {
    fetchNotas();
    fetchEstudiante();
  }, []);

  console.log(notas);

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
      <hr className="mt-6" />
      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Asignatura</TableHead>
            <TableHead className="text-left">Profesor</TableHead>
            <TableHead className="text-left">Nota</TableHead>
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
                <TableCell>{nota.nota}</TableCell>
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
