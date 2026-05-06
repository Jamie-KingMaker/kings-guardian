// Home Dashboard view for King's Guard

const { useMemo: useMemoHome } = React;

function HomeDashboard({ brand, country, dateRange, customRange, setDateRange, setCustomRange, onPlayerClick }) {
  const { PLAYERS, buildRangeData, MAU, MAU_TOTALS } = window.KGData;
  // Map 'custom' to nearest preset based on day count
  const effectiveRange = useMemoHome(() => {
    if (dateRange !== 'custom' || !customRange?.start || !customRange?.end) return dateRange || '7d';
    const days = Math.round((customRange.end - customRange.start) / 86400000) + 1;
    if (days <= 10) return '7d';
    if (days <= 22) return '14d';
    if (days <= 60) return '30d';
    if (days <= 120) return '90d';
    return 'ytd';
  }, [dateRange, customRange]);
  const rangeData = useMemoHome(() => buildRangeData(effectiveRange, brand), [effectiveRange, brand]);

  const filtered = PLAYERS.filter((p) =>
  (brand === 'all' || p.brand === brand) && (
  country === 'ALL' || p.country === country)
  );

  // Country-scoped MAU + distribution. Country filter scales totals proportionally.
  let countryShare = 1;
  if (brand === 'supersportbet' && country === 'ZA') countryShare = MAU.supersportbet.ZA / MAU_TOTALS.supersportbet;else
  if (brand === 'supersportbet' && country === 'ZM') countryShare = MAU.supersportbet.ZM / MAU_TOTALS.supersportbet;

  const dist = {
    high: Math.round(rangeData.dist.high * countryShare),
    med: Math.round(rangeData.dist.med * countryShare),
    low: Math.round(rangeData.dist.low * countryShare),
    unrated: Math.round(rangeData.dist.unrated * countryShare)
  };
  const total = dist.high + dist.med + dist.low + dist.unrated;
  const mau = Math.round(rangeData.mau * countryShare);
  const pct = (n) => (n / total * 100).toFixed(1);
  const sd = rangeData.statDeltas;
  const fmtMau = (n) => n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? Math.round(n / 1000) + 'k' : n.toLocaleString();

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>
            {brand === 'all' ? 'KingMakers Portfolio' : BRAND_ACCENTS[brand].name} · {COUNTRY_NAMES[country] || country}
          </div>
          <h1 style={{ fontSize: 25, fontWeight: 600, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>Guardian Dashboard

          </h1>
          <p style={{ fontSize: 15, color: '#64748B', margin: '4px 0 0' }}>
            {fmtMau(mau)} {rangeData.activeUnitFull} · {total.toLocaleString()} risk-monitored over the last {rangeData.rangeLabel} · {rangeData.refreshLabel} batch refresh
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={btnSecondary}>
            <Icon name="export" size={14} /> Export
          </button>
          <button style={btnPrimary}>
            <Icon name="refresh" size={14} /> Refresh data
          </button>
        </div>
      </div>

      {/* Inline date range picker */}
      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
        custom={customRange}
        onCustom={setCustomRange}
        pageMode
      />

      {/* Top stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        <StatCard
          label="Active base"
          value={fmtMau(mau)}
          subtext={`${mau.toLocaleString()} ${rangeData.activeUnit}`}
          delta=""
          tone="unrated" />

        <StatCard
          label="High risk"
          value={dist.high.toLocaleString()}
          subtext={`${pct(dist.high)}% of base`}
          delta={`${sd.high} ${sd.dailyVs}`}
          deltaUp
          tone="high" />

        <StatCard
          label="Medium risk"
          value={dist.med.toLocaleString()}
          subtext={`${pct(dist.med)}% of base`}
          delta={`${sd.med} ${sd.dailyVs}`}
          deltaUp
          tone="medium" />

        <StatCard
          label="Low risk"
          value={dist.low.toLocaleString()}
          subtext={`${pct(dist.low)}% of base`}
          delta={`${sd.low} ${sd.dailyVs}`}
          tone="low" />

        <StatCard
          label="Insufficient data"
          value={dist.unrated.toLocaleString()}
          subtext="<7 days history"
          delta=""
          tone="unrated" />

      </div>

      {/* Two-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12 }}>
        <RiskTrendCard data={rangeData.trend} rangeLabel={rangeData.rangeLabel} growth={rangeData.trendGrowthPct} />
        <RGCopilotCard
          brand={brand}
          country={country}
          rangeLabel={rangeData.rangeLabel}
          dist={dist}
          total={total}
          mau={mau}
          sd={sd}
          rangeData={rangeData} />
        
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <DepositActivityCard data={rangeData.deposits} brand={brand} total={brand === 'supersportbet' ? rangeData.depositTotalSS : rangeData.depositTotal} growth={rangeData.depositGrowth} rangeLabel={rangeData.rangeLabel} deltaLabel={rangeData.deltaLabel} rangeKey={effectiveRange} dist={dist} mau={mau} />
        <TopMoversCard movers={rangeData.movers} brand={brand} country={country} onPlayerClick={onPlayerClick} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <RGAdoptionCard items={rangeData.rgAdoption} rangeLabel={rangeData.rangeLabel} />
        <SignalsBreakdownCard signals={rangeData.signals} rangeLabel={rangeData.rangeLabel} />
      </div>
    </div>);

}

const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '7px 14px', borderRadius: 6, border: 'none',
  background: '#0F172A', color: '#FFFFFF', fontSize: 14, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'inherit'
};
const btnSecondary = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '7px 14px', borderRadius: 6,
  background: '#FFFFFF', color: '#334155', fontSize: 14, fontWeight: 500,
  border: '1px solid #E2E8F0',
  cursor: 'pointer', fontFamily: 'inherit'
};

const cardStyle = {
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: 8,
  padding: 18
};

function StatCard({ label, value, subtext, delta, deltaUp, tone }) {
  const c = RISK_COLORS[tone === 'high' ? 'high' : tone === 'medium' ? 'medium' : tone === 'low' ? 'low' : 'unrated'];
  return (
    <div style={{ ...cardStyle, padding: 16, borderLeft: `3px solid ${c.main}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <RiskDot level={tone} size={6} />
        <span style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 600, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6, fontFamily: "'Roboto Mono', monospace" }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: '#94A3B8' }}>{subtext}</span>
        {delta &&
        <span style={{ fontSize: 13, fontWeight: 600, color: deltaUp ? c.main : '#16A34A' }}>
            {delta}
          </span>
        }
      </div>
    </div>);

}

function RiskTrendCard({ data, rangeLabel, growth }) {
  const [view, setView] = React.useState('overview');
  const W = 720;
  const H = 200;
  const PAD_L = 40,PAD_B = 28,PAD_T = 12,PAD_R = 12;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const max = Math.max(...data.map((d) => d.high + d.med + d.low));
  const niceMax = Math.ceil(max / 1000) * 1000;
  const xStep = innerW / (data.length - 1);

  const series = ['low', 'med', 'high'];
  const colors = { low: '#16A34A', med: '#D97706', high: '#DC2626' };

  // Stacked area
  const areas = {};
  series.forEach((s, idx) => {
    const points = data.map((d, i) => {
      const stack = series.slice(0, idx + 1).reduce((sum, ss) => sum + d[ss], 0);
      const y = PAD_T + innerH - stack / niceMax * innerH;
      const x = PAD_L + i * xStep;
      return [x, y];
    });
    const prevPoints = idx === 0 ?
    data.map((_, i) => [PAD_L + i * xStep, PAD_T + innerH]) :
    data.map((d, i) => {
      const stack = series.slice(0, idx).reduce((sum, ss) => sum + d[ss], 0);
      const y = PAD_T + innerH - stack / niceMax * innerH;
      return [PAD_L + i * xStep, y];
    });
    const path = points.map((p, i) => i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`).join(' ') +
    ' ' + prevPoints.slice().reverse().map((p) => `L${p[0]},${p[1]}`).join(' ') + 'Z';
    const linePath = points.map((p, i) => i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`).join(' ');
    areas[s] = { path, linePath, color: colors[s] };
  });

  // Per-tier mini sparkline
  const TierSparkline = ({ bucket, label, color, fullWidth }) => {
    const vals = data.map(d => d[bucket]);
    const mn = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1;
    const SW = fullWidth ? 720 : 200, SH = fullWidth ? 180 : 56, PL = 40, PB = fullWidth ? 26 : 16, PT = fullWidth ? 10 : 4, PR = 8;
    const iW = SW - PL - PR, iH = SH - PT - PB;
    const xs = iW / (vals.length - 1);
    const pts = vals.map((v, i) => [PL + i * xs, PT + iH - ((v - mn) / rng) * iH]);
    const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    const area = line + ` L${pts[pts.length-1][0].toFixed(1)},${PT+iH} L${PL},${PT+iH} Z`;
    const cur = vals[vals.length - 1];
    const pct = ((cur - vals[0]) / (vals[0] || 1) * 100).toFixed(1);
    const up = cur >= vals[0];
    const fmt = v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(1)+'k' : v;
    return (
      <div style={{ flex: 1, minWidth: 0, padding: '10px 12px 8px', borderRadius: 6, border: `1px solid ${color}20`, background: `${color}05`, display: fullWidth ? 'flex' : undefined, flexDirection: fullWidth ? 'column' : undefined }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }}></span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: up ? color : '#16A34A' }}>{up ? '↑' : '↓'}{Math.abs(pct)}%</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', fontFamily: "'Roboto Mono', monospace", letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 4, flexShrink: 0 }}>
          {fmt(cur)}
        </div>
        {fullWidth ? (
          <div style={{ flex: 1, position: 'relative', minHeight: 80 }}>
            <svg viewBox={`0 0 ${SW} ${SH}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', position: 'absolute', inset: 0 }}>
              {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                const v = Math.round(mn + (mx - mn) * (1 - t));
                const y = PT + iH - ((v - mn) / rng) * iH;
                return <g key={i}>
                  <line x1={PL} y1={y} x2={SW-PR} y2={y} stroke={`${color}18`} strokeWidth="1"/>
                  <text x={PL-3} y={y+3} fontSize="12" textAnchor="end" fill="#94A3B8" fontFamily="'Roboto Mono', monospace">{fmt(v)}</text>
                </g>;
              })}
              <path d={area} fill={color} fillOpacity="0.10"/>
              <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3" fill={color} stroke="#fff" strokeWidth="1.5"/>
              {(() => {
                const n = data.length;
                const step = Math.max(1, Math.ceil((n - 1) / 6));
                const idxs = new Set(Array.from({ length: n }, (_, i) => i).filter(i => i % step === 0));
                return data.map((d, i) => {
                  if (!idxs.has(i)) return null;
                  return <text key={i} x={pts[i][0]} y={SH-4} fontSize="12"
                    textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'} fill="#94A3B8">{d.d}</text>;
                });
              })()}
            </svg>
          </div>
        ) : (
          <svg viewBox={`0 0 ${SW} ${SH}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
            {[0, 1].map((t, i) => {
              const v = Math.round(mn + (mx - mn) * (1 - t));
              const y = PT + iH - ((v - mn) / rng) * iH;
              return <g key={i}>
                <line x1={PL} y1={y} x2={SW-PR} y2={y} stroke={`${color}18`} strokeWidth="1" strokeDasharray="3 3"/>
                <text x={PL-3} y={y+3} fontSize="10" textAnchor="end" fill="#94A3B8" fontFamily="'Roboto Mono', monospace">{fmt(v)}</text>
              </g>;
            })}
            <path d={area} fill={color} fillOpacity="0.10"/>
            <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3" fill={color} stroke="#fff" strokeWidth="1.5"/>
            {[0, data.length-1].map(i => <text key={i} x={pts[i][0]} y={SH-1} fontSize="10" textAnchor={i===0?'start':'end'} fill="#CBD5E1">{data[i].d}</text>)}
          </svg>
        )}
      </div>
    );
  };

  return (
    <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>Risk distribution trend · {rangeLabel}</div>
        </div>
        <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 6, padding: 2, gap: 2 }}>
          {[
            ['overview', 'Overview', null],
            ['high',     'High',     '#DC2626'],
            ['med',      'Medium',   '#D97706'],
            ['low',      'Low',      '#16A34A'],
          ].map(([id, label, dot]) => (
            <button key={id} onClick={() => setView(id)} style={{
              padding: '4px 10px', borderRadius: 4, border: 'none', fontSize: 13, fontWeight: 600,
              background: view === id ? '#FFFFFF' : 'transparent',
              color: view === id ? '#0F172A' : '#64748B',
              boxShadow: view === id ? '0 1px 3px rgba(15,23,42,0.10)' : 'none',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }}></span>}
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === 'overview' && <>
        <div style={{ display: 'flex', gap: 14, fontSize: 13, marginBottom: 10, flexShrink: 0 }}>
          {[['High', '#DC2626', ''], ['Medium', '#D97706', ''], ['Low', '#16A34A', '5 3']].map(([l, c, dash]) =>
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#475569', fontWeight: 500 }}>
              <svg width="18" height="10" style={{ flexShrink: 0 }}>
                <line x1="0" y1="5" x2="18" y2="5" stroke={c} strokeWidth="2.5" strokeDasharray={dash || 'none'} />
              </svg>
              {l}
            </div>
          )}
        </div>
        <div style={{ flex: 1, position: 'relative', minHeight: 120 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', position: 'absolute', inset: 0 }}>
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
              const y = PAD_T + innerH * t;
              const v = Math.round(niceMax * (1 - t));
              return (
                <g key={i}>
                  <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                  <text x={PAD_L - 6} y={y + 3} fontSize="12" textAnchor="end" fill="#94A3B8" fontFamily="'Roboto Mono', monospace">
                    {v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}
                  </text>
                </g>);
            })}
            {[
              { s: 'low',  color: '#16A34A', dash: '5 3' },
              { s: 'med',  color: '#D97706', dash: ''    },
              { s: 'high', color: '#DC2626', dash: ''    },
            ].map(({ s, color, dash }) => {
              const pts = data.map((d, i) => [
                PAD_L + i * xStep,
                PAD_T + innerH - (d[s] / niceMax) * innerH,
              ]);
              const linePath = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
              const last = pts[pts.length - 1];
              return (
                <g key={s}>
                  <path d={linePath} fill="none" stroke={color} strokeWidth="1.8"
                    strokeDasharray={dash || 'none'} strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx={last[0]} cy={last[1]} r="3" fill={color} stroke="#fff" strokeWidth="1.5" />
                </g>
              );
            })}
            {(() => {
              const n = data.length;
              const step = Math.max(1, Math.ceil((n - 1) / 6));
              const idxs = new Set(Array.from({ length: n }, (_, i) => i).filter(i => i % step === 0));
              return data.map((d, i) => {
                if (!idxs.has(i)) return null;
                return <text key={i} x={PAD_L + i * xStep} y={H - 8} fontSize="12"
                  textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'} fill="#94A3B8">{d.d}</text>;
              });
            })()}
          </svg>
        </div>
      </>}

      {view === 'high' && <TierSparkline bucket="high" label="High risk"   color="#DC2626" fullWidth />}
      {view === 'med'  && <TierSparkline bucket="med"  label="Medium risk" color="#D97706" fullWidth />}
      {view === 'low'  && <TierSparkline bucket="low"  label="Low risk"    color="#16A34A" fullWidth />}
    </div>);

}

function RiskDistributionHero({ dist, total, mau, rangeData, sd, pct, fmtMau }) {
  const items = [
  { key: 'high', label: 'High', count: dist.high, color: '#DC2626', delta: sd.high, tone: 'high' },
  { key: 'med', label: 'Medium', count: dist.med, color: '#D97706', delta: sd.med, tone: 'medium' },
  { key: 'low', label: 'Low', count: dist.low, color: '#16A34A', delta: sd.low, tone: 'low' },
  { key: 'unr', label: 'Insufficient data', count: dist.unrated, color: '#94A3B8', delta: null, tone: 'unrated' }];


  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10,
      padding: 22, boxShadow: '0 1px 2px rgba(15,23,42,0.04)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '2px 7px', borderRadius: 4, background: '#0F172A',
              color: '#FFFFFF', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase'
            }}>Morning brief</span>
            <span style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Risk distribution · {rangeData.rangeLabel}
            </span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#0F172A', letterSpacing: '-0.01em' }}>
            {total.toLocaleString()} risk-monitored players · {fmtMau(mau)} {rangeData.activeUnit}
          </div>
        </div>
        <div style={{ fontSize: 13, color: '#94A3B8' }}>{sd.dailyVs}</div>
      </div>

      {/* Stacked bar */}
      <div style={{ display: 'flex', height: 14, borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
        {items.map((i) =>
        <div key={i.key} style={{ flex: i.count, background: i.color }} title={`${i.label}: ${i.count.toLocaleString()}`}></div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94A3B8', marginBottom: 18, fontFamily: "'Roboto Mono', monospace" }}>
        {items.map((i) =>
        <span key={i.key}>{pct(i.count)}%</span>
        )}
      </div>

      {/* Bucket cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {items.map((i) =>
        <div key={i.key} style={{
          padding: '14px 14px',
          borderRadius: 8, border: '1px solid #E2E8F0',
          borderLeft: `3px solid ${i.color}`,
          background: '#FAFBFC'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <RiskDot level={i.tone} size={6} />
              <span style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{i.label}</span>
            </div>
            <div style={{
            fontSize: 27, fontWeight: 600, color: '#0F172A',
            fontFamily: "'Roboto Mono', monospace",
            letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6
          }}>{i.count.toLocaleString()}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>{pct(i.count)}% of base</span>
              {i.delta && <span style={{ fontSize: 12, fontWeight: 600, color: i.color }}>↑ {i.delta}</span>}
            </div>
          </div>
        )}
      </div>
    </div>);

}

function RGCopilotCard({ brand, country, rangeLabel, dist, total, mau, sd, rangeData }) {
  const [insights, setInsights] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [regen, setRegen] = React.useState(0);
  const [riskFilter, setRiskFilter] = React.useState(null); // null | 'high' | 'medium' | 'low'
  const reqIdRef = React.useRef(0);

  const brandLabel = brand === 'all' ? 'KingMakers Portfolio' :
  brand === 'betking' ? 'BetKing' :
  'SuperSportBet';
  const countryLabel = country === 'ALL' ? 'all markets' :
  country === 'NG' ? 'Nigeria' :
  country === 'ZA' ? 'South Africa' :
  country === 'ZM' ? 'Zambia' : country;

  React.useEffect(() => {
    const reqId = ++reqIdRef.current;
    setLoading(true);
    setError(false);

    const pct = (n) => (n / total * 100).toFixed(1);
    const depositTotal = brand === 'supersportbet' ? rangeData.depositTotalSS : rangeData.depositTotal;
    const topSignals = (rangeData.signals || []).slice(0, 3).map((s) => `${s.label} ${s.share}%`).join(', ');
    const topMover = (rangeData.movers || [])[0];

    const filterDirective = riskFilter ?
    `\nFOCUS FILTER: Generate callouts SPECIFICALLY about ${riskFilter}-risk players (${riskFilter === 'high' ? 'score 80+, escalation candidates' : riskFilter === 'medium' ? 'score 50–79, monitor & nudge' : 'score <50, healthy but watch for upward migration'}). All 5 callouts must address this segment — patterns within it, notable movers into/out of it, deposit & session signals from it, recommended actions for the team. Do not pivot to other risk levels unless directly comparing.` :
    '';

    const prompt = `You are an internal Responsible Gambling analyst writing a daily morning brief for the King's Guard platform at KingMakers. Your audience is the CS + RG operations team.

Generate exactly 5 short callouts tailored to the time window "${rangeLabel}" and these live numbers:

- Operator: ${brandLabel} (${countryLabel})
- Active base: ${mau.toLocaleString()} ${rangeData.activeUnitFull}
- Risk-monitored: ${total.toLocaleString()}
- High risk: ${dist.high.toLocaleString()} (${pct(dist.high)}%) — ${sd.high} ${sd.dailyVs}
- Medium risk: ${dist.med.toLocaleString()} (${pct(dist.med)}%) — ${sd.med} ${sd.dailyVs}
- Low risk: ${dist.low.toLocaleString()} (${pct(dist.low)}%) — ${sd.low} ${sd.dailyVs}
- Insufficient data: ${dist.unrated.toLocaleString()} (${pct(dist.unrated)}%)
- Deposit volume ${rangeLabel}: ${depositTotal.toLocaleString()} (${rangeData.depositGrowth}% ${rangeData.deltaLabel})
- Risk-trend growth: ${rangeData.trendGrowthPct}% ${rangeLabel}
- Top signals driving alerts: ${topSignals}
${topMover ? `- Notable mover: ${topMover.id} risk score now ${topMover.riskScore} (was ${topMover.riskFrom}); insight "${topMover.insight}"` : ''}${filterDirective}

Each callout MUST:
- Start with a 2-4 word punchy title in **bold markdown** followed by a colon, then a single sentence ≤ 22 words.
- Anchor to the ${rangeLabel} window — say "this week", "over the last 30 days", "quarter-to-date", etc. as appropriate.
- Reference at least one specific number from the data above.
- Suggest a concrete next action OR call out a pattern worth investigating.

Tone: calm, professional, operational. No emojis. No preamble. No closing summary. Output exactly 5 bullets, each on its own line, prefixed with "- ".`;

    window.claude.complete(prompt).
    then((text) => {
      if (reqIdRef.current !== reqId) return;
      const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('-') || l.startsWith('•'));
      const parsed = lines.slice(0, 5).map((l) => l.replace(/^[-•]\s*/, ''));
      if (parsed.length === 0) {
        setError(true);
      } else {
        setInsights(parsed);
      }
      setLoading(false);
    }).
    catch(() => {
      if (reqIdRef.current !== reqId) return;
      setError(true);
      setLoading(false);
    });
  }, [brand, country, rangeLabel, dist.high, dist.med, dist.low, dist.unrated, mau, regen, riskFilter]);

  // Render bold-then-colon-then-text
  const renderInsight = (txt) => {
    const m = txt.match(/^\*\*(.+?)\*\*\s*:?\s*(.*)$/);
    if (m) return { title: m[1].replace(/[.:]+$/, ''), body: m[2] };
    return { title: null, body: txt };
  };

  const tones = [
  { bar: '#DC2626', tag: 'rgba(220,38,38,0.08)', tagText: '#B91C1C', label: 'Risk' },
  { bar: '#D97706', tag: 'rgba(217,119,6,0.08)', tagText: '#B45309', label: 'Pattern' },
  { bar: '#0891B2', tag: 'rgba(8,145,178,0.08)', tagText: '#0E7490', label: 'Trend' },
  { bar: '#16A34A', tag: 'rgba(22,163,74,0.08)', tagText: '#15803D', label: 'Signal' },
  { bar: '#4338CA', tag: 'rgba(99,102,241,0.10)', tagText: '#4338CA', label: 'Action' }];


  return (
    <div style={{
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)',
      border: '1px solid #E2E8F0', borderRadius: 10,
      padding: 18, boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Subtle accent corner */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 140, height: 140,
        background: 'radial-gradient(circle at top right, rgba(99,102,241,0.08), transparent 70%)',
        pointerEvents: 'none'
      }}></div>

      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 10, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: 'linear-gradient(135deg, #6366F1, #4338CA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFFFFF', fontSize: 15, fontWeight: 700,
            boxShadow: '0 2px 6px rgba(67,56,202,0.25)', flexShrink: 0
          }}>★</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 1 }}>
              King's Guard AI
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', letterSpacing: '-0.005em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Key callouts · {rangeLabel}
            </div>
          </div>
        </div>
        {/* Risk-bucket filter */}
        <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 6, padding: 2, gap: 2, flexShrink: 0 }}>
          {[
          { id: null, label: 'Overview', dot: null },
          { id: 'high', label: 'High', dot: '#DC2626' },
          { id: 'medium', label: 'Medium', dot: '#D97706' },
          { id: 'low', label: 'Low', dot: '#16A34A' }].
          map((opt) => {
            const active = riskFilter === opt.id;
            return (
              <button
                key={String(opt.id)}
                onClick={() => setRiskFilter(opt.id)}
                disabled={loading}
                style={{
                  padding: '4px 10px', borderRadius: 4, border: 'none',
                  cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit',
                  fontSize: 13, fontWeight: 600,
                  background: active ? '#FFFFFF' : 'transparent',
                  color:      active ? (opt.dot || '#0F172A') : '#64748B',
                  boxShadow:  active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  opacity: loading ? 0.6 : 1,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  whiteSpace: 'nowrap', transition: 'all 0.15s',
                }}>
                {opt.dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />}
                {opt.label}
              </button>);
          })}
        </div>
      </div>

      {/* Vertical list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'relative' }}>
        {loading && [0, 1, 2, 3, 4].map((i) =>
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 0', borderBottom: i < 4 ? '1px solid #F1F5F9' : 'none'
        }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: tones[i % 3].bar, opacity: 0.6, flexShrink: 0 }}></div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ height: 9, width: '32%', borderRadius: 3, background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)', backgroundSize: '200% 100%', animation: 'kg-shimmer 1.4s linear infinite' }}></div>
              <div style={{ height: 7, width: '88%', borderRadius: 3, background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)', backgroundSize: '200% 100%', animation: 'kg-shimmer 1.4s linear infinite' }}></div>
            </div>
          </div>
        )}

        {!loading && error &&
        <div style={{ fontSize: 14, color: '#94A3B8', padding: '24px 0', textAlign: 'center', border: '1px dashed #E2E8F0', borderRadius: 8 }}>
            Insights unavailable — try a different range or hit Regenerate.
          </div>
        }

        {!loading && !error && insights && insights.map((txt, i) => {
          const { title, body } = renderInsight(txt);
          const t = tones[i] || tones[2];
          const isLast = i === insights.length - 1;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '12px 0', borderBottom: isLast ? 'none' : '1px solid #F1F5F9'
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 52, padding: '3px 0', borderRadius: 3, background: t.tag, color: t.tagText,
                fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                flexShrink: 0, marginTop: 2
              }}>{t.label}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {title &&
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.005em', marginBottom: 3 }}>
                    {title}
                  </div>
                }
                <div style={{ fontSize: 12.5, lineHeight: 1.5, color: '#334155', textWrap: 'pretty' }}>
                  {body}
                </div>
              </div>
            </div>);

        })}
        <style>{`@keyframes kg-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      </div>
    </div>);

}

function RiskDistributionCard({ dist, total }) {
  const items = [
  { label: 'High risk', count: dist.high, color: '#DC2626', level: 'high' },
  { label: 'Medium risk', count: dist.med, color: '#D97706', level: 'medium' },
  { label: 'Low risk', count: dist.low, color: '#16A34A', level: 'low' },
  { label: 'Insufficient data', count: dist.unrated, color: '#94A3B8', level: 'unrated' }];

  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>Distribution snapshot</div>

      {/* Stacked bar */}
      <div style={{ display: 'flex', height: 12, borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
        {items.map((i) =>
        <div key={i.label} style={{ flex: i.count, background: i.color }}></div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((i) =>
        <div key={i.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <RiskDot level={i.level} size={8} />
            <span style={{ fontSize: 15, color: '#334155', flex: 1 }}>{i.label}</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', fontFamily: "'Roboto Mono', monospace" }}>
              {i.count.toLocaleString()}
            </span>
            <span style={{ fontSize: 13, color: '#94A3B8', width: 44, textAlign: 'right' }}>
              {(i.count / total * 100).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>);

}

function DepositActivityCard({ data, brand, total, growth, rangeLabel, deltaLabel, rangeKey, dist, mau }) {
  const [filter, setFilter] = React.useState('all');

  // High-risk players deposit disproportionately (problem gambling profile)
  const DEPOSIT_SHARES = { all: 1.00, high: 0.38, med: 0.28, low: 0.34 };
  const playerCounts   = { all: mau || 1, high: (dist||{}).high || 1, med: (dist||{}).med || 1, low: (dist||{}).low || 1 };

  const filteredTotal  = total * DEPOSIT_SHARES[filter];
  const filteredCount  = playerCounts[filter];
  const avgPerPlayer   = filteredTotal / filteredCount;

  // Avg minutes between deposits — faster = higher risk
  const REDEPOSIT = {
    all:  { '7d': 94,   '14d': 106,  '30d': 128,  '90d': 145,  ytd: 178  },
    high: { '7d': 11,   '14d': 13,   '30d': 14,   '90d': 16,   ytd: 18   },
    med:  { '7d': 148,  '14d': 162,  '30d': 180,  '90d': 210,  ytd: 250  },
    low:  { '7d': 3360, '14d': 3720, '30d': 4320, '90d': 5040, ytd: 6480 },
  };
  const speedMins = (REDEPOSIT[filter] || REDEPOSIT.all)[rangeKey] || 94;
  const fmtSpeed  = m => m < 60 ? `${Math.round(m)}m` : m < 1440 ? `${(m/60).toFixed(1)}h` : `${(m/1440).toFixed(1)}d`;
  const speedSub  = m => m < 60 ? 'minutes avg' : m < 1440 ? 'hours avg' : 'days avg';

  const TIER_COLORS = { high: '#DC2626', med: '#D97706', low: '#16A34A' };

  // Generate date labels counting back from today
  const numPts = data.length;
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dateLabels = data.map((_, i) => {
    const d = new Date(2026, 4, 6);
    d.setDate(d.getDate() - (numPts - 1 - i));
    return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  });

  // Build per-tier series with stable shape variation
  const buildSeries = (tier) => data.map((v, i) => {
    const shape = tier === 'high' ? 1 + Math.sin(i * 0.7) * 0.15
                : tier === 'med'  ? 1 + Math.sin(i * 0.4) * 0.08
                :                   1 - Math.sin(i * 0.3) * 0.05;
    return Math.max(3, Math.round(v * DEPOSIT_SHARES[tier] * shape));
  });

  const tierSeries = { high: buildSeries('high'), med: buildSeries('med'), low: buildSeries('low') };

  // SVG dimensions — match RiskTrendCard
  const W = 720, H = 180;
  const PAD_L = 44, PAD_B = 28, PAD_T = 12, PAD_R = 12;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const buildPath = (vals, mn, rng) => {
    const pts = vals.map((v, i) => [
      PAD_L + (i / (vals.length - 1)) * innerW,
      PAD_T + innerH - ((v - mn) / rng) * innerH,
    ]);
    const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    const area = line + ` L${pts[pts.length-1][0].toFixed(1)},${PAD_T+innerH} L${PAD_L},${PAD_T+innerH} Z`;
    return { pts, line, area };
  };

  const fmtY = v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : `${v}`;
  // Pick label positions at a fixed step so every gap is equal
  const xLabelStep = Math.max(1, Math.ceil((numPts - 1) / 6));
  const labelIndices = new Set(Array.from({ length: numPts }, (_, i) => i).filter(i => i % xLabelStep === 0));

  // Build the SVG chart
  let chartEl;
  if (filter === 'all') {
    // Overview — all 3 tiers as overlaid lines
    const allVals = [...tierSeries.high, ...tierSeries.med, ...tierSeries.low];
    const mn = Math.min(...allVals), mx = Math.max(...allVals), rng = mx - mn || 1;
    const paths = { high: buildPath(tierSeries.high, mn, rng), med: buildPath(tierSeries.med, mn, rng), low: buildPath(tierSeries.low, mn, rng) };
    const gridVals = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(mn + (mx - mn) * (1 - t)));

    chartEl = (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {gridVals.map((v, i) => {
          const y = PAD_T + innerH - ((v - mn) / rng) * innerH;
          return <g key={i}>
            <line x1={PAD_L} y1={y} x2={W-PAD_R} y2={y} stroke="#E2E8F0" strokeWidth="1"/>
            <text x={PAD_L-4} y={y+4} fontSize="11" textAnchor="end" fill="#94A3B8" fontFamily="'Roboto Mono', monospace">{fmtY(v)}</text>
          </g>;
        })}
        {['low','med','high'].map(t => <path key={t+'a'} d={paths[t].area} fill={TIER_COLORS[t]} fillOpacity="0.07"/>)}
        {['low','med','high'].map(t => <path key={t+'l'} d={paths[t].line} fill="none" stroke={TIER_COLORS[t]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>)}
        {['low','med','high'].map(t => {
          const last = paths[t].pts[paths[t].pts.length - 1];
          return <circle key={t+'d'} cx={last[0]} cy={last[1]} r="3" fill={TIER_COLORS[t]} stroke="#fff" strokeWidth="1.5"/>;
        })}
        {dateLabels.map((lbl, i) => {
          if (!labelIndices.has(i)) return null;
          const x = PAD_L + (i / (numPts - 1)) * innerW;
          return <text key={i} x={x} y={H-4} fontSize="11" textAnchor={i === 0 ? 'start' : i === numPts-1 ? 'end' : 'middle'} fill="#94A3B8">{lbl}</text>;
        })}
      </svg>
    );
  } else {
    // Single-tier full-width sparkline
    const vals = tierSeries[filter];
    const mn = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1;
    const { pts, line, area } = buildPath(vals, mn, rng);
    const color = TIER_COLORS[filter];
    const gridVals = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(mn + (mx - mn) * (1 - t)));

    chartEl = (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {gridVals.map((v, i) => {
          const y = PAD_T + innerH - ((v - mn) / rng) * innerH;
          return <g key={i}>
            <line x1={PAD_L} y1={y} x2={W-PAD_R} y2={y} stroke={`${color}20`} strokeWidth="1"/>
            <text x={PAD_L-4} y={y+4} fontSize="11" textAnchor="end" fill="#94A3B8" fontFamily="'Roboto Mono', monospace">{fmtY(v)}</text>
          </g>;
        })}
        <path d={area} fill={color} fillOpacity="0.10"/>
        <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3" fill={color} stroke="#fff" strokeWidth="1.5"/>
        {dateLabels.map((lbl, i) => {
          if (!labelIndices.has(i)) return null;
          const x = PAD_L + (i / (numPts - 1)) * innerW;
          return <text key={i} x={x} y={H-4} fontSize="11" textAnchor={i === 0 ? 'start' : i === numPts-1 ? 'end' : 'middle'} fill="#94A3B8">{lbl}</text>;
        })}
      </svg>
    );
  }

  const miniCard = (label, value, sub, accentColor) => (
    <div style={{ padding: '10px 12px', borderRadius: 6, background: accentColor ? `${accentColor}08` : '#F8FAFC', border: `1px solid ${accentColor ? accentColor + '20' : '#F1F5F9'}` }}>
      <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: accentColor || '#0F172A', fontFamily: "'Roboto Mono', monospace", letterSpacing: '-0.01em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 3 }}>{sub}</div>
    </div>
  );

  return (
    <div style={cardStyle}>
      {/* Header + risk filter tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
        <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, flexShrink: 0 }}>Deposit activity · {rangeLabel}</div>
        <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 6, padding: 2, gap: 2 }}>
          {[['all','Overview',null],['high','High risk','#DC2626'],['med','Medium','#D97706'],['low','Low risk','#16A34A']].map(([v, lbl, dot]) => (
            <button key={v} onClick={() => setFilter(v)} style={{
              flex: 1, padding: '4px 10px', borderRadius: 4, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              background: filter === v ? '#FFFFFF' : 'transparent',
              color:      filter === v ? (dot || '#0F172A') : '#64748B',
              boxShadow:  filter === v ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4, whiteSpace: 'nowrap',
            }}>
              {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: dot, flexShrink: 0 }} />}
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Stat mini-cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
        {miniCard('Total value',      fmtCompact(Math.round(filteredTotal), brand), filter === 'all' ? 'all players' : `${filter} risk tier`)}
        {miniCard('Avg / player',     fmtCompact(Math.round(avgPerPlayer), brand),  `${filteredCount.toLocaleString()} players`)}
        {miniCard('Re-deposit speed', fmtSpeed(speedMins), speedSub(speedMins), filter !== 'all' ? TIER_COLORS[filter] : null)}
      </div>

      {/* Legend (overview only) */}
      {filter === 'all' && (
        <div style={{ display: 'flex', gap: 14, marginBottom: 8 }}>
          {[['high','High risk','#DC2626'],['med','Medium risk','#D97706'],['low','Low risk','#16A34A']].map(([t, lbl, c]) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 18, height: 2, background: c, borderRadius: 1 }}/>
              <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{lbl}</span>
            </div>
          ))}
        </div>
      )}

      {/* Line chart */}
      {chartEl}
    </div>
  );
}

function TopMoversCard({ movers, brand, country, onPlayerClick }) {
  const filtered = movers.filter((m) => (brand === 'all' || m.brand === brand) && (country === 'ALL' || m.country === country)).slice(0, 5);
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Top risk movers</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map((m) =>
        <button key={m.id} onClick={() => onPlayerClick && onPlayerClick(m.id)} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 8px', borderRadius: 6, background: 'transparent',
          border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          
            <div style={{ flex: 1, fontFamily: "'Roboto Mono', monospace", fontSize: 14, color: '#0F172A', fontWeight: 500 }}>
              {m.id}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B', fontFamily: "'Roboto Mono', monospace" }}>
              <span>{m.from}</span>
              <Icon name="arrow-right" size={10} color="#94A3B8" />
              <span style={{ color: '#0F172A', fontWeight: 600 }}>{m.to}</span>
            </div>
            <div style={{
            padding: '2px 7px', borderRadius: 4,
            background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626',
            fontSize: 13, fontWeight: 700, fontFamily: "'Roboto Mono', monospace"
          }}>+{m.delta}</div>
          </button>
        )}
      </div>
    </div>);

}

function AttentionCard({ players, onPlayerClick }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Requires attention</div>
        </div>
        <span style={{ fontSize: 13, padding: '3px 8px', background: 'rgba(217, 119, 6, 0.1)', color: '#D97706', borderRadius: 10, fontWeight: 700 }}>{players.length} open</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {players.slice(0, 5).map((p) =>
        <button key={p.id} onClick={() => onPlayerClick && onPlayerClick(p.id)} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px',
          background: 'transparent', borderRadius: 6, border: 'none',
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          
            <RiskDot level={p.risk} size={8} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 14, color: '#0F172A', fontWeight: 500 }}>{p.id}</div>
              <div style={{ fontSize: 13, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.insight}</div>
            </div>
            <span style={{
            fontSize: 12, padding: '2px 6px', borderRadius: 3,
            background: p.status === 'outreach' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(217, 119, 6, 0.1)',
            color: p.status === 'outreach' ? '#DC2626' : '#D97706',
            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em'
          }}>{p.status}</span>
          </button>
        )}
      </div>
    </div>);

}

function RGAdoptionCard({ items, rangeLabel }) {
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>RG tool adoption</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {items.map((i) =>
        <div key={i.tool} style={{ padding: 12, background: '#F8FAFC', borderRadius: 6, border: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 6 }}>{i.tool}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#0F172A', fontFamily: "'Roboto Mono', monospace", letterSpacing: '-0.01em', marginBottom: 4 }}>
              {i.count.toLocaleString()}
            </div>
            <div style={{ fontSize: 13, color: '#16A34A', fontWeight: 600 }}>↑ {i.delta}%</div>
          </div>
        )}
      </div>
    </div>);

}

function SignalsBreakdownCard({ signals, rangeLabel }) {
  const max = Math.max(...signals.map((s) => s.count));
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>Active risk signals · {rangeLabel}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {signals.map((s) =>
        <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, color: '#334155', flex: '0 0 200px' }}>{s.label}</span>
            <div style={{ flex: 1, height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${s.count / max * 100}%`, height: '100%', background: s.color, borderRadius: 3 }}></div>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', fontFamily: "'Roboto Mono', monospace", width: 36, textAlign: 'right' }}>{s.count}</span>
          </div>
        )}
      </div>
    </div>);

}

Object.assign(window, { HomeDashboard, btnPrimary, btnSecondary, cardStyle });