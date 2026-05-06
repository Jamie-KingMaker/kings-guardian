// src/views/PlayerList/index.jsx
import { useEffect, useMemo, useState } from 'react';
import { playerService, ApiError } from '@/api/index.js';
import { Icon, RiskPill, TrendArrow, Sparkline } from '@/components/atoms/index.js';
import { btnPrimary, btnSecondary } from '@/config/constants.js';
import { fmtCompact } from '@/utils/format.js';
import t from '@/config/i18n.js';
import { TableRowSkeleton } from '@/components/skeletons/index.js';

const PAGE_SIZE = 50;

export function PlayerList({ brand, country, range = '7d', onPlayerClick }) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, counts: { all: 0, high: 0, medium: 0, low: 0, unrated: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [signalFilter, setSignalFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [sortKey, setSortKey] = useState('riskScore');

  useEffect(() => { setPage(0); }, [brand, country, range, riskFilter, statusFilter, productFilter, signalFilter, tierFilter, sortKey]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    playerService.getPlayers({
      brand, country, range,
      page, limit: PAGE_SIZE,
      risk: riskFilter,
      status: statusFilter,
      product: productFilter,
      signal: signalFilter,
      tier: tierFilter,
      sort: sortKey,
    }).then((res) => {
      setRows(res.data ?? []);
      setMeta(res.meta ?? meta);
      setLoading(false);
    }).catch(err => {
      if (err instanceof ApiError) {
        setError(err.body?.error?.message || 'Failed to load players');
      } else {
        setError('Failed to load players');
      }
      setLoading(false);
    });
  }, [brand, country, range, page, riskFilter, statusFilter, productFilter, signalFilter, tierFilter, sortKey]);

  const totalPages = Math.max(1, Math.ceil((meta.total ?? 0) / PAGE_SIZE));
  const signalOptions = useMemo(() => {
    const s = new Set();
    rows.forEach(r => (r.signals ?? []).forEach(x => s.add(x)));
    return [...s].slice(0, 7);
  }, [rows]);

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>
            Player monitoring · {range}
          </div>
          <h1 style={{ fontSize: 25, fontWeight: 600, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>{t.playerList.title}</h1>
          <p style={{ fontSize: 15, color: '#64748B', margin: '4px 0 0' }}>
            <b>{(meta.counts?.all ?? 0).toLocaleString()}</b> active base ·
            <span style={{ color: '#DC2626', fontWeight: 600 }}> {(meta.counts?.high ?? 0).toLocaleString()} high risk</span> ·
            <span style={{ color: '#D97706', fontWeight: 600 }}> {(meta.counts?.medium ?? 0).toLocaleString()} medium risk</span> ·
            <span style={{ color: '#16A34A', fontWeight: 600 }}> {(meta.counts?.low ?? 0).toLocaleString()} low risk</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={btnSecondary}><Icon name="export" size={14} /> {t.playerList.exportCsv}</button>
          <button style={btnPrimary}><Icon name="filter" size={14} /> {t.playerList.saveView}</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 10, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.playerList.filter}</span>
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} style={selectStyle}>
          <option value="all">{t.playerList.segments.activeBase}</option>
          <option value="high">{t.playerList.segments.highRisk}</option>
          <option value="medium">{t.playerList.segments.mediumRisk}</option>
          <option value="low">{t.playerList.segments.lowRisk}</option>
          <option value="unrated">{t.playerList.segments.insufficientData}</option>
        </select>
        <select value={productFilter} onChange={e => setProductFilter(e.target.value)} style={selectStyle}>
          <option value="all">All products</option>
          <option value="Sports">Sports</option>
          <option value="Casino">Casino</option>
          <option value="Virtuals">Virtuals</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="all">Any status</option>
          <option value="needs-action">Needs action</option>
          <option value="any-set">Any status set</option>
          <option value="outreach">Outreach</option>
          <option value="monitor">Monitor</option>
        </select>
        <select value={signalFilter} onChange={e => setSignalFilter(e.target.value)} style={selectStyle}>
          <option value="all">Any signal</option>
          {signalOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} style={selectStyle}>
          <option value="all">Any tier</option>
          {Array.from({ length: 9 }).map((_, i) => <option key={i+1} value={String(i+1)}>Tier {i+1}</option>)}
        </select>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: '#64748B' }}>{t.playerList.sortLabel}</span>
        <select value={sortKey} onChange={e => setSortKey(e.target.value)} style={selectStyle}>
          <option value="riskScore">{t.playerList.sort.score}</option>
          <option value="risk">{t.playerList.sort.bucket}</option>
          <option value="spend">{t.playerList.sort.spend}</option>
          <option value="spendDelta">{t.playerList.sort.delta}</option>
        </select>
      </div>

      {error && <div style={{ padding: 12, background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 14 }}>{error}</div>}

      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
              {[t.playerList.table.customer, t.playerList.table.risk, t.playerList.table.score, t.playerList.table.trend, t.playerList.table.signals, t.playerList.table.spend, t.playerList.table.delta, t.playerList.table.lastSeen, t.playerList.table.status].map(h => (
                <th key={h} style={{ padding: '11px 12px', textAlign: 'left', fontSize: 12, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 10 }).map((_, i) => <TableRowSkeleton key={i} cols={9} />)}
            {!loading && rows.map((p, i) => {
              const sparkData = p.risk === 'high' ? [12,14,13,18,22,28,35,42] : p.risk === 'medium' ? [18,19,21,22,24,25,27,28] : p.trend === 'down' ? [22,20,19,18,16,15,14,13] : [15,16,15,16,17,16,17,16];
              const sparkColor = p.risk === 'high' ? '#DC2626' : p.risk === 'medium' ? '#D97706' : '#16A34A';
              return (
                <tr key={p.id + i} style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }} onClick={() => onPlayerClick?.(p.id)} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 14, color: '#0F172A', fontWeight: 600 }}>{p.id}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>Tier {p.tier} · {p.country}</div>
                  </td>
                  <td style={{ padding: '10px 12px' }}><RiskPill level={p.risk} dense /></td>
                  <td style={{ padding: '10px 12px', fontFamily: '"Roboto Mono", monospace', fontWeight: 700 }}>{p.riskScore ?? '—'}</td>
                  <td style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}><Sparkline data={sparkData} color={sparkColor} width={48} height={20} fill={false} /><TrendArrow trend={p.trend} /></td>
                  <td style={{ padding: '10px 12px', maxWidth: 240, fontSize: 12, color: '#64748B' }}>{(p.signals ?? []).slice(0, 2).join(', ') || '—'}</td>
                  <td style={{ padding: '10px 12px', fontFamily: '"Roboto Mono", monospace' }}>{fmtCompact(p.spend, p.brand)}</td>
                  <td style={{ padding: '10px 12px', fontFamily: '"Roboto Mono", monospace', color: (p.spendDelta ?? 0) > 20 ? '#DC2626' : '#16A34A' }}>{p.spendDelta == null ? '—' : (p.spendDelta > 0 ? '+' : '') + p.spendDelta + '%'}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: '#64748B' }}>{p.lastActive}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.status ?? '—'}</td>
                </tr>
              );
            })}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={9} style={{ padding: 32, textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>{t.playerList.noResults}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 14, color: '#64748B' }}>Showing {Math.min(page * PAGE_SIZE + 1, meta.total || 0)}-{Math.min((page + 1) * PAGE_SIZE, meta.total || 0)} of {(meta.total || 0).toLocaleString()}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={pageBtn(page === 0)} disabled={page === 0} onClick={() => setPage(0)}>« First</button>
          <button style={pageBtn(page === 0)} disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
          <span style={{ padding: '5px 10px', fontSize: 14, color: '#475569' }}>Page <b>{page + 1}</b> / {totalPages}</span>
          <button style={pageBtn(page >= totalPages - 1)} disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next ›</button>
          <button style={pageBtn(page >= totalPages - 1)} disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>Last »</button>
        </div>
      </div>
    </div>
  );
}

const selectStyle = {
  padding: '5px 8px', borderRadius: 5, border: '1px solid #E2E8F0', background: '#FFFFFF',
  fontSize: 13, fontWeight: 600, color: '#475569', fontFamily: 'inherit', cursor: 'pointer',
};

const pageBtn = (disabled) => ({
  padding: '5px 10px', borderRadius: 5, border: '1px solid #E2E8F0',
  background: disabled ? '#F8FAFC' : '#FFFFFF', color: disabled ? '#CBD5E1' : '#475569',
  fontSize: 13, fontWeight: 600, cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit',
});

