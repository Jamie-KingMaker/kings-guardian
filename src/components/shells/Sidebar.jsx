// src/components/shells/Sidebar.jsx
import { BRAND_THEME } from '@/config/brands.js';
import { Icon }        from '@/components/atoms/index.js';
import t from '@/config/i18n.js';
import { SidebarCopilot } from './SidebarCopilot.jsx';

const NAV_ITEMS = [
  { id: 'home',       label: t.nav.dashboard,         icon: 'home'   },
  { id: 'players',    label: t.nav.playerList,         icon: 'list'   },
  { id: 'population', label: t.nav.playerBehaviours,   icon: 'chart'  },
  { id: 'monitoring', label: t.nav.monitoring,         icon: 'flag',  count: 12 },
  { id: 'log',        label: t.nav.interactionLog,     icon: 'log'    },
  { id: 'reporting',  label: t.nav.reporting,          icon: 'export' },
];

export function Sidebar({ activeView, setActiveView, brand, country, dateRange }) {
  const theme = BRAND_THEME[brand] ?? BRAND_THEME.all;

  return (
    <div style={{ width: 280, background: theme.sidebar, flexShrink: 0, borderRight: '1px solid rgba(148, 163, 184, 0.08)', display: 'flex', flexDirection: 'column', padding: '16px 12px 12px', color: '#CBD5E1', transition: 'background 200ms ease', overflow: 'hidden' }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: '#64748B', textTransform: 'uppercase', padding: '8px 8px 12px' }}>{t.nav.workspace}</div>

      {NAV_ITEMS.map(item => (
        <button key={item.id} onClick={() => setActiveView(item.id)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 6, border: 'none', background: activeView === item.id ? theme.accentBg : 'transparent', color: activeView === item.id ? theme.accentText : '#CBD5E1', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', marginBottom: 2, borderLeft: activeView === item.id ? `2px solid ${theme.accent}` : '2px solid transparent', paddingLeft: activeView === item.id ? 12 : 14 }}
          onMouseEnter={e => { if (activeView !== item.id) e.currentTarget.style.background = 'rgba(148,163,184,0.06)'; }}
          onMouseLeave={e => { if (activeView !== item.id) e.currentTarget.style.background = 'transparent'; }}
        >
          <Icon name={item.icon} size={16} />
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.count && (
            <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 6px', borderRadius: 10, background: activeView === item.id ? theme.accentBg : 'rgba(148,163,184,0.12)', color: activeView === item.id ? theme.accentText : '#94A3B8' }}>{item.count}</span>
          )}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      <SidebarCopilot brand={brand} country={country} dateRange={dateRange} theme={theme} />
    </div>
  );
}

