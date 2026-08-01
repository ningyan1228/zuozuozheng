export type Status = "good" | "adjust" | "unknown";
export type PostureItem = "head" | "torso" | "shoulders" | "lean";

export type PostureReport = {
  id: string;
  createdAt: string;
  durationSeconds: number;
  items: Record<PostureItem, Status>;
  primaryTip: string;
  modelVersion: string;
};

export type FocusSession = {
  id: string;
  createdAt: string;
  activity: "homework" | "handwriting" | "reading";
  targetMinutes: 5 | 10 | 15;
  completedMinutes: number;
  stableMinutes: number;
  reminderCounts: Record<PostureItem, number>;
  completed: boolean;
};

export type DailyGoal = { date: string; title: string; completed: boolean };
