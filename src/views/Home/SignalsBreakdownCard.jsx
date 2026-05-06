// src/views/Home/SignalsBreakdownCard.jsx
import { cardStyle } from '@/config/constants.js';

export function SignalsBreakdownCard({ signals = [], rangeLabel }) {
  const max = Math.max(1, ...signals.map(s => s.count ?? 0));
  return (
    <div style={{ ...cardStyle }}>
      <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>Active risk signals · {rangeLabel}</div>
      <div style={{ fontSize: 16, color: '#0F172A', fontWeight: 600, marginBottom: 16 }}>What's triggering flags right now</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {signals.map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, color: '#334155', flex: '0 0 200px' }}>{s.label}</span>
            <div style={{ flex: 1, height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${((s.count ?? 0) / max) * 100}%`, height: '100%', background: s.color ?? '#D97706', borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', fontFamily: '"Roboto Mono", monospace', width: 40, textAlign: 'right' }}>{s.count ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

