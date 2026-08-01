import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { PostureItem, Status } from "../types/detection";

export const RULES = { tiltDegrees: 12, shoulderRatio: 0.12, headRatio: 0.23 };
const dist = (a: NormalizedLandmark, b: NormalizedLandmark) => Math.hypot(a.x - b.x, a.y - b.y);
const mid = (a: NormalizedLandmark, b: NormalizedLandmark) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

export function isUsable(l?: NormalizedLandmark[]) {
  if (!l || l.length < 25) return false;
  const needed = [0, 11, 12, 23, 24];
  return needed.every((i) => (l[i]?.visibility ?? 1) > 0.55) && dist(l[11], l[12]) > 0.12;
}

export function assess(l?: NormalizedLandmark[]): Record<PostureItem, Status> {
  const unknown: Record<PostureItem, Status> = { head: "unknown", torso: "unknown", shoulders: "unknown", lean: "unknown" };
  if (!isUsable(l) || !l) return unknown;
  const shoulderWidth = dist(l[11], l[12]);
  const shoulderMid = mid(l[11], l[12]);
  const hipMid = mid(l[23], l[24]);
  const shoulderDelta = Math.abs(l[11].y - l[12].y) / shoulderWidth;
  const torsoAngle = Math.atan2(Math.abs(hipMid.x - shoulderMid.x), Math.abs(hipMid.y - shoulderMid.y)) * 180 / Math.PI;
  const headDrop = (l[0].y - shoulderMid.y) / shoulderWidth;
  return {
    head: headDrop > RULES.headRatio ? "adjust" : "good",
    torso: torsoAngle > RULES.tiltDegrees ? "adjust" : "good",
    shoulders: shoulderDelta > RULES.shoulderRatio ? "adjust" : "good",
    // A single mobile camera cannot calculate a reliable desk distance; present an honest fallback.
    lean: "unknown",
  };
}

export const primaryTip = (items: Record<PostureItem, Status>) => {
  if (items.head === "adjust") return "头抬高一点点，再保持一会儿。";
  if (items.torso === "adjust") return "身体回到中间来，坐得更舒服。";
  if (items.shoulders === "adjust") return "两边肩膀放松、坐平。";
  return "坐得很稳，继续保持这个舒服的姿势！";
};
