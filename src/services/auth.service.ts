import type { Login } from "@/lib/types.ts";
import { fetchWithAuth } from "@/lib/utils";
import { URL_BACKEND } from "astro:env/client";

export const login = async (
  formData: Partial<Login>
): Promise<{
  ok: boolean;
  data?: any;
  success?: string;
  error?: string;
}> => {
  try {
    const response = await fetch(`${URL_BACKEND}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    return {
      ok: true,
      data: response.json(),
      error: "Error al iniciar sesión",
    };
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return {
      ok: false,
      error: "Error al iniciar sesión",
    };
  }
};

export const logout = async (): Promise<{
  ok: boolean;
  data?: any;
  success?: string;
  error?: string;
}> => {
  try {
    const response = await fetchWithAuth(`auth/logout`, "POST");

    return response;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return {
      ok: false,
      error: "Error al cerrar sesión",
    };
  }
};
