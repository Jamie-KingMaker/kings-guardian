// src/views/PopulationRisk/index.jsx
import { useEffect, useMemo, useState } from 'react';
import { dashboardService } from '@/api/index.js';
import { DateRangePicker } from '@/components/DateRangePicker.jsx';
import { cardStyle } from '@/config/constants.js';
import { CardSkeleton } from '@/components/skeletons/index.js';
import { fmtK, fmtPct } from '@/utils/format.js';
import { customRangeToPreset } from '@/utils/dateRange.js';

export function PopulationRisk({ brand, country, dateRange: dateRangeProp = '7d' }) {
  const [dateRange, setDateRange] = useState(dateRangeProp);
  const [customRange, setCustomRange] = useState(null);
  const [data, setData] = useState(null);

  const effectiveRange = useMemo(() => dateRange === 'custom' ? customRangeToPreset(customRange) : (dateRange ?? '7d'), [dateRange, customRange]);

  useEffect(() => {
    dashboardService.getSummary({ brand, country, range: effectiveRange })
      .then(d => setData(d))
      .catch(() => setData(null));
  }, [brand, country, effectiveRange]);

  if (!data) return <div style={{ padding: 24 }}><CardSkeleton height={420} /></div>;

  const { dist, mau, signals, rgAdoption, rangeLabel, refreshLabel } = data;

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>Population analytics · {rangeLabel}</div>
          <h1 style={{ fontSize: 25, fontWeight: 600, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>Player Behaviours & Trends</h1>
          <p style={{ fontSize: 15, color: '#64748B', margin: '4px 0 0' }}>Risk signals, tier migration, product distribution and RG effectiveness.</p>
        </div>
        <div style={{ fontSize: 13, color: '#94A3B8' }}>Scores {refreshLabel} · Last refreshed 06:00 today</div>
      </div>

      <DateRangePicker value={dateRange} onChange={setDateRange} custom={customRange} onCustom={setCustomRange} pageMode />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        <PRStat label="Active Base" value={fmtK(mau)} sub={data.activeUnitFull} color="#0F172A" />
        <PRStat label="High Risk" value={dist.high.toLocaleString()} sub={`${fmtPct((dist.high / mau) * 100)} of base`} color="#DC2626" />
        <PRStat label="Medium Risk" value={dist.med.toLocaleString()} sub={`${fmtPct((dist.med / mau) * 100)} of base`} color="#D97706" />
        <PRStat label="Low Risk" value={dist.low.toLocaleString()} sub={`${fmtPct((dist.low / mau) * 100)} of base`} color="#16A34A" />
        <PRStat label="Insufficient Data" value={dist.unrated.toLocaleString()} sub={`${fmtPct((dist.unrated / mau) * 100)} of base`} color="#94A3B8" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ ...cardStyle }}>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>Risk Signal Leaderboard</div>
          <div style={{ fontSize: 16, color: '#0F172A', fontWeight: 600, marginBottom: 16 }}>Behaviours driving escalation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {signals.map((s, idx) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 18, fontFamily: '"Roboto Mono", monospace', color: '#CBD5E1', fontWeight: 700 }}>{String(idx + 1).padStart(2, '0')}</span>
                <span style={{ flex: 1, fontSize: 14, color: '#334155' }}>{s.label}</span>
                <span style={{ width: 70, textAlign: 'right', fontFamily: '"Roboto Mono", monospace', fontWeight: 700 }}>{s.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...cardStyle }}>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>RG Tool Adoption</div>
          <div style={{ fontSize: 16, color: '#0F172A', fontWeight: 600, marginBottom: 16 }}>Active players using responsible gambling tools</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rgAdoption.map((tool) => (
              <div key={tool.tool}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, color: '#334155' }}>{tool.tool}</span>
                  <span style={{ fontFamily: '"Roboto Mono", monospace', fontWeight: 700 }}>{tool.count.toLocaleString()}</span>
                </div>
                <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3 }}>
                  <div style={{ width: `${(tool.count / rgAdoption[0].count) * 100}%`, height: '100%', background: '#16A34A', borderRadius: 3, opacity: 0.6 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PRStat({ label, value, sub, color }) {
  return (
    <div style={{ background: '#FFFFFF', borderWidth: '1px 1px 1px 3px', borderStyle: 'solid', borderColor: `#E2E8F0 #E2E8F0 #E2E8F0 ${color}`, borderRadius: 8, padding: '14px 16px' }}>
      <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: '#0F172A', fontFamily: '"Roboto Mono", monospace', lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#64748B' }}>{sub}</div>
    </div>
  );
}

