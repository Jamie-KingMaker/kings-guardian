// Player Detail - historical behaviour trend chart.

const { pdSeeded, playerSeed, KGEnums } = window;

function BehaviourChart({ player, tall }) {
  const rnd = pdSeeded(playerSeed(player.id));
  const days = 30;
  const escalationDay = 18 + Math.floor(rnd() * 6);
  const depositFreq = player.risk === KGEnums.RISK.HIGH ? 0.55 : player.risk === KGEnums.RISK.MEDIUM ? 0.30 : 0.15;
  const spend = Array.from({ length: days }, (_, i) => {
    const trend = 70 + Math.sin(i * (0.35 + rnd() * 0.1)) * 15;
    const escalate = i > escalationDay ? (i - escalationDay) * (20 + rnd() * 20) : 0;
    const noise = (rnd() - 0.5) * 8;
    return Math.max(10, trend + escalate + noise);
  });
  const dep = Array.from({ length: days }, (_, i) => (
    rnd() < (i > escalationDay ? depositFreq * 2 : depositFreq) ? 1 + Math.floor(rnd() * 3) : 0
  ));

  const W = 600;
  const H = tall ? 240 : 180;
  const PAD_L = 30;
  const PAD_B = 22;
  const PAD_T = 8;
  const max = Math.max(...spend);
  const innerW = W - PAD_L - 8;
  const innerH = H - PAD_T - PAD_B;
  const xStep = innerW / (days - 1);
  const path = spend.map((v, i) => {
    const x = PAD_L + i * xStep;
    const y = PAD_T + innerH - (v / max) * innerH;
    return (i === 0 ? 'M' : 'L') + x + ',' + y;
  }).join(' ');
  const area = path + ` L${PAD_L + (days - 1) * xStep},${PAD_T + innerH} L${PAD_L},${PAD_T + innerH}Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {[0, 0.5, 1].map((t, i) => (
        <line key={i} x1={PAD_L} y1={PAD_T + innerH * t} x2={W - 8} y2={PAD_T + innerH * t} stroke="#F1F5F9" />
      ))}
      <path d={area} fill="#0F172A" fillOpacity="0.06" />
      <path d={path} fill="none" stroke="#0F172A" strokeWidth="1.5" />
      {dep.map((d, i) => d > 0 && (
        <rect key={i} x={PAD_L + i * xStep - 1.5} y={PAD_T + innerH - d * 12} width="3" height={d * 12} fill="#DC2626" rx="1" />
      ))}
      <line x1={PAD_L + escalationDay * xStep} y1={PAD_T} x2={PAD_L + escalationDay * xStep} y2={PAD_T + innerH} stroke="#D97706" strokeWidth="1" strokeDasharray="3,3" />
      <text x={PAD_L + escalationDay * xStep + 4} y={PAD_T + 10} fontSize="11" fill="#D97706" fontWeight="600">Risk score: medium -> high</text>
      {[0, 7, 14, 21, 29].map(i => (
        <text key={i} x={PAD_L + i * xStep} y={H - 6} fontSize="11" textAnchor="middle" fill="#94A3B8">
          {i === 0 ? '30d ago' : i === 29 ? 'Today' : `D-${29 - i}`}
        </text>
      ))}
    </svg>
  );
}

Object.assign(window, { BehaviourChart });

