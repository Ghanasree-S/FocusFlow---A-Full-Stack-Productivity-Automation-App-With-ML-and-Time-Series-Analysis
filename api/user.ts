// api/user.ts
import { api } from "./client";

export const getUserProfile = async () => {
  const res = await api.get("/user/profile");
  return res.data;
};

export const updateUserProfile = async (updates: any) => {
  const res = await api.put("/user/profile", updates);
  return res.data;
};

export const getUserSettings = async () => {
  const res = await api.get("/user/settings");
  return res.data;
};

export const updateUserSettings = async (settings: any) => {
  const res = await api.put("/user/settings", settings);
  return res.data;
};

export const deleteAccount = async () => {
  const res = await api.delete("/user/delete");
  localStorage.removeItem("ff_token");
  return res.data;
};
