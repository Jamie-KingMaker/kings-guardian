// Home Dashboard RG Copilot Component
// AI-powered insights card with risk filtering

const { KGEnums, KGConstants } = window;
const { HOME_DASHBOARD_STYLES, HOME_DASHBOARD_COMPONENT_IDS, HOME_DASHBOARD_INSIGHTS_TONES } = window;
const { BRAND_THEME, COUNTRY_NAMES } = window;
const { parseAIInsight } = window;

const { TAB_CONTAINER, TAB_BUTTON_ACTIVE, TAB_BUTTON_INACTIVE } = HOME_DASHBOARD_STYLES;

/**
 * RGCopilotCard Component - AI-powered responsible gambling insights
 * Responsibility: Fetch and display AI-generated insights with risk filtering
 * Follows Single Responsibility Principle: Only handles AI insights display, not data generation
 */
function RGCopilotCard({
  brand,
  country,
  rangeLabel,
  dist,
  total,
  mau,
  sd,
  rangeData,
  component_id = HOME_DASHBOARD_COMPONENT_IDS.RG_COPILOT_CARD
}) {
  const [insights, setInsights] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [regen, setRegen] = React.useState(0);
  const [riskFilter, setRiskFilter] = React.useState(null); // null | 'high' | 'medium' | 'low'
  const reqIdRef = React.useRef(0);

  const brandLabel = brand === KGEnums.BRAND.ALL ? 'KingMakers Portfolio' :
    (BRAND_THEME[brand]?.name || brand);
  const countryLabel = country === KGEnums.COUNTRY.ALL ? 'all markets' :
    country === KGEnums.COUNTRY.NG ? COUNTRY_NAMES.NG :
    country === KGEnums.COUNTRY.ZA ? COUNTRY_NAMES.ZA :
    country === KGEnums.COUNTRY.ZM ? COUNTRY_NAMES.ZM : country;

  React.useEffect(() => {
    const reqId = ++reqIdRef.current;
    setLoading(true);
    setError(false);

    const pct = (n) => (n / total * 100).toFixed(1);
    const depositTotal = brand === KGEnums.BRAND.SUPERSPORTBET ? rangeData.depositTotalSS : rangeData.depositTotal;
    const topSignals = (rangeData.signals || []).slice(0, 3).map((s) => `${s.label} ${s.share}%`).join(', ');
    const topMover = (rangeData.movers || [])[0];

    const filterDirective = riskFilter ?
      `\nFOCUS FILTER: Generate callouts SPECIFICALLY about ${riskFilter}-risk players (${riskFilter === KGEnums.RISK.HIGH ? 'score 80+, escalation candidates' : riskFilter === KGEnums.RISK.MEDIUM ? 'score 50–79, monitor & nudge' : 'score <50, healthy but watch for upward migration'}). All 5 callouts must address this segment — patterns within it, notable movers into/out of it, deposit & session signals from it, recommended actions for the team. Do not pivot to other risk levels unless directly comparing.` :
      '';

    const prompt = `You are an internal Responsible Gambling analyst writing a daily morning brief for the King's Guard platform at KingMakers. Your audience is the CS + RG operations team.

Generate exactly 5 short callouts tailored to the time window "${rangeLabel}" and these live numbers:

- Operator: ${brandLabel} (${countryLabel})
- Active base: ${mau.toLocaleString()} ${rangeData.activeUnitFull}
- Risk-monitored: ${total.toLocaleString()}
- ${KGConstants.getRiskTierLabel(KGEnums.RISK.HIGH)}: ${dist.high.toLocaleString()} (${pct(dist.high)}%) — ${sd.high} ${sd.dailyVs}
- ${KGConstants.getRiskTierLabel(KGEnums.RISK.MEDIUM)}: ${dist.med.toLocaleString()} (${pct(dist.med)}%) — ${sd.med} ${sd.dailyVs}
- ${KGConstants.getRiskTierLabel(KGEnums.RISK.LOW)}: ${dist.low.toLocaleString()} (${pct(dist.low)}%) — ${sd.low} ${sd.dailyVs}
- Insufficient data: ${dist.unrated.toLocaleString()} (${pct(dist.unrated)}%)
- Deposit volume ${rangeLabel}: ${depositTotal.toLocaleString()} (${rangeData.depositGrowth}% ${rangeData.deltaLabel})
- Risk-trend growth: ${rangeData.trendGrowthPct}% ${rangeLabel}
- Top signals driving alerts: ${topSignals}
${topMover ? `- Notable mover: ${topMover.id} risk score now ${topMover.riskScore} (was ${topMover.riskFrom}); insight "${topMover.insight}"` : ''}${filterDirective}

Each callout MUST:
- Start with a 2-4 word punchy title in **bold markdown** followed by a colon, then a single sentence ≤ 22 words.
- Anchor to the ${rangeLabel} window — say "this week", "over the last 30 days", "quarter-to-date", etc. as appropriate.
- Reference at least one specific number from the data above.
- Suggest a concrete next action OR call out a pattern worth investigating.

Tone: calm, professional, operational. No emojis. No preamble. No closing summary. Output exactly 5 bullets, each on its own line, prefixed with "- ".`;

    window.claude.complete(prompt).
      then((text) => {
        if (reqIdRef.current !== reqId) return;
        const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('-') || l.startsWith('•'));
        const parsed = lines.slice(0, 5).map((l) => l.replace(/^[-•]\s*/, ''));
        if (parsed.length === 0) {
          setError(true);
        } else {
          setInsights(parsed);
        }
        setLoading(false);
      }).
      catch(() => {
        if (reqIdRef.current !== reqId) return;
        setError(true);
        setLoading(false);
      });
  }, [brand, country, rangeLabel, dist.high, dist.med, dist.low, dist.unrated, mau, regen, riskFilter]);

  const tones = [
    HOME_DASHBOARD_INSIGHTS_TONES.RISK,
    HOME_DASHBOARD_INSIGHTS_TONES.PATTERN,
    HOME_DASHBOARD_INSIGHTS_TONES.TREND,
    HOME_DASHBOARD_INSIGHTS_TONES.SIGNAL,
    HOME_DASHBOARD_INSIGHTS_TONES.ACTION,
  ];

  return (
    <div id={component_id} style={{
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)',
      border: '1px solid #E2E8F0', borderRadius: 10,
      padding: 18, boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Subtle accent corner */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 140, height: 140,
        background: 'radial-gradient(circle at top right, rgba(99,102,241,0.08), transparent 70%)',
        pointerEvents: 'none'
      }}></div>

      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 10, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: 'linear-gradient(135deg, #6366F1, #4338CA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFFFFF', fontSize: 15, fontWeight: 700,
            boxShadow: '0 2px 6px rgba(67,56,202,0.25)', flexShrink: 0
          }}>★</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              King's Guard AI
            </div>
          </div>
        </div>
        {/* Risk-bucket filter */}
        <div style={TAB_CONTAINER}>
          {[
            { id: null, label: 'Overview', dot: null },
            { id: KGEnums.RISK.HIGH, label: 'High', dot: '#DC2626' },
            { id: KGEnums.RISK.MEDIUM, label: 'Medium', dot: '#D97706' },
            { id: KGEnums.RISK.LOW, label: 'Low', dot: '#16A34A' }
          ].map((opt) => {
            const active = riskFilter === opt.id;
            return (
              <button
                key={String(opt.id)}
                onClick={() => setRiskFilter(opt.id)}
                disabled={loading}
                style={active ? TAB_BUTTON_ACTIVE(opt.dot || '#0F172A') : TAB_BUTTON_INACTIVE}>
                {opt.dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />}
                {opt.label}
              </button>);
          })}
        </div>
      </div>

      {/* Vertical list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'relative' }}>
        {loading && [0, 1, 2, 3, 4].map((i) =>
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 0', borderBottom: i < 4 ? '1px solid #F1F5F9' : 'none'
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: tones[i % 3].bar, opacity: 0.6, flexShrink: 0 }}></div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ height: 9, width: '32%', borderRadius: 3, background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)', backgroundSize: '200% 100%', animation: 'kg-shimmer 1.4s linear infinite' }}></div>
              <div style={{ height: 7, width: '88%', borderRadius: 3, background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)', backgroundSize: '200% 100%', animation: 'kg-shimmer 1.4s linear infinite' }}></div>
            </div>
          </div>
        )}

        {!loading && error &&
          <div style={{ fontSize: 14, color: '#94A3B8', padding: '24px 0', textAlign: 'center', border: '1px dashed #E2E8F0', borderRadius: 8 }}>
            Insights unavailable — try a different range or hit Regenerate.
          </div>
        }

        {!loading && !error && insights && insights.map((txt, i) => {
          const { title, body } = parseAIInsight(txt);
          const t = tones[i] || tones[2];
          const isLast = i === insights.length - 1;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '12px 0', borderBottom: isLast ? 'none' : '1px solid #F1F5F9'
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 52, padding: '3px 0', borderRadius: 3, background: t.tag, color: t.tagText,
                fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                flexShrink: 0, marginTop: 2
              }}>{t.label}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {title &&
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.005em', marginBottom: 3 }}>
                    {title}
                  </div>
                }
                <div style={{ fontSize: 12.5, lineHeight: 1.5, color: '#334155', textWrap: 'pretty' }}>
                  {body}
                </div>
              </div>
            </div>);

        })}
        <style>{`@keyframes kg-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      </div>
    </div>
  );
}

Object.assign(window, { RGCopilotCard });


