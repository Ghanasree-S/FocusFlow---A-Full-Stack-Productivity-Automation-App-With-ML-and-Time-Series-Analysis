// api/focus.ts
import { api } from "./client";

export const startFocusSession = async (blocked_notifications: boolean) => {
  const res = await api.post("/focus/start", {
    blocked_notifications,
    start_time: new Date().toISOString(),
  });
  return res.data;
};

export const endFocusSession = async (sessionId: string) => {
  const res = await api.post("/focus/end", { session_id: sessionId });
  return res.data;
};
