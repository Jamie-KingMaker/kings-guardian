// src/views/Home/RGAdoptionCard.jsx
import { cardStyle } from '@/config/constants.js';

export function RGAdoptionCard({ items = [], rangeLabel }) {
  return (
    <div style={{ ...cardStyle }}>
      <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>RG tool adoption</div>
      <div style={{ fontSize: 16, color: '#0F172A', fontWeight: 600, marginBottom: 16 }}>Soft tools picked up by players · {rangeLabel}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {items.map((i) => (
          <div key={i.tool} style={{ padding: 12, background: '#F8FAFC', borderRadius: 6, border: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 6 }}>{i.tool}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', fontFamily: '"Roboto Mono", monospace', letterSpacing: '-0.01em', marginBottom: 4 }}>
              {(i.count ?? 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 13, color: '#16A34A', fontWeight: 600 }}>↑ {i.delta ?? 0}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

