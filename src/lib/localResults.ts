import type { DailyGoal, FocusSession, PostureReport } from "../types/detection";

const KEYS = { reports: "zuozuozheng.reports.v1", sessions: "zuozuozheng.sessions.v1", goal: "zuozuozheng.goal.v1" };
const get = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) ?? "") as T; } catch { return fallback; }
};
const put = <T,>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value));

export const saveReport = (report: PostureReport) => put(KEYS.reports, [report, ...get<PostureReport[]>(KEYS.reports, [])].slice(0, 60));
export const reports = () => get<PostureReport[]>(KEYS.reports, []);
export const latestReport = () => reports()[0];
export const saveSession = (session: FocusSession) => put(KEYS.sessions, [session, ...get<FocusSession[]>(KEYS.sessions, [])].slice(0, 60));
export const sessions = () => get<FocusSession[]>(KEYS.sessions, []);
export const today = () => new Date().toLocaleDateString("en-CA");
export const goal = (): DailyGoal => get<DailyGoal>(KEYS.goal, { date: today(), title: "完成一次坐姿检测 + 10分钟写字陪伴", completed: false });
export const completeGoal = () => put(KEYS.goal, { ...goal(), date: today(), completed: true });
export const clearAll = () => Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
