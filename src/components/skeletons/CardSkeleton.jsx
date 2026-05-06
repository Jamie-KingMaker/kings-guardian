// src/components/skeletons/CardSkeleton.jsx
import { Shimmer } from './Shimmer.jsx';

/** Generic card-shaped skeleton with configurable height */
export function CardSkeleton({ height = 200 }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 18, height }}>
      <Shimmer width="40%" height={10} style={{ marginBottom: 10 }} />
      <Shimmer width="70%" height={14} style={{ marginBottom: 20 }} />
      <Shimmer width="100%" height={height - 90} style={{ borderRadius: 6 }} />
    </div>
  );
}

