export async function authMiddleware(cookies: any) {
  const token = cookies.get("auth_token")?.value;

  if (!token) {
    console.log(token);
    return false; // No autenticado
  }

  // Aquí podrías validar el token con una API o base de datos
  const isValid = true; // 🔥 Reemplázalo con tu lógica real

  return isValid;
}
