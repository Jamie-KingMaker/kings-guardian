import { useState, useEffect } from 'react';
import { TopBar, Sidebar } from '@/components/shells/index.js';
import { HomeDashboard } from '@/views/Home/index.jsx';
import { PlayerList } from '@/views/PlayerList/index.jsx';
import { PlayerDetail } from '@/views/PlayerDetail/index.jsx';
import { PopulationRisk } from '@/views/PopulationRisk/index.jsx';
import { InteractionLog } from '@/views/InteractionLog/index.jsx';

export default function App() {
  const [brand, setBrand] = useState('betking');
  const [country, setCountry] = useState('NG');
  const [dateRange, setDateRange] = useState('7d');
  const [customRange, setCustomRange] = useState(null);
  const [activeView, setActiveView] = useState('home');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    if (brand === 'betking' && country !== 'NG' && country !== 'ALL') setCountry('NG');
    if (brand === 'supersportbet' && country === 'NG') setCountry('ZA');
  }, [brand, country]);

  const handlePlayerClick = (id) => {
    setSelectedPlayer(id);
    setActiveView('player-detail');
  };

  let body;
  if (activeView === 'home') {
    body = <HomeDashboard brand={brand} country={country} dateRange={dateRange} customRange={customRange} setDateRange={setDateRange} setCustomRange={setCustomRange} onPlayerClick={handlePlayerClick} />;
  } else if (activeView === 'players') {
    body = <PlayerList brand={brand} country={country} range={dateRange} onPlayerClick={handlePlayerClick} />;
  } else if (activeView === 'player-detail') {
    body = <PlayerDetail playerId={selectedPlayer} onBack={() => setActiveView('players')} />;
  } else if (activeView === 'population') {
    body = <PopulationRisk brand={brand} country={country} dateRange={dateRange} />;
  } else if (activeView === 'log') {
    body = <InteractionLog brand={brand} country={country} onPlayerClick={handlePlayerClick} />;
  } else {
    body = (
      <div style={{ padding: 24 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 40, textAlign: 'center', color: '#94A3B8' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#475569', marginBottom: 6 }}>{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</div>
          <div style={{ fontSize: 12 }}>Section scaffolded — primary working screens are <strong>Dashboard</strong> and <strong>Player List</strong>.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar brand={brand} setBrand={setBrand} country={country} setCountry={setCountry} lastRefresh="3h ago" />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar
          activeView={activeView === 'player-detail' ? 'players' : activeView}
          setActiveView={(v) => { setActiveView(v); setSelectedPlayer(null); }}
          brand={brand}
          country={country}
          dateRange={dateRange}
        />
        <div style={{ flex: 1, overflow: 'auto', background: '#F1F5F9' }}>{body}</div>
      </div>
    </div>
  );
}

