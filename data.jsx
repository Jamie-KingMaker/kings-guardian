// Mock data for King's Guard.
// PLAYERS list mirrors what's surfaced on the home dashboard:
//   - Top movers card (5 players, with riskScore from→to deltas)
//   - Attention queue (players with status = outreach/monitor)
//   - Risk signals breakdown (each player carries one or more `signals`)
// IDs, brands, countries and risk levels are kept consistent so the player list
// reads as a drill-down of the dashboard, not a separate dataset.

const PLAYERS = [
  // ===== Top movers (also dashboard-surfaced) =====
  { id: 'BK-4827193', risk: 'high', riskScore: 89, riskFrom: 62, trend: 'up', spend: 1842500, spendDelta: 142,
    deposits: 12, bets: 287, lastActive: '12m ago',
    insight: 'Re-deposited 4× within 1hr after losing session',
    signals: ['Rapid re-deposit', 'Spend spike (>50% w/w)'],
    country: 'NG', brand: 'betking', tier: 9, products: ['Sports', 'Casino'],
    status: 'outreach' },
  { id: 'SS-7283910', risk: 'high', riskScore: 92, riskFrom: 71, trend: 'up', spend: 24300, spendDelta: 215,
    deposits: 14, bets: 412, lastActive: '2h ago',
    insight: '3 deposits in single 18-min session',
    signals: ['Multiple deposits/session', 'Spend spike (>50% w/w)'],
    country: 'ZA', brand: 'supersportbet', tier: 8, products: ['Casino', 'Virtuals'],
    status: 'outreach' },
  { id: 'BK-3918274', risk: 'high', riskScore: 81, riskFrom: 58, trend: 'up', spend: 985000, spendDelta: 98,
    deposits: 9, bets: 156, lastActive: '34m ago',
    insight: 'Deposit frequency up 180% vs prior 7d',
    signals: ['Deposit frequency surge', 'Spend spike (>50% w/w)'],
    country: 'NG', brand: 'betking', tier: 8, products: ['Sports'],
    status: 'monitor' },
  { id: 'BK-5621847', risk: 'medium', riskScore: 61, riskFrom: 41, trend: 'up', spend: 412800, spendDelta: 67,
    deposits: 7, bets: 98, lastActive: '1h ago',
    insight: 'Shift from Sports → Casino (4d trend)',
    signals: ['Sports → Casino shift'],
    country: 'NG', brand: 'betking', tier: 4, products: ['Sports', 'Casino'],
    status: 'monitor' },
  { id: 'SS-9012384', risk: 'medium', riskScore: 53, riskFrom: 38, trend: 'up', spend: 8740, spendDelta: 54,
    deposits: 6, bets: 73, lastActive: '3h ago',
    insight: 'Late-night activity up 4× this week',
    signals: ['Late-night activity shift'],
    country: 'ZA', brand: 'supersportbet', tier: 3, products: ['Sports', 'Virtuals'],
    status: null },

  // ===== Attention-queue (status set, not necessarily on movers list) =====
  { id: 'SS-1928374', risk: 'medium', riskScore: 49, trend: 'up', spend: 6210, spendDelta: 41,
    deposits: 4, bets: 51, lastActive: '6h ago',
    insight: '2 failed deposit attempts last 24h',
    signals: ['Failed deposit attempts'],
    country: 'ZM', brand: 'supersportbet', tier: 2, products: ['Sports'],
    status: 'monitor' },
  { id: 'BK-2847362', risk: 'medium', riskScore: 44, trend: 'stable', spend: 287400, spendDelta: 38,
    deposits: 5, bets: 64, lastActive: '5h ago',
    insight: 'Spend up 38% vs prior 7d',
    signals: ['Spend spike (>50% w/w)'],
    country: 'NG', brand: 'betking', tier: 5, products: ['Sports'],
    status: 'monitor' },
  { id: 'BK-7382910', risk: 'medium', riskScore: 41, trend: 'down', spend: 198400, spendDelta: 22,
    deposits: 4, bets: 47, lastActive: '8h ago',
    insight: 'Bet frequency doubled this week',
    signals: ['Deposit frequency surge'],
    country: 'NG', brand: 'betking', tier: 4, products: ['Sports', 'Casino'],
    status: 'monitor' },

  // ===== Additional high risk =====
  { id: 'BK-9374821', risk: 'high', riskScore: 84, trend: 'up', spend: 762400, spendDelta: 118,
    deposits: 11, bets: 198, lastActive: '47m ago',
    insight: 'Chasing-loss pattern detected (3-day window)',
    signals: ['Rapid re-deposit', 'Late-night activity shift'],
    country: 'NG', brand: 'betking', tier: 9, products: ['Casino'],
    status: 'outreach' },
  { id: 'SS-2647193', risk: 'high', riskScore: 78, trend: 'up', spend: 18900, spendDelta: 87,
    deposits: 10, bets: 244, lastActive: '1h ago',
    insight: 'Deposit limit increased 3× in 14 days',
    signals: ['Deposit frequency surge'],
    country: 'ZA', brand: 'supersportbet', tier: 5, products: ['Sports', 'Casino'],
    status: 'monitor' },
  { id: 'BK-1738294', risk: 'high', riskScore: 76, trend: 'up', spend: 654200, spendDelta: 76,
    deposits: 8, bets: 132, lastActive: '3h ago',
    insight: 'Session length up 240% — 6h avg this week',
    signals: ['Late-night activity shift', 'Spend spike (>50% w/w)'],
    country: 'NG', brand: 'betking', tier: 8, products: ['Casino', 'Virtuals'],
    status: 'outreach' },
  { id: 'SS-4291837', risk: 'high', riskScore: 73, trend: 'up', spend: 14200, spendDelta: 64,
    deposits: 9, bets: 178, lastActive: '5h ago',
    insight: 'Removed deposit limit, spend doubled within 48h',
    signals: ['Spend spike (>50% w/w)', 'Rapid re-deposit'],
    country: 'ZA', brand: 'supersportbet', tier: 5, products: ['Casino'],
    status: 'monitor' },

  // ===== Additional medium =====
  { id: 'BK-8273619', risk: 'medium', riskScore: 58, trend: 'up', spend: 167300, spendDelta: 48,
    deposits: 5, bets: 71, lastActive: '4h ago',
    insight: 'New product cross-over: Sports → Virtuals',
    signals: ['Sports → Casino shift'],
    country: 'NG', brand: 'betking', tier: 4, products: ['Sports', 'Virtuals'],
    status: null },
  { id: 'SS-6182937', risk: 'medium', riskScore: 56, trend: 'up', spend: 7340, spendDelta: 36,
    deposits: 4, bets: 58, lastActive: '7h ago',
    insight: 'Deposit pattern: bursts of 3-4 within 30min',
    signals: ['Multiple deposits/session'],
    country: 'ZA', brand: 'supersportbet', tier: 3, products: ['Sports'],
    status: 'monitor' },
  { id: 'BK-3927461', risk: 'medium', riskScore: 51, trend: 'stable', spend: 124600, spendDelta: 28,
    deposits: 4, bets: 52, lastActive: '9h ago',
    insight: 'Steady increase over rolling 14d',
    signals: ['Spend spike (>50% w/w)'],
    country: 'NG', brand: 'betking', tier: 4, products: ['Sports'],
    status: null },
  { id: 'SS-5183746', risk: 'medium', riskScore: 47, trend: 'up', spend: 5890, spendDelta: 33,
    deposits: 3, bets: 41, lastActive: '11h ago',
    insight: 'First-time Casino activity (was Sports-only)',
    signals: ['Sports → Casino shift'],
    country: 'ZA', brand: 'supersportbet', tier: 3, products: ['Sports', 'Casino'],
    status: null },
  { id: 'BK-4729183', risk: 'medium', riskScore: 45, trend: 'up', spend: 98700, spendDelta: 24,
    deposits: 3, bets: 38, lastActive: '14h ago',
    insight: 'Late-night session detected (02:00–04:00)',
    signals: ['Late-night activity shift'],
    country: 'NG', brand: 'betking', tier: 3, products: ['Casino'],
    status: null },

  // ===== Low risk =====
  { id: 'SS-4738291', risk: 'low', riskScore: 22, trend: 'stable', spend: 3420, spendDelta: 4,
    deposits: 3, bets: 28, lastActive: '1d ago',
    insight: 'Stable engagement, within range',
    signals: [],
    country: 'ZA', brand: 'supersportbet', tier: 4, products: ['Sports'],
    status: null },
  { id: 'BK-1029384', risk: 'low', riskScore: 18, trend: 'down', spend: 87200, spendDelta: -18,
    deposits: 2, bets: 19, lastActive: '1d ago',
    insight: 'Spend trending down vs prior 7d',
    signals: [],
    country: 'NG', brand: 'betking', tier: 3, products: ['Sports'],
    status: null },
  { id: 'BK-6172839', risk: 'low', riskScore: 16, trend: 'stable', spend: 64800, spendDelta: 6,
    deposits: 3, bets: 22, lastActive: '2d ago',
    insight: 'Consistent low-frequency play',
    signals: [],
    country: 'NG', brand: 'betking', tier: 2, products: ['Sports'],
    status: null },
  { id: 'SS-3829104', risk: 'low', riskScore: 14, trend: 'down', spend: 1840, spendDelta: -32,
    deposits: 1, bets: 12, lastActive: '3d ago',
    insight: 'Engagement decreasing',
    signals: [],
    country: 'ZM', brand: 'supersportbet', tier: 2, products: ['Virtuals'],
    status: null },
  { id: 'BK-2918374', risk: 'low', riskScore: 12, trend: 'stable', spend: 42100, spendDelta: 2,
    deposits: 2, bets: 16, lastActive: '2d ago',
    insight: 'Recreational pattern, no flags',
    signals: [],
    country: 'NG', brand: 'betking', tier: 2, products: ['Sports'],
    status: null },
  { id: 'SS-7361928', risk: 'low', riskScore: 10, trend: 'down', spend: 2180, spendDelta: -14,
    deposits: 1, bets: 9, lastActive: '4d ago',
    insight: 'Reduced activity following self-set limit',
    signals: [],
    country: 'ZA', brand: 'supersportbet', tier: 2, products: ['Sports'],
    status: null },
  { id: 'BK-8472913', risk: 'low', riskScore: 8, trend: 'stable', spend: 28400, spendDelta: 1,
    deposits: 1, bets: 11, lastActive: '5d ago',
    insight: 'Stable low-frequency engagement',
    signals: [],
    country: 'NG', brand: 'betking', tier: 1, products: ['Sports'],
    status: null },

  // ===== Interaction-log players (referenced in audit trail, not top movers) =====
  { id: 'BK-5804359', risk: 'high',   riskScore: 77, trend: 'up',     spend: 543200,  spendDelta: 89,
    deposits: 8,  bets: 164, lastActive: '2h ago',
    insight: 'Two missed call attempts; email follow-up sent',
    signals: ['Rapid re-deposit', 'Spend spike (>50% w/w)'],
    country: 'NG', brand: 'betking', tier: 5, products: ['Sports', 'Casino'],
    status: 'outreach' },
  { id: 'BK-9188862', risk: 'high',   riskScore: 82, trend: 'up',     spend: 671000,  spendDelta: 104,
    deposits: 10, bets: 221, lastActive: '1h ago',
    insight: '4.2 h continuous late-night session; cooling-off elected',
    signals: ['Late-night activity shift', 'Spend spike (>50% w/w)'],
    country: 'NG', brand: 'betking', tier: 5, products: ['Casino'],
    status: 'monitor' },
  { id: 'BK-4873494', risk: 'high',   riskScore: 79, trend: 'up',     spend: 498700,  spendDelta: 97,
    deposits: 9,  bets: 183, lastActive: '3h ago',
    insight: 'Declined two outreach attempts; 6 deposits in 4 hours',
    signals: ['Rapid re-deposit', 'Failed deposit attempts'],
    country: 'NG', brand: 'betking', tier: 5, products: ['Sports', 'Casino'],
    status: 'outreach' },
  { id: 'BK-8287974', risk: 'high',   riskScore: 85, trend: 'up',     spend: 892300,  spendDelta: 121,
    deposits: 11, bets: 248, lastActive: '45m ago',
    insight: 'Re-deposited within 5 min of depleting balance × 4 today',
    signals: ['Rapid re-deposit', 'Spend spike (>50% w/w)'],
    country: 'NG', brand: 'betking', tier: 6, products: ['Casino'],
    status: 'outreach' },
  { id: 'BK-9838926', risk: 'high',   riskScore: 77, trend: 'up',     spend: 412500,  spendDelta: 86,
    deposits: 8,  bets: 149, lastActive: '2h ago',
    insight: '5 deposits in 28 min totalling ₦95,000 — record velocity',
    signals: ['Deposit frequency surge', 'Spend spike (>50% w/w)'],
    country: 'NG', brand: 'betking', tier: 4, products: ['Sports'],
    status: 'monitor' },
  { id: 'BK-6735223', risk: 'high',   riskScore: 85, trend: 'up',     spend: 1124000, spendDelta: 133,
    deposits: 13, bets: 309, lastActive: '30m ago',
    insight: 'VIP — 3am session pattern persists despite claimed windfall',
    signals: ['Late-night activity shift', 'Spend spike (>50% w/w)'],
    country: 'NG', brand: 'betking', tier: 6, products: ['Sports', 'Casino'],
    status: 'outreach' },
  { id: 'BK-1736294', risk: 'high',   riskScore: 74, trend: 'up',     spend: 321800,  spendDelta: 72,
    deposits: 7,  bets: 128, lastActive: '4h ago',
    insight: 'Two unanswered outreach calls; voicemail left',
    signals: ['Deposit frequency surge'],
    country: 'NG', brand: 'betking', tier: 4, products: ['Sports'],
    status: 'outreach' },
  { id: 'BK-1769791', risk: 'high',   riskScore: 78, trend: 'up',     spend: 487200,  spendDelta: 91,
    deposits: 9,  bets: 176, lastActive: '1h ago',
    insight: 'Self-set ₦20,000/day deposit limit via app nudge',
    signals: ['Rapid re-deposit', 'Spend spike (>50% w/w)'],
    country: 'NG', brand: 'betking', tier: 5, products: ['Casino'],
    status: 'monitor' },
  { id: 'BK-2398779', risk: 'high',   riskScore: 83, trend: 'up',     spend: 764100,  spendDelta: 115,
    deposits: 11, bets: 237, lastActive: '55m ago',
    insight: '9 failed deposit attempts in 2 h; twice declined RG intervention',
    signals: ['Failed deposit attempts', 'Spend spike (>50% w/w)'],
    country: 'NG', brand: 'betking', tier: 5, products: ['Sports', 'Casino'],
    status: 'outreach' },
  { id: 'BK-7382918', risk: 'high',   riskScore: 74, trend: 'up',     spend: 287600,  spendDelta: 68,
    deposits: 7,  bets: 134, lastActive: '3h ago',
    insight: 'Spend spike: ₦142,000 across 7 transactions in one day',
    signals: ['Spend spike (>50% w/w)', 'Deposit frequency surge'],
    country: 'NG', brand: 'betking', tier: 3, products: ['Sports'],
    status: 'monitor' },
  { id: 'BK-7336219', risk: 'high',   riskScore: 79, trend: 'up',     spend: 398400,  spendDelta: 88,
    deposits: 8,  bets: 162, lastActive: '2h ago',
    insight: 'Persistent chasing-loss signals over rolling 7d',
    signals: ['Loss-chasing pattern', 'Rapid re-deposit'],
    country: 'NG', brand: 'betking', tier: 4, products: ['Sports', 'Casino'],
    status: 'outreach' },
  { id: 'BK-4252587', risk: 'medium', riskScore: 48, trend: 'up',     spend: 112400,  spendDelta: 31,
    deposits: 4,  bets: 67,  lastActive: '6h ago',
    insight: 'Inbound: set ₦30,000/session loss limit; late-night shift flagged',
    signals: ['Late-night activity shift'],
    country: 'NG', brand: 'betking', tier: 3, products: ['Casino'],
    status: null },
  { id: 'BK-7882145', risk: 'medium', riskScore: 42, trend: 'stable', spend: 143700,  spendDelta: 18,
    deposits: 4,  bets: 58,  lastActive: '2d ago',
    insight: 'Self-excluded via product platform; 30-day period active',
    signals: [],
    country: 'NG', brand: 'betking', tier: 3, products: ['Sports'],
    status: null },
  { id: 'BK-3321643', risk: 'medium', riskScore: 52, trend: 'up',     spend: 198300,  spendDelta: 44,
    deposits: 5,  bets: 89,  lastActive: '4h ago',
    insight: '78% of bets shifted to Casino in past 3 days (was Sports-only)',
    signals: ['Sports → Casino shift'],
    country: 'NG', brand: 'betking', tier: 4, products: ['Sports', 'Casino'],
    status: 'monitor' },

  // ===== Unrated (insufficient history) =====
  { id: 'BK-9182734', risk: 'unrated', riskScore: null, trend: null, spend: 12400, spendDelta: null,
    deposits: 1, bets: 4, lastActive: '4d ago',
    insight: 'Insufficient data — 3d history',
    signals: [],
    country: 'NG', brand: 'betking', tier: 1, products: ['Sports'],
    status: null },
  { id: 'SS-2837461', risk: 'unrated', riskScore: null, trend: null, spend: 480, spendDelta: null,
    deposits: 1, bets: 2, lastActive: '6d ago',
    insight: 'New account — 5d history',
    signals: [],
    country: 'ZA', brand: 'supersportbet', tier: 1, products: ['Sports'],
    status: null },
  { id: 'BK-7361825', risk: 'unrated', riskScore: null, trend: null, spend: 8200, spendDelta: null,
    deposits: 1, bets: 3, lastActive: '7d ago',
    insight: 'Returning player — model recalibrating',
    signals: [],
    country: 'NG', brand: 'betking', tier: 1, products: ['Sports'],
    status: null },
];

 const AGENTS = [
  { id: 'amaka-n', label: 'Amaka N.', initials: 'AN', kind: 'agent', selectable: true },
  { id: 'james-t', label: 'James T.', initials: 'JT', kind: 'agent', selectable: true },
  { id: 'sarah-o', label: 'Sarah O.', initials: 'SO', kind: 'agent', selectable: true },
  { id: 'chidi-e', label: 'Chidi E.', initials: 'CE', kind: 'agent', selectable: true },
  { id: 'system', label: 'System', initials: '⚙', kind: 'system', selectable: false },
];

const AGENT_MAP = AGENTS.reduce((acc, agent) => {
  acc[agent.id] = agent;
  return acc;
}, {});

// ===== Date-range-aware data generator =====
// Returns coherent mock data sized & shaped for the chosen window.

// Monthly active users by market (mock baseline) — irregular figures
// matching how real measurements come out, not round 900k/400k/100k.
const MAU = {
  betking:       { NG: 883718 },
  supersportbet: { ZA: 392446, ZM:  97812 },
};
const MAU_TOTALS = {
  betking:       883718,
  supersportbet: 490258,
  all:          1373976,
};

// Risk-population shares (per-market % of MAU). Every MAU gets classified —
// the four buckets sum to 1.0 so the total monitored = MAU.
// High ~0.6%, Medium ~3.5%, Low ~93%, Unrated ~3% (no monitoring history yet)
const RISK_SHARE = { high: 0.006, med: 0.035, low: 0.929, unrated: 0.030 };

// Deposit ARPU per month (NGN for BetKing, ZAR for SuperSportBet)
const MONTHLY_ARPU = {
  betking:       11500, // NGN per MAU per month
  supersportbet: 165,   // ZAR per MAU per month (blended ZA+ZM)
};

function mauForBrand(brandKey) {
  if (brandKey === 'betking' || brandKey === 'supersportbet') return MAU_TOTALS[brandKey];
  return MAU_TOTALS.all;
}

function buildBaseDist(brandKey) {
  const mau = mauForBrand(brandKey);
  return {
    high:    Math.round(mau * RISK_SHARE.high),
    med:     Math.round(mau * RISK_SHARE.med),
    low:     Math.round(mau * RISK_SHARE.low),
    unrated: Math.round(mau * RISK_SHARE.unrated),
  };
}

// activeMul = active-base multiplier vs MAU baseline (30d window).
//   7d  ≈ 0.55 — weekly actives are ~55% of monthly actives (typical retention curve)
//   14d ≈ 0.78
//   30d  = 1.00 — the MAU definition
//   90d ≈ 1.42 — quarterly actives (broader coverage of returning users)
//   ytd ≈ 1.68 — year-to-date actives (May 5 → ~125 days)
// activeUnit / activeUnitFull = the metric label that fits the window.
const RANGE_CONFIG = {
  '7d':  { days: 7,   label: '7 days',       pointStep: 1, distMul: 1.00, depositMul: 0.25,  activeMul: 0.55, activeUnit: 'WAU',  activeUnitFull: 'weekly active users',     deltaLabel: 'vs prior 7d',     refreshLabel: 'daily',  trendStart: 0.95, trendGrowth: 0.23 },
  '14d': { days: 14,  label: '14 days',      pointStep: 2, distMul: 1.00, depositMul: 0.50,  activeMul: 0.78, activeUnit: '14dAU', activeUnitFull: '14-day active users',    deltaLabel: 'vs prior 14d',    refreshLabel: 'daily',  trendStart: 0.92, trendGrowth: 0.40 },
  '30d': { days: 30,  label: '30 days',      pointStep: 3, distMul: 1.00, depositMul: 1.05,  activeMul: 1.00, activeUnit: 'MAU',  activeUnitFull: 'monthly active users',    deltaLabel: 'vs prior 30d',    refreshLabel: 'daily',  trendStart: 0.85, trendGrowth: 0.81 },
  '90d': { days: 90,  label: '90 days',      pointStep: 7, distMul: 1.00, depositMul: 3.06,  activeMul: 1.42, activeUnit: 'QAU',  activeUnitFull: 'quarterly active users',  deltaLabel: 'vs prior 90d',    refreshLabel: 'weekly', trendStart: 0.70, trendGrowth: 1.30 },
  'ytd': { days: 124, label: 'year to date', pointStep: 10,distMul: 1.00, depositMul: 4.22,  activeMul: 1.68, activeUnit: 'YTD',  activeUnitFull: 'year-to-date active users', deltaLabel: 'vs prior period', refreshLabel: 'weekly', trendStart: 0.62, trendGrowth: 1.80 },
};

// Deterministic pseudo-random
function seeded(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function buildRangeData(rangeKey, brandKey) {
  const cfg = RANGE_CONFIG[rangeKey] || RANGE_CONFIG['7d'];
  const rnd = seeded(rangeKey.charCodeAt(0) * 17 + (brandKey || '').length);

  // Brand-scoped MAU + distribution.
  // mauBase is the 30-day MAU baseline; mau is the active-base for THIS window.
  const mauBase = mauForBrand(brandKey);
  const mau = Math.round(mauBase * cfg.activeMul);
  const baseDist = buildBaseDist(brandKey);
  // Risk buckets sum to the active base (mau), so they scale with activeMul too.
  const dist = {
    high:    Math.round(baseDist.high    * cfg.distMul * cfg.activeMul),
    med:     Math.round(baseDist.med     * cfg.distMul * cfg.activeMul),
    low:     Math.round(baseDist.low     * cfg.distMul * cfg.activeMul),
    unrated: Math.round(baseDist.unrated * cfg.distMul * cfg.activeMul),
  };

  // Deposit totals scaled from monthly ARPU
  const depositTotal   = Math.round(MAU_TOTALS.betking       * MONTHLY_ARPU.betking       * cfg.depositMul);
  const depositTotalSS = Math.round(MAU_TOTALS.supersportbet * MONTHLY_ARPU.supersportbet * cfg.depositMul);

  // Risk-distribution trend, sized to range with ~8 points
  const numPoints = Math.min(Math.max(Math.ceil(cfg.days / cfg.pointStep), 6), 14);
  const today = new Date(2026, 4, 5); // May 5
  const monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmtDate = (d) => `${monthShort[d.getMonth()]} ${String(d.getDate()).padStart(2,'0')}`;

  // Risk-distribution trend with real customer migration between buckets.
  // High-risk grows over the period (the headline story). Medium oscillates
  // — players migrate down from high (cooling off) AND up from low (warming up),
  // so the bucket sees both inflow + outflow turbulence. Low erodes as
  // engagement creeps up. Total monitored stays roughly flat (same population
  // reclassifying). We build per-period "migration impulses" so the lines
  // actually move against each other instead of all rising together.
  const trend = [];
  const endHigh = dist.high;
  const endMed  = dist.med;
  const endLow  = dist.low;
  const startHigh = Math.round(endHigh * cfg.trendStart);
  const startMed  = Math.round(endMed * 1.06);   // medium was higher, has shed players upward
  // Conserve total: startLow absorbs what High and Med gained, keeping stacked total == current total
  const startLow  = (endHigh + endMed + endLow) - startHigh - startMed;

  // Migration impulses — discrete events where players move between buckets.
  // Each impulse is { atT: 0..1, fromBucket, toBucket, magnitude (fraction of bucket) }
  // We seed a handful so the chart shows visible "pulses" of movement.
  const impulses = [
    { atT: 0.15, from: 'low',  to: 'med',  mag: 0.04 }, // recreational players warming up
    { atT: 0.28, from: 'med',  to: 'high', mag: 0.05 }, // first wave escalates
    { atT: 0.42, from: 'high', to: 'med',  mag: 0.03 }, // some cool down (outreach worked)
    { atT: 0.55, from: 'low',  to: 'med',  mag: 0.05 }, // weekend warm-up
    { atT: 0.70, from: 'med',  to: 'high', mag: 0.06 }, // bigger escalation wave
    { atT: 0.85, from: 'med',  to: 'low',  mag: 0.03 }, // some self-correct
    { atT: 0.92, from: 'low',  to: 'med',  mag: 0.04 }, // late-window churn
  ];

  // Evaluate all three buckets together so migrations conserve the total population.
  // Each impulse uses the FROM bucket's reference size for both sides of the transfer,
  // ensuring every player moved out of one bucket is moved into another.
  const starts = { high: startHigh, med: startMed, low: startLow };
  const ends   = { high: endHigh,   med: endMed,   low: endLow };

  const evalPoint = (t) => {
    const eased = t * t * (3 - 2 * t);
    const v = {
      high: starts.high + (ends.high - starts.high) * eased,
      med:  starts.med  + (ends.med  - starts.med)  * eased,
      low:  starts.low  + (ends.low  - starts.low)  * eased,
    };
    for (const imp of impulses) {
      const sigma = 0.07;
      const bump = Math.exp(-Math.pow((t - imp.atT) / sigma, 2));
      // Use FROM bucket's scale so delta is identical on both sides
      const refSize = Math.max(starts[imp.from], ends[imp.from], 1);
      const delta = imp.mag * refSize * bump;
      v[imp.from] -= delta;
      v[imp.to]   += delta;
    }
    // Tiny symmetric jitter: shift between low↔med only (keeps total constant)
    const jitter = (rnd() - 0.5) * 0.002 * Math.max(starts.med, ends.med);
    v.low -= jitter;
    v.med += jitter;
    return {
      high: Math.max(0, Math.round(v.high)),
      med:  Math.max(0, Math.round(v.med)),
      low:  Math.max(0, Math.round(v.low)),
    };
  };

  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const d = new Date(today);
    d.setDate(today.getDate() - Math.round((1 - t) * cfg.days));
    trend.push({ d: fmtDate(d), ...evalPoint(t) });
  }
  // Force final point to land exactly on the live distribution
  trend[trend.length - 1] = {
    d: trend[trend.length - 1].d,
    high: endHigh, med: endMed, low: endLow,
  };

  // Deposit bars — one per day in range, with realistic sports-betting cadence.
  // Weekend pattern: Sat (busiest, all-day football) > Fri > Sun > Thu > Wed > Tue > Mon.
  // UCL knockout-round match nights spike Tue/Wed above the weekend floor.
  //
  // Today in data = May 5 2026 = Tuesday (dow 2).
  // UCL 2025-26 knockout nights (days ago from May 5):
  //   SF 2nd legs  : May 5 Tue (0)
  //   SF 1st legs  : Apr 29 Wed (6),  Apr 28 Tue (7)
  //   QF 2nd legs  : Apr 8  Wed (27), Apr 7  Tue (28)
  //   QF 1st legs  : Apr 1  Wed (34), Mar 31 Tue (35)
  //   R16 2nd legs : Mar 11 Wed (55), Mar 10 Tue (56)
  //   R16 1st legs : Mar 4  Wed (62), Mar 3  Tue (63)
  const DOW_MUL     = [1.20, 0.65, 0.75, 0.78, 0.88, 1.35, 1.60]; // Sun Mon Tue Wed Thu Fri Sat
  const TODAY_DOW   = 2; // Tuesday
  const UCL_DAYS    = new Set([0, 6, 7, 27, 28, 34, 35, 55, 56, 62, 63]);
  const numBars = cfg.days;
  const deposits = [];
  for (let i = 0; i < numBars; i++) {
    const daysAgo  = numBars - 1 - i;
    const dow      = ((TODAY_DOW - daysAgo) % 7 + 7) % 7;
    const t        = i / (numBars - 1 || 1);
    const base     = 38 + t * 65;                                          // gentle upward trend
    const shaped   = base * DOW_MUL[dow];                                  // day-of-week shape
    const uclBoost = UCL_DAYS.has(daysAgo) && (dow === 2 || dow === 3)     // UCL match-night spike
                     ? base * 0.55 : 0;
    const wobble   = (rnd() - 0.5) * 6;                                    // small deterministic noise
    deposits.push(Math.max(15, Math.round(shaped + uclBoost + wobble)));
  }

  // Top movers — pulled directly from PLAYERS list so the dashboard
  // and player list reference the exact same records.
  const moverScale = rangeKey === '7d' ? 1 : rangeKey === '14d' ? 1.2 : rangeKey === '30d' ? 1.5 : rangeKey === '90d' ? 1.9 : 2.2;
  // fromScore overrides for players missing a riskFrom on their record
  const MOVER_FROM = {
    'BK-4827193': 62, 'SS-7283910': 71, 'BK-3918274': 58,
    'BK-9374821': 65, 'BK-5621847': 41, 'SS-2647193': 55,
    'BK-1738294': 52, 'SS-9012384': 38, 'BK-2847362': 33,
  };
  const movers = [
    'BK-4827193', 'SS-7283910', 'BK-3918274',
    'BK-9374821', 'BK-5621847', 'SS-2647193',
    'BK-1738294', 'SS-9012384', 'BK-2847362',
  ]
    .map(id => PLAYERS.find(p => p.id === id))
    .filter(Boolean)
    .map(p => {
      const from = MOVER_FROM[p.id] ?? (p.riskFrom || 0);
      const baseDelta = (p.riskScore || 0) - from;
      const delta = Math.round(baseDelta * moverScale);
      return {
        id: p.id, brand: p.brand, country: p.country, risk: p.risk,
        from, to: Math.min(99, from + delta),
        delta, signals: p.signals || [],
      };
    });

  // RG tool adoption — scales with MAU and window
  const rgScale = (mau / 1000000) * cfg.depositMul;
  const RG_TOOL_DEFS = [
    { tool: 'Deposit Limits',   base: 33000, deltaBase: 18, color: '#0891B2', startFrac: 0.74, noise: 0.05, spikes: [0.58] },
    { tool: '24-Hour Cool-Off', base: 16500, deltaBase: 24, color: '#DB2777', startFrac: 0.68, noise: 0.13, spikes: [0.30, 0.72] },
    { tool: 'Account Closure',  base: 8250,  deltaBase: 6,  color: '#F59E0B', startFrac: 0.91, noise: 0.09, spikes: [0.85] },
  ];

  // Self-Exclusion: sharp step-change from April 18 onwards (18 days ago).
  // Pre-spike: low flat baseline (~45% of current). Post-spike: elevated (~85→100%).
  // For short ranges entirely within the post-spike window (7d, 14d), show the
  // already-elevated plateau so the stat card still reflects the jump.
  const SELF_EX_SPIKE_DAYS_AGO = 18; // April 18 2026
  const selfExCount = Math.max(1, Math.round(41200 * rgScale));
  const selfExDelta = 11 + (rangeKey === '90d' || rangeKey === 'ytd' ? 5 : 0);
  const tSpike = 1 - SELF_EX_SPIKE_DAYS_AGO / cfg.days; // 0-1 position of Apr 18 in this range
  const selfExTrend = [];
  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1 || 1);
    const d = new Date(today);
    d.setDate(today.getDate() - Math.round((1 - t) * cfg.days));
    let v;
    if (tSpike <= 0) {
      // Whole range is post-spike — show slightly elevated plateau rising to count
      v = selfExCount * (0.91 + 0.09 * t);
    } else if (t < tSpike) {
      // Pre-spike: gently drifting low baseline
      v = selfExCount * (0.44 + 0.07 * (t / tSpike));
    } else {
      // Post-spike: rapid rise from 82% → 100%
      const postT = (t - tSpike) / (1 - tSpike || 0.001);
      v = selfExCount * (0.82 + 0.18 * postT);
    }
    const noise = (rnd() - 0.5) * selfExCount * 0.03;
    selfExTrend.push({ d: fmtDate(d), v: Math.max(1, Math.round(v + noise)) });
  }
  selfExTrend[selfExTrend.length - 1].v = selfExCount;

  const rgAdoption = [
    { tool: 'Self-Exclusion', count: selfExCount, delta: selfExDelta, color: '#6366F1', trend: selfExTrend },
    ...RG_TOOL_DEFS.map(toolDef => {
      const count = Math.max(1, Math.round(toolDef.base * rgScale));
      const delta = toolDef.deltaBase + (rangeKey === '90d' || rangeKey === 'ytd' ? 5 : 0);
      const trend = [];
      for (let i = 0; i < numPoints; i++) {
        const t = i / (numPoints - 1 || 1);
        const eased = t * t * (3 - 2 * t);
        const base = count * (toolDef.startFrac + (1 - toolDef.startFrac) * eased);
        const spike = toolDef.spikes.reduce((acc, sp) => {
          const dist = Math.abs(t - sp);
          return acc + (dist < 1.2 / numPoints ? count * 0.20 * (1 - dist * numPoints / 1.2) : 0);
        }, 0);
        const noise = (rnd() - 0.5) * count * toolDef.noise;
        const d = new Date(today);
        d.setDate(today.getDate() - Math.round((1 - t) * cfg.days));
        trend.push({ d: fmtDate(d), v: Math.max(1, Math.round(base + spike + noise)) });
      }
      trend[trend.length - 1].v = count;
      return { tool: toolDef.tool, count, delta, color: toolDef.color, trend };
    }),
  ];

  // Risk signals — proportional to high+med population
  const signalScale = (dist.high + dist.med) / 2631; // 2631 = baseline all-brand 7d (high+med)
  const signals = [
    { label: 'Spend spike (>50% w/w)',     base: 142, color: '#DC2626' },
    { label: 'Rapid re-deposit',           base: 87,  color: '#DC2626' },
    { label: 'Loss-chasing pattern',       base: 71,  color: '#DC2626' },
    { label: 'Deposit frequency surge',    base: 68,  color: '#D97706' },
    { label: 'Multiple deposits/session',  base: 54,  color: '#D97706' },
    { label: 'Failed deposit attempts',    base: 41,  color: '#D97706' },
    { label: 'Late-night activity shift',  base: 38,  color: '#D97706' },
    { label: 'Sports → Casino shift',      base: 29,  color: '#D97706' },
    { label: 'Session length spike',       base: 22,  color: '#D97706' },
    { label: 'Withdrawal reversal',        base: 16,  color: '#D97706' },
  ].map(s => ({ label: s.label, color: s.color, count: Math.max(1, Math.round(s.base * signalScale)) }));

  // Stat-card deltas (vs yesterday on 7d, vs prior period on longer windows)
  const dailyVs = rangeKey === '7d' ? 'vs yesterday' : 'vs prior period';
  const dHigh = Math.round(dist.high * (rangeKey === '7d' ? 0.025 : rangeKey === '14d' ? 0.06 : rangeKey === '30d' ? 0.18 : rangeKey === '90d' ? 0.34 : 0.42));
  const dMed  = Math.round(dist.med  * (rangeKey === '7d' ? 0.018 : rangeKey === '14d' ? 0.06 : rangeKey === '30d' ? 0.20 : rangeKey === '90d' ? 0.30 : 0.36));
  const dLow  = Math.round(dist.low  * (rangeKey === '7d' ? 0.003 : rangeKey === '14d' ? 0.010 : rangeKey === '30d' ? 0.022 : rangeKey === '90d' ? 0.13 : 0.17));
  const sign = (n, dir) => `${dir === 'down' ? '−' : '+'}${n.toLocaleString()}`;
  const statDeltas = {
    high: sign(dHigh, 'up'),
    med:  sign(dMed,  'up'),
    low:  rangeKey === '7d' || rangeKey === '14d' || rangeKey === '30d' ? sign(dLow, 'down') : sign(dLow, 'up'),
    dailyVs,
  };

  // Deposit % vs prior
  const depositGrowth = rangeKey === '7d' ? 14.2 : rangeKey === '14d' ? 17.8 : rangeKey === '30d' ? 24.6 : rangeKey === '90d' ? 38.4 : 47.2;

  return {
    rangeKey,
    rangeLabel: cfg.label,
    trendGrowthPct: Math.round(cfg.trendGrowth * 100),
    deltaLabel: cfg.deltaLabel,
    refreshLabel: cfg.refreshLabel,
    mau,
    mauBase,
    activeUnit: cfg.activeUnit,
    activeUnitFull: cfg.activeUnitFull,
    dist,
    depositTotal,
    depositTotalSS,
    depositGrowth,
    trend,
    deposits,
    movers,
    rgAdoption,
    signals,
    statDeltas,
  };
}

// ===== Full population synthesizer =====
// PLAYERS holds ~28 hand-crafted records (top movers, attention queue, named cases).
// The full risk universe is FAR larger — buildRangeData() returns counts in the
// thousands per bucket. We synthesize the rest of the list deterministically so
// the player list can show every player across high / medium / low / unrated.
//
// Strategy:
//   - Hand-crafted records are pinned to the top of every bucket
//   - Synthetic records fill the remainder of each bucket up to the dashboard count
//   - All synthetic records are generated deterministically from a seed, so paging
//     is stable and the same record appears in the same place every render

const SIGNAL_LIBRARY = [
  'Spend spike (>50% w/w)', 'Rapid re-deposit', 'Deposit frequency surge',
  'Multiple deposits/session', 'Failed deposit attempts',
  'Late-night activity shift', 'Sports → Casino shift',
];

const INSIGHT_LIBRARY = {
  high: [
    'Spend up sharply vs prior period',
    'Multiple re-deposits within session',
    'Removed deposit limit, activity surged',
    'Late-night sessions extending past 3 hours',
    'Deposit frequency 3× baseline',
    'Cross-product migration with rising stakes',
    'Velocity exceeds 95th percentile peer cohort',
    'Failed deposit attempts followed by retries',
  ],
  medium: [
    'Modest spend increase, watching trajectory',
    'Bet frequency rising vs 28-day baseline',
    'Casino exposure trending up',
    'Session length growing week-over-week',
    'New deposit method added recently',
    'Off-hours activity modestly elevated',
    'Cross-product activity expanding',
  ],
  low: [
    'Stable engagement within range',
    'Recreational pattern, no flags',
    'Trending down vs prior period',
    'Consistent low-frequency play',
    'Reduced activity following self-set limit',
    'Cooled off after session reminder',
    'Below cohort average on all signals',
  ],
  unrated: [
    'Insufficient history — model recalibrating',
    'New account — under 7 days observed',
    'Returning player — fresh observation window',
    'KYC complete, behaviour baseline pending',
  ],
};

const COUNTRIES_BY_BRAND = {
  betking: ['NG'],
  supersportbet: ['ZA', 'ZA', 'ZA', 'ZA', 'ZM'], // ZA-weighted (392k vs 97k)
};

const PRODUCTS_LIBRARY = [
  ['Sports'], ['Sports'], ['Sports'], ['Sports', 'Casino'], ['Casino'],
  ['Sports', 'Virtuals'], ['Casino', 'Virtuals'], ['Sports', 'Casino', 'Virtuals'],
];

const TRENDS = { high: ['up','up','up','up','stable'], medium: ['up','up','stable','stable','down'], low: ['stable','stable','down','down','up'], unrated: [null] };

// Generate a synthetic player at index i within bucket+brand
function synthPlayer(brandKey, bucket, i, seed) {
  const rnd = seeded(seed + i * 31);
  const idPrefix = brandKey === 'betking' ? 'BK' : 'SS';
  const idNum = 1000000 + Math.floor(rnd() * 8999999);
  const country = COUNTRIES_BY_BRAND[brandKey][Math.floor(rnd() * COUNTRIES_BY_BRAND[brandKey].length)];

  const score = bucket === 'high' ? Math.floor(70 + rnd() * 30)
              : bucket === 'medium' ? Math.floor(40 + rnd() * 30)
              : bucket === 'low' ? Math.floor(5 + rnd() * 35)
              : null;

  const trend = TRENDS[bucket][Math.floor(rnd() * TRENDS[bucket].length)];

  // Spend by brand (NGN vs ZAR scale)
  const baseSpend = brandKey === 'betking' ? 1 : 0.014; // ~71x ratio NGN:ZAR
  const spendByBucket = bucket === 'high' ? 400000 + rnd() * 1500000
                      : bucket === 'medium' ? 80000 + rnd() * 350000
                      : bucket === 'low' ? 5000 + rnd() * 95000
                      : 1000 + rnd() * 20000;
  const spend = Math.round(spendByBucket * baseSpend);

  const spendDelta = bucket === 'high' ? Math.floor(50 + rnd() * 180)
                   : bucket === 'medium' ? Math.floor(15 + rnd() * 50)
                   : bucket === 'low' ? Math.floor(-30 + rnd() * 25)
                   : null;

  const deposits = bucket === 'high' ? Math.floor(6 + rnd() * 12)
                 : bucket === 'medium' ? Math.floor(3 + rnd() * 5)
                 : bucket === 'low' ? Math.floor(1 + rnd() * 4)
                 : Math.floor(1 + rnd() * 2);

  const bets = bucket === 'high' ? Math.floor(80 + rnd() * 350)
             : bucket === 'medium' ? Math.floor(30 + rnd() * 80)
             : bucket === 'low' ? Math.floor(5 + rnd() * 40)
             : Math.floor(2 + rnd() * 8);

  // Last-active distribution by bucket
  const lastActiveOptions = bucket === 'high' ? ['12m ago','34m ago','1h ago','2h ago','3h ago','5h ago']
                          : bucket === 'medium' ? ['1h ago','3h ago','5h ago','8h ago','12h ago','18h ago']
                          : bucket === 'low' ? ['1d ago','2d ago','3d ago','4d ago','5d ago']
                          : ['4d ago','5d ago','6d ago','7d ago'];
  const lastActive = lastActiveOptions[Math.floor(rnd() * lastActiveOptions.length)];

  // Signals — high gets 1-3, medium gets 0-2, low/unrated none
  const numSignals = bucket === 'high' ? 1 + Math.floor(rnd() * 3)
                   : bucket === 'medium' ? Math.floor(rnd() * 3)
                   : 0;
  const signals = [];
  const used = new Set();
  for (let s = 0; s < numSignals; s++) {
    const idx = Math.floor(rnd() * SIGNAL_LIBRARY.length);
    if (!used.has(idx)) {
      used.add(idx);
      signals.push(SIGNAL_LIBRARY[idx]);
    }
  }

  const insightArr = INSIGHT_LIBRARY[bucket];
  const insight = insightArr[Math.floor(rnd() * insightArr.length)];

  const products = PRODUCTS_LIBRARY[Math.floor(rnd() * PRODUCTS_LIBRARY.length)];

  // Status — high has ~30% chance of outreach/monitor, medium ~10%, others none
  let status = null;
  if (bucket === 'high') {
    const r = rnd();
    status = r < 0.18 ? 'outreach' : r < 0.45 ? 'monitor' : null;
  } else if (bucket === 'medium') {
    status = rnd() < 0.10 ? 'monitor' : null;
  }

  // Tiers 1-9: 1=lowest stake, 9=VIP
  const tier = bucket === 'high'   ? 5 + Math.floor(rnd() * 5)              // 5-9
             : bucket === 'medium' ? 3 + Math.floor(rnd() * 4)              // 3-6
             : bucket === 'low'    ? 1 + Math.floor(rnd() * 4)              // 1-4
             : 1 + Math.floor(rnd() * 2);                                   // 1-2 (unrated)

  return {
    id: `${idPrefix}-${idNum}`,
    risk: bucket,
    riskScore: score,
    trend,
    spend,
    spendDelta,
    deposits,
    bets,
    lastActive,
    insight,
    signals,
    country,
    brand: brandKey,
    tier,
    products,
    status,
    synthetic: true,
  };
}

// Bucket counts per brand at the active-base for the given range.
// These line up with what buildRangeData() shows on the dashboard.
function bucketCountsForBrand(brandKey, rangeKey) {
  const cfg = RANGE_CONFIG[rangeKey] || RANGE_CONFIG['7d'];
  const baseDist = buildBaseDist(brandKey);
  return {
    high:    Math.round(baseDist.high    * cfg.activeMul),
    medium:  Math.round(baseDist.med     * cfg.activeMul),
    low:     Math.round(baseDist.low     * cfg.activeMul),
    unrated: Math.round(baseDist.unrated * cfg.activeMul),
  };
}

// Hand-crafted PLAYERS, partitioned by brand+bucket (so we can pin them at the top)
function pinnedByBrandBucket(brandKey, bucket) {
  return PLAYERS.filter(p => p.brand === brandKey && p.risk === bucket);
}

// Returns a *virtual* list — has length, supports get(i) and slice(start, end).
// Synthetic rows are generated lazily so we never materialize 800k objects.
function getPlayerPopulation(brandKey, rangeKey) {
  const brands = brandKey === 'all' ? ['betking', 'supersportbet'] : [brandKey];
  const buckets = ['high', 'medium', 'low', 'unrated'];

  // Build segment table: each segment is { brand, bucket, pinned: [...], synthCount, total }
  const segments = [];
  for (const b of buckets) {
    for (const br of brands) {
      const counts = bucketCountsForBrand(br, rangeKey);
      const pinned = pinnedByBrandBucket(br, b);
      const total = counts[b];
      const synthCount = Math.max(0, total - pinned.length);
      segments.push({ brand: br, bucket: b, pinned, synthCount, total });
    }
  }

  // Cumulative offsets for index→segment lookup
  let cum = 0;
  const offsets = segments.map(s => {
    const start = cum;
    cum += s.pinned.length + s.synthCount;
    return { start, end: cum, seg: s };
  });
  const length = cum;

  // Cache synthetic records by (brand, bucket, i)
  const cache = new Map();

  function get(i) {
    for (const o of offsets) {
      if (i < o.end) {
        const localIdx = i - o.start;
        if (localIdx < o.seg.pinned.length) return o.seg.pinned[localIdx];
        const synthIdx = localIdx - o.seg.pinned.length;
        const cacheKey = `${o.seg.brand}|${o.seg.bucket}|${synthIdx}`;
        if (!cache.has(cacheKey)) {
          // Seed includes brand+bucket+rangeKey so synthetic IDs are stable
          const seed = (o.seg.brand.charCodeAt(0) * 7919 + o.seg.bucket.charCodeAt(0) * 31 + rangeKey.charCodeAt(0)) * 100000 + synthIdx;
          cache.set(cacheKey, synthPlayer(o.seg.brand, o.seg.bucket, synthIdx, seed));
        }
        return cache.get(cacheKey);
      }
    }
    return null;
  }

  function slice(start, end) {
    const out = [];
    for (let i = start; i < Math.min(end, length); i++) out.push(get(i));
    return out;
  }

  function bucketCounts() {
    const out = { high: 0, medium: 0, low: 0, unrated: 0 };
    for (const s of segments) out[s.bucket] += s.total;
    return out;
  }

  return { length, get, slice, segments, bucketCounts };
}

window.KGData = { PLAYERS, AGENTS, AGENT_MAP, buildRangeData, RANGE_CONFIG, MAU, MAU_TOTALS, getPlayerPopulation, bucketCountsForBrand };
