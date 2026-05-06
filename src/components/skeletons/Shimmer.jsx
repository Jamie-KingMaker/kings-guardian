// src/components/skeletons/Shimmer.jsx
// Reusable shimmer animation used by all skeletons.

const shimmerStyle = {
  background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)',
  backgroundSize: '200% 100%',
  animation: 'kg-shimmer 1.4s linear infinite',
  borderRadius: 4,
};

export function Shimmer({ width = '100%', height = 12, style = {} }) {
  return (
    <>
      <style>{`@keyframes kg-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div style={{ ...shimmerStyle, width, height, ...style }} />
    </>
  );
}

