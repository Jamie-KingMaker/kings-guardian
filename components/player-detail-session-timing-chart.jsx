// Player Detail - session timing distribution chart.

const { pdSeeded, playerSeed, KGEnums } = window;

function SessionTimingChart({ player }) {
  const rnd = pdSeeded(playerSeed(player.id) + 77);
  const isLateNight = (player.signals || []).includes('Late-night activity shift');

  const bands = ['06-10', '10-14', '14-18', '18-22', '22-02', '02-06'];
  const baseWeights = isLateNight
    ? [0.05, 0.08, 0.10, 0.18, 0.42, 0.17]
    : [0.08, 0.15, 0.22, 0.35, 0.14, 0.06];
  const vals = baseWeights.map(w => Math.max(1, Math.round(w * 100 + (rnd() - 0.5) * 6)));
  const maxVal = Math.max(...vals);
  const lateIdx = [4, 5];

  return (
    <div id={KGEnums.COMPONENT_ID.PLAYER_DETAIL_SESSION_TIMING_CHART}>
      {bands.map((b, i) => (
        <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#64748B', minWidth: 40, fontFamily: "'Roboto Mono', monospace" }}>{b}</span>
          <div style={{ flex: 1, height: 10, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(vals[i] / maxVal) * 100}%`,
              background: lateIdx.includes(i) && isLateNight ? '#DC2626' : '#3B82F6',
              borderRadius: 3,
            }} />
          </div>
          <span style={{ fontSize: 12, color: lateIdx.includes(i) && isLateNight ? '#DC2626' : '#475569', fontWeight: lateIdx.includes(i) && isLateNight ? 700 : 400, minWidth: 28, textAlign: 'right', fontFamily: "'Roboto Mono', monospace" }}>{vals[i]}%</span>
        </div>
      ))}
      {isLateNight && (
        <div style={{ marginTop: 8, padding: '6px 10px', background: '#FEF2F2', borderRadius: 5, fontSize: 13, color: '#DC2626', fontWeight: 600, borderLeft: '2px solid #DC2626' }}>
          Late-night activity elevated - 22:00-06:00 accounts for {vals[4] + vals[5]}% of sessions
        </div>
      )}
    </div>
  );
}

Object.assign(window, { SessionTimingChart });

