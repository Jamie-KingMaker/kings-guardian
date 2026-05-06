// src/views/Home/TopMoversCard.jsx
import { cardStyle, RISK_COLORS } from '@/config/constants.js';
import { Sparkline } from '@/components/atoms/index.js';

const SPARK_DATA = {
  betking:      [12, 14, 16, 22, 28, 34, 42],
  supersportbet:[10, 12, 14, 18, 22, 27, 33],
};

export function TopMoversCard({ movers, brand, country, onPlayerClick }) {
  if (!movers?.length) return null;
  return (
    <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Top movers</div>
        <div style={{ fontSize: 16, color: '#0F172A', fontWeight: 600, marginTop: 2 }}>Biggest score changes</div>
      </div>
      <div>
        {movers.slice(0, 5).map((m, i) => {
          const c = RISK_COLORS.high;
          return (
            <div key={m.id} onClick={() => onPlayerClick?.(m.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: i < 4 ? '1px solid #F1F5F9' : 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ fontSize: 13, color: '#CBD5E1', fontFamily: '"Roboto Mono", monospace', width: 18, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', fontFamily: '"Roboto Mono", monospace', marginBottom: 1 }}>{m.id}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{m.from ?? '—'} → {m.to ?? '—'}</div>
              </div>
              <Sparkline data={SPARK_DATA[m.brand] ?? SPARK_DATA.betking} color={c.main} width={44} height={20} fill={false} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#DC2626', fontFamily: '"Roboto Mono", monospace' }}>
                +{m.delta ?? 0}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

