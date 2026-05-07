// Home Dashboard Utility Functions
// Extracted helpers following Single Responsibility Principle

const { KGEnums, KGConstants } = window;

/**
 * Format number as abbreviated string (e.g., 1.2M, 450k)
 */
function formatMAU(n) {
  return n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' :
         n >= 1000 ? Math.round(n / 1000) + 'k' :
         n.toLocaleString();
}

/**
 * Calculate percentage with fixed decimals
 */
function calcPercentage(n, total) {
  return (n / total * 100).toFixed(1);
}

/**
 * Format value as compact currency representation
 */
function formatCompactValue(v) {
  return v >= 1000000 ? (v / 1000000).toFixed(1) + 'M' :
         v >= 1000 ? (v / 1000).toFixed(1) + 'k' :
         v;
}

/**
 * Format minutes as human-readable time (e.g., "42m", "2.5h", "3.2d")
 */
function formatRedepositsSpeed(m) {
  return m < 60 ? `${Math.round(m)}m` :
         m < 1440 ? `${(m / 60).toFixed(1)}h` :
         `${(m / 1440).toFixed(1)}d`;
}

/**
 * Get label for redeposit speed (e.g., "minutes avg", "hours avg")
 */
function getRedepositsSpeedLabel(m) {
  return m < 60 ? 'minutes avg' :
         m < 1440 ? 'hours avg' :
         'days avg';
}

/**
 * Format risk color for chart visualization
 */
function getRiskChartColor(risk) {
  const colorMap = {
    high: '#DC2626',
    med: '#D97706',
    low: '#16A34A',
    medium: '#D97706',
  };
  return colorMap[risk] || '#94A3B8';
}

/**
 * Get risk level from tone/status
 */
function getToneRiskLevel(tone) {
  if (tone === KGEnums.RISK.HIGH) return KGEnums.RISK.HIGH;
  if (tone === KGEnums.RISK.MEDIUM || tone === 'medium') return KGEnums.RISK.MEDIUM;
  if (tone === KGEnums.RISK.LOW) return KGEnums.RISK.LOW;
  return KGEnums.RISK.UNRATED;
}

/**
 * Generate date labels based on time range and granularity
 */
function generateDateLabels(data, rangeKey) {
  const numPts = data.length;
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const isHourlyRange = rangeKey === KGConstants.DATE_RANGE_24H;

  return data.map((_, i) => {
    if (isHourlyRange) {
      const d = new Date(2026, 4, 6, 23, 0, 0, 0);
      d.setHours(d.getHours() - (numPts - 1 - i));
      return `${String(d.getHours()).padStart(2, '0')}:00`;
    }

    const d = new Date(2026, 4, 6);
    d.setDate(d.getDate() - (numPts - 1 - i));
    return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  });
}

/**
 * Calculate normalized min/max/range for scaling
 */
function calculateDataScale(values) {
  const mn = Math.min(...values);
  const mx = Math.max(...values);
  const rng = mx - mn || 1;
  return { mn, mx, rng };
}

/**
 * Build SVG path data for line and area charts
 */
function buildSVGPathData(values, PAD_L, PAD_T, innerW, innerH, mn, rng) {
  const denom = values.length - 1 || 1;
  const pts = values.map((v, i) => [
    PAD_L + (i / denom) * innerW,
    PAD_T + innerH - ((v - mn) / rng) * innerH,
  ]);
  const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${pts[pts.length-1][0].toFixed(1)},${PAD_T+innerH} L${PAD_L},${PAD_T+innerH} Z`;
  return { pts, line, area };
}

/**
 * Generate grid line values for chart Y-axis
 */
function generateGridValues(min, max, steps = 5) {
  const range = max - min || 1;
  const step = range / (steps - 1);
  return Array.from({ length: steps }, (_, i) => Math.round(min + step * i));
}

/**
 * Determine label positions for X-axis (sparse labels to avoid crowding)
 */
function calculateLabelIndices(numPts, maxLabels = 6) {
  const xLabelStep = Math.max(1, Math.ceil((numPts - 1) / maxLabels));
  const labelSet = new Set(Array.from({ length: numPts }, (_, i) => i).filter(i => i % xLabelStep === 0));
  labelSet.add(numPts - 1);
  return labelSet;
}

/**
 * Parse AI-generated insights - extract title and body from markdown format
 */
function parseAIInsight(txt) {
  const m = txt.match(/^\*\*(.+?)\*\*\s*:?\s*(.*)$/);
  if (m) return { title: m[1].replace(/[.:]+$/, ''), body: m[2] };
  return { title: null, body: txt };
}

/**
 * Build country share calculation for MAU distribution
 */
function calculateCountryShare(brand, country, MAU, MAU_TOTALS) {
  let countryShare = 1;
  if (brand === KGEnums.BRAND.SUPERSPORTBET && country === KGEnums.COUNTRY.ZA) {
    countryShare = MAU[KGEnums.BRAND.SUPERSPORTBET].ZA / MAU_TOTALS[KGEnums.BRAND.SUPERSPORTBET];
  } else if (brand === KGEnums.BRAND.SUPERSPORTBET && country === KGEnums.COUNTRY.ZM) {
    countryShare = MAU[KGEnums.BRAND.SUPERSPORTBET].ZM / MAU_TOTALS[KGEnums.BRAND.SUPERSPORTBET];
  }
  return countryShare;
}

/**
 * Simple deterministic hash for consistent pseudo-random values
 */
function hashString(str) {
  return str.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0xFFFF, 0);
}

Object.assign(window, {
  formatMAU,
  calcPercentage,
  formatCompactValue,
  formatRedepositsSpeed,
  getRedepositsSpeedLabel,
  getRiskChartColor,
  getToneRiskLevel,
  generateDateLabels,
  calculateDataScale,
  buildSVGPathData,
  generateGridValues,
  calculateLabelIndices,
  parseAIInsight,
  calculateCountryShare,
  hashString,
});

