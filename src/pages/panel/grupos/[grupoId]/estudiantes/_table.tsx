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
        Grupo {grupo?.codigoGrupo} / Programa {grupo?.programa.nombre}
      </h1>
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Código del estudiante</TableHead>
            <TableHead className="text-left">Nombre</TableHead>
            <TableHead className="text-left">Institución</TableHead>
            <TableHead className="text-left">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grupo?.estudiantes.map((estudiante) => (
            <TableRow key={estudiante.id}>
              <TableCell>{estudiante.codigoEstudiante}</TableCell>
              <TableCell>
                {estudiante.user.nombres + " " + estudiante.user.apellidos}
              </TableCell>
              <TableCell>{estudiante.institucion.nombre}</TableCell>

              <TableCell>
                <a
                  href={`/panel/grupos/${grupo.id}/estudiantes/${estudiante.id}/asignaturas`}
                >
                  Asignaturas
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
