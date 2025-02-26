import type { Asignatura } from "@/lib/types";
import {
  fetchAsignaturasData,
  deleteAsignatura,
} from "@/services/asignatura.service";
import { useEffect, useState } from "react";
import AsignaturaForm from "./_form";

export default function AsignaturasTable() {
  const [asignaturaSelected, setAsignaturaSelected] = useState<Asignatura>();
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);

  const fetchAsignaturas = async () => {
    const response = await fetchAsignaturasData();
    if (response.data) setAsignaturas(response.data);
  };

  const refreshAsignaturas = async () => {
    fetchAsignaturas();
    setAsignaturaSelected(undefined);
  };

  const removeAsignatura = async (asignatura: Asignatura) => {
    const response = await deleteAsignatura(asignatura);
    if (response.ok) refreshAsignaturas();
  };

  useEffect(() => {
    fetchAsignaturas();
  }, []);

  console.log(asignaturas);

  return (
    <div>
      <h1>Asignaturas</h1>
      <div>
        <AsignaturaForm
          key={asignaturaSelected?.id}
          asignatura={asignaturaSelected}
          onAsignaturaCreatedOrUpdated={refreshAsignaturas}
        />
      </div>
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="text-left">Código</th>
            <th className="text-left">Nombre</th>
            <th className="text-left">Profesores</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asignaturas.map((asignatura) => (
            <tr key={asignatura.id}>
              <td>{asignatura.codigoAsignatura}</td>
              <td>{asignatura.nombre}</td>
              <td>
                {asignatura.asignaturaProfesores.map((asignaturaProfesor) => (
                  <div key={asignaturaProfesor.id}>
                    {asignaturaProfesor.profesor.user?.nombres}{" "}
                    {asignaturaProfesor.profesor.user?.apellidos}
                    <a
                      href={`/panel/asignaturas/${asignaturaProfesor.id}/profesores/${asignaturaProfesor.profesor.id}/horarios`}
                    >
                      Horarios
                    </a>
                  </div>
                ))}
              </td>
              <td>
                <button
                  onClick={() => setAsignaturaSelected(asignatura)}
                  className="btn btn-primary"
                >
                  Editar
                </button>
                <button
                  onClick={() => removeAsignatura(asignatura)}
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
