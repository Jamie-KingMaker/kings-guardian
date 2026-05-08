// Home Dashboard Card Components
// Supplementary cards: Risk Distribution, Top Movers, Attention, etc.

const { KGEnums, KGConstants, RISK_COLORS, RiskDot, Icon } = window;
const { HOME_DASHBOARD_STYLES, HOME_DASHBOARD_COMPONENT_IDS } = window;

const { CARD: cardStyle } = HOME_DASHBOARD_STYLES;
const { getRiskTierLabel } = KGConstants;

/**
 * RiskDistributionCard Component - Shows distribution snapshot
 * Responsibility: Display risk tier breakdown at a glance
 */
function RiskDistributionCard({
  dist,
  total,
  component_id = HOME_DASHBOARD_COMPONENT_IDS.RISK_DISTRIBUTION_SNAPSHOT
}) {
  const items = [
    { label: getRiskTierLabel('high'), count: dist.high, color: '#DC2626', level: 'high' },
    { label: getRiskTierLabel('medium'), count: dist.med, color: '#D97706', level: 'medium' },
    { label: getRiskTierLabel('low'), count: dist.low, color: '#16A34A', level: 'low' },
    { label: 'Insufficient data', count: dist.unrated, color: '#94A3B8', level: 'unrated' }
  ];

  return (
    <div id={component_id} style={cardStyle}>
      <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 14 }}>
        Distribution snapshot
      </div>

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
    </div>
  );
}

/**
 * TopMoversCard Component - Shows players with biggest risk changes
 * Responsibility: Display list of top risk movers
 */
function TopMoversCard({
  movers,
  brand,
  country,
  onPlayerClick,
  component_id = HOME_DASHBOARD_COMPONENT_IDS.TOP_MOVERS_CARD
}) {
  const filtered = movers.filter((m) => (brand === 'all' || m.brand === brand) && (country === 'ALL' || m.country === country)).slice(0, 8);
  const riskColor = { high: '#DC2626', medium: '#D97706', med: '#D97706', low: '#16A34A', unrated: '#94A3B8' };

  return (
    <div id={component_id} style={cardStyle}>
      <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 16 }}>
        Top risk movers
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {filtered.map((m, idx) => {
          const rc = riskColor[m.risk] || '#94A3B8';
          const isLast = idx === filtered.length - 1;
          return (
            <button key={m.id} onClick={() => onPlayerClick && onPlayerClick(m.id)}
              style={{
                display: 'flex', flexDirection: 'column',
                padding: '8px 8px', borderRadius: 6, background: 'transparent',
                border: 'none', borderBottom: isLast ? 'none' : '1px solid #F8FAFC',
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: '100%',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, width: '100%' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: rc, flexShrink: 0 }} />
                <span style={{ flex: 1, fontFamily: "'Roboto Mono', monospace", fontSize: 12.5, color: '#0F172A', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.id}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#64748B', fontFamily: "'Roboto Mono', monospace", flexShrink: 0 }}>
                  <span>{m.from}</span>
                  <Icon name="arrow-right" size={9} color="#94A3B8" />
                  <span style={{ color: '#0F172A', fontWeight: 600 }}>{m.to}</span>
                </span>
                <span style={{
                  padding: '2px 5px', borderRadius: 3,
                  background: 'rgba(220,38,38,0.10)', color: '#DC2626',
                  fontSize: 11, fontWeight: 700, fontFamily: "'Roboto Mono', monospace", flexShrink: 0,
                }}>+{m.delta}</span>
              </div>
              {m.signals && m.signals.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4, paddingLeft: 13 }}>
                  {m.signals.map((s, si) => (
                    <span key={si} style={{
                      fontSize: 9.5, fontWeight: 700, padding: '2px 5px', borderRadius: 3,
                      background: '#F1F5F9', color: '#475569',
                      textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap',
                    }}>{s}</span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * AttentionCard Component - Shows items requiring immediate attention
 * Responsibility: Display high-priority player flags
 */
function AttentionCard({
  players,
  onPlayerClick,
  component_id = HOME_DASHBOARD_COMPONENT_IDS.ATTENTION_CARD
}) {
  return (
    <div id={component_id} style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            Requires attention
          </div>
        </div>
        <span style={{ fontSize: 13, padding: '3px 8px', background: 'rgba(217, 119, 6, 0.1)', color: '#D97706', borderRadius: 10, fontWeight: 700 }}>
          {players.length} open
        </span>
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
              <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 14, color: '#0F172A', fontWeight: 500 }}>
                {p.id}
              </div>
              <div style={{ fontSize: 13, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.insight}
              </div>
            </div>
            <span style={{
              fontSize: 12, padding: '2px 6px', borderRadius: 3,
              background: p.status === KGEnums.PLAYER_STATUS.OUTREACH ? 'rgba(220, 38, 38, 0.1)' : 'rgba(217, 119, 6, 0.1)',
              color: p.status === KGEnums.PLAYER_STATUS.OUTREACH ? '#DC2626' : '#D97706',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>{p.status}</span>
          </button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  RiskDistributionCard,
  TopMoversCard,
  AttentionCard,
});


