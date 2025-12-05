// api/tasks.ts
import { api } from "./client";

export const getTasks = async () => {
  const res = await api.get("/tasks");
  return res.data;
};

export const createTask = async (task: any) => {
  const res = await api.post("/tasks", task);
  return res.data;
};

export const updateTask = async (id: string, updates: any) => {
  const res = await api.put(`/tasks/${id}`, updates);
  return res.data;
};

export const deleteTask = async (id: string) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};

export const updateTaskStatus = async (id: string, status: string) => {
  const res = await api.patch(`/tasks/${id}/status?status=${status}`);
  return res.data;
};
