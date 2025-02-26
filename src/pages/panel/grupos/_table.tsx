import type { Grupo } from "@/lib/types";
import { fetchGruposData, deleteGrupo } from "@/services/grupo.service";
import { useEffect, useState } from "react";
import GrupoForm from "./_form";

export default function GruposTable() {
  const [grupoSelected, setGrupoSelected] = useState<Grupo>();
  const [grupos, setGrupos] = useState<Grupo[]>([]);

  const fetchGrupos = async () => {
    const response = await fetchGruposData();
    if (response.data) setGrupos(response.data);
  };

  const refreshGrupos = async () => {
    fetchGrupos();
    setGrupoSelected(undefined);
  };

  const removeGrupo = async (grupo: Grupo) => {
    const response = await deleteGrupo(grupo);
    if (response.ok) refreshGrupos();
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  console.log(grupos);

  return (
    <div>
      <h1>Grupos</h1>
      <div>
        <GrupoForm
          key={grupoSelected?.id}
          grupo={grupoSelected}
          onGrupoCreatedOrUpdated={refreshGrupos}
        />
      </div>
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="text-left">Código del grupo</th>
            <th className="text-left">Programa</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {grupos.map((grupo) => (
            <tr key={grupo.id}>
              <td>{grupo.codigoGrupo}</td>
              <td>{grupo.programa.nombre}</td>
              <td>
                <a href={`/panel/grupos/${grupo.id}/estudiantes`}>
                  Estudiantes
                </a>
                <button
                  onClick={() => setGrupoSelected(grupo)}
                  className="btn btn-primary"
                >
                  Editar
                </button>
                <button
                  onClick={() => removeGrupo(grupo)}
                  className="btn btn-danger"
                >
                  Eliminar
                </button>
                Acciones
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
