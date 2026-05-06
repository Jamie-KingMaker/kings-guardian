// src/components/shells/Dropdown.jsx
import { useState } from 'react';
import { Icon } from '@/components/atoms/index.js';

export function Dropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.v === value) ?? options[0];

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.12)',
        borderRadius: 6, padding: '6px 10px',
        color: '#E2E8F0', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
      }}>
        {current.label}
        <Icon name="down" size={12} color="#94A3B8" />
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
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
              >{o.label}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

