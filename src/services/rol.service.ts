import type { Rol } from "@/lib/types.ts";
import { fetchWithAuth } from "@/lib/utils.ts";

// Función para obtener las roles
export async function fetchRolesData(): Promise<{
  ok: boolean;
  data?: Rol[];
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<Rol[]>(`roles`, "GET");
}

// Función para actualizar o crear una rol
export const createOrUpdateRol = async (
  rol: Rol | undefined,
  formData: Partial<Rol>
): Promise<{
  ok: boolean;
  data?: Rol;
  success?: string;
  error?: string;
}> => {
  const isEdit = Boolean(rol?.id); // Determina si es POST o PATCH
  const url = isEdit ? `roles/${rol?.id}` : `roles`;

  return await fetchWithAuth<Rol>(url, isEdit ? "PATCH" : "POST", formData);
};

// Función para eliminar una rol
export const deleteRol = async (
  rol: Rol
): Promise<{ ok: boolean; success?: string; error?: string }> => {
  const url = `roles/${rol.id}`;
  return await fetchWithAuth<Rol>(url, "DELETE");
};
