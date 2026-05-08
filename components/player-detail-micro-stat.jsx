// Player Detail - micro stat card.

function MicroStat({ label, value, delta, tone, componentId }) {
  const c = RISK_COLORS[tone];
  return (
    <div id={componentId} style={{ ...cardStyle, padding: 12 }}>
      <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: '#0F172A', fontFamily: "'Roboto Mono', monospace", letterSpacing: '-0.01em', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: c.main }}>{delta} w/w</div>
    </div>
  );
}

Object.assign(window, { MicroStat });

