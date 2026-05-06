// src/views/Home/RGCopilotCard.jsx
import { useState, useEffect } from 'react';
import { aiService }   from '@/api/index.js';
import { cardStyle }   from '@/config/constants.js';
import { Shimmer }     from '@/components/skeletons/index.js';
import { sanitizeInsights } from '@/utils/sanitize.js';
import t from '@/config/i18n.js';

const RISK_FILTERS = [
  { id: null,     label: 'All' },
  { id: 'high',   label: 'High risk',   color: '#DC2626' },
  { id: 'medium', label: 'Medium risk', color: '#D97706' },
  { id: 'low',    label: 'Low risk',    color: '#16A34A' },
];

export function RGCopilotCard({ brand, country, rangeLabel, dist, total, mau, sd, rangeData }) {
  const [riskFilter, setRiskFilter] = useState(null);
  const [insights, setInsights]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const [regen, setRegen]           = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(false);
    aiService.getInsights({ brand, country, rangeLabel, dist, total, mau, sd, rangeData, riskFilter })
      .then(res => {
        // Sanitize all insights for safe display
        const sanitized = sanitizeInsights(res.insights ?? []);
        setInsights(sanitized);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch AI insights:', err);
        setError(true);
        setLoading(false);
      });
  }, [brand, country, rangeLabel, riskFilter, regen]);

  return (
    <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{t.ai.morning}</div>
          <div style={{ fontSize: 16, color: '#0F172A', fontWeight: 600, marginTop: 2 }}>{t.ai.keyCallouts}</div>
        </div>
        <button onClick={() => setRegen(r => r + 1)} style={{ background: 'transparent', border: 'none', fontSize: 12, color: '#6366F1', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>↺ Regenerate</button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '8px 16px 0', borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
        {RISK_FILTERS.map(f => (
          <button key={String(f.id)} onClick={() => setRiskFilter(f.id)}
            style={{ padding: '5px 10px', borderRadius: 4, border: 'none', background: riskFilter === f.id ? '#0F172A' : 'transparent', color: riskFilter === f.id ? '#FFFFFF' : '#475569', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: -1, borderBottom: riskFilter === f.id ? '2px solid #0F172A' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: 5 }}>
            {f.color && <span style={{ width: 6, height: 6, borderRadius: '50%', background: f.color }} />}
            {f.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 160 }}>
        {loading && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Shimmer width={6} height={6} style={{ borderRadius: '50%', marginTop: 4, flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Shimmer width={`${70 + i * 5}%`} height={10} />
              <Shimmer width="90%" height={10} />
            </div>
          </div>
        ))}
        {error && (
          <div style={{ fontSize: 14, color: '#DC2626', padding: 8 }}>
            {t.ai.unavailable}
          </div>
        )}
        {!loading && !error && insights?.length === 0 && (
          <div style={{ fontSize: 14, color: '#94A3B8' }}>{t.ai.unavailable}</div>
        )}
        {!loading && !error && insights?.map((insight, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 8,
              fontSize: 14,
              color: '#0F172A',
              lineHeight: 1.6,
              borderLeft: '2px solid #E2E8F0',
              paddingLeft: 10,
            }}
          >
            {/* Render sanitized text safely as plaintext */}
            <span>{insight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

