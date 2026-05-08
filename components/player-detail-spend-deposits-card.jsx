// Player Detail - combined spend and deposits card.

const {
  getPlayerChartData: getPlayerChartDataForSpendDeposits,
  buildComponentChildId: buildChildIdForSpendDeposits,
  PlayerRangeSelector: PlayerRangeSelectorForSpendDeposits,
} = window;

function SpendDepositsCard({ player, range, setRange, tall, componentId }) {
  const { spend, dep, labels, escAt, escLabel } = getPlayerChartDataForSpendDeposits(player, range);

  const W = 600;
  const H = tall ? 240 : 180;
  const PAD_L = 36;
  const PAD_B = 24;
  const PAD_T = 10;
  const PAD_R = 8;
  const iW = W - PAD_L - PAD_R;
  const iH = H - PAD_T - PAD_B;

  const maxSpend = Math.max(...spend);
  const minSpend = Math.min(...spend);
  const spendRng = maxSpend - minSpend || 1;
  const xStep = iW / (spend.length - 1);

  const spendPts = spend.map((v, i) => [
    PAD_L + i * xStep,
    PAD_T + iH - ((v - minSpend) / spendRng) * iH,
  ]);
  const spendLine = spendPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const spendArea = `${spendLine} L${spendPts[spendPts.length - 1][0].toFixed(1)},${PAD_T + iH} L${PAD_L},${PAD_T + iH}Z`;

  const maxDep = Math.max(...dep, 1);
  const barMaxH = iH * 0.30;
  const barW = Math.max(4, xStep * 0.52);

  const gridVals = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(minSpend + spendRng * (1 - t)));
  const fmtY = v => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`);

  const rangeLabelMap = { '24h': 'Last 24 hours', '7d': 'Last 7 days', '30d': 'Last 30 days' };
  const sd = player.spendDelta || 0;
  const depositsGrowthPct = Math.round(sd * 0.62);
  const totalDep = dep.reduce((s, d) => s + d, 0);

  const miniCard = (label, value, sub, accentColor) => (
    <div style={{ padding: '10px 12px', borderRadius: 6, background: accentColor ? `${accentColor}08` : '#F8FAFC', border: `1px solid ${accentColor ? `${accentColor}20` : '#F1F5F9'}` }}>
      <div style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: accentColor || '#0F172A', fontFamily: "'Roboto Mono', monospace", letterSpacing: '-0.01em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 3 }}>{sub}</div>
    </div>
  );

  return (
    <div id={componentId} style={{ ...cardStyle }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
        <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, flexShrink: 0 }}>
          Spend &amp; Deposits · {rangeLabelMap[range]}
        </div>
        <PlayerRangeSelectorForSpendDeposits range={range} setRange={setRange} componentId={buildChildIdForSpendDeposits(componentId, 'range-selector')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
        {miniCard('Total spend', fmtCompact(player.spend, player.brand), `+${sd}% vs prior`, '#0F172A')}
        {miniCard('Deposits', totalDep, `+${depositsGrowthPct}% vs prior`, '#DC2626')}
        {miniCard('Avg deposit', fmtCompact(Math.round(player.spend / Math.max(player.deposits, 1)), player.brand), 'per transaction', null)}
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 8 }}>
        {[
          { label: 'Spend', color: '#0F172A', isBar: false },
          { label: 'Deposits', color: '#DC2626', isBar: true },
        ].map(({ label, color, isBar }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {isBar
              ? <div style={{ width: 10, height: 10, background: color, borderRadius: 2, flexShrink: 0 }} />
              : <div style={{ width: 18, height: 2, background: color, borderRadius: 1, flexShrink: 0 }} />
            }
            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {gridVals.map((v, i) => {
          const y = PAD_T + iH - ((v - minSpend) / spendRng) * iH;
          return (
            <g key={i}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#E2E8F0" strokeWidth="1" />
              <text x={PAD_L - 4} y={y + 4} fontSize="11" textAnchor="end" fill="#94A3B8" fontFamily="'Roboto Mono', monospace">{fmtY(v)}</text>
            </g>
          );
        })}

        <path d={spendArea} fill="#0F172A" fillOpacity="0.06" />
        <path d={spendLine} fill="none" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={spendPts[spendPts.length - 1][0]} cy={spendPts[spendPts.length - 1][1]} r="3" fill="#0F172A" stroke="#fff" strokeWidth="1.5" />

        {dep.map((d, i) => d > 0 && (
          <rect
            key={i}
            x={PAD_L + i * xStep - barW / 2}
            y={PAD_T + iH - (d / maxDep) * barMaxH}
            width={barW}
            height={(d / maxDep) * barMaxH}
            fill={i > escAt ? '#DC2626' : '#94A3B8'}
            rx="2"
            fillOpacity="0.85"
          />
        ))}

        <line x1={PAD_L + escAt * xStep} y1={PAD_T} x2={PAD_L + escAt * xStep} y2={PAD_T + iH} stroke="#D97706" strokeWidth="1" strokeDasharray="3,3" />
        <text x={PAD_L + escAt * xStep + 4} y={PAD_T + 10} fontSize="10" fill="#D97706" fontWeight="600">{escLabel}</text>

        {labels.map((l, i) => l && (
          <text key={i} x={PAD_L + i * xStep} y={H - 6} fontSize="11" textAnchor={i === 0 ? 'start' : i === spend.length - 1 ? 'end' : 'middle'} fill="#94A3B8">{l}</text>
        ))}
      </svg>
    </div>
  );
}

Object.assign(window, { SpendDepositsCard });

