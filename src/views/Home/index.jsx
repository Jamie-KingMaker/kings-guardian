// src/views/Home/index.jsx
import { useState, useEffect, useMemo } from 'react';
import { dashboardService, ApiError } from '@/api/index.js';
import { DateRangePicker }  from '@/components/DateRangePicker.jsx';
import { StatCardSkeleton, CardSkeleton } from '@/components/skeletons/index.js';
import { Icon }             from '@/components/atoms/index.js';
import { BRAND_ACCENTS } from '@/config/brands.js';
import { COUNTRY_NAMES, btnPrimary, btnSecondary } from '@/config/constants.js';
import { customRangeToPreset } from '@/utils/dateRange.js';
import { fmtMau }           from '@/utils/format.js';
import t from '@/config/i18n.js';

import { StatCard }         from './StatCard.jsx';
import { RiskTrendCard }    from './RiskTrendCard.jsx';
import { RGCopilotCard }    from './RGCopilotCard.jsx';
import { DepositActivityCard } from './DepositActivityCard.jsx';
import { TopMoversCard }    from './TopMoversCard.jsx';
import { AttentionCard }    from './AttentionCard.jsx';
import { RGAdoptionCard }   from './RGAdoptionCard.jsx';
import { SignalsBreakdownCard } from './SignalsBreakdownCard.jsx';

export function HomeDashboard({ brand, country, dateRange, customRange, setDateRange, setCustomRange, onPlayerClick }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const effectiveRange = useMemo(() => {
    if (dateRange !== 'custom') return dateRange ?? '7d';
    return customRangeToPreset(customRange);
  }, [dateRange, customRange]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    dashboardService.getSummary({ brand, range: effectiveRange, country })
      .then(d => { setData(d); setLoading(false); })
      .catch(err => {
        if (err instanceof ApiError) {
          setError(err.body?.error?.message || 'Failed to load dashboard');
        } else {
          setError('Failed to load dashboard');
        }
        setLoading(false);
      });
  }, [brand, effectiveRange, country]);

  const brandLabel = brand === 'all' ? t.home.portfolio : (BRAND_ACCENTS[brand]?.name ?? brand);

  if (loading || !data) {
    return (
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ height: 56, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8 }} />
        <div style={{ height: 36 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12 }}>
          <CardSkeleton height={260} />
          <CardSkeleton height={260} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr', gap: 12 }}>
          <CardSkeleton height={200} />
          <CardSkeleton height={200} />
          <CardSkeleton height={200} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ padding: 16, background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 14 }}>
          {error}
        </div>
      </div>
    );
  }

  const { dist, mau, rangeLabel, rangeKey, statDeltas: sd, activeUnit, activeUnitFull, refreshLabel } = data;
  const total = dist.high + dist.med + dist.low + dist.unrated;
  const pct   = (n) => (n / total * 100).toFixed(1);

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>
            {brandLabel} · {COUNTRY_NAMES[country] ?? country}
          </div>
          <h1 style={{ fontSize: 25, fontWeight: 600, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>{t.home.title}</h1>
          <p style={{ fontSize: 15, color: '#64748B', margin: '4px 0 0' }}>
            {fmtMau(mau)} {activeUnitFull} · {total.toLocaleString()} risk-monitored over the last {rangeLabel} · {refreshLabel} batch refresh
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={btnSecondary}><Icon name="export" size={14} /> {t.home.export}</button>
          <button style={btnPrimary}><Icon name="refresh" size={14} /> {t.home.refresh}</button>
        </div>
      </div>

      <DateRangePicker value={dateRange} onChange={setDateRange} custom={customRange} onCustom={setCustomRange} pageMode />

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        <StatCard label={t.home.activeBase}       value={fmtMau(mau)}               subtext={`${mau.toLocaleString()} ${activeUnit}`}     delta="" tone="unrated" />
        <StatCard label={t.home.highRisk}         value={dist.high.toLocaleString()} subtext={`${pct(dist.high)}% of base`}                delta={`${sd.high} ${sd.dailyVs}`} deltaUp tone="high" />
        <StatCard label={t.home.mediumRisk}       value={dist.med.toLocaleString()}  subtext={`${pct(dist.med)}% of base`}                 delta={`${sd.med} ${sd.dailyVs}`}  deltaUp tone="medium" />
        <StatCard label={t.home.lowRisk}          value={dist.low.toLocaleString()}  subtext={`${pct(dist.low)}% of base`}                 delta={`${sd.low} ${sd.dailyVs}`}  tone="low" />
        <StatCard label={t.home.insufficientData} value={dist.unrated.toLocaleString()} subtext={t.home.insufficientDataSub}               delta="" tone="unrated" />
      </div>

      {/* Two-col body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12 }}>
        <RiskTrendCard data={data.trend} rangeLabel={rangeLabel} growth={data.trendGrowthPct} />
        <RGCopilotCard brand={brand} country={country} rangeLabel={rangeLabel} dist={dist} total={total} mau={mau} sd={sd} rangeData={data} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr', gap: 12 }}>
        <DepositActivityCard data={data.deposits} brand={brand} total={brand === 'supersportbet' ? data.depositTotalSS : data.depositTotal} growth={data.depositGrowth} rangeLabel={rangeLabel} deltaLabel={data.deltaLabel} rangeKey={rangeKey} dist={dist} mau={mau} />
        <TopMoversCard movers={data.movers} brand={brand} country={country} onPlayerClick={onPlayerClick} />
        <AttentionCard players={(data.movers ?? []).filter(m => m.status).slice(0, 6)} onPlayerClick={onPlayerClick} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <RGAdoptionCard items={data.rgAdoption} rangeLabel={rangeLabel} />
        <SignalsBreakdownCard signals={data.signals} rangeLabel={rangeLabel} />
      </div>
    </div>
  );
}

