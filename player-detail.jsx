// Player Risk Dashboard - detailed player view

const { useState: useStatePD } = React;

function PlayerDetail({ playerId, onBack }) {
  const player = window.KGData.PLAYERS.find(p => p.id === playerId) || window.KGData.PLAYERS[0];
  const [tab, setTab] = useStatePD('overview');

  const insights = [
    { sev: 'high', title: 'Re-deposited within 8 minutes of losing session', detail: '4 deposits totalling ₦480,000 placed between 23:14 and 00:42, immediately following a ₦212,000 loss.', time: '2h ago' },
    { sev: 'high', title: 'Spend up 142% vs prior 7 days', detail: 'Weekly spend has more than doubled, escalating from ₦760k to ₦1.84M.', time: '6h ago' },
    { sev: 'medium', title: 'Multiple deposits in single session', detail: '3 deposits made within an 18-minute window on Apr 28.', time: '1d ago' },
    { sev: 'medium', title: 'Late-night activity shift', detail: '68% of bets in the last 7 days placed between 22:00 and 03:00, up from 22% prior.', time: '2d ago' },
    { sev: 'low', title: '2 failed deposit attempts detected', detail: 'Both resolved on retry; flagged as a soft signal.', time: '3d ago' },
  ];

  const sevColor = { high: '#DC2626', medium: '#D97706', low: '#16A34A' };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={onBack} style={{
        background: 'transparent', border: 'none', padding: 0, color: '#64748B',
        fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'inherit', alignSelf: 'flex-start',
      }}>← Back to player list</button>

      {/* Player header */}
      <div style={{ ...cardStyle, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 8,
            background: player.brand === 'betking' ? '#001041' : '#040B67',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: player.brand === 'betking' ? '#FFC400' : '#F1C72F',
            fontWeight: 700,
          }}>{player.brand === 'betking' ? 'BK' : 'SS'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <h2 style={{ margin: 0, fontSize: 25, fontWeight: 600, color: '#0F172A', fontFamily: "'Roboto Mono', monospace", letterSpacing: '-0.01em' }}>{player.id}</h2>
              <RiskPill level={player.risk} />
              <TrendArrow trend={player.trend} />
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: 14, color: '#64748B' }}>
              <span>{BRAND_ACCENTS[player.brand].name}</span>
              <span>{COUNTRY_NAMES[player.country]}</span>
              <span>Tier {player.tier}</span>
              <span>Active {player.lastActive}</span>
              <span>Customer since Jan 2024</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={btnSecondary}><Icon name="note" size={14}/> Add note</button>
            <button style={{ ...btnSecondary, color: '#D97706', borderColor: 'rgba(217,119,6,0.3)' }}>
              <Icon name="flag" size={14}/> Flag for monitor
            </button>
            <button style={{ ...btnPrimary, background: '#DC2626' }}>
              <Icon name="flag" size={14}/> Mark for outreach
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E2E8F0' }}>
        {[['overview', 'Overview'], ['insights', 'Risk insights · 5'], ['behaviour', 'Behaviour'], ['log', 'Interaction log']].map(([id, l]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: '10px 16px', background: 'transparent', border: 'none',
            borderBottom: tab === id ? '2px solid #0F172A' : '2px solid transparent',
            color: tab === id ? '#0F172A' : '#64748B',
            fontSize: 15, fontWeight: tab === id ? 600 : 500, cursor: 'pointer', fontFamily: 'inherit',
            marginBottom: -1,
          }}>{l}</button>
        ))}
      </div>

      {/* Body — Overview shows everything in one view */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        {/* Left: Behaviour metrics + chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            <MicroStat label="Spend / 7d" value={fmtCompact(player.spend, player.brand)} delta="+142%" tone="high" />
            <MicroStat label="Deposits / 7d" value={player.deposits} delta="+85%" tone="high" />
            <MicroStat label="Bets / 7d" value={player.bets} delta="+96%" tone="high" />
            <MicroStat label="Avg deposit" value={fmtCompact(Math.round(player.spend / player.deposits), player.brand)} delta="+34%" tone="medium" />
          </div>

          <div style={{ ...cardStyle }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Spend & deposits over time</div>
                <div style={{ fontSize: 16, color: '#0F172A', fontWeight: 600, marginTop: 2 }}>30-day behavioural trace</div>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 13 }}>
                <span style={{ color: '#475569', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 2, background: '#0F172A' }}></span>Spend
                </span>
                <span style={{ color: '#475569', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 8, background: '#DC2626', borderRadius: 1 }}></span>Deposits
                </span>
              </div>
            </div>
            <BehaviourChart />
          </div>

          <div style={{ ...cardStyle }}>
            <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 12 }}>Product distribution · 30d</div>
            <ProductDistribution />
          </div>
        </div>

        {/* Right: Risk insights panel */}
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Why this player is flagged</div>
              <div style={{ fontSize: 16, color: '#0F172A', fontWeight: 600, marginTop: 2 }}>Risk insights · explainability</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {insights.map((i, idx) => (
              <div key={idx} style={{
                padding: '14px 16px', borderBottom: idx < insights.length - 1 ? '1px solid #F1F5F9' : 'none',
                borderLeft: `3px solid ${sevColor[i.sev]}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 11, padding: '2px 6px', borderRadius: 3,
                      background: `${sevColor[i.sev]}1A`, color: sevColor[i.sev],
                      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>{i.sev} severity</span>
                    <span style={{ fontSize: 13, color: '#94A3B8' }}>{i.time}</span>
                  </div>
                </div>
                <div style={{ fontSize: 15, color: '#0F172A', fontWeight: 600, marginBottom: 4 }}>{i.title}</div>
                <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.5 }}>{i.detail}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '12px 16px', background: 'rgba(245,158,11,0.06)', borderTop: '1px solid #E2E8F0', fontSize: 14, color: '#475569' }}>
            <strong style={{ color: '#0F172A' }}>Suggested action:</strong> Players with this signal pattern often respond well to a deposit-limit conversation.
          </div>
        </div>
      </div>
    </div>
  );
}

function MicroStat({ label, value, delta, tone }) {
  const c = RISK_COLORS[tone];
  return (
    <div style={{ ...cardStyle, padding: 12 }}>
      <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: '#0F172A', fontFamily: "'Roboto Mono', monospace", letterSpacing: '-0.01em', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: c.main }}>{delta} w/w</div>
    </div>
  );
}

function BehaviourChart() {
  const days = 30;
  const spend = Array.from({ length: days }, (_, i) => 80 + Math.sin(i * 0.4) * 20 + (i > 22 ? (i - 22) * 35 : 0) + Math.random() * 10);
  const dep = Array.from({ length: days }, (_, i) => i > 22 ? 1 + Math.floor(Math.random() * 4) : Math.random() > 0.7 ? 1 : 0);
  const W = 600, H = 180, PAD_L = 30, PAD_B = 22, PAD_T = 8;
  const max = Math.max(...spend);
  const innerW = W - PAD_L - 8;
  const innerH = H - PAD_T - PAD_B;
  const xStep = innerW / (days - 1);
  const path = spend.map((v, i) => {
    const x = PAD_L + i * xStep;
    const y = PAD_T + innerH - (v / max) * innerH;
    return (i === 0 ? 'M' : 'L') + x + ',' + y;
  }).join(' ');
  const area = path + ` L${PAD_L + (days-1)*xStep},${PAD_T+innerH} L${PAD_L},${PAD_T+innerH}Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {[0, 0.5, 1].map((t, i) => (
        <line key={i} x1={PAD_L} y1={PAD_T + innerH * t} x2={W - 8} y2={PAD_T + innerH * t} stroke="#F1F5F9" />
      ))}
      <path d={area} fill="#0F172A" fillOpacity="0.06" />
      <path d={path} fill="none" stroke="#0F172A" strokeWidth="1.5" />
      {/* Deposit bars */}
      {dep.map((d, i) => d > 0 && (
        <rect key={i}
          x={PAD_L + i * xStep - 1.5}
          y={PAD_T + innerH - d * 12}
          width="3"
          height={d * 12}
          fill="#DC2626"
          rx="1"
        />
      ))}
      {/* Risk threshold annotation */}
      <line x1={PAD_L + 22 * xStep} y1={PAD_T} x2={PAD_L + 22 * xStep} y2={PAD_T + innerH} stroke="#D97706" strokeWidth="1" strokeDasharray="3,3" />
      <text x={PAD_L + 22 * xStep + 4} y={PAD_T + 10} fontSize="11" fill="#D97706" fontWeight="600">Risk score: medium → high</text>
      {/* X labels */}
      {[0, 7, 14, 21, 29].map(i => (
        <text key={i} x={PAD_L + i * xStep} y={H - 6} fontSize="11" textAnchor="middle" fill="#94A3B8">
          {i === 0 ? '30d ago' : i === 29 ? 'Today' : `D-${29-i}`}
        </text>
      ))}
    </svg>
  );
}

function ProductDistribution() {
  const data = [
    { day: 'Apr 09', sports: 80, casino: 18, virtuals: 2 },
    { day: 'Apr 12', sports: 72, casino: 25, virtuals: 3 },
    { day: 'Apr 15', sports: 68, casino: 28, virtuals: 4 },
    { day: 'Apr 18', sports: 58, casino: 38, virtuals: 4 },
    { day: 'Apr 21', sports: 48, casino: 48, virtuals: 4 },
    { day: 'Apr 24', sports: 38, casino: 58, virtuals: 4 },
    { day: 'Apr 27', sports: 28, casino: 68, virtuals: 4 },
    { day: 'Apr 30', sports: 22, casino: 74, virtuals: 4 },
  ];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 90, marginBottom: 8 }}>
        {data.map(d => (
          <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', height: '100%', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: `${d.sports}%`, background: '#3B82F6' }}></div>
            <div style={{ height: `${d.casino}%`, background: '#A855F7' }}></div>
            <div style={{ height: `${d.virtuals}%`, background: '#06B6D4' }}></div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', marginBottom: 14 }}>
        {data.map(d => <span key={d.day}>{d.day}</span>)}
      </div>
      <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
        {[['Sports', '#3B82F6', '22%'], ['Casino', '#A855F7', '74%'], ['Virtuals', '#06B6D4', '4%']].map(([l, c, v]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, background: c, borderRadius: 2 }}></span>
            <span style={{ color: '#475569' }}>{l}</span>
            <span style={{ color: '#0F172A', fontWeight: 600, fontFamily: "'Roboto Mono', monospace" }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '8px 10px', background: 'rgba(168, 85, 247, 0.06)', borderRadius: 5, fontSize: 13, color: '#475569', borderLeft: '2px solid #A855F7' }}>
        <strong style={{ color: '#0F172A' }}>Pattern shift detected:</strong> Movement from Sports → Casino over the last 14 days.
      </div>
    </div>
  );
}

Object.assign(window, { PlayerDetail });
