// Shared enum-like constants and option registries for King's Guard.
// JS doesn't have native enums here, so we use frozen objects/arrays as the
// single source of truth for repeated ids, labels, and config metadata.

const KGEnums = Object.freeze({
  BRAND: Object.freeze({
    ALL: 'all',
    BETKING: 'BetKing',
    SUPERSPORTBET: 'SuperSportBet',
  }),
  COUNTRY: Object.freeze({
    ALL: 'ALL',
    NG: 'NG',
    ZA: 'ZA',
    ZM: 'ZM',
  }),
  RISK: Object.freeze({
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
    UNRATED: 'unrated',
  }),
  TREND: Object.freeze({
    UP: 'up',
    STABLE: 'stable',
    DOWN: 'down',
  }),
  PRODUCT: Object.freeze({
    SPORTS: 'Sports',
    CASINO: 'Casino',
    VIRTUALS: 'Virtuals',
  }),
  DATE_RANGE: Object.freeze({
    LAST_24_HOURS: '24h',
    LAST_7_DAYS: '7d',
    LAST_30_DAYS: '30d',
    CUSTOM: 'custom',
  }),
  PLAYER_STATUS: Object.freeze({
    UNDER_REVIEW: 'under-review',
    FLAGGED: 'flagged',
    OUTREACH: 'outreach',
    OUTREACH_DONE: 'outreach-done',
    RG_SUGGESTED: 'rg-suggested',
    SELF_EXCLUDED: 'self-excluded',
    COOLING_OFF: 'cooling-off',
    DEPOSIT_LIMIT: 'deposit-limit',
    RESOLVED: 'resolved',
    REOPENED: 'reopened',
    MONITOR: 'monitor',
  }),
  INTERACTION_TYPE: Object.freeze({
    OUTREACH: 'outreach',
    STATUS_CHANGE: 'status-change',
    NOTE: 'note',
    AUTOMATED: 'automated',
    RG_TOOL: 'rg-tool',
    LIMIT_SET: 'limit-set',
    SELF_EXCLUDED: 'self-excluded',
    COOLING_OFF: 'cooling-off',
  }),
  INTERACTION_OUTCOME: Object.freeze({
    CONTACTED: 'contacted',
    NO_ANSWER: 'no-answer',
    VOICEMAIL: 'voicemail',
    EMAIL_SENT: 'email-sent',
    ESCALATED: 'escalated',
    DECLINED: 'declined',
  }),
  SIGNAL: Object.freeze({
    SPEND_SPIKE: 'Spend spike (>50% w/w)',
    RAPID_REDEPOSIT: 'Rapid re-deposit',
    LOSS_CHASING: 'Loss-chasing pattern',
    DEPOSIT_FREQUENCY_SURGE: 'Deposit frequency surge',
    MULTIPLE_DEPOSITS: 'Multiple deposits/session',
    FAILED_DEPOSITS: 'Failed deposit attempts',
    LATE_NIGHT_SHIFT: 'Late-night activity shift',
    SPORTS_TO_CASINO: 'Sports → Casino shift',
    SESSION_LENGTH_SPIKE: 'Session length spike',
    WITHDRAWAL_REVERSAL: 'Withdrawal reversal',
  }),
});

const RISK_COLORS = Object.freeze({
  [KGEnums.RISK.HIGH]:    { main: '#DC2626', bg: 'rgba(220, 38, 38, 0.08)', border: 'rgba(220, 38, 38, 0.24)', dim: '#FCA5A5' },
  [KGEnums.RISK.MEDIUM]:  { main: '#D97706', bg: 'rgba(217, 119, 6, 0.08)', border: 'rgba(217, 119, 6, 0.24)', dim: '#FCD34D' },
  [KGEnums.RISK.LOW]:     { main: '#16A34A', bg: 'rgba(22, 163, 74, 0.08)', border: 'rgba(22, 163, 74, 0.24)', dim: '#86EFAC' },
  [KGEnums.RISK.UNRATED]: { main: '#64748B', bg: 'rgba(100, 116, 139, 0.08)', border: 'rgba(100, 116, 139, 0.24)', dim: '#CBD5E1' },
});

const RISK_LABELS = Object.freeze({
  [KGEnums.RISK.HIGH]: 'High',
  [KGEnums.RISK.MEDIUM]: 'Medium',
  [KGEnums.RISK.LOW]: 'Low',
  [KGEnums.RISK.UNRATED]: 'Unrated',
});

const RISK_ORDER = Object.freeze({
  [KGEnums.RISK.HIGH]: 0,
  [KGEnums.RISK.MEDIUM]: 1,
  [KGEnums.RISK.LOW]: 2,
  [KGEnums.RISK.UNRATED]: 3,
});

const BRAND_ACCENTS = Object.freeze({
  [KGEnums.BRAND.BETKING]: { name: KGEnums.BRAND.BETKING, primary: '#001041', accent: '#FFC400', country: [KGEnums.COUNTRY.NG] },
  [KGEnums.BRAND.SUPERSPORTBET]: { name: KGEnums.BRAND.SUPERSPORTBET, primary: '#040B67', accent: '#F1C72F', country: [KGEnums.COUNTRY.ZA, KGEnums.COUNTRY.ZM] },
});

const BRAND_THEME = Object.freeze({
  [KGEnums.BRAND.BETKING]: {
    name: KGEnums.BRAND.BETKING,
    topbar: '#001041',
    topbarBorder: 'rgba(255, 196, 0, 0.18)',
    sidebar: '#000B2D',
    accent: '#FFC400',
    accentText: '#FFC400',
    accentBg: 'rgba(255, 196, 0, 0.12)',
    accentBgSoft: 'rgba(255, 196, 0, 0.08)',
    accentBorder: 'rgba(255, 196, 0, 0.22)',
    logoSrc: 'logo-betking.svg',
    logoWidth: 88,
  },
  [KGEnums.BRAND.SUPERSPORTBET]: {
    name: KGEnums.BRAND.SUPERSPORTBET,
    topbar: '#040B67',
    topbarBorder: 'rgba(241, 199, 47, 0.20)',
    sidebar: '#03084F',
    accent: '#F1C72F',
    accentText: '#F1C72F',
    accentBg: 'rgba(241, 199, 47, 0.12)',
    accentBgSoft: 'rgba(241, 199, 47, 0.08)',
    accentBorder: 'rgba(241, 199, 47, 0.22)',
    logoSrc: 'logo-supersportbet.svg',
    logoWidth: 132,
  },
  [KGEnums.BRAND.ALL]: {
    name: "King's Guard",
    topbar: '#0F172A',
    topbarBorder: 'rgba(148, 163, 184, 0.12)',
    sidebar: '#0B1220',
    accent: '#F59E0B',
    accentText: '#FBBF24',
    accentBg: 'rgba(245, 158, 11, 0.10)',
    accentBgSoft: 'rgba(245, 158, 11, 0.06)',
    accentBorder: 'rgba(245, 158, 11, 0.20)',
    logoSrc: null,
    logoWidth: null,
  },
});

const COUNTRY_NAMES = Object.freeze({
  [KGEnums.COUNTRY.ALL]: 'All markets',
  [KGEnums.COUNTRY.NG]: 'Nigeria',
  [KGEnums.COUNTRY.ZA]: 'South Africa',
  [KGEnums.COUNTRY.ZM]: 'Zambia',
});

const BRAND_OPTIONS = Object.freeze([
  { value: KGEnums.BRAND.BETKING, label: KGEnums.BRAND.BETKING },
  { value: KGEnums.BRAND.SUPERSPORTBET, label: KGEnums.BRAND.SUPERSPORTBET },
]);

const COUNTRY_OPTIONS = Object.freeze([
  { value: KGEnums.COUNTRY.ALL, label: COUNTRY_NAMES[KGEnums.COUNTRY.ALL] },
  { value: KGEnums.COUNTRY.NG, label: COUNTRY_NAMES[KGEnums.COUNTRY.NG] },
  { value: KGEnums.COUNTRY.ZA, label: COUNTRY_NAMES[KGEnums.COUNTRY.ZA] },
  { value: KGEnums.COUNTRY.ZM, label: COUNTRY_NAMES[KGEnums.COUNTRY.ZM] },
]);

function getCountryOptions(brand, includeAll = true) {
  const options = [];
  if (includeAll) options.push(COUNTRY_OPTIONS[0]);
  if (brand === KGEnums.BRAND.BETKING) return options.concat(COUNTRY_OPTIONS[1]);
  if (brand === KGEnums.BRAND.SUPERSPORTBET) return options.concat([COUNTRY_OPTIONS[2], COUNTRY_OPTIONS[3]]);
  return options.concat(COUNTRY_OPTIONS.slice(1));
}

// Convenience constants for date range keys (tied to RANGE_CONFIG)
const DATE_RANGE_24H = KGEnums.DATE_RANGE.LAST_24_HOURS;
const DATE_RANGE_7D  = KGEnums.DATE_RANGE.LAST_7_DAYS;
const DATE_RANGE_30D = KGEnums.DATE_RANGE.LAST_30_DAYS;

const DATE_RANGE_OPTIONS = Object.freeze([
  { value: DATE_RANGE_24H, label: 'Last 24 hours' },
  { value: DATE_RANGE_7D,  label: 'Last 7 days' },
  { value: DATE_RANGE_30D, label: 'Last 30 days' },
]);

function getDateRangeLabel(value) {
  const match = DATE_RANGE_OPTIONS.find(option => option.value === value);
  return match ? match.label : 'Custom range';
}

const PRODUCT_OPTIONS = Object.freeze([
  { value: 'all', label: 'All products' },
  { value: KGEnums.PRODUCT.SPORTS, label: KGEnums.PRODUCT.SPORTS },
  { value: KGEnums.PRODUCT.CASINO, label: KGEnums.PRODUCT.CASINO },
  { value: KGEnums.PRODUCT.VIRTUALS, label: KGEnums.PRODUCT.VIRTUALS },
]);

const PLAYER_STATUS_CFG = Object.freeze({
  [KGEnums.PLAYER_STATUS.UNDER_REVIEW]:  { label: 'Under Review', short: 'Under Review', color: '#6366F1', bg: 'rgba(99,102,241,0.10)', priority: 2 },
  [KGEnums.PLAYER_STATUS.FLAGGED]:       { label: 'Flagged for Monitoring', short: 'Flagged', color: '#D97706', bg: 'rgba(217,119,6,0.10)', priority: 2 },
  [KGEnums.PLAYER_STATUS.OUTREACH]:      { label: 'Outreach Recommended', short: 'Outreach Rec.', color: '#DC2626', bg: 'rgba(220,38,38,0.10)', priority: 1 },
  [KGEnums.PLAYER_STATUS.OUTREACH_DONE]: { label: 'Outreach Completed', short: 'Contacted', color: '#0891B2', bg: 'rgba(8,145,178,0.10)', priority: 3 },
  [KGEnums.PLAYER_STATUS.RG_SUGGESTED]:  { label: 'RG Tool Suggested', short: 'RG Suggested', color: '#7C3AED', bg: 'rgba(124,58,237,0.10)', priority: 3 },
  [KGEnums.PLAYER_STATUS.SELF_EXCLUDED]: { label: 'Self-Excluded', short: 'Self-Excluded', color: '#475569', bg: 'rgba(71,85,105,0.10)', priority: 4 },
  [KGEnums.PLAYER_STATUS.COOLING_OFF]:   { label: 'Cooling Off', short: 'Cooling Off', color: '#0369A1', bg: 'rgba(3,105,161,0.10)', priority: 4 },
  [KGEnums.PLAYER_STATUS.DEPOSIT_LIMIT]: { label: 'Deposit Limit Set', short: 'Dep. Limit', color: '#059669', bg: 'rgba(5,150,105,0.10)', priority: 4 },
  [KGEnums.PLAYER_STATUS.RESOLVED]:      { label: 'Resolved', short: 'Resolved', color: '#16A34A', bg: 'rgba(22,163,74,0.10)', priority: 5 },
  [KGEnums.PLAYER_STATUS.REOPENED]:      { label: 'Reopened', short: 'Reopened', color: '#EF4444', bg: 'rgba(239,68,68,0.10)', priority: 1 },
  [KGEnums.PLAYER_STATUS.MONITOR]:       { label: 'Flagged for Monitoring', short: 'Flagged', color: '#D97706', bg: 'rgba(217,119,6,0.10)', priority: 2 },
});

const ACTION_STATUSES = Object.freeze([
  KGEnums.PLAYER_STATUS.OUTREACH,
  KGEnums.PLAYER_STATUS.REOPENED,
  KGEnums.PLAYER_STATUS.FLAGGED,
  KGEnums.PLAYER_STATUS.UNDER_REVIEW,
  KGEnums.PLAYER_STATUS.MONITOR,
]);

const PLAYER_STATUS_FILTER_GROUPS = Object.freeze([
  {
    label: 'Needs action',
    options: [
      { value: KGEnums.PLAYER_STATUS.OUTREACH, label: 'Outreach Recommended' },
      { value: KGEnums.PLAYER_STATUS.REOPENED, label: 'Reopened' },
      { value: KGEnums.PLAYER_STATUS.FLAGGED, label: 'Flagged for Monitoring' },
      { value: KGEnums.PLAYER_STATUS.UNDER_REVIEW, label: 'Under Review' },
      { value: KGEnums.PLAYER_STATUS.MONITOR, label: 'Monitoring (legacy)' },
    ],
  },
  {
    label: 'In progress',
    options: [
      { value: KGEnums.PLAYER_STATUS.OUTREACH_DONE, label: 'Outreach Completed' },
      { value: KGEnums.PLAYER_STATUS.RG_SUGGESTED, label: 'RG Tool Suggested' },
    ],
  },
  {
    label: 'Self-managed',
    options: [
      { value: KGEnums.PLAYER_STATUS.SELF_EXCLUDED, label: 'Self-Excluded' },
      { value: KGEnums.PLAYER_STATUS.COOLING_OFF, label: 'Cooling Off' },
      { value: KGEnums.PLAYER_STATUS.DEPOSIT_LIMIT, label: 'Deposit Limit Set' },
    ],
  },
  {
    label: 'Closed',
    options: [
      { value: KGEnums.PLAYER_STATUS.RESOLVED, label: 'Resolved' },
    ],
  },
]);

const PLAYER_STATUS_EDIT_GROUPS = PLAYER_STATUS_FILTER_GROUPS.filter(group => group.label !== 'Closed').concat([
  { label: 'Closed', options: [{ value: KGEnums.PLAYER_STATUS.RESOLVED, label: 'Resolved' }] },
]);

const INTERACTION_TYPE_CFG = Object.freeze({
  [KGEnums.INTERACTION_TYPE.OUTREACH]:      { label: 'Outreach', color: '#0891B2', bg: 'rgba(8,145,178,0.10)' },
  [KGEnums.INTERACTION_TYPE.STATUS_CHANGE]: { label: 'Status Change', color: '#7C3AED', bg: 'rgba(124,58,237,0.10)' },
  [KGEnums.INTERACTION_TYPE.NOTE]:          { label: 'Note', color: '#64748B', bg: 'rgba(100,116,139,0.10)' },
  [KGEnums.INTERACTION_TYPE.AUTOMATED]:     { label: 'Auto Flag', color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  [KGEnums.INTERACTION_TYPE.RG_TOOL]:       { label: 'RG Tool', color: '#059669', bg: 'rgba(5,150,105,0.10)' },
  [KGEnums.INTERACTION_TYPE.LIMIT_SET]:     { label: 'Limit Set', color: '#059669', bg: 'rgba(5,150,105,0.10)' },
  [KGEnums.INTERACTION_TYPE.SELF_EXCLUDED]: { label: 'Self-Excluded', color: '#475569', bg: 'rgba(71,85,105,0.10)' },
  [KGEnums.INTERACTION_TYPE.COOLING_OFF]:   { label: 'Cooling Off', color: '#0369A1', bg: 'rgba(3,105,161,0.10)' },
});

const INTERACTION_OUTCOME_CFG = Object.freeze({
  [KGEnums.INTERACTION_OUTCOME.CONTACTED]:  { label: 'Contacted', color: '#16A34A' },
  [KGEnums.INTERACTION_OUTCOME.NO_ANSWER]:  { label: 'No Answer', color: '#94A3B8' },
  [KGEnums.INTERACTION_OUTCOME.VOICEMAIL]:  { label: 'Voicemail', color: '#64748B' },
  [KGEnums.INTERACTION_OUTCOME.EMAIL_SENT]: { label: 'Email Sent', color: '#0891B2' },
  [KGEnums.INTERACTION_OUTCOME.ESCALATED]:  { label: 'Escalated', color: '#DC2626' },
  [KGEnums.INTERACTION_OUTCOME.DECLINED]:   { label: 'Declined', color: '#D97706' },
});

const SIGNAL_META = Object.freeze({
  [KGEnums.SIGNAL.SPEND_SPIKE]:               { desc: 'Weekly spend ≥50% above prior-week baseline', severity: 'Critical', color: '#DC2626' },
  [KGEnums.SIGNAL.RAPID_REDEPOSIT]:           { desc: 'Deposit placed within 10 min of a losing session', severity: 'Critical', color: '#DC2626' },
  [KGEnums.SIGNAL.LOSS_CHASING]:              { desc: 'Bet size escalating after consecutive losses in the same session', severity: 'Critical', color: '#DC2626' },
  [KGEnums.SIGNAL.DEPOSIT_FREQUENCY_SURGE]:   { desc: 'Deposit frequency 3× or more above 4-week average', severity: 'High', color: '#D97706' },
  [KGEnums.SIGNAL.MULTIPLE_DEPOSITS]:         { desc: '3+ deposits placed within a single betting session', severity: 'High', color: '#D97706' },
  [KGEnums.SIGNAL.FAILED_DEPOSITS]:           { desc: 'Repeated failed attempts before a successful deposit clears', severity: 'High', color: '#D97706' },
  [KGEnums.SIGNAL.LATE_NIGHT_SHIFT]:          { desc: 'Sessions increasingly concentrated in the 22:00–04:00 window', severity: 'Medium', color: '#D97706' },
  [KGEnums.SIGNAL.SPORTS_TO_CASINO]:          { desc: 'Primary product migrating from sports to casino or slots', severity: 'Medium', color: '#D97706' },
  [KGEnums.SIGNAL.SESSION_LENGTH_SPIKE]:      { desc: 'Average session duration more than 2× personal weekly baseline', severity: 'Medium', color: '#D97706' },
  [KGEnums.SIGNAL.WITHDRAWAL_REVERSAL]:       { desc: 'Pending withdrawal cancelled and funds returned to wallet for play', severity: 'Medium', color: '#D97706' },
});

const SEVERITY_STYLE = Object.freeze({
  Critical: { bg: 'rgba(220,38,38,0.08)', color: '#DC2626', label: 'Critical' },
  High: { bg: 'rgba(217,119,6,0.10)', color: '#D97706', label: 'High' },
  Medium: { bg: 'rgba(100,116,139,0.10)', color: '#64748B', label: 'Medium' },
});

window.KGEnums = KGEnums;
window.KGConstants = {
  DATE_RANGE_24H,
  DATE_RANGE_7D,
  DATE_RANGE_30D,
  RISK_COLORS,
  RISK_LABELS,
  RISK_ORDER,
  BRAND_ACCENTS,
  BRAND_THEME,
  COUNTRY_NAMES,
  BRAND_OPTIONS,
  COUNTRY_OPTIONS,
  getCountryOptions,
  DATE_RANGE_OPTIONS,
  getDateRangeLabel,
  PRODUCT_OPTIONS,
  PLAYER_STATUS_CFG,
  ACTION_STATUSES,
  PLAYER_STATUS_FILTER_GROUPS,
  PLAYER_STATUS_EDIT_GROUPS,
  INTERACTION_TYPE_CFG,
  INTERACTION_OUTCOME_CFG,
  SIGNAL_META,
  SEVERITY_STYLE,
};
