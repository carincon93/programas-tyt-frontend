import type { Profesor } from "@/lib/types";
import {
  fetchProfesoresData,
  deleteProfesor,
} from "@/services/profesor.service";
import { useEffect, useState } from "react";
import ProfesorForm from "./_form";

export default function ProfesoresTable() {
  const [profesorSelected, setProfesorSelected] = useState<Profesor>();
  const [profesores, setProfesores] = useState<Profesor[]>([]);

  const fetchProfesores = async () => {
    const response = await fetchProfesoresData();
    if (response.data) setProfesores(response.data);
  };

  const refreshProfesores = async () => {
    fetchProfesores();
    setProfesorSelected(undefined);
  };

  const removeProfesor = async (profesor: Profesor) => {
    const response = await deleteProfesor(profesor);
    if (response.ok) refreshProfesores();
  };

  useEffect(() => {
    fetchProfesores();
  }, []);

  console.log(profesores);

  return (
    <div>
      <h1>Profesores</h1>
      <div>
        <ProfesorForm
          key={profesorSelected?.id}
          profesor={profesorSelected}
          onProfesorCreatedOrUpdated={refreshProfesores}
        />
      </div>

      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="text-left">Nombre</th>
            <th className="text-left">Universidad</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map((profesor) => (
            <tr key={profesor.id}>
              <td>{profesor.user.nombres + " " + profesor.user.apellidos}</td>
              <td>{profesor.universidad.nombre}</td>
              <td>
                <button
                  onClick={() => setProfesorSelected(profesor)}
                  className="btn btn-primary"
                >
                  Editar
                </button>
                <button
                  onClick={() => removeProfesor(profesor)}
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
