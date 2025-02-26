import type { Asistencia } from "@/lib/types.ts";
import { fetchWithAuth } from "@/lib/utils.ts";

// Función para obtener las asistencias
export async function fetchAsistenciasData(estudianteId: number): Promise<{
  ok: boolean;
  data?: Asistencia[];
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<Asistencia[]>(
    `asistencias/estudiantes/${estudianteId}`,
    "GET"
  );
}

export async function fetchAsistenciasByEstudianteData(
  estudianteId: number
): Promise<{
  ok: boolean;
  data?: Asistencia[];
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<Asistencia[]>(
    `asistencias/estudiantes/${estudianteId}`,
    "GET"
  );
}

// Función para actualizar o crear una asistencia
export const createOrUpdateAsistencia = async (
  asignaturaId: number,
  estudianteId: number,
  asistencia: Asistencia | undefined,
  formData: Partial<Asistencia>
): Promise<{
  ok: boolean;
  data?: Asistencia;
  success?: string;
  error?: string;
}> => {
  const isEdit = Boolean(asistencia?.id); // Determina si es POST o PATCH
  const url = isEdit
    ? `asistencias/${asistencia?.id}`
    : `asistencias/${asignaturaId}/estudiantes/${estudianteId}`;

  return await fetchWithAuth<Asistencia>(
    url,
    isEdit ? "PATCH" : "POST",
    formData
  );
};

// Función para eliminar una asistencia
export const deleteAsistencia = async (
  asistencia: Asistencia
): Promise<{ ok: boolean; success?: string; error?: string }> => {
  const url = `asistencias/${asistencia.id}`;
  return await fetchWithAuth<Asistencia>(url, "DELETE");
};
