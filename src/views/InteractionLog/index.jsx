// src/views/InteractionLog/index.jsx
import { useEffect, useMemo, useState } from 'react';
import { interactionService, ApiError } from '@/api/index.js';
import { btnPrimary, btnSecondary } from '@/config/constants.js';
import t from '@/config/i18n.js';
import { TableRowSkeleton } from '@/components/skeletons/index.js';

// Map API enum types to display labels
const IL_TYPES = {
  phone_call:     { label: 'Phone Call',    color: '#0891B2', bg: 'rgba(8,145,178,0.10)' },
  sms:            { label: 'SMS',           color: '#06B6D4', bg: 'rgba(6,182,212,0.10)' },
  email:          { label: 'Email',         color: '#7C3AED', bg: 'rgba(124,58,237,0.10)' },
  in_app:         { label: 'In-App',        color: '#64748B', bg: 'rgba(100,116,139,0.10)' },
  support_ticket: { label: 'Auto Flag',     color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
};

const OUTCOME_LABELS = {
  completed: 'Completed',
  failed: 'Failed',
  pending: 'Pending',
};

export function InteractionLog({ onPlayerClick }) {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    interactionService.getInteractions({ type: typeFilter, agent: agentFilter, risk: riskFilter, search })
      .then(res => { 
        setRows(res.data ?? []); 
        setStats(res.stats ?? null); 
        setLoading(false);
      })
      .catch(err => {
        if (err instanceof ApiError) {
          setError(err.body?.error?.message || 'Failed to load interactions');
        } else {
          setError('Failed to load interactions');
        }
        setLoading(false);
      });
  };

  useEffect(() => { fetchData(); }, [typeFilter, agentFilter, riskFilter, search]);

  const agents = useMemo(() => {
    const set = new Set(['System']);
    rows.forEach(r => set.add(r.agent));
    return [...set];
  }, [rows]);

  const addEntry = async (entry) => {
    try {
      await interactionService.createInteraction(entry);
      setShowForm(false);
      fetchData();
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Error: ${err.body?.error?.message || 'Failed to create interaction'}`);
      } else {
        alert('Failed to create interaction');
      }
    }
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>Agent activity · Last 7 days</div>
          <h1 style={{ fontSize: 25, fontWeight: 600, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>{t.interactionLog.title}</h1>
          <p style={{ fontSize: 15, color: '#64748B', margin: '4px 0 0' }}>{t.interactionLog.subtitle}</p>
        </div>
        <button onClick={() => setShowForm(true)} style={btnPrimary}>{t.interactionLog.logInteraction}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: t.interactionLog.stats.total, value: stats?.total ?? 0, sub: 'across all types', color: '#0F172A' },
          { label: t.interactionLog.stats.outreach, value: stats?.outreach ?? 0, sub: 'calls & messages sent', color: '#0891B2' },
          { label: t.interactionLog.stats.contactRate, value: `${stats?.contactRate ?? 0}%`, sub: 'of outreach reached player', color: '#16A34A' },
          { label: t.interactionLog.stats.autoFlags, value: stats?.autoFlags ?? 0, sub: 'by behavioural model', color: '#D97706' },
        ].map((s) => (
          <div key={s.label} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 3 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#94A3B8' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {error && <div style={{ padding: 12, background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 14 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 12px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.interactionLog.searchPlaceholder}
          style={{ padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: 6, minWidth: 220, fontFamily: 'inherit' }} />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={selectStyle}>
          <option value="all">All types</option>
          {Object.entries(IL_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={agentFilter} onChange={e => setAgentFilter(e.target.value)} style={selectStyle}>
          <option value="all">All agents</option>
          {agents.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} style={selectStyle}>
          <option value="all">All risk tiers</option>
          <option value="high">High risk</option>
          <option value="medium">Medium risk</option>
          <option value="low">Low risk</option>
        </select>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: '#94A3B8' }}>{t.interactionLog.entries(rows.length)}</span>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
              {['Time', 'Player', 'Type', 'Description', 'Agent', 'Outcome'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)}
            {!loading && rows.map((e) => {
              const cfg = IL_TYPES[e.type] ?? IL_TYPES.in_app;
              const outcomeLabel = e.outcome ? OUTCOME_LABELS[e.outcome] : '—';
              return (
                <tr key={e.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}>{new Date(e.ts).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <button onClick={() => onPlayerClick?.(e.player)} style={{ border: 'none', background: 'transparent', color: '#0F172A', fontFamily: '"Roboto Mono", monospace', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>{e.player}</button>
                  </td>
                  <td style={{ padding: '11px 14px' }}><span style={{ display: 'inline-block', fontSize: 11, padding: '3px 7px', borderRadius: 4, background: cfg.bg, color: cfg.color, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{cfg.label}</span></td>
                  <td style={{ padding: '11px 14px', maxWidth: 420, color: '#0F172A', lineHeight: 1.5 }}>{e.desc}</td>
                  <td style={{ padding: '11px 14px', color: '#475569' }}>{e.agent}</td>
                  <td style={{ padding: '11px 14px', color: '#64748B' }}>{outcomeLabel}</td>
                </tr>
              );
            })}
            {!loading && rows.length === 0 && <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#94A3B8' }}>{t.interactionLog.noResults}</td></tr>}
          </tbody>
        </table>
      </div>

      <div style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center' }}>{t.interactionLog.showing(7)}</div>

      {showForm && <LogInteractionModal onClose={() => setShowForm(false)} onSubmit={addEntry} />}
    </div>
  );
}


function LogInteractionModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ userId: '', risk: 'high', tier: 5, agent: 'Amaka N.', type: 'phone_call', notes: '', outcome: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.userId.trim()) {
      setError('Player ID is required');
      return;
    }
    if (!form.notes.trim()) {
      setError('Description is required');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        userId: form.userId,
        type: form.type,
        outcome: form.outcome || undefined,
        notes: form.notes,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.40)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#FFFFFF', borderRadius: 10, padding: 28, width: 520, boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Log Interaction</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#94A3B8', lineHeight: 1, padding: 0 }}>×</button>
        </div>
        {error && <div style={{ padding: 10, background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 6, color: '#DC2626', fontSize: 13, marginBottom: 14 }}>{error}</div>}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10 }}>
            <label style={modalLabel}>Player ID<input value={form.userId} onChange={e => set('userId', e.target.value)} placeholder="BK-123456" required style={modalInput} /></label>
            <label style={modalLabel}>Risk<select value={form.risk} onChange={e => set('risk', e.target.value)} style={modalInput}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
            <label style={modalLabel}>Tier<input type="number" min={1} max={9} value={form.tier} onChange={e => set('tier', e.target.value)} style={modalInput} /></label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label style={modalLabel}>Type<select value={form.type} onChange={e => set('type', e.target.value)} style={modalInput}>{Object.entries(IL_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></label>
            <label style={modalLabel}>Outcome<select value={form.outcome} onChange={e => set('outcome', e.target.value)} style={modalInput}><option value="">— Optional</option><option value="completed">Completed</option><option value="failed">Failed</option><option value="pending">Pending</option></select></label>
          </div>
          <label style={modalLabel}>Agent<input value={form.agent} onChange={e => set('agent', e.target.value)} placeholder="Your name" style={modalInput} /></label>
          <label style={modalLabel}>Description / Notes<textarea value={form.notes} onChange={e => set('notes', e.target.value)} required rows={4} placeholder="Details of the interaction..." style={{ ...modalInput, resize: 'vertical', lineHeight: 1.5 }} /></label>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}><button type="button" onClick={onClose} style={btnSecondary}>Cancel</button><button type="submit" disabled={submitting} style={btnPrimary}>{submitting ? 'Saving...' : 'Save interaction'}</button></div>
        </form>
      </div>
    </div>
  );
}

const selectStyle = { padding: '5px 8px', borderRadius: 5, border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: 13, fontWeight: 600, color: '#475569', fontFamily: 'inherit', cursor: 'pointer' };
const modalLabel = { display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, fontWeight: 600, color: '#475569' };
const modalInput = { padding: '7px 10px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 14, color: '#0F172A', fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' };

