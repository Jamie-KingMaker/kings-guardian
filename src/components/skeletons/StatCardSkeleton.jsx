// src/components/skeletons/StatCardSkeleton.jsx
import { Shimmer } from './Shimmer.jsx';

export function StatCardSkeleton() {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 16, borderLeft: '3px solid #E2E8F0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Shimmer width={6} height={6} style={{ borderRadius: '50%' }} />
        <Shimmer width="50%" height={9} />
      </div>
      <Shimmer width="55%" height={32} style={{ marginBottom: 8, borderRadius: 6 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Shimmer width="40%" height={9} />
        <Shimmer width="20%" height={9} />
      </div>
    </div>
  );
}

