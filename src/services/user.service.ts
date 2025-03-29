import type { User } from "@/lib/types.ts";
import { fetchWithAuth } from "@/lib/utils.ts";

// Función para obtener los users
export async function fetchUsersData(): Promise<{
  ok: boolean;
  data?: User[];
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<User[]>(`users`, "GET");
}

export async function fetchUserByIdData(userId: number): Promise<{
  ok: boolean;
  data?: User;
  success?: string;
  error?: string;
}> {
  return await fetchWithAuth<User>(`users/${userId}`, "GET");
}

// Función para actualizar o crear un user
export const createOrUpdateUser = async (
  user: User | undefined,
  formData: Partial<User>
): Promise<{
  ok: boolean;
  data?: User;
  success?: string;
  error?: string;
}> => {
  const isEdit = Boolean(user?.id); // Determina si es POST o PATCH
  const url = isEdit ? `users/${user?.id}` : `users`;

  return await fetchWithAuth<User>(url, isEdit ? "PATCH" : "POST", formData);
};

// Función para eliminar un user
export const deleteUser = async (
  user: User
): Promise<{ ok: boolean; success?: string; error?: string }> => {
  const url = `users/${user.id}`;
  return await fetchWithAuth<User>(url, "DELETE");
};
