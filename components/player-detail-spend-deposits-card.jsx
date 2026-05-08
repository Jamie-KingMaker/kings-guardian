// Player Detail - combined spend and deposits card.

const {
  getPlayerChartData: getPlayerChartDataForSpendDeposits,
  buildComponentChildId: buildChildIdForSpendDeposits,
  PlayerRangeSelector: PlayerRangeSelectorForSpendDeposits,
} = window;

function SpendDepositsCard({ player, range, setRange, tall, componentId, embedded }) {
  const { spend, dep, labels, escAt, escLabel } = getPlayerChartDataForSpendDeposits(player, range);
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);

  const fmtY = (v) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`);

  React.useEffect(() => {
    if (!canvasRef.current || !window.Chart) return undefined;

    const spendDataset = {
      type: 'line',
      label: 'Spend',
      data: spend,
      yAxisID: 'ySpend',
      borderColor: '#0F172A',
      backgroundColor: 'rgba(15, 23, 42, 0.08)',
      borderWidth: 2,
      tension: 0.35,
      fill: true,
      pointRadius: 2,
      pointHoverRadius: 4,
      pointBackgroundColor: '#0F172A',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 1.5,
      order: 1,
    };

    const depositDataset = {
      type: 'bar',
      label: 'Deposits',
      data: dep,
      yAxisID: 'yDeposits',
      backgroundColor: dep.map((value, index) => {
        if (!value) return 'rgba(148, 163, 184, 0.28)';
        return index >= escAt ? 'rgba(220, 38, 38, 0.88)' : 'rgba(148, 163, 184, 0.85)';
      }),
      borderRadius: 4,
      barPercentage: range === '24h' ? 0.88 : 0.62,
      categoryPercentage: range === '24h' ? 0.92 : 0.8,
      order: 2,
    };

    const chartConfig = {
      type: 'bar',
      data: {
        labels,
        datasets: [spendDataset, depositDataset],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F172A',
            titleFont: { family: "'Roboto Mono', monospace", size: 11, weight: '600' },
            bodyFont: { size: 12 },
            padding: 10,
            callbacks: {
              label(context) {
                if (context.dataset.label === 'Spend') {
                  return `Spend: ${fmtCompact(Math.round(context.parsed.y || 0), player.brand)}`;
                }
                return `Deposits: ${context.parsed.y || 0}`;
              },
            },
          },
        },
        scales: {
          ySpend: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            grid: { color: '#E2E8F0', drawBorder: false },
            ticks: {
              color: '#94A3B8',
              font: { family: "'Roboto Mono', monospace", size: 11 },
              callback: (value) => fmtY(value),
            },
          },
          yDeposits: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            grid: { drawOnChartArea: false, drawBorder: false },
            ticks: {
              precision: 0,
              stepSize: 1,
              color: '#CBD5E1',
              font: { family: "'Roboto Mono', monospace", size: 10 },
            },
          },
          x: {
            grid: { display: false, drawBorder: false },
            ticks: {
              color: '#94A3B8',
              maxRotation: 0,
              autoSkip: false,
              font: { family: "'Roboto Mono', monospace", size: 11 },
            },
          },
        },
      },
    };

    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new window.Chart(canvasRef.current, chartConfig);

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [player.id, player.brand, range, tall, labels, spend, dep, escAt]);

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

  const chartBody = (
    <>
      {/* Mini stat summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
        {miniCard('Total spend', fmtCompact(player.spend, player.brand), `+${sd}% vs prior`, '#0F172A')}
        {miniCard('Deposits', totalDep, `+${depositsGrowthPct}% vs prior`, '#DC2626')}
        {miniCard('Avg deposit', fmtCompact(Math.round(player.spend / Math.max(player.deposits, 1)), player.brand), 'per transaction', null)}
      </div>

      {/* Legend */}
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

      <div style={{ marginBottom: 10, fontSize: 12, color: '#D97706', fontWeight: 600 }}>
        {escLabel} around {labels[escAt] || 'current window'}
      </div>

      <div style={{ position: 'relative', height: tall ? 260 : 220 }}>
        <canvas ref={canvasRef} />
      </div>
    </>
  );

  // embedded = rendered inside an outer ActivityWidget card (no own card shell or header)
  if (embedded) return <div id={componentId}>{chartBody}</div>;

  return (
    <div id={componentId} style={{ ...cardStyle }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
        <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, flexShrink: 0 }}>
          Spend &amp; Deposits · {rangeLabelMap[range]}
        </div>
        <PlayerRangeSelectorForSpendDeposits range={range} setRange={setRange} componentId={buildChildIdForSpendDeposits(componentId, 'range-selector')} />
      </div>
      {chartBody}
    </div>
  );
}

Object.assign(window, { SpendDepositsCard });

