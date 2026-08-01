import { Link } from "react-router-dom";
import { BottomNav } from "../components/BottomNav"; import { Lion } from "../components/Lion"; import { goal, reports } from "../lib/localResults";
export function HomePage() { const g = goal(); const count = reports().length; return <main className="app-shell home">
  <header><p className="eyebrow">今天也轻轻坐好</p><h1>坐坐正</h1><p className="subtitle">好姿势 · 写好字 · 伴成长</p></header>
  <section className="hero"><div><p>写字前，先花 10 秒<br/>让身体舒服地坐好。</p><span>仅在本机检测，不上传画面</span></div><Lion /></section>
  <section className="goal-card"><div className="goal-icon">◎</div><div><h2>今日小目标</h2><p>{g.title}</p></div><span className="star">✦</span></section>
  <Link className="btn primary big" to="/posture">▣　开始坐姿检测</Link><Link className="btn secondary big" to="/grip">✎　握笔检测 <small>Beta</small></Link>
  <section className="progress-card"><div><h2>本周小进步</h2><p>完成 {count} 次检测</p><div className="days">{["一","二","三","四","五","六","日"].map((d,i)=><span key={d} className={i < Math.min(count,7) ? "done" : ""}>{d}</span>)}</div></div><div className="sticker">🏅</div></section><BottomNav />
</main>; }
