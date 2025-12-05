// api/dashboard.ts
import { api } from "./client";

export const getDashboardSummary = async () => {
  const res = await api.get("/dashboard/summary");
  return res.data;
};

export const getHourlyTrend = async () => {
  const res = await api.get("/dashboard/hourly");
  return res.data;
};
