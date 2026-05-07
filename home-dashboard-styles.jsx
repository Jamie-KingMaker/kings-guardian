// Home Dashboard Shared Styles and Constants
// Following DRY principle - centralized styling

const HOME_DASHBOARD_STYLES = Object.freeze({
  CARD: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    padding: 18,
  },
  BUTTON_PRIMARY: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 14px',
    borderRadius: 6,
    border: 'none',
    background: '#0F172A',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  BUTTON_SECONDARY: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 14px',
    borderRadius: 6,
    background: '#FFFFFF',
    color: '#334155',
    fontSize: 14,
    fontWeight: 500,
    border: '1px solid #E2E8F0',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  TAB_BUTTON_ACTIVE: (color = '#0F172A') => ({
    padding: '4px 10px',
    borderRadius: 4,
    border: 'none',
    fontSize: 13,
    fontWeight: 600,
    background: '#FFFFFF',
    color: color,
    boxShadow: '0 1px 3px rgba(15,23,42,0.10)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
  }),
  TAB_BUTTON_INACTIVE: {
    padding: '4px 10px',
    borderRadius: 4,
    border: 'none',
    fontSize: 13,
    fontWeight: 600,
    background: 'transparent',
    color: '#64748B',
    boxShadow: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
  },
  TAB_CONTAINER: {
    display: 'flex',
    background: '#F1F5F9',
    borderRadius: 6,
    padding: 2,
    gap: 2,
  },
});

const HOME_DASHBOARD_COLORS = Object.freeze({
  DEPOSIT_TIER: {
    high: '#DC2626',
    med: '#D97706',
    low: '#16A34A',
  },
  RISK_SERIES: {
    low: '#16A34A',
    med: '#D97706',
    high: '#DC2626',
  },
  RG_ADOPTION_TOOLS: {
    'Self-Exclusion': '#DC2626',
    'Deposit Limits': '#D97706',
    '24-Hour Cool-Off': '#0891B2',
    'Account Closure': '#7C3AED',
  },
});

const HOME_DASHBOARD_CHART_CONFIG = Object.freeze({
  RISK_TREND: {
    WIDTH: 720,
    HEIGHT: 200,
    PAD_L: 40,
    PAD_B: 28,
    PAD_T: 12,
    PAD_R: 12,
  },
  DEPOSIT_ACTIVITY: {
    WIDTH: 720,
    HEIGHT: 180,
    PAD_L: 44,
    PAD_B: 28,
    PAD_T: 12,
    PAD_R: 12,
  },
  RG_ADOPTION: {
    WIDTH: 720,
    HEIGHT: 280,
    PAD_L: 44,
    PAD_B: 26,
    PAD_T: 10,
    PAD_R: 12,
  },
  SPARKLINE_FULL: {
    WIDTH: 720,
    HEIGHT: 180,
    PL: 40,
    PB: 26,
    PT: 10,
    PR: 8,
  },
  SPARKLINE_MINI: {
    WIDTH: 200,
    HEIGHT: 56,
    PL: 40,
    PB: 16,
    PT: 4,
    PR: 8,
  },
});

const HOME_DASHBOARD_DEPOSIT_CONFIG = Object.freeze({
  DEPOSIT_SHARES: { all: 1.00, high: 0.38, med: 0.28, low: 0.34 },
  REDEPOSIT_TIME: {
    all: { '24h': 82, '7d': 104, '30d': 128 },
    high: { '24h': 9, '7d': 11, '30d': 14 },
    med: { '24h': 118, '7d': 148, '30d': 180 },
    low: { '24h': 2240, '7d': 3200, '30d': 4320 },
  },
});

const HOME_DASHBOARD_RG_ADOPTION_TOOLS = Object.freeze({
  'Self-Exclusion': '#DC2626',
  'Deposit Limits': '#D97706',
  '24-Hour Cool-Off': '#0891B2',
  'Account Closure': '#7C3AED',
});

const HOME_DASHBOARD_RG_ADOPTION_SCALES = Object.freeze({
  all: { 'Self-Exclusion': 1.00, 'Deposit Limits': 1.00, '24-Hour Cool-Off': 1.00, 'Account Closure': 1.00 },
  high: { 'Self-Exclusion': 0.38, 'Deposit Limits': 0.09, '24-Hour Cool-Off': 0.14, 'Account Closure': 0.31 },
  med: { 'Self-Exclusion': 0.11, 'Deposit Limits': 0.28, '24-Hour Cool-Off': 0.22, 'Account Closure': 0.07 },
  low: { 'Self-Exclusion': 0.04, 'Deposit Limits': 0.33, '24-Hour Cool-Off': 0.19, 'Account Closure': 0.03 },
});

Object.assign(window, {
  HOME_DASHBOARD_STYLES,
  HOME_DASHBOARD_COLORS,
  HOME_DASHBOARD_CHART_CONFIG,
  HOME_DASHBOARD_DEPOSIT_CONFIG,
});

