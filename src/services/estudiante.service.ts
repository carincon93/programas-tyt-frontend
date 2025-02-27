import type { Estudiante } from "@/lib/types.ts";
import { fetchWithAuth } from "@/lib/utils.ts";

// Función para obtener los estudiantes
export async function fetchEstudiantesData(): Promise<{
  ok: boolean;
  data?: Estudiante[];
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<Estudiante[]>(`estudiantes`, "GET");
}

export async function fetchEstudianteByIdData(estudianteId: number): Promise<{
  ok: boolean;
  data?: Estudiante;
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<Estudiante>(`estudiantes/${estudianteId}`, "GET");
}

// Función para actualizar o crear un estudiante
export const createOrUpdateEstudiante = async (
  estudiante: Estudiante | undefined,
  formData: Partial<Estudiante>
): Promise<{
  ok: boolean;
  data?: Estudiante;
  success?: string;
  error?: string;
}> => {
  const isEdit = Boolean(estudiante?.id); // Determina si es POST o PATCH
  const url = isEdit ? `estudiantes/${estudiante?.id}` : `estudiantes`;

  return await fetchWithAuth<Estudiante>(
    url,
    isEdit ? "PATCH" : "POST",
    formData
  );
};

// Función para eliminar un estudiante
export const deleteEstudiante = async (
  estudiante: Estudiante
): Promise<{ ok: boolean; success?: string; error?: string }> => {
  const url = `estudiantes/${estudiante.id}`;
  return await fetchWithAuth<Estudiante>(url, "DELETE");
};
