import type { Institucion } from "@/lib/types.ts";
import { fetchWithAuth } from "@/lib/utils.ts";

// Función para obtener las instituciones
export async function fetchInstitucionesData(): Promise<{
  ok: boolean;
  data?: Institucion[];
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<Institucion[]>(`instituciones`, "GET");
}

// Función para actualizar o crear una institución
export const createOrUpdateInstitucion = async (
  institucion: Institucion | undefined,
  formData: Partial<Institucion>
): Promise<{
  ok: boolean;
  data?: Institucion;
  success?: string;
  error?: string;
}> => {
  const isEdit = Boolean(institucion?.id); // Determina si es POST o PATCH
  const url = isEdit ? `instituciones/${institucion?.id}` : `instituciones`;

  return await fetchWithAuth<Institucion>(
    url,
    isEdit ? "PATCH" : "POST",
    formData
  );
};

// Función para eliminar una institución
export const deleteInstitucion = async (
  institucion: Institucion
): Promise<{ ok: boolean; success?: string; error?: string }> => {
  const url = `instituciones/${institucion.id}`;
  return await fetchWithAuth<Institucion>(url, "DELETE");
};
