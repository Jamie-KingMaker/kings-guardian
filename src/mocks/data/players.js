// src/mocks/data/players.js
// Hand-crafted player records — the "named" population surfaced
// on the home dashboard (movers, attention queue, etc).

export const PLAYERS = [
    // ===== Top movers =====
    {
        id: 'BK-4827193', risk: 'high', riskScore: 89, riskFrom: 62, trend: 'up', spend: 1842500, spendDelta: 142,
        deposits: 12, bets: 287, lastActive: '12m ago',
        insight: 'Re-deposited 4× within 1hr after losing session',
        signals: ['Rapid re-deposit', 'Spend spike (>50% w/w)'],
        country: 'NG', brand: 'betking', tier: 9, products: ['Sports', 'Casino'],
        status: 'outreach'
    },
    {
        id: 'SS-7283910', risk: 'high', riskScore: 92, riskFrom: 71, trend: 'up', spend: 24300, spendDelta: 215,
        deposits: 14, bets: 412, lastActive: '2h ago',
        insight: '3 deposits in single 18-min session',
        signals: ['Multiple deposits/session', 'Spend spike (>50% w/w)'],
        country: 'ZA', brand: 'supersportbet', tier: 8, products: ['Casino', 'Virtuals'],
        status: 'outreach'
    },
    {
        id: 'BK-3918274', risk: 'high', riskScore: 81, riskFrom: 58, trend: 'up', spend: 985000, spendDelta: 98,
        deposits: 9, bets: 156, lastActive: '34m ago',
        insight: 'Deposit frequency up 180% vs prior 7d',
        signals: ['Deposit frequency surge', 'Spend spike (>50% w/w)'],
        country: 'NG', brand: 'betking', tier: 8, products: ['Sports'],
        status: 'monitor'
    },
    {
        id: 'BK-5621847', risk: 'medium', riskScore: 61, riskFrom: 41, trend: 'up', spend: 412800, spendDelta: 67,
        deposits: 7, bets: 98, lastActive: '1h ago',
        insight: 'Shift from Sports → Casino (4d trend)',
        signals: ['Sports → Casino shift'],
        country: 'NG', brand: 'betking', tier: 4, products: ['Sports', 'Casino'],
        status: 'monitor'
    },
    {
        id: 'SS-9012384', risk: 'medium', riskScore: 53, riskFrom: 38, trend: 'up', spend: 8740, spendDelta: 54,
        deposits: 6, bets: 73, lastActive: '3h ago',
        insight: 'Late-night activity up 4× this week',
        signals: ['Late-night activity shift'],
        country: 'ZA', brand: 'supersportbet', tier: 3, products: ['Sports', 'Virtuals'],
        status: null
    },

    // ===== Attention queue =====
    {
        id: 'SS-1928374', risk: 'medium', riskScore: 49, trend: 'up', spend: 6210, spendDelta: 41,
        deposits: 4, bets: 51, lastActive: '6h ago',
        insight: '2 failed deposit attempts last 24h',
        signals: ['Failed deposit attempts'],
        country: 'ZM', brand: 'supersportbet', tier: 2, products: ['Sports'], status: 'monitor'
    },
    {
        id: 'BK-2847362', risk: 'medium', riskScore: 44, trend: 'stable', spend: 287400, spendDelta: 38,
        deposits: 5, bets: 64, lastActive: '5h ago',
        insight: 'Spend up 38% vs prior 7d',
        signals: ['Spend spike (>50% w/w)'],
        country: 'NG', brand: 'betking', tier: 5, products: ['Sports'], status: 'monitor'
    },
    {
        id: 'BK-7382910', risk: 'medium', riskScore: 41, trend: 'down', spend: 198400, spendDelta: 22,
        deposits: 4, bets: 47, lastActive: '8h ago',
        insight: 'Bet frequency doubled this week',
        signals: ['Deposit frequency surge'],
        country: 'NG', brand: 'betking', tier: 4, products: ['Sports', 'Casino'], status: 'monitor'
    },

    // ===== Additional high risk =====
    {
        id: 'BK-9374821', risk: 'high', riskScore: 84, trend: 'up', spend: 762400, spendDelta: 118,
        deposits: 11, bets: 198, lastActive: '47m ago',
        insight: 'Chasing-loss pattern detected (3-day window)',
        signals: ['Rapid re-deposit', 'Late-night activity shift'],
        country: 'NG', brand: 'betking', tier: 9, products: ['Casino'], status: 'outreach'
    },
    {
        id: 'SS-2647193', risk: 'high', riskScore: 78, trend: 'up', spend: 18900, spendDelta: 87,
        deposits: 10, bets: 244, lastActive: '1h ago',
        insight: 'Deposit limit increased 3× in 14 days',
        signals: ['Deposit frequency surge'],
        country: 'ZA', brand: 'supersportbet', tier: 5, products: ['Sports', 'Casino'], status: 'monitor'
    },
    {
        id: 'BK-1738294', risk: 'high', riskScore: 76, trend: 'up', spend: 654200, spendDelta: 76,
        deposits: 8, bets: 132, lastActive: '3h ago',
        insight: 'Session length up 240% — 6h avg this week',
        signals: ['Late-night activity shift', 'Spend spike (>50% w/w)'],
        country: 'NG', brand: 'betking', tier: 8, products: ['Casino', 'Virtuals'], status: 'outreach'
    },
    {
        id: 'SS-4291837', risk: 'high', riskScore: 73, trend: 'up', spend: 14200, spendDelta: 64,
        deposits: 9, bets: 178, lastActive: '5h ago',
        insight: 'Removed deposit limit, spend doubled within 48h',
        signals: ['Spend spike (>50% w/w)', 'Rapid re-deposit'],
        country: 'ZA', brand: 'supersportbet', tier: 5, products: ['Casino'], status: 'monitor'
    },

    // ===== Additional medium =====
    {
        id: 'BK-8273619', risk: 'medium', riskScore: 58, trend: 'up', spend: 167300, spendDelta: 48,
        deposits: 5, bets: 71, lastActive: '4h ago',
        insight: 'New product cross-over: Sports → Virtuals',
        signals: ['Sports → Casino shift'],
        country: 'NG', brand: 'betking', tier: 4, products: ['Sports', 'Virtuals'], status: null
    },
    {
        id: 'SS-6182937', risk: 'medium', riskScore: 56, trend: 'up', spend: 7340, spendDelta: 36,
        deposits: 4, bets: 58, lastActive: '7h ago',
        insight: 'Deposit pattern: bursts of 3-4 within 30min',
        signals: ['Multiple deposits/session'],
        country: 'ZA', brand: 'supersportbet', tier: 3, products: ['Sports'], status: 'monitor'
    },
    {
        id: 'BK-3927461', risk: 'medium', riskScore: 51, trend: 'stable', spend: 124600, spendDelta: 28,
        deposits: 4, bets: 52, lastActive: '9h ago',
        insight: 'Steady increase over rolling 14d',
        signals: ['Spend spike (>50% w/w)'],
        country: 'NG', brand: 'betking', tier: 4, products: ['Sports'], status: null
    },
    {
        id: 'SS-5183746', risk: 'medium', riskScore: 47, trend: 'up', spend: 5890, spendDelta: 33,
        deposits: 3, bets: 41, lastActive: '11h ago',
        insight: 'First-time Casino activity (was Sports-only)',
        signals: ['Sports → Casino shift'],
        country: 'ZA', brand: 'supersportbet', tier: 3, products: ['Sports', 'Casino'], status: null
    },
    {
        id: 'BK-4729183', risk: 'medium', riskScore: 45, trend: 'up', spend: 98700, spendDelta: 24,
        deposits: 3, bets: 38, lastActive: '14h ago',
        insight: 'Late-night session detected (02:00–04:00)',
        signals: ['Late-night activity shift'],
        country: 'NG', brand: 'betking', tier: 3, products: ['Casino'], status: null
    },

    // ===== Low risk =====
    {
        id: 'SS-4738291', risk: 'low', riskScore: 22, trend: 'stable', spend: 3420, spendDelta: 4,
        deposits: 3, bets: 28, lastActive: '1d ago', insight: 'Stable engagement, within range',
        signals: [], country: 'ZA', brand: 'supersportbet', tier: 4, products: ['Sports'], status: null
    },
    {
        id: 'BK-1029384', risk: 'low', riskScore: 18, trend: 'down', spend: 87200, spendDelta: -18,
        deposits: 2, bets: 19, lastActive: '1d ago', insight: 'Spend trending down vs prior 7d',
        signals: [], country: 'NG', brand: 'betking', tier: 3, products: ['Sports'], status: null
    },
    {
        id: 'BK-6172839', risk: 'low', riskScore: 16, trend: 'stable', spend: 64800, spendDelta: 6,
        deposits: 3, bets: 22, lastActive: '2d ago', insight: 'Consistent low-frequency play',
        signals: [], country: 'NG', brand: 'betking', tier: 2, products: ['Sports'], status: null
    },
    {
        id: 'SS-3829104', risk: 'low', riskScore: 14, trend: 'down', spend: 1840, spendDelta: -32,
        deposits: 1, bets: 12, lastActive: '3d ago', insight: 'Engagement decreasing',
        signals: [], country: 'ZM', brand: 'supersportbet', tier: 2, products: ['Virtuals'], status: null
    },
    {
        id: 'BK-2918374', risk: 'low', riskScore: 12, trend: 'stable', spend: 42100, spendDelta: 2,
        deposits: 2, bets: 16, lastActive: '2d ago', insight: 'Recreational pattern, no flags',
        signals: [], country: 'NG', brand: 'betking', tier: 2, products: ['Sports'], status: null
    },
    {
        id: 'SS-7361928', risk: 'low', riskScore: 10, trend: 'down', spend: 2180, spendDelta: -14,
        deposits: 1, bets: 9, lastActive: '4d ago', insight: 'Reduced activity following self-set limit',
        signals: [], country: 'ZA', brand: 'supersportbet', tier: 2, products: ['Sports'], status: null
    },
    {
        id: 'BK-8472913', risk: 'low', riskScore: 8, trend: 'stable', spend: 28400, spendDelta: 1,
        deposits: 1, bets: 11, lastActive: '5d ago', insight: 'Stable low-frequency engagement',
        signals: [], country: 'NG', brand: 'betking', tier: 1, products: ['Sports'], status: null
    },

    // ===== Unrated =====
    {
        id: 'BK-9182734', risk: 'unrated', riskScore: null, trend: null, spend: 12400, spendDelta: null,
        deposits: 1, bets: 4, lastActive: '4d ago', insight: 'Insufficient data — 3d history',
        signals: [], country: 'NG', brand: 'betking', tier: 1, products: ['Sports'], status: null
    },
    {
        id: 'SS-2837461', risk: 'unrated', riskScore: null, trend: null, spend: 480, spendDelta: null,
        deposits: 1, bets: 2, lastActive: '6d ago', insight: 'New account — 5d history',
        signals: [], country: 'ZA', brand: 'supersportbet', tier: 1, products: ['Sports'], status: null
    },
    {
        id: 'BK-7361825', risk: 'unrated', riskScore: null, trend: null, spend: 8200, spendDelta: null,
        deposits: 1, bets: 3, lastActive: '7d ago', insight: 'Returning player — model recalibrating',
        signals: [], country: 'NG', brand: 'betking', tier: 1, products: ['Sports'], status: null
    },
];

