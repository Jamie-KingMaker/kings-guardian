// src/config/constants.js
// Shared visual + domain constants kept as FE config.

export const RISK_COLORS = {
  high:    { main: '#DC2626', bg: 'rgba(220, 38, 38, 0.08)',  border: 'rgba(220, 38, 38, 0.24)',  dim: '#FCA5A5' },
  medium:  { main: '#D97706', bg: 'rgba(217, 119, 6, 0.08)',  border: 'rgba(217, 119, 6, 0.24)',  dim: '#FCD34D' },
  low:     { main: '#16A34A', bg: 'rgba(22, 163, 74, 0.08)',  border: 'rgba(22, 163, 74, 0.24)',  dim: '#86EFAC' },
  unrated: { main: '#64748B', bg: 'rgba(100, 116, 139, 0.08)',border: 'rgba(100, 116, 139, 0.24)',dim: '#CBD5E1' },
};

export const COUNTRY_NAMES = {
  ALL: 'All markets',
  NG:  'Nigeria',
  ZA:  'South Africa',
  ZM:  'Zambia',
};

// Base card style shared across all view cards
export const cardStyle = {
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: 8,
  padding: 18,
};

// Shared button styles
export const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '7px 14px', borderRadius: 6, border: 'none',
  background: '#0F172A', color: '#FFFFFF', fontSize: 14, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'inherit',
};

export const btnSecondary = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '7px 14px', borderRadius: 6,
  background: '#FFFFFF', color: '#334155', fontSize: 14, fontWeight: 500,
  border: '1px solid #E2E8F0',
  cursor: 'pointer', fontFamily: 'inherit',
};

