// src/utils/dateRange.js
// Date helpers shared between DateRangePicker and API calls.

export function fmtMonthYear(d) {
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

export function fmtShort(d) {
  if (!d) return '';
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
}

export function sameDay(a, b) {
  return (
    a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

export function diffDays(a, b) {
  return Math.round((b - a) / 86_400_000);
}

/**
 * Map a custom date range to the nearest preset key.
 */
export function customRangeToPreset(customRange) {
  if (!customRange?.start || !customRange?.end) return '7d';
  const days = Math.round((customRange.end - customRange.start) / 86_400_000) + 1;
  if (days <= 10)  return '7d';
  if (days <= 22)  return '14d';
  if (days <= 60)  return '30d';
  if (days <= 120) return '90d';
  return 'ytd';
}

export const DATE_PRESETS = [
  { v: '7d',  label: 'Last 7 days'  },
  { v: '14d', label: 'Last 14 days' },
  { v: '30d', label: 'Last 30 days' },
  { v: 'ytd', label: 'Year to date' },
];

