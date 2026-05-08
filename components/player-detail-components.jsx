// Player Risk Dashboard - detailed player view

const { useState: useStatePD } = React;
const { KGEnums, KGConstants } = window;

const PLAYER_DETAIL_TAB = Object.freeze({
  OVERVIEW: 'overview',
  INSIGHTS: 'insights',
  BEHAVIOUR: 'behaviour',
  LOG: 'log',
});

const PLAYER_DETAIL_TAB_BUTTON_IDS = Object.freeze({
  [PLAYER_DETAIL_TAB.OVERVIEW]: KGEnums.COMPONENT_ID.PLAYER_DETAIL_TAB_OVERVIEW_BUTTON,
  [PLAYER_DETAIL_TAB.INSIGHTS]: KGEnums.COMPONENT_ID.PLAYER_DETAIL_TAB_INSIGHTS_BUTTON,
  [PLAYER_DETAIL_TAB.BEHAVIOUR]: KGEnums.COMPONENT_ID.PLAYER_DETAIL_TAB_BEHAVIOUR_BUTTON,
  [PLAYER_DETAIL_TAB.LOG]: KGEnums.COMPONENT_ID.PLAYER_DETAIL_TAB_LOG_BUTTON,
});

const PLAYER_DETAIL_STAT_KEY = Object.freeze({
  SPEND: 'spend',
  DEPOSITS: 'deposits',
  BETS: 'bets',
  AVG_DEPOSIT: 'avg-deposit',
});

function buildComponentChildId(baseId, suffix) {
  return baseId ? `${baseId}-${suffix}` : undefined;
}

// Tiny seeded RNG — mirrors the one in data.jsx so charts are stable per player.
function pdSeeded(seed) {
  let s = seed | 0;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}
function playerSeed(id) {
  return id.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 7);
}

// Derive 3–5 risk-insight objects from a player's existing data fields.
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
  if (out.length === 0 && insight) {
    out.push({ sev: 'high', title: insight, detail: `Risk score: ${riskScore ?? '—'}. No additional signal detail available — model is still calibrating for this player.`, time: '1h ago' });
  }
  if (out.length < 3 && riskScore != null) {
    out.push({ sev: 'low', title: 'Risk score above monitoring threshold', detail: `Current score of ${riskScore} places this player in the high-risk bucket. Continued monitoring recommended.`, time: '1d ago' });
  }
  return out.slice(0, 5);
}

// Generate a plausible interaction history from the player's status and signals.
function generateInteractionLog(player) {
  const rnd = pdSeeded(playerSeed(player.id) + 99);
  const AGENTS = ['Amara Okafor', 'Chioma Eze', 'Emeka Nwosu', 'Fatima Al-Hassan', 'Ngozi Adeyemi'];
  const agent = AGENTS[Math.floor(rnd() * AGENTS.length)];
  const agent2 = AGENTS[Math.floor(rnd() * AGENTS.length)];

  const entries = [];
  const now = Date.now();
  const day = 86400000;

  // Automated model flag — always present
  entries.push({
    type: 'auto',
    title: 'Automated risk flag triggered',
    detail: `Risk model score crossed the 70-point threshold. Player automatically added to the high-risk monitoring queue.`,
    agent: 'King\'s Guard AI',
    time: new Date(now - Math.floor(7 + rnd() * 5) * day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    badge: 'System',
    badgeColor: '#475569',
  });

  // Signal-driven entries
  if ((player.signals || []).includes('Rapid re-deposit')) {
    entries.push({
      type: 'flag',
      title: 'Rapid re-deposit signal triggered',
      detail: 'Behavioural model detected multiple re-deposit events within 10 minutes of session loss. Signal elevated to high severity.',
      agent: 'King\'s Guard AI',
      time: new Date(now - Math.floor(5 + rnd() * 3) * day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      badge: 'Signal',
      badgeColor: '#DC2626',
    });
  }

  if ((player.signals || []).includes('Loss-chasing pattern')) {
    entries.push({
      type: 'flag',
      title: 'Loss-chasing pattern identified',
      detail: 'Model identified 3+ escalating bet sequences following consecutive losses within the same session. Primary harm indicator.',
      agent: 'King\'s Guard AI',
      time: new Date(now - Math.floor(4 + rnd() * 2) * day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      badge: 'Signal',
      badgeColor: '#DC2626',
    });
  }

  // Account manager review
  if (player.status && player.status !== KGEnums.PLAYER_STATUS.MONITOR) {
    entries.push({
      type: 'review',
      title: 'Account reviewed by RG team',
      detail: `Player profile reviewed by ${agent}. Behavioural indicators assessed. Player escalated to outreach queue given score trajectory.`,
      agent,
      time: new Date(now - Math.floor(3 + rnd() * 2) * day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      badge: 'Review',
      badgeColor: '#D97706',
    });
  }

  // Status-specific interaction
  if (player.status === KGEnums.PLAYER_STATUS.OUTREACH || player.status === 'outreach-rec') {
    entries.push({
      type: 'outreach',
      title: 'Outreach call attempted — no answer',
      detail: `${agent} attempted to contact the player via registered phone number. No answer recorded. Follow-up scheduled in 48 hours.`,
      agent,
      time: new Date(now - Math.floor(2 + rnd() * 1) * day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      badge: 'Outreach',
      badgeColor: '#7C3AED',
    });
    if (rnd() > 0.5) {
      entries.push({
        type: 'outreach',
        title: 'Responsible gambling resources sent',
        detail: `RG information email sent to registered address. Included deposit limit guidance and self-exclusion pathway.`,
        agent,
        time: new Date(now - Math.floor(1) * day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        badge: 'Outreach',
        badgeColor: '#7C3AED',
      });
    }
  } else if (player.status === KGEnums.PLAYER_STATUS.MONITOR) {
    entries.push({
      type: 'review',
      title: 'Added to enhanced monitoring',
      detail: `${agent2} added player to the enhanced monitoring cohort. Score trajectory and deposit velocity to be reviewed at next weekly cycle.`,
      agent: agent2,
      time: new Date(now - Math.floor(2 + rnd() * 2) * day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      badge: 'Monitor',
      badgeColor: '#D97706',
    });
  } else if (player.status === KGEnums.PLAYER_STATUS.FLAGGED) {
    entries.push({
      type: 'flag',
      title: 'Player manually flagged for senior review',
      detail: `${agent} escalated the case to senior RG officer following score trajectory review. Pending team assessment.`,
      agent,
      time: new Date(now - Math.floor(1 + rnd() * 2) * day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      badge: 'Escalated',
      badgeColor: '#DC2626',
    });
  }

  // Most recent: note added
  entries.push({
    type: 'note',
    title: 'Case note added',
    detail: `Player has shown consistent escalation pattern over the 7-day window. Deposit velocity and session frequency are primary model drivers. No player contact established yet.`,
    agent,
    time: new Date(now - Math.floor(rnd() * 18) * 3600000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' today',
    badge: 'Note',
    badgeColor: '#64748B',
  });

  return entries;
}

function PlayerDetail({ playerId, onBack }) {
  const COMPONENT_ID = KGEnums.COMPONENT_ID;
  const { getPlayerById, PLAYERS } = window.KGData;
  const player = getPlayerById(playerId) || PLAYERS[0];
  const [tab, setTab] = useStatePD(PLAYER_DETAIL_TAB.OVERVIEW);
  const [playerRange, setPlayerRange] = useStatePD(KGEnums.DATE_RANGE.LAST_7_DAYS);

  const insights = generatePlayerInsights(player);
  const interactionLog = generateInteractionLog(player);

  const sd = player.spendDelta || 0;
  const depositsGrowthPct = Math.round(sd * 0.62);
  const betsGrowthPct     = Math.round(sd * 0.71);
  const avgDepositPct     = Math.max(1, Math.round(sd - depositsGrowthPct));

  const sevColor = {
    high: KGConstants.RISK_COLORS.high.main,
    medium: KGConstants.RISK_COLORS.medium.main,
    low: KGConstants.RISK_COLORS.low.main,
  };

  const TABS = [
    [PLAYER_DETAIL_TAB.OVERVIEW,  'Overview'],
    [PLAYER_DETAIL_TAB.INSIGHTS,  `Risk insights · ${insights.length}`],
    [PLAYER_DETAIL_TAB.BEHAVIOUR, 'Behaviour'],
    [PLAYER_DETAIL_TAB.LOG,       `Interaction log · ${interactionLog.length}`],
  ];

  // ── Tab bodies ────────────────────────────────────────────────────────────

  // Determine zone info for the player's score
  const score = player.riskScore ?? 0;
  const scoreZone = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  const scoreZoneLabel = KGConstants.getRiskTierLabel(scoreZone);
  const scoreColor = scoreZone === 'high' ? '#DC2626' : scoreZone === 'medium' ? '#D97706' : '#16A34A';

  const overviewBody = (
    <div id={COMPONENT_ID.PLAYER_DETAIL_OVERVIEW_PANEL} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Risk score card — full width */}
      <div id={COMPONENT_ID.PLAYER_DETAIL_OVERVIEW_RISK_SCORE_CARD} style={{ ...cardStyle, padding: 20 }}>
        {/* 2-row grid: labels row 1, values row 2. Dividers explicitly placed to span both rows. */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1px auto 1px 1fr', gridTemplateRows: 'auto auto', columnGap: 24, rowGap: 8 }}>
          {/* Dividers — placed first with explicit coords so they span both rows */}
          <div style={{ gridColumn: 2, gridRow: '1 / 3', background: '#E2E8F0' }} />
          <div style={{ gridColumn: 4, gridRow: '1 / 3', background: '#E2E8F0' }} />

          {/* Row 1 — labels */}
          <div style={{ gridColumn: 1, gridRow: 1, fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Risk score</div>
          <div style={{ gridColumn: 3, gridRow: 1, fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Current zone</div>
          <div style={{ gridColumn: 5, gridRow: 1, fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Score position</div>

          {/* Row 2 — values */}
          <div style={{ gridColumn: 1, gridRow: 2, display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 40, fontWeight: 700, color: scoreColor, fontFamily: "'Roboto Mono', monospace", lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 14, color: '#94A3B8' }}>/ 100</span>
          </div>
          <div style={{ gridColumn: 3, gridRow: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ padding: '3px 10px', borderRadius: 4, background: `${scoreColor}15`, color: scoreColor, fontSize: 14, fontWeight: 700 }}>{scoreZoneLabel}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#475569' }}><TrendArrow trend={player.trend} /></span>
          </div>
          <div style={{ gridColumn: 5, gridRow: 2, paddingTop: 10 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', gap: 2 }}>
                <div style={{ width: '40%', background: 'linear-gradient(90deg, #BBF7D0, #86EFAC)', borderRadius: '5px 0 0 5px' }} />
                <div style={{ width: '30%', background: 'linear-gradient(90deg, #FDE68A, #FCA5A5)' }} />
                <div style={{ width: '30%', background: 'linear-gradient(90deg, #FCA5A5, #DC2626)', borderRadius: '0 5px 5px 0' }} />
              </div>
              <div style={{
                position: 'absolute', top: -3, left: `calc(${score}% - 7px)`,
                width: 14, height: 16, borderRadius: 3, background: scoreColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '5px solid white', marginTop: 6 }} />
              </div>
            </div>
            <div style={{ position: 'relative', height: 20, marginTop: 4 }}>
              <span style={{ position: 'absolute', left: 0, fontSize: 11, color: '#16A34A', fontWeight: 600 }}>0 · Low</span>
              <span style={{ position: 'absolute', left: '40%', transform: 'translateX(-50%)', fontSize: 11, color: '#D97706', fontWeight: 600 }}>40 · Medium</span>
              <span style={{ position: 'absolute', left: '70%', transform: 'translateX(-50%)', fontSize: 11, color: '#DC2626', fontWeight: 600 }}>70 · High</span>
              <span style={{ position: 'absolute', right: 0, fontSize: 11, color: '#94A3B8' }}>100</span>
            </div>
          </div>
        </div>
      </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
      {/* Left */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div id={COMPONENT_ID.PLAYER_DETAIL_OVERVIEW_STATS_GRID} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          <MicroStat componentId={buildComponentChildId(COMPONENT_ID.PLAYER_DETAIL_OVERVIEW_STATS_GRID, PLAYER_DETAIL_STAT_KEY.SPEND)} label="Spend / 7d"    value={fmtCompact(player.spend, player.brand)} delta={`+${sd}%`}               tone="high" />
          <MicroStat componentId={buildComponentChildId(COMPONENT_ID.PLAYER_DETAIL_OVERVIEW_STATS_GRID, PLAYER_DETAIL_STAT_KEY.DEPOSITS)} label="Deposits / 7d" value={player.deposits}                        delta={`+${depositsGrowthPct}%`} tone="high" />
          <MicroStat componentId={buildComponentChildId(COMPONENT_ID.PLAYER_DETAIL_OVERVIEW_STATS_GRID, PLAYER_DETAIL_STAT_KEY.BETS)} label="Bets / 7d"     value={player.bets}                            delta={`+${betsGrowthPct}%`}     tone="high" />
          <MicroStat componentId={buildComponentChildId(COMPONENT_ID.PLAYER_DETAIL_OVERVIEW_STATS_GRID, PLAYER_DETAIL_STAT_KEY.AVG_DEPOSIT)} label="Avg deposit"   value={fmtCompact(Math.round(player.spend / Math.max(player.deposits, 1)), player.brand)} delta={`+${avgDepositPct}%`} tone="medium" />
        </div>
        {/* Combined spend + deposits chart */}
        <SpendDepositsCard componentId={COMPONENT_ID.PLAYER_DETAIL_OVERVIEW_SPEND_DEPOSITS_CARD} player={player} range={playerRange} setRange={setPlayerRange} />
        <div id={COMPONENT_ID.PLAYER_DETAIL_OVERVIEW_PRODUCT_DISTRIBUTION_CARD} style={{ ...cardStyle }}>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 12 }}>Product distribution · 30d</div>
          <ProductDistribution player={player} />
        </div>
      </div>
      {/* Right: insights summary */}
      <div id={COMPONENT_ID.PLAYER_DETAIL_OVERVIEW_EXPLAINABILITY_CARD} style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Why this player is flagged</div>
          <div style={{ fontSize: 16, color: '#0F172A', fontWeight: 600, marginTop: 2 }}>Risk insights · explainability</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {insights.map((ins, idx) => (
            <div key={idx} style={{ padding: '14px 16px', borderBottom: idx < insights.length - 1 ? '1px solid #F1F5F9' : 'none', borderLeft: `3px solid ${sevColor[ins.sev]}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 3, background: `${sevColor[ins.sev]}1A`, color: sevColor[ins.sev], fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{ins.sev} severity</span>
                <span style={{ fontSize: 13, color: '#94A3B8' }}>{ins.time}</span>
              </div>
              <div style={{ fontSize: 15, color: '#0F172A', fontWeight: 600, marginBottom: 4 }}>{ins.title}</div>
              <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.5 }}>{ins.detail}</div>
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

  const insightsBody = (
    <div id={COMPONENT_ID.PLAYER_DETAIL_INSIGHTS_PANEL} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Score context bar */}
      <div id={COMPONENT_ID.PLAYER_DETAIL_INSIGHTS_CONTEXT_CARD} style={{ ...cardStyle, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>Risk score</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#DC2626', fontFamily: "'Roboto Mono', monospace" }}>{player.riskScore ?? '—'}<span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 400 }}> / 100</span></div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>Trend</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}><TrendArrow trend={player.trend} />{player.trend ? player.trend.charAt(0).toUpperCase() + player.trend.slice(1) : '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>Active signals</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', fontFamily: "'Roboto Mono', monospace" }}>{(player.signals || []).length}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>Risk bucket</div>
            <div style={{ marginTop: 4 }}><RiskPill level={player.risk} /></div>
          </div>
        </div>
        {/* Score bar */}
        <div style={{ marginTop: 14 }}>
          <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${player.riskScore ?? 0}%`, background: player.riskScore >= 70 ? '#DC2626' : player.riskScore >= 40 ? '#D97706' : '#16A34A', borderRadius: 3 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
            <span>{`0 — ${KGConstants.getRiskTierLabel(KGEnums.RISK.LOW)}`}</span><span>{`40 — ${KGConstants.getRiskTierLabel(KGEnums.RISK.MEDIUM)}`}</span><span>{`70 — ${KGConstants.getRiskTierLabel(KGEnums.RISK.HIGH)}`}</span><span>100</span>
          </div>
        </div>
      </div>

      {/* Signal summary */}
      {(player.signals || []).length > 0 && (
        <div id={COMPONENT_ID.PLAYER_DETAIL_INSIGHTS_SIGNALS_CARD} style={{ ...cardStyle, padding: 16 }}>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 12 }}>Active signals</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(player.signals || []).map((s, i) => (
              <span key={i} style={{ padding: '5px 10px', background: '#FEF2F2', color: '#DC2626', borderRadius: 5, fontSize: 13, fontWeight: 600, border: '1px solid #FECACA' }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Full insight cards */}
      <div id={COMPONENT_ID.PLAYER_DETAIL_INSIGHTS_GRID} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {insights.map((ins, idx) => (
          <div key={idx} style={{ ...cardStyle, padding: 0, overflow: 'hidden', borderLeft: `4px solid ${sevColor[ins.sev]}` }}>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 3, background: `${sevColor[ins.sev]}1A`, color: sevColor[ins.sev], fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{ins.sev} severity</span>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>{ins.time}</span>
              </div>
              <div style={{ fontSize: 15, color: '#0F172A', fontWeight: 600, marginBottom: 6 }}>{ins.title}</div>
              <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.55 }}>{ins.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested action */}
      <div id={COMPONENT_ID.PLAYER_DETAIL_INSIGHTS_ACTION_CARD} style={{ ...cardStyle, padding: 16, background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <div style={{ fontSize: 13, color: '#D97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Suggested action</div>
        <div style={{ fontSize: 15, color: '#0F172A', lineHeight: 1.6 }}>
          Players with this signal pattern often respond well to a <strong>deposit-limit conversation</strong>. Consider a proactive outreach call to discuss responsible gambling tools. If no contact in 72h, escalate to senior RG officer.
        </div>
      </div>
    </div>
  );

  const behaviourBody = (
    <div id={COMPONENT_ID.PLAYER_DETAIL_BEHAVIOUR_PANEL} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Micro stats row */}
      <div id={COMPONENT_ID.PLAYER_DETAIL_BEHAVIOUR_STATS_GRID} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <MicroStat componentId={buildComponentChildId(COMPONENT_ID.PLAYER_DETAIL_BEHAVIOUR_STATS_GRID, PLAYER_DETAIL_STAT_KEY.SPEND)} label="Spend / 7d"    value={fmtCompact(player.spend, player.brand)} delta={`+${sd}%`}               tone="high" />
        <MicroStat componentId={buildComponentChildId(COMPONENT_ID.PLAYER_DETAIL_BEHAVIOUR_STATS_GRID, PLAYER_DETAIL_STAT_KEY.DEPOSITS)} label="Deposits / 7d" value={player.deposits}                        delta={`+${depositsGrowthPct}%`} tone="high" />
        <MicroStat componentId={buildComponentChildId(COMPONENT_ID.PLAYER_DETAIL_BEHAVIOUR_STATS_GRID, PLAYER_DETAIL_STAT_KEY.BETS)} label="Bets / 7d"     value={player.bets}                            delta={`+${betsGrowthPct}%`}     tone="high" />
        <MicroStat componentId={buildComponentChildId(COMPONENT_ID.PLAYER_DETAIL_BEHAVIOUR_STATS_GRID, PLAYER_DETAIL_STAT_KEY.AVG_DEPOSIT)} label="Avg deposit"   value={fmtCompact(Math.round(player.spend / Math.max(player.deposits, 1)), player.brand)} delta={`+${avgDepositPct}%`} tone="medium" />
      </div>

      {/* Combined spend + deposits chart */}
      <SpendDepositsCard componentId={COMPONENT_ID.PLAYER_DETAIL_BEHAVIOUR_SPEND_DEPOSITS_CARD} player={player} range={playerRange} setRange={setPlayerRange} tall />

      {/* Session timing + product split side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Session timing */}
        <div id={COMPONENT_ID.PLAYER_DETAIL_BEHAVIOUR_SESSION_TIMING_CARD} style={{ ...cardStyle }}>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 14 }}>Session timing distribution</div>
          <SessionTimingChart player={player} />
        </div>
        {/* Product distribution */}
        <div id={COMPONENT_ID.PLAYER_DETAIL_BEHAVIOUR_PRODUCT_DISTRIBUTION_CARD} style={{ ...cardStyle }}>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 12 }}>Product distribution · 30d</div>
          <ProductDistribution player={player} />
        </div>
      </div>
    </div>
  );

  const logBody = (
    <div id={COMPONENT_ID.PLAYER_DETAIL_LOG_PANEL} style={{ display: 'flex', flexDirection: 'column', gap: 0, ...cardStyle, padding: 0, overflow: 'hidden' }}>
      <div id={COMPONENT_ID.PLAYER_DETAIL_LOG_HEADER} style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Interaction log</div>
          <div style={{ fontSize: 16, color: '#0F172A', fontWeight: 600, marginTop: 2 }}>All recorded actions for this player</div>
        </div>
        <button id={COMPONENT_ID.PLAYER_DETAIL_LOG_ADD_NOTE_BUTTON} style={btnPrimary}><Icon name="note" size={14}/> Add note</button>
      </div>

      {interactionLog.map((entry, idx) => {
        const typeIcon = { auto: '⚙', flag: '⚑', review: '◎', outreach: '☎', note: '✎' }[entry.type] || '•';
        return (
          <div key={idx} style={{
            display: 'flex', gap: 16, padding: '18px 20px',
            borderBottom: idx < interactionLog.length - 1 ? '1px solid #F1F5F9' : 'none',
            background: idx === 0 ? '#FAFAFA' : '#FFFFFF',
          }}>
            {/* Timeline dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 32 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: `${entry.badgeColor}15`,
                border: `2px solid ${entry.badgeColor}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: entry.badgeColor, flexShrink: 0,
              }}>{typeIcon}</div>
              {idx < interactionLog.length - 1 && (
                <div style={{ width: 1, flex: 1, background: '#E2E8F0', marginTop: 6 }} />
              )}
            </div>
            {/* Content */}
            <div style={{ flex: 1, paddingBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{
                  fontSize: 11, padding: '2px 7px', borderRadius: 3,
                  background: `${entry.badgeColor}15`, color: entry.badgeColor,
                  fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>{entry.badge}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{entry.title}</span>
              </div>
              <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.55, marginBottom: 8 }}>{entry.detail}</div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94A3B8' }}>
                <span>{entry.agent}</span>
                <span>{entry.time}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const tabContent = tab === PLAYER_DETAIL_TAB.OVERVIEW ? overviewBody
    : tab === PLAYER_DETAIL_TAB.INSIGHTS  ? insightsBody
    : tab === PLAYER_DETAIL_TAB.BEHAVIOUR ? behaviourBody
    : logBody;

  return (
    <div id={COMPONENT_ID.PLAYER_DETAIL_PAGE} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button id={COMPONENT_ID.PLAYER_DETAIL_BACK_BUTTON} onClick={onBack} style={{
        background: 'transparent', border: 'none', padding: 0, color: '#64748B',
        fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'inherit', alignSelf: 'flex-start',
      }}>← Back to player list</button>

      {/* Player header */}
      <div id={COMPONENT_ID.PLAYER_DETAIL_HEADER_CARD} style={{ ...cardStyle, padding: 20 }}>
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
            <button id={COMPONENT_ID.PLAYER_DETAIL_ACTION_ADD_NOTE_BUTTON} style={btnSecondary}><Icon name="note" size={14}/> Add note</button>
            <button id={COMPONENT_ID.PLAYER_DETAIL_ACTION_MONITOR_BUTTON} style={{ ...btnSecondary, color: '#D97706', borderColor: 'rgba(217,119,6,0.3)' }}>
              <Icon name="flag" size={14}/> Flag for monitor
            </button>
            <button id={COMPONENT_ID.PLAYER_DETAIL_ACTION_OUTREACH_BUTTON} style={{ ...btnPrimary, background: '#DC2626' }}>
              <Icon name="flag" size={14}/> Mark for outreach
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div id={COMPONENT_ID.PLAYER_DETAIL_TAB_LIST} style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E2E8F0' }}>
        {TABS.map(([tabId, label]) => (
          <button id={PLAYER_DETAIL_TAB_BUTTON_IDS[tabId]} key={tabId} onClick={() => setTab(tabId)} style={{
            padding: '10px 16px', background: 'transparent', border: 'none',
            borderBottom: tab === tabId ? '2px solid #0F172A' : '2px solid transparent',
            color: tab === tabId ? '#0F172A' : '#64748B',
            fontSize: 15, fontWeight: tab === tabId ? 600 : 500, cursor: 'pointer', fontFamily: 'inherit',
            marginBottom: -1,
          }}>{label}</button>
        ))}
      </div>

      {tabContent}
    </div>
  );
}

function MicroStat({ label, value, delta, tone, componentId }) {
  const c = RISK_COLORS[tone];
  return (
    <div id={componentId} style={{ ...cardStyle, padding: 12 }}>
      <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: '#0F172A', fontFamily: "'Roboto Mono', monospace", letterSpacing: '-0.01em', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: c.main }}>{delta} w/w</div>
    </div>
  );
}

function BehaviourChart({ player, tall }) {
  const rnd = pdSeeded(playerSeed(player.id));
  const days = 30;
  const escalationDay = 18 + Math.floor(rnd() * 6);
  const depositFreq   = player.risk === KGEnums.RISK.HIGH ? 0.55 : player.risk === KGEnums.RISK.MEDIUM ? 0.30 : 0.15;
  const spend = Array.from({ length: days }, (_, i) => {
    const trend    = 70 + Math.sin(i * (0.35 + rnd() * 0.1)) * 15;
    const escalate = i > escalationDay ? (i - escalationDay) * (20 + rnd() * 20) : 0;
    const noise    = (rnd() - 0.5) * 8;
    return Math.max(10, trend + escalate + noise);
  });
  const dep = Array.from({ length: days }, (_, i) =>
    rnd() < (i > escalationDay ? depositFreq * 2 : depositFreq) ? 1 + Math.floor(rnd() * 3) : 0
  );

  const W = 600, H = tall ? 240 : 180, PAD_L = 30, PAD_B = 22, PAD_T = 8;
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
        <rect key={i} x={PAD_L + i * xStep - 1.5} y={PAD_T + innerH - d * 12} width="3" height={d * 12} fill="#DC2626" rx="1" />
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

function SessionTimingChart({ player }) {
  const rnd = pdSeeded(playerSeed(player.id) + 77);
  const isLateNight = (player.signals || []).includes('Late-night activity shift');

  // 6 time bands: 06-10, 10-14, 14-18, 18-22, 22-02, 02-06
  const bands = ['06–10', '10–14', '14–18', '18–22', '22–02', '02–06'];
  const baseWeights = isLateNight
    ? [0.05, 0.08, 0.10, 0.18, 0.42, 0.17]
    : [0.08, 0.15, 0.22, 0.35, 0.14, 0.06];
  const vals = baseWeights.map(w => Math.max(1, Math.round(w * 100 + (rnd() - 0.5) * 6)));
  const maxVal = Math.max(...vals);
  const lateIdx = [4, 5];

  return (
    <div id={KGEnums.COMPONENT_ID.PLAYER_DETAIL_SESSION_TIMING_CHART}>
      {bands.map((b, i) => (
        <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#64748B', minWidth: 40, fontFamily: "'Roboto Mono', monospace" }}>{b}</span>
          <div style={{ flex: 1, height: 10, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${(vals[i] / maxVal) * 100}%`,
              background: lateIdx.includes(i) && isLateNight ? '#DC2626' : '#3B82F6',
              borderRadius: 3,
            }} />
          </div>
          <span style={{ fontSize: 12, color: lateIdx.includes(i) && isLateNight ? '#DC2626' : '#475569', fontWeight: lateIdx.includes(i) && isLateNight ? 700 : 400, minWidth: 28, textAlign: 'right', fontFamily: "'Roboto Mono', monospace" }}>{vals[i]}%</span>
        </div>
      ))}
      {isLateNight && (
        <div style={{ marginTop: 8, padding: '6px 10px', background: '#FEF2F2', borderRadius: 5, fontSize: 13, color: '#DC2626', fontWeight: 600, borderLeft: '2px solid #DC2626' }}>
          Late-night activity elevated — 22:00–06:00 accounts for {vals[4] + vals[5]}% of sessions
        </div>
      )}
    </div>
  );
}

function ProductDistribution({ player }) {
  const rnd    = pdSeeded(playerSeed(player.id) + 1);
  const prods  = player.products || [KGEnums.PRODUCT.SPORTS];
  const hasCasino   = prods.includes(KGEnums.PRODUCT.CASINO);
  const hasVirtuals = prods.includes(KGEnums.PRODUCT.VIRTUALS);
  const hasShift    = (player.signals || []).includes('Sports → Casino shift');

  const endCasino   = hasCasino   ? (hasShift ? 68 + Math.floor(rnd() * 12) : 30 + Math.floor(rnd() * 20)) : 0;
  const endVirtuals = hasVirtuals ? 3 + Math.floor(rnd() * 5) : 0;
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

  const productColors = { [KGEnums.PRODUCT.SPORTS]: '#3B82F6', [KGEnums.PRODUCT.CASINO]: '#A855F7', [KGEnums.PRODUCT.VIRTUALS]: '#06B6D4' };
  const latestSports   = data[data.length - 1].sports;
  const latestCasino   = data[data.length - 1].casino;
  const latestVirtuals = data[data.length - 1].virtuals;

  return (
    <div id={KGEnums.COMPONENT_ID.PLAYER_DETAIL_PRODUCT_DISTRIBUTION_CHART}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 90, marginBottom: 8 }}>
        {data.map(d => (
          <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', height: '100%', borderRadius: 2, overflow: 'hidden' }}>
            {d.sports   > 0 && <div style={{ height: `${d.sports}%`,   background: productColors[KGEnums.PRODUCT.SPORTS]   }}></div>}
            {d.casino   > 0 && <div style={{ height: `${d.casino}%`,   background: productColors[KGEnums.PRODUCT.CASINO]   }}></div>}
            {d.virtuals > 0 && <div style={{ height: `${d.virtuals}%`, background: productColors[KGEnums.PRODUCT.VIRTUALS] }}></div>}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', marginBottom: 14 }}>
        {data.map(d => <span key={d.day}>{d.day}</span>)}
      </div>
      <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
        {[
          [KGEnums.PRODUCT.SPORTS,   productColors[KGEnums.PRODUCT.SPORTS],   `${latestSports}%`],
          hasCasino   ? [KGEnums.PRODUCT.CASINO,   productColors[KGEnums.PRODUCT.CASINO],   `${latestCasino}%`]   : null,
          hasVirtuals ? [KGEnums.PRODUCT.VIRTUALS, productColors[KGEnums.PRODUCT.VIRTUALS], `${latestVirtuals}%`] : null,
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

// ── Shared chart data helper ──────────────────────────────────────────────────
function getPlayerChartData(player, range) {
  const n = range === '24h' ? 24 : range === '7d' ? 7 : 30;
  const seedOffset = range === '24h' ? 5 : range === '7d' ? 13 : 0;
  const rnd = pdSeeded(playerSeed(player.id) + seedOffset);
  const escAt = range === '24h' ? 17 : range === '7d' ? 4 : 18 + Math.floor(rnd() * 6);
  const escSlope = range === '30d' ? 20 : range === '7d' ? 60 : 8;
  const scale = range === '24h' ? 0.12 : range === '7d' ? 0.85 : 1;
  const depFreq = player.risk === KGEnums.RISK.HIGH ? 0.55 : player.risk === KGEnums.RISK.MEDIUM ? 0.30 : 0.15;

  const spend = Array.from({ length: n }, (_, i) => {
    const base = 70 + Math.sin(i * (0.35 + rnd() * 0.1)) * 15;
    const esc  = i > escAt ? (i - escAt) * (escSlope + rnd() * 20) : 0;
    return Math.max(10, (base + esc + (rnd() - 0.5) * 8) * scale);
  });
  const dep = Array.from({ length: n }, (_, i) =>
    rnd() < (i > escAt ? depFreq * 2 : depFreq) ? 1 + Math.floor(rnd() * 3) : 0
  );

  let labels;
  if (range === '24h') {
    labels = Array.from({ length: n }, (_, i) => i % 6 === 0 ? `${String(i).padStart(2,'0')}:00` : '');
  } else if (range === '7d') {
    labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Today'];
  } else {
    labels = Array.from({ length: n }, (_, i) =>
      i === 0 ? '30d ago' : i === 7 ? 'D-22' : i === 14 ? 'D-15' : i === 21 ? 'D-8' : i === 29 ? 'Today' : ''
    );
  }

  const escLabel = range === '24h' ? 'Risk spike' : 'Risk score: med → high';
  return { spend, dep, labels, escAt, escLabel };
}

// ── SpendChart ────────────────────────────────────────────────────────────────
function SpendChart({ player, range, tall }) {
  const { spend, labels, escAt, escLabel } = getPlayerChartData(player, range);
  const W = 600, H = tall ? 200 : 140, PAD_L = 30, PAD_B = 22, PAD_T = 10;
  const max = Math.max(...spend);
  const iW = W - PAD_L - 8, iH = H - PAD_T - PAD_B;
  const xStep = iW / (spend.length - 1);
  const path = spend.map((v, i) => `${i === 0 ? 'M' : 'L'}${PAD_L + i * xStep},${PAD_T + iH - (v / max) * iH}`).join(' ');
  const area = path + ` L${PAD_L + (spend.length-1)*xStep},${PAD_T+iH} L${PAD_L},${PAD_T+iH}Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {[0, 0.5, 1].map((t, i) => <line key={i} x1={PAD_L} y1={PAD_T + iH * t} x2={W-8} y2={PAD_T + iH * t} stroke="#F1F5F9" />)}
      <path d={area} fill="#0F172A" fillOpacity="0.06" />
      <path d={path} fill="none" stroke="#0F172A" strokeWidth="1.5" />
      <line x1={PAD_L + escAt * xStep} y1={PAD_T} x2={PAD_L + escAt * xStep} y2={PAD_T+iH} stroke="#D97706" strokeWidth="1" strokeDasharray="3,3" />
      <text x={PAD_L + escAt * xStep + 4} y={PAD_T + 10} fontSize="10" fill="#D97706" fontWeight="600">{escLabel}</text>
      {labels.map((l, i) => l && <text key={i} x={PAD_L + i * xStep} y={H-6} fontSize="11" textAnchor="middle" fill="#94A3B8">{l}</text>)}
    </svg>
  );
}

// ── DepositsChart ─────────────────────────────────────────────────────────────
function DepositsChart({ player, range, tall }) {
  const { dep, labels, escAt } = getPlayerChartData(player, range);
  const W = 600, H = tall ? 200 : 140, PAD_L = 30, PAD_B = 22, PAD_T = 10;
  const iW = W - PAD_L - 8, iH = H - PAD_T - PAD_B;
  const xStep = iW / (dep.length - 1);
  const maxD = Math.max(...dep, 1);
  const barW = Math.max(4, xStep * 0.55);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {[0, 0.5, 1].map((t, i) => <line key={i} x1={PAD_L} y1={PAD_T + iH * t} x2={W-8} y2={PAD_T + iH * t} stroke="#F1F5F9" />)}
      {dep.map((d, i) => d > 0 && (
        <rect key={i}
          x={PAD_L + i * xStep - barW / 2}
          y={PAD_T + iH - (d / maxD) * iH * 0.85}
          width={barW} height={(d / maxD) * iH * 0.85}
          fill={i > escAt ? '#DC2626' : '#94A3B8'} rx="2"
        />
      ))}
      <line x1={PAD_L + escAt * xStep} y1={PAD_T} x2={PAD_L + escAt * xStep} y2={PAD_T+iH} stroke="#D97706" strokeWidth="1" strokeDasharray="3,3" />
      {labels.map((l, i) => l && <text key={i} x={PAD_L + i * xStep} y={H-6} fontSize="11" textAnchor="middle" fill="#94A3B8">{l}</text>)}
    </svg>
  );
}

// ── PlayerRangeSelector ───────────────────────────────────────────────────────
function PlayerRangeSelector({ range, setRange, componentId }) {
  const S = HOME_DASHBOARD_STYLES;
  const opts = [
    [KGEnums.DATE_RANGE.LAST_24_HOURS, 'Last 24 hours'],
    [KGEnums.DATE_RANGE.LAST_7_DAYS, 'Last 7 days'],
    [KGEnums.DATE_RANGE.LAST_30_DAYS, 'Last 30 days'],
  ];
  return (
    <div id={componentId} style={S.TAB_CONTAINER}>
      {opts.map(([v, label]) => (
        <button
          id={buildComponentChildId(componentId, v)}
          key={v}
          style={range === v ? S.TAB_BUTTON_ACTIVE() : S.TAB_BUTTON_INACTIVE}
          onClick={() => setRange(v)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ── SpendDepositsCard — DepositActivityCard-style combined chart for a single player ──
function SpendDepositsCard({ player, range, setRange, tall, componentId }) {
  const { spend, dep, labels, escAt, escLabel } = getPlayerChartData(player, range);

  const W = 600, H = tall ? 240 : 180;
  const PAD_L = 36, PAD_B = 24, PAD_T = 10, PAD_R = 8;
  const iW = W - PAD_L - PAD_R;
  const iH = H - PAD_T - PAD_B;

  // Spend line — normalise to min/max range
  const maxSpend = Math.max(...spend);
  const minSpend = Math.min(...spend);
  const spendRng = maxSpend - minSpend || 1;
  const xStep = iW / (spend.length - 1);

  const spendPts = spend.map((v, i) => [
    PAD_L + i * xStep,
    PAD_T + iH - ((v - minSpend) / spendRng) * iH,
  ]);
  const spendLine = spendPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const spendArea = spendLine + ` L${spendPts[spendPts.length - 1][0].toFixed(1)},${PAD_T + iH} L${PAD_L},${PAD_T + iH}Z`;

  // Deposits bars — anchored to baseline, capped at 30% of chart height
  const maxDep = Math.max(...dep, 1);
  const barMaxH = iH * 0.30;
  const barW = Math.max(4, xStep * 0.52);

  // Y-axis grid (spend scale)
  const gridVals = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(minSpend + spendRng * (1 - t)));
  const fmtY = v => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`;

  const rangeLabelMap = { '24h': 'Last 24 hours', '7d': 'Last 7 days', '30d': 'Last 30 days' };
  const sd = player.spendDelta || 0;
  const depositsGrowthPct = Math.round(sd * 0.62);
  const totalDep = dep.reduce((s, d) => s + d, 0);

  // Mini stat card — matches DepositActivityCard's miniCard helper
  const miniCard = (label, value, sub, accentColor) => (
    <div style={{ padding: '10px 12px', borderRadius: 6, background: accentColor ? `${accentColor}08` : '#F8FAFC', border: `1px solid ${accentColor ? accentColor + '20' : '#F1F5F9'}` }}>
      <div style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: accentColor || '#0F172A', fontFamily: "'Roboto Mono', monospace", letterSpacing: '-0.01em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 3 }}>{sub}</div>
    </div>
  );

  return (
    <div id={componentId} style={{ ...cardStyle }}>
      {/* Header — mirrors DepositActivityCard exactly */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
        <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, flexShrink: 0 }}>
          Spend &amp; Deposits · {rangeLabelMap[range]}
        </div>
        <PlayerRangeSelector range={range} setRange={setRange} componentId={buildComponentChildId(componentId, 'range-selector')} />
      </div>

      {/* Mini stat summary — same pattern as DepositActivityCard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
        {miniCard('Total spend', fmtCompact(player.spend, player.brand), `+${sd}% vs prior`, '#0F172A')}
        {miniCard('Deposits', totalDep, `+${depositsGrowthPct}% vs prior`, '#DC2626')}
        {miniCard('Avg deposit', fmtCompact(Math.round(player.spend / Math.max(player.deposits, 1)), player.brand), 'per transaction', null)}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 8 }}>
        {[
          { label: 'Spend', color: '#0F172A', dash: false, isBar: false },
          { label: 'Deposits', color: '#DC2626', dash: false, isBar: true },
        ].map(({ label, color, isBar }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {isBar
              ? <div style={{ width: 10, height: 10, background: color, borderRadius: 2, flexShrink: 0 }} />
              : <div style={{ width: 18, height: 2, background: color, borderRadius: 1, flexShrink: 0 }} />
            }
            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* SVG chart */}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {/* Grid lines */}
        {gridVals.map((v, i) => {
          const y = PAD_T + iH - ((v - minSpend) / spendRng) * iH;
          return (
            <g key={i}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#E2E8F0" strokeWidth="1" />
              <text x={PAD_L - 4} y={y + 4} fontSize="11" textAnchor="end" fill="#94A3B8" fontFamily="'Roboto Mono', monospace">{fmtY(v)}</text>
            </g>
          );
        })}

        {/* Spend: area fill + line + endpoint dot */}
        <path d={spendArea} fill="#0F172A" fillOpacity="0.06" />
        <path d={spendLine} fill="none" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={spendPts[spendPts.length - 1][0]} cy={spendPts[spendPts.length - 1][1]} r="3" fill="#0F172A" stroke="#fff" strokeWidth="1.5" />

        {/* Deposits: bars anchored to baseline */}
        {dep.map((d, i) => d > 0 && (
          <rect key={i}
            x={PAD_L + i * xStep - barW / 2}
            y={PAD_T + iH - (d / maxDep) * barMaxH}
            width={barW} height={(d / maxDep) * barMaxH}
            fill={i > escAt ? '#DC2626' : '#94A3B8'} rx="2" fillOpacity="0.85"
          />
        ))}

        {/* Escalation marker */}
        <line x1={PAD_L + escAt * xStep} y1={PAD_T} x2={PAD_L + escAt * xStep} y2={PAD_T + iH}
          stroke="#D97706" strokeWidth="1" strokeDasharray="3,3" />
        <text x={PAD_L + escAt * xStep + 4} y={PAD_T + 10} fontSize="10" fill="#D97706" fontWeight="600">{escLabel}</text>

        {/* X-axis date labels */}
        {labels.map((l, i) => l && (
          <text key={i} x={PAD_L + i * xStep} y={H - 6} fontSize="11"
            textAnchor={i === 0 ? 'start' : i === spend.length - 1 ? 'end' : 'middle'}
            fill="#94A3B8">{l}</text>
        ))}
      </svg>
    </div>
  );
}

Object.assign(window, {
  PlayerDetail,
  MicroStat,
  BehaviourChart,
  SessionTimingChart,
  ProductDistribution,
  SpendChart,
  DepositsChart,
  PlayerRangeSelector,
  SpendDepositsCard,
});


