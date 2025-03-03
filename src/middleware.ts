import { URL_BACKEND } from "astro:env/client";
import { sequence } from "astro:middleware";
import { refreshToken } from "./lib/utils";
import type { MiddlewareHandler } from "astro";

interface MiddlewareContext {
  cookies: {
    get: (name: string) => { value?: string } | undefined;
  };
  request: Request;
  url: URL;
  rewrite: (request: Request) => Promise<Response>;
}

interface MiddlewareNext {
  (): Promise<Response>;
}

// Definir rutas protegidas por rol
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ["/panel/admin", "/panel/profesor", "/panel"],
  profesor: ["/panel/profesor", "/panel"],
};

export const onRequest: MiddlewareHandler = async (context, next) => {
  const currentPath = context.url.pathname;

  const response = await fetch(`${URL_BACKEND}/auth/refresh`, {
    method: "GET",
    headers: {
      Cookie: `refresh_token=${context.cookies.get("refresh_token")?.value}`, // Envía el token de sesión si existe
    },
    credentials: "include",
  });

  const setCookieHeaders = response.headers.get("set-cookie");

  if (setCookieHeaders) {
    // ⚡️ Parsear y setear las cookies manualmente
    setCookieHeaders.split(",").forEach((cookie) => {
      const [cookieName, cookieValue] = cookie.split(";")[0].split("=");

      if (cookieName && cookieValue) {
        context.cookies.set(cookieName.trim(), cookieValue.trim(), {
          httpOnly: true,
          secure: false, // TODO En producción debe ser true por el HTTPS
          sameSite: "lax", // TODO Debe ser Strict
          path: "/",
        });
      }
    });
  }

  if (currentPath !== "/login" && response.status === 401) {
    console.warn("Usuario no autenticado. Redirigiendo a login.");
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  if (response.ok && currentPath === "/login") {
    console.info("Usuario autenticado. Redirigiendo a panel");
    return new Response(null, {
      status: 302,
      headers: { Location: "/panel" },
    });
  }

  // Continuar con la solicitud
  return next();
};
