// Home Dashboard Statistics Cards Component
// Responsible for displaying individual risk tier statistics

const { KGEnums, RISK_COLORS, RiskDot } = window;
const { HOME_DASHBOARD_STYLES, HOME_DASHBOARD_COMPONENT_IDS } = window;
const { getToneRiskLevel } = window;

const { CARD: cardStyle } = HOME_DASHBOARD_STYLES;

/**
 * StatCard Component - displays single metric with risk coloring
 * Single Responsibility: Show one statistic with appropriate styling
 */
function StatCard({ id, label, value, subtext, delta, deltaUp, tone }) {
  const riskLevel = getToneRiskLevel(tone);
  const c = RISK_COLORS[riskLevel];

  return (
    <div
      id={id}
      data-component={HOME_DASHBOARD_COMPONENT_IDS.MAIN_DASHBOARD}
      style={{ ...cardStyle, padding: 16, borderLeft: `3px solid ${c.main}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <RiskDot level={tone} size={6} />
        <span style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 600, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6, fontFamily: "'Roboto Mono', monospace" }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: '#94A3B8' }}>{subtext}</span>
        {delta && (
          <span style={{ fontSize: 13, fontWeight: 600, color: deltaUp ? c.main : '#16A34A' }}>
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * StatsCardRow Component - manages the grid of stat cards
 * Responsibility: Layout and orchestrate stat cards for a metric row
 */
function StatsCardRow({ metrics }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
      {metrics.map((metric) => (
        <StatCard key={metric.id} {...metric} />
      ))}
    </div>
  );
}

Object.assign(window, {
  StatCard,
  StatsCardRow,
});


