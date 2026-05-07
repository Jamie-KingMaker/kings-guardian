// Mock data for King's Guard.
// PLAYERS list mirrors what's surfaced on the home dashboard:
//   - Top movers card (5 players, with riskScore from→to deltas)
//   - Attention queue (players with status = outreach/monitor)
//   - Risk signals breakdown (each player carries one or more `signals`)
// IDs, brands, countries and risk levels are kept consistent so the player list
// reads as a drill-down of the dashboard, not a separate dataset.

const { KGEnums, KGConstants } = window;

// Range key constants — single source of truth for date ranges
const RANGE_24H = KGConstants.DATE_RANGE_24H;
const RANGE_7D  = KGConstants.DATE_RANGE_7D;
const RANGE_30D = KGConstants.DATE_RANGE_30D;

const PLAYERS = [
  // ===== Top movers (also dashboard-surfaced) =====
  { id: 'BK-4827193', risk: KGEnums.RISK.HIGH, riskScore: 89, riskFrom: 62, trend: KGEnums.TREND.UP, spend: 1842500, spendDelta: 142,
    deposits: 12, bets: 287, lastActive: '12m ago',
    insight: 'Re-deposited 4× within 1hr after losing session',
    signals: ['Rapid re-deposit', 'Spend spike (>50% w/w)'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 9, products: [KGEnums.PRODUCT.SPORTS, KGEnums.PRODUCT.CASINO],
    status: KGEnums.PLAYER_STATUS.OUTREACH },
  { id: 'SS-7283910', risk: KGEnums.RISK.HIGH, riskScore: 92, riskFrom: 71, trend: KGEnums.TREND.UP, spend: 24300, spendDelta: 215,
    deposits: 14, bets: 412, lastActive: '2h ago',
    insight: '3 deposits in single 18-min session',
    signals: ['Multiple deposits/session', 'Spend spike (>50% w/w)'],
    country: KGEnums.COUNTRY.ZA, brand: KGEnums.BRAND.SUPERSPORTBET, tier: 8, products: [KGEnums.PRODUCT.CASINO, KGEnums.PRODUCT.VIRTUALS],
    status: KGEnums.PLAYER_STATUS.OUTREACH },
  { id: 'BK-3918274', risk: KGEnums.RISK.HIGH, riskScore: 81, riskFrom: 58, trend: KGEnums.TREND.UP, spend: 985000, spendDelta: 98,
    deposits: 9, bets: 156, lastActive: '34m ago',
    insight: 'Deposit frequency up 180% vs prior 7d',
    signals: ['Deposit frequency surge', 'Spend spike (>50% w/w)'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 8, products: [KGEnums.PRODUCT.SPORTS],
    status: KGEnums.PLAYER_STATUS.MONITOR },
  { id: 'BK-5621847', risk: KGEnums.RISK.MEDIUM, riskScore: 61, riskFrom: 41, trend: KGEnums.TREND.UP, spend: 412800, spendDelta: 67,
    deposits: 7, bets: 98, lastActive: '1h ago',
    insight: 'Shift from Sports → Casino (4d trend)',
    signals: ['Sports → Casino shift'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 4, products: [KGEnums.PRODUCT.SPORTS, KGEnums.PRODUCT.CASINO],
    status: KGEnums.PLAYER_STATUS.MONITOR },
  { id: 'SS-9012384', risk: KGEnums.RISK.MEDIUM, riskScore: 53, riskFrom: 38, trend: KGEnums.TREND.UP, spend: 8740, spendDelta: 54,
    deposits: 6, bets: 73, lastActive: '3h ago',
    insight: 'Late-night activity up 4× this week',
    signals: ['Late-night activity shift'],
    country: KGEnums.COUNTRY.ZA, brand: KGEnums.BRAND.SUPERSPORTBET, tier: 3, products: [KGEnums.PRODUCT.SPORTS, KGEnums.PRODUCT.VIRTUALS],
    status: null },

  // ===== Attention-queue (status set, not necessarily on movers list) =====
  { id: 'SS-1928374', risk: KGEnums.RISK.MEDIUM, riskScore: 49, trend: KGEnums.TREND.UP, spend: 6210, spendDelta: 41,
    deposits: 4, bets: 51, lastActive: '6h ago',
    insight: '2 failed deposit attempts last 24h',
    signals: ['Failed deposit attempts'],
    country: KGEnums.COUNTRY.ZM, brand: KGEnums.BRAND.SUPERSPORTBET, tier: 2, products: [KGEnums.PRODUCT.SPORTS],
    status: KGEnums.PLAYER_STATUS.MONITOR },
  { id: 'BK-2847362', risk: KGEnums.RISK.MEDIUM, riskScore: 44, trend: KGEnums.TREND.STABLE, spend: 287400, spendDelta: 38,
    deposits: 5, bets: 64, lastActive: '5h ago',
    insight: 'Spend up 38% vs prior 7d',
    signals: ['Spend spike (>50% w/w)'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 5, products: [KGEnums.PRODUCT.SPORTS],
    status: KGEnums.PLAYER_STATUS.MONITOR },
  { id: 'BK-7382910', risk: KGEnums.RISK.MEDIUM, riskScore: 41, trend: KGEnums.TREND.DOWN, spend: 198400, spendDelta: 22,
    deposits: 4, bets: 47, lastActive: '8h ago',
    insight: 'Bet frequency doubled this week',
    signals: ['Deposit frequency surge'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 4, products: [KGEnums.PRODUCT.SPORTS, KGEnums.PRODUCT.CASINO],
    status: KGEnums.PLAYER_STATUS.MONITOR },

  // ===== Additional high risk =====
  { id: 'BK-9374821', risk: KGEnums.RISK.HIGH, riskScore: 84, trend: KGEnums.TREND.UP, spend: 762400, spendDelta: 118,
    deposits: 11, bets: 198, lastActive: '47m ago',
    insight: 'Chasing-loss pattern detected (3-day window)',
    signals: ['Rapid re-deposit', 'Late-night activity shift'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 9, products: [KGEnums.PRODUCT.CASINO],
    status: KGEnums.PLAYER_STATUS.OUTREACH },
  { id: 'SS-2647193', risk: KGEnums.RISK.HIGH, riskScore: 78, trend: KGEnums.TREND.UP, spend: 18900, spendDelta: 87,
    deposits: 10, bets: 244, lastActive: '1h ago',
    insight: 'Deposit limit increased 3× in 14 days',
    signals: ['Deposit frequency surge'],
    country: KGEnums.COUNTRY.ZA, brand: KGEnums.BRAND.SUPERSPORTBET, tier: 5, products: [KGEnums.PRODUCT.SPORTS, KGEnums.PRODUCT.CASINO],
    status: KGEnums.PLAYER_STATUS.MONITOR },
  { id: 'BK-1738294', risk: KGEnums.RISK.HIGH, riskScore: 76, trend: KGEnums.TREND.UP, spend: 654200, spendDelta: 76,
    deposits: 8, bets: 132, lastActive: '3h ago',
    insight: 'Session length up 240% — 6h avg this week',
    signals: ['Late-night activity shift', 'Spend spike (>50% w/w)'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 8, products: [KGEnums.PRODUCT.CASINO, KGEnums.PRODUCT.VIRTUALS],
    status: KGEnums.PLAYER_STATUS.OUTREACH },
  { id: 'SS-4291837', risk: KGEnums.RISK.HIGH, riskScore: 73, trend: KGEnums.TREND.UP, spend: 14200, spendDelta: 64,
    deposits: 9, bets: 178, lastActive: '5h ago',
    insight: 'Removed deposit limit, spend doubled within 48h',
    signals: ['Spend spike (>50% w/w)', 'Rapid re-deposit'],
    country: KGEnums.COUNTRY.ZA, brand: KGEnums.BRAND.SUPERSPORTBET, tier: 5, products: [KGEnums.PRODUCT.CASINO],
    status: KGEnums.PLAYER_STATUS.MONITOR },

  // ===== Additional medium =====
  { id: 'BK-8273619', risk: KGEnums.RISK.MEDIUM, riskScore: 58, trend: KGEnums.TREND.UP, spend: 167300, spendDelta: 48,
    deposits: 5, bets: 71, lastActive: '4h ago',
    insight: 'New product cross-over: Sports → Virtuals',
    signals: ['Sports → Casino shift'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 4, products: [KGEnums.PRODUCT.SPORTS, KGEnums.PRODUCT.VIRTUALS],
    status: null },
  { id: 'SS-6182937', risk: KGEnums.RISK.MEDIUM, riskScore: 56, trend: KGEnums.TREND.UP, spend: 7340, spendDelta: 36,
    deposits: 4, bets: 58, lastActive: '7h ago',
    insight: 'Deposit pattern: bursts of 3-4 within 30min',
    signals: ['Multiple deposits/session'],
    country: KGEnums.COUNTRY.ZA, brand: KGEnums.BRAND.SUPERSPORTBET, tier: 3, products: [KGEnums.PRODUCT.SPORTS],
    status: KGEnums.PLAYER_STATUS.MONITOR },
  { id: 'BK-3927461', risk: KGEnums.RISK.MEDIUM, riskScore: 51, trend: KGEnums.TREND.STABLE, spend: 124600, spendDelta: 28,
    deposits: 4, bets: 52, lastActive: '9h ago',
    insight: 'Steady increase over rolling 14d',
    signals: ['Spend spike (>50% w/w)'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 4, products: [KGEnums.PRODUCT.SPORTS],
    status: null },
  { id: 'SS-5183746', risk: KGEnums.RISK.MEDIUM, riskScore: 47, trend: KGEnums.TREND.UP, spend: 5890, spendDelta: 33,
    deposits: 3, bets: 41, lastActive: '11h ago',
    insight: 'First-time Casino activity (was Sports-only)',
    signals: ['Sports → Casino shift'],
    country: KGEnums.COUNTRY.ZA, brand: KGEnums.BRAND.SUPERSPORTBET, tier: 3, products: [KGEnums.PRODUCT.SPORTS, KGEnums.PRODUCT.CASINO],
    status: null },
  { id: 'BK-4729183', risk: KGEnums.RISK.MEDIUM, riskScore: 45, trend: KGEnums.TREND.UP, spend: 98700, spendDelta: 24,
    deposits: 3, bets: 38, lastActive: '14h ago',
    insight: 'Late-night session detected (02:00–04:00)',
    signals: ['Late-night activity shift'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 3, products: [KGEnums.PRODUCT.CASINO],
    status: null },

  // ===== Low risk =====
  { id: 'SS-4738291', risk: KGEnums.RISK.LOW, riskScore: 22, trend: KGEnums.TREND.STABLE, spend: 3420, spendDelta: 4,
    deposits: 3, bets: 28, lastActive: '1d ago',
    insight: 'Stable engagement, within range',
    signals: [],
    country: KGEnums.COUNTRY.ZA, brand: KGEnums.BRAND.SUPERSPORTBET, tier: 4, products: [KGEnums.PRODUCT.SPORTS],
    status: null },
  { id: 'BK-1029384', risk: KGEnums.RISK.LOW, riskScore: 18, trend: KGEnums.TREND.DOWN, spend: 87200, spendDelta: -18,
    deposits: 2, bets: 19, lastActive: '1d ago',
    insight: 'Spend trending down vs prior 7d',
    signals: [],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 3, products: [KGEnums.PRODUCT.SPORTS],
    status: null },
  { id: 'BK-6172839', risk: KGEnums.RISK.LOW, riskScore: 16, trend: KGEnums.TREND.STABLE, spend: 64800, spendDelta: 6,
    deposits: 3, bets: 22, lastActive: '2d ago',
    insight: 'Consistent low-frequency play',
    signals: [],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 2, products: [KGEnums.PRODUCT.SPORTS],
    status: null },
  { id: 'SS-3829104', risk: KGEnums.RISK.LOW, riskScore: 14, trend: KGEnums.TREND.DOWN, spend: 1840, spendDelta: -32,
    deposits: 1, bets: 12, lastActive: '3d ago',
    insight: 'Engagement decreasing',
    signals: [],
    country: KGEnums.COUNTRY.ZM, brand: KGEnums.BRAND.SUPERSPORTBET, tier: 2, products: [KGEnums.PRODUCT.VIRTUALS],
    status: null },
  { id: 'BK-2918374', risk: KGEnums.RISK.LOW, riskScore: 12, trend: KGEnums.TREND.STABLE, spend: 42100, spendDelta: 2,
    deposits: 2, bets: 16, lastActive: '2d ago',
    insight: 'Recreational pattern, no flags',
    signals: [],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 2, products: [KGEnums.PRODUCT.SPORTS],
    status: null },
  { id: 'SS-7361928', risk: KGEnums.RISK.LOW, riskScore: 10, trend: KGEnums.TREND.DOWN, spend: 2180, spendDelta: -14,
    deposits: 1, bets: 9, lastActive: '4d ago',
    insight: 'Reduced activity following self-set limit',
    signals: [],
    country: KGEnums.COUNTRY.ZA, brand: KGEnums.BRAND.SUPERSPORTBET, tier: 2, products: [KGEnums.PRODUCT.SPORTS],
    status: null },
  { id: 'BK-8472913', risk: KGEnums.RISK.LOW, riskScore: 8, trend: KGEnums.TREND.STABLE, spend: 28400, spendDelta: 1,
    deposits: 1, bets: 11, lastActive: '5d ago',
    insight: 'Stable low-frequency engagement',
    signals: [],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 1, products: [KGEnums.PRODUCT.SPORTS],
    status: null },

  // ===== Interaction-log players (referenced in audit trail, not top movers) =====
  { id: 'BK-5804359', risk: KGEnums.RISK.HIGH,   riskScore: 77, trend: KGEnums.TREND.UP,     spend: 543200,  spendDelta: 89,
    deposits: 8,  bets: 164, lastActive: '2h ago',
    insight: 'Two missed call attempts; email follow-up sent',
    signals: ['Rapid re-deposit', 'Spend spike (>50% w/w)'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 5, products: [KGEnums.PRODUCT.SPORTS, KGEnums.PRODUCT.CASINO],
    status: KGEnums.PLAYER_STATUS.OUTREACH },
  { id: 'BK-9188862', risk: KGEnums.RISK.HIGH,   riskScore: 82, trend: KGEnums.TREND.UP,     spend: 671000,  spendDelta: 104,
    deposits: 10, bets: 221, lastActive: '1h ago',
    insight: '4.2 h continuous late-night session; cooling-off elected',
    signals: ['Late-night activity shift', 'Spend spike (>50% w/w)'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 5, products: [KGEnums.PRODUCT.CASINO],
    status: KGEnums.PLAYER_STATUS.MONITOR },
  { id: 'BK-4873494', risk: KGEnums.RISK.HIGH,   riskScore: 79, trend: KGEnums.TREND.UP,     spend: 498700,  spendDelta: 97,
    deposits: 9,  bets: 183, lastActive: '3h ago',
    insight: 'Declined two outreach attempts; 6 deposits in 4 hours',
    signals: ['Rapid re-deposit', 'Failed deposit attempts'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 5, products: [KGEnums.PRODUCT.SPORTS, KGEnums.PRODUCT.CASINO],
    status: KGEnums.PLAYER_STATUS.OUTREACH },
  { id: 'BK-8287974', risk: KGEnums.RISK.HIGH,   riskScore: 85, trend: KGEnums.TREND.UP,     spend: 892300,  spendDelta: 121,
    deposits: 11, bets: 248, lastActive: '45m ago',
    insight: 'Re-deposited within 5 min of depleting balance × 4 today',
    signals: ['Rapid re-deposit', 'Spend spike (>50% w/w)'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 6, products: [KGEnums.PRODUCT.CASINO],
    status: KGEnums.PLAYER_STATUS.OUTREACH },
  { id: 'BK-9838926', risk: KGEnums.RISK.HIGH,   riskScore: 77, trend: KGEnums.TREND.UP,     spend: 412500,  spendDelta: 86,
    deposits: 8,  bets: 149, lastActive: '2h ago',
    insight: '5 deposits in 28 min totalling ₦95,000 — record velocity',
    signals: ['Deposit frequency surge', 'Spend spike (>50% w/w)'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 4, products: [KGEnums.PRODUCT.SPORTS],
    status: KGEnums.PLAYER_STATUS.MONITOR },
  { id: 'BK-6735223', risk: KGEnums.RISK.HIGH,   riskScore: 85, trend: KGEnums.TREND.UP,     spend: 1124000, spendDelta: 133,
    deposits: 13, bets: 309, lastActive: '30m ago',
    insight: 'VIP — 3am session pattern persists despite claimed windfall',
    signals: ['Late-night activity shift', 'Spend spike (>50% w/w)'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 6, products: [KGEnums.PRODUCT.SPORTS, KGEnums.PRODUCT.CASINO],
    status: KGEnums.PLAYER_STATUS.OUTREACH },
  { id: 'BK-1736294', risk: KGEnums.RISK.HIGH,   riskScore: 74, trend: KGEnums.TREND.UP,     spend: 321800,  spendDelta: 72,
    deposits: 7,  bets: 128, lastActive: '4h ago',
    insight: 'Two unanswered outreach calls; voicemail left',
    signals: ['Deposit frequency surge'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 4, products: [KGEnums.PRODUCT.SPORTS],
    status: KGEnums.PLAYER_STATUS.OUTREACH },
  { id: 'BK-1769791', risk: KGEnums.RISK.HIGH,   riskScore: 78, trend: KGEnums.TREND.UP,     spend: 487200,  spendDelta: 91,
    deposits: 9,  bets: 176, lastActive: '1h ago',
    insight: 'Self-set ₦20,000/day deposit limit via app nudge',
    signals: ['Rapid re-deposit', 'Spend spike (>50% w/w)'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 5, products: [KGEnums.PRODUCT.CASINO],
    status: KGEnums.PLAYER_STATUS.MONITOR },
  { id: 'BK-2398779', risk: KGEnums.RISK.HIGH,   riskScore: 83, trend: KGEnums.TREND.UP,     spend: 764100,  spendDelta: 115,
    deposits: 11, bets: 237, lastActive: '55m ago',
    insight: '9 failed deposit attempts in 2 h; twice declined RG intervention',
    signals: ['Failed deposit attempts', 'Spend spike (>50% w/w)'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 5, products: [KGEnums.PRODUCT.SPORTS, KGEnums.PRODUCT.CASINO],
    status: KGEnums.PLAYER_STATUS.OUTREACH },
  { id: 'BK-7382918', risk: KGEnums.RISK.HIGH,   riskScore: 74, trend: KGEnums.TREND.UP,     spend: 287600,  spendDelta: 68,
    deposits: 7,  bets: 134, lastActive: '3h ago',
    insight: 'Spend spike: ₦142,000 across 7 transactions in one day',
    signals: ['Spend spike (>50% w/w)', 'Deposit frequency surge'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 3, products: [KGEnums.PRODUCT.SPORTS],
    status: KGEnums.PLAYER_STATUS.MONITOR },
  { id: 'BK-7336219', risk: KGEnums.RISK.HIGH,   riskScore: 79, trend: KGEnums.TREND.UP,     spend: 398400,  spendDelta: 88,
    deposits: 8,  bets: 162, lastActive: '2h ago',
    insight: 'Persistent chasing-loss signals over rolling 7d',
    signals: ['Loss-chasing pattern', 'Rapid re-deposit'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 4, products: [KGEnums.PRODUCT.SPORTS, KGEnums.PRODUCT.CASINO],
    status: KGEnums.PLAYER_STATUS.OUTREACH },
  { id: 'BK-4252587', risk: KGEnums.RISK.MEDIUM, riskScore: 48, trend: KGEnums.TREND.UP,     spend: 112400,  spendDelta: 31,
    deposits: 4,  bets: 67,  lastActive: '6h ago',
    insight: 'Inbound: set ₦30,000/session loss limit; late-night shift flagged',
    signals: ['Late-night activity shift'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 3, products: [KGEnums.PRODUCT.CASINO],
    status: null },
  { id: 'BK-7882145', risk: KGEnums.RISK.MEDIUM, riskScore: 42, trend: KGEnums.TREND.STABLE, spend: 143700,  spendDelta: 18,
    deposits: 4,  bets: 58,  lastActive: '2d ago',
    insight: 'Self-excluded via product platform; 30-day period active',
    signals: [],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 3, products: [KGEnums.PRODUCT.SPORTS],
    status: null },
  { id: 'BK-3321643', risk: KGEnums.RISK.MEDIUM, riskScore: 52, trend: KGEnums.TREND.UP,     spend: 198300,  spendDelta: 44,
    deposits: 5,  bets: 89,  lastActive: '4h ago',
    insight: '78% of bets shifted to Casino in past 3 days (was Sports-only)',
    signals: ['Sports → Casino shift'],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 4, products: [KGEnums.PRODUCT.SPORTS, KGEnums.PRODUCT.CASINO],
    status: KGEnums.PLAYER_STATUS.MONITOR },

  // ===== Unrated (insufficient history) =====
  { id: 'BK-9182734', risk: KGEnums.RISK.UNRATED, riskScore: null, trend: null, spend: 12400, spendDelta: null,
    deposits: 1, bets: 4, lastActive: '4d ago',
    insight: 'Insufficient data — 3d history',
    signals: [],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 1, products: [KGEnums.PRODUCT.SPORTS],
    status: null },
  { id: 'SS-2837461', risk: KGEnums.RISK.UNRATED, riskScore: null, trend: null, spend: 480, spendDelta: null,
    deposits: 1, bets: 2, lastActive: '6d ago',
    insight: 'New account — 5d history',
    signals: [],
    country: KGEnums.COUNTRY.ZA, brand: KGEnums.BRAND.SUPERSPORTBET, tier: 1, products: [KGEnums.PRODUCT.SPORTS],
    status: null },
  { id: 'BK-7361825', risk: KGEnums.RISK.UNRATED, riskScore: null, trend: null, spend: 8200, spendDelta: null,
    deposits: 1, bets: 3, lastActive: '7d ago',
    insight: 'Returning player — model recalibrating',
    signals: [],
    country: KGEnums.COUNTRY.NG, brand: KGEnums.BRAND.BETKING, tier: 1, products: [KGEnums.PRODUCT.SPORTS],
    status: null },
];

const PLAYER_MAP = PLAYERS.reduce((acc, player) => {
  acc[player.id] = player;
  return acc;
}, {});

function getPlayerById(playerId) {
  return PLAYER_MAP[playerId] || null;
}

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

function getAgentById(agentId) {
  return AGENT_MAP[agentId] || null;
}

function getSelectableAgents() {
  return AGENTS.filter(agent => agent.selectable);
}

// ===== Date-range-aware data generator =====
// Returns coherent mock data sized & shaped for the chosen window.

// Monthly active users by market (mock baseline) — irregular figures
// matching how real measurements come out, not round 900k/400k/100k.
const MAU = {
  [KGEnums.BRAND.BETKING]: { [KGEnums.COUNTRY.NG]: 883718 },
  [KGEnums.BRAND.SUPERSPORTBET]: { [KGEnums.COUNTRY.ZA]: 392446, [KGEnums.COUNTRY.ZM]:  97812 },
};
const MAU_TOTALS = {
  [KGEnums.BRAND.BETKING]: 883718,
  [KGEnums.BRAND.SUPERSPORTBET]: 490258,
  [KGEnums.BRAND.ALL]: 1373976,
};

// Risk-population shares (per-market % of MAU). Every MAU gets classified —
// the four buckets sum to 1.0 so the total monitored = MAU.
// High ~0.6%, Medium ~3.5%, Low ~93%, Unrated ~3% (no monitoring history yet)
const RISK_SHARE = { high: 0.006, med: 0.035, low: 0.929, unrated: 0.030 };

// Deposit ARPU per month (NGN for BetKing, ZAR for SuperSportBet)
const MONTHLY_ARPU = {
  [KGEnums.BRAND.BETKING]: 11500, // NGN per MAU per month
  [KGEnums.BRAND.SUPERSPORTBET]: 165,   // ZAR per MAU per month (blended ZA+ZM)
};

function mauForBrand(brandKey) {
  if (brandKey === KGEnums.BRAND.BETKING || brandKey === KGEnums.BRAND.SUPERSPORTBET) return MAU_TOTALS[brandKey];
  return MAU_TOTALS[KGEnums.BRAND.ALL];
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
//   24h ≈ 0.12 — daily actives are a small subset of monthly actives
//   7d  ≈ 0.38 — weekly actives
//   30d  = 1.00 — the MAU definition
// activeUnit / activeUnitFull = the metric label that fits the window.
const RANGE_CONFIG = {
  [KGEnums.DATE_RANGE.LAST_24_HOURS]: { days: 1,  label: '24 hours',  pointStep: 1, distMul: 1.00, depositMul: 0.034, activeMul: 0.12, activeUnit: 'DAU',  activeUnitFull: 'daily active users',   deltaLabel: 'vs prior 24h', refreshLabel: 'hourly', trendStart: 0.98, trendGrowth: 0.03 },
  [KGEnums.DATE_RANGE.LAST_7_DAYS]:  { days: 7,  label: '7 days',    pointStep: 1, distMul: 1.00, depositMul: 0.25,  activeMul: 0.38, activeUnit: 'WAU',  activeUnitFull: 'weekly active users',  deltaLabel: 'vs prior 7d',  refreshLabel: 'daily',  trendStart: 0.93, trendGrowth: 0.24 },
  [KGEnums.DATE_RANGE.LAST_30_DAYS]: { days: 30, label: '30 days',   pointStep: 3, distMul: 1.00, depositMul: 1.05,  activeMul: 1.00, activeUnit: 'MAU',  activeUnitFull: 'monthly active users', deltaLabel: 'vs prior 30d', refreshLabel: 'daily',  trendStart: 0.85, trendGrowth: 0.81 },
};

// Deterministic pseudo-random
function seeded(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

const RANGE_DATA_SOURCE_IDS = Object.freeze({
  DASHBOARD_RANGE_API_FIXTURE: 'dashboard-range-api-fixture',
});

function cloneRangePayload(payload) {
  return JSON.parse(JSON.stringify(payload));
}

function resolveRangeFixture(rangeKey, brandKey) {
  const fixtures = window.KGRangeDataApi?.FIXTURES || {};
  const resolvedRangeKey = RANGE_CONFIG[rangeKey] ? rangeKey : RANGE_24H;
  const resolvedBrandKey = [KGEnums.BRAND.ALL, KGEnums.BRAND.BETKING, KGEnums.BRAND.SUPERSPORTBET].includes(brandKey)
    ? brandKey
    : KGEnums.BRAND.ALL;
  const payload = fixtures[resolvedRangeKey]?.[resolvedBrandKey] || null;
  if (!payload) return null;
  return {
    ...cloneRangePayload(payload),
    dataSourceId: RANGE_DATA_SOURCE_IDS.DASHBOARD_RANGE_API_FIXTURE,
  };
}

function buildRangeData(rangeKey, brandKey) {
  const fixturePayload = resolveRangeFixture(rangeKey, brandKey);
  if (fixturePayload) return fixturePayload;

  throw new Error('Missing static range fixture data for the requested range/brand combination.');
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

const SIGNAL_LIBRARY = Object.keys(KGConstants.SIGNAL_META).filter(label => label !== 'Loss-chasing pattern' && label !== 'Session length spike' && label !== 'Withdrawal reversal');

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
  [KGEnums.BRAND.BETKING]: [KGEnums.COUNTRY.NG],
  [KGEnums.BRAND.SUPERSPORTBET]: [KGEnums.COUNTRY.ZA, KGEnums.COUNTRY.ZA, KGEnums.COUNTRY.ZA, KGEnums.COUNTRY.ZA, KGEnums.COUNTRY.ZM], // ZA-weighted (392k vs 97k)
};

// First element = primary product (drives product-filter matching in the player list).
// Distribution: ~50% sports-primary, ~30% casino-primary, ~20% virtuals-primary.
const PRODUCTS_LIBRARY = [
  [KGEnums.PRODUCT.SPORTS],
  [KGEnums.PRODUCT.SPORTS],
  [KGEnums.PRODUCT.SPORTS],
  [KGEnums.PRODUCT.SPORTS, KGEnums.PRODUCT.CASINO],
  [KGEnums.PRODUCT.SPORTS, KGEnums.PRODUCT.VIRTUALS],
  [KGEnums.PRODUCT.SPORTS, KGEnums.PRODUCT.CASINO, KGEnums.PRODUCT.VIRTUALS],
  [KGEnums.PRODUCT.CASINO],
  [KGEnums.PRODUCT.CASINO],
  [KGEnums.PRODUCT.CASINO, KGEnums.PRODUCT.SPORTS],
  [KGEnums.PRODUCT.CASINO, KGEnums.PRODUCT.VIRTUALS],
  [KGEnums.PRODUCT.VIRTUALS],
  [KGEnums.PRODUCT.VIRTUALS, KGEnums.PRODUCT.SPORTS],
];

const TRENDS = { high: ['up','up','up','up','stable'], medium: ['up','up','stable','stable','down'], low: ['stable','stable','down','down','up'], unrated: [null] };

// Generate a synthetic player at index i within bucket+brand
function synthPlayer(brandKey, bucket, i, seed) {
  const rnd = seeded(seed + i * 31);
  const idPrefix = brandKey === KGEnums.BRAND.BETKING ? 'BK' : 'SS';
  const idNum = 1000000 + Math.floor(rnd() * 8999999);
  const country = COUNTRIES_BY_BRAND[brandKey][Math.floor(rnd() * COUNTRIES_BY_BRAND[brandKey].length)];

  const score = bucket === 'high' ? Math.floor(70 + rnd() * 30)
              : bucket === 'medium' ? Math.floor(40 + rnd() * 30)
              : bucket === 'low' ? Math.floor(5 + rnd() * 35)
              : null;

  const trend = TRENDS[bucket][Math.floor(rnd() * TRENDS[bucket].length)];

  // Spend by brand (NGN vs ZAR scale)
  const baseSpend = brandKey === KGEnums.BRAND.BETKING ? 1 : 0.014; // ~71x ratio NGN:ZAR
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
    status = r < 0.18 ? KGEnums.PLAYER_STATUS.OUTREACH : r < 0.45 ? KGEnums.PLAYER_STATUS.MONITOR : null;
  } else if (bucket === 'medium') {
    status = rnd() < 0.10 ? KGEnums.PLAYER_STATUS.MONITOR : null;
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
  const cfg = RANGE_CONFIG[rangeKey] || RANGE_CONFIG[RANGE_24H];
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
  const brands = brandKey === KGEnums.BRAND.ALL ? [KGEnums.BRAND.BETKING, KGEnums.BRAND.SUPERSPORTBET] : [brandKey];
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

window.KGData = {
  PLAYERS, PLAYER_MAP, getPlayerById,
  AGENTS, AGENT_MAP, getAgentById, getSelectableAgents,
  buildRangeData, RANGE_CONFIG, MAU, MAU_TOTALS, getPlayerPopulation, bucketCountsForBrand,
};
