import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { CheckCircle, AlertTriangle, Target } from 'lucide-react';

const PARTS = [
  {
    part: 'Part A',
    marks: '20 × 1 = 20',
    desc: 'Multiple Choice Questions — all compulsory',
    bg: '#0066cc',
    items: [
      { icon: 'check', text: 'Data types: ndarray vs DataFrame (appears every paper)' },
      { icon: 'check', text: 'dropna() axis parameter (axis=0 is rows, axis=1 is columns)' },
      { icon: 'check', text: 'train_test_split default test_size=0.25' },
      { icon: 'check', text: 'plt.show() vs plt.savefig() distinction' },
      { icon: 'check', text: 'GroupBy .agg() vs .apply() usage' },
      { icon: 'check', text: 'sklearn import paths (exact module names)' },
      { icon: 'warn', text: 'TRAP: confusion matrix — precision is TP/(TP+FP), not accuracy' },
      { icon: 'warn', text: 'TRAP: merge vs join — merge is function, join is method' },
      { icon: 'warn', text: 'TRAP: StandardScaler fit_transform on train only' },
      { icon: 'warn', text: 'TRAP: random_state vs random_seed (sklearn uses random_state)' },
      { icon: 'warn', text: 'TRAP: K-Means needs n_clusters, not k= parameter' },
    ],
  },
  {
    part: 'Part B',
    marks: '4 × 10 = 40',
    desc: 'Answer 4 out of 6 questions — strategic choice',
    bg: '#7c3aed',
    items: [
      { icon: 'target', text: 'Q17/18: DataFrame creation + indexing (safe pick — always appears)' },
      { icon: 'target', text: 'Q19/20: Data cleaning pipeline (dropna + fillna + rename)' },
      { icon: 'target', text: 'Q21/22: Matplotlib visualization (bar/line/scatter with labels)' },
      { icon: 'target', text: 'Q23/24: GroupBy aggregation + pivot_table' },
      { icon: 'target', text: 'Q25/26: train_test_split + model fit + predict + score' },
      { icon: 'warn', text: 'SKIP: Deep learning (Q27+ variants) — limited time ROI' },
      { icon: 'warn', text: 'Each answer needs: concept explanation + code + output format' },
      { icon: 'check', text: 'Guaranteed combo: Pick wrangling + viz + one ML = 30 marks easy' },
    ],
  },
  {
    part: 'Part C',
    marks: '1 × 15 = 15',
    desc: 'Compulsory OR question — one choice',
    bg: '#dc2626',
    items: [
      { icon: 'target', text: 'Q27: Data Wrangling pipeline — 3/3 current papers (100% hit rate)' },
      { icon: 'target', text: 'Pattern: read CSV → clean → transform → groupby → visualize' },
      { icon: 'check', text: 'May25: merge + groupby + seaborn heatmap' },
      { icon: 'check', text: 'Jul25: dropna + fillna + value_counts + bar plot' },
      { icon: 'check', text: 'Dec25: pivot_table + concat + matplotlib subplots' },
      { icon: 'warn', text: 'Alternate (Q28): Usually ML pipeline — fit, predict, confusion matrix' },
      { icon: 'warn', text: 'Both options seen in Dec23: safe to prepare Q27 style answer' },
      { icon: 'target', text: 'Template: 5-step pipeline answers score full marks consistently' },
    ],
  },
];

const ICON_MAP = {
  check: <CheckCircle size={14} strokeWidth={1.5} style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }} />,
  warn: <AlertTriangle size={14} strokeWidth={1.5} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '1px' }} />,
  target: <Target size={14} strokeWidth={1.5} style={{ color: '#60a5fa', flexShrink: 0, marginTop: '1px' }} />,
};

export function PartBreakdown() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
      }}
    >
      {PARTS.map((part, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: '#1c1c1e',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '18px 20px 14px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: `linear-gradient(135deg, ${part.bg}22 0%, transparent 100%)`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: part.bg,
                }}
              >
                {part.part}
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#ffffff',
                  background: `${part.bg}33`,
                  padding: '2px 8px',
                  borderRadius: '100px',
                  border: `1px solid ${part.bg}55`,
                }}
              >
                {part.marks}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '6px 0 0', fontWeight: 400 }}>
              {part.desc}
            </p>
          </div>

          {/* Items */}
          <div style={{ padding: '14px 20px 18px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {part.items.map((item, j) => (
              <div key={j} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                {ICON_MAP[item.icon as keyof typeof ICON_MAP]}
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.45 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
