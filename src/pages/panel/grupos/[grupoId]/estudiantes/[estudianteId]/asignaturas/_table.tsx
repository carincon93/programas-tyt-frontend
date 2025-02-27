import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AsignaturaGrupo, Estudiante } from "@/lib/types";
import { fetchAsignaturaGrupoByEstudianteData } from "@/services/asignatura-grupo.service";
import { fetchEstudianteByIdData } from "@/services/estudiante.service";
import { useEffect, useState } from "react";

interface EstudianteAsignaturasTableProps {
  grupoId: string | undefined;
  estudianteId: string | undefined;
}

export default function EstudianteAsignaturasTable({
  grupoId,
  estudianteId,
}: EstudianteAsignaturasTableProps) {
  const [asignaturasGrupo, setAsignaturasGrupo] = useState<AsignaturaGrupo[]>(
    []
  );
  const [estudiante, setEstudiante] = useState<Estudiante>();

  const fetchAsignaturaById = async () => {
    if (!estudianteId) return;

    const response = await fetchAsignaturaGrupoByEstudianteData(+estudianteId);
    if (response.data) setAsignaturasGrupo(response.data);
  };

  const fetchEstudianteById = async () => {
    if (!estudianteId) return;

    const response = await fetchEstudianteByIdData(+estudianteId);
    if (response.data) setEstudiante(response.data);
  };

  useEffect(() => {
    fetchAsignaturaById();
    fetchEstudianteById();
  }, []);

  console.log(asignaturasGrupo);

  return (
    <div>
      <h1 className="uppercase">{estudiante?.user.nombres}</h1>

      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Asignatura</TableHead>
            <TableHead className="text-left">Profesor</TableHead>
            <TableHead className="text-left">Fecha</TableHead>
            <TableHead className="text-left">Hora inicio / Hora fin</TableHead>
            <TableHead className="text-left">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asignaturasGrupo.map((asignaturaGrupo) => (
            <TableRow key={asignaturaGrupo.id}>
              <TableCell>
                {asignaturaGrupo.asignaturaProfesor.asignatura.nombre}
              </TableCell>
              <TableCell>
                {asignaturaGrupo.asignaturaProfesor.profesor.user.nombres}{" "}
                {asignaturaGrupo.asignaturaProfesor.profesor.user.apellidos}
              </TableCell>
              <TableCell>{asignaturaGrupo.fecha}</TableCell>
              <TableCell>
                {asignaturaGrupo.horaInicio + " - " + asignaturaGrupo.horaFin}
              </TableCell>
              <TableCell>
                <a
                  href={`/panel/grupos/${grupoId}/estudiantes/${estudiante?.id}/asignaturas/${asignaturaGrupo.asignaturaProfesor.id}/notas`}
                >
                  Notas
                </a>
                <a
                  href={`/panel/grupos/${grupoId}/estudiantes/${estudiante?.id}/asignaturas/${asignaturaGrupo.asignaturaProfesor.id}/asistencias`}
                >
                  Asistencias
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
