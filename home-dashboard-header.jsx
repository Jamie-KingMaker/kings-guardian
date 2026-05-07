// Home Dashboard Header Component
// Displays title, filters, and action buttons

const { KGEnums, BRAND_ACCENTS, COUNTRY_NAMES, Icon } = window;
const { HOME_DASHBOARD_STYLES, HOME_DASHBOARD_COMPONENT_IDS } = window;
const { formatMAU } = window;

const { BUTTON_PRIMARY, BUTTON_SECONDARY } = HOME_DASHBOARD_STYLES;

/**
 * DashboardHeader Component
 * Responsibility: Display dashboard metadata and action buttons
 */
function DashboardHeader({
  brand,
  country,
  mau,
  activeUnitLabel,
  component_id = HOME_DASHBOARD_COMPONENT_IDS.PAGE_HEADER
}) {
  const brandName = brand === KGEnums.BRAND.ALL ? 'KingMakers Portfolio' : BRAND_ACCENTS[brand]?.name;
  const countryName = COUNTRY_NAMES[country] || country;

  return (
    <div
      id={component_id}
      style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 4 }}>
      <div>
        <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>
          {brandName} · {countryName}
        </div>
        <h1 style={{ fontSize: 25, fontWeight: 600, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
          Guardian Dashboard
        </h1>
        <p style={{ fontSize: 15, color: '#64748B', margin: '4px 0 0' }}>
          {formatMAU(mau)} {activeUnitLabel}
        </p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={BUTTON_SECONDARY}>
          <Icon name="export" size={14} /> Export
        </button>
        <button style={BUTTON_PRIMARY}>
          <Icon name="refresh" size={14} /> Refresh data
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardHeader });

