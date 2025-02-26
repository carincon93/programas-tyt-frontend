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

  console.log(grupo?.estudianteGrupos);

  return (
    <div>
      <h1>
        Grupo {grupo?.codigoGrupo} / Programa {grupo?.programa.nombre}
      </h1>
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="text-left">Código del estudiante</th>
            <th className="text-left">Nombre</th>
            <th className="text-left">Institución</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {grupo?.estudianteGrupos.map((estudianteGrupo) => (
            <tr key={estudianteGrupo.id}>
              <td>{estudianteGrupo.estudiante.codigoEstudiante}</td>
              <td>
                {estudianteGrupo.estudiante.user.nombres +
                  " " +
                  estudianteGrupo.estudiante.user.apellidos}
              </td>
              <td>{estudianteGrupo.estudiante.institucion.nombre}</td>

              <td>
                Acciones
                <a
                  href={`/panel/grupos/${grupo.id}/estudiantes/${estudianteGrupo.estudiante.id}/asignaturas`}
                >
                  Asignaturas
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
