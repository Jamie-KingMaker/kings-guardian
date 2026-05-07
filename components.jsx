// Shared atoms for King's Guard

const { KGEnums, KGConstants } = window;

const {
  RISK_COLORS,
  RISK_LABELS,
  BRAND_ACCENTS,
  BRAND_THEME,
  COUNTRY_NAMES,
} = KGConstants;

function RiskDot({ level, size = 8 }) {
  const c = RISK_COLORS[level] || RISK_COLORS.unrated;
  return (
    <span style={{
      display: 'inline-block', width: size, height: size, borderRadius: '50%',
      background: c.main, boxShadow: `0 0 0 ${size * 0.4}px ${c.bg}`, flexShrink: 0,
    }}></span>
  );
}

function RiskPill({ level, dense }) {
  const c = RISK_COLORS[level] || RISK_COLORS.unrated;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: dense ? '2px 8px' : '4px 10px',
      borderRadius: 4,
      background: c.bg,
      color: c.main,
      border: `1px solid ${c.border}`,
      fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
      lineHeight: 1, whiteSpace: 'nowrap',
    }}>
      <RiskDot level={level} size={6} />
      {RISK_LABELS[level]}
    </span>
  );
}

function TrendArrow({ trend }) {
  if (!trend) return <span style={{ color: '#94A3B8' }}>—</span>;
  const map = {
    [KGEnums.TREND.UP]: { icon: '↗', color: '#DC2626', label: 'Increasing' },
    [KGEnums.TREND.STABLE]: { icon: '→', color: '#64748B', label: 'Stable' },
    [KGEnums.TREND.DOWN]: { icon: '↘', color: '#16A34A', label: 'Decreasing' },
  };
  const t = map[trend];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: t.color, fontSize: 14, fontWeight: 600 }}>
      <span style={{ fontSize: 16, lineHeight: 1 }}>{t.icon}</span>
      {t.label}
    </span>
  );
}

function Sparkline({ data, color = '#0F172A', height = 28, width = 96, fill = true }) {
  if (!data || data.length < 2) return <svg width={width} height={height} />;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 2) - 1;
    return [x, y];
  });
  const path = points.map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`)).join(' ');
  const area = `${path} L ${width},${height} L 0,${height} Z`;
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      {fill && <path d={area} fill={color} fillOpacity="0.08" />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function fmtCurrency(amount, brand) {
  // BetKing = NGN, SuperSportBet = ZAR
  if (brand === KGEnums.BRAND.BETKING) {
    return '₦' + amount.toLocaleString('en-NG');
  }
  return 'R' + amount.toLocaleString('en-ZA');
}

function fmtCompact(amount, brand) {
  const sym = brand === KGEnums.BRAND.BETKING ? '₦' : 'R';
  if (amount >= 1000000) return sym + (amount / 1000000).toFixed(1) + 'M';
  if (amount >= 1000) return sym + (amount / 1000).toFixed(1) + 'k';
  return sym + amount;
}

function getBrandTheme(brand) {
  return BRAND_THEME[brand] || BRAND_THEME.all;
}


// Crown / Shield icon — original mark for King's Guard
function GuardLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2 L27 7 V14 C27 21 22 26.5 16 30 C10 26.5 5 21 5 14 V7 Z"
        fill="#0F172A" stroke="#F59E0B" strokeWidth="1.2" />
      <path d="M11 12 L13.5 9.5 L16 12 L18.5 9.5 L21 12 L20.5 17 H11.5 Z"
        fill="#F59E0B" />
      <circle cx="11" cy="11.5" r="0.9" fill="#F59E0B" />
      <circle cx="16" cy="11.5" r="0.9" fill="#F59E0B" />
      <circle cx="21" cy="11.5" r="0.9" fill="#F59E0B" />
      <rect x="11.5" y="17.5" width="9" height="1.5" fill="#F59E0B" />
      <path d="M14 20 H18 V25 L16 26.5 L14 25 Z" fill="#F59E0B" opacity="0.9" />
    </svg>
  );
}

// Tiny line icons (stroke-only)
function Icon({ name, size = 16, color = 'currentColor' }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home': return <svg {...props}><path d="M3 11 12 3 21 11"/><path d="M5 10v10h14V10"/></svg>;
    case 'players': return <svg {...props}><circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/><circle cx="17" cy="8" r="2.5"/><path d="M22 19c0-2.6-1.7-4.5-4-5.2"/></svg>;
    case 'list': return <svg {...props}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case 'chart': return <svg {...props}><path d="M3 21V5"/><path d="M21 21H3"/><path d="M7 17v-4M11 17V9M15 17v-7M19 17v-3"/></svg>;
    case 'shield': return <svg {...props}><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9.5 4.5-1 8-4.5 8-9.5V6Z"/></svg>;
    case 'log': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'export': return <svg {...props}><path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 21h14"/></svg>;
    case 'search': return <svg {...props}><circle cx="11" cy="11" r="6"/><path d="m20 20-3.5-3.5"/></svg>;
    case 'bell': return <svg {...props}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15Z"/><path d="M10 21h4"/></svg>;
    case 'help': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 1-1 1.7v.5"/><circle cx="12" cy="17" r="0.6" fill={color} stroke="none"/></svg>;
    case 'down': return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case 'up': return <svg {...props}><path d="m6 15 6-6 6 6"/></svg>;
    case 'arrow-right': return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'flag': return <svg {...props}><path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/></svg>;
    case 'note': return <svg {...props}><path d="M5 4h11l4 4v12H5z"/><path d="M9 10h7M9 14h7M9 18h4"/></svg>;
    case 'refresh': return <svg {...props}><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/></svg>;
    case 'filter': return <svg {...props}><path d="M3 5h18l-7 8v6l-4-2v-4Z"/></svg>;
    case 'settings': return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>;
    case 'sort': return <svg {...props}><path d="M7 4v16M3 8l4-4 4 4"/><path d="M17 20V4M13 16l4 4 4-4"/></svg>;
    case 'trending': return <svg {...props}><path d="M3 17 9 11l4 4 8-8"/><path d="M14 7h7v7"/></svg>;
    default: return null;
  }
}

Object.assign(window, {
  RISK_COLORS, RiskDot, RiskPill, TrendArrow, Sparkline,
  fmtCurrency, fmtCompact, BRAND_ACCENTS, BRAND_THEME, getBrandTheme, COUNTRY_NAMES,
  GuardLogo, Icon,
});
