// src/components/atoms/RiskDot.jsx
import { RISK_COLORS } from '@/config/constants.js';

export function RiskDot({ level, size = 8 }) {
  const c = RISK_COLORS[level] ?? RISK_COLORS.unrated;
  return (
    <span style={{
      display: 'inline-block', width: size, height: size, borderRadius: '50%',
      background: c.main, boxShadow: `0 0 0 ${size * 0.4}px ${c.bg}`, flexShrink: 0,
    }} />
  );
}

