// src/mocks/data/generators.js
// All computationally-generated mock data (formerly in data.jsx).
// Called by MSW handlers to build API responses.

// ── Constants ─────────────────────────────────────────────────────────────────

export const MAU = {
  betking:       { NG: 883718 },
  supersportbet: { ZA: 392446, ZM: 97812 },
};

export const MAU_TOTALS = {
  betking:       883718,
  supersportbet: 490258,
  all:          1373976,
};

const RISK_SHARE = { high: 0.006, med: 0.035, low: 0.929, unrated: 0.030 };

const MONTHLY_ARPU = {
  betking:       11500,
  supersportbet: 165,
};

export const RANGE_CONFIG = {
  '7d':  { days: 7,   label: '7 days',       pointStep: 1,  distMul: 1.00, depositMul: 0.25,  activeMul: 0.55, activeUnit: 'WAU',   activeUnitFull: 'weekly active users',        deltaLabel: 'vs prior 7d',     refreshLabel: 'daily',  trendStart: 0.95, trendGrowth: 0.23 },
  '14d': { days: 14,  label: '14 days',      pointStep: 2,  distMul: 1.00, depositMul: 0.50,  activeMul: 0.78, activeUnit: '14dAU', activeUnitFull: '14-day active users',        deltaLabel: 'vs prior 14d',    refreshLabel: 'daily',  trendStart: 0.92, trendGrowth: 0.40 },
  '30d': { days: 30,  label: '30 days',      pointStep: 3,  distMul: 1.00, depositMul: 1.05,  activeMul: 1.00, activeUnit: 'MAU',   activeUnitFull: 'monthly active users',       deltaLabel: 'vs prior 30d',    refreshLabel: 'daily',  trendStart: 0.85, trendGrowth: 0.81 },
  '90d': { days: 90,  label: '90 days',      pointStep: 7,  distMul: 1.00, depositMul: 3.06,  activeMul: 1.42, activeUnit: 'QAU',   activeUnitFull: 'quarterly active users',     deltaLabel: 'vs prior 90d',    refreshLabel: 'weekly', trendStart: 0.70, trendGrowth: 1.30 },
  'ytd': { days: 124, label: 'year to date', pointStep: 10, distMul: 1.00, depositMul: 4.22,  activeMul: 1.68, activeUnit: 'YTD',   activeUnitFull: 'year-to-date active users',  deltaLabel: 'vs prior period', refreshLabel: 'weekly', trendStart: 0.62, trendGrowth: 1.80 },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function seeded(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

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

// ── buildRangeData ────────────────────────────────────────────────────────────

export function buildRangeData(rangeKey, brandKey) {
  const cfg = RANGE_CONFIG[rangeKey] ?? RANGE_CONFIG['7d'];
  const rnd = seeded(rangeKey.charCodeAt(0) * 17 + (brandKey ?? '').length);

  const mauBase = mauForBrand(brandKey);
  const mau     = Math.round(mauBase * cfg.activeMul);
  const baseDist = buildBaseDist(brandKey);
  const dist = {
    high:    Math.round(baseDist.high    * cfg.distMul * cfg.activeMul),
    med:     Math.round(baseDist.med     * cfg.distMul * cfg.activeMul),
    low:     Math.round(baseDist.low     * cfg.distMul * cfg.activeMul),
    unrated: Math.round(baseDist.unrated * cfg.distMul * cfg.activeMul),
  };

  const depositTotal   = Math.round(MAU_TOTALS.betking       * MONTHLY_ARPU.betking       * cfg.depositMul);
  const depositTotalSS = Math.round(MAU_TOTALS.supersportbet * MONTHLY_ARPU.supersportbet * cfg.depositMul);

  // Risk trend points
  const numPoints = Math.min(Math.max(Math.ceil(cfg.days / cfg.pointStep), 6), 14);
  const today = new Date(2026, 4, 5);
  const monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmtDate = (d) => `${monthShort[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;

  const endHigh = dist.high, endMed = dist.med, endLow = dist.low;
  const startHigh = Math.round(endHigh * cfg.trendStart);
  const startMed  = Math.round(endMed * 1.06);
  const startLow  = (endHigh + endMed + endLow) - startHigh - startMed;

  const impulses = [
    { atT: 0.15, from: 'low', to: 'med',  mag: 0.04 },
    { atT: 0.28, from: 'med', to: 'high', mag: 0.05 },
    { atT: 0.42, from: 'high',to: 'med',  mag: 0.03 },
    { atT: 0.55, from: 'low', to: 'med',  mag: 0.05 },
    { atT: 0.70, from: 'med', to: 'high', mag: 0.06 },
    { atT: 0.85, from: 'med', to: 'low',  mag: 0.03 },
    { atT: 0.92, from: 'low', to: 'med',  mag: 0.04 },
  ];
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
      const bump  = Math.exp(-Math.pow((t - imp.atT) / sigma, 2));
      const refSize = Math.max(starts[imp.from], ends[imp.from], 1);
      const delta = imp.mag * refSize * bump;
      v[imp.from] -= delta;
      v[imp.to]   += delta;
    }
    const jitter = (rnd() - 0.5) * 0.002 * Math.max(starts.med, ends.med);
    v.low -= jitter; v.med += jitter;
    return { high: Math.max(0, Math.round(v.high)), med: Math.max(0, Math.round(v.med)), low: Math.max(0, Math.round(v.low)) };
  };

  const trend = [];
  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const d = new Date(today);
    d.setDate(today.getDate() - Math.round((1 - t) * cfg.days));
    trend.push({ d: fmtDate(d), ...evalPoint(t) });
  }
  trend[trend.length - 1] = { d: trend[trend.length - 1].d, high: endHigh, med: endMed, low: endLow };

  // Deposit bars
  const deposits = [];
  for (let i = 0; i < cfg.days; i++) {
    const t = i / (cfg.days - 1);
    const base   = 35 + t * 70;
    const wobble = Math.sin(i * 0.5) * 8 + (rnd() - 0.5) * 12;
    const spike  = i >= cfg.days - 7 ? 12 : 0;
    deposits.push(Math.max(20, Math.round(base + wobble + spike)));
  }

  // Top movers (references player IDs from the seed data)
  const MOVER_IDS = ['BK-4827193', 'SS-7283910', 'BK-3918274', 'BK-5621847', 'SS-9012384'];
  const moverScale = rangeKey === '7d' ? 1 : rangeKey === '14d' ? 1.2 : rangeKey === '30d' ? 1.5 : rangeKey === '90d' ? 1.9 : 2.2;

  // Import players lazily to avoid circular-ish concerns in mock layer
  const { PLAYERS } = await_players();
  const movers = MOVER_IDS
    .map(id => PLAYERS.find(p => p.id === id))
    .filter(Boolean)
    .map(p => {
      const baseDelta = (p.riskScore ?? 0) - (p.riskFrom ?? 0);
      const delta     = Math.round(baseDelta * moverScale);
      return { id: p.id, brand: p.brand, country: p.country, from: p.riskFrom, to: Math.min(99, (p.riskFrom ?? 0) + delta), delta, riskScore: p.riskScore, insight: p.insight };
    });

  // RG tool adoption
  const rgScale = (mau / 1_000_000) * cfg.depositMul;
  const rgAdoption = [
    { tool: 'Self-Exclusion',   base: 41200, deltaBase: 11 },
    { tool: 'Deposit Limits',   base: 33000, deltaBase: 18 },
    { tool: '24-Hour Cool-Off', base: 16500, deltaBase: 24 },
    { tool: 'Account Closure',  base: 8250,  deltaBase: 6  },
  ].map(i => ({ tool: i.tool, count: Math.max(1, Math.round(i.base * rgScale)), delta: i.deltaBase + (rangeKey === '90d' || rangeKey === 'ytd' ? 5 : 0) }));

  // Risk signals
  const signalScale = (dist.high + dist.med) / 2631;
  const signals = [
    { label: 'Spend spike (>50% w/w)',    base: 142, color: '#DC2626' },
    { label: 'Rapid re-deposit',          base: 87,  color: '#DC2626' },
    { label: 'Loss-chasing pattern',      base: 71,  color: '#DC2626' },
    { label: 'Deposit frequency surge',   base: 68,  color: '#D97706' },
    { label: 'Multiple deposits/session', base: 54,  color: '#D97706' },
    { label: 'Failed deposit attempts',   base: 41,  color: '#D97706' },
    { label: 'Late-night activity shift', base: 38,  color: '#D97706' },
    { label: 'Sports → Casino shift',     base: 29,  color: '#D97706' },
    { label: 'Session length spike',      base: 22,  color: '#D97706' },
    { label: 'Withdrawal reversal',       base: 16,  color: '#D97706' },
  ].map(s => ({ label: s.label, color: s.color, count: Math.max(1, Math.round(s.base * signalScale)) }));

  // Stat deltas
  const dailyVs = rangeKey === '7d' ? 'vs yesterday' : 'vs prior period';
  const dHigh = Math.round(dist.high * (rangeKey === '7d' ? 0.025 : rangeKey === '14d' ? 0.06 : rangeKey === '30d' ? 0.18 : rangeKey === '90d' ? 0.34 : 0.42));
  const dMed  = Math.round(dist.med  * (rangeKey === '7d' ? 0.018 : rangeKey === '14d' ? 0.06 : rangeKey === '30d' ? 0.20 : rangeKey === '90d' ? 0.30 : 0.36));
  const dLow  = Math.round(dist.low  * (rangeKey === '7d' ? 0.003 : rangeKey === '14d' ? 0.010 : rangeKey === '30d' ? 0.022 : rangeKey === '90d' ? 0.13 : 0.17));
  const sign  = (n, dir) => `${dir === 'down' ? '−' : '+'}${n.toLocaleString()}`;
  const statDeltas = {
    high: sign(dHigh, 'up'),
    med:  sign(dMed,  'up'),
    low:  ['7d','14d','30d'].includes(rangeKey) ? sign(dLow, 'down') : sign(dLow, 'up'),
    dailyVs,
  };

  const depositGrowth = rangeKey === '7d' ? 14.2 : rangeKey === '14d' ? 17.8 : rangeKey === '30d' ? 24.6 : rangeKey === '90d' ? 38.4 : 47.2;

  return {
    rangeKey,
    rangeLabel:       cfg.label,
    trendGrowthPct:   Math.round(cfg.trendGrowth * 100),
    deltaLabel:       cfg.deltaLabel,
    refreshLabel:     cfg.refreshLabel,
    mau,
    mauBase,
    activeUnit:       cfg.activeUnit,
    activeUnitFull:   cfg.activeUnitFull,
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

// Lazy import helper so generators.js doesn't import players at module
// evaluation time (handlers import both; we just need a sync ref here).
let _playersCache = null;
function await_players() {
  if (_playersCache) return _playersCache;
  // Dynamic require-style: we use a live import that was already resolved
  // by the time handlers call buildRangeData.
  // For simplicity, require the module synchronously via static import side-effect.
  const mod = import.meta.glob('./players.js', { eager: true });
  _playersCache = Object.values(mod)[0];
  return _playersCache;
}

// ── Synthetic player generator ────────────────────────────────────────────────

const SIGNAL_LIBRARY = [
  'Spend spike (>50% w/w)', 'Rapid re-deposit', 'Deposit frequency surge',
  'Multiple deposits/session', 'Failed deposit attempts',
  'Late-night activity shift', 'Sports → Casino shift',
];

const INSIGHT_LIBRARY = {
  high:    ['Spend up sharply vs prior period','Multiple re-deposits within session','Removed deposit limit, activity surged','Late-night sessions extending past 3 hours','Deposit frequency 3× baseline','Cross-product migration with rising stakes','Velocity exceeds 95th percentile peer cohort','Failed deposit attempts followed by retries'],
  medium:  ['Modest spend increase, watching trajectory','Bet frequency rising vs 28-day baseline','Casino exposure trending up','Session length growing week-over-week','New deposit method added recently','Off-hours activity modestly elevated','Cross-product activity expanding'],
  low:     ['Stable engagement within range','Recreational pattern, no flags','Trending down vs prior period','Consistent low-frequency play','Reduced activity following self-set limit','Cooled off after session reminder','Below cohort average on all signals'],
  unrated: ['Insufficient history — model recalibrating','New account — under 7 days observed','Returning player — fresh observation window','KYC complete, behaviour baseline pending'],
};

const COUNTRIES_BY_BRAND = {
  betking:       ['NG'],
  supersportbet: ['ZA','ZA','ZA','ZA','ZM'],
};

const PRODUCTS_LIBRARY = [
  ['Sports'],['Sports'],['Sports'],['Sports','Casino'],['Casino'],
  ['Sports','Virtuals'],['Casino','Virtuals'],['Sports','Casino','Virtuals'],
];

const TRENDS = { high: ['up','up','up','up','stable'], medium: ['up','up','stable','stable','down'], low: ['stable','stable','down','down','up'], unrated: [null] };

export function synthPlayer(brandKey, bucket, i, seed) {
  const rnd       = seeded(seed + i * 31);
  const idPrefix  = brandKey === 'betking' ? 'BK' : 'SS';
  const idNum     = 1000000 + Math.floor(rnd() * 8999999);
  const country   = COUNTRIES_BY_BRAND[brandKey][Math.floor(rnd() * COUNTRIES_BY_BRAND[brandKey].length)];
  const score     = bucket === 'high' ? Math.floor(70 + rnd() * 30) : bucket === 'medium' ? Math.floor(40 + rnd() * 30) : bucket === 'low' ? Math.floor(5 + rnd() * 35) : null;
  const trend     = TRENDS[bucket][Math.floor(rnd() * TRENDS[bucket].length)];
  const baseSpend = brandKey === 'betking' ? 1 : 0.014;
  const rawSpend  = bucket === 'high' ? 400000 + rnd() * 1500000 : bucket === 'medium' ? 80000 + rnd() * 350000 : bucket === 'low' ? 5000 + rnd() * 95000 : 1000 + rnd() * 20000;
  const spend     = Math.round(rawSpend * baseSpend);
  const spendDelta= bucket === 'high' ? Math.floor(50 + rnd() * 180) : bucket === 'medium' ? Math.floor(15 + rnd() * 50) : bucket === 'low' ? Math.floor(-30 + rnd() * 25) : null;
  const deposits  = bucket === 'high' ? Math.floor(6 + rnd() * 12) : bucket === 'medium' ? Math.floor(3 + rnd() * 5) : bucket === 'low' ? Math.floor(1 + rnd() * 4) : Math.floor(1 + rnd() * 2);
  const bets      = bucket === 'high' ? Math.floor(80 + rnd() * 350) : bucket === 'medium' ? Math.floor(30 + rnd() * 80) : bucket === 'low' ? Math.floor(5 + rnd() * 40) : Math.floor(2 + rnd() * 8);
  const laOpts    = bucket === 'high' ? ['12m ago','34m ago','1h ago','2h ago','3h ago','5h ago'] : bucket === 'medium' ? ['1h ago','3h ago','5h ago','8h ago','12h ago','18h ago'] : bucket === 'low' ? ['1d ago','2d ago','3d ago','4d ago','5d ago'] : ['4d ago','5d ago','6d ago','7d ago'];
  const lastActive= laOpts[Math.floor(rnd() * laOpts.length)];
  const numSigs   = bucket === 'high' ? 1 + Math.floor(rnd() * 3) : bucket === 'medium' ? Math.floor(rnd() * 3) : 0;
  const signals   = [];
  const used      = new Set();
  for (let s = 0; s < numSigs; s++) {
    const idx = Math.floor(rnd() * SIGNAL_LIBRARY.length);
    if (!used.has(idx)) { used.add(idx); signals.push(SIGNAL_LIBRARY[idx]); }
  }
  const insight   = INSIGHT_LIBRARY[bucket][Math.floor(rnd() * INSIGHT_LIBRARY[bucket].length)];
  const products  = PRODUCTS_LIBRARY[Math.floor(rnd() * PRODUCTS_LIBRARY.length)];
  let status      = null;
  if (bucket === 'high')   { const r = rnd(); status = r < 0.18 ? 'outreach' : r < 0.45 ? 'monitor' : null; }
  else if (bucket === 'medium') { status = rnd() < 0.10 ? 'monitor' : null; }
  const tier      = bucket === 'high' ? 5 + Math.floor(rnd() * 5) : bucket === 'medium' ? 3 + Math.floor(rnd() * 4) : bucket === 'low' ? 1 + Math.floor(rnd() * 4) : 1 + Math.floor(rnd() * 2);
  return { id: `${idPrefix}-${idNum}`, risk: bucket, riskScore: score, trend, spend, spendDelta, deposits, bets, lastActive, insight, signals, country, brand: brandKey, tier, products, status, synthetic: true };
}

export function bucketCountsForBrand(brandKey, rangeKey) {
  const cfg      = RANGE_CONFIG[rangeKey] ?? RANGE_CONFIG['7d'];
  const baseDist = buildBaseDist(brandKey);
  return {
    high:    Math.round(baseDist.high    * cfg.activeMul),
    medium:  Math.round(baseDist.med     * cfg.activeMul),
    low:     Math.round(baseDist.low     * cfg.activeMul),
    unrated: Math.round(baseDist.unrated * cfg.activeMul),
  };
}

export function getPlayerPopulation(brandKey, rangeKey, pinnedPlayers) {
  const brands  = brandKey === 'all' ? ['betking', 'supersportbet'] : [brandKey];
  const buckets = ['high', 'medium', 'low', 'unrated'];
  const segments = [];
  for (const b of buckets) {
    for (const br of brands) {
      const counts     = bucketCountsForBrand(br, rangeKey);
      const pinned     = pinnedPlayers.filter(p => p.brand === br && p.risk === b);
      const total      = counts[b];
      const synthCount = Math.max(0, total - pinned.length);
      segments.push({ brand: br, bucket: b, pinned, synthCount, total });
    }
  }
  let cum = 0;
  const offsets = segments.map(s => { const start = cum; cum += s.pinned.length + s.synthCount; return { start, end: cum, seg: s }; });
  const length  = cum;
  const cache   = new Map();

  function get(i) {
    for (const o of offsets) {
      if (i < o.end) {
        const localIdx = i - o.start;
        if (localIdx < o.seg.pinned.length) return o.seg.pinned[localIdx];
        const synthIdx  = localIdx - o.seg.pinned.length;
        const cacheKey  = `${o.seg.brand}|${o.seg.bucket}|${synthIdx}`;
        if (!cache.has(cacheKey)) {
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

