// src/components/atoms/TrendArrow.jsx
export function TrendArrow({ trend }) {
  if (!trend) return <span style={{ color: '#94A3B8' }}>—</span>;
  const map = {
    up:     { icon: '↗', color: '#DC2626', label: 'Increasing' },
    stable: { icon: '→', color: '#64748B', label: 'Stable'     },
    down:   { icon: '↘', color: '#16A34A', label: 'Decreasing' },
  };
  const t = map[trend];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: t.color, fontSize: 14, fontWeight: 600 }}>
      <span style={{ fontSize: 16, lineHeight: 1 }}>{t.icon}</span>
      {t.label}
    </span>
  );
}

