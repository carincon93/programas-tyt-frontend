import type { Programa } from "@/lib/types.ts";
import { fetchWithAuth } from "@/lib/utils.ts";

// Función para obtener los programas
export async function fetchProgramasData(): Promise<{
  ok: boolean;
  data?: Programa[];
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<Programa[]>(`programas`, "GET");
}

// Función para actualizar o crear un programa
export const createOrUpdatePrograma = async (
  programa: Programa | undefined,
  formData: Partial<Programa>
): Promise<{
  ok: boolean;
  data?: Programa;
  success?: string;
  error?: string;
}> => {
  const isEdit = Boolean(programa?.id); // Determina si es POST o PATCH
  const url = isEdit ? `programas/${programa?.id}` : `programas`;

  return await fetchWithAuth<Programa>(
    url,
    isEdit ? "PATCH" : "POST",
    formData
  );
};

// Función para eliminar un programa
export const deletePrograma = async (
  programa: Programa
): Promise<{ ok: boolean; success?: string; error?: string }> => {
  const url = `programas/${programa.id}`;
  return await fetchWithAuth<Programa>(url, "DELETE");
};
