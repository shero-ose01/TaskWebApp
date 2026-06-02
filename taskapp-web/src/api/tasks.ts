import { ApiFetch } from "./client";
import type {
  CreateTaskItemRequest,
  TaskItemResponse,
  UpdateTaskItemRequest,
} from "./types";

export async function CreateTask(
  req: CreateTaskItemRequest,
): Promise<TaskItemResponse> {
  return ApiFetch<TaskItemResponse>("/tasks", {
    method: "POST",
    body: req,
  });
}

export async function GetTask(id: number): Promise<TaskItemResponse> {
  return ApiFetch<TaskItemResponse>(`/tasks/${id}`, {});
}

export async function GetTasks(): Promise<TaskItemResponse[]> {
  return ApiFetch<TaskItemResponse[]>("/tasks", {});
}

export async function DeleteTask(id: number): Promise<void> {
  await ApiFetch(`/tasks/${id}`, {
    method: "DELETE",
  });
}

export async function UpdateTask(
  id: number,
  req: UpdateTaskItemRequest,
): Promise<TaskItemResponse> {
  return ApiFetch<TaskItemResponse>(`/tasks/${id}`, {
    method: "PUT",
    body: req,
  });
}
