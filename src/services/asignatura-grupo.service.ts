import type { Asignatura, AsignaturaGrupo } from "@/lib/types.ts";
import { fetchWithAuth } from "@/lib/utils.ts";

// Función para obtener las asignaturas
export async function fetchAsignaturasGrupoData(): Promise<{
  ok: boolean;
  data?: AsignaturaGrupo[];
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<AsignaturaGrupo[]>(`asignaturas-grupo`, "GET");
}

export async function fetchAsignaturaGrupoByIdData(
  asignaturaId: number
): Promise<{
  ok: boolean;
  data?: AsignaturaGrupo;
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<AsignaturaGrupo>(
    `asignaturas-grupo/${asignaturaId}`,
    "GET"
  );
}

export async function fetchAsignaturaGrupoByEstudianteData(
  estudianteId: number
): Promise<{
  ok: boolean;
  data?: AsignaturaGrupo[];
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<AsignaturaGrupo[]>(
    `asignaturas-grupo/estudiantes/${estudianteId}`,
    "GET"
  );
}

// Función para actualizar o crear una asignatura
export const createOrUpdateAsignaturaGrupo = async (
  asignaturaGrupo: AsignaturaGrupo | undefined,
  formData: Partial<AsignaturaGrupo>
): Promise<{
  ok: boolean;
  data?: AsignaturaGrupo;
  success?: string;
  error?: string;
}> => {
  const isEdit = Boolean(asignaturaGrupo?.id); // Determina si es POST o PATCH
  const url = isEdit
    ? `asignaturas-grupo/${asignaturaGrupo?.id}`
    : `asignaturas-grupo`;

  return await fetchWithAuth<AsignaturaGrupo>(
    url,
    isEdit ? "PATCH" : "POST",
    formData
  );
};

// Función para eliminar una asignatura
export const deleteAsignaturaGrupo = async (
  asignatura: AsignaturaGrupo
): Promise<{ ok: boolean; success?: string; error?: string }> => {
  const url = `asignaturas-grupo/${asignatura.id}`;
  return await fetchWithAuth<AsignaturaGrupo>(url, "DELETE");
};
