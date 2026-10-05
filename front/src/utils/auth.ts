import type { LoginResponse } from "../types";

export function getLogin(): LoginResponse | null {
  try {
    return JSON.parse(localStorage.getItem("loginResponse") ?? "null");
  } catch {
    return null;
  }
}
