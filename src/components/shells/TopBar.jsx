// src/components/shells/TopBar.jsx
import { Icon }     from '@/components/atoms/index.js';
import { BRAND_THEME } from '@/config/brands.js';
import { COUNTRY_NAMES } from '@/config/constants.js';
import t from '@/config/i18n.js';
import { Dropdown } from './Dropdown.jsx';

export function TopBar({ brand, setBrand, country, setCountry, lastRefresh }) {
  const theme   = BRAND_THEME[brand] ?? BRAND_THEME.all;
  const isBrand = brand === 'betking' || brand === 'supersportbet';

  return (
    <div style={{ height: 64, background: theme.topbar, borderBottom: `1px solid ${theme.topbarBorder}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16, color: '#E2E8F0', flexShrink: 0, transition: 'background 200ms ease, border-color 200ms ease' }}>
      {/* Logo */}
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
            <svg width={26} height={26} viewBox="0 0 32 32" fill="none">
              <path d="M16 2 L27 7 V14 C27 21 22 26.5 16 30 C10 26.5 5 21 5 14 V7 Z" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.2" />
              <path d="M11 12 L13.5 9.5 L16 12 L18.5 9.5 L21 12 L20.5 17 H11.5 Z" fill="#F59E0B" />
              <rect x="11.5" y="17.5" width="9" height="1.5" fill="#F59E0B" />
              <path d="M14 20 H18 V25 L16 26.5 L14 25 Z" fill="#F59E0B" opacity="0.9" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '0.01em' }}>King's Guard</span>
              <span style={{ fontSize: 12, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>RG Intelligence</span>
            </div>
          </>
        )}
      </div>

      {/* Brand switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 6 }}>
        {['betking', 'supersportbet'].map(b => {
          const bt     = BRAND_THEME[b];
          const active = brand === b;
          return (
            <button key={b} onClick={() => setBrand(b)} style={{ padding: '5px 10px', borderRadius: 4, border: 'none', background: active ? 'rgba(255,255,255,0.14)' : 'transparent', color: active ? '#FFFFFF' : 'rgba(255,255,255,0.62)', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', boxShadow: active ? `inset 0 -2px 0 ${bt.accent}` : 'none' }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: bt.accent }} />
              {bt.name}
            </button>
          );
        })}
      </div>

      {/* Country */}
      <Dropdown
        value={country}
        options={[
          { v: 'ALL', label: t.topbar.allMarkets },
          ...(brand === 'betking'
            ? [{ v: 'NG', label: COUNTRY_NAMES.NG }]
            : [{ v: 'ZA', label: COUNTRY_NAMES.ZA }, { v: 'ZM', label: COUNTRY_NAMES.ZM }]
          ),
        ]}
        onChange={setCountry}
      />

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(148,163,184,0.08)', borderRadius: 6, padding: '6px 10px', width: 280, border: '1px solid rgba(148,163,184,0.12)' }}>
        <Icon name="search" size={14} color="#94A3B8" />
        <input placeholder={t.topbar.search} style={{ background: 'transparent', border: 'none', outline: 'none', color: '#E2E8F0', fontSize: 15, flex: 1, fontFamily: 'inherit' }} />
        <kbd style={{ fontSize: 12, color: '#64748B', padding: '1px 5px', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 3 }}>⌘K</kbd>
      </div>

      {/* Sync status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'rgba(22, 163, 74, 0.08)', borderRadius: 6, border: '1px solid rgba(22, 163, 74, 0.18)' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A', boxShadow: '0 0 0 3px rgba(22,163,74,0.18)' }} />
        <span style={{ fontSize: 13, color: '#86EFAC', fontWeight: 500 }}>{t.topbar.synced} {lastRefresh}</span>
      </div>

      <button style={{ background: 'transparent', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: 6, display: 'flex' }}><Icon name="bell" size={16} /></button>
      <button style={{ background: 'transparent', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: 6, display: 'flex' }}><Icon name="help" size={16} /></button>
      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #475569, #1E293B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#E2E8F0', border: '1px solid rgba(148,163,184,0.24)' }}>OA</div>
    </div>
  );
}

