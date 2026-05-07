// Player List — King's Guard CS Agent View

const { useState: useStateList, useMemo: useMemoList } = React;
const { KGEnums, KGConstants } = window;

const PAGE_SIZE = 50;
const STATUS_CFG = KGConstants.PLAYER_STATUS_CFG;
const ACTION_STATUSES = new Set(KGConstants.ACTION_STATUSES);
const RISK_ORDER = KGConstants.RISK_ORDER;

function PlayerList({ brand, country, onPlayerClick, range = '7d' }) {
  const { PLAYERS, buildRangeData, getPlayerPopulation } = window.KGData;
  const data = useMemoList(() => buildRangeData(range, brand === KGEnums.BRAND.ALL ? null : brand), [range, brand]);

  const [riskFilter, setRiskFilter]       = useStateList('all');
  const [productFilter, setProductFilter] = useStateList('all');
  const [statusFilter, setStatusFilter]   = useStateList('all');
  const [signalFilter, setSignalFilter]   = useStateList('all');
  const [tierFilter, setTierFilter]       = useStateList('all');
  const [sortKey, setSortKey]             = useStateList('riskScore');
  const [page, setPage]                   = useStateList(0);
  const [shortcut, setShortcut]           = useStateList(null);
  const [statusOverrides, setStatusOverrides] = useStateList({});

  const updateStatus = (id, newStatus) => {
    setStatusOverrides(prev => ({ ...prev, [id]: newStatus }));
  };

  const effectiveStatus = (p) => statusOverrides[p.id] !== undefined ? statusOverrides[p.id] : p.status;

  // IDs the dashboard surfaces
  const moverIds = useMemoList(() => new Set(data.movers.map(m => m.id)), [data]);
  const queueIds = useMemoList(() => new Set(PLAYERS.filter(p => p.status).map(p => p.id)), []);

  // Reset to page 1 when filters change
  React.useEffect(() => { setPage(0); }, [riskFilter, productFilter, statusFilter, signalFilter, tierFilter, shortcut, sortKey, brand, country, range]);

  const useFullPop = shortcut === null;

  const fullPop = useMemoList(() => {
    if (!useFullPop) return null;
    return getPlayerPopulation(brand, range);
  }, [useFullPop, brand, range]);

  const { MAU } = window.KGData;
  const countryShareForBrand = (brandKey, countryCode) => {
    if (countryCode === 'ALL') return 1;
    const brandCountries = MAU[brandKey] || {};
    const total = Object.values(brandCountries).reduce((a, b) => a + b, 0);
    return total ? (brandCountries[countryCode] || 0) / total : 0;
  };
  const countryShareTotal = useMemoList(() => {
    if (country === 'ALL') return 1;
    if (brand === KGEnums.BRAND.BETKING) return 1;
    if (brand !== KGEnums.BRAND.ALL) return countryShareForBrand(brand, country);
    const bkShare = (MAU[KGEnums.BRAND.BETKING][country] || 0);
    const ssShare = (MAU[KGEnums.BRAND.SUPERSPORTBET][country] || 0);
      const total = window.KGData.MAU_TOTALS[KGEnums.BRAND.ALL];
    return (bkShare + ssShare) / total;
  }, [brand, country]);

  const counts = useMemoList(() => {
    if (useFullPop) {
      const bc = fullPop.bucketCounts();
      const m = countryShareTotal;
      return {
        all:     Math.round((bc.high + bc.medium + bc.low + bc.unrated) * m),
        high:    Math.round(bc.high * m),
        medium:  Math.round(bc.medium * m),
        low:     Math.round(bc.low * m),
        unrated: Math.round(bc.unrated * m),
      };
    }
    const filtered = PLAYERS.filter(p =>
      (brand === 'all' || p.brand === brand) &&
      (country === 'ALL' || p.country === country) &&
      (shortcut === null || (shortcut === 'movers' ? moverIds.has(p.id) : queueIds.has(p.id)))
    );
    return {
      all: filtered.length,
      high: filtered.filter(p => p.risk === 'high').length,
      medium: filtered.filter(p => p.risk === 'medium').length,
      low: filtered.filter(p => p.risk === 'low').length,
      unrated: filtered.filter(p => p.risk === 'unrated').length,
    };
  }, [useFullPop, fullPop, brand, country, shortcut, moverIds, queueIds]);

  const brandIsSingleCountry = (brand === KGEnums.BRAND.BETKING);
  const effectiveCountry = brandIsSingleCountry ? KGEnums.COUNTRY.ALL : country;

  const matchesPostFilter = (p) => {
    if (effectiveCountry !== 'ALL' && p.country !== effectiveCountry) return false;
    if (productFilter !== 'all' && !p.products.includes(productFilter)) return false;
    if (statusFilter !== 'all') {
      const es = effectiveStatus(p);
      if (statusFilter === 'needs-action') {
        if (!ACTION_STATUSES.has(es)) return false;
      } else if (statusFilter === 'any-set') {
        if (!es) return false;
      } else {
        if (es !== statusFilter) return false;
      }
    }
    if (signalFilter !== 'all' && !(p.signals || []).includes(signalFilter)) return false;
    if (tierFilter !== 'all' && p.tier !== Number(tierFilter)) return false;
    return true;
  };

  const rows = useMemoList(() => {
    if (!useFullPop) {
      let r = PLAYERS.filter(p =>
        (brand === 'all' || p.brand === brand) &&
        (country === 'ALL' || p.country === country) &&
        (riskFilter === 'all' || p.risk === riskFilter) &&
        (shortcut === null || (shortcut === 'movers' ? moverIds.has(p.id) : queueIds.has(p.id))) &&
        matchesPostFilter(p)
      );
      r = r.slice().sort((a, b) => {
        if (sortKey === 'priority') {
          const pa = (STATUS_CFG[effectiveStatus(a)]?.priority ?? 99);
          const pb = (STATUS_CFG[effectiveStatus(b)]?.priority ?? 99);
          return pa !== pb ? pa - pb : (b.riskScore ?? -1) - (a.riskScore ?? -1);
        }
        if (sortKey === 'riskScore') return (b.riskScore ?? -1) - (a.riskScore ?? -1);
        if (sortKey === 'risk') return RISK_ORDER[a.risk] - RISK_ORDER[b.risk];
        if (sortKey === 'spend') return b.spend - a.spend;
        if (sortKey === 'spendDelta') return (b.spendDelta ?? -999) - (a.spendDelta ?? -999);
        return 0;
      });
      return { page: r.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE), filteredCount: r.length };
    }

    const targetEnd = (page + 1) * PAGE_SIZE;
    const out = [];

    let cumOffset0 = 0;
    const segOffsetsAll = fullPop.segments.map(s => {
      const o = cumOffset0;
      cumOffset0 += s.pinned.length + s.synthCount;
      return o;
    });

    const activeSegs = fullPop.segments
      .map((s, idx) => ({ s, idx }))
      .filter(({ s }) => riskFilter === 'all' || s.bucket === riskFilter);

    const hasPostFilter = effectiveCountry !== 'ALL' || productFilter !== 'all' || statusFilter !== 'all' || signalFilter !== 'all' || tierFilter !== 'all';

    if (!hasPostFilter) {
      const pageStart = page * PAGE_SIZE;
      const pageEnd = pageStart + PAGE_SIZE;
      let cum = 0;
      for (const { s, idx } of activeSegs) {
        const segLen = s.pinned.length + s.synthCount;
        const segGlobalStart = segOffsetsAll[idx];
        const localStart = Math.max(0, pageStart - cum);
        const localEnd = Math.min(segLen, pageEnd - cum);
        if (localStart < segLen && localEnd > 0 && localStart < localEnd) {
          for (let j = localStart; j < localEnd; j++) {
            out.push(fullPop.get(segGlobalStart + j));
          }
        }
        cum += segLen;
        if (cum >= pageEnd) break;
      }
    } else {
      const PER_SEG_BUDGET = 20000;
      outerWalk: for (const { s, idx } of activeSegs) {
        const segLen = s.pinned.length + s.synthCount;
        const segGlobalOffset = segOffsetsAll[idx];
        const scan = Math.min(segLen, PER_SEG_BUDGET);
        for (let j = 0; j < scan; j++) {
          const p = fullPop.get(segGlobalOffset + j);
          if (!matchesPostFilter(p)) continue;
          out.push(p);
          if (out.length >= targetEnd + 1) break outerWalk;
        }
      }
    }

    if (sortKey === 'riskScore' && riskFilter === 'all') {
      // Natural order
    } else {
      out.sort((a, b) => {
        if (sortKey === 'priority') {
          const pa = (STATUS_CFG[effectiveStatus(a)]?.priority ?? 99);
          const pb = (STATUS_CFG[effectiveStatus(b)]?.priority ?? 99);
          return pa !== pb ? pa - pb : (b.riskScore ?? -1) - (a.riskScore ?? -1);
        }
        if (sortKey === 'riskScore') return (b.riskScore ?? -1) - (a.riskScore ?? -1);
        if (sortKey === 'risk') return RISK_ORDER[a.risk] - RISK_ORDER[b.risk];
        if (sortKey === 'spend') return b.spend - a.spend;
        if (sortKey === 'spendDelta') return (b.spendDelta ?? -999) - (a.spendDelta ?? -999);
        return 0;
      });
    }

    return {
      page: hasPostFilter ? out.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) : out,
      filteredCount: null,
    };
  }, [useFullPop, fullPop, brand, country, riskFilter, productFilter, statusFilter, signalFilter, tierFilter, shortcut, sortKey, page, moverIds, queueIds, statusOverrides]);

  const totalForBucket = riskFilter === 'all' ? counts.all : counts[riskFilter];
  const totalPages = useFullPop
    ? Math.max(1, Math.ceil(totalForBucket / PAGE_SIZE))
    : Math.max(1, Math.ceil((rows.filteredCount || 0) / PAGE_SIZE));

  const signalOptions = data.signals.slice(0, 7).map(s => [s.label, s.label]);

  // Count players needing action (from named PLAYERS only — synthetic pop doesn't have meaningful statuses)
  const needsActionCount = useMemoList(() =>
    PLAYERS.filter(p => {
      const es = statusOverrides[p.id] !== undefined ? statusOverrides[p.id] : p.status;
      return ACTION_STATUSES.has(es);
    }).length
  , [statusOverrides]);

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>
            Player monitoring · {data.rangeLabel} · {data.activeUnit} {data.mau.toLocaleString()}
          </div>
          <h1 style={{ fontSize: 25, fontWeight: 600, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>Player List</h1>
          <p style={{ fontSize: 15, color: '#64748B', margin: '4px 0 0' }}>
            <span style={{ fontWeight: 600, color: '#0F172A' }}>{counts.all.toLocaleString()}</span> active base ·{' '}
            <span style={{ color: '#DC2626', fontWeight: 600 }}>{counts.high.toLocaleString()} high risk</span> ·{' '}
            <span style={{ color: '#D97706', fontWeight: 600 }}>{counts.medium.toLocaleString()} medium risk</span> ·{' '}
            <span style={{ color: '#16A34A', fontWeight: 600 }}>{counts.low.toLocaleString()} low risk</span> ·{' '}
            <span style={{ color: '#94A3B8', fontWeight: 600 }}>{counts.unrated.toLocaleString()} insufficient data</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={btnSecondary}><Icon name="export" size={14}/> Export CSV</button>
          <button style={btnPrimary}><Icon name="filter" size={14}/> Save view</button>
        </div>
      </div>

      {/* Dashboard-context shortcuts + needs-action call-out */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick filters</span>
        <Shortcut active={shortcut === 'movers'} onClick={() => setShortcut(shortcut === 'movers' ? null : 'movers')}
          color="#DC2626" label={`Top movers (${moverIds.size})`} icon="trending"
        />
        <Shortcut active={shortcut === 'queue'} onClick={() => setShortcut(shortcut === 'queue' ? null : 'queue')}
          color="#D97706" label={`Attention queue (${queueIds.size})`} icon="bell"
        />
        <button
          onClick={() => { setStatusFilter(statusFilter === 'needs-action' ? 'all' : 'needs-action'); setShortcut(null); }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 10px', borderRadius: 999,
            border: `1px solid ${statusFilter === 'needs-action' ? '#DC2626' : '#E2E8F0'}`,
            background: statusFilter === 'needs-action' ? '#DC2626' : '#FFFFFF',
            color: statusFilter === 'needs-action' ? '#FFFFFF' : '#475569',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>
          <Icon name="bell" size={12} />
          Needs action ({needsActionCount})
        </button>
        {(shortcut || statusFilter === 'needs-action') && (
          <button onClick={() => { setShortcut(null); setStatusFilter('all'); }} style={{
            fontSize: 13, color: '#64748B', background: 'transparent', border: 'none',
            cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit',
          }}>Clear</button>
        )}
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 10, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', paddingLeft: 4 }}>Filter</span>
        <Segment value={riskFilter} setValue={setRiskFilter} options={[['all', 'Active base'], [KGEnums.RISK.HIGH, 'High risk'], [KGEnums.RISK.MEDIUM, 'Medium risk'], [KGEnums.RISK.LOW, 'Low risk'], [KGEnums.RISK.UNRATED, 'Insufficient data']]} colors={{ [KGEnums.RISK.HIGH]: '#DC2626', [KGEnums.RISK.MEDIUM]: '#D97706', [KGEnums.RISK.LOW]: '#16A34A' }} />
        <div style={{ width: 1, height: 20, background: '#E2E8F0' }}></div>
        <Segment value={productFilter} setValue={setProductFilter} options={KGConstants.PRODUCT_OPTIONS.map(option => [option.value, option.label])} />
        <div style={{ width: 1, height: 20, background: '#E2E8F0' }}></div>
        {/* Status filter — full list */}
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{
          padding: '5px 8px', borderRadius: 5, border: '1px solid #E2E8F0', background: '#FFFFFF',
          fontSize: 13, fontWeight: 600, color: '#475569', fontFamily: 'inherit', cursor: 'pointer',
        }}>
          <option value="all">Any status</option>
          <option value="needs-action">— Needs action</option>
          <option value="any-set">— Any status set</option>
          {KGConstants.PLAYER_STATUS_FILTER_GROUPS.map(group => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </optgroup>
          ))}
        </select>
        <div style={{ width: 1, height: 20, background: '#E2E8F0' }}></div>
        <select value={signalFilter} onChange={e => setSignalFilter(e.target.value)} style={{
          padding: '5px 8px', borderRadius: 5, border: '1px solid #E2E8F0', background: '#FFFFFF',
          fontSize: 13, fontWeight: 600, color: '#475569', fontFamily: 'inherit', cursor: 'pointer',
        }}>
          <option value="all">Any signal</option>
          {signalOptions.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <div style={{ width: 1, height: 20, background: '#E2E8F0' }}></div>
        <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} style={{
          padding: '5px 8px', borderRadius: 5, border: '1px solid #E2E8F0', background: '#FFFFFF',
          fontSize: 13, fontWeight: 600, color: '#475569', fontFamily: 'inherit', cursor: 'pointer',
        }}>
          <option value="all">Any tier</option>
          <option value="9">Tier 9 — VIP</option>
          <option value="8">Tier 8</option>
          <option value="7">Tier 7</option>
          <option value="6">Tier 6</option>
          <option value="5">Tier 5</option>
          <option value="4">Tier 4</option>
          <option value="3">Tier 3</option>
          <option value="2">Tier 2</option>
          <option value="1">Tier 1 — Low stake</option>
        </select>
        <div style={{ flex: 1 }}></div>
        <span style={{ fontSize: 13, color: '#64748B', marginRight: 4 }}>Sort</span>
        <Segment value={sortKey} setValue={setSortKey} options={[['priority', 'Priority'], ['riskScore', 'Score'], ['risk', 'Bucket'], ['spend', 'Spend'], ['spendDelta', '% Δ']]} compact />
      </div>

      {/* Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
              {['Customer', 'Risk', 'Score', 'Trend', 'Signals', 'Spend', 'Δ vs prior', 'Last seen', 'Status'].map(h => (
                <th key={h} style={{
                  padding: '11px 12px', textAlign: 'left',
                  fontSize: 12, color: '#64748B', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.page.map((p, i) => <PlayerRow
              key={p.id + '|' + i} p={p}
              isMover={moverIds.has(p.id)} isQueue={queueIds.has(p.id)}
              onClick={() => onPlayerClick && onPlayerClick(p.id)}
              effectiveStatus={effectiveStatus(p)}
              onStatusUpdate={(s) => updateStatus(p.id, s)}
            />)}
            {rows.page.length === 0 && (
              <tr><td colSpan={9} style={{ padding: 32, textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
                No players match the current filters.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        page={page} setPage={setPage} totalPages={totalPages}
        bucketLabel={riskFilter === 'all' ? 'active base' : riskFilter === 'unrated' ? 'insufficient data' : `${riskFilter} risk`}
        bucketCount={totalForBucket}
        pageSize={PAGE_SIZE}
        showing={rows.page.length}
        useFullPop={useFullPop}
      />

      <div style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '4px 0' }}>
        Risk scores recompute {data.refreshLabel} from behavioural model v3.2 · Population matches dashboard active-base for {data.rangeLabel}
      </div>
    </div>
  );
}

function Pagination({ page, setPage, totalPages, bucketLabel, bucketCount, pageSize, showing, useFullPop }) {
  const start = page * pageSize + 1;
  const end = page * pageSize + showing;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 4px' }}>
      <div style={{ fontSize: 14, color: '#64748B' }}>
        Showing <span style={{ color: '#0F172A', fontWeight: 600 }}>{start.toLocaleString()}–{end.toLocaleString()}</span>
        {useFullPop && <> of <span style={{ color: '#0F172A', fontWeight: 600 }}>{bucketCount.toLocaleString()}</span></>}
        <span style={{ color: '#94A3B8' }}> in {bucketLabel}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <PageBtn disabled={page === 0} onClick={() => setPage(0)}>« First</PageBtn>
        <PageBtn disabled={page === 0} onClick={() => setPage(page - 1)}>‹ Prev</PageBtn>
        <span style={{ fontSize: 14, color: '#475569', padding: '0 8px', fontFamily: "'Roboto Mono', monospace" }}>
          Page <span style={{ color: '#0F172A', fontWeight: 600 }}>{(page + 1).toLocaleString()}</span> / {totalPages.toLocaleString()}
        </span>
        <PageBtn disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next ›</PageBtn>
        <PageBtn disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>Last »</PageBtn>
      </div>
    </div>
  );
}

function PageBtn({ disabled, onClick, children }) {
  return (
    <button disabled={disabled} onClick={onClick} style={{
      padding: '5px 10px', borderRadius: 5, border: '1px solid #E2E8F0',
      background: disabled ? '#F8FAFC' : '#FFFFFF',
      color: disabled ? '#CBD5E1' : '#475569',
      fontSize: 13, fontWeight: 600, cursor: disabled ? 'default' : 'pointer',
      fontFamily: 'inherit',
    }}>{children}</button>
  );
}

function Shortcut({ active, onClick, color, label, icon }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 10px', borderRadius: 999,
      border: `1px solid ${active ? color : '#E2E8F0'}`,
      background: active ? color : '#FFFFFF',
      color: active ? '#FFFFFF' : '#475569',
      fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
    }}>
      <Icon name={icon} size={12} />
      {label}
    </button>
  );
}

function Segment({ value, setValue, options, colors = {}, compact }) {
  return (
    <div style={{ display: 'inline-flex', gap: 2 }}>
      {options.map(([v, l]) => {
        const active = value === v;
        const color = colors[v];
        return (
          <button key={v} onClick={() => setValue(v)} style={{
            padding: compact ? '4px 8px' : '5px 10px', borderRadius: 5, border: 'none',
            background: active ? '#0F172A' : 'transparent',
            color: active ? '#FFFFFF' : '#475569',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            {color && <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }}></span>}
            {l}
          </button>
        );
      })}
    </div>
  );
}

function StatusCell({ playerId, status, onUpdate }) {
  const [editing, setEditing] = React.useState(false);
  const cfg = STATUS_CFG[status];

  const stopPropAndEdit = (e) => {
    e.stopPropagation();
    setEditing(true);
  };

  if (editing) {
    return (
      <select
        autoFocus
        value={status || ''}
        onClick={e => e.stopPropagation()}
        onChange={e => { onUpdate(e.target.value || null); setEditing(false); }}
        onBlur={() => setEditing(false)}
        style={{
          padding: '3px 6px', borderRadius: 4, border: '1px solid #6366F1',
          fontSize: 12, fontWeight: 600, color: '#0F172A', fontFamily: 'inherit',
          cursor: 'pointer', background: '#FFFFFF', minWidth: 160,
        }}
      >
        <option value="">— No status</option>
        {KGConstants.PLAYER_STATUS_EDIT_GROUPS.map(group => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </optgroup>
        ))}
      </select>
    );
  }

  if (cfg) {
    return (
      <span
        onClick={stopPropAndEdit}
        title="Click to update status"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 12, padding: '3px 8px', borderRadius: 4,
          background: cfg.bg, color: cfg.color,
          fontWeight: 700, letterSpacing: '0.03em', whiteSpace: 'nowrap',
          cursor: 'pointer', userSelect: 'none',
          border: `1px solid ${cfg.bg}`,
        }}
      >
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
        {cfg.short}
        <span style={{ fontSize: 10, color: cfg.color, opacity: 0.6, marginLeft: 2 }}>▾</span>
      </span>
    );
  }

  return (
    <button
      onClick={stopPropAndEdit}
      style={{
        fontSize: 12, padding: '3px 8px', borderRadius: 4,
        border: '1px dashed #CBD5E1', background: 'transparent',
        color: '#94A3B8', fontWeight: 600, cursor: 'pointer',
        fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 4,
      }}
    >
      Set status ▾
    </button>
  );
}

function PlayerRow({ p, onClick, isMover, isQueue, effectiveStatus, onStatusUpdate }) {
  const sparkData = p.risk === 'high' ? [12, 14, 13, 18, 22, 28, 35, 42] :
                    p.risk === 'medium' ? [18, 19, 21, 22, 24, 25, 27, 28] :
                    p.trend === 'down' ? [22, 20, 19, 18, 16, 15, 14, 13] : [15, 16, 15, 16, 17, 16, 17, 16];
  const sparkColor = p.risk === 'high' ? '#DC2626' : p.risk === 'medium' ? '#D97706' : '#16A34A';
  const scoreColor = p.riskScore == null ? '#94A3B8' : p.riskScore >= 70 ? '#DC2626' : p.riskScore >= 40 ? '#D97706' : '#16A34A';
  const needsAction = ACTION_STATUSES.has(effectiveStatus);

  return (
    <tr
      onClick={onClick}
      style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer', borderLeft: needsAction ? '3px solid #DC2626' : '3px solid transparent' }}
      onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Customer */}
      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 4,
            background: p.brand === KGEnums.BRAND.BETKING ? '#001041' : '#040B67',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, color: p.brand === KGEnums.BRAND.BETKING ? '#FFC400' : '#F1C72F',
            fontWeight: 700, flexShrink: 0,
          }}>{p.brand === KGEnums.BRAND.BETKING ? 'BK' : 'SS'}</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 14, color: '#0F172A', fontWeight: 500 }}>{p.id}</span>
              {isMover && <span style={{ fontSize: 11, padding: '1px 4px', borderRadius: 2, background: 'rgba(220,38,38,0.10)', color: '#DC2626', fontWeight: 700, letterSpacing: '0.04em' }}>MOVER</span>}
              {isQueue && !isMover && <span style={{ fontSize: 11, padding: '1px 4px', borderRadius: 2, background: 'rgba(217,119,6,0.10)', color: '#D97706', fontWeight: 700, letterSpacing: '0.04em' }}>QUEUE</span>}
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>Tier {p.tier} · {p.country}</div>
          </div>
        </div>
      </td>

      {/* Risk */}
      <td style={{ padding: '10px 12px' }}><RiskPill level={p.risk} dense /></td>

      {/* Score */}
      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
        {p.riskScore == null ? <span style={{ color: '#CBD5E1', fontSize: 14 }}>—</span> : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 15, color: scoreColor, fontWeight: 700 }}>{p.riskScore}</span>
            {p.riskFrom != null && (
              <span style={{ fontSize: 12, color: scoreColor, fontWeight: 700 }}>+{p.riskScore - p.riskFrom}</span>
            )}
          </div>
        )}
      </td>

      {/* Trend */}
      <td style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkline data={sparkData} color={sparkColor} width={48} height={20} fill={false} />
          <TrendArrow trend={p.trend} />
        </div>
      </td>

      {/* Signals */}
      <td style={{ padding: '10px 12px', maxWidth: 220 }}>
        {(p.signals && p.signals.length) ? (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {p.signals.slice(0, 2).map(s => (
              <span key={s} title={s} style={{
                fontSize: 12, padding: '2px 6px', borderRadius: 3,
                background: 'rgba(220,38,38,0.08)', color: '#B91C1C',
                fontWeight: 600, whiteSpace: 'nowrap', maxWidth: 140,
                overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{s}</span>
            ))}
            {p.signals.length > 2 && (
              <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>+{p.signals.length - 2}</span>
            )}
          </div>
        ) : <span style={{ fontSize: 13, color: '#CBD5E1' }}>—</span>}
      </td>

      {/* Spend */}
      <td style={{ padding: '10px 12px', fontFamily: "'Roboto Mono', monospace", fontSize: 14, color: '#0F172A', fontWeight: 500, whiteSpace: 'nowrap' }}>
        {fmtCompact(p.spend, p.brand)}
      </td>

      {/* Δ vs prior */}
      <td style={{ padding: '10px 12px', fontFamily: "'Roboto Mono', monospace", fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
        color: p.spendDelta == null ? '#94A3B8' : p.spendDelta > 50 ? '#DC2626' : p.spendDelta > 20 ? '#D97706' : p.spendDelta > 0 ? '#475569' : '#16A34A',
      }}>
        {p.spendDelta == null ? '—' : (p.spendDelta > 0 ? '+' : '') + p.spendDelta + '%'}
      </td>

      {/* Last seen */}
      <td style={{ padding: '10px 12px', fontSize: 13, color: '#64748B', whiteSpace: 'nowrap' }}>{p.lastActive}</td>

      {/* Status — inline editable */}
      <td style={{ padding: '10px 12px' }}>
        <StatusCell playerId={p.id} status={effectiveStatus} onUpdate={onStatusUpdate} />
      </td>
    </tr>
  );
}

Object.assign(window, { PlayerList });
