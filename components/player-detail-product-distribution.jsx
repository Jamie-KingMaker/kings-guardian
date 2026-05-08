// Player Detail - product distribution chart.

const { pdSeeded, playerSeed, KGEnums } = window;

function ProductDistribution({ player }) {
  const rnd = pdSeeded(playerSeed(player.id) + 1);
  const prods = player.products || [KGEnums.PRODUCT.SPORTS];
  const hasCasino = prods.includes(KGEnums.PRODUCT.CASINO);
  const hasVirtuals = prods.includes(KGEnums.PRODUCT.VIRTUALS);
  const hasShift = (player.signals || []).includes('Sports -> Casino shift') || (player.signals || []).includes('Sports → Casino shift');

  const endCasino = hasCasino ? (hasShift ? 68 + Math.floor(rnd() * 12) : 30 + Math.floor(rnd() * 20)) : 0;
  const endVirtuals = hasVirtuals ? 3 + Math.floor(rnd() * 5) : 0;
  const startCasino = hasCasino ? Math.max(5, endCasino - (hasShift ? 55 : 15) + Math.floor(rnd() * 10)) : 0;
  const startVirtuals = hasVirtuals ? Math.max(1, endVirtuals - 2) : 0;

  const dates = ['Apr 09', 'Apr 12', 'Apr 15', 'Apr 18', 'Apr 21', 'Apr 24', 'Apr 27', 'Apr 30'];
  const data = dates.map((day, i) => {
    const t = i / (dates.length - 1);
    const casino = Math.round(startCasino + (endCasino - startCasino) * t + (rnd() - 0.5) * 3);
    const virtuals = Math.round(startVirtuals + (endVirtuals - startVirtuals) * t);
    const sports = Math.max(0, 100 - casino - virtuals);
    return { day, sports, casino, virtuals };
  });

  const productColors = {
    [KGEnums.PRODUCT.SPORTS]: '#3B82F6',
    [KGEnums.PRODUCT.CASINO]: '#A855F7',
    [KGEnums.PRODUCT.VIRTUALS]: '#06B6D4',
  };

  const latestSports = data[data.length - 1].sports;
  const latestCasino = data[data.length - 1].casino;
  const latestVirtuals = data[data.length - 1].virtuals;

  return (
    <div id={KGEnums.COMPONENT_ID.PLAYER_DETAIL_PRODUCT_DISTRIBUTION_CHART}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 90, marginBottom: 8 }}>
        {data.map(d => (
          <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', height: '100%', borderRadius: 2, overflow: 'hidden' }}>
            {d.sports > 0 && <div style={{ height: `${d.sports}%`, background: productColors[KGEnums.PRODUCT.SPORTS] }} />}
            {d.casino > 0 && <div style={{ height: `${d.casino}%`, background: productColors[KGEnums.PRODUCT.CASINO] }} />}
            {d.virtuals > 0 && <div style={{ height: `${d.virtuals}%`, background: productColors[KGEnums.PRODUCT.VIRTUALS] }} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', marginBottom: 14 }}>
        {data.map(d => <span key={d.day}>{d.day}</span>)}
      </div>

      <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
        {[
          [KGEnums.PRODUCT.SPORTS, productColors[KGEnums.PRODUCT.SPORTS], `${latestSports}%`],
          hasCasino ? [KGEnums.PRODUCT.CASINO, productColors[KGEnums.PRODUCT.CASINO], `${latestCasino}%`] : null,
          hasVirtuals ? [KGEnums.PRODUCT.VIRTUALS, productColors[KGEnums.PRODUCT.VIRTUALS], `${latestVirtuals}%`] : null,
        ].filter(Boolean).map(([label, color, value]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, background: color, borderRadius: 2 }} />
            <span style={{ color: '#475569' }}>{label}</span>
            <span style={{ color: '#0F172A', fontWeight: 600, fontFamily: "'Roboto Mono', monospace" }}>{value}</span>
          </div>
        ))}
      </div>

      {hasShift && (
        <div style={{ marginTop: 12, padding: '8px 10px', background: 'rgba(168, 85, 247, 0.06)', borderRadius: 5, fontSize: 13, color: '#475569', borderLeft: '2px solid #A855F7' }}>
          <strong style={{ color: '#0F172A' }}>Pattern shift detected:</strong> Movement from Sports -> Casino over the last 14 days.
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ProductDistribution });

