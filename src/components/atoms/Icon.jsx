// src/components/atoms/Icon.jsx
export function Icon({ name, size = 16, color = 'currentColor' }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home':        return <svg {...p}><path d="M3 11 12 3 21 11"/><path d="M5 10v10h14V10"/></svg>;
    case 'players':     return <svg {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/><circle cx="17" cy="8" r="2.5"/><path d="M22 19c0-2.6-1.7-4.5-4-5.2"/></svg>;
    case 'list':        return <svg {...p}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case 'chart':       return <svg {...p}><path d="M3 21V5"/><path d="M21 21H3"/><path d="M7 17v-4M11 17V9M15 17v-7M19 17v-3"/></svg>;
    case 'shield':      return <svg {...p}><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9.5 4.5-1 8-4.5 8-9.5V6Z"/></svg>;
    case 'log':         return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'export':      return <svg {...p}><path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 21h14"/></svg>;
    case 'search':      return <svg {...p}><circle cx="11" cy="11" r="6"/><path d="m20 20-3.5-3.5"/></svg>;
    case 'bell':        return <svg {...p}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15Z"/><path d="M10 21h4"/></svg>;
    case 'help':        return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 1-1 1.7v.5"/><circle cx="12" cy="17" r="0.6" fill={color} stroke="none"/></svg>;
    case 'down':        return <svg {...p}><path d="m6 9 6 6 6-6"/></svg>;
    case 'up':          return <svg {...p}><path d="m6 15 6-6 6 6"/></svg>;
    case 'arrow-right': return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'flag':        return <svg {...p}><path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/></svg>;
    case 'note':        return <svg {...p}><path d="M5 4h11l4 4v12H5z"/><path d="M9 10h7M9 14h7M9 18h4"/></svg>;
    case 'refresh':     return <svg {...p}><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/></svg>;
    case 'filter':      return <svg {...p}><path d="M3 5h18l-7 8v6l-4-2v-4Z"/></svg>;
    case 'settings':    return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>;
    case 'sort':        return <svg {...p}><path d="M7 4v16M3 8l4-4 4 4"/><path d="M17 20V4M13 16l4 4 4-4"/></svg>;
    case 'trending':    return <svg {...p}><path d="M3 17 9 11l4 4 8-8"/><path d="M14 7h7v7"/></svg>;
    default:            return null;
  }
}

