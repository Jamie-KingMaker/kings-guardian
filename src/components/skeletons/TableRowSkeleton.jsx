// src/components/skeletons/TableRowSkeleton.jsx
import { Shimmer } from './Shimmer.jsx';

export function TableRowSkeleton({ cols = 9 }) {
  return (
    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '13px 12px' }}>
          <Shimmer width={i === 0 ? '80%' : i === 3 ? '60%' : '50%'} height={10} />
        </td>
      ))}
    </tr>
  );
}

