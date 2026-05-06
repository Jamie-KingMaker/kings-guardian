// src/views/PlayerDetail/index.jsx
import { useEffect, useState } from 'react';
import { playerService, ApiError } from '@/api/index.js';
import { RiskPill, TrendArrow, Icon } from '@/components/atoms/index.js';
import { btnPrimary, btnSecondary, cardStyle } from '@/config/constants.js';
import { BRAND_ACCENTS, } from '@/config/brands.js';
import { COUNTRY_NAMES } from '@/config/constants.js';
import { fmtCompact } from '@/utils/format.js';
import t from '@/config/i18n.js';
import { CardSkeleton } from '@/components/skeletons/index.js';

export function PlayerDetail({ playerId, onBack }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!playerId) return;
    setLoading(true);
    setError(null);
    playerService.getPlayer(playerId)
      .then(res => {
        setPlayer(res.data);
        setLoading(false);
      })
      .catch(err => {
        if (err instanceof ApiError) {
          if (err.status === 404) {
            setError('Player not found');
          } else {
            setError(err.body?.error?.message || 'Failed to load player');
          }
        } else {
          setError('Failed to load player');
        }
        setPlayer(null);
        setLoading(false);
      });
  }, [playerId]);

  if (loading) return <div style={{ padding: 24 }}><CardSkeleton height={360} /></div>;

  if (error) return (
    <div style={{ padding: 24 }}>
      <button onClick={onBack} style={{ background: 'transparent', border: 'none', padding: 0, color: '#64748B', fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', alignSelf: 'flex-start', marginBottom: 16 }}>{t.common.back}</button>
      <div style={{ padding: 24, background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 14 }}>{error}</div>
    </div>
  );

  if (!player) return (
    <div style={{ padding: 24 }}>
      <button onClick={onBack} style={{ background: 'transparent', border: 'none', padding: 0, color: '#64748B', fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', alignSelf: 'flex-start', marginBottom: 16 }}>{t.common.back}</button>
      <div style={{ padding: 24, background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 8, color: '#0369A1', fontSize: 14 }}>Player data unavailable</div>
    </div>
  );

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={onBack} style={{ background: 'transparent', border: 'none', padding: 0, color: '#64748B', fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', alignSelf: 'flex-start' }}>{t.common.back}</button>

      <div style={{ ...cardStyle, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 8, background: player.brand === 'betking' ? '#001041' : '#040B67', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: player.brand === 'betking' ? '#FFC400' : '#F1C72F', fontWeight: 700 }}>{player.brand === 'betking' ? 'BK' : 'SS'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <h2 style={{ margin: 0, fontSize: 25, fontWeight: 600, color: '#0F172A', fontFamily: '"Roboto Mono", monospace', letterSpacing: '-0.01em' }}>{player.id}</h2>
              <RiskPill level={player.risk} />
              <TrendArrow trend={player.trend} />
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: 14, color: '#64748B' }}>
              <span>{BRAND_ACCENTS[player.brand]?.name ?? player.brand}</span>
              <span>{COUNTRY_NAMES[player.country] ?? player.country}</span>
              <span>Tier {player.tier}</span>
              <span>Active {player.lastActive}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={btnSecondary}><Icon name="note" size={14} /> Add note</button>
            <button style={{ ...btnPrimary, background: '#DC2626' }}><Icon name="flag" size={14} /> Mark for outreach</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <MicroStat label="Spend / 7d" value={fmtCompact(player.spend, player.brand)} delta={`${player.spendDelta > 0 ? '+' : ''}${player.spendDelta ?? 0}%`} tone="high" />
        <MicroStat label="Deposits / 7d" value={player.deposits} delta="+85%" tone="high" />
        <MicroStat label="Bets / 7d" value={player.bets} delta="+96%" tone="high" />
        <MicroStat label="Avg deposit" value={fmtCompact(Math.round((player.spend || 1) / Math.max(1, player.deposits || 1)), player.brand)} delta="+34%" tone="medium" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
        <div style={{ ...cardStyle }}>
          <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>Spend & deposits over time</div>
          <div style={{ fontSize: 16, color: '#0F172A', fontWeight: 600, marginBottom: 12 }}>30-day behavioural trace</div>
          <BehaviourChart player={player} />
        </div>
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 13, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Why this player is flagged</div>
            <div style={{ fontSize: 16, color: '#0F172A', fontWeight: 600, marginTop: 2 }}>Risk insights · explainability</div>
          </div>
          {(player.insights ?? []).map((i, idx) => (
            <div key={idx} style={{ padding: '14px 16px', borderBottom: idx < (player.insights?.length ?? 0) - 1 ? '1px solid #F1F5F9' : 'none', borderLeft: `3px solid ${i.sev === 'high' ? '#DC2626' : i.sev === 'medium' ? '#D97706' : '#16A34A'}` }}>
              <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>{i.time}</div>
              <div style={{ fontSize: 15, color: '#0F172A', fontWeight: 600, marginBottom: 4 }}>{i.title}</div>
              <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.5 }}>{i.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MicroStat({ label, value, delta, tone }) {
  const color = tone === 'high' ? '#DC2626' : tone === 'medium' ? '#D97706' : '#16A34A';
  return (
    <div style={{ ...cardStyle, padding: 12 }}>
      <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', fontFamily: '"Roboto Mono", monospace', letterSpacing: '-0.01em', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color }}>{delta} w/w</div>
    </div>
  );
}

function BehaviourChart({ player }) {
  const spend = player.behaviour?.spendTimeSeries ?? [80,90,85,95,100,120,140,180];
  const dep   = player.behaviour?.depositTimeSeries ?? [0,0,1,0,2,1,2,3];
  const W = 600, H = 180, PAD_L = 30, PAD_B = 22, PAD_T = 8;
  const max = Math.max(...spend, 1);
  const innerW = W - PAD_L - 8, innerH = H - PAD_T - PAD_B;
  const xStep = innerW / (spend.length - 1);
  const path = spend.map((v, i) => `${i === 0 ? 'M' : 'L'}${PAD_L + i * xStep},${PAD_T + innerH - (v / max) * innerH}`).join(' ');
  const area = `${path} L${PAD_L + (spend.length - 1) * xStep},${PAD_T + innerH} L${PAD_L},${PAD_T + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {[0, 0.5, 1].map((t, i) => <line key={i} x1={PAD_L} y1={PAD_T + innerH * t} x2={W - 8} y2={PAD_T + innerH * t} stroke="#F1F5F9" />)}
      <path d={area} fill="#0F172A" fillOpacity="0.06" />
      <path d={path} fill="none" stroke="#0F172A" strokeWidth="1.5" />
      {dep.map((d, i) => d > 0 && <rect key={i} x={PAD_L + i * xStep - 1.5} y={PAD_T + innerH - d * 10} width="3" height={d * 10} fill="#DC2626" rx="1" />)}
    </svg>
  );
}

