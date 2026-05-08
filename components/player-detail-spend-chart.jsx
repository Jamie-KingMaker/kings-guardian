// Player Detail - spend line chart.

const { getPlayerChartData } = window;

function SpendChart({ player, range, tall }) {
  const { spend, labels, escAt, escLabel } = getPlayerChartData(player, range);
  const W = 600;
  const H = tall ? 200 : 140;
  const PAD_L = 30;
  const PAD_B = 22;
  const PAD_T = 10;
  const max = Math.max(...spend);
  const iW = W - PAD_L - 8;
  const iH = H - PAD_T - PAD_B;
  const xStep = iW / (spend.length - 1);
  const path = spend.map((v, i) => `${i === 0 ? 'M' : 'L'}${PAD_L + i * xStep},${PAD_T + iH - (v / max) * iH}`).join(' ');
  const area = `${path} L${PAD_L + (spend.length - 1) * xStep},${PAD_T + iH} L${PAD_L},${PAD_T + iH}Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {[0, 0.5, 1].map((t, i) => <line key={i} x1={PAD_L} y1={PAD_T + iH * t} x2={W - 8} y2={PAD_T + iH * t} stroke="#F1F5F9" />)}
      <path d={area} fill="#0F172A" fillOpacity="0.06" />
      <path d={path} fill="none" stroke="#0F172A" strokeWidth="1.5" />
      <line x1={PAD_L + escAt * xStep} y1={PAD_T} x2={PAD_L + escAt * xStep} y2={PAD_T + iH} stroke="#D97706" strokeWidth="1" strokeDasharray="3,3" />
      <text x={PAD_L + escAt * xStep + 4} y={PAD_T + 10} fontSize="10" fill="#D97706" fontWeight="600">{escLabel}</text>
      {labels.map((l, i) => l && <text key={i} x={PAD_L + i * xStep} y={H - 6} fontSize="11" textAnchor="middle" fill="#94A3B8">{l}</text>)}
    </svg>
  );
}

Object.assign(window, { SpendChart });

