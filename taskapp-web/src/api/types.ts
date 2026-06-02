// Tasks
export type TaskState = "Pending" | "InProgress" | "Done";

export type TaskItemResponse = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string | null;
  dueAt?: string | null;
  state: TaskState;
};

export type UpdateTaskItemRequest = {
  title: string;
  description?: string | null;
  dueAt?: string | null;
  state: TaskState;
};

export type CreateTaskItemRequest = {
  title: string;
  description?: string | null;
  dueAt?: string | null;
};

// Auth

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  username: string;
  email: string;
};

export type MeResponse = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

// ASP.NET ProblemDetails error shape
export type ApiErrorBody = {
  type?: string;
  title?: string;
  status?: number;
  errors?: Record<string, string[]>;
  message?: string;
};

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody | null;
  constructor(status: number, body: ApiErrorBody | null) {
    super(body?.title ?? body?.message ?? `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}
