import type { Asignatura } from "@/lib/types.ts";
import { fetchWithAuth } from "@/lib/utils.ts";

// Función para obtener las asignaturas
export async function fetchAsignaturasData(): Promise<{
  ok: boolean;
  data?: Asignatura[];
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<Asignatura[]>(`asignaturas`, "GET");
}

export async function fetchAsignaturaByIdData(asignaturaId: number): Promise<{
  ok: boolean;
  data?: Asignatura;
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<Asignatura>(`asignaturas/${asignaturaId}`, "GET");
}



// Función para actualizar o crear una asignatura
export const createOrUpdateAsignatura = async (
  asignatura: Asignatura | undefined,
  formData: Partial<Asignatura>
): Promise<{
  ok: boolean;
  data?: Asignatura;
  success?: string;
  error?: string;
}> => {
  const isEdit = Boolean(asignatura?.id); // Determina si es POST o PATCH
  const url = isEdit ? `asignaturas/${asignatura?.id}` : `asignaturas`;

  return await fetchWithAuth<Asignatura>(
    url,
    isEdit ? "PATCH" : "POST",
    formData
  );
};

// Función para eliminar una asignatura
export const deleteAsignatura = async (
  asignatura: Asignatura
): Promise<{ ok: boolean; success?: string; error?: string }> => {
  const url = `asignaturas/${asignatura.id}`;
  return await fetchWithAuth<Asignatura>(url, "DELETE");
};
