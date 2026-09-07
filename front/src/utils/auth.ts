import type { NavigateFunction } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

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
