// api/auth.ts
import { api } from "./client";

export const signup = async (name: string, email: string, password: string, goal: string) => {
  const res = await api.post("/auth/signup", { name, email, password, goal });
  localStorage.setItem("ff_token", res.data.token);
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  localStorage.setItem("ff_token", res.data.token);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("ff_token");
};

export const verifyAuth = async () => {
  try {
    const res = await api.get("/auth/verify");
    return res.data;
  } catch {
    return null;
  }
};
