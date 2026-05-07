// Interaction Log — King's Guard CS Agent audit trail

const { useState: useStateIL, useMemo: useMemoIL } = React;
const { KGEnums, KGConstants } = window;

// ── Type config ───────────────────────────────────────────────────────────────
const IL_TYPES = KGConstants.INTERACTION_TYPE_CFG;
const IL_OUTCOMES = KGConstants.INTERACTION_OUTCOME_CFG;
const IL_TYPE_FILTER_OPTIONS = [
  ['all', 'All types'],
  [KGEnums.INTERACTION_TYPE.OUTREACH, IL_TYPES[KGEnums.INTERACTION_TYPE.OUTREACH].label],
  [KGEnums.INTERACTION_TYPE.STATUS_CHANGE, 'Status'],
  [KGEnums.INTERACTION_TYPE.NOTE, 'Notes'],
  [KGEnums.INTERACTION_TYPE.AUTOMATED, 'Auto'],
  [KGEnums.INTERACTION_TYPE.RG_TOOL, IL_TYPES[KGEnums.INTERACTION_TYPE.RG_TOOL].label],
  [KGEnums.INTERACTION_TYPE.LIMIT_SET, 'Limits'],
];
const IL_TYPE_FORM_OPTIONS = [
  KGEnums.INTERACTION_TYPE.OUTREACH,
  KGEnums.INTERACTION_TYPE.STATUS_CHANGE,
  KGEnums.INTERACTION_TYPE.NOTE,
  KGEnums.INTERACTION_TYPE.RG_TOOL,
  KGEnums.INTERACTION_TYPE.LIMIT_SET,
  KGEnums.INTERACTION_TYPE.COOLING_OFF,
  KGEnums.INTERACTION_TYPE.SELF_EXCLUDED,
];
const IL_OUTCOME_FORM_OPTIONS = [
  KGEnums.INTERACTION_OUTCOME.CONTACTED,
  KGEnums.INTERACTION_OUTCOME.NO_ANSWER,
  KGEnums.INTERACTION_OUTCOME.VOICEMAIL,
  KGEnums.INTERACTION_OUTCOME.EMAIL_SENT,
  KGEnums.INTERACTION_OUTCOME.ESCALATED,
  KGEnums.INTERACTION_OUTCOME.DECLINED,
];

// ── Mock data ─────────────────────────────────────────────────────────────────
// Only log-specific fields are stored here (no risk/tier — those live solely in
// window.KGData.PLAYERS / window.KGData.AGENTS and are merged in at runtime by
// enrichLogEntry()).
const IL_DATA_SEED = [
  // May 5
  { id: 1,  ts: '2026-05-05T10:14', player: 'BK-4827193', agentId: 'amaka-n', type: KGEnums.INTERACTION_TYPE.OUTREACH,      desc: 'Called player regarding rapid re-deposit pattern (3 deposits within 12 min of session loss). Player acknowledged concern and agreed to review current limits.', outcome: 'contacted' },
  { id: 2,  ts: '2026-05-05T09:55', player: 'BK-3918274', agentId: 'system',  type: 'automated',     desc: 'Score escalated 58 → 81. Trigger: 3 consecutive rapid re-deposits within 15 minutes of session end, deposit frequency up 162% vs prior 7d.', outcome: null },
  { id: 3,  ts: '2026-05-05T09:47', player: 'BK-3918274', agentId: 'james-t', type: 'status-change', desc: 'Status updated: Monitoring → Outreach Recommended. Score crossed 80 threshold, re-deposit speed now 8 min avg.', outcome: null },
  { id: 4,  ts: '2026-05-05T09:31', player: 'BK-5804359', agentId: 'sarah-o', type: KGEnums.INTERACTION_TYPE.OUTREACH,      desc: 'Email sent following two missed call attempts. Included link to deposit limit settings and RG resources page.', outcome: 'email-sent' },
  { id: 5,  ts: '2026-05-05T09:12', player: 'BK-9188862', agentId: 'system',  type: 'automated',     desc: 'Late-night session alert: 4.2 hours continuous play between 01:00–05:12. No self-imposed breaks detected.', outcome: null },
  { id: 6,  ts: '2026-05-05T08:58', player: 'BK-2847362', agentId: 'amaka-n', type: 'note',          desc: 'Player contacted support requesting info on deposit limits. Directed to limit-setting flow. Monitoring for follow-through — flagged for review in 48h.', outcome: null },
  // May 4
  { id: 7,  ts: '2026-05-04T17:43', player: 'BK-4827193', agentId: 'amaka-n', type: 'status-change', desc: 'Status updated: Outreach Recommended → Outreach Completed. Successful call made, player receptive.', outcome: null },
  { id: 8,  ts: '2026-05-04T17:22', player: 'BK-1736294', agentId: 'james-t', type: KGEnums.INTERACTION_TYPE.OUTREACH,      desc: 'Second call attempt — no answer. Left voicemail with RG support line number. Will retry tomorrow 09:00.', outcome: 'voicemail' },
  { id: 9,  ts: '2026-05-04T16:55', player: 'BK-7382918', agentId: 'system',  type: 'automated',     desc: 'Spend spike detected: ₦142,000 deposited across 7 transactions today, 2× daily average. Score increased 18 points.', outcome: null },
  { id: 10, ts: '2026-05-04T16:30', player: 'BK-7382918', agentId: 'sarah-o', type: 'status-change', desc: 'Status updated: No status → Flagged for Monitoring. Score 74, rising trend, no prior contact on record.', outcome: null },
  { id: 11, ts: '2026-05-04T15:04', player: 'BK-4873494', agentId: 'chidi-e', type: 'note',          desc: 'Escalated to supervisor review. Player has declined two outreach attempts and made 6 deposits in the past 4 hours. Considering formal RG intervention pathway.', outcome: null },
  { id: 12, ts: '2026-05-04T14:48', player: 'BK-4873494', agentId: 'amaka-n', type: KGEnums.INTERACTION_TYPE.OUTREACH,      desc: 'Second call attempt — player picked up but ended the call immediately. Attempt logged.', outcome: 'declined' },
  { id: 13, ts: '2026-05-04T13:22', player: 'BK-9374821', agentId: 'james-t', type: 'rg-tool',       desc: 'Player guided through deposit limit configuration during call. Set a ₦50,000/day limit. Player stated they find this helpful.', outcome: null },
  { id: 14, ts: '2026-05-04T13:05', player: 'BK-9374821', agentId: 'james-t', type: 'status-change', desc: 'Status updated: Outreach Recommended → RG Tool Suggested. Deposit limit now active.', outcome: null },
  { id: 15, ts: '2026-05-04T12:41', player: 'BK-8287974', agentId: 'sarah-o', type: KGEnums.INTERACTION_TYPE.OUTREACH,      desc: 'Spoke with player for 11 minutes. Player stated they are aware of their behaviour and plan to take a break this weekend. No tool adoption at this time.', outcome: 'contacted' },
  { id: 16, ts: '2026-05-04T11:18', player: 'BK-3321643', agentId: 'system',  type: 'automated',     desc: 'Sports → Casino product migration detected. Player shifted 78% of bets to Casino in the past 3 days — leading indicator pattern.', outcome: null },
  { id: 17, ts: '2026-05-04T10:55', player: 'BK-3321643', agentId: 'amaka-n', type: 'status-change', desc: 'Status updated: No status → Under Review. Product migration pattern noted, monitoring escalation signals.', outcome: null },
  { id: 18, ts: '2026-05-04T10:30', player: 'BK-2398779', agentId: 'system',  type: 'automated',     desc: 'Failed deposit attempts spike: 9 failed attempts in 2 hours. Pattern may indicate payment workaround behaviour.', outcome: null },
   // May 3
  { id: 19, ts: '2026-05-03T16:44', player: 'BK-7336219', agentId: 'james-t', type: KGEnums.INTERACTION_TYPE.OUTREACH,      desc: 'Outreach call placed — no answer. SMS sent as backup with RG helpline.', outcome: 'no-answer' },
  { id: 20, ts: '2026-05-03T15:55', player: 'BK-9188862', agentId: 'amaka-n', type: KGEnums.INTERACTION_TYPE.OUTREACH,      desc: 'Called player. They confirmed they had been playing more than usual due to a stressful period at work. Provided emotional support script and offered cooling-off option.', outcome: 'contacted' },
  { id: 21, ts: '2026-05-03T15:42', player: 'BK-9188862', agentId: 'amaka-n', type: 'cooling-off',   desc: 'Player elected a 72-hour cooling-off period during the call. Status updated accordingly.', outcome: null },
  { id: 22, ts: '2026-05-03T15:40', player: 'BK-9188862', agentId: 'amaka-n', type: 'status-change', desc: 'Status updated: Outreach Recommended → Cooling Off. Player self-initiated cooling-off period.', outcome: null },
  { id: 23, ts: '2026-05-03T14:20', player: 'BK-4252587', agentId: 'sarah-o', type: 'note',          desc: 'Inbound support call — player asked how to set a loss limit. Assisted through the process. Limit of ₦30,000/session now active.', outcome: null },
  { id: 24, ts: '2026-05-03T14:18', player: 'BK-4252587', agentId: 'sarah-o', type: 'limit-set',     desc: 'Loss limit of ₦30,000/session set following inbound support request. Player-initiated.', outcome: null },
  { id: 25, ts: '2026-05-03T13:00', player: 'BK-6735223', agentId: 'chidi-e', type: KGEnums.INTERACTION_TYPE.OUTREACH,      desc: 'Supervisor-led call given VIP tier and score of 85. Player denied concern, stated recent deposit volumes are due to a windfall. Escalation note added.', outcome: 'contacted' },
  { id: 26, ts: '2026-05-03T12:55', player: 'BK-6735223', agentId: 'chidi-e', type: 'note',          desc: 'Player claims higher deposits this period are from a salary bonus. Inconsistent with 3am session pattern. Score remains 85. Continue monitoring — revisit if score increases further.', outcome: null },
  { id: 27, ts: '2026-05-03T11:35', player: 'BK-1769791', agentId: 'james-t', type: KGEnums.INTERACTION_TYPE.OUTREACH,      desc: 'Spoke to player briefly — they asked to be called back tomorrow. Agreed on 10:00 window.', outcome: 'contacted' },
  { id: 28, ts: '2026-05-03T10:02', player: 'BK-9838926', agentId: 'system',  type: 'automated',     desc: 'Burst deposit cluster: 5 deposits in 28 minutes totalling ₦95,000. Highest single-session deposit velocity this player has recorded.', outcome: null },
  // May 2
  { id: 29, ts: '2026-05-02T17:15', player: 'BK-4873494', agentId: 'amaka-n', type: KGEnums.INTERACTION_TYPE.OUTREACH,      desc: 'First outreach attempt — no answer. Voicemail not available. Email queued.', outcome: 'no-answer' },
  { id: 30, ts: '2026-05-02T16:50', player: 'BK-4873494', agentId: 'system',  type: 'automated',     desc: 'Score escalated 61 → 79. Three failed deposit attempts followed by two large successful deposits. Flagged for immediate review.', outcome: null },
  { id: 31, ts: '2026-05-02T15:30', player: 'BK-1736294', agentId: 'james-t', type: KGEnums.INTERACTION_TYPE.OUTREACH,      desc: 'First call attempt. No answer. Scheduled follow-up for May 4.', outcome: 'no-answer' },
  { id: 32, ts: '2026-05-02T14:44', player: 'BK-5804359', agentId: 'sarah-o', type: KGEnums.INTERACTION_TYPE.OUTREACH,      desc: 'Called player. Discussed RG options. Player said they would think about it. No commitment made. Follow-up email sent.', outcome: 'contacted' },
  { id: 33, ts: '2026-05-02T13:15', player: 'BK-9838926', agentId: 'amaka-n', type: 'status-change', desc: 'Status updated: No status → Outreach Recommended. Score 77, burst deposits flagged by automated rule.', outcome: null },
  { id: 34, ts: '2026-05-02T11:30', player: 'BK-7882145', agentId: 'system',  type: 'automated',     desc: 'Self-exclusion request received via support chat. Processed automatically and ingested from product platform.', outcome: null },
  { id: 35, ts: '2026-05-02T11:30', player: 'BK-7882145', agentId: 'system',  type: 'self-excluded', desc: 'Player self-excluded via product platform. 30-day exclusion period active. Account access suspended.', outcome: null },
  // May 1
  { id: 36, ts: '2026-05-01T16:20', player: 'BK-2398779', agentId: 'chidi-e', type: KGEnums.INTERACTION_TYPE.OUTREACH,      desc: 'Supervisor outreach. Player expressed frustration with losses but declined any intervention tools. Agreed to a 48-hour pause on contact.', outcome: 'declined' },
  { id: 37, ts: '2026-05-01T15:55', player: 'BK-2398779', agentId: 'chidi-e', type: 'note',          desc: 'Player has declined RG intervention twice. Behaviour consistent with denial pattern. Recommend regulatory disclosure notice if score reaches 90+.', outcome: null },
  { id: 38, ts: '2026-05-01T14:00', player: 'BK-1769791', agentId: 'sarah-o', type: 'rg-tool',       desc: 'Player set a ₦20,000/day deposit limit following nudge in app. No agent contact required — limit adoption tracked from platform event.', outcome: null },
  { id: 39, ts: '2026-05-01T13:40', player: 'BK-1769791', agentId: 'sarah-o', type: 'status-change', desc: 'Status updated: Outreach Recommended → Deposit Limit Set. Player adopted tool without direct outreach.', outcome: null },
  { id: 40, ts: '2026-05-01T11:25', player: 'BK-3918274', agentId: 'system',  type: 'automated',     desc: 'Deposit frequency spike: 8 deposits in 6 hours. Score rose from 42 → 58. Moved to medium-risk bucket.', outcome: null },
  // Apr 30
  { id: 41, ts: '2026-04-30T17:05', player: 'BK-4827193', agentId: 'james-t', type: KGEnums.INTERACTION_TYPE.OUTREACH,      desc: 'Outreach call placed per scheduled follow-up. Player did not answer. Rescheduled for May 4.', outcome: 'no-answer' },
  { id: 42, ts: '2026-04-30T15:35', player: 'BK-9374821', agentId: 'system',  type: 'automated',     desc: 'Score crossed 75 threshold. Re-deposit velocity now averaging 14 minutes — well within high-risk criteria.', outcome: null },
  { id: 43, ts: '2026-04-30T15:20', player: 'BK-9374821', agentId: 'amaka-n', type: 'status-change', desc: 'Status updated: Under Review → Outreach Recommended. Score 76, pattern escalating.', outcome: null },
  { id: 44, ts: '2026-04-30T14:10', player: 'BK-6735223', agentId: 'system',  type: 'automated',     desc: 'VIP crossover alert: Tier 6 player entered high-risk bucket. Flagged for supervisor-led outreach per protocol.', outcome: null },
  { id: 45, ts: '2026-04-30T12:00', player: 'BK-5804359', agentId: 'james-t', type: 'status-change', desc: 'Status updated: No status → Outreach Recommended following consecutive high-score days.', outcome: null },
  // Apr 29
  { id: 46, ts: '2026-04-29T16:45', player: 'BK-8287974', agentId: 'system',  type: 'automated',     desc: 'Re-deposit pattern: player re-deposited within 5 minutes of depleting balance on 4 separate occasions today.', outcome: null },
  { id: 47, ts: '2026-04-29T15:10', player: 'BK-7336219', agentId: 'amaka-n', type: 'status-change', desc: 'Status updated: No status → Flagged for Monitoring. Score 79, persistent chasing-loss signals.', outcome: null },
  { id: 48, ts: '2026-04-29T14:35', player: 'BK-4827193', agentId: 'sarah-o', type: KGEnums.INTERACTION_TYPE.OUTREACH,      desc: 'First outreach attempt for this escalation cycle. Player receptive — confirmed awareness of high recent spend. Agreed to explore limits.', outcome: 'contacted' },
  { id: 49, ts: '2026-04-29T13:00', player: 'BK-4827193', agentId: 'sarah-o', type: 'status-change', desc: 'Status updated: Flagged → Outreach Recommended. Score at 89, highest on record for this player.', outcome: null },
  { id: 50, ts: '2026-04-29T10:22', player: 'BK-4252587', agentId: 'system',  type: 'automated',     desc: 'Late-night activity shift: 63% of bets placed between 23:00–03:00 this week, up from 21% prior week.', outcome: null },
];

function fmtRelTime(ts) {
  const then = new Date(ts);
  const now = new Date('2026-05-05T12:00:00');
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  const days = Math.floor(diff / 86400);
  return `${days}d ago`;
}

function fmtAbsTime(ts) {
  return new Date(ts).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// ── Main component ────────────────────────────────────────────────────────────
function buildPlayerMap() {
  return (window.KGData && window.KGData.PLAYER_MAP) || {};
}

function buildAgentMap() {
  return (window.KGData && window.KGData.AGENT_MAP) || {};
}

function findAgentIdByLabel(agentMap, label) {
  const match = Object.values(agentMap).find(agent => agent.label === label);
  return match ? match.id : 'system';
}

function enrichLogEntry(entry, playerMap, agentMap) {
  const p = (window.KGData && window.KGData.getPlayerById && window.KGData.getPlayerById(entry.player)) || playerMap[entry.player];
  const agentId = entry.agentId || findAgentIdByLabel(agentMap, entry.agent);
  const agent = (window.KGData && window.KGData.getAgentById && window.KGData.getAgentById(agentId)) || agentMap[agentId] || agentMap.system || { id: 'system', label: 'System', initials: '⚙', kind: 'system' };
  return {
    ...entry,
    agentId,
    agentName: agent.label,
    agentInitials: agent.initials,
    agentKind: agent.kind,
    risk: p ? p.risk : KGEnums.RISK.HIGH,
    tier: p ? p.tier : 5,
  };
}

function InteractionLog({ brand, country, onPlayerClick }) {
  const [typeFilter, setTypeFilter]   = useStateIL('all');
  const [agentFilter, setAgentFilter] = useStateIL('all');
  const [riskFilter, setRiskFilter]   = useStateIL('all');
  const [search, setSearch]           = useStateIL('');
  const [showForm, setShowForm]       = useStateIL(false);
  const [showAll, setShowAll]         = useStateIL(false);

  // Enrich seed data once: merge risk + tier from PLAYERS by player ID.
  const playerMap = useMemoIL(() => buildPlayerMap(), []);
  const agentMap = useMemoIL(() => buildAgentMap(), []);
  const [entries, setEntries] = useStateIL(() =>
    IL_DATA_SEED.map(e => enrichLogEntry(e, playerMap, agentMap))
  );
  const agents = useMemoIL(() => ((window.KGData && window.KGData.getSelectableAgents && window.KGData.getSelectableAgents()) || (window.KGData && window.KGData.AGENTS) || []), []);

  const filtered = useMemoIL(() => {
    return entries.filter(e => {
      const searchValue = search.toLowerCase();
      const matchesSearch = !searchValue || e.player.toLowerCase().includes(searchValue) || e.desc.toLowerCase().includes(searchValue);

      return (typeFilter === 'all' || e.type === typeFilter) &&
        (agentFilter === 'all' || e.agentId === agentFilter) &&
        (riskFilter === 'all' || e.risk === riskFilter) &&
        matchesSearch;
    });
  }, [entries, typeFilter, agentFilter, riskFilter, search]);

  const displayed = showAll ? filtered : filtered.slice(0, 20);

  // Summary stats
  const stats = useMemoIL(() => {
    const all = entries;
    const outreachEntries = all.filter(e => e.type === KGEnums.INTERACTION_TYPE.OUTREACH);
    const contacted = outreachEntries.filter(e => e.outcome === 'contacted');
    const autoFlags = all.filter(e => e.type === 'automated');
    return {
      total: all.length,
      outreach: outreachEntries.length,
      contactRate: outreachEntries.length ? Math.round(contacted.length / outreachEntries.length * 100) : 0,
      autoFlags: autoFlags.length,
    };
  }, [entries]);

  const addEntry = (entry) => {
    const enriched = enrichLogEntry(
      { ...entry, id: Date.now(), ts: new Date().toISOString() },
      playerMap,
      agentMap
    );
    setEntries(prev => [enriched, ...prev]);
    setShowForm(false);
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>
            Agent activity · Last 7 days
          </div>
          <h1 style={{ fontSize: 25, fontWeight: 600, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>Interaction Log</h1>
          <p style={{ fontSize: 15, color: '#64748B', margin: '4px 0 0' }}>
            Full audit trail of CS agent and system interactions with monitored players.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{ ...btnPrimary, display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          + Log interaction
        </button>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Total interactions', value: stats.total, sub: 'across all types', color: '#0F172A' },
          { label: 'Outreach attempts',  value: stats.outreach, sub: 'calls & messages sent', color: '#0891B2' },
          { label: 'Contact rate',       value: stats.contactRate + '%', sub: 'of outreach reached player', color: '#16A34A' },
          { label: 'Auto flags raised',  value: stats.autoFlags, sub: 'by behavioural model', color: '#D97706' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1, marginBottom: 3 }}>{value}</div>
            <div style={{ fontSize: 13, color: '#94A3B8' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 12px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '5px 10px' }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><circle cx="7" cy="7" r="5" stroke="#94A3B8" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search player or keyword…"
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#0F172A', width: 200, fontFamily: 'inherit' }}
          />
          {search && <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0, fontSize: 14, lineHeight: 1 }}>×</button>}
        </div>

        <div style={{ width: 1, height: 20, background: '#E2E8F0' }}></div>

        {/* Type filter */}
        <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 6, padding: 2, gap: 2 }}>
          {IL_TYPE_FILTER_OPTIONS.map(([v, l]) => (
            <button key={v} onClick={() => setTypeFilter(v)} style={{
              padding: '4px 9px', borderRadius: 4, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 12, fontWeight: 600,
              background: typeFilter === v ? '#FFFFFF' : 'transparent',
              color: typeFilter === v ? '#0F172A' : '#64748B',
              boxShadow: typeFilter === v ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>{l}</button>
          ))}
        </div>

        <div style={{ width: 1, height: 20, background: '#E2E8F0' }}></div>

        {/* Agent filter */}
        <select value={agentFilter} onChange={e => setAgentFilter(e.target.value)} style={{
          padding: '5px 8px', borderRadius: 5, border: '1px solid #E2E8F0', background: '#FFFFFF',
          fontSize: 13, fontWeight: 600, color: '#475569', fontFamily: 'inherit', cursor: 'pointer',
        }}>
          <option value="all">All agents</option>
          {[...(window.KGData && window.KGData.AGENTS ? window.KGData.AGENTS : agents)].map(agent => <option key={agent.id} value={agent.id}>{agent.label}</option>)}
        </select>

        {/* Risk filter */}
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} style={{
          padding: '5px 8px', borderRadius: 5, border: '1px solid #E2E8F0', background: '#FFFFFF',
          fontSize: 13, fontWeight: 600, color: '#475569', fontFamily: 'inherit', cursor: 'pointer',
        }}>
          <option value="all">All risk tiers</option>
          <option value="high">High risk</option>
          <option value="medium">Medium risk</option>
          <option value="low">Low risk</option>
        </select>

        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: '#94A3B8' }}>{filtered.length} entries</span>
      </div>

      {/* Log */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
              {['Time', 'Player', 'Type', 'Description', 'Agent', 'Outcome'].map(h => (
                <th key={h} style={{
                  padding: '10px 14px', textAlign: 'left',
                  fontSize: 11, color: '#64748B', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
                No entries match the current filters.
              </td></tr>
            )}
            {displayed.map((e) => {
              const typeCfg = IL_TYPES[e.type] || IL_TYPES.note;
              const outcomeCfg = IL_OUTCOMES[e.outcome];
              const riskColor = e.risk === KGEnums.RISK.HIGH ? '#DC2626' : e.risk === KGEnums.RISK.MEDIUM ? '#D97706' : '#16A34A';
              const isAuto = e.agentKind === 'system';
              return (
                <tr key={e.id} style={{ borderBottom: '1px solid #F1F5F9', background: isAuto ? '#FAFAFA' : 'transparent' }}
                  onMouseEnter={ev => ev.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={ev => ev.currentTarget.style.background = isAuto ? '#FAFAFA' : 'transparent'}
                >
                  {/* Time */}
                  <td style={{ padding: '11px 14px', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{fmtRelTime(e.ts)}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{fmtAbsTime(e.ts)}</div>
                  </td>
                  {/* Player */}
                  <td style={{ padding: '11px 14px', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                    <div
                      onClick={() => onPlayerClick && onPlayerClick(e.player)}
                      style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 13, color: '#0F172A', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: '#CBD5E1' }}
                    >{e.player}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: riskColor, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: riskColor, fontWeight: 600, textTransform: 'capitalize' }}>{e.risk}</span>
                      <span style={{ fontSize: 12, color: '#CBD5E1' }}>·</span>
                      <span style={{ fontSize: 12, color: '#94A3B8' }}>T{e.tier}</span>
                    </div>
                  </td>
                  {/* Type */}
                  <td style={{ padding: '11px 14px', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                    <span style={{
                      display: 'inline-block', fontSize: 11, padding: '3px 7px', borderRadius: 4,
                      background: typeCfg.bg, color: typeCfg.color,
                      fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap', textTransform: 'uppercase',
                    }}>{typeCfg.label}</span>
                  </td>
                  {/* Description */}
                  <td style={{ padding: '11px 14px', maxWidth: 420, verticalAlign: 'top' }}>
                    <div style={{ fontSize: 14, color: '#0F172A', lineHeight: 1.5 }}>{e.desc}</div>
                  </td>
                  {/* Agent */}
                  <td style={{ padding: '11px 14px', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: isAuto ? '#F1F5F9' : '#E0E7FF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 700,
                        color: isAuto ? '#94A3B8' : '#4338CA', flexShrink: 0,
                      }}>{e.agentInitials}</div>
                      <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>{e.agentName}</span>
                    </div>
                  </td>
                  {/* Outcome */}
                  <td style={{ padding: '11px 14px', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                    {outcomeCfg ? (
                      <span style={{ fontSize: 12, padding: '2px 7px', borderRadius: 4, fontWeight: 700, letterSpacing: '0.03em', background: outcomeCfg.color + '18', color: outcomeCfg.color }}>{outcomeCfg.label}</span>
                    ) : (
                      <span style={{ fontSize: 13, color: '#CBD5E1' }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Show more */}
        {filtered.length > 20 && !showAll && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
            <button onClick={() => setShowAll(true)} style={{
              fontSize: 13, fontWeight: 600, color: '#6366F1', background: 'transparent',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}>Show all {filtered.length} entries ↓</button>
          </div>
        )}
        {showAll && filtered.length > 20 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
            <button onClick={() => setShowAll(false)} style={{
              fontSize: 13, fontWeight: 600, color: '#94A3B8', background: 'transparent',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}>Collapse ↑</button>
          </div>
        )}
      </div>

      <div style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center' }}>
        Showing interactions from the past 7 days · All times shown in WAT (GMT+1)
      </div>

      {/* Log interaction modal */}
      {showForm && <LogInteractionModal onClose={() => setShowForm(false)} onSubmit={addEntry} />}
    </div>
  );
}

// ── Log interaction modal ─────────────────────────────────────────────────────
function LogInteractionModal({ onClose, onSubmit }) {
  const agents = (window.KGData && window.KGData.getSelectableAgents && window.KGData.getSelectableAgents()) || [];
  const defaultAgentId = agents[0] ? agents[0].id : 'amaka-n';
  const [form, setForm] = React.useState({ player: '', agentId: defaultAgentId, type: KGEnums.INTERACTION_TYPE.OUTREACH, desc: '', outcome: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.player.trim() || !form.desc.trim()) return;
    onSubmit({ ...form, outcome: form.outcome || null });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.40)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#FFFFFF', borderRadius: 10, padding: 28, width: 520, boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Log Interaction</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#94A3B8', lineHeight: 1, padding: 0 }}>×</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={modalLabel}>
            Player ID
            <input value={form.player} onChange={e => set('player', e.target.value)} placeholder="BK-XXXXXXX" required style={modalInput} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label style={modalLabel}>
              Type
              <select value={form.type} onChange={e => set('type', e.target.value)} style={modalInput}>
                {IL_TYPE_FORM_OPTIONS.map(type => <option key={type} value={type}>{IL_TYPES[type].label}</option>)}
              </select>
            </label>
            <label style={modalLabel}>
              Outcome
              <select value={form.outcome} onChange={e => set('outcome', e.target.value)} style={modalInput}>
                <option value="">— N/A</option>
                {IL_OUTCOME_FORM_OPTIONS.map(outcome => <option key={outcome} value={outcome}>{IL_OUTCOMES[outcome].label}</option>)}
              </select>
            </label>
          </div>
          <label style={modalLabel}>
            Agent
            <select value={form.agentId} onChange={e => set('agentId', e.target.value)} style={modalInput}>
              {agents.map(agent => <option key={agent.id} value={agent.id}>{agent.label}</option>)}
            </select>
          </label>
          <label style={modalLabel}>
            Description / Notes
            <textarea
              value={form.desc} onChange={e => set('desc', e.target.value)}
              placeholder="Describe the interaction, player response, and any next steps…"
              required rows={4}
              style={{ ...modalInput, resize: 'vertical', lineHeight: 1.5 }}
            />
          </label>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
            <button type="submit" style={btnPrimary}>Save interaction</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalLabel = { display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, fontWeight: 600, color: '#475569' };
const modalInput = { padding: '7px 10px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 14, color: '#0F172A', fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' };

Object.assign(window, { InteractionLog });
