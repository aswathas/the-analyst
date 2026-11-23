import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export interface DonutUnit {
  unit: number;
  label: string;
  pct: number;
  color: string;
}

const R = 58;
const CX = 70;
const CY = 70;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function UnitDonutGeneric({ units, total = 75 }: { units: DonutUnit[]; total?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  let offset = 0;
  const segments = units.map(u => {
    const dash = (u.pct / 100) * CIRCUMFERENCE;
    const gap = CIRCUMFERENCE - dash;
    const seg = { dash, gap, offset, ...u };
    offset += dash;
    return seg;
  });

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="14" />
          {segments.map((seg, i) => (
            <motion.circle
              key={seg.unit}
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
              animate={inView ? { strokeDasharray: `${seg.dash} ${seg.gap}` } : { strokeDasharray: `0 ${CIRCUMFERENCE}` }}
              transition={{ duration: 0.9, delay: 0.15 * i + 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary, #1d1d1f)', letterSpacing: '-0.03em' }}>{total}</span>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary, #6e6e73)', fontWeight: 400, letterSpacing: '0.05em', textTransform: 'uppercase' }}>marks</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {units.map((u, i) => (
          <motion.div
            key={u.unit}
            initial={{ opacity: 0, x: 12 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: u.color, flexShrink: 0 }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary, #1d1d1f)' }}>{u.label}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: u.color }}>{u.pct}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
