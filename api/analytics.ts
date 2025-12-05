// api/analytics.ts
import { api } from "./client";

export const getWeeklyAnalytics = async () => {
  const res = await api.get("/analytics/weekly");
  return res.data;
};

export const getAnalyticsSummary = async () => {
  const res = await api.get("/analytics/summary");
  return res.data;
};

export const getProductivityBreakdown = async () => {
  const res = await api.get("/analytics/breakdown");
  return res.data;
};

export const getDailyTrend = async () => {
  const res = await api.get("/analytics/daily-trend");
  return res.data;
};
