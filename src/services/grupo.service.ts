import type { Grupo } from "@/lib/types.ts";
import { fetchWithAuth } from "@/lib/utils.ts";

// Función para obtener los grupos
export async function fetchGruposData(): Promise<{
  ok: boolean;
  data?: Grupo[];
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<Grupo[]>(`grupos`, "GET");
}

export async function fetchGrupoByIdData(grupoId: number): Promise<{
  ok: boolean;
  data?: Grupo;
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<Grupo>(`grupos/${grupoId}`, "GET");
}

// Función para actualizar o crear un grupo
export const createOrUpdateGrupo = async (
  grupo: Grupo | undefined,
  formData: Partial<Grupo>
): Promise<{
  ok: boolean;
  data?: Grupo;
  success?: string;
  error?: string;
}> => {
  const isEdit = Boolean(grupo?.id); // Determina si es POST o PATCH
  const url = isEdit ? `grupos/${grupo?.id}` : `grupos`;

  return await fetchWithAuth<Grupo>(url, isEdit ? "PATCH" : "POST", formData);
};

// Función para eliminar un grupo
export const deleteGrupo = async (
  grupo: Grupo
): Promise<{ ok: boolean; success?: string; error?: string }> => {
  const url = `grupos/${grupo.id}`;
  return await fetchWithAuth<Grupo>(url, "DELETE");
};
