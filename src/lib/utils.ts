import { URL_BACKEND } from "astro:env/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchWithAuth = async <T>(
  endpoint: string,
  method: "POST" | "PATCH" | "DELETE" | "GET",
  body?: BodyInit | null | undefined | number[] | Partial<T>
): Promise<{ ok: boolean; data?: T; success?: string; error?: string }> => {
  const responseGetToken = async (): Promise<Response> => {
    return await getToken();
  };

  const token = await responseGetToken();

  if (!token) {
    const error = "Authentication token is missing";
    console.error(error);
    return { ok: false, error };
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
  };

  try {
    const makeRequest = async (): Promise<Response> => {
      return await fetch(`${URL_BACKEND}/${endpoint}`, {
        method,
        headers,
        credentials: "include",
        body:
          body instanceof FormData
            ? body
            : body
            ? JSON.stringify(body)
            : undefined,
      });
    };

    let response = await makeRequest();

    // Si el token expiró, intenta refrescarlo y vuelve a hacer la petición
    if (response.status === 401) {
      const refreshResponse = await fetch(`${URL_BACKEND}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        const refreshToken = await responseGetToken();

        // Actualizar el token en los headers
        headers.Authorization = `Bearer ${refreshToken}`;

        // Reintentar la petición original con el nuevo token
        response = await makeRequest();
      } else {
        console.error("Refresh token expirado. Redirigiendo al login...");
        window.location.href = "/login";
        return { ok: false, error: "Session expired, please log in again." };
      }
    }

    if (response.ok) {
      const data: T = await response.json();
      const success = `${method} request completed successfully`;
      return { ok: true, data, success };
    } else {
      const error = `Error during ${method} request: ${response.statusText}`;
      console.error(error);
      return { ok: false, error };
    }
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    console.error("Error:", errorMessage);
    return { ok: false, error: errorMessage };
  }
};

async function getToken() {
  const response = await fetch(`${URL_BACKEND}/auth/token`, {
    credentials: "include", // 🔥 Necesario para enviar cookies
  });

  if (!response.ok) throw new Error("No autorizado");

  const data = await response.json();
  return data.token;
}
