// src/views/Home/DepositActivityCard.jsx
import { cardStyle } from '@/config/constants.js';
import { fmtCompact, fmtMau } from '@/utils/format.js';

export function DepositActivityCard({ data, brand, total, growth, rangeLabel, deltaLabel, rangeKey, dist, mau }) {
  if (!data || data.length === 0) return null;
  const maxBar = Math.max(...data);
  const recent = data.slice(-7);

  return (
    <div style={{ ...cardStyle }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Deposit Activity</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', fontFamily: '"Roboto Mono", monospace', letterSpacing: '-0.01em', marginTop: 4 }}>
            {fmtCompact(total, brand)}
          </div>
          <div style={{ fontSize: 13, color: '#16A34A', fontWeight: 600, marginTop: 2 }}>↑ {growth}% {deltaLabel}</div>
        </div>
        <div style={{ fontSize: 12, color: '#94A3B8', textAlign: 'right' }}>{fmtMau(mau)} {rangeLabel}</div>
      </div>

      {/* Bar chart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 80, marginBottom: 6 }}>
        {data.map((v, i) => {
          const isRecent = i >= data.length - 7;
          return (
            <div key={i} title={`Day ${i + 1}: index ${v}`}
              style={{ flex: 1, borderRadius: '2px 2px 0 0', background: isRecent ? '#0F172A' : '#E2E8F0', height: `${(v / maxBar * 100).toFixed(1)}%`, minHeight: 2, transition: 'height 0.2s ease' }} />
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8' }}>
        <span>{rangeLabel} ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

