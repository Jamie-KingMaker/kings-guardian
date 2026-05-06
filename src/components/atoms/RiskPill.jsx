// src/components/atoms/RiskPill.jsx
import { RISK_COLORS } from '@/config/constants.js';
import { RiskDot }     from './RiskDot.jsx';

const LABELS = { high: 'High', medium: 'Medium', low: 'Low', unrated: 'Unrated' };

export function RiskPill({ level, dense }) {
  const c = RISK_COLORS[level] ?? RISK_COLORS.unrated;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: dense ? '2px 8px' : '4px 10px',
      borderRadius: 4,
      background: c.bg, color: c.main,
      border: `1px solid ${c.border}`,
      fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
      lineHeight: 1, whiteSpace: 'nowrap',
    }}>
      <RiskDot level={level} size={6} />
      {LABELS[level]}
    </span>
  );
}

