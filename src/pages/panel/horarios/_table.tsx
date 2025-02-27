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
            <TableHead className="text-left">Fecha</TableHead>
            <TableHead className="text-left">Hora inicio / Hora fin</TableHead>
            <TableHead className="text-left">Asignatura</TableHead>
            <TableHead className="text-left">Profesor</TableHead>
            <TableHead className="text-left">Programa / Grupo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {horarios.length > 0 ? (
            horarios.map((horario) => (
              <TableRow key={horario.id}>
                <TableCell>{horario.fecha}</TableCell>
                <TableCell>
                  {horario.horaInicio}
                  {" - "}
                  {horario.horaFin}
                </TableCell>
                <TableCell>
                  {horario.asignaturaProfesor.asignatura.nombre}
                </TableCell>
                <TableCell>
                  {horario.asignaturaProfesor.profesor.user.nombres +
                    " " +
                    horario.asignaturaProfesor.profesor.user.apellidos}
                </TableCell>
                <TableCell>
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
