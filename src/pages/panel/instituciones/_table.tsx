import type { Institucion } from "@/lib/types";
import {
  fetchInstitucionesData,
  deleteInstitucion,
} from "@/services/institucion.service";
import { useEffect, useState } from "react";
import InstitucionForm from "./_form";

export default function InstitucionesTable() {
  const [institucionSelected, setInstitucionSelected] = useState<Institucion>();
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);

  const fetchInstituciones = async () => {
    const response = await fetchInstitucionesData();
    if (response.data) setInstituciones(response.data);
  };

  const refreshInstituciones = async () => {
    fetchInstituciones();
    setInstitucionSelected(undefined);
  };

  const removeInstitucion = async (institucion: Institucion) => {
    const response = await deleteInstitucion(institucion);
    if (response.ok) refreshInstituciones();
  };

  useEffect(() => {
    fetchInstituciones();
  }, []);

  console.log(instituciones);

  return (
    <div>
      <h1>Instituciones</h1>
      <div>
        <InstitucionForm
          key={institucionSelected?.id}
          institucion={institucionSelected}
          onInstitucionCreatedOrUpdated={refreshInstituciones}
        />
      </div>

      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="text-left">Nombre</th>
            <th className="text-left">Dirección</th>
            <th className="text-left">Teléfono</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {instituciones.map((institucion) => (
            <tr key={institucion.id}>
              <td>{institucion.nombre}</td>
              <td>{institucion.direccion}</td>
              <td>{institucion.telefono}</td>
              <td>
                Acciones
                <button
                  onClick={() => setInstitucionSelected(institucion)}
                  className="btn btn-primary"
                >
                  Editar
                </button>
                <button
                  onClick={() => removeInstitucion(institucion)}
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
