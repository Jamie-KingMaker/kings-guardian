// Home Dashboard Chart Components
// Large, complex chart visualizations

const { KGEnums, KGConstants, RISK_COLORS, RiskDot } = window;
const { HOME_DASHBOARD_STYLES, HOME_DASHBOARD_COMPONENT_IDS, HOME_DASHBOARD_CHART_CONFIG } = window;
const { HOME_DASHBOARD_COLORS, HOME_DASHBOARD_DEPOSIT_CONFIG, HOME_DASHBOARD_RG_ADOPTION_SCALES } = window;
const { formatMAU, calcPercentage, formatCompactValue, formatRedepositsSpeed, generateDateLabels, calculateDataScale, buildSVGPathData, calculateLabelIndices, parseAIInsight, generateGridValues, hashString, fmtCompact } = window;

const { CARD: cardStyle, TAB_CONTAINER, TAB_BUTTON_ACTIVE, TAB_BUTTON_INACTIVE } = HOME_DASHBOARD_STYLES;
const { RISK_TREND, DEPOSIT_ACTIVITY, SPARKLINE_FULL, SPARKLINE_MINI, RG_ADOPTION } = HOME_DASHBOARD_CHART_CONFIG;
const { DEPOSIT_SHARES, REDEPOSIT_TIME } = HOME_DASHBOARD_DEPOSIT_CONFIG;
const FILTER_ALL = KGEnums.FILTER.ALL;

const DASHBOARD_TAB_SETS = Object.freeze({
  RISK: Object.freeze([
    [KGEnums.DASHBOARD_VIEW.OVERVIEW, 'Overview', null],
    [KGEnums.DASHBOARD_VIEW.HIGH, 'High', '#DC2626'],
    [KGEnums.DASHBOARD_VIEW.MEDIUM, 'Medium', '#D97706'],
    [KGEnums.DASHBOARD_VIEW.LOW, 'Low', '#16A34A'],
  ]),
  COHORT: Object.freeze([
    [FILTER_ALL, 'Overview', null],
    [KGEnums.DASHBOARD_VIEW.HIGH, 'High', '#DC2626'],
    [KGEnums.DASHBOARD_VIEW.MEDIUM, 'Medium', '#D97706'],
    [KGEnums.DASHBOARD_VIEW.LOW, 'Low', '#16A34A'],
  ]),
});

function DashboardTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={TAB_CONTAINER}>
      {tabs.map(([id, label, dot]) => (
        <button key={id} onClick={() => onChange(id)} style={activeTab === id ? TAB_BUTTON_ACTIVE(dot || '#0F172A') : TAB_BUTTON_INACTIVE}>
          {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />}
          {label}
        </button>
      ))}
    </div>
  );
}

/**
 * RiskTrendCard Component - Displays risk distribution trends over time
 * Responsibility: Render stacked area chart with per-tier sparklines
 */
function RiskTrendCard({ data, rangeLabel, growth, component_id = HOME_DASHBOARD_COMPONENT_IDS.RISK_TREND_CARD }) {
  const [view, setView] = React.useState(KGEnums.DASHBOARD_VIEW.OVERVIEW);

  const W = RISK_TREND.WIDTH;
  const H = RISK_TREND.HEIGHT;
  const PAD_L = RISK_TREND.PAD_L;
  const PAD_B = RISK_TREND.PAD_B;
  const PAD_T = RISK_TREND.PAD_T;
  const PAD_R = RISK_TREND.PAD_R;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const max = Math.max(...data.map((d) => d.high + d.med + d.low));
  const niceMax = Math.ceil(max / 1000) * 1000;
  const xStep = innerW / (data.length - 1 || 1);

  const series = ['low', 'med', 'high'];
  const colors = { low: '#16A34A', med: '#D97706', high: '#DC2626' };

  // Stacked area paths
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

  // Per-tier sparkline component
  const TierSparkline = ({ bucket, label, color, fullWidth }) => {
    const vals = data.map(d => d[bucket]);
    const mn = Math.min(...vals);
    const mx = Math.max(...vals);
    const rng = mx - mn || 1;
    const SW = fullWidth ? 720 : 200;
    const SH = fullWidth ? 180 : 56;
    const PL = 40;
    const PB = fullWidth ? 26 : 16;
    const PT = fullWidth ? 10 : 4;
    const PR = 8;
    const iW = SW - PL - PR;
    const iH = SH - PT - PB;
    const xs = iW / (vals.length - 1 || 1);
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
    <div id={component_id} style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>Risk distribution trend · {rangeLabel}</div>
        </div>
        <DashboardTabs tabs={DASHBOARD_TAB_SETS.RISK} activeTab={view} onChange={setView} />
      </div>

      {view === KGEnums.DASHBOARD_VIEW.OVERVIEW && <>
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
          </svg>
        </div>
      </>}

      {view === KGEnums.DASHBOARD_VIEW.HIGH && <TierSparkline bucket="high" label="High risk"   color="#DC2626" fullWidth />}
      {view === KGEnums.DASHBOARD_VIEW.MEDIUM && <TierSparkline bucket="med"  label="Medium risk" color="#D97706" fullWidth />}
      {view === KGEnums.DASHBOARD_VIEW.LOW && <TierSparkline bucket="low"  label="Low risk"    color="#16A34A" fullWidth />}
    </div>
  );
}

/**
 * DepositActivityCard Component - Displays deposit activity trends
 * Responsibility: Render multi-tier deposit visualization
 */
function DepositActivityCard({
  data,
  brand,
  total,
  growth,
  rangeLabel,
  deltaLabel,
  rangeKey,
  dist,
  mau,
  component_id = HOME_DASHBOARD_COMPONENT_IDS.DEPOSIT_ACTIVITY_CARD
}) {
  const [filter, setFilter] = React.useState(KGEnums.FILTER.ALL);

  const playerCounts = { all: mau || 1, high: (dist||{}).high || 1, med: (dist||{}).med || 1, low: (dist||{}).low || 1 };
  const filteredTotal = total * DEPOSIT_SHARES[filter];
  const filteredCount = playerCounts[filter];
  const avgPerPlayer = filteredTotal / filteredCount;

  const speedMins = (REDEPOSIT_TIME[filter] || REDEPOSIT_TIME.all)[rangeKey] || 94;
  const TIER_COLORS = { high: '#DC2626', med: '#D97706', low: '#16A34A' };

  // Generate date labels
  const numPts = data.length;
  const dateLabels = generateDateLabels(data, rangeKey);

  // Build per-tier series
  const buildSeries = (tier) => data.map((v, i) => {
    const shape = tier === 'high' ? 1 + Math.sin(i * 0.7) * 0.15
                : tier === 'med'  ? 1 + Math.sin(i * 0.4) * 0.08
                :                   1 - Math.sin(i * 0.3) * 0.05;
    return Math.max(3, Math.round(v * DEPOSIT_SHARES[tier] * shape));
  });

  const tierSeries = { high: buildSeries('high'), med: buildSeries('med'), low: buildSeries('low') };

  const W = DEPOSIT_ACTIVITY.WIDTH;
  const H = DEPOSIT_ACTIVITY.HEIGHT;
  const PAD_L = DEPOSIT_ACTIVITY.PAD_L;
  const PAD_B = DEPOSIT_ACTIVITY.PAD_B;
  const PAD_T = DEPOSIT_ACTIVITY.PAD_T;
  const PAD_R = DEPOSIT_ACTIVITY.PAD_R;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const buildPath = (vals, mn, rng) => {
    const denom = vals.length - 1 || 1;
    const pts = vals.map((v, i) => [
      PAD_L + (i / denom) * innerW,
      PAD_T + innerH - ((v - mn) / rng) * innerH,
    ]);
    const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    const area = line + ` L${pts[pts.length-1][0].toFixed(1)},${PAD_T+innerH} L${PAD_L},${PAD_T+innerH} Z`;
    return { pts, line, area };
  };

  const fmtY = v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : `${v}`;
  const labelIndices = calculateLabelIndices(numPts);

  // Build the SVG chart
  let chartEl;
  if (filter === FILTER_ALL) {
    const allVals = [...tierSeries.high, ...tierSeries.med, ...tierSeries.low];
    const { mn, mx, rng } = calculateDataScale(allVals);
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
          const x = PAD_L + (i / (numPts - 1 || 1)) * innerW;
          return <text key={i} x={x} y={H-4} fontSize="11" textAnchor={i === 0 ? 'start' : i === numPts-1 ? 'end' : 'middle'} fill="#94A3B8">{lbl}</text>;
        })}
      </svg>
    );
  } else {
    const vals = tierSeries[filter];
    const { mn, mx, rng } = calculateDataScale(vals);
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
          const x = PAD_L + (i / (numPts - 1 || 1)) * innerW;
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
    <div id={component_id} style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, gap: 12 }}>
        <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, flexShrink: 0 }}>Deposit activity · {rangeLabel}</div>
        <DashboardTabs tabs={DASHBOARD_TAB_SETS.COHORT} activeTab={filter} onChange={setFilter} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
        {miniCard('Total value', fmtCompact(Math.round(filteredTotal), brand), filter === FILTER_ALL ? 'all players' : `${filter} risk tier`)}
        {miniCard('Avg / player', fmtCompact(Math.round(avgPerPlayer), brand), `${filteredCount.toLocaleString()} players`)}
        {miniCard('Re-deposit speed', formatRedepositsSpeed(speedMins), formatRedepositsSpeed(speedMins) < 60 ? 'minutes avg' : formatRedepositsSpeed(speedMins) < 1440 ? 'hours avg' : 'days avg', filter !== FILTER_ALL ? TIER_COLORS[filter] : null)}
      </div>

      {filter === FILTER_ALL && (
        <div style={{ display: 'flex', gap: 14, marginBottom: 8 }}>
          {[['high','High risk','#DC2626'],['med','Medium risk','#D97706'],['low','Low risk','#16A34A']].map(([t, lbl, c]) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 18, height: 2, background: c, borderRadius: 1 }}/>
              <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{lbl}</span>
            </div>
          ))}
        </div>
      )}

      {chartEl}
    </div>
  );
}

/**
 * RGAdoptionCard Component - Shows RG tool adoption trends
 * Responsibility: Display multi-line adoption trend chart
 */
function RGAdoptionCard({
  items,
  rangeLabel,
  component_id = HOME_DASHBOARD_COMPONENT_IDS.RG_ADOPTION_CARD
}) {
  const [view, setView] = React.useState(FILTER_ALL);

  const W = RG_ADOPTION.WIDTH;
  const H = RG_ADOPTION.HEIGHT;
  const PAD_L = RG_ADOPTION.PAD_L;
  const PAD_B = RG_ADOPTION.PAD_B;
  const PAD_T = RG_ADOPTION.PAD_T;
  const PAD_R = RG_ADOPTION.PAD_R;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const toolScales = HOME_DASHBOARD_RG_ADOPTION_SCALES[view] || HOME_DASHBOARD_RG_ADOPTION_SCALES[FILTER_ALL];
  const scaledItems = items.map((item) => {
    const scale = toolScales[item.tool] ?? 1;
    return {
      ...item,
      count: Math.round(item.count * scale),
      trend: (item.trend || []).map((point) => ({ ...point, v: Math.round(point.v * scale) })),
    };
  });

  const numPts = scaledItems[0]?.trend?.length || 1;
  const allVals = scaledItems.flatMap((item) => (item.trend || []).map((point) => point.v));
  const { mn, mx, rng } = calculateDataScale(allVals);
  const xStep = innerW / (numPts - 1 || 1);
  const fmtY = (value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`;

  const buildPath = (vals) => {
    const pts = vals.map((value, index) => [
      PAD_L + index * xStep,
      PAD_T + innerH - ((value - mn) / rng) * innerH,
    ]);
    const line = pts.map((point, i) => (i === 0 ? 'M' : 'L') + point[0].toFixed(1) + ',' + point[1].toFixed(1)).join(' ');
    const area = line + ` L${pts[pts.length - 1][0].toFixed(1)},${PAD_T + innerH} L${PAD_L},${PAD_T + innerH} Z`;
    return { pts, line, area };
  };

  const gridVals = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(mn + (mx - mn) * (1 - t)));
  const labels = scaledItems[0]?.trend?.map((point) => point.d) || [];
  const xLabelStep = Math.max(1, Math.ceil((numPts - 1) / 6));
  const labelSet = new Set(Array.from({ length: numPts }, (_, index) => index).filter((index) => index % xLabelStep === 0));
  labelSet.add(numPts - 1);

  return (
    <div id={component_id} style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
          RG Tool Usage · {rangeLabel}
        </div>
        <DashboardTabs tabs={DASHBOARD_TAB_SETS.COHORT} activeTab={view} onChange={setView} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
        {scaledItems.map((item) => (
          <div key={item.tool} style={{ padding: '10px 12px', background: `${item.color}09`, borderRadius: 6, border: `1px solid ${item.color}28` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.2 }}>{item.tool}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', fontFamily: "'Roboto Mono', monospace", letterSpacing: '-0.02em', lineHeight: 1 }}>
              {item.count.toLocaleString()}
            </div>
            <div style={{ fontSize: 11.5, color: '#16A34A', fontWeight: 700, marginTop: 3 }}>↑ {item.delta}%</div>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {gridVals.map((value, index) => {
          const y = PAD_T + innerH - ((value - mn) / rng) * innerH;
          return (
            <g key={index}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#F1F5F9" strokeWidth="1" />
              <text x={PAD_L - 4} y={y + 4} fontSize="11" textAnchor="end" fill="#94A3B8" fontFamily="'Roboto Mono', monospace">{fmtY(value)}</text>
            </g>
          );
        })}

        {scaledItems.map((item) => {
          const { area } = buildPath((item.trend || []).map((point) => point.v));
          return <path key={item.tool + 'a'} d={area} fill={item.color} fillOpacity="0.07" />;
        })}

        {scaledItems.map((item) => {
          const { pts, line } = buildPath((item.trend || []).map((point) => point.v));
          const last = pts[pts.length - 1];
          return (
            <g key={item.tool}>
              <path d={line} fill="none" stroke={item.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={last[0]} cy={last[1]} r="3" fill={item.color} stroke="#fff" strokeWidth="1.5" />
            </g>
          );
        })}

        {labels.map((label, index) => {
          if (!labelSet.has(index)) return null;
          const x = PAD_L + index * xStep;
          return (
            <text key={index} x={x} y={H - 4} fontSize="11" textAnchor={index === 0 ? 'start' : index === numPts - 1 ? 'end' : 'middle'} fill="#94A3B8">
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * SignalsBreakdownCard Component - Shows active risk signals
 * Responsibility: Display ranked signals with WoW comparison
 */
function SignalsBreakdownCard({
  signals,
  rangeLabel,
  component_id = HOME_DASHBOARD_COMPONENT_IDS.SIGNALS_BREAKDOWN_CARD
}) {
  const [view, setView] = React.useState(FILTER_ALL);
  const SIGNAL_META = KGConstants.SIGNAL_META || {};

  const cohortSignalScale = {
    [FILTER_ALL]: 1,
    [KGEnums.DASHBOARD_VIEW.HIGH]: 0.22,
    [KGEnums.DASHBOARD_VIEW.MEDIUM]: 0.41,
    [KGEnums.DASHBOARD_VIEW.LOW]: 0.37,
  };
  const scaledSignals = signals.map((signal) => ({
    ...signal,
    count: Math.max(1, Math.round(signal.count * (cohortSignalScale[view] || 1))),
  }));

  const wowChange = (label) => {
    const hash = hashString(label + view);
    return { pct: 5 + (hash % 28), up: (hash & 1) === 1 };
  };

  return (
    <div id={component_id} style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
          Active risk signals · {rangeLabel}
        </div>
        <DashboardTabs tabs={DASHBOARD_TAB_SETS.COHORT} activeTab={view} onChange={setView} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        {[['Customers', 96], ['vs prior', 72]].map(([header, width]) => (
          <div key={header} style={{ width, textAlign: 'right', fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{header}</div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {scaledSignals.map((signal, index) => {
          const meta = SIGNAL_META[signal.label] || { desc: '' };
          const { pct, up } = wowChange(signal.label);
          const changeColor = up ? '#DC2626' : '#16A34A';
          return (
            <div key={signal.label} style={{
              display: 'flex', alignItems: 'center',
              padding: '10px 0',
              borderBottom: index < scaledSignals.length - 1 ? '1px solid #F8FAFC' : 'none',
            }}>
              <div style={{ width: 36, flexShrink: 0 }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 18, fontWeight: 700, color: index < 2 ? signal.color : '#CBD5E1' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 1 }}>{signal.label}</div>
                {meta.desc && <div style={{ fontSize: 11.5, color: '#94A3B8', lineHeight: 1.4 }}>{meta.desc}</div>}
              </div>
              <div style={{ width: 96, textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 16, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>
                  {signal.count.toLocaleString()}
                </span>
              </div>
              <div style={{ width: 72, textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: changeColor }}>
                  {up ? '↑' : '↓'} {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { RiskTrendCard, DepositActivityCard, RGAdoptionCard, SignalsBreakdownCard });

