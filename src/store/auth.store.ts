// src/stores/userStore.ts
import { atom } from "nanostores";

export type AuthUser = {
  id: number;
  email: string;
  role: string;
};

// Estado global del usuario (inicialmente null)
export const userStore = atom<AuthUser | null>(null);

// Función para actualizar el usuario
export const setUser = (user: AuthUser | null) => {
  userStore.set(user);
};
