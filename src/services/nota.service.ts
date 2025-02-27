import type { Nota } from "@/lib/types.ts";
import { fetchWithAuth } from "@/lib/utils.ts";

// Función para obtener los notas
export async function fetchNotasData(): Promise<{
  ok: boolean;
  data?: Nota[];
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<Nota[]>(`notas`, "GET");
}

export async function fetchNotasByEstudianteData(
  estudianteId: number
): Promise<{
  ok: boolean;
  data?: Nota[];
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<Nota[]>(
    `notas/estudiantes/${estudianteId}`,
    "GET"
  );
}

// Función para actualizar o crear un nota
export const createOrUpdateNota = async (
  asignaturaId: number,
  estudianteId: number,
  nota: Nota | undefined,
  formData: Partial<Nota>
): Promise<{
  ok: boolean;
  data?: Nota;
  success?: string;
  error?: string;
}> => {
  const isEdit = Boolean(nota?.id); // Determina si es POST o PATCH
  const url = isEdit
    ? `notas/${nota?.id}`
    : `notas/${asignaturaId}/estudiante/${estudianteId}`;

  return await fetchWithAuth<Nota>(url, isEdit ? "PATCH" : "POST", formData);
};

// Función para eliminar un nota
export const deleteNota = async (
  nota: Nota
): Promise<{ ok: boolean; success?: string; error?: string }> => {
  const url = `notas/${nota.id}`;
  return await fetchWithAuth<Nota>(url, "DELETE");
};
