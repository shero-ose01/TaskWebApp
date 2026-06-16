import { ApiFetch, GetRefreshToken, SetRefreshToken, SetToken } from "./client";
import type {
  AuthResponse,
  LoginRequest,
  MeResponse,
  RegisterRequest,
} from "./types";

export async function register(req: RegisterRequest) {
  await ApiFetch("/auth/register", {
    method: "POST",
    body: req,
    auth: false,
  });
}

export async function login(req: LoginRequest): Promise<AuthResponse> {
  const res = await ApiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: req,
    auth: false,
  });

  SetToken(res.accessToken);
  SetRefreshToken(res.refreshToken);
  return res;
}

export async function logout() {
  const refreshToken = GetRefreshToken();
  if (refreshToken) {
    await ApiFetch("/auth/logout", {
      method: "POST",
      body: { refreshToken },
      auth: true,
    }).catch(() => {});
  }
  SetToken(null);
  SetRefreshToken(null);
}

export async function verifyEmail(rawToken: string): Promise<void> {
  await ApiFetch("/auth/verify-email", {
    method: "POST",
    body: { rawToken },
    auth: false,
  });
}

export async function resendEmailVerification(email: string): Promise<void> {
  await ApiFetch("/auth/resend-email-verification", {
    method: "POST",
    body: { email },
    auth: false,
  });
}

export async function me(): Promise<{
  id: number;
  username: string;
  email: string;
  createdAt: string;
}> {
  return ApiFetch<MeResponse>("/auth/me", {});
}
