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
import { ExternalLink } from "lucide-react";
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
      <h1 className="bg-amber-500 py-1 pr-4 rounded-md text-white inline-block">
        <span className="bg-amber-500 py-1 pl-4 rounded-md text-white mr-2 font-medium">
          Estudiante:{" "}
        </span>

        {estudiante ? (
          <>{estudiante?.user.nombres + " " + estudiante?.user.apellidos}</>
        ) : (
          <>Cargando..</>
        )}
      </h1>

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
              Periodo #1
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Periodo #2
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Periodo #3
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Periodo #4
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asignaturasGrupo.length > 0 ? (
            asignaturasGrupo.map((asignaturaGrupo) => (
              <TableRow key={asignaturaGrupo.id}>
                <TableCell className="border">
                  {asignaturaGrupo.asignaturaProfesor.asignatura.nombre}
                </TableCell>
                <TableCell className="border">
                  {asignaturaGrupo.asignaturaProfesor.profesor.user.nombres}{" "}
                  {asignaturaGrupo.asignaturaProfesor.profesor.user.apellidos}
                </TableCell>
                <TableCell className="border">
                  Nota:{" "}
                  {estudiante?.notas
                    .filter(
                      (nota) =>
                        nota.asignaturaProfesorId ===
                        asignaturaGrupo.asignaturaProfesorId
                        && nota.periodo === "1"
                    )
                    .map((nota) => (
                      <div key={nota.id}>{nota.nota}</div>
                    ))}
                </TableCell>
                <TableCell className="border">
                  Nota:{" "}
                  {estudiante?.notas
                    .filter(
                      (nota) =>
                        nota.asignaturaProfesorId ===
                        asignaturaGrupo.asignaturaProfesorId
                        && nota.periodo === "2"
                    )
                    .map((nota) => (
                      <div key={nota.id}>{nota.nota}</div>
                    ))}
                </TableCell>
                <TableCell className="border">
                  Nota:{" "}
                  {estudiante?.notas
                    .filter(
                      (nota) =>
                        nota.asignaturaProfesorId ===
                        asignaturaGrupo.asignaturaProfesorId
                        && nota.periodo === "3"
                    )
                    .map((nota) => (
                      <div key={nota.id}>{nota.nota}</div>
                    ))}
                </TableCell>
                <TableCell className="border">
                  Nota:{" "}
                  {estudiante?.notas
                    .filter(
                      (nota) =>
                        nota.asignaturaProfesorId ===
                        asignaturaGrupo.asignaturaProfesorId
                        && nota.periodo === "4"
                    )
                    .map((nota) => (
                      <div key={nota.id}>{nota.nota}</div>
                    ))}
                </TableCell>
                {/* <TableCell className="space-y-2">
                  <a
                    href={`/panel/grupos/${grupoId}/estudiantes/${estudiante?.id}/asignaturas/${asignaturaGrupo.asignaturaProfesor.id}/notas`}
                    className="inline-flex justify-center items-center gap-1 underline hover:opacity-60"
                  >
                    <ExternalLink size={10} className="top-0.5 relative" />
                    Notas
                  </a>

                  <a
                    href={`/panel/grupos/${grupoId}/estudiantes/${estudiante?.id}/asignaturas/${asignaturaGrupo.asignaturaProfesor.id}/asistencias`}
                    className="inline-flex justify-center items-center gap-1 underline hover:opacity-60"
                  >
                    <ExternalLink size={10} className="top-0.5 relative" />
                    Asistencias
                  </a>
                </TableCell> */}
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
