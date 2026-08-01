import { NavLink } from "react-router-dom";
export function BottomNav() {
  return <nav className="bottom-nav">
    <NavLink to="/" end>⌂<span>首页</span></NavLink>
    <NavLink to="/progress">▤<span>报告</span></NavLink>
    <NavLink to="/progress">♙<span>我的</span></NavLink>
  </nav>;
}
