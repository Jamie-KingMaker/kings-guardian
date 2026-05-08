// Shared constants and helpers for Player Detail components.

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

// Tiny seeded RNG — mirrors data.jsx so charts are stable per player.
function pdSeeded(seed) {
  let s = seed | 0;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function playerSeed(id) {
  return id.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 7);
}

function generatePlayerInsights(player) {
  const { signals = [], insight, spendDelta, riskScore, spend, deposits, brand } = player;
  const cur = fmtCompact(spend, brand);
  const prev = fmtCompact(Math.round(spend / (1 + (spendDelta || 0) / 100)), brand);
  const out = [];

  if (signals.includes('Rapid re-deposit')) {
    out.push({ sev: 'high', title: 'Rapid re-deposit pattern', detail: 'Player re-deposited within minutes of depleting session balance on multiple occasions. Average re-deposit window within high-risk criteria.', time: '2h ago' });
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

function generateInteractionLog(player) {
  const rnd = pdSeeded(playerSeed(player.id) + 99);
  const agents = ['Amara Okafor', 'Chioma Eze', 'Emeka Nwosu', 'Fatima Al-Hassan', 'Ngozi Adeyemi'];
  const agent = agents[Math.floor(rnd() * agents.length)];
  const agent2 = agents[Math.floor(rnd() * agents.length)];

  const entries = [];
  const now = Date.now();
  const day = 86400000;

  entries.push({
    type: 'auto',
    title: 'Automated risk flag triggered',
    detail: 'Risk model score crossed the 70-point threshold. Player automatically added to the high-risk monitoring queue.',
    agent: "King's Guard AI",
    time: new Date(now - Math.floor(7 + rnd() * 5) * day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    badge: 'System',
    badgeColor: '#475569',
  });

  if ((player.signals || []).includes('Rapid re-deposit')) {
    entries.push({
      type: 'flag',
      title: 'Rapid re-deposit signal triggered',
      detail: 'Behavioural model detected multiple re-deposit events within 10 minutes of session loss. Signal elevated to high severity.',
      agent: "King's Guard AI",
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
      agent: "King's Guard AI",
      time: new Date(now - Math.floor(4 + rnd() * 2) * day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      badge: 'Signal',
      badgeColor: '#DC2626',
    });
  }

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
        detail: 'RG information email sent to registered address. Included deposit limit guidance and self-exclusion pathway.',
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

  entries.push({
    type: 'note',
    title: 'Case note added',
    detail: 'Player has shown consistent escalation pattern over the 7-day window. Deposit velocity and session frequency are primary model drivers. No player contact established yet.',
    agent,
    time: `${new Date(now - Math.floor(rnd() * 18) * 3600000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} today`,
    badge: 'Note',
    badgeColor: '#64748B',
  });

  return entries;
}

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
    const esc = i > escAt ? (i - escAt) * (escSlope + rnd() * 20) : 0;
    return Math.max(10, (base + esc + (rnd() - 0.5) * 8) * scale);
  });

  const dep = Array.from({ length: n }, (_, i) => (
    rnd() < (i > escAt ? depFreq * 2 : depFreq) ? 1 + Math.floor(rnd() * 3) : 0
  ));

  let labels;
  if (range === '24h') {
    labels = Array.from({ length: n }, (_, i) => (i % 6 === 0 ? `${String(i).padStart(2, '0')}:00` : ''));
  } else if (range === '7d') {
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  } else {
    labels = Array.from({ length: n }, (_, i) => (
      i === 0 ? '30d ago' : i === 7 ? 'D-22' : i === 14 ? 'D-15' : i === 21 ? 'D-8' : i === 29 ? 'Today' : ''
    ));
  }

  const escLabel = range === '24h' ? 'Risk spike' : 'Risk score: med → high';
  return { spend, dep, labels, escAt, escLabel };
}

Object.assign(window, {
  useStatePD,
  PLAYER_DETAIL_TAB,
  PLAYER_DETAIL_TAB_BUTTON_IDS,
  PLAYER_DETAIL_STAT_KEY,
  buildComponentChildId,
  pdSeeded,
  playerSeed,
  generatePlayerInsights,
  generateInteractionLog,
  getPlayerChartData,
});

