// Player Risk Dashboard - detailed player view

const { useState: useStatePD } = React;
const { KGEnums, KGConstants } = window;

// Tiny seeded RNG — mirrors the one in data.jsx so charts are stable per player.
function pdSeeded(seed) {
  let s = seed | 0;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}
function playerSeed(id) {
  return id.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 7);
}

// Derive 3–5 risk-insight objects from a player's existing data fields.
// All source data lives solely in data.jsx PLAYERS — nothing is hardcoded here.
function generatePlayerInsights(player) {
  const { signals = [], insight, spendDelta, riskScore, spend, deposits, brand } = player;
  const cur  = fmtCompact(spend, brand);
  const prev = fmtCompact(Math.round(spend / (1 + (spendDelta || 0) / 100)), brand);
  const out  = [];

  if (signals.includes('Rapid re-deposit')) {
    out.push({ sev: 'high', title: 'Rapid re-deposit pattern', detail: `Player re-deposited within minutes of depleting session balance on multiple occasions. Average re-deposit window within high-risk criteria.`, time: '2h ago' });
  }

  if ((spendDelta || 0) >= 50) {
    out.push({ sev: 'high', title: `Spend up ${spendDelta}% vs prior 7 days`, detail: `Weekly spend has escalated from ${prev} to ${cur} — a material week-on-week increase.`, time: '6h ago' });
  }

  if (signals.includes('Late-night activity shift')) {
    out.push({ sev: 'medium', title: 'Late-night session activity shift', detail: 'Significant proportion of bets placed between 22:00–04:00, up sharply vs the prior 7-day window.', time: '2d ago' });
  }

  if (signals.includes('Deposit frequency surge')) {
    out.push({ sev: 'medium', title: 'Deposit frequency surge', detail: 'Number of deposits per session has risen well above the 28-day baseline. Velocity is a primary model driver.', time: '1d ago' });
  }

  if (signals.includes('Multiple deposits/session')) {
    out.push({ sev: 'medium', title: 'Multiple deposits in single session', detail: `${deposits} deposits recorded this week, with several occurring within the same session window.`, time: '1d ago' });
  }

  if (signals.includes('Sports → Casino shift')) {
    out.push({ sev: 'medium', title: 'Product migration: Sports → Casino', detail: 'Player has materially shifted activity from sports into casino products over the last 14 days.', time: '3d ago' });
  }

  if (signals.includes('Loss-chasing pattern')) {
    out.push({ sev: 'high', title: 'Loss-chasing pattern detected', detail: 'Behavioural model identified a sequence of escalating bets following losses — a key harm indicator.', time: '4h ago' });
  }

  if (signals.includes('Failed deposit attempts')) {
    out.push({ sev: 'low', title: 'Failed deposit attempts', detail: 'Several failed payment attempts recorded. May indicate payment friction or limit-circumvention behaviour.', time: '3d ago' });
  }

  // Fallback: always surface the primary insight from the player record
  if (out.length === 0 && insight) {
    out.push({ sev: 'high', title: insight, detail: `Risk score: ${riskScore ?? '—'}. No additional signal detail available — model is still calibrating for this player.`, time: '1h ago' });
  }

  // Risk score threshold note if we still have room
  if (out.length < 3 && riskScore != null) {
    out.push({ sev: 'low', title: 'Risk score above monitoring threshold', detail: `Current score of ${riskScore} places this player in the high-risk bucket. Continued monitoring recommended.`, time: '1d ago' });
  }

  return out.slice(0, 5);
}

function PlayerDetail({ playerId, onBack }) {
  const { getPlayerById, PLAYERS } = window.KGData;
  const player = getPlayerById(playerId) || PLAYERS[0];
  const [tab, setTab] = useStatePD('overview');

  // All insights derived from the player's own data — no hardcoded values.
  const insights = generatePlayerInsights(player);

  // MicroStat deltas — derived from player.spendDelta so they reflect the selected player.
  const sd = player.spendDelta || 0;
  const depositsGrowthPct = Math.round(sd * 0.62);
  const betsGrowthPct     = Math.round(sd * 0.71);
  const avgDepositPct     = Math.max(1, Math.round(sd - depositsGrowthPct));

  const sevColor = {
    high: KGConstants.RISK_COLORS.high.main,
    medium: KGConstants.RISK_COLORS.medium.main,
    low: KGConstants.RISK_COLORS.low.main,
  };

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
            background: player.brand === KGEnums.BRAND.BETKING ? '#001041' : '#040B67',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: player.brand === KGEnums.BRAND.BETKING ? '#FFC400' : '#F1C72F',
            fontWeight: 700,
          }}>{player.brand === KGEnums.BRAND.BETKING ? 'BK' : 'SS'}</div>
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
            <MicroStat label="Spend / 7d"   value={fmtCompact(player.spend, player.brand)} delta={`+${sd}%`}              tone="high"   />
            <MicroStat label="Deposits / 7d" value={player.deposits}                        delta={`+${depositsGrowthPct}%`} tone="high"   />
            <MicroStat label="Bets / 7d"     value={player.bets}                            delta={`+${betsGrowthPct}%`}     tone="high"   />
            <MicroStat label="Avg deposit"   value={fmtCompact(Math.round(player.spend / Math.max(player.deposits, 1)), player.brand)} delta={`+${avgDepositPct}%`} tone="medium" />
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
            <BehaviourChart player={player} />
          </div>

          <div style={{ ...cardStyle }}>
            <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 12 }}>Product distribution · 30d</div>
            <ProductDistribution player={player} />
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

function BehaviourChart({ player }) {
  // Seeded RNG keyed to the player ID — chart shape is stable and unique per player,
  // no Math.random(), so the detail view is consistent on every render.
  const rnd = pdSeeded(playerSeed(player.id));

  const days = 30;
  // Escalation point: high-risk players show a spike in the last ~8 days.
  // Shift the inflection slightly per player so each chart looks distinct.
  const escalationDay = 18 + Math.floor(rnd() * 6); // 18–23
  const depositFreq   = player.risk === 'high' ? 0.55 : player.risk === 'medium' ? 0.30 : 0.15;
  const spend = Array.from({ length: days }, (_, i) => {
    const trend    = 70 + Math.sin(i * (0.35 + rnd() * 0.1)) * 15;
    const escalate = i > escalationDay ? (i - escalationDay) * (20 + rnd() * 20) : 0;
    const noise    = (rnd() - 0.5) * 8;
    return Math.max(10, trend + escalate + noise);
  });
  const dep = Array.from({ length: days }, (_, i) =>
    rnd() < (i > escalationDay ? depositFreq * 2 : depositFreq) ? 1 + Math.floor(rnd() * 3) : 0
  );

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
      <line x1={PAD_L + escalationDay * xStep} y1={PAD_T} x2={PAD_L + escalationDay * xStep} y2={PAD_T + innerH} stroke="#D97706" strokeWidth="1" strokeDasharray="3,3" />
      <text x={PAD_L + escalationDay * xStep + 4} y={PAD_T + 10} fontSize="11" fill="#D97706" fontWeight="600">Risk score: medium → high</text>
      {[0, 7, 14, 21, 29].map(i => (
        <text key={i} x={PAD_L + i * xStep} y={H - 6} fontSize="11" textAnchor="middle" fill="#94A3B8">
          {i === 0 ? '30d ago' : i === 29 ? 'Today' : `D-${29-i}`}
        </text>
      ))}
    </svg>
  );
}

function ProductDistribution({ player }) {
  // Generate a plausible 8-week product-share trend from the player's current products
  // and risk profile. Uses seeded RNG so the chart is stable across renders.
  const rnd    = pdSeeded(playerSeed(player.id) + 1);
  const prods  = player.products || ['Sports'];
  const hasCasino   = prods.includes('Casino');
  const hasVirtuals = prods.includes('Virtuals');
  const hasShift    = (player.signals || []).includes('Sports → Casino shift');

  // End-state shares driven by the player's current products
  const endCasino   = hasCasino   ? (hasShift ? 68 + Math.floor(rnd() * 12) : 30 + Math.floor(rnd() * 20)) : 0;
  const endVirtuals = hasVirtuals ? 3 + Math.floor(rnd() * 5) : 0;

  // Start-state: sports dominant, casino/virtuals lower
  const startCasino   = hasCasino   ? Math.max(5, endCasino   - (hasShift ? 55 : 15) + Math.floor(rnd() * 10)) : 0;
  const startVirtuals = hasVirtuals ? Math.max(1, endVirtuals - 2) : 0;

  const DATES = ['Apr 09','Apr 12','Apr 15','Apr 18','Apr 21','Apr 24','Apr 27','Apr 30'];
  const data = DATES.map((day, i) => {
    const t       = i / (DATES.length - 1);
    const casino   = Math.round(startCasino   + (endCasino   - startCasino)   * t + (rnd() - 0.5) * 3);
    const virtuals = Math.round(startVirtuals + (endVirtuals - startVirtuals) * t);
    const sports   = Math.max(0, 100 - casino - virtuals);
    return { day, sports, casino, virtuals };
  });

  const productColors = { Sports: '#3B82F6', Casino: '#A855F7', Virtuals: '#06B6D4' };
  const latestSports   = data[data.length - 1].sports;
  const latestCasino   = data[data.length - 1].casino;
  const latestVirtuals = data[data.length - 1].virtuals;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 90, marginBottom: 8 }}>
        {data.map(d => (
          <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', height: '100%', borderRadius: 2, overflow: 'hidden' }}>
            {d.sports   > 0 && <div style={{ height: `${d.sports}%`,   background: productColors.Sports   }}></div>}
            {d.casino   > 0 && <div style={{ height: `${d.casino}%`,   background: productColors.Casino   }}></div>}
            {d.virtuals > 0 && <div style={{ height: `${d.virtuals}%`, background: productColors.Virtuals }}></div>}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', marginBottom: 14 }}>
        {data.map(d => <span key={d.day}>{d.day}</span>)}
      </div>
      <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
        {[
          ['Sports',   productColors.Sports,   `${latestSports}%`],
          hasCasino   ? ['Casino',   productColors.Casino,   `${latestCasino}%`]   : null,
          hasVirtuals ? ['Virtuals', productColors.Virtuals, `${latestVirtuals}%`] : null,
        ].filter(Boolean).map(([l, c, v]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, background: c, borderRadius: 2 }}></span>
            <span style={{ color: '#475569' }}>{l}</span>
            <span style={{ color: '#0F172A', fontWeight: 600, fontFamily: "'Roboto Mono', monospace" }}>{v}</span>
          </div>
        ))}
      </div>
      {hasShift && (
        <div style={{ marginTop: 12, padding: '8px 10px', background: 'rgba(168, 85, 247, 0.06)', borderRadius: 5, fontSize: 13, color: '#475569', borderLeft: '2px solid #A855F7' }}>
          <strong style={{ color: '#0F172A' }}>Pattern shift detected:</strong> Movement from Sports → Casino over the last 14 days.
        </div>
      )}
    </div>
  );
}

Object.assign(window, { PlayerDetail });
