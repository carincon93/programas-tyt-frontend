import type { AsignaturaGrupo, Programa } from "@/lib/types";
import { fetchAsignaturasGrupoData } from "@/services/asignatura-grupo.service";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function HorariosTable() {
  const [horarios, setHorarios] = useState<AsignaturaGrupo[]>([]);

  const fetchProgramas = async () => {
    const response = await fetchAsignaturasGrupoData();
    if (response.data) setHorarios(response.data);
  };

  useEffect(() => {
    fetchProgramas();
  }, []);

  console.log(horarios);

  return (
    <div>
      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left border font-bold text-black">
              Fecha
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Hora inicio / Hora fin
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Asignatura
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Profesor
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Programa / Grupo
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {horarios.length > 0 ? (
            horarios.map((horario) => (
              <TableRow key={horario.id}>
                <TableCell className="border">{horario.fecha}</TableCell>
                <TableCell className="border">
                  {horario.horaInicio}
                  {" - "}
                  {horario.horaFin}
                </TableCell>
                <TableCell className="border">
                  {horario.asignaturaProfesor.asignatura.nombre}
                </TableCell>
                <TableCell className="border">
                  {horario.asignaturaProfesor.profesor.user.nombres +
                    " " +
                    horario.asignaturaProfesor.profesor.user.apellidos}
                </TableCell>
                <TableCell className="border">
                  {horario.grupo.programa.nombre} {" / "}
                  {horario.grupo.codigoGrupo}
                </TableCell>
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
