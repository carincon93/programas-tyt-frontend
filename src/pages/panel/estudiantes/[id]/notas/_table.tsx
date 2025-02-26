import type { Nota } from "@/lib/types";
import { fetchNotasData } from "@/services/nota.service";
import { useEffect, useState } from "react";

interface NotasTableProps {
  estudianteId: string | undefined;
}

export default function NotasTable({ estudianteId }: NotasTableProps) {
  const [notas, setNotas] = useState<Nota[]>([]);

  const fetchNotas = async () => {
    if (!estudianteId) return;

    const response = await fetchNotasData(+estudianteId);
    if (response.data) setNotas(response.data);
  };

  useEffect(() => {
    fetchNotas();
  }, []);

  console.log(notas);

  return (
    <div>
      <h1>Nota estudiante</h1>
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="text-left">Nombre</th>
            <th className="text-left">Asignatura</th>
            <th className="text-left">Nota</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((nota) => (
            <tr key={nota.id}>
              <td>
                {nota.estudiante.user.nombres +
                  " " +
                  nota.estudiante.user.apellidos}
              </td>
              <td>{nota.asignatura.nombre}</td>
              <td>{nota.nota}</td>
              <td>Acciones</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
