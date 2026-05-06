// src/config/i18n.js
// All user-visible UI strings in one place — swap for a proper i18n
// library (react-intl / i18next) later without touching component code.

const en = {
  nav: {
    workspace: 'Workspace',
    dashboard: 'Dashboard',
    playerList: 'Player List',
    playerBehaviours: 'Player Behaviours & Trends',
    monitoring: 'Monitoring & Flags',
    interactionLog: 'Interaction Log',
    reporting: 'Reporting',
  },
  topbar: {
    search: 'Search Customer ID…',
    synced: 'Synced',
    allMarkets: 'All markets',
  },
  home: {
    title: 'Guardian Dashboard',
    portfolio: 'KingMakers Portfolio',
    subtitle: (mau, label, total, range, refresh) =>
      `${mau} ${label} · ${total} risk-monitored over the last ${range} · ${refresh} batch refresh`,
    export: 'Export',
    refresh: 'Refresh data',
    activeBase: 'Active base',
    highRisk: 'High risk',
    mediumRisk: 'Medium risk',
    lowRisk: 'Low risk',
    insufficientData: 'Insufficient data',
    insufficientDataSub: '<7 days history',
  },
  playerList: {
    title: 'Player List',
    exportCsv: 'Export CSV',
    saveView: 'Save view',
    quickFilters: 'Quick filters',
    filter: 'Filter',
    sortLabel: 'Sort',
    needsAction: 'Needs action',
    clear: 'Clear',
    noResults: 'No players match the current filters.',
    riskScores: (refresh) => `Risk scores recompute ${refresh} from behavioural model v3.2`,
    segments: {
      activeBase: 'Active base',
      highRisk: 'High risk',
      mediumRisk: 'Medium risk',
      lowRisk: 'Low risk',
      insufficientData: 'Insufficient data',
    },
    sort: {
      priority: 'Priority',
      score: 'Score',
      bucket: 'Bucket',
      spend: 'Spend',
      delta: '% Δ',
    },
    table: {
      customer: 'Customer',
      risk: 'Risk',
      score: 'Score',
      trend: 'Trend',
      signals: 'Signals',
      spend: 'Spend',
      delta: 'Δ vs prior',
      lastSeen: 'Last seen',
      status: 'Status',
    },
    status: {
      setStatus: 'Set status ▾',
      noStatus: '— No status',
    },
  },
  interactionLog: {
    title: 'Interaction Log',
    subtitle: 'Full audit trail of CS agent and system interactions with monitored players.',
    logInteraction: '+ Log interaction',
    searchPlaceholder: 'Search player or keyword…',
    noResults: 'No entries match the current filters.',
    entries: (n) => `${n} entries`,
    showing: (n) => `Showing interactions from the past ${n} days · All times shown in WAT (GMT+1)`,
    stats: {
      total: 'Total interactions',
      outreach: 'Outreach attempts',
      contactRate: 'Contact rate',
      autoFlags: 'Auto flags raised',
    },
  },
  population: {
    title: 'Player Behaviours & Trends',
    subtitle: 'Risk signals, tier migration, product distribution and RG effectiveness.',
  },
  ai: {
    title: "King's Guard AI",
    keyCallouts: 'Key callouts',
    morning: 'Morning brief',
    placeholder: 'Ask anything…',
    clearThread: 'Clear',
    emptyPrompt: 'I have live context on this view. Ask about risk, players, deposits, or trends.',
    samples: [
      'Where should I focus today?',
      "What's changed for VIPs?",
      'Spot recent risk spikes',
    ],
    unavailable: 'Insights unavailable — try a different range or hit Regenerate.',
    error: 'Sorry — I could not reach the analysis service. Try again in a moment.',
    you: 'You',
    copilot: 'Copilot',
  },
  common: {
    back: '← Back to player list',
    loading: 'Loading…',
    error: 'Something went wrong.',
  },
};

export default en;

