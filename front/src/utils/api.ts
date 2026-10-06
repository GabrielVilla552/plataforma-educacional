import { getLogin } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined");
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;
  const token = getLogin()?.token;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorMessage = `API request failed: ${response.status} ${response.statusText}`;

    try {
      const errorData = await response.json();

      if (errorData?.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Response wasn't JSON, so we'll use the default error message.
    }

    throw new Error(errorMessage);
  }

  // Some endpoints might return 204 No Content.
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}