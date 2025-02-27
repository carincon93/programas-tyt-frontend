import type { AsignaturaProfesor, Profesor } from "@/lib/types.ts";
import { fetchWithAuth } from "@/lib/utils.ts";

// Función para obtener los profesores
export async function fetchProfesoresData(): Promise<{
  ok: boolean;
  data?: Profesor[];
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<Profesor[]>(`profesores`, "GET");
}

export async function fetchAsignaturaByProfesorIdData(
  profesorId: number
): Promise<{
  ok: boolean;
  data?: AsignaturaProfesor;
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<AsignaturaProfesor>(
    `profesores/${profesorId}/asignatura`,
    "GET"
  );
}

export async function fetchAsignaturasByProfesorData(
  profesorId: number
): Promise<{
  ok: boolean;
  data?: AsignaturaProfesor[];
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<AsignaturaProfesor[]>(
    `profesores/${profesorId}/asignaturas`,
    "GET"
  );
}

// Función para actualizar o crear un profesor
export const createOrUpdateProfesor = async (
  profesor: Profesor | undefined,
  formData: Partial<Profesor>
): Promise<{
  ok: boolean;
  data?: Profesor;
  success?: string;
  error?: string;
}> => {
  const isEdit = Boolean(profesor?.id); // Determina si es POST o PATCH
  const url = isEdit ? `profesores/${profesor?.id}` : `profesores`;

  return await fetchWithAuth<Profesor>(
    url,
    isEdit ? "PATCH" : "POST",
    formData
  );
};

// Función para eliminar un profesor
export const deleteProfesor = async (
  profesor: Profesor
): Promise<{ ok: boolean; success?: string; error?: string }> => {
  const url = `profesores/${profesor.id}`;
  return await fetchWithAuth<Profesor>(url, "DELETE");
};
