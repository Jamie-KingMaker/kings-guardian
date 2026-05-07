// Home Dashboard Component IDs and Enums
// Following SOLID principles for maintainability and testability

const HOME_DASHBOARD_COMPONENT_IDS = Object.freeze({
  MAIN_DASHBOARD: 'home-dashboard',
  PAGE_HEADER: 'home-dashboard-header',
  DATE_RANGE_PICKER: 'home-dashboard-date-range',
  STATS_CONTAINER: 'home-dashboard-stats',
  STAT_CARD_ACTIVE_BASE: 'home-dashboard-stat-active-base',
  STAT_CARD_HIGH_RISK: 'home-dashboard-stat-high-risk',
  STAT_CARD_MEDIUM_RISK: 'home-dashboard-stat-medium-risk',
  STAT_CARD_LOW_RISK: 'home-dashboard-stat-low-risk',
  STAT_CARD_UNRATED: 'home-dashboard-stat-unrated',
  RISK_TREND_CARD: 'home-dashboard-risk-trend',
  RG_COPILOT_CARD: 'home-dashboard-rg-copilot',
  DEPOSIT_ACTIVITY_CARD: 'home-dashboard-deposit-activity',
  TOP_MOVERS_CARD: 'home-dashboard-top-movers',
  RG_ADOPTION_CARD: 'home-dashboard-rg-adoption',
  SIGNALS_BREAKDOWN_CARD: 'home-dashboard-signals-breakdown',
  RISK_DISTRIBUTION_SNAPSHOT: 'home-dashboard-risk-distribution-snapshot',
  ATTENTION_CARD: 'home-dashboard-attention-card',
});

const HOME_DASHBOARD_INSIGHTS_TONES = Object.freeze({
  RISK: { bar: '#DC2626', tag: 'rgba(220,38,38,0.08)', tagText: '#B91C1C', label: 'Risk' },
  PATTERN: { bar: '#D97706', tag: 'rgba(217,119,6,0.08)', tagText: '#B45309', label: 'Pattern' },
  TREND: { bar: '#0891B2', tag: 'rgba(8,145,178,0.08)', tagText: '#0E7490', label: 'Trend' },
  SIGNAL: { bar: '#16A34A', tag: 'rgba(22,163,74,0.08)', tagText: '#15803D', label: 'Signal' },
  ACTION: { bar: '#4338CA', tag: 'rgba(99,102,241,0.10)', tagText: '#4338CA', label: 'Action' },
});

const HOME_DASHBOARD_VIEW_MODES = Object.freeze({
  OVERVIEW: 'overview',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
});

Object.assign(window, {
  HOME_DASHBOARD_COMPONENT_IDS,
  HOME_DASHBOARD_INSIGHTS_TONES,
  HOME_DASHBOARD_VIEW_MODES,
});

