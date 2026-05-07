// Home Dashboard Advanced Chart Components
// RG Adoption and Signals Breakdown charts

const { KGEnums, KGConstants } = window;
const { HOME_DASHBOARD_STYLES, HOME_DASHBOARD_COMPONENT_IDS, HOME_DASHBOARD_CHART_CONFIG } = window;
const { HOME_DASHBOARD_RG_ADOPTION_TOOLS, HOME_DASHBOARD_RG_ADOPTION_SCALES } = window;
const { calculateLabelIndices, calculateDataScale, generateGridValues, hashString } = window;

const { CARD: cardStyle, TAB_CONTAINER, TAB_BUTTON_ACTIVE, TAB_BUTTON_INACTIVE } = HOME_DASHBOARD_STYLES;
const { RG_ADOPTION } = HOME_DASHBOARD_CHART_CONFIG;
const FILTER_ALL = KGEnums.FILTER.ALL;

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

  // Per-cohort tool multipliers
  const toolScales = HOME_DASHBOARD_RG_ADOPTION_SCALES[view] || HOME_DASHBOARD_RG_ADOPTION_SCALES.all;
  const scaledItems = items.map(i => {
    const s = toolScales[i.tool] ?? 1;
    return {
      ...i,
      count: Math.round(i.count * s),
      trend: (i.trend || []).map(p => ({ ...p, v: Math.round(p.v * s) })),
    };
  });

  const numPts = scaledItems[0]?.trend?.length || 1;
  const allVals = scaledItems.flatMap(i => (i.trend || []).map(p => p.v));
  const { mn, mx, rng } = calculateDataScale(allVals);
  const xStep = innerW / (numPts - 1 || 1);
  const fmtY = v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`;

  const buildPath = (vals) => {
    const pts = vals.map((v, i) => [
      PAD_L + i * xStep,
      PAD_T + innerH - ((v - mn) / rng) * innerH,
    ]);
    const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    const area = line + ` L${pts[pts.length-1][0].toFixed(1)},${PAD_T+innerH} L${PAD_L},${PAD_T+innerH} Z`;
    return { pts, line, area };
  };

  const gridVals = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(mn + (mx - mn) * (1 - t)));
  const labels = scaledItems[0]?.trend?.map(p => p.d) || [];
  const xLabelStep = Math.max(1, Math.ceil((numPts - 1) / 6));
  const labelSet = new Set(Array.from({ length: numPts }, (_, i) => i).filter(i => i % xLabelStep === 0));
  labelSet.add(numPts - 1);

  return (
    <div id={component_id} style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
          RG Tool Usage · {rangeLabel}
        </div>
        <div style={TAB_CONTAINER}>
          {[[FILTER_ALL, 'Overview', null], [KGEnums.DASHBOARD_VIEW.HIGH, 'High', '#DC2626'], [KGEnums.DASHBOARD_VIEW.MEDIUM, 'Medium', '#D97706'], [KGEnums.DASHBOARD_VIEW.LOW, 'Low', '#16A34A']].map(([v, lbl, dot]) => (
            <button key={v} onClick={() => setView(v)} style={view === v ? TAB_BUTTON_ACTIVE(dot || '#0F172A') : TAB_BUTTON_INACTIVE}>
              {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />}
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
        {scaledItems.map(i => (
          <div key={i.tool} style={{ padding: '10px 12px', background: `${i.color}09`, borderRadius: 6, border: `1px solid ${i.color}28` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: i.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.2 }}>{i.tool}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', fontFamily: "'Roboto Mono', monospace", letterSpacing: '-0.02em', lineHeight: 1 }}>
              {i.count.toLocaleString()}
            </div>
            <div style={{ fontSize: 11.5, color: '#16A34A', fontWeight: 700, marginTop: 3 }}>↑ {i.delta}%</div>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {gridVals.map((v, i) => {
          const y = PAD_T + innerH - ((v - mn) / rng) * innerH;
          return (
            <g key={i}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#F1F5F9" strokeWidth="1" />
              <text x={PAD_L - 4} y={y + 4} fontSize="11" textAnchor="end" fill="#94A3B8" fontFamily="'Roboto Mono', monospace">{fmtY(v)}</text>
            </g>
          );
        })}

        {scaledItems.map(item => {
          const { area } = buildPath((item.trend || []).map(p => p.v));
          return <path key={item.tool + 'a'} d={area} fill={item.color} fillOpacity="0.07" />;
        })}

        {scaledItems.map(item => {
          const { pts, line } = buildPath((item.trend || []).map(p => p.v));
          const last = pts[pts.length - 1];
          return (
            <g key={item.tool}>
              <path d={line} fill="none" stroke={item.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={last[0]} cy={last[1]} r="3" fill={item.color} stroke="#fff" strokeWidth="1.5" />
            </g>
          );
        })}

        {labels.map((lbl, i) => {
          if (!labelSet.has(i)) return null;
          const x = PAD_L + i * xStep;
          return (
            <text key={i} x={x} y={H - 4} fontSize="11"
              textAnchor={i === 0 ? 'start' : i === numPts - 1 ? 'end' : 'middle'} fill="#94A3B8">{lbl}
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
  const SIGNAL_META = window.KGConstants.SIGNAL_META || {};

  // Per-cohort signal scale
  const cohortSignalScale = {
    all:  1,
    high: 0.22,
    med:  0.41,
    low:  0.37,
  };
  const scaledSignals = signals.map((s, i) => ({
    ...s,
    count: Math.max(1, Math.round(s.count * (cohortSignalScale[view] || 1))),
  }));

  const wowChange = (label) => {
    const h = hashString(label + view);
    return { pct: 5 + (h % 28), up: (h & 1) === 1 };
  };

  return (
    <div id={component_id} style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
          Active risk signals · {rangeLabel}
        </div>
        <div style={TAB_CONTAINER}>
          {[[FILTER_ALL, 'Overview', null], [KGEnums.DASHBOARD_VIEW.HIGH, 'High', '#DC2626'], [KGEnums.DASHBOARD_VIEW.MEDIUM, 'Medium', '#D97706'], [KGEnums.DASHBOARD_VIEW.LOW, 'Low', '#16A34A']].map(([v, lbl, dot]) => (
            <button key={v} onClick={() => setView(v)} style={view === v ? TAB_BUTTON_ACTIVE(dot || '#0F172A') : TAB_BUTTON_INACTIVE}>
              {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />}
              {lbl}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        {[['Customers', 96], ['vs prior', 72]].map(([h, w]) => (
          <div key={h} style={{ width: w, textAlign: 'right', fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {scaledSignals.map((s, i) => {
          const meta = SIGNAL_META[s.label] || { desc: '' };
          const { pct, up } = wowChange(s.label);
          const changeColor = up ? '#DC2626' : '#16A34A';
          return (
            <div key={s.label} style={{
              display: 'flex', alignItems: 'center',
              padding: '10px 0',
              borderBottom: i < scaledSignals.length - 1 ? '1px solid #F8FAFC' : 'none',
            }}>
              <div style={{ width: 36, flexShrink: 0 }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 18, fontWeight: 700, color: i < 2 ? s.color : '#CBD5E1' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 1 }}>{s.label}</div>
                {meta.desc && <div style={{ fontSize: 11.5, color: '#94A3B8', lineHeight: 1.4 }}>{meta.desc}</div>}
              </div>
              <div style={{ width: 96, textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 16, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>
                  {s.count.toLocaleString()}
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

Object.assign(window, { RGAdoptionCard, SignalsBreakdownCard });

