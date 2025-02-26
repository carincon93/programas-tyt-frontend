import type { Programa } from "@/lib/types";
import {
  fetchProgramasData,
  deletePrograma,
} from "@/services/programa.service";
import { useEffect, useState } from "react";
import ProgramaForm from "./_form";

export default function ProgramasTable() {
  const [programaSelected, setProgramaSelected] = useState<Programa>();
  const [programas, setProgramas] = useState<Programa[]>([]);

  const fetchProgramas = async () => {
    const response = await fetchProgramasData();
    if (response.data) setProgramas(response.data);
  };

  const refreshProgramas = async () => {
    fetchProgramas();
    setProgramaSelected(undefined);
  };

  const removePrograma = async (programa: Programa) => {
    const response = await deletePrograma(programa);
    if (response.ok) refreshProgramas();
  };

  useEffect(() => {
    fetchProgramas();
  }, []);

  console.log(programas);

  return (
    <div>
      <h1>Programas</h1>
      <div>
        <ProgramaForm
          key={programaSelected?.id}
          programa={programaSelected}
          onProgramaCreatedOrUpdated={refreshProgramas}
        />
      </div>
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="text-left">Nombre</th>
            <th className="text-left">Código del programa</th>
            <th className="text-left">Universidad</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {programas.map((programa) => (
            <tr key={programa.id}>
              <td>{programa.nombre}</td>
              <td>{programa.codigoPrograma}</td>
              <td>{programa.universidad.nombre}</td>
              <td>
                Acciones
                <button
                  onClick={() => setProgramaSelected(programa)}
                  className="btn btn-primary"
                >
                  Editar
                </button>
                <button
                  onClick={() => removePrograma(programa)}
                  className="btn btn-danger"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
