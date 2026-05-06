// src/views/Home/AttentionCard.jsx
import { cardStyle } from '@/config/constants.js';
import { RiskDot } from '@/components/atoms/index.js';

export function AttentionCard({ players = [], onPlayerClick }) {
  const rows = players.slice(0, 5);
  return (
    <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Requires attention</div>
          <div style={{ fontSize: 14, color: '#94A3B8' }}>Flagged but not yet actioned</div>
        </div>
        <span style={{ fontSize: 13, padding: '3px 8px', background: 'rgba(217,119,6,0.10)', color: '#D97706', borderRadius: 10, fontWeight: 700 }}>{rows.length} open</span>
      </div>
      <div>
        {rows.length === 0 && <div style={{ padding: 16, fontSize: 13, color: '#94A3B8' }}>No open cases in this filter.</div>}
        {rows.map((p, i) => (
          <button key={p.id ?? i} onClick={() => onPlayerClick?.(p.id)} style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', padding: '10px 16px', display: 'flex', gap: 10, alignItems: 'center', borderBottom: i < rows.length - 1 ? '1px solid #F1F5F9' : 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <RiskDot level={p.risk ?? 'medium'} size={8} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A', fontFamily: '"Roboto Mono", monospace' }}>{p.id ?? '—'}</div>
              <div style={{ fontSize: 12.5, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.insight ?? 'Escalating behaviour requires manual review.'}</div>
            </div>
            <span style={{ fontSize: 11, color: '#D97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.status ?? 'monitor'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

