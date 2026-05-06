// src/components/shells/SidebarCopilot.jsx
import { useState, useEffect, useRef } from 'react';
import { aiService } from '@/api/index.js';
import t from '@/config/i18n.js';

export function SidebarCopilot({ brand, country, dateRange, theme }) {
  const [chatInput, setChatInput]   = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef(null);
  const reqIdRef      = useRef(0);

  useEffect(() => { setChatHistory([]); }, [brand, country, dateRange]);
  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [chatHistory, chatLoading]);

  const rangeLabel = dateRange === '24h' ? 'last 24 hours' : dateRange === '7d' ? 'last 7 days' : dateRange === '14d' ? 'last 14 days' : dateRange === '30d' ? 'last 30 days' : dateRange === '90d' ? 'last 90 days' : 'custom range';

  const submit = async (q) => {
    const trimmed = (q ?? '').trim();
    if (!trimmed || chatLoading) return;
    const reqId = ++reqIdRef.current;
    setChatHistory(h => [...h, { role: 'user', text: trimmed }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const { reply } = await aiService.chat({
        messages: [...chatHistory, { role: 'user', text: trimmed }],
        context: { brand, country, range: dateRange },
      });
      if (reqIdRef.current !== reqId) return;
      setChatHistory(h => [...h, { role: 'assistant', text: reply ?? '' }]);
    } catch {
      if (reqIdRef.current !== reqId) return;
      setChatHistory(h => [...h, { role: 'assistant', text: t.ai.error }]);
    } finally {
      if (reqIdRef.current === reqId) setChatLoading(false);
    }
  };

  const isEmpty = chatHistory.length === 0 && !chatLoading;

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', borderRadius: 8, overflow: 'hidden', background: 'rgba(15,23,42,0.45)', border: '1px solid rgba(148,163,184,0.10)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderBottom: '1px solid rgba(148,163,184,0.08)', flexShrink: 0 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 4, background: 'linear-gradient(135deg, #6366F1, #4338CA)', color: '#FFFFFF', fontSize: 13, fontWeight: 700, lineHeight: 1 }}>★</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.ai.title}</span>
        <span style={{ marginLeft: 'auto', fontSize: 9.5, color: '#64748B', fontWeight: 500 }}>{rangeLabel}</span>
        {chatHistory.length > 0 && (
          <button onClick={() => { reqIdRef.current++; setChatHistory([]); setChatLoading(false); }}
            style={{ background: 'transparent', border: 'none', color: '#64748B', fontSize: 9.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: '2px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t.ai.clearThread}
          </button>
        )}
      </div>

      {/* Thread */}
      <div ref={chatScrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {isEmpty && (
          <>
            <div style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, padding: '4px 2px 8px' }}>{t.ai.emptyPrompt}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {t.ai.samples.map((s, i) => (
                <button key={i} onClick={() => submit(s)} style={{ textAlign: 'left', padding: '7px 10px', borderRadius: 6, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.10)', fontSize: 11.5, color: '#CBD5E1', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.14)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.40)'; e.currentTarget.style.color = '#E2E8F0'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.06)'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.10)'; e.currentTarget.style.color = '#CBD5E1'; }}
                >{s}</button>
              ))}
            </div>
          </>
        )}

        {chatHistory.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3, alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '92%' }}>
            <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', textAlign: m.role === 'user' ? 'right' : 'left', padding: '0 2px' }}>
              {m.role === 'user' ? t.ai.you : t.ai.copilot}
            </div>
            <div style={{ fontSize: 11.5, lineHeight: 1.5, color: m.role === 'user' ? '#FFFFFF' : '#E2E8F0', background: m.role === 'user' ? 'linear-gradient(135deg, #6366F1, #4338CA)' : 'rgba(148,163,184,0.08)', border: m.role === 'user' ? 'none' : '1px solid rgba(148,163,184,0.10)', padding: '7px 10px', borderRadius: 7, whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#FFFFFF;font-weight:700">$1</strong>') }}
            />
          </div>
        ))}

        {chatLoading && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 5, padding: '8px 10px', background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.10)', borderRadius: 7 }}>
            {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#94A3B8', animation: `kg-sb-pulse 1.2s ease-in-out ${d}s infinite` }} />)}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={e => { e.preventDefault(); submit(chatInput); }}
        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: 8, borderTop: '1px solid rgba(148,163,184,0.08)', flexShrink: 0 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 6, padding: '2px 2px 2px 8px' }}>
          <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={t.ai.placeholder} disabled={chatLoading}
            style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: '#E2E8F0', fontFamily: 'inherit', padding: '5px 0' }} />
          <button type="submit" disabled={chatLoading || !chatInput.trim()}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 4, border: 'none', flexShrink: 0, background: chatInput.trim() && !chatLoading ? 'linear-gradient(135deg, #6366F1, #4338CA)' : 'rgba(148,163,184,0.18)', color: '#FFFFFF', fontSize: 13, fontWeight: 700, cursor: chatInput.trim() && !chatLoading ? 'pointer' : 'default', fontFamily: 'inherit' }}>↑</button>
        </div>
      </form>

      <style>{`@keyframes kg-sb-pulse { 0%,80%,100% { opacity:0.3;transform:scale(0.8); } 40% { opacity:1;transform:scale(1); } }`}</style>
    </div>
  );
}

