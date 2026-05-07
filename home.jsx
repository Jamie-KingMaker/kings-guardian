// Home Dashboard view for King's Guard
// Main orchestration component using SOLID principles
// Delegates to specialized sub-components for specific responsibilities

const { useMemo: useMemoHome } = React;
const { KGEnums, KGConstants } = window;
const { HOME_DASHBOARD_COMPONENT_IDS } = window;
const { DashboardHeader, StatsCardRow, RiskTrendCard, DepositActivityCard, RGAdoptionCard, SignalsBreakdownCard } = window;
const { RiskDistributionCard, TopMoversCard, AttentionCard, RGCopilotCard } = window;
const { DateRangePicker } = window;
const { calculateCountryShare, formatMAU, calcPercentage } = window;

const FILTER_ALL = KGEnums.FILTER.ALL;

/**
 * HomeDashboard Component - Main orchestrator
 * Responsibility: Coordinate data flow and layout, delegate rendering to sub-components
 * Following SOLID: Single Responsibility (orchestration), Open/Closed (composed of specialized components)
 */
function HomeDashboard({ brand, country, dateRange, customRange, setDateRange, setCustomRange, onPlayerClick }) {
  const { PLAYERS, buildRangeData, MAU, MAU_TOTALS } = window.KGData;
  const effectiveRange = useMemoHome(
    () => KGConstants.getEffectiveDateRange(dateRange, customRange),
    [dateRange, customRange]
  );
  const rangeData = useMemoHome(() => buildRangeData(effectiveRange, brand), [effectiveRange, brand]);

  const filtered = PLAYERS.filter((p) =>
    (brand === KGEnums.BRAND.ALL || p.brand === brand) && (
    country === KGEnums.COUNTRY.ALL || p.country === country)
  );

  // Country-scoped MAU + distribution - calculate country share proportionally
  const countryShare = calculateCountryShare(brand, country, MAU, MAU_TOTALS);

  const dist = {
    high: Math.round(rangeData.dist.high * countryShare),
    med: Math.round(rangeData.dist.med * countryShare),
    low: Math.round(rangeData.dist.low * countryShare),
    unrated: Math.round(rangeData.dist.unrated * countryShare)
  };
  const total = dist.high + dist.med + dist.low + dist.unrated;
  const mau = Math.round(rangeData.mau * countryShare);
  const sd = rangeData.statDeltas;

  // Build stat metrics array
  const statMetrics = [
    {
      id: HOME_DASHBOARD_COMPONENT_IDS.STAT_CARD_ACTIVE_BASE,
      label: 'Active base',
      value: formatMAU(mau),
      subtext: `${mau.toLocaleString()} ${rangeData.activeUnit}`,
      delta: '',
      tone: 'unrated'
    },
    {
      id: HOME_DASHBOARD_COMPONENT_IDS.STAT_CARD_HIGH_RISK,
      label: 'High risk',
      value: dist.high.toLocaleString(),
      subtext: `${calcPercentage(dist.high, total)}% of base`,
      delta: `${sd.high} ${sd.dailyVs}`,
      deltaUp: true,
      tone: 'high'
    },
    {
      id: HOME_DASHBOARD_COMPONENT_IDS.STAT_CARD_MEDIUM_RISK,
      label: 'Medium risk',
      value: dist.med.toLocaleString(),
      subtext: `${calcPercentage(dist.med, total)}% of base`,
      delta: `${sd.med} ${sd.dailyVs}`,
      deltaUp: true,
      tone: 'medium'
    },
    {
      id: HOME_DASHBOARD_COMPONENT_IDS.STAT_CARD_LOW_RISK,
      label: 'Low risk',
      value: dist.low.toLocaleString(),
      subtext: `${calcPercentage(dist.low, total)}% of base`,
      delta: `${sd.low} ${sd.dailyVs}`,
      tone: 'low'
    },
    {
      id: HOME_DASHBOARD_COMPONENT_IDS.STAT_CARD_UNRATED,
      label: 'Insufficient data',
      value: dist.unrated.toLocaleString(),
      subtext: '<7 days history',
      delta: '',
      tone: 'unrated'
    }
  ];

  return (
    <div
      id={HOME_DASHBOARD_COMPONENT_IDS.MAIN_DASHBOARD}
      style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header with brand/country filter and action buttons */}
      <DashboardHeader
        brand={brand}
        country={country}
        mau={mau}
        activeUnitLabel={rangeData.activeUnitFull}
        component_id={HOME_DASHBOARD_COMPONENT_IDS.PAGE_HEADER}
      />

      {/* Date range picker */}
      <div id={HOME_DASHBOARD_COMPONENT_IDS.DATE_RANGE_PICKER}>
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          custom={customRange}
          onCustom={setCustomRange}
          pageMode
        />
      </div>

      {/* Key statistics row */}
      <div id={HOME_DASHBOARD_COMPONENT_IDS.STATS_CONTAINER}>
        <StatsCardRow metrics={statMetrics} />
      </div>

      {/* Risk trends + AI insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12 }}>
        <RiskTrendCard
          data={rangeData.trend}
          rangeLabel={rangeData.rangeLabel}
          growth={rangeData.trendGrowthPct}
          component_id={HOME_DASHBOARD_COMPONENT_IDS.RISK_TREND_CARD}
        />
        <RGCopilotCard
          brand={brand}
          country={country}
          rangeLabel={rangeData.rangeLabel}
          dist={dist}
          total={total}
          mau={mau}
          sd={sd}
          rangeData={rangeData}
          component_id={HOME_DASHBOARD_COMPONENT_IDS.RG_COPILOT_CARD}
        />
      </div>

      {/* Deposit activity + Top movers */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <DepositActivityCard
          data={rangeData.deposits}
          brand={brand}
          total={brand === KGEnums.BRAND.SUPERSPORTBET ? rangeData.depositTotalSS : rangeData.depositTotal}
          growth={rangeData.depositGrowth}
          rangeLabel={rangeData.rangeLabel}
          deltaLabel={rangeData.deltaLabel}
          rangeKey={effectiveRange}
          dist={dist}
          mau={mau}
          component_id={HOME_DASHBOARD_COMPONENT_IDS.DEPOSIT_ACTIVITY_CARD}
        />
        <TopMoversCard
          movers={rangeData.movers}
          brand={brand}
          country={country}
          onPlayerClick={onPlayerClick}
          component_id={HOME_DASHBOARD_COMPONENT_IDS.TOP_MOVERS_CARD}
        />
      </div>

      {/* RG adoption + Signals breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'start' }}>
        <RGAdoptionCard
          items={rangeData.rgAdoption}
          rangeLabel={rangeData.rangeLabel}
          component_id={HOME_DASHBOARD_COMPONENT_IDS.RG_ADOPTION_CARD}
        />
        <SignalsBreakdownCard
          signals={rangeData.signals}
          rangeLabel={rangeData.rangeLabel}
          component_id={HOME_DASHBOARD_COMPONENT_IDS.SIGNALS_BREAKDOWN_CARD}
        />
      </div>
    </div>
  );
}

Object.assign(window, { HomeDashboard });
