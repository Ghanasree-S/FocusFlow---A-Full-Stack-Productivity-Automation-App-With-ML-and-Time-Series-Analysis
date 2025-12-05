import axios from "axios";

export const API_URL = "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
});

// Automatically attach JWT if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ff_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
