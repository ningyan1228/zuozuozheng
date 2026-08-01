export function Lion({ small = false }: { small?: boolean }) {
  return <div className={`lion ${small ? "lion-small" : ""}`} aria-label="小狮子学习搭子">
    <div className="lion-mane"><div className="lion-face"><i /><i /><b>⌣</b></div></div>
    {!small && <div className="lion-jacket">⌁</div>}
  </div>;
}
