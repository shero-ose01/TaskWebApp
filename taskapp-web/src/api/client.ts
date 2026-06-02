// TODO(localStorage is bad as its xss-readable, swap to something else)

import { ApiError, type ApiErrorBody } from "./types";

const TOKEN_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export function GetToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function SetToken(token: string | null) {
  if (token == null) localStorage.removeItem(TOKEN_KEY);
  else localStorage.setItem(TOKEN_KEY, token);
}

export function GetRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function SetRefreshToken(token: string | null) {
  if (token == null) localStorage.removeItem(REFRESH_KEY);
  else localStorage.setItem(REFRESH_KEY, token);
}

type FetchOpts = {
  method?: "POST" | "GET" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

export async function ApiFetch<T>(
  path: string,
  opts: FetchOpts = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = opts;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = GetToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (auth && res.status === 401) {
    SetToken(null);
    SetRefreshToken(null);
    window.location.href = "/login";
    throw new ApiError(401, null);
  }

  if (res.status == 204) return undefined as T; // DELETE return no body

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) throw new ApiError(res.status, data as ApiErrorBody | null);
  return data as T;
}
