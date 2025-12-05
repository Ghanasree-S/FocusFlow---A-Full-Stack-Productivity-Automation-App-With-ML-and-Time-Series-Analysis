// api/ml.ts
import { api } from "./client";

export const getTomorrowPrediction = async () => {
  const res = await api.get("/ml/tomorrow");
  return res.data;
};

export const getFocusRecommendation = async () => {
  const res = await api.get("/ml/recommendation");
  return res.data;
};

export const getSevenDayForecast = async () => {
  const res = await api.get("/ml/forecast");
  return res.data;
};
