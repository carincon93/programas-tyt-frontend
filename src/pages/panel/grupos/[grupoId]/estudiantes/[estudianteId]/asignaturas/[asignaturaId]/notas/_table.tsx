import type { Estudiante, Nota } from "@/lib/types";
import {
  deleteNota,
  fetchNotasByEstudianteData,
} from "@/services/nota.service";
import { fetchEstudianteByIdData } from "@/services/estudiante.service";
import { useEffect, useState } from "react";
import NotaForm from "./_form";

interface EstudianteNotasTableProps {
  asignaturaId: string | undefined;
  estudianteId: string | undefined;
}

export default function EstudianteNotasTable({
  asignaturaId,
  estudianteId,
}: EstudianteNotasTableProps) {
  const [notaSelected, setNotaSelected] = useState<Nota>();
  const [notas, setNotas] = useState<Nota[]>([]);
  const [estudiante, setEstudiante] = useState<Estudiante>();

  const fetchNotasByEstudiante = async () => {
    if (!estudianteId) return;

    const response = await fetchNotasByEstudianteData(+estudianteId);
    if (response.data) setNotas(response.data);
  };

  const fetchEstudianteById = async () => {
    if (!estudianteId) return;

    const response = await fetchEstudianteByIdData(+estudianteId);
    if (response.data) setEstudiante(response.data);
  };

  const refreshNotas = async () => {
    fetchNotasByEstudiante();
    setNotaSelected(undefined);
  };

  const removeNota = async (nota: Nota) => {
    const response = await deleteNota(nota);
    if (response.ok) refreshNotas();
  };

  useEffect(() => {
    fetchNotasByEstudiante();
    fetchEstudianteById();
  }, []);

  console.log(notas);

  return (
    <div>
      <h1 className="uppercase">{estudiante?.user.nombres}</h1>
      <div>
        {estudianteId && asignaturaId && (
          <NotaForm
            key={notaSelected?.id}
            nota={notaSelected}
            estudianteId={+estudianteId}
            asignaturaId={+asignaturaId}
            onNotaCreatedOrUpdated={refreshNotas}
          />
        )}
      </div>
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="text-left">Asignatura</th>
            <th className="text-left">Nota</th>
            <th className="text-left">Fecha</th>
            <th className="text-left">Observación</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((nota) => (
            <tr>
              <td>{nota.asignatura.nombre}</td>
              <td>{nota.nota}</td>
              <td>{nota.fecha}</td>
              <td>{nota.observacion}</td>
              <td>
                Acciones
                <button
                  onClick={() => setNotaSelected(nota)}
                  className="btn btn-primary"
                >
                  Editar
                </button>
                <button
                  onClick={() => removeNota(nota)}
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
