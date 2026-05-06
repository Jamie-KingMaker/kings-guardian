// src/components/atoms/GuardLogo.jsx
export function GuardLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2 L27 7 V14 C27 21 22 26.5 16 30 C10 26.5 5 21 5 14 V7 Z"
        fill="#0F172A" stroke="#F59E0B" strokeWidth="1.2" />
      <path d="M11 12 L13.5 9.5 L16 12 L18.5 9.5 L21 12 L20.5 17 H11.5 Z" fill="#F59E0B" />
      <circle cx="11" cy="11.5" r="0.9" fill="#F59E0B" />
      <circle cx="16" cy="11.5" r="0.9" fill="#F59E0B" />
      <circle cx="21" cy="11.5" r="0.9" fill="#F59E0B" />
      <rect x="11.5" y="17.5" width="9" height="1.5" fill="#F59E0B" />
      <path d="M14 20 H18 V25 L16 26.5 L14 25 Z" fill="#F59E0B" opacity="0.9" />
    </svg>
  );
}

