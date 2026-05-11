import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const TOPICS = [
  { name: 'Data Wrangling (dropna, fillna, merge)', pct: 95, tier: 'red', freq: '4/4 papers' },
  { name: 'Pandas DataFrame (CRUD operations)', pct: 90, tier: 'red', freq: '4/4 papers' },
  { name: 'Matplotlib / Seaborn (plotting)', pct: 88, tier: 'red', freq: '4/4 papers' },
  { name: 'GroupBy + Aggregation', pct: 85, tier: 'red', freq: '4/4 papers' },
  { name: 'Scikit-learn (train/test split, models)', pct: 82, tier: 'red', freq: '4/4 papers' },
  { name: 'NumPy Operations (array math)', pct: 78, tier: 'yellow', freq: '3/4 papers' },
  { name: 'Data Preprocessing (scaling, encoding)', pct: 75, tier: 'yellow', freq: '3/4 papers' },
  { name: 'Linear / Logistic Regression', pct: 72, tier: 'yellow', freq: '3/4 papers' },
  { name: 'Decision Tree / Random Forest', pct: 68, tier: 'yellow', freq: '3/4 papers' },
  { name: 'K-Means Clustering', pct: 62, tier: 'yellow', freq: '2/4 papers' },
  { name: 'Confusion Matrix + Metrics', pct: 58, tier: 'blue', freq: '2/4 papers' },
  { name: 'Time Series Basics', pct: 45, tier: 'blue', freq: '2/4 papers' },
  { name: 'PCA / Dimensionality Reduction', pct: 38, tier: 'blue', freq: '1/4 papers' },
  { name: 'NLP Basics (tokenize, TF-IDF)', pct: 32, tier: 'dark', freq: '1/4 papers' },
  { name: 'Deep Learning Intro (Sequential)', pct: 25, tier: 'dark', freq: '1/4 papers' },
];

const TIER_COLORS: Record<string, { bg: string; label: string; dot: string }> = {
  red: { bg: '#ef4444', label: 'Exam Critical', dot: '#ef4444' },
  yellow: { bg: '#f59e0b', label: 'High Probability', dot: '#f59e0b' },
  blue: { bg: '#3b82f6', label: 'Moderate', dot: '#3b82f6' },
  dark: { bg: 'rgba(255,255,255,0.5)', label: 'Low Probability', dot: 'rgba(255,255,255,0.5)' },
};

export function Heatmap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {Object.entries(TIER_COLORS).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: val.dot }} />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>{val.label}</span>
          </div>
        ))}
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {TOPICS.map((topic, i) => {
          const tier = TIER_COLORS[topic.tier];
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '220px', flexShrink: 0 }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: 400, lineHeight: 1.3 }}>
                  {topic.name}
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  height: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '100px',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  style={{ height: '100%', borderRadius: '100px', background: tier.bg }}
                  initial={{ width: '0%' }}
                  animate={inView ? { width: `${topic.pct}%` } : { width: '0%' }}
                  transition={{ duration: 0.8, delay: 0.06 * i, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', width: '70px', flexShrink: 0, textAlign: 'right' }}>
                {topic.freq}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
