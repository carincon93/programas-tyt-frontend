import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Grupo } from "@/lib/types";
import { fetchGrupoByIdData } from "@/services/grupo.service";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface GruposTableProps {
  grupoId: string | undefined;
}

export default function GruposTable({ grupoId }: GruposTableProps) {
  const [grupo, setGrupo] = useState<Grupo>();

  const fetchGrupoById = async () => {
    if (!grupoId) return;

    const response = await fetchGrupoByIdData(+grupoId);
    if (response.data) setGrupo(response.data);
  };

  useEffect(() => {
    fetchGrupoById();
  }, []);

  console.log(grupo?.estudiantes);

  return (
    <div>
      <h1>
        <span className="bg-amber-500 py-1 px-4 rounded-md text-white">
          <strong className="mr-1">Programa:</strong> {grupo?.programa.nombre}
        </span>{" "}
        | <strong className="mr-1">Grupo:</strong> {grupo?.codigoGrupo}
      </h1>
      <hr className="mt-6" />
      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left w-[180px]">
              Código del estudiante
            </TableHead>
            <TableHead className="text-left">Nombre</TableHead>
            <TableHead className="text-left">Institución</TableHead>
            <TableHead className="text-right w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grupo && grupo.estudiantes.length > 0 ? (
            grupo.estudiantes.map((estudiante) => (
              <TableRow key={estudiante.id}>
                <TableCell>{estudiante.codigoEstudiante}</TableCell>
                <TableCell>
                  {estudiante.user.nombres + " " + estudiante.user.apellidos}
                </TableCell>
                <TableCell>{estudiante.institucion.nombre}</TableCell>

                <TableCell className="text-right">
                  <a
                    href={`/panel/grupos/${grupo.id}/estudiantes/${estudiante.id}/asignaturas`}
                    className="inline-flex justify-center items-center gap-1 underline hover:opacity-60"
                  >
                    <ExternalLink size={10} className="top-0.5 relative" />
                    Asignaturas
                  </a>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No hay datos para mostrar</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
