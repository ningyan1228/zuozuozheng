import { FilesetResolver, HandLandmarker, PoseLandmarker } from "@mediapipe/tasks-vision";

const WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const POSE_MODEL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task";
const HAND_MODEL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task";
let posePromise: Promise<PoseLandmarker> | undefined;
let handPromise: Promise<HandLandmarker> | undefined;

export function poseLandmarker() {
  posePromise ??= FilesetResolver.forVisionTasks(WASM).then((vision) => PoseLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: POSE_MODEL, delegate: "GPU" }, runningMode: "VIDEO", numPoses: 1,
  }));
  return posePromise;
}
export function handLandmarker() {
  handPromise ??= FilesetResolver.forVisionTasks(WASM).then((vision) => HandLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: HAND_MODEL, delegate: "GPU" }, runningMode: "VIDEO", numHands: 1,
  }));
  return handPromise;
}
