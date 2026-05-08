// Player Detail - main page component.

const {
  useStatePD,
  KGEnums,
  KGConstants,
  PLAYER_DETAIL_TAB,
  PLAYER_DETAIL_TAB_BUTTON_IDS,
  PLAYER_DETAIL_STAT_KEY,
  buildComponentChildId,
  generatePlayerInsights,
  generateInteractionLog,
  getPlayerChartData,
  MicroStat,
  SpendDepositsCard,
  ProductDistribution,
  SessionTimingChart,
} = window;

function PlayerDetail({ playerId, player: selectedPlayer, onBack }) {
  const COMPONENT_ID = KGEnums.COMPONENT_ID;
  const { getPlayerById, PLAYERS } = window.KGData;
  const player = selectedPlayer || getPlayerById(playerId) || PLAYERS[0];
  const [tab, setTab] = useStatePD(PLAYER_DETAIL_TAB.OVERVIEW);
  const [playerRange, setPlayerRange] = useStatePD(KGEnums.DATE_RANGE.LAST_7_DAYS);

  const insights = generatePlayerInsights(player);
  const interactionLog = generateInteractionLog(player);

  const sd = player.spendDelta || 0;
  const depositsGrowthPct = Math.round(sd * 0.62);
  const betsGrowthPct = Math.round(sd * 0.71);
  const avgDepositPct = Math.max(1, Math.round(sd - depositsGrowthPct));

  const rangePeriodLabel = playerRange === KGEnums.DATE_RANGE.LAST_24_HOURS ? '24h'
    : playerRange === KGEnums.DATE_RANGE.LAST_30_DAYS ? '30d'
    : '7d';
  const rangeLabelFull = playerRange === KGEnums.DATE_RANGE.LAST_24_HOURS ? 'Last 24 hours'
    : playerRange === KGEnums.DATE_RANGE.LAST_30_DAYS ? 'Last 30 days'
    : 'Last 7 days';

  // Shared activity widget used on both Overview and Behaviour tabs
  const ActivityWidget = ({ tall }) => {
    // Derive range-accurate totals from the same chart data the graph uses
    const { spend: spendSeries, dep: depSeries } = getPlayerChartData(player, rangePeriodLabel);
    const scale = rangePeriodLabel === '24h' ? 0.12 : rangePeriodLabel === '7d' ? 0.85 : 1;
    const rangeSpend = Math.round(player.spend * scale);
    const rangeDep   = depSeries.reduce((s, d) => s + d, 0);
    const rangeBets  = Math.round(player.bets * scale);
    const rangeAvgDep = Math.round(rangeSpend / Math.max(rangeDep, 1));

    const gridId = tall ? COMPONENT_ID.PLAYER_DETAIL_BEHAVIOUR_STATS_GRID : COMPONENT_ID.PLAYER_DETAIL_OVERVIEW_STATS_GRID;

    return (
      <div style={{ ...cardStyle }}>
        {/* Single header with one range picker controlling all content */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            Activity · {rangeLabelFull}
          </div>
          <PlayerRangeSelector range={playerRange} setRange={setPlayerRange} />
        </div>

        {/* Micro stats — values and labels update with the range picker */}
        <div id={gridId} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
          <MicroStat componentId={buildComponentChildId(gridId, PLAYER_DETAIL_STAT_KEY.SPEND)}
            label={`Spend / ${rangePeriodLabel}`} value={fmtCompact(rangeSpend, player.brand)} delta={`+${sd}%`} tone="high" />
          <MicroStat componentId={buildComponentChildId(gridId, PLAYER_DETAIL_STAT_KEY.DEPOSITS)}
            label={`Deposits / ${rangePeriodLabel}`} value={rangeDep} delta={`+${depositsGrowthPct}%`} tone="high" />
          <MicroStat componentId={buildComponentChildId(gridId, PLAYER_DETAIL_STAT_KEY.BETS)}
            label={`Bets / ${rangePeriodLabel}`} value={rangeBets} delta={`+${betsGrowthPct}%`} tone="high" />
          <MicroStat componentId={buildComponentChildId(gridId, PLAYER_DETAIL_STAT_KEY.AVG_DEPOSIT)}
            label="Avg deposit" value={fmtCompact(rangeAvgDep, player.brand)} delta={`+${avgDepositPct}%`} tone="medium" />
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#F1F5F9', marginBottom: 16 }} />

        {/* Chart — embedded so it shares this card's shell */}
        <SpendDepositsCard
          embedded
          componentId={tall ? COMPONENT_ID.PLAYER_DETAIL_BEHAVIOUR_SPEND_DEPOSITS_CARD : COMPONENT_ID.PLAYER_DETAIL_OVERVIEW_SPEND_DEPOSITS_CARD}
          player={player} range={playerRange} setRange={setPlayerRange} tall={tall}
        />

        {/* Divider */}
        <div style={{ height: 1, background: '#F1F5F9', margin: '16px 0' }} />

        {/* Product distribution */}
        <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 12 }}>
          Product distribution · {rangeLabelFull}
        </div>
        <ProductDistribution player={player} />
      </div>
    );
  };

  const sevColor = {
    high: KGConstants.RISK_COLORS.high.main,
    medium: KGConstants.RISK_COLORS.medium.main,
    low: KGConstants.RISK_COLORS.low.main,
  };

  const TABS = [
    [PLAYER_DETAIL_TAB.OVERVIEW, 'Overview'],
    [PLAYER_DETAIL_TAB.INSIGHTS, `Risk insights · ${insights.length}`],
    [PLAYER_DETAIL_TAB.BEHAVIOUR, 'Behaviour'],
    [PLAYER_DETAIL_TAB.LOG, `Interaction log · ${interactionLog.length}`],
  ];

  const score = player.riskScore ?? 0;
  const scoreZone = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  const scoreZoneLabel = KGConstants.getRiskTierLabel(scoreZone);
  const scoreColor = scoreZone === 'high' ? '#DC2626' : scoreZone === 'medium' ? '#D97706' : '#16A34A';

  const overviewBody = (
    <div id={COMPONENT_ID.PLAYER_DETAIL_OVERVIEW_PANEL} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div id={COMPONENT_ID.PLAYER_DETAIL_OVERVIEW_RISK_SCORE_CARD} style={{ ...cardStyle, padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1px auto 1px 1fr', gridTemplateRows: 'auto auto', columnGap: 24, rowGap: 8 }}>
          <div style={{ gridColumn: 2, gridRow: '1 / 3', background: '#E2E8F0' }} />
          <div style={{ gridColumn: 4, gridRow: '1 / 3', background: '#E2E8F0' }} />

          <div style={{ gridColumn: 1, gridRow: 1, fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Risk score</div>
          <div style={{ gridColumn: 3, gridRow: 1, fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Current zone</div>
          <div style={{ gridColumn: 5, gridRow: 1, fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Score position</div>

          <div style={{ gridColumn: 1, gridRow: 2, display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 40, fontWeight: 700, color: scoreColor, fontFamily: "'Roboto Mono', monospace", lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 14, color: '#94A3B8' }}>/ 100</span>
          </div>
          <div style={{ gridColumn: 3, gridRow: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ padding: '3px 10px', borderRadius: 4, background: `${scoreColor}15`, color: scoreColor, fontSize: 14, fontWeight: 700 }}>{scoreZoneLabel}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#475569' }}><TrendArrow trend={player.trend} /></span>
          </div>
          <div style={{ gridColumn: 5, gridRow: 2, paddingTop: 10 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', gap: 2 }}>
                <div style={{ width: '40%', background: 'linear-gradient(90deg, #BBF7D0, #86EFAC)', borderRadius: '5px 0 0 5px' }} />
                <div style={{ width: '30%', background: 'linear-gradient(90deg, #FDE68A, #FCA5A5)' }} />
                <div style={{ width: '30%', background: 'linear-gradient(90deg, #FCA5A5, #DC2626)', borderRadius: '0 5px 5px 0' }} />
              </div>
              <div style={{ position: 'absolute', top: -3, left: `calc(${score}% - 7px)`, width: 14, height: 16, borderRadius: 3, background: scoreColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '5px solid white', marginTop: 6 }} />
              </div>
            </div>
            <div style={{ position: 'relative', height: 20, marginTop: 4 }}>
              <span style={{ position: 'absolute', left: 0, fontSize: 11, color: '#16A34A', fontWeight: 600 }}>0 · Low</span>
              <span style={{ position: 'absolute', left: '40%', transform: 'translateX(-50%)', fontSize: 11, color: '#D97706', fontWeight: 600 }}>40 · Medium</span>
              <span style={{ position: 'absolute', left: '70%', transform: 'translateX(-50%)', fontSize: 11, color: '#DC2626', fontWeight: 600 }}>70 · High</span>
              <span style={{ position: 'absolute', right: 0, fontSize: 11, color: '#94A3B8' }}>100</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ActivityWidget />
        </div>

        <div id={COMPONENT_ID.PLAYER_DETAIL_OVERVIEW_EXPLAINABILITY_CARD} style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Why this player is flagged</div>
            <div style={{ fontSize: 16, color: '#0F172A', fontWeight: 600, marginTop: 2 }}>Risk insights · explainability</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {insights.map((ins, idx) => (
              <div key={idx} style={{ padding: '14px 16px', borderBottom: idx < insights.length - 1 ? '1px solid #F1F5F9' : 'none', borderLeft: `3px solid ${sevColor[ins.sev]}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 3, background: `${sevColor[ins.sev]}1A`, color: sevColor[ins.sev], fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{ins.sev} severity</span>
                  <span style={{ fontSize: 13, color: '#94A3B8' }}>{ins.time}</span>
                </div>
                <div style={{ fontSize: 15, color: '#0F172A', fontWeight: 600, marginBottom: 4 }}>{ins.title}</div>
                <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.5 }}>{ins.detail}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '14px 16px', background: 'rgba(245,158,11,0.08)', borderTop: '2px solid rgba(245,158,11,0.35)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>💡</span>
              <div>
                <div style={{ fontSize: 12, color: '#B45309', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>Suggested action</div>
                <div style={{ fontSize: 14, color: '#0F172A', lineHeight: 1.5, fontWeight: 500 }}>Players with this signal pattern often respond well to a deposit-limit conversation.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const insightsBody = (
    <div id={COMPONENT_ID.PLAYER_DETAIL_INSIGHTS_PANEL} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div id={COMPONENT_ID.PLAYER_DETAIL_INSIGHTS_CONTEXT_CARD} style={{ ...cardStyle, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>Risk score</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#DC2626', fontFamily: "'Roboto Mono', monospace" }}>{player.riskScore ?? '—'}<span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 400 }}> / 100</span></div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>Trend</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}><TrendArrow trend={player.trend} />{player.trend ? player.trend.charAt(0).toUpperCase() + player.trend.slice(1) : '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>Active signals</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', fontFamily: "'Roboto Mono', monospace" }}>{(player.signals || []).length}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>Risk bucket</div>
            <div style={{ marginTop: 4 }}><RiskPill level={player.risk} /></div>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${player.riskScore ?? 0}%`, background: player.riskScore >= 70 ? '#DC2626' : player.riskScore >= 40 ? '#D97706' : '#16A34A', borderRadius: 3 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
            <span>{`0 — ${KGConstants.getRiskTierLabel(KGEnums.RISK.LOW)}`}</span><span>{`40 — ${KGConstants.getRiskTierLabel(KGEnums.RISK.MEDIUM)}`}</span><span>{`70 — ${KGConstants.getRiskTierLabel(KGEnums.RISK.HIGH)}`}</span><span>100</span>
          </div>
        </div>
      </div>

      {(player.signals || []).length > 0 && (
        <div id={COMPONENT_ID.PLAYER_DETAIL_INSIGHTS_SIGNALS_CARD} style={{ ...cardStyle, padding: 16 }}>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 12 }}>Active signals</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(player.signals || []).map((s, i) => (
              <span key={i} style={{ padding: '5px 10px', background: '#FEF2F2', color: '#DC2626', borderRadius: 5, fontSize: 13, fontWeight: 600, border: '1px solid #FECACA' }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      <div id={COMPONENT_ID.PLAYER_DETAIL_INSIGHTS_GRID} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {insights.map((ins, idx) => (
          <div key={idx} style={{ ...cardStyle, padding: 0, overflow: 'hidden', borderLeft: `4px solid ${sevColor[ins.sev]}` }}>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 3, background: `${sevColor[ins.sev]}1A`, color: sevColor[ins.sev], fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{ins.sev} severity</span>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>{ins.time}</span>
              </div>
              <div style={{ fontSize: 15, color: '#0F172A', fontWeight: 600, marginBottom: 6 }}>{ins.title}</div>
              <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.55 }}>{ins.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div id={COMPONENT_ID.PLAYER_DETAIL_INSIGHTS_ACTION_CARD} style={{ ...cardStyle, padding: 0, background: 'rgba(245,158,11,0.06)', border: '1.5px solid rgba(245,158,11,0.4)', overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', background: 'rgba(245,158,11,0.12)', borderBottom: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>💡</span>
          <div style={{ fontSize: 13, color: '#92400E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Suggested action</div>
        </div>
        <div style={{ padding: '14px 16px', fontSize: 15, color: '#0F172A', lineHeight: 1.65, fontWeight: 500 }}>
          Players with this signal pattern often respond well to a <strong style={{ color: '#92400E' }}>deposit-limit conversation</strong>. Consider a proactive outreach call to discuss responsible gambling tools. If no contact in 72h, escalate to senior RG officer.
        </div>
      </div>
    </div>
  );

  const behaviourBody = (
    <div id={COMPONENT_ID.PLAYER_DETAIL_BEHAVIOUR_PANEL} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ActivityWidget tall />

      <div id={COMPONENT_ID.PLAYER_DETAIL_BEHAVIOUR_SESSION_TIMING_CARD} style={{ ...cardStyle }}>
        <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 14 }}>Session timing distribution</div>
        <SessionTimingChart player={player} />
      </div>
    </div>
  );

  const logBody = (
    <div id={COMPONENT_ID.PLAYER_DETAIL_LOG_PANEL} style={{ display: 'flex', flexDirection: 'column', gap: 0, ...cardStyle, padding: 0, overflow: 'hidden' }}>
      <div id={COMPONENT_ID.PLAYER_DETAIL_LOG_HEADER} style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Interaction log</div>
          <div style={{ fontSize: 16, color: '#0F172A', fontWeight: 600, marginTop: 2 }}>All recorded actions for this player</div>
        </div>
        <button id={COMPONENT_ID.PLAYER_DETAIL_LOG_ADD_NOTE_BUTTON} style={btnPrimary}><Icon name="note" size={14} /> Add note</button>
      </div>

      {interactionLog.map((entry, idx) => {
        const typeIcon = { auto: '⚙', flag: '⚑', review: '◎', outreach: '☎', note: '✎' }[entry.type] || '•';
        return (
          <div key={idx} style={{ display: 'flex', gap: 16, padding: '18px 20px', borderBottom: idx < interactionLog.length - 1 ? '1px solid #F1F5F9' : 'none', background: idx === 0 ? '#FAFAFA' : '#FFFFFF' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 32 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${entry.badgeColor}15`, border: `2px solid ${entry.badgeColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: entry.badgeColor, flexShrink: 0 }}>{typeIcon}</div>
              {idx < interactionLog.length - 1 && <div style={{ width: 1, flex: 1, background: '#E2E8F0', marginTop: 6 }} />}
            </div>

            <div style={{ flex: 1, paddingBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 3, background: `${entry.badgeColor}15`, color: entry.badgeColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{entry.badge}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{entry.title}</span>
              </div>
              <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.55, marginBottom: 8 }}>{entry.detail}</div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94A3B8' }}>
                <span>{entry.agent}</span>
                <span>{entry.time}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const tabContent = tab === PLAYER_DETAIL_TAB.OVERVIEW
    ? overviewBody
    : tab === PLAYER_DETAIL_TAB.INSIGHTS
      ? insightsBody
      : tab === PLAYER_DETAIL_TAB.BEHAVIOUR
        ? behaviourBody
        : logBody;

  return (
    <div id={COMPONENT_ID.PLAYER_DETAIL_PAGE} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button id={COMPONENT_ID.PLAYER_DETAIL_BACK_BUTTON} onClick={onBack} style={{ background: 'transparent', border: 'none', padding: 0, color: '#64748B', fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', alignSelf: 'flex-start' }}>
        ← Back to player list
      </button>

      <div id={COMPONENT_ID.PLAYER_DETAIL_HEADER_CARD} style={{ ...cardStyle, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 8, background: player.brand === KGEnums.BRAND.BETKING ? '#001041' : '#040B67', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: player.brand === KGEnums.BRAND.BETKING ? '#FFC400' : '#F1C72F', fontWeight: 700 }}>
            {player.brand === KGEnums.BRAND.BETKING ? 'BK' : 'SS'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <h2 style={{ margin: 0, fontSize: 25, fontWeight: 600, color: '#0F172A', fontFamily: "'Roboto Mono', monospace", letterSpacing: '-0.01em' }}>{player.id}</h2>
              <RiskPill level={player.risk} />
              <TrendArrow trend={player.trend} />
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: 14, color: '#64748B' }}>
              <span>{BRAND_ACCENTS[player.brand].name}</span>
              <span>{COUNTRY_NAMES[player.country]}</span>
              <span>Tier {player.tier}</span>
              <span>Active {player.lastActive}</span>
              <span>Customer since Jan 2024</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button id={COMPONENT_ID.PLAYER_DETAIL_ACTION_ADD_NOTE_BUTTON} style={btnSecondary}><Icon name="note" size={14} /> Add note</button>
            <button id={COMPONENT_ID.PLAYER_DETAIL_ACTION_MONITOR_BUTTON} style={{ ...btnSecondary, color: '#D97706', borderColor: 'rgba(217,119,6,0.3)' }}><Icon name="flag" size={14} /> Flag for monitor</button>
            <button id={COMPONENT_ID.PLAYER_DETAIL_ACTION_OUTREACH_BUTTON} style={{ ...btnPrimary, background: '#DC2626' }}><Icon name="flag" size={14} /> Mark for outreach</button>
          </div>
        </div>
      </div>

      <div id={COMPONENT_ID.PLAYER_DETAIL_TAB_LIST} style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E2E8F0' }}>
        {TABS.map(([tabId, label]) => (
          <button id={PLAYER_DETAIL_TAB_BUTTON_IDS[tabId]} key={tabId} onClick={() => setTab(tabId)} style={{ padding: '10px 16px', background: 'transparent', border: 'none', borderBottom: tab === tabId ? '2px solid #0F172A' : '2px solid transparent', color: tab === tabId ? '#0F172A' : '#64748B', fontSize: 15, fontWeight: tab === tabId ? 600 : 500, cursor: 'pointer', fontFamily: 'inherit', marginBottom: -1 }}>
            {label}
          </button>
        ))}
      </div>

      {tabContent}
    </div>
  );
}

Object.assign(window, { PlayerDetail });

