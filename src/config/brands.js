// src/config/brands.js
// Frontend brand configuration — colors, logos, accent tokens.
// These are kept on the FE as they drive visual theming, not business data.

export const BRAND_ACCENTS = {
  betking:      { name: 'BetKing',      primary: '#001041', accent: '#FFC400', country: ['NG'] },
  supersportbet:{ name: 'SuperSportBet',primary: '#040B67', accent: '#F1C72F', country: ['ZA', 'ZM'] },
};

export const BRAND_THEME = {
  betking: {
    name: 'BetKing',
    topbar: '#001041',
    topbarBorder: 'rgba(255, 196, 0, 0.18)',
    sidebar: '#000B2D',
    accent: '#FFC400',
    accentText: '#FFC400',
    accentBg: 'rgba(255, 196, 0, 0.12)',
    accentBgSoft: 'rgba(255, 196, 0, 0.08)',
    accentBorder: 'rgba(255, 196, 0, 0.22)',
    logoSrc: '/logo-betking.svg',
    logoWidth: 88,
  },
  supersportbet: {
    name: 'SuperSportBet',
    topbar: '#040B67',
    topbarBorder: 'rgba(241, 199, 47, 0.20)',
    sidebar: '#03084F',
    accent: '#F1C72F',
    accentText: '#F1C72F',
    accentBg: 'rgba(241, 199, 47, 0.12)',
    accentBgSoft: 'rgba(241, 199, 47, 0.08)',
    accentBorder: 'rgba(241, 199, 47, 0.22)',
    logoSrc: '/logo-supersportbet.svg',
    logoWidth: 132,
  },
  all: {
    name: "King's Guard",
    topbar: '#0F172A',
    topbarBorder: 'rgba(148, 163, 184, 0.12)',
    sidebar: '#0B1220',
    accent: '#F59E0B',
    accentText: '#FBBF24',
    accentBg: 'rgba(245, 158, 11, 0.10)',
    accentBgSoft: 'rgba(245, 158, 11, 0.06)',
    accentBorder: 'rgba(245, 158, 11, 0.20)',
    logoSrc: null,
    logoWidth: null,
  },
};

export function getBrandTheme(brand) {
  return BRAND_THEME[brand] ?? BRAND_THEME.all;
}

