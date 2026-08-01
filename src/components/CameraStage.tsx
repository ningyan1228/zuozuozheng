import { useCallback, useEffect, useRef, useState } from "react";
import type { HandLandmarkerResult, NormalizedLandmark, PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import { handLandmarker, poseLandmarker } from "../lib/mediapipe";
import { assess, isUsable } from "../lib/postureRules";
import type { PostureItem, Status } from "../types/detection";

type PoseSample = { usable: boolean; items: Record<PostureItem, Status>; landmarks?: NormalizedLandmark[] };
type Props = { kind: "pose" | "hand"; onPose?: (sample: PoseSample) => void; onHand?: (result: HandLandmarkerResult) => void; compact?: boolean };
const LINKS = [[0,2],[2,5],[5,7],[0,11],[0,12],[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[24,26],[26,28]];

export function CameraStage({ kind, onPose, onHand, compact = false }: Props) {
  const video = useRef<HTMLVideoElement>(null); const canvas = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number | undefined>(undefined); const last = useRef(0); const stream = useRef<MediaStream | undefined>(undefined);
  const [state, setState] = useState<"idle"|"loading"|"ready"|"error">("idle"); const [message, setMessage] = useState("");
  const stop = useCallback(() => { cancelAnimationFrame(raf.current ?? 0); stream.current?.getTracks().forEach((track) => track.stop()); stream.current = undefined; }, []);
  const draw = (landmarks?: NormalizedLandmark[]) => {
    const c = canvas.current; const v = video.current; if (!c || !v) return;
    c.width = v.videoWidth; c.height = v.videoHeight; const ctx = c.getContext("2d"); if (!ctx) return; ctx.clearRect(0,0,c.width,c.height);
    if (!landmarks || kind !== "pose") return;
    ctx.lineWidth = Math.max(3, c.width / 180); ctx.strokeStyle = "#5CA8A8"; ctx.fillStyle = "#E8FFFA";
    LINKS.forEach(([a,b]) => { const p = landmarks[a], q = landmarks[b]; if (!p || !q) return; ctx.beginPath(); ctx.moveTo(p.x*c.width,p.y*c.height); ctx.lineTo(q.x*c.width,q.y*c.height); ctx.stroke(); });
    landmarks.forEach((p) => { ctx.beginPath(); ctx.arc(p.x*c.width,p.y*c.height,Math.max(4,c.width/90),0,Math.PI*2); ctx.fill(); ctx.stroke(); });
  };
  const loop = async (timestamp: number) => {
    const v = video.current; if (!v || v.readyState < 2) { raf.current = requestAnimationFrame(loop); return; }
    if (timestamp - last.current > 80) {
      last.current = timestamp;
      try {
        if (kind === "pose") { const r: PoseLandmarkerResult = (await poseLandmarker()).detectForVideo(v, timestamp); const l = r.landmarks[0]; draw(l); onPose?.({ usable: isUsable(l), items: assess(l), landmarks: l }); }
        else { const r = (await handLandmarker()).detectForVideo(v, timestamp); onHand?.(r); }
      } catch { setMessage("模型暂时没有准备好，请稍后再试。"); }
    }
    raf.current = requestAnimationFrame(loop);
  };
  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia) { setState("error"); setMessage("当前浏览器不支持摄像头，请使用最新版 Chrome 或 Safari。"); return; }
    setState("loading");
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      stream.current = s; if (!video.current) return; video.current.srcObject = s; await video.current.play();
      if (kind === "pose") await poseLandmarker(); else await handLandmarker(); setState("ready"); raf.current = requestAnimationFrame(loop);
    } catch (e) { setState("error"); setMessage(e instanceof DOMException && e.name === "NotAllowedError" ? "没有获得摄像头权限。请在浏览器设置中允许后重试。" : "摄像头暂时无法打开，请检查权限或设备。 "); }
  };
  useEffect(() => () => stop(), [stop]);
  return <div className={`camera-stage ${compact ? "compact" : ""}`}>
    {state !== "ready" && <div className="camera-empty"><span className="camera-icon">⌁</span><strong>{state === "loading" ? "正在准备本地检测…" : "摄像头只在本机实时分析"}</strong><p>{message || "不会上传或保存画面"}</p><button className="btn primary" onClick={start} disabled={state === "loading"}>{state === "loading" ? "正在打开…" : "打开摄像头"}</button></div>}
    <video ref={video} muted playsInline className={state === "ready" ? "show" : ""} />
    <canvas ref={canvas} className={state === "ready" ? "show" : ""} />
    {state === "ready" && <><div className="framing" /><button className="camera-stop" onClick={() => { stop(); setState("idle"); }}>关闭摄像头</button></>}
  </div>;
}
