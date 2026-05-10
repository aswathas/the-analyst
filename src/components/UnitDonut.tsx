import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const UNITS = [
  { label: 'Unit 1', sublabel: 'Foundations', pct: 35, color: '#0066cc', topics: 'NumPy, Pandas basics, data types' },
  { label: 'Unit 2', sublabel: 'Data Ops', pct: 35, color: '#f59e0b', topics: 'Wrangling, viz, GroupBy, merge' },
  { label: 'Unit 3', sublabel: 'ML', pct: 30, color: '#10b981', topics: 'Sklearn, models, clustering, metrics' },
];

const R = 58;
const CX = 70;
const CY = 70;
const CIRCUMFERENCE = 2 * Math.PI * R;

function getSegments(units: typeof UNITS) {
  let offset = 0;
  return units.map(u => {
    const dash = (u.pct / 100) * CIRCUMFERENCE;
    const gap = CIRCUMFERENCE - dash;
    const result = { dash, gap, offset, ...u };
    offset += dash;
    return result;
  });
}

export function UnitDonut() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const segments = getSegments(UNITS);

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '40px',
        flexWrap: 'wrap',
      }}
    >
      {/* SVG Donut */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e5e7eb" strokeWidth="14" />
          {/* Segments */}
          {segments.map((seg, i) => (
            <motion.circle
              key={i}
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeDasharray={`${seg.dash} ${seg.gap}`}
              strokeDashoffset={-seg.offset}
              strokeLinecap="butt"
              initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
              animate={
                inView
                  ? { strokeDasharray: `${seg.dash} ${seg.gap}` }
                  : { strokeDasharray: `0 ${CIRCUMFERENCE}` }
              }
              transition={{ duration: 0.9, delay: 0.15 * i + 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </svg>
        {/* Center label */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.03em' }}>75</span>
          <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>marks</span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {UNITS.map((u, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 12 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '3px',
                background: u.color,
                marginTop: '3px',
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f' }}>{u.label}</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>{u.sublabel}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: u.color }}>{u.pct}%</span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#9ca3af', marginTop: '2px' }}>{u.topics}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
