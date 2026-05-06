// src/views/Home/StatCard.jsx
import { RISK_COLORS } from '@/config/constants.js';

export function StatCard({ label, value, subtext, delta, deltaUp, tone }) {
  const c      = RISK_COLORS[tone] ?? RISK_COLORS.unrated;
  const isHigh = tone === 'high';
  const warn   = isHigh ? !!deltaUp : !deltaUp;
  return (
    <div style={{ background: '#FFFFFF', borderWidth: '1px 1px 1px 3px', borderStyle: 'solid', borderColor: `#E2E8F0 #E2E8F0 #E2E8F0 ${c.main}`, borderRadius: 8, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.main }} />
        <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: '#0F172A', lineHeight: 1, letterSpacing: '-0.02em', fontFamily: '"Roboto Mono", monospace', marginBottom: 4 }}>{value}</div>
      {subtext && <div style={{ fontSize: 13, color: '#64748B', marginBottom: delta ? 4 : 0 }}>{subtext}</div>}
      {delta && <div style={{ fontSize: 13, fontWeight: 600, color: warn ? '#DC2626' : '#16A34A' }}>{delta}</div>}
    </div>
  );
}

