import { URL_BACKEND } from "astro:env/client";
import type { APIContext, MiddlewareHandler } from "astro";

// Definir rutas protegidas por rol
const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: [
    "/panel/admin",
    "/panel/universidades",
    "/panel/programas",
    "/panel/grupos",
    "/panel/profesores",
    "/panel/asignaturas",
    "/panel/instituciones",
    "/panel/estudiantes",
    "/panel/roles",
    "/panel/usuarios",
    "/panel/horarios",
    "/panel/notas",
    "/panel/asistencias",
    "/panel/inicio",
  ],
  PROFESOR: ["/panel/profesor", "/panel/inicio"],
  ESTUDIANTE: ["/panel/estudiante", "/panel/inicio"],
};

export const onRequest: MiddlewareHandler = async (context, next) => {
  const currentPath = context.url.pathname;
  const authToken = context.cookies.get("auth_token")?.value || "";
  const refreshToken = context.cookies.get("refresh_token")?.value || "";

  if (currentPath === "/") {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  const authUser = await getProfile(context, authToken, 1, currentPath);

  console.log(authUser);

  if (authUser?.role) {
    // Guardar el authUser en locals
    context.locals.authUser = authUser || null;

    const responseRefreshToken = await getRefreshToken(context, refreshToken);

    if (currentPath !== "/login" && responseRefreshToken.status === 401) {
      console.warn("Usuario no autenticado. Redirigiendo a login.");
      return new Response(null, {
        status: 302,
        headers: { Location: "/login" },
      });
    }

    if (responseRefreshToken.ok && currentPath === "/login") {
      console.info("Usuario autenticado. Redirigiendo a panel");
      return new Response(null, {
        status: 302,
        headers: { Location: "/panel/inicio" },
      });
    }

    // Validar permisos con rutas dinámicas (por ejemplo, /panel/grupos/1/estudiantes/2)
    if (authUser && currentPath.startsWith("/panel")) {
      const allowedPaths = ROLE_PERMISSIONS[authUser.role] || [];

      // Permitir acceso si la ruta es exactamente una de las permitidas o si es una subruta de ellas
      const hasAccess = allowedPaths.some(
        (path) => currentPath === path || currentPath.startsWith(`${path}/`)
      );

      if (!hasAccess) {
        console.warn("Usuario no autorizado para acceder a esta ruta.");
        return new Response(null, {
          status: 302,
          headers: { Location: "/panel/inicio" },
        });
      }
    }
  } else if (currentPath !== "/login") {
    console.warn("Usuario no autenticado. Redirigiendo a login.");
    context.cookies.set("auth_token", "delete", {
      path: "/",
      expires: new Date(0),
      maxAge: 0,
    });

    context.cookies.set("refresh_token", "delete", {
      path: "/",
      expires: new Date(0),
      maxAge: 0,
    });

    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  return next();
};

const getProfile = async (
  context: APIContext,
  authToken: string,
  retries: number = 1,
  currentPath?: string
): Promise<
  | {
      email: string;
      role: string;
    }
  | undefined
> => {
  // if (currentPath === "/login") {
  //   return;
  // }

  try {
    const response = await fetch(`${URL_BACKEND}/auth/profile`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 401 && retries > 0) {
      console.warn(
        "No se ha podido obtener el usuario autenticado, intentando refrescar..."
      );

      const responseAuthUser = await getProfile(
        context,
        authToken,
        retries - 1
      );

      return responseAuthUser;
    } else if (retries === 0) {
      context.cookies.set("auth_token", "delete", {
        path: "/",
        expires: new Date(0),
        maxAge: 0,
      });

      context.cookies.set("refresh_token", "delete", {
        path: "/",
        expires: new Date(0),
        maxAge: 0,
      });
    }

    if (!response.ok) {
      console.error(`Profile fetch failed: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return undefined;
  }
};

const getRefreshToken = async (
  context: APIContext,
  refreshToken: string
): Promise<Response> => {
  try {
    const response = await fetch(`${URL_BACKEND}/auth/refresh`, {
      method: "GET",
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
      credentials: "include",
    });

    const { data } = await response.json();

    if (data) {
      context.cookies.set("auth_token", data.tokens.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        path: "/",
      });

      context.cookies.set("refresh_token", data.tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        path: "/",
      });
    }

    // 🔥 TODO: Usar cuando el dominio sea el mismo

    // const setCookieHeaders = response.headers.get("set-cookie");

    // if (setCookieHeaders) {
    //   setCookieHeaders.split(",").forEach((cookie) => {
    //     const [cookieName, cookieValue] = cookie.split(";")[0].split("=");

    //     if (cookieName && cookieValue) {
    //       context.cookies.set(cookieName.trim(), cookieValue.trim(), {
    //         httpOnly: true,
    //         secure: false,
    //         sameSite: "lax",
    //         path: "/",
    //       });
    //     }
    //   });
    // }

    return response;
  } catch (error) {
    console.error("Error refreshing token:", error);

    return new Response(null, {
      status: 401,
      headers: { Location: "/login" },
    });
  }
};
