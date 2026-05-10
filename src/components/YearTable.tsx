import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const ROWS = [
  { topic: 'Data Wrangling', may25: true, jul25: true, dec25: true, dec23: true },
  { topic: 'Pandas DataFrame', may25: true, jul25: true, dec25: true, dec23: true },
  { topic: 'Matplotlib/Seaborn', may25: true, jul25: true, dec25: true, dec23: true },
  { topic: 'GroupBy + Aggregation', may25: true, jul25: true, dec25: true, dec23: true },
  { topic: 'Scikit-learn Models', may25: true, jul25: true, dec25: true, dec23: true },
  { topic: 'NumPy Operations', may25: true, jul25: false, dec25: true, dec23: true },
  { topic: 'Data Preprocessing', may25: true, jul25: true, dec25: true, dec23: false },
  { topic: 'Regression (Lin/Log)', may25: true, jul25: true, dec25: false, dec23: true },
  { topic: 'Decision Tree/RF', may25: false, jul25: true, dec25: true, dec23: true },
  { topic: 'K-Means Clustering', may25: true, jul25: false, dec25: true, dec23: false },
  { topic: 'Confusion Matrix', may25: true, jul25: true, dec25: false, dec23: false },
  { topic: 'Time Series', may25: false, jul25: true, dec25: true, dec23: false },
];

const HEADERS = ['Topic', 'May 25', 'Jul 25', 'Dec 25', 'Dec 23'];

export function YearTable() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ overflowX: 'auto' }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            {HEADERS.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: '10px 14px',
                  textAlign: i === 0 ? 'left' : 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: '#6b7280',
                  borderBottom: '1px solid #e5e7eb',
                  background: '#f9fafb',
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => {
            const count = [row.may25, row.jul25, row.dec25, row.dec23].filter(Boolean).length;
            return (
              <tr
                key={i}
                style={{
                  background: i % 2 === 0 ? '#ffffff' : '#f9fafb',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#eff6ff')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? '#ffffff' : '#f9fafb')}
              >
                <td style={{ padding: '10px 14px', color: '#1d1d1f', fontWeight: 500, borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {row.topic}
                    {count === 4 && (
                      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', color: '#dc2626', background: '#fee2e2', padding: '1px 6px', borderRadius: '100px', textTransform: 'uppercase' }}>
                        Must Know
                      </span>
                    )}
                  </div>
                </td>
                {[row.may25, row.jul25, row.dec25, row.dec23].map((v, j) => (
                  <td key={j} style={{ padding: '10px 14px', textAlign: 'center', borderBottom: '1px solid #f3f4f6' }}>
                    {v ? (
                      <span style={{ color: '#10b981', fontSize: '16px', fontWeight: 700 }}>✓</span>
                    ) : (
                      <span style={{ color: '#d1d5db', fontSize: '14px' }}>—</span>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
}
