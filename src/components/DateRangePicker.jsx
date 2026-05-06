// src/components/DateRangePicker.jsx
import { useState, useEffect, useRef } from 'react';
import { fmtMonthYear, fmtShort, sameDay, diffDays, DATE_PRESETS } from '@/utils/dateRange.js';

const DR = {
  trigBg: 'rgba(148,163,184,0.08)', trigBorder: 'rgba(148,163,184,0.12)',
  trigText: '#E2E8F0', trigMuted: '#94A3B8',
  surface: '#1E293B', surfaceBorder: 'rgba(148,163,184,0.16)',
  divider: 'rgba(148,163,184,0.10)', itemHover: 'rgba(148,163,184,0.12)',
  itemSelected: 'rgba(148,163,184,0.16)', text: '#E2E8F0',
  textMuted: '#94A3B8', textDim: '#64748B',
  accent: '#F59E0B', accentSoft: 'rgba(245,158,11,0.16)', accentSofter: 'rgba(245,158,11,0.10)',
};

function PresetItem({ selected, onClick, label, trailing }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 4, border: 'none', background: selected ? DR.itemSelected : 'transparent', color: DR.text, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = DR.itemHover; }}
      onMouseLeave={e => { e.currentTarget.style.background = selected ? DR.itemSelected : 'transparent'; }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: selected ? DR.accent : 'transparent', flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{label}</span>
      {trailing && <span style={{ fontSize: 13, color: DR.textMuted, fontFamily: "'Roboto Mono', monospace" }}>{trailing}</span>}
    </button>
  );
}

function NavBtn({ onClick, direction }) {
  return (
    <button onClick={onClick} style={{ width: 22, height: 22, borderRadius: 4, border: 'none', background: 'transparent', color: DR.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseEnter={e => e.currentTarget.style.background = DR.itemHover}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {direction === 'left' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );
}

function DateChip({ label, date, active }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '4px 10px', borderRadius: 4, background: active ? DR.accentSofter : 'transparent', border: `1px solid ${active ? DR.accent : DR.divider}`, minWidth: 120 }}>
      <span style={{ fontSize: 11, color: DR.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 15, color: date ? DR.text : DR.textDim, fontWeight: 500, fontFamily: "'Roboto Mono', monospace", letterSpacing: '-0.01em' }}>
        {date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '— — —'}
      </span>
    </div>
  );
}

function CalendarMonth({ month, start, end, today, onDayClick, onDayHover, onPrev, onNext, showPrev, showNext }) {
  const year = month.getFullYear(), m = month.getMonth();
  const firstDay = new Date(year, m, 1);
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, m, d));
  while (cells.length % 7) cells.push(null);
  const dows = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div style={{ padding: '0 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 0 8px' }}>
        {showPrev ? <NavBtn onClick={onPrev} direction="left" /> : <div style={{ width: 22 }} />}
        <div style={{ fontSize: 14, fontWeight: 600, color: DR.text, letterSpacing: '0.01em' }}>{fmtMonthYear(month)}</div>
        {showNext ? <NavBtn onClick={onNext} direction="right" /> : <div style={{ width: 22 }} />}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 2 }}>
        {dows.map((d, i) => <div key={i} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: DR.textDim, padding: '4px 0', letterSpacing: '0.04em' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} style={{ height: 30 }} />;
          const isStart  = sameDay(d, start), isEnd = sameDay(d, end);
          const inRange  = start && end && d > start && d < end;
          const isFuture = d > today, isToday = sameDay(d, today);
          const fillLeft = (inRange || isEnd) && start && end && !sameDay(start, end);
          const fillRight= (inRange || isStart) && start && end && !sameDay(start, end);
          return (
            <div key={i} onMouseEnter={() => onDayHover(d)} onMouseLeave={() => onDayHover(null)}
              style={{ height: 30, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {fillLeft  && <div style={{ position: 'absolute', left: 0, top: 3, bottom: 3, width: '50%', background: DR.accentSofter }} />}
              {fillRight && <div style={{ position: 'absolute', right: 0, top: 3, bottom: 3, width: '50%', background: DR.accentSofter }} />}
              <button onClick={isFuture ? undefined : () => onDayClick(d)} disabled={isFuture}
                style={{ position: 'relative', zIndex: 1, width: 28, height: 26, borderRadius: 4, border: isToday && !isStart && !isEnd ? `1px solid ${DR.accent}` : '1px solid transparent', background: (isStart || isEnd) ? DR.accent : 'transparent', color: (isStart || isEnd) ? '#0F172A' : (isFuture ? DR.textDim : DR.text), fontSize: 14, fontWeight: (isStart || isEnd) ? 700 : 500, fontFamily: "'Roboto Mono', monospace", cursor: isFuture ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                onMouseEnter={e => { if (!isFuture && !isStart && !isEnd) e.currentTarget.style.background = DR.itemHover; }}
                onMouseLeave={e => { if (!isStart && !isEnd) e.currentTarget.style.background = 'transparent'; }}>
                {d.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarRange({ draft, hoverDate, setHoverDate, onDayClick, leftMonth, setLeftMonth, today, onBack, onCancel, onApply, canApply }) {
  const rightMonth = new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1);
  const start = draft.start;
  const end   = draft.end || (start && hoverDate && hoverDate > start ? hoverDate : null);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderBottom: `1px solid ${DR.divider}` }}>
        {onBack ? (
          <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', color: DR.textMuted, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', padding: '4px 6px', borderRadius: 4 }}
            onMouseEnter={e => e.currentTarget.style.background = DR.itemHover}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            Presets
          </button>
        ) : <div />}
        <div style={{ width: 1, height: 18, background: DR.divider }} />
        <DateChip label="Start" date={draft.start} active={!draft.start || !!(draft.start && draft.end)} />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={DR.textMuted} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        <DateChip label="End" date={draft.end} active={!!(draft.start && !draft.end)} />
        {draft.start && draft.end && (
          <span style={{ marginLeft: 'auto', padding: '2px 7px', borderRadius: 4, background: DR.accentSoft, color: DR.accent, fontSize: 13, fontWeight: 700, fontFamily: "'Roboto Mono', monospace" }}>{diffDays(draft.start, draft.end) + 1}d</span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, padding: '12px 4px 4px' }}>
        <CalendarMonth month={leftMonth} start={start} end={end} today={today} onDayClick={onDayClick} onDayHover={setHoverDate}
          onPrev={() => setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() - 1, 1))} onNext={null} showPrev showNext={false} />
        <CalendarMonth month={rightMonth} start={start} end={end} today={today} onDayClick={onDayClick} onDayHover={setHoverDate}
          onPrev={null} onNext={() => setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1))} showPrev={false} showNext />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '10px 12px', borderTop: `1px solid ${DR.divider}` }}>
        <button onClick={onCancel} style={{ padding: '6px 12px', borderRadius: 6, background: 'transparent', color: DR.textMuted, border: `1px solid ${DR.divider}`, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
        <button onClick={canApply ? onApply : undefined} disabled={!canApply}
          style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: canApply ? DR.accent : DR.itemHover, color: canApply ? '#0F172A' : DR.textDim, fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: canApply ? 'pointer' : 'default' }}>Apply range</button>
      </div>
    </div>
  );
}

export function DateRangePicker({ value, onChange, custom, onCustom, pageMode }) {
  const [open, setOpen]    = useState(false);
  const [picking, setPicking] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);
  const [draft, setDraft]  = useState({ start: custom?.start ?? null, end: custom?.end ?? null });
  const today = new Date(2026, 4, 5);
  const [leftMonth, setLeftMonth] = useState(new Date(today.getFullYear(), today.getMonth() - 1, 1));
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setPicking(false); } };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const triggerLabel = (() => {
    if (value === 'custom' && custom?.start && custom?.end) return `${fmtShort(custom.start)} – ${fmtShort(custom.end)}, ${custom.end.getFullYear()}`;
    return DATE_PRESETS.find(p => p.v === value)?.label ?? 'Last 7 days';
  })();

  const handlePreset  = (v) => { onChange(v); setPicking(false); setOpen(false); };
  const handleDayClick= (d) => {
    if (!draft.start || (draft.start && draft.end)) { setDraft({ start: d, end: null }); }
    else { if (d < draft.start) setDraft({ start: d, end: draft.start }); else setDraft({ start: draft.start, end: d }); }
  };
  const applyCustom  = () => { if (draft.start && draft.end) { onCustom(draft); onChange('custom'); setOpen(false); setPicking(false); } };

  if (pageMode) {
    const customActive = value === 'custom';
    const customLabel  = customActive && custom?.start && custom?.end ? triggerLabel : 'Custom range…';
    return (
      <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        {DATE_PRESETS.map(p => {
          const active = value === p.v;
          return (
            <button key={p.v} onClick={() => handlePreset(p.v)} style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${active ? '#0F172A' : '#E2E8F0'}`, background: active ? '#0F172A' : '#FFFFFF', color: active ? '#FFFFFF' : '#64748B', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#334155'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B'; } }}>
              {p.label}
            </button>
          );
        })}
        <button onClick={() => { setOpen(true); setPicking(true); setDraft({ start: custom?.start ?? null, end: custom?.end ?? null }); }}
          style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${customActive ? '#0F172A' : '#E2E8F0'}`, background: customActive ? '#0F172A' : '#FFFFFF', color: customActive ? '#FFFFFF' : '#64748B', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          📅 {customLabel}
        </button>
        {open && picking && (
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: DR.surface, border: `1px solid ${DR.surfaceBorder}`, borderRadius: 6, zIndex: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.25)', fontFamily: 'inherit', width: 600 }}>
            <CalendarRange draft={draft} hoverDate={hoverDate} setHoverDate={setHoverDate} onDayClick={handleDayClick} leftMonth={leftMonth} setLeftMonth={setLeftMonth} today={today} onBack={null} onCancel={() => { setOpen(false); setPicking(false); }} onApply={applyCustom} canApply={!!(draft.start && draft.end)} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: DR.trigBg, border: `1px solid ${DR.trigBorder}`, borderRadius: 6, padding: '6px 10px', color: DR.trigText, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
        📅 {triggerLabel}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={DR.trigMuted} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && !picking && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: DR.surface, border: `1px solid ${DR.surfaceBorder}`, borderRadius: 6, padding: 4, minWidth: 180, zIndex: 11, boxShadow: '0 10px 25px rgba(0,0,0,0.4)', fontFamily: 'inherit' }}>
          {DATE_PRESETS.map(p => <PresetItem key={p.v} selected={value === p.v} onClick={() => handlePreset(p.v)} label={p.label} />)}
          <div style={{ height: 1, background: DR.divider, margin: '4px 0' }} />
          <PresetItem selected={value === 'custom'} onClick={() => { setPicking(true); setDraft({ start: custom?.start ?? null, end: custom?.end ?? null }); }} label="Custom range…" trailing={value === 'custom' && custom?.start && custom?.end ? `${fmtShort(custom.start)} – ${fmtShort(custom.end)}` : null} />
        </div>
      )}
      {open && picking && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: DR.surface, border: `1px solid ${DR.surfaceBorder}`, borderRadius: 6, zIndex: 11, boxShadow: '0 10px 25px rgba(0,0,0,0.4)', width: 600 }}>
          <CalendarRange draft={draft} hoverDate={hoverDate} setHoverDate={setHoverDate} onDayClick={handleDayClick} leftMonth={leftMonth} setLeftMonth={setLeftMonth} today={today} onBack={() => setPicking(false)} onCancel={() => { setOpen(false); setPicking(false); }} onApply={applyCustom} canApply={!!(draft.start && draft.end)} />
        </div>
      )}
    </div>
  );
}

