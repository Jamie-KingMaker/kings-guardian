// Population Risk — King's Guard macro-level population analytics

const { useState: useStatePR, useMemo: useMemoRR } = React;
const { KGConstants } = window;

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtK(n)  { return n >= 1e6 ? (n/1e6).toFixed(2)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'k' : String(n); }
function fmtPct(n, decimals = 1) { return n.toFixed(decimals) + '%'; }
function pct(a, b) { return b ? (a / b * 100) : 0; }

function seededRand(seed) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function PRStatCard({ label, value, sub, delta, deltaLabel, color, pctOfBase }) {
  const up = delta > 0;
  const isHigh = color === '#DC2626';
  const borderColor = color || '#CBD5E1';
  return (
    <div style={{
      background: '#FFFFFF',
      borderWidth: '1px 1px 1px 3px', borderStyle: 'solid',
      borderColor: `#E2E8F0 #E2E8F0 #E2E8F0 ${borderColor}`,
      borderRadius: 8, padding: '14px 16px', flex: 1, minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: borderColor, boxShadow: `0 0 0 2.4px ${borderColor}14`, flexShrink: 0 }} />
        <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</div>
      </div>
      <div style={{ fontSize: 32, fontWeight: 600, color: '#0F172A', lineHeight: 1, letterSpacing: '-0.02em', fontFamily: '"Roboto Mono", monospace', marginBottom: 4 }}>{value}</div>
      {pctOfBase != null && (
        <div style={{ fontSize: 13, color: '#64748B', marginBottom: 4 }}>
          <span style={{ fontWeight: 600, color: borderColor }}>{fmtPct(pctOfBase)}</span> of active base
        </div>
      )}
      {delta != null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: (isHigh ? up : !up) ? '#DC2626' : '#16A34A' }}>
            {up ? '↑' : '↓'} {Math.abs(delta).toLocaleString()}
          </span>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>{deltaLabel}</span>
        </div>
      )}
      {sub && <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function SectionLabel({ title, sub }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>{title}</div>
      {sub && <div style={{ fontSize: 14, color: '#0F172A', fontWeight: 500, marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

// ── Mini sparkline (per signal row) ──────────────────────────────────────────
function MiniSparkline({ values, color }) {
  const W = 80, H = 30;
  if (!values || values.length < 2) return <div style={{ width: W, height: H }} />;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const xStep = W / (values.length - 1);
  const toY = v => 2 + (H - 4) * (1 - (v - min) / range);
  const d = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${(i * xStep).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
  const last = values[values.length - 1];
  const lx = ((values.length - 1) * xStep).toFixed(1);
  const ly = toY(last).toFixed(1);
  return (
    <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
      <circle cx={lx} cy={ly} r="2.5" fill={color} stroke="#fff" strokeWidth="1" />
    </svg>
  );
}

const SIGNAL_META = KGConstants.SIGNAL_META;
const SEVERITY_STYLE = KGConstants.SEVERITY_STYLE;

// ── Main component ────────────────────────────────────────────────────────
function PopulationRisk({ brand, dateRange: dateRangeProp = KGConstants.DATE_RANGE_24H }) {
  const { buildRangeData } = window.KGData;
  const effectiveBrand = (brand === 'all' || !brand) ? null : brand;

  const [dateRange, setDateRange]     = useStatePR(dateRangeProp);
  const [customRange, setCustomRange] = useStatePR(null);

  const effectiveRange = React.useMemo(() => {
    if (dateRange !== 'custom' || !customRange?.start || !customRange?.end) return dateRange || KGConstants.DATE_RANGE_24H;
    const start = new Date(customRange.start);
    const end = new Date(customRange.end);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const days = Math.floor((end - start) / 86400000) + 1;
    return days <= 2 ? KGConstants.DATE_RANGE_24H : days <= 7 ? KGConstants.DATE_RANGE_7D : KGConstants.DATE_RANGE_30D;
  }, [dateRange, customRange]);

  const data = useMemoRR(() => buildRangeData(effectiveRange, effectiveBrand), [effectiveRange, effectiveBrand]);
  const { dist, mau, trend, signals, rgAdoption, statDeltas, dailyVs, rangeLabel, refreshLabel } = data;
  const total = dist.high + dist.med + dist.low + dist.unrated;

  // ── Synthesize per-signal daily counts ────────────────────────────────────
  const signalTrends = useMemoRR(() => {
    if (!trend || trend.length < 2 || !signals) return [];
    return trend.map((day, i) => {
      const rand = seededRand(i * 13 + 77);
      const obj = { d: day.d };
      signals.forEach((s, si) => {
        const progress   = i / (trend.length - 1);
        const trendFactor = 0.68 + progress * 0.64;
        const noise      = 0.88 + rand() * 0.26;
        const rankDecay  = Math.max(0.3, 1 - si * 0.10);
        obj[s.label] = Math.round(s.count * trendFactor * noise * rankDecay);
      });
      return obj;
    });
  }, [trend, signals]);

  // ── Migration flows ────────────────────────────────────────────────────────
  const migrations = useMemoRR(() => {
    if (!trend || trend.length < 2) return null;
    const first = trend[0], last = trend[trend.length - 1];
    const dHigh = last.high - first.high;
    const dMed  = last.med  - first.med;
    return {
      lowToMed:      Math.max(0, Math.round(Math.abs(dMed)  * 0.9  + 1400)),
      medToHigh:     Math.max(0, Math.round(Math.abs(dHigh) * 1.6  +   80)),
      highToMed:     Math.max(0, Math.round(Math.abs(dHigh) * 0.6  +   30)),
      medToLow:      Math.max(0, Math.round(Math.abs(dMed)  * 0.4  +  480)),
      netHighChange: dHigh,
      netMedChange:  dMed,
    };
  }, [trend]);

  // ── Product cohorts ────────────────────────────────────────────────────────
  const productCohorts = useMemoRR(() => [
    { label: KGEnums.PRODUCT.SPORTS,   pct: 63, highPct: 0.4, medPct: 2.8, players: Math.round(total * 0.63) },
    { label: KGEnums.PRODUCT.CASINO,   pct: 29, highPct: 1.2, medPct: 6.4, players: Math.round(total * 0.29) },
    { label: KGEnums.PRODUCT.VIRTUALS, pct:  8, highPct: 0.6, medPct: 3.1, players: Math.round(total * 0.08) },
  ], [total]);

  // ── RG outcomes ───────────────────────────────────────────────────────────
  const rgOutcomes = useMemoRR(() => {
    const totalAdopters = rgAdoption.reduce((s, t) => s + t.count, 0);
    const deEscalated   = Math.round(totalAdopters * 0.61);
    // Deposit Limits, 24-Hour Cool-Off, Self-Exclusion, Account Closure
    const deEscRates    = [58, 71, 88, 94];
    const avgDrops      = [18, 24, 31, 38];
    return {
      totalAdopters,
      deEscalated,
      deEscPct:           pct(deEscalated, totalAdopters),
      avgScoreDrop:       18.4,
      medianDaysToEffect: 12,
      byTool: rgAdoption.map((t, i) => ({ ...t, deEscRate: deEscRates[i] ?? 58, avgDrop: avgDrops[i] ?? 17 })),
    };
  }, [rgAdoption]);

  const dHigh = parseInt((statDeltas.high   || '+0').replace(/[^0-9]/g, '')) * (statDeltas.high?.startsWith('+')   ? 1 : -1);
  const dMed  = parseInt((statDeltas.medium || '+0').replace(/[^0-9]/g, '')) * (statDeltas.medium?.startsWith('+') ? 1 : -1);


  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>
            Population analytics · {rangeLabel} · {data.activeUnit} {mau.toLocaleString()}
          </div>
          <h1 style={{ fontSize: 25, fontWeight: 600, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>Player Behaviours & Trends</h1>
          <p style={{ fontSize: 15, color: '#64748B', margin: '4px 0 0' }}>
            Risk signals, tier migration, product distribution and RG effectiveness.
          </p>
        </div>
        <div style={{ fontSize: 13, color: '#94A3B8', textAlign: 'right' }}>Scores {refreshLabel} · Last refreshed 06:00 today</div>
      </div>

      {/* ── Date range picker ── */}
      <DateRangePicker value={dateRange} onChange={setDateRange} custom={customRange} onCustom={setCustomRange} pageMode />

      {/* ── Stat cards ── */}
      <div style={{ display: 'flex', gap: 10 }}>
        <PRStatCard label="Active Base"       value={fmtK(mau)}                    sub={data.activeUnitFull}                                        color="#0F172A" />
        <PRStatCard label="High Risk"         value={dist.high.toLocaleString()}   pctOfBase={pct(dist.high,    mau)} delta={dHigh}  deltaLabel={dailyVs} color="#DC2626" />
        <PRStatCard label="Medium Risk"       value={dist.med.toLocaleString()}    pctOfBase={pct(dist.med,     mau)} delta={dMed}   deltaLabel={dailyVs} color="#D97706" />
        <PRStatCard label="Low Risk"          value={dist.low.toLocaleString()}    pctOfBase={pct(dist.low,     mau)}                                color="#16A34A" />
        <PRStatCard label="Insufficient Data" value={dist.unrated.toLocaleString()} pctOfBase={pct(dist.unrated, mau)} sub="No behavioural history"  color="#94A3B8" />
      </div>

      {/* ── Risk Signal Leaderboard ── */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <SectionLabel title="Risk Signal Leaderboard" sub={`Behaviours driving escalation — ranked by customers affected, ${rangeLabel}`} />
          {/* Column headers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, paddingRight: 2 }}>
            {[['Trend', 88], ['Customers', 96], ['vs prior', 80], ['Severity', 72]].map(([h, w]) => (
              <div key={h} style={{ width: w, textAlign: 'right', fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {signals.map((s, i) => {
            const meta  = SIGNAL_META[s.label] || { desc: '', severity: 'Medium' };
            const sevStyle = SEVERITY_STYLE[meta.severity] || SEVERITY_STYLE.Medium;
            const sparkVals = signalTrends.map(d => d[s.label] || 0);
            const first = sparkVals[0] || 1;
            const last  = sparkVals[sparkVals.length - 1] || 0;
            const changePct = Math.round(((last - first) / first) * 100);
            const isUp  = changePct >= 0;
            const isHighRisk = meta.severity === 'Critical';
            const changeColor = (isHighRisk ? isUp : !isUp) ? '#16A34A' : '#DC2626';

            return (
              <div key={s.label} style={{
                display: 'flex', alignItems: 'center', gap: 0,
                padding: '12px 0',
                borderBottom: i < signals.length - 1 ? '1px solid #F8FAFC' : 'none',
              }}>
                {/* Rank */}
                <div style={{ width: 36, flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 18, fontWeight: 700, color: i < 2 ? s.color : '#CBD5E1' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Signal name + description */}
                <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.4 }}>{meta.desc}</div>
                </div>

                {/* Sparkline */}
                <div style={{ width: 88, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexShrink: 0 }}>
                  <MiniSparkline values={sparkVals} color={s.color} />
                </div>

                {/* Customer count */}
                <div style={{ width: 96, textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 17, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>
                    {s.count.toLocaleString()}
                  </div>
                </div>

                {/* WoW change */}
                <div style={{ width: 80, textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: changeColor }}>
                    {isUp ? '↑' : '↓'} {Math.abs(changePct)}%
                  </span>
                </div>

                {/* Severity badge */}
                <div style={{ width: 72, display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                    background: sevStyle.bg, color: sevStyle.color,
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}>{sevStyle.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Row: Migration + Product distribution ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Migration flows */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 18 }}>
          <SectionLabel title="Risk Tier Migration" sub={`Customer movement between tiers — ${rangeLabel}`} />
          {migrations && (
            <div>
              {/* Flow diagram */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 16 }}>
                {/* Low box */}
                <div style={{ flex: 1, padding: '12px 10px', background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#16A34A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Low risk</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', fontFamily: "'Roboto Mono', monospace", lineHeight: 1.3 }}>{fmtK(dist.low)}</div>
                </div>

                {/* Arrow Low → Med */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ fontSize: 12, color: '#D97706', fontFamily: "'Roboto Mono', monospace", fontWeight: 700 }}>{migrations.lowToMed.toLocaleString()}</span>
                    <span style={{ color: '#D97706', fontSize: 16 }}>→</span>
                  </div>
                  <div style={{ width: 1, height: 12, background: '#F1F5F9' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ color: '#16A34A', fontSize: 16 }}>←</span>
                    <span style={{ fontSize: 12, color: '#16A34A', fontFamily: "'Roboto Mono', monospace", fontWeight: 700 }}>{migrations.medToLow.toLocaleString()}</span>
                  </div>
                </div>

                {/* Medium box */}
                <div style={{ flex: 1, padding: '12px 10px', background: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#D97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Medium risk</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', fontFamily: "'Roboto Mono', monospace", lineHeight: 1.3 }}>{fmtK(dist.med)}</div>
                </div>

                {/* Arrow Med → High */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ fontSize: 12, color: '#DC2626', fontFamily: "'Roboto Mono', monospace", fontWeight: 700 }}>{migrations.medToHigh.toLocaleString()}</span>
                    <span style={{ color: '#DC2626', fontSize: 16 }}>→</span>
                  </div>
                  <div style={{ width: 1, height: 12, background: '#F1F5F9' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ color: '#D97706', fontSize: 16 }}>←</span>
                    <span style={{ fontSize: 12, color: '#D97706', fontFamily: "'Roboto Mono', monospace", fontWeight: 700 }}>{migrations.highToMed.toLocaleString()}</span>
                  </div>
                </div>

                {/* High box */}
                <div style={{ flex: 1, padding: '12px 10px', background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>High risk</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', fontFamily: "'Roboto Mono', monospace", lineHeight: 1.3 }}>{fmtK(dist.high)}</div>
                </div>
              </div>

              {/* Arrow labels */}
              <div style={{ display: 'flex', fontSize: 11, color: '#94A3B8', marginBottom: 14, gap: 0 }}>
                <div style={{ flex: 1 }} />
                <div style={{ flex: 'none', width: 90, textAlign: 'center', lineHeight: 1.6 }}>
                  <span style={{ color: '#D97706' }}>↑ escalating</span><br/>
                  <span style={{ color: '#16A34A' }}>↓ improving</span>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ flex: 'none', width: 90, textAlign: 'center', lineHeight: 1.6 }}>
                  <span style={{ color: '#DC2626' }}>↑ escalating</span><br/>
                  <span style={{ color: '#D97706' }}>↓ improving</span>
                </div>
                <div style={{ flex: 1 }} />
              </div>

              {/* Net change summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Net high-risk change',    val: migrations.netHighChange, danger: true },
                  { label: 'Net medium-risk change',  val: migrations.netMedChange,  danger: false },
                ].map(({ label, val, danger }) => (
                  <div key={label} style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: 6 }}>
                    <div style={{ fontSize: 12, color: '#64748B', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Roboto Mono', monospace", color: (danger ? val > 0 : val > 0) ? (danger ? '#DC2626' : '#D97706') : '#16A34A' }}>
                      {val > 0 ? '+' : ''}{val.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Risk Distribution */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 18 }}>
          <SectionLabel title="Risk by Product" sub="Risk tier share across betting verticals" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {productCohorts.map((c, i) => {
              const lowPct = +(100 - c.highPct - c.medPct).toFixed(1);
              const highN  = Math.round(c.players * c.highPct / 100);
              const medN   = Math.round(c.players * c.medPct  / 100);
              const lowN   = c.players - highN - medN;
              return (
                <div key={c.label} style={{ padding: '14px 0', borderBottom: i < productCohorts.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{c.label}</span>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{c.players.toLocaleString()} players · {c.pct}% of base</span>
                  </div>
                  {/* Stacked bar */}
                  <div style={{ display: 'flex', height: 14, borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ flex: lowPct,  background: '#86EFAC' }} title={`Low: ${lowPct}%`} />
                    <div style={{ flex: c.medPct, background: '#FCD34D', borderLeft: '1px solid #fff' }} title={`Med: ${c.medPct}%`} />
                    <div style={{ flex: c.highPct,background: '#F87171', borderLeft: '1px solid #fff' }} title={`High: ${c.highPct}%`} />
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {[
                      { color: '#86EFAC', textColor: '#16A34A', label: 'Low',    pctVal: lowPct,   n: lowN  },
                      { color: '#FCD34D', textColor: '#D97706', label: 'Medium', pctVal: c.medPct, n: medN  },
                      { color: '#F87171', textColor: '#DC2626', label: 'High',   pctVal: c.highPct,n: highN },
                    ].map(({ color, textColor, label, pctVal, n }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: '#64748B' }}>{label} <strong style={{ color: textColor }}>{pctVal}%</strong></span>
                        <span style={{ fontSize: 12, color: '#CBD5E1' }}>({n.toLocaleString()})</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Casino callout */}
          <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: 6 }}>
            <div style={{ fontSize: 13, color: '#DC2626', fontWeight: 600 }}>
              Casino has 3× the high-risk concentration of Sports
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
              Multi-product players (sports + casino) make up 67% of the high-risk cohort.
            </div>
          </div>
        </div>
      </div>

      {/* ── RG Tool Adoption & Outcomes ── */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>

          {/* Adoption */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionLabel title="RG Tool Adoption" sub="Active players using responsible gambling tools" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {rgOutcomes.byTool.map((t, i) => (
                <div key={t.tool} style={{ padding: '12px 0', borderBottom: i < rgOutcomes.byTool.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <span style={{ fontSize: 14, color: '#0F172A', fontWeight: 500 }}>{t.tool}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 12, color: '#16A34A', fontWeight: 600 }}>↑ {t.delta}% {dailyVs}</span>
                      <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 15, fontWeight: 700, color: '#059669' }}>{t.count.toLocaleString()}</span>
                    </div>
                  </div>
                  <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(t.count / rgOutcomes.byTool[0].count) * 100}%`, background: '#059669', borderRadius: 3, opacity: 0.55 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: '10px 14px', background: '#F0FDF4', borderRadius: 6, border: '1px solid #BBF7D0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, color: '#15803D', fontWeight: 700 }}>{rgOutcomes.totalAdopters.toLocaleString()} total active tool users</div>
                <div style={{ fontSize: 12, color: '#166534', marginTop: 1 }}>{fmtPct(pct(rgOutcomes.totalAdopters, dist.high + dist.med))} of high + medium risk base</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, background: '#F1F5F9', alignSelf: 'stretch', margin: '0 22px', flexShrink: 0 }} />

          {/* Outcomes */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionLabel title="RG Tool Outcomes" sub="Effectiveness of tools in reducing customer risk" />

            {/* Headline outcome stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
              {[
                { label: 'De-escalated after adoption',  value: rgOutcomes.deEscalated.toLocaleString(), sub: fmtPct(rgOutcomes.deEscPct) + '% of adopters',       color: '#16A34A' },
                { label: 'Avg risk score reduction',     value: '−' + rgOutcomes.avgScoreDrop + ' pts',   sub: 'within 30 days of activation',                    color: '#059669' },
                { label: 'Median days to de-escalate',   value: rgOutcomes.medianDaysToEffect + ' days',  sub: 'from tool activation to tier drop',                color: '#0891B2' },
                { label: 'High-risk who improved',       value: fmtPct(pct(Math.round(rgOutcomes.deEscalated * 0.23), dist.high)), sub: 'moved to medium or low',  color: '#7C3AED' },
              ].map(stat => (
                <div key={stat.label} style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: 6 }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{stat.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: stat.color, fontFamily: "'Roboto Mono', monospace", lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 3 }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Per-tool de-escalation rate */}
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>De-escalation rate by tool</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {rgOutcomes.byTool.map(t => (
                <div key={t.tool} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 13, color: '#475569', minWidth: 130, flexShrink: 0 }}>{t.tool}</div>
                  <div style={{ flex: 1, height: 7, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${t.deEscRate}%`, background: '#16A34A', borderRadius: 4, opacity: 0.65 }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#16A34A', minWidth: 36, textAlign: 'right', fontFamily: "'Roboto Mono', monospace" }}>{t.deEscRate}%</div>
                  <div style={{ fontSize: 12, color: '#94A3B8', minWidth: 64 }}>avg −{t.avgDrop} pts</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center' }}>
        Scores recompute {refreshLabel} · Model v3.2 · Outcome metrics based on current selected range
      </div>
    </div>
  );
}

Object.assign(window, { PopulationRisk });
