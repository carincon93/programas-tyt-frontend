import { URL_BACKEND } from "astro:env/client";
// import { clsx, type ClassValue } from "clsx";
// import Cookies from "js-cookie";
// import { twMerge } from "tailwind-merge";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

export const fetchWithAuth = async <T>(
  endpoint: string,
  method: "POST" | "PATCH" | "DELETE" | "GET",
  body?: BodyInit | null | undefined | Partial<T>
): Promise<{ ok: boolean; data?: T; success?: string; error?: string }> => {
  //   const cookie = Cookies.get("__session");

  //   if (!cookie) {
  //     const error = "Authentication token is missing";
  //     console.error(error);
  //     return { ok: false, error };
  //   }

  const headers: HeadersInit = {
    // Authorization: `Bearer ${cookie}`,
    ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
  };

  try {
    const response = await fetch(`${URL_BACKEND}/${endpoint}`, {
      method,
      headers,
      body:
        body instanceof FormData
          ? body
          : body
          ? JSON.stringify(body)
          : undefined,
    });

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
