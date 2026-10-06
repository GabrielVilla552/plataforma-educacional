import type { NavigateFunction } from "react-router-dom";
import type { User } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export interface StoredLogin {
  token: string;
  user: User;
}

// Lê a sessão salva pelo Login (authToken + authUser)
export function getLogin(): StoredLogin | null {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const user = JSON.parse(localStorage.getItem("authUser") ?? "null");
    return user ? { token, user } : null;
  } catch {
    return null;
  }
}

export async function handleLogout(
  navigate: NavigateFunction,
  redirectTo = "/",
  onComplete?: () => void,
) {
  const token = localStorage.getItem("authToken");

  if (token) {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }

  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
  onComplete?.();
  navigate(redirectTo, { replace: true });
}
