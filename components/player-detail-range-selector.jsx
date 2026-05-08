// Player Detail - date range selector.

const { KGEnums: KGEnumsForRangeSelector, buildComponentChildId: buildChildIdForRangeSelector } = window;

function PlayerRangeSelector({ range, setRange, componentId }) {
  const S = HOME_DASHBOARD_STYLES;
  const opts = [
    [KGEnumsForRangeSelector.DATE_RANGE.LAST_24_HOURS, 'Last 24 hours'],
    [KGEnumsForRangeSelector.DATE_RANGE.LAST_7_DAYS, 'Last 7 days'],
    [KGEnumsForRangeSelector.DATE_RANGE.LAST_30_DAYS, 'Last 30 days'],
  ];

  return (
    <div id={componentId} style={S.TAB_CONTAINER}>
      {opts.map(([v, label]) => (
        <button
          id={buildChildIdForRangeSelector(componentId, v)}
          key={v}
          style={range === v ? S.TAB_BUTTON_ACTIVE() : S.TAB_BUTTON_INACTIVE}
          onClick={() => setRange(v)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

Object.assign(window, { PlayerRangeSelector });

