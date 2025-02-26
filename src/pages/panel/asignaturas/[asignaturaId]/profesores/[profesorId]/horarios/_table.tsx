import type { AsignaturaGrupo, AsignaturaProfesor } from "@/lib/types";
import { fetchAsignaturasByProfesorData } from "@/services/profesor.service";
import { useEffect, useState } from "react";
import AsignaturaHorarioForm from "./_form";
import { deleteAsignaturaGrupo } from "@/services/asignatura-grupo.service";

interface HorarioTableProps {
  asignaturaProfesorId: string | undefined;
  profesorId: string | undefined;
}

export default function HorarioTable({
  asignaturaProfesorId,
  profesorId,
}: HorarioTableProps) {
  const [asignaturaGrupoSelected, setAsignaturaGrupoelected] =
    useState<AsignaturaGrupo>();

  const [asignaturasProfesor, setAsignaturasProfesor] = useState<
    AsignaturaProfesor[]
  >([]);

  const fetchHorario = async () => {
    if (!profesorId) return;

    const response = await fetchAsignaturasByProfesorData(+profesorId);
    if (response.data) setAsignaturasProfesor(response.data);
  };

  const refreshHorario = async () => {
    fetchHorario();
    setAsignaturaGrupoelected(undefined);
  };

  const removeAsignaturaGrupo = async (asignaturaGrupo: AsignaturaGrupo) => {
    const response = await deleteAsignaturaGrupo(asignaturaGrupo);
    if (response.ok) refreshHorario();
  };

  useEffect(() => {
    fetchHorario();
  }, []);

  console.log(asignaturasProfesor);

  return (
    <div>
      <h1>Horario</h1>
      <div>
        {asignaturaProfesorId && (
          <AsignaturaHorarioForm
            key={asignaturaGrupoSelected?.id}
            asignaturaGrupo={asignaturaGrupoSelected}
            asignaturaProfesorId={+asignaturaProfesorId}
            onAsignaturaHorarioCreatedOrUpdated={refreshHorario}
          />
        )}
      </div>
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="text-left">Fecha</th>
            <th className="text-left">Programa / Grupo</th>
            <th className="text-left">Hora inicio / Hora fin</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asignaturasProfesor.map((asignaturaProfesor) => (
            <>
              {asignaturaProfesor.horarios.length > 0 ? (
                asignaturaProfesor.horarios.map((horario) => (
                  <tr key={horario.id}>
                    <td>{horario.fecha}</td>
                    <td>
                      {horario.grupo.programa.nombre} {" / "}
                      {horario.grupo.codigoGrupo}
                    </td>
                    <td>
                      {horario.horaInicio}-{horario.horaFin}
                    </td>

                    <td>
                      Acciones
                      <button
                        onClick={() => setAsignaturaGrupoelected(horario)}
                        className="btn btn-primary"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => removeAsignaturaGrupo(horario)}
                        className="btn btn-danger"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>No hay datos para mostrar</td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
