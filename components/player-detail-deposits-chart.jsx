// Player Detail - deposits bar chart.

const { getPlayerChartData: getPlayerChartDataForDeposits } = window;

function DepositsChart({ player, range, tall }) {
  const { dep, labels, escAt } = getPlayerChartDataForDeposits(player, range);
  const W = 600;
  const H = tall ? 200 : 140;
  const PAD_L = 30;
  const PAD_B = 22;
  const PAD_T = 10;
  const iW = W - PAD_L - 8;
  const iH = H - PAD_T - PAD_B;
  const xStep = iW / (dep.length - 1);
  const maxD = Math.max(...dep, 1);
  const barW = Math.max(4, xStep * 0.55);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {[0, 0.5, 1].map((t, i) => <line key={i} x1={PAD_L} y1={PAD_T + iH * t} x2={W - 8} y2={PAD_T + iH * t} stroke="#F1F5F9" />)}
      {dep.map((d, i) => d > 0 && (
        <rect
          key={i}
          x={PAD_L + i * xStep - barW / 2}
          y={PAD_T + iH - (d / maxD) * iH * 0.85}
          width={barW}
          height={(d / maxD) * iH * 0.85}
          fill={i > escAt ? '#DC2626' : '#94A3B8'}
          rx="2"
        />
      ))}
      <line x1={PAD_L + escAt * xStep} y1={PAD_T} x2={PAD_L + escAt * xStep} y2={PAD_T + iH} stroke="#D97706" strokeWidth="1" strokeDasharray="3,3" />
      {labels.map((l, i) => l && <text key={i} x={PAD_L + i * xStep} y={H - 6} fontSize="11" textAnchor="middle" fill="#94A3B8">{l}</text>)}
    </svg>
  );
}

Object.assign(window, { DepositsChart });

