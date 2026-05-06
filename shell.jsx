// Top bar + sidebar shell for King's Guard

const { useState } = React;

function TopBar({ brand, setBrand, country, setCountry, lastRefresh }) {
  const theme = getBrandTheme(brand);
  const isBrand = brand === 'betking' || brand === 'supersportbet';
  return (
    <div style={{
      height: 64, background: theme.topbar,
      borderBottom: `1px solid ${theme.topbarBorder}`,
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16,
      color: '#E2E8F0', flexShrink: 0,
      transition: 'background 200ms ease, border-color 200ms ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingRight: 20, borderRight: '1px solid rgba(255,255,255,0.10)', height: '100%' }}>
        {isBrand ? (
          <>
            <img src={theme.logoSrc} alt={theme.name} style={{ height: 22, width: 'auto', display: 'block' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, paddingLeft: 12, borderLeft: '1px solid rgba(255,255,255,0.16)' }}>
              <span style={{ fontSize: 13, color: '#E2E8F0', fontWeight: 600, letterSpacing: '0.01em', lineHeight: 1 }}>King's Guard</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.10em', textTransform: 'uppercase', lineHeight: 1 }}>RG Intelligence</span>
            </div>
          </>
        ) : (
          <>
            <GuardLogo size={26} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '0.01em' }}>King's Guard</span>
              <span style={{ fontSize: 12, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>RG Intelligence</span>
            </div>
          </>
        )}
      </div>

      {/* Brand switcher — segmented */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 6 }}>
        {['betking', 'supersportbet'].map(b => {
          const bt = BRAND_THEME[b];
          const active = brand === b;
          return (
            <button key={b}
              onClick={() => setBrand(b)}
              style={{
                padding: '5px 10px', borderRadius: 4, border: 'none',
                background: active ? 'rgba(255,255,255,0.14)' : 'transparent',
                color: active ? '#FFFFFF' : 'rgba(255,255,255,0.62)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
                boxShadow: active ? `inset 0 -2px 0 ${bt.accent}` : 'none',
              }}>
              <span style={{
                display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                background: bt.accent,
              }}></span>
              {bt.name}
            </button>
          );
        })}
      </div>

      {/* Country */}
      <Dropdown
        value={country}
        options={[
          { v: 'ALL', label: 'All markets' },
          ...(brand === 'betking' ? [{ v: 'NG', label: 'Nigeria' }] : [{ v: 'ZA', label: 'South Africa' }, { v: 'ZM', label: 'Zambia' }])
        ]}
        onChange={setCountry}
      />

      <div style={{ flex: 1 }}></div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(148,163,184,0.08)', borderRadius: 6,
        padding: '6px 10px', width: 280,
        border: '1px solid rgba(148,163,184,0.12)',
      }}>
        <Icon name="search" size={14} color="#94A3B8" />
        <input
          placeholder="Search Customer ID…"
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            color: '#E2E8F0', fontSize: 15, flex: 1, fontFamily: 'inherit',
          }}
        />
        <kbd style={{ fontSize: 12, color: '#64748B', padding: '1px 5px', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 3 }}>⌘K</kbd>
      </div>

      {/* Refresh */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'rgba(22, 163, 74, 0.08)', borderRadius: 6, border: '1px solid rgba(22, 163, 74, 0.18)' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A', boxShadow: '0 0 0 3px rgba(22,163,74,0.18)' }}></span>
        <span style={{ fontSize: 13, color: '#86EFAC', fontWeight: 500 }}>Synced {lastRefresh}</span>
      </div>

      <button style={{ background: 'transparent', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: 6, display: 'flex' }}>
        <Icon name="bell" size={16} />
      </button>
      <button style={{ background: 'transparent', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: 6, display: 'flex' }}>
        <Icon name="help" size={16} />
      </button>
      <div style={{
        width: 30, height: 30, borderRadius: '50%',
        background: 'linear-gradient(135deg, #475569, #1E293B)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, color: '#E2E8F0',
        border: '1px solid rgba(148,163,184,0.24)',
      }}>OA</div>
    </div>
  );
}

function Dropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.v === value) || options[0];
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.12)',
        borderRadius: 6, padding: '6px 10px',
        color: '#E2E8F0', fontSize: 14, fontWeight: 500, cursor: 'pointer',
        fontFamily: 'inherit',
      }}>
        {current.label}
        <Icon name="down" size={12} color="#94A3B8" />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }}></div>
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0,
            background: '#1E293B', border: '1px solid rgba(148,163,184,0.16)',
            borderRadius: 6, padding: 4, minWidth: 160, zIndex: 11,
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
          }}>
            {options.map(o => (
              <button key={o.v} onClick={() => { onChange(o.v); setOpen(false); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '7px 10px', borderRadius: 4, border: 'none',
                  background: o.v === value ? 'rgba(148,163,184,0.12)' : 'transparent',
                  color: '#E2E8F0', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(148,163,184,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = o.v === value ? 'rgba(148,163,184,0.12)' : 'transparent'}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Sidebar({ activeView, setActiveView, brand, country, dateRange }) {
  const theme = getBrandTheme(brand);
  const items = [
    { id: 'home', label: 'Dashboard', icon: 'home' },
    { id: 'players', label: 'Player List', icon: 'list' },
    { id: 'population', label: 'Player Behaviours & Trends', icon: 'chart' },
    { id: 'monitoring', label: 'Monitoring & Flags', icon: 'flag', count: 12 },
    { id: 'log', label: 'Interaction Log', icon: 'log' },
    { id: 'reporting', label: 'Reporting', icon: 'export' },
  ];
  return (
    <div style={{
      width: 280, background: theme.sidebar, flexShrink: 0,
      borderRight: '1px solid rgba(148, 163, 184, 0.08)',
      display: 'flex', flexDirection: 'column', padding: '16px 12px 12px',
      color: '#CBD5E1',
      transition: 'background 200ms ease',
      overflow: 'hidden',
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: '#64748B', textTransform: 'uppercase', padding: '8px 8px 12px' }}>Workspace</div>
      {items.map(item => (
        <button key={item.id} onClick={() => setActiveView(item.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 10px', borderRadius: 6, border: 'none',
            background: activeView === item.id ? theme.accentBg : 'transparent',
            color: activeView === item.id ? theme.accentText : '#CBD5E1',
            fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            textAlign: 'left', marginBottom: 2,
            borderLeft: activeView === item.id ? `2px solid ${theme.accent}` : '2px solid transparent',
            paddingLeft: activeView === item.id ? 12 : 14,
          }}
          onMouseEnter={e => { if (activeView !== item.id) e.currentTarget.style.background = 'rgba(148,163,184,0.06)'; }}
          onMouseLeave={e => { if (activeView !== item.id) e.currentTarget.style.background = 'transparent'; }}
        >
          <Icon name={item.icon} size={16} />
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.count && (
            <span style={{
              fontSize: 12, fontWeight: 700, padding: '2px 6px', borderRadius: 10,
              background: activeView === item.id ? theme.accentBg : 'rgba(148,163,184,0.12)',
              color: activeView === item.id ? theme.accentText : '#94A3B8',
            }}>{item.count}</span>
          )}
        </button>
      ))}

      <div style={{ flex: 1 }}></div>

      <SidebarCopilot brand={brand} country={country} dateRange={dateRange} theme={theme} />
    </div>
  );
}

function SidebarCopilot({ brand, country, dateRange, theme }) {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = React.useRef(null);
  const reqIdRef = React.useRef(0);

  // Reset thread when context changes
  React.useEffect(() => { setChatHistory([]); }, [brand, country, dateRange]);
  // Auto-scroll thread to bottom on new messages
  React.useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [chatHistory, chatLoading]);

  const brandLabel = brand === 'all' ? 'KingMakers Portfolio' : brand === 'betking' ? 'BetKing' : 'SuperSportBet';
  const countryLabel = country === 'ALL' ? 'all markets' : country === 'NG' ? 'Nigeria' : country === 'ZA' ? 'South Africa' : country === 'ZM' ? 'Zambia' : country;
  const rangeLabel = dateRange === '24h' ? 'last 24 hours' : dateRange === '7d' ? 'last 7 days' : dateRange === '14d' ? 'last 14 days' : dateRange === '30d' ? 'last 30 days' : dateRange === '90d' ? 'last 90 days' : 'custom range';

  const submit = (q) => {
    const trimmed = (q || '').trim();
    if (!trimmed || chatLoading) return;
    const reqId = ++reqIdRef.current;
    setChatHistory(h => [...h, { role: 'user', text: trimmed }]);
    setChatInput('');
    setChatLoading(true);

    const priorTurns = chatHistory.slice(-6).map(m =>
      `${m.role === 'user' ? 'Operator' : 'Copilot'}: ${m.text}`
    ).join('\n');

    const prompt = `You are RG Copilot, an internal AI analyst inside the King's Guard responsible-gambling platform at KingMakers. Your audience is the CS + RG operations team. Be calm, professional, operational. Respond in plain text — no markdown headers. You may use **bold** for one or two key phrases per response. Keep replies concise — 2 to 3 short sentences max unless the operator asks for a list, in which case use up to 4 short bullets prefixed with "- ".

LIVE CONTEXT:
- Operator: ${brandLabel} (${countryLabel})
- Time window: ${rangeLabel}
- Active workspace view: King's Guard dashboard with risk-distribution, deposit volume, top movers, signals, and outreach queue.

${priorTurns ? `PRIOR TURNS:\n${priorTurns}\n` : ''}OPERATOR QUESTION: ${trimmed}

Answer directly. If the question is outside RG operations, say so briefly. If actionable, end with one concrete next step (e.g. "open Player List filtered to high risk").`;

    window.claude.complete(prompt)
      .then(text => {
        if (reqIdRef.current !== reqId) return;
        setChatHistory(h => [...h, { role: 'assistant', text: (text || '').trim() }]);
        setChatLoading(false);
      })
      .catch(() => {
        if (reqIdRef.current !== reqId) return;
        setChatHistory(h => [...h, { role: 'assistant', text: 'Sorry — I could not reach the analysis service. Try again in a moment.' }]);
        setChatLoading(false);
      });
  };

  const samples = [
    "Where should I focus today?",
    "What's changed for VIPs?",
    "Spot recent risk spikes",
  ];

  const isEmpty = chatHistory.length === 0 && !chatLoading;

  return (
    <div style={{
      flex: 1, minHeight: 0,
      display: 'flex', flexDirection: 'column',
      borderRadius: 8, overflow: 'hidden',
      background: 'rgba(15,23,42,0.45)',
      border: '1px solid rgba(148,163,184,0.10)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 12px',
        borderBottom: '1px solid rgba(148,163,184,0.08)',
        flexShrink: 0,
      }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 18, height: 18, borderRadius: 4,
          background: 'linear-gradient(135deg, #6366F1, #4338CA)',
          color: '#FFFFFF', fontSize: 13, fontWeight: 700, lineHeight: 1,
        }}>★</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>King's Guard AI</span>
        <span style={{ marginLeft: 'auto', fontSize: 9.5, color: '#64748B', fontWeight: 500 }}>{rangeLabel}</span>
        {chatHistory.length > 0 && (
          <button onClick={() => { reqIdRef.current++; setChatHistory([]); setChatLoading(false); }} style={{
            background: 'transparent', border: 'none', color: '#64748B',
            fontSize: 9.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            padding: '2px 4px', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>Clear</button>
        )}
      </div>

      {/* Thread */}
      <div ref={chatScrollRef} style={{
        flex: 1, minHeight: 0, overflowY: 'auto',
        padding: 10,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {isEmpty && (
          <>
            <div style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, textWrap: 'pretty', padding: '4px 2px 8px' }}>
              I have live context on this view. Ask about risk, players, deposits, or trends.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {samples.map((s, i) => (
                <button key={i} onClick={() => submit(s)} style={{
                  textAlign: 'left', padding: '7px 10px', borderRadius: 6,
                  background: 'rgba(148,163,184,0.06)',
                  border: '1px solid rgba(148,163,184,0.10)',
                  fontSize: 11.5, color: '#CBD5E1', fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 120ms ease, border-color 120ms ease, color 120ms ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.14)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.40)'; e.currentTarget.style.color = '#E2E8F0'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.06)'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.10)'; e.currentTarget.style.color = '#CBD5E1'; }}
                >{s}</button>
              ))}
            </div>
          </>
        )}

        {chatHistory.map((m, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', gap: 3,
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '92%',
          }}>
            <div style={{
              fontSize: 10, color: '#64748B', fontWeight: 700, letterSpacing: '0.10em',
              textTransform: 'uppercase', textAlign: m.role === 'user' ? 'right' : 'left',
              padding: '0 2px',
            }}>{m.role === 'user' ? 'You' : 'Copilot'}</div>
            <div style={{
              fontSize: 11.5, lineHeight: 1.5,
              color: m.role === 'user' ? '#FFFFFF' : '#E2E8F0',
              background: m.role === 'user'
                ? 'linear-gradient(135deg, #6366F1, #4338CA)'
                : 'rgba(148,163,184,0.08)',
              border: m.role === 'user' ? 'none' : '1px solid rgba(148,163,184,0.10)',
              padding: '7px 10px', borderRadius: 7,
              textWrap: 'pretty', whiteSpace: 'pre-wrap',
            }}
              dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#FFFFFF;font-weight:700">$1</strong>') }}
            ></div>
          </div>
        ))}
        {chatLoading && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 5, padding: '8px 10px', background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.10)', borderRadius: 7 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#94A3B8', animation: 'kg-sb-pulse 1.2s ease-in-out infinite' }}></span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#94A3B8', animation: 'kg-sb-pulse 1.2s ease-in-out 0.2s infinite' }}></span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#94A3B8', animation: 'kg-sb-pulse 1.2s ease-in-out 0.4s infinite' }}></span>
          </div>
        )}
      </div>

      {/* Input pinned at bottom */}
      <form onSubmit={(e) => { e.preventDefault(); submit(chatInput); }} style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: 8,
        borderTop: '1px solid rgba(148,163,184,0.08)',
        flexShrink: 0,
      }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 4,
          background: 'rgba(15,23,42,0.7)',
          border: '1px solid rgba(148,163,184,0.18)',
          borderRadius: 6, padding: '2px 2px 2px 8px',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
        }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.55)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.14)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.18)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask anything…"
            disabled={chatLoading}
            style={{
              flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 14, color: '#E2E8F0', fontFamily: 'inherit', padding: '5px 0',
            }}
          />
          <button type="submit" disabled={chatLoading || !chatInput.trim()} style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 22, height: 22, borderRadius: 4, border: 'none', flexShrink: 0,
            background: chatInput.trim() && !chatLoading
              ? 'linear-gradient(135deg, #6366F1, #4338CA)'
              : 'rgba(148,163,184,0.18)',
            color: '#FFFFFF', fontSize: 13, fontWeight: 700,
            cursor: chatInput.trim() && !chatLoading ? 'pointer' : 'default',
            fontFamily: 'inherit',
          }}>↑</button>
        </div>
      </form>

      <style>{`
        @keyframes kg-sb-pulse { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}

Object.assign(window, { TopBar, Sidebar, Dropdown });