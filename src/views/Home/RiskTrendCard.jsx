// src/views/Home/RiskTrendCard.jsx
import { cardStyle } from '@/config/constants.js';
import { fmtK }      from '@/utils/format.js';

const COLORS = { high: '#DC2626', med: '#D97706', low: '#16A34A' };

export function RiskTrendCard({ data, rangeLabel, growth }) {
  if (!data || data.length < 2) return null;
  const W = 540, H = 180, PAD_L = 42, PAD_B = 24, PAD_T = 12;
  const allVals = data.flatMap(d => [d.high, d.med, d.low]);
  const maxY    = Math.ceil(Math.max(...allVals) / 1000) * 1000 || 1;
  const innerW  = W - PAD_L - 8;
  const innerH  = H - PAD_T - PAD_B;

  const path = (key) =>
    data.map((d, i) => {
      const x = PAD_L + (i / (data.length - 1)) * innerW;
      const y = PAD_T + innerH - (d[key] / maxY) * innerH;
      return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');

  return (
    <div style={{ ...cardStyle }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Risk distribution trend</div>
          <div style={{ fontSize: 16, color: '#0F172A', fontWeight: 600, marginTop: 2 }}>{rangeLabel} · player migration</div>
        </div>
        <span style={{ fontSize: 13, color: '#DC2626', fontWeight: 600 }}>High-risk ↑{growth}%</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <g key={i}>
            <line x1={PAD_L} y1={PAD_T + innerH * t} x2={W - 8} y2={PAD_T + innerH * t} stroke="#F1F5F9" strokeWidth="1" />
            <text x={PAD_L - 6} y={PAD_T + innerH * t + 4} textAnchor="end" fontSize="10" fill="#CBD5E1">{fmtK(Math.round(maxY * (1 - t)))}</text>
          </g>
        ))}
        {['high', 'med', 'low'].map(k => (
          <path key={k} d={path(k)} fill="none" stroke={COLORS[k]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {data.map((d, i) => {
          if (i % Math.max(1, Math.floor(data.length / 5)) !== 0 && i !== data.length - 1) return null;
          const x = PAD_L + (i / (data.length - 1)) * innerW;
          return <text key={i} x={x} y={H - 4} textAnchor="middle" fontSize="10" fill="#94A3B8">{d.d}</text>;
        })}
      </svg>

      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        {[['high','High risk',COLORS.high],['med','Medium risk',COLORS.med],['low','Low risk',COLORS.low]].map(([k, l, c]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 2, background: c, display: 'inline-block', borderRadius: 1 }} />
            <span style={{ fontSize: 12.5, color: '#64748B' }}>{l}</span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A', fontFamily: '"Roboto Mono", monospace' }}>{(data[data.length-1][k]).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

