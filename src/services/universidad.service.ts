import type { Universidad } from "@/lib/types.ts";
import { fetchWithAuth } from "@/lib/utils.ts";

// Función para obtener las universidades
export async function fetchUniversidadesData(): Promise<{
  ok: boolean;
  data?: Universidad[];
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<Universidad[]>(`universidades`, "GET");
}

// Función para actualizar o crear una universidad
export const createOrUpdateUniversidad = async (
  universidad: Universidad | undefined,
  formData: Partial<Universidad>
): Promise<{
  ok: boolean;
  data?: Universidad;
  success?: string;
  error?: string;
}> => {
  const isEdit = Boolean(universidad?.id); // Determina si es POST o PATCH
  const url = isEdit ? `universidades/${universidad?.id}` : `universidades`;

  return await fetchWithAuth<Universidad>(
    url,
    isEdit ? "PATCH" : "POST",
    formData
  );
};

// Función para eliminar una universidad
export const deleteUniversidad = async (
  universidad: Universidad
): Promise<{ ok: boolean; success?: string; error?: string }> => {
  const url = `universidades/${universidad.id}`;
  return await fetchWithAuth<Universidad>(url, "DELETE");
};
