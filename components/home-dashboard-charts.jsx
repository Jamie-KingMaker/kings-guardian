// Home Dashboard Chart Components
// Large, complex chart visualizations using Chart.js

const { KGEnums, KGConstants } = window;
const { HOME_DASHBOARD_STYLES, HOME_DASHBOARD_COMPONENT_IDS, HOME_DASHBOARD_CHART_CONFIG } = window;
const { HOME_DASHBOARD_DEPOSIT_CONFIG, HOME_DASHBOARD_RG_ADOPTION_SCALES } = window;
const { formatRedepositsSpeed, generateDateLabels, calculateDataScale, hashString, fmtCompact } = window;

const { CARD: cardStyle, TAB_CONTAINER, TAB_BUTTON_ACTIVE, TAB_BUTTON_INACTIVE } = HOME_DASHBOARD_STYLES;
const { DEPOSIT_SHARES, REDEPOSIT_TIME } = HOME_DASHBOARD_DEPOSIT_CONFIG;
const FILTER_ALL = KGEnums.FILTER.ALL;
const { getRiskTierLabel } = KGConstants;

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
 * Responsibility: Render stacked area chart using Chart.js
 */
function RiskTrendCard({ data, rangeLabel, growth, component_id = HOME_DASHBOARD_COMPONENT_IDS.RISK_TREND_CARD }) {
  const [view, setView] = React.useState(KGEnums.DASHBOARD_VIEW.OVERVIEW);
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    const colorByTier = { high: '#DC2626', med: '#D97706', low: '#16A34A' };
    const labels = data.map(d => d.d);

    if (view === KGEnums.DASHBOARD_VIEW.OVERVIEW) {
      const chartConfig = {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'Low', data: data.map(d => d.low), borderColor: '#16A34A', backgroundColor: 'rgba(22, 163, 74, 0.08)', borderWidth: 2, pointRadius: 2, pointBackgroundColor: '#16A34A', fill: true, tension: 0.3 },
            { label: 'Medium', data: data.map(d => d.med), borderColor: '#D97706', backgroundColor: 'rgba(217, 119, 6, 0.08)', borderWidth: 2, pointRadius: 2, pointBackgroundColor: '#D97706', fill: true, tension: 0.3 },
            { label: 'High', data: data.map(d => d.high), borderColor: '#DC2626', backgroundColor: 'rgba(220, 38, 38, 0.08)', borderWidth: 2, pointRadius: 2, pointBackgroundColor: '#DC2626', fill: true, tension: 0.3 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { stacked: false, beginAtZero: true, grid: { color: '#F1F5F9', drawBorder: false }, ticks: { color: '#94A3B8', font: { family: "'Roboto Mono', monospace", size: 11 } } },
            x: { grid: { display: false, drawBorder: false }, ticks: { color: '#94A3B8', font: { family: "'Roboto Mono', monospace", size: 11 } } },
          },
        },
      };
      if (chartRef.current) chartRef.current.destroy();
      chartRef.current = new window.Chart(canvasRef.current, chartConfig);
    } else {
      const tierBucket = view === KGEnums.DASHBOARD_VIEW.HIGH ? 'high' : view === KGEnums.DASHBOARD_VIEW.MEDIUM ? 'med' : 'low';
      const tierLabel = getRiskTierLabel(tierBucket);
      const tierColor = colorByTier[tierBucket];
      const chartConfig = {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: tierLabel, data: data.map(d => d[tierBucket]), borderColor: tierColor, backgroundColor: tierColor + '14', borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: tierColor, fill: true, tension: 0.3 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: tierColor + '20', drawBorder: false }, ticks: { color: '#94A3B8', font: { family: "'Roboto Mono', monospace", size: 11 } } },
            x: { grid: { display: false, drawBorder: false }, ticks: { color: '#94A3B8', font: { family: "'Roboto Mono', monospace", size: 11 } } },
          },
        },
      };
      if (chartRef.current) chartRef.current.destroy();
      chartRef.current = new window.Chart(canvasRef.current, chartConfig);
    }

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data, view]);

  return (
    <div id={component_id} style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>Risk distribution · {rangeLabel}</div>
        </div>
        <DashboardTabs tabs={DASHBOARD_TAB_SETS.RISK} activeTab={view} onChange={setView} />
      </div>
      {view === KGEnums.DASHBOARD_VIEW.OVERVIEW && (
        <div style={{ display: 'flex', gap: 14, fontSize: 13, marginBottom: 10, flexShrink: 0 }}>
          {[['High', '#DC2626'], ['Medium', '#D97706'], ['Low', '#16A34A']].map(([l, c]) =>
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#475569', fontWeight: 500 }}>
              <span style={{ width: 12, height: 2, background: c, borderRadius: 1 }} />
              {l}
            </div>
          )}
        </div>
      )}
      <div style={{ flex: 1, position: 'relative', minHeight: 280 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

/**
 * DepositActivityCard Component - Displays deposit activity trends
 * Responsibility: Render multi-tier deposit visualization using Chart.js
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
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);

  const playerCounts = { all: mau || 1, high: (dist||{}).high || 1, med: (dist||{}).med || 1, low: (dist||{}).low || 1 };
  const filteredTotal = total * DEPOSIT_SHARES[filter];
  const filteredCount = playerCounts[filter];
  const avgPerPlayer = filteredTotal / filteredCount;

  const speedMins = (REDEPOSIT_TIME[filter] || REDEPOSIT_TIME.all)[rangeKey] || 94;
  const TIER_COLORS = { high: '#DC2626', med: '#D97706', low: '#16A34A' };

  const numPts = data.length;
  const dateLabels = generateDateLabels(data, rangeKey);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    if (filter === FILTER_ALL) {
      const buildSeries = (tier) => data.map((v, i) => {
        const shape = tier === 'high' ? 1 + Math.sin(i * 0.7) * 0.15
                    : tier === 'med'  ? 1 + Math.sin(i * 0.4) * 0.08
                    :                   1 - Math.sin(i * 0.3) * 0.05;
        return Math.max(3, Math.round(v * DEPOSIT_SHARES[tier] * shape));
      });

      const chartConfig = {
        type: 'line',
        data: {
          labels: dateLabels,
          datasets: [
            { label: getRiskTierLabel('high'), data: buildSeries('high'), borderColor: '#DC2626', backgroundColor: 'rgba(220, 38, 38, 0.08)', borderWidth: 2, tension: 0.3, fill: true, pointRadius: 2, pointBackgroundColor: '#DC2626' },
            { label: getRiskTierLabel('med'), data: buildSeries('med'), borderColor: '#D97706', backgroundColor: 'rgba(217, 119, 6, 0.08)', borderWidth: 2, tension: 0.3, fill: true, pointRadius: 2, pointBackgroundColor: '#D97706' },
            { label: getRiskTierLabel('low'), data: buildSeries('low'), borderColor: '#16A34A', backgroundColor: 'rgba(22, 163, 74, 0.08)', borderWidth: 2, tension: 0.3, fill: true, pointRadius: 2, pointBackgroundColor: '#16A34A' },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: '#E2E8F0', drawBorder: false }, ticks: { color: '#94A3B8', font: { family: "'Roboto Mono', monospace", size: 11 } } },
            x: { grid: { display: false, drawBorder: false }, ticks: { color: '#94A3B8', font: { family: "'Roboto Mono', monospace", size: 11 } } },
          },
        },
      };
      if (chartRef.current) chartRef.current.destroy();
      chartRef.current = new window.Chart(canvasRef.current, chartConfig);
    } else {
      const buildSeries = (tier) => data.map((v, i) => {
        const shape = tier === 'high' ? 1 + Math.sin(i * 0.7) * 0.15
                    : tier === 'med'  ? 1 + Math.sin(i * 0.4) * 0.08
                    :                   1 - Math.sin(i * 0.3) * 0.05;
        return Math.max(3, Math.round(v * DEPOSIT_SHARES[tier] * shape));
      });
      const tierLabel = getRiskTierLabel(filter);
      const tierColor = TIER_COLORS[filter];
      const chartConfig = {
        type: 'line',
        data: {
          labels: dateLabels,
          datasets: [
            { label: tierLabel, data: buildSeries(filter), borderColor: tierColor, backgroundColor: tierColor + '14', borderWidth: 2.5, tension: 0.3, fill: true, pointRadius: 3, pointBackgroundColor: tierColor },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: tierColor + '20', drawBorder: false }, ticks: { color: '#94A3B8', font: { family: "'Roboto Mono', monospace", size: 11 } } },
            x: { grid: { display: false, drawBorder: false }, ticks: { color: '#94A3B8', font: { family: "'Roboto Mono', monospace", size: 11 } } },
          },
        },
      };
      if (chartRef.current) chartRef.current.destroy();
      chartRef.current = new window.Chart(canvasRef.current, chartConfig);
    }

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data, filter, dateLabels]);

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
          {[['high', getRiskTierLabel('high'), '#DC2626'], ['med', getRiskTierLabel('med'), '#D97706'], ['low', getRiskTierLabel('low'), '#16A34A']].map(([t, lbl, c]) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 18, height: 2, background: c, borderRadius: 1 }}/>
              <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{lbl}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ position: 'relative', height: 240 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

/**
 * RGAdoptionCard Component - Shows RG tool adoption trends
 * Responsibility: Display multi-line adoption trend chart using Chart.js
 */
function RGAdoptionCard({
  items,
  rangeLabel,
  component_id = HOME_DASHBOARD_COMPONENT_IDS.RG_ADOPTION_CARD
}) {
  const [view, setView] = React.useState(FILTER_ALL);
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    const toolScales = HOME_DASHBOARD_RG_ADOPTION_SCALES[view] || HOME_DASHBOARD_RG_ADOPTION_SCALES[FILTER_ALL];
    const scaledItems = items.map((i) => {
      const s = toolScales[i.tool] ?? 1;
      return {
        ...i,
        count: Math.round(i.count * s),
        trend: (i.trend || []).map((p) => ({ ...p, v: Math.round(p.v * s) })),
      };
    });

    const numPts = scaledItems[0]?.trend?.length || 1;
    const labels = scaledItems[0]?.trend?.map((p) => p.d) || [];

    const datasets = scaledItems.map((item) => ({
      label: item.tool,
      data: (item.trend || []).map((p) => p.v),
      borderColor: item.color,
      backgroundColor: item.color + '0d',
      borderWidth: 2,
      tension: 0.3,
      fill: true,
      pointRadius: 2,
      pointBackgroundColor: item.color,
    }));

    const chartConfig = {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#F1F5F9', drawBorder: false }, ticks: { color: '#94A3B8', font: { family: "'Roboto Mono', monospace", size: 11 } } },
          x: { grid: { display: false, drawBorder: false }, ticks: { color: '#94A3B8', font: { family: "'Roboto Mono', monospace", size: 11 } } },
        },
      },
    };

    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new window.Chart(canvasRef.current, chartConfig);

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [items, view]);

  const toolScales = HOME_DASHBOARD_RG_ADOPTION_SCALES[view] || HOME_DASHBOARD_RG_ADOPTION_SCALES[FILTER_ALL];
  const scaledItems = items.map((i) => {
    const s = toolScales[i.tool] ?? 1;
    return { ...i, count: Math.round(i.count * s) };
  });

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

      <div style={{ position: 'relative', height: 240 }}>
        <canvas ref={canvasRef} />
      </div>
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


