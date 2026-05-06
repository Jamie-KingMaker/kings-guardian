// src/utils/format.js
// Pure formatting helpers — no UI, no React.

/**
 * Format a currency amount for BetKing (NGN) or SuperSportBet (ZAR).
 */
export function fmtCurrency(amount, brand) {
  if (brand === 'betking') return '₦' + amount.toLocaleString('en-NG');
  return 'R' + amount.toLocaleString('en-ZA');
}

/**
 * Compact currency — abbreviates to k / M.
 */
export function fmtCompact(amount, brand) {
  const sym = brand === 'betking' ? '₦' : 'R';
  if (amount >= 1_000_000) return sym + (amount / 1_000_000).toFixed(1) + 'M';
  if (amount >= 1_000)     return sym + (amount / 1_000).toFixed(1) + 'k';
  return sym + amount;
}

/**
 * Compact number — abbreviates to k / M with no currency symbol.
 */
export function fmtK(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
  return String(n);
}

/**
 * Compact MAU display — rounds to nearest k/M.
 */
export function fmtMau(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return Math.round(n / 1_000) + 'k';
  return n.toLocaleString();
}

/**
 * Format a percentage with configurable decimals.
 */
export function fmtPct(n, decimals = 1) {
  return n.toFixed(decimals) + '%';
}

/**
 * Redeposit speed minutes → human-readable string.
 */
export function fmtSpeed(m) {
  if (m < 60)   return `${Math.round(m)}m`;
  if (m < 1440) return `${(m / 60).toFixed(1)}h`;
  return `${(m / 1440).toFixed(1)}d`;
}

export function speedSub(m) {
  if (m < 60)   return 'minutes avg';
  if (m < 1440) return 'hours avg';
  return 'days avg';
}

