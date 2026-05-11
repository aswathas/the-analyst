import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const MCQ_TOPICS = [
  { unit: 1, topic: 'NumPy ndarray vs Python list', prob: 95, tip: 'ndarray = homogeneous, fixed-type. List = heterogeneous.', trap: null },
  { unit: 1, topic: 'Pandas Series vs DataFrame', prob: 95, tip: 'Series = 1D labelled array. DataFrame = 2D table.', trap: 'Series has no columns, only index + values.' },
  { unit: 1, topic: 'NumPy: eye(), zeros(), ones(), reshape()', prob: 85, tip: 'eye(n) = identity matrix. reshape(-1, col) = auto-compute rows.', trap: "eye() ≠ identity() — identity() is strict float64." },
  { unit: 1, topic: 'Data Science Process steps', prob: 80, tip: 'Collect → Clean → Explore → Model → Evaluate → Deploy.', trap: null },
  { unit: 1, topic: 'DataFrame indexing: loc vs iloc', prob: 90, tip: 'loc = label-based. iloc = integer position-based.', trap: 'loc is INCLUSIVE on both ends. iloc is exclusive of stop.' },
  { unit: 1, topic: 'Web API / data acquisition', prob: 70, tip: 'requests.get(url).json() → into DataFrame.', trap: null },
  { unit: 2, topic: 'dropna() axis parameter', prob: 98, tip: 'axis=0 drops ROWS (default). axis=1 drops COLUMNS.', trap: 'axis=0 = rows. axis=1 = columns. Most MCQs test this swap.' },
  { unit: 2, topic: 'fillna() methods: mean, ffill, bfill', prob: 90, tip: 'ffill = forward fill. bfill = backward fill.', trap: null },
  { unit: 2, topic: 'merge() vs concat() vs join()', prob: 92, tip: 'merge() = SQL join on key. concat() = stack. join() = index-based.', trap: 'merge is a FUNCTION. join is a METHOD on df.' },
  { unit: 2, topic: 'groupby() + agg() vs apply()', prob: 88, tip: 'agg() = fast, named functions. apply() = flexible lambda.', trap: 'agg takes string names like "mean". apply takes a function.' },
  { unit: 2, topic: 'Binning: cut() vs qcut()', prob: 75, tip: 'cut() = equal-width bins. qcut() = equal-frequency bins.', trap: null },
  { unit: 2, topic: 'StandardScaler: fit vs fit_transform', prob: 88, tip: 'fit() learns mean/std. ONLY fit on train data.', trap: 'NEVER fit on test data. fit_transform on train, transform only on test.' },
  { unit: 2, topic: 'Outlier detection: IQR method', prob: 80, tip: 'IQR = Q3 - Q1. Lower = Q1 - 1.5×IQR. Upper = Q3 + 1.5×IQR.', trap: null },
  { unit: 3, topic: 'plt.show() vs plt.savefig()', prob: 88, tip: 'savefig() MUST come before show(). show() clears the figure.', trap: 'savefig() after show() → saves blank image.' },
  { unit: 3, topic: 'plt.subplot() vs plt.subplots()', prob: 82, tip: 'subplot(rows,cols,index) — 1-based. subplots() returns fig,axes.', trap: 'subplot() index starts at 1, not 0.' },
  { unit: 3, topic: 'Seaborn plot types', prob: 85, tip: 'sns.heatmap(corr). sns.boxplot(). sns.pairplot(). sns.histplot().', trap: null },
  { unit: 3, topic: 'train_test_split signature', prob: 90, tip: 'train_test_split(X,y,test_size=0.2,random_state=42).', trap: 'Default test_size is 0.25, not 0.2.' },
  { unit: 3, topic: 'Confusion matrix: precision vs accuracy', prob: 92, tip: 'Accuracy=(TP+TN)/all. Precision=TP/(TP+FP). Recall=TP/(TP+FN).', trap: 'Precision = TP/(TP+FP). NOT TP/(TP+TN). Classic trap.' },
  { unit: 3, topic: 'K-Means: n_clusters parameter', prob: 85, tip: "KMeans(n_clusters=3,random_state=42). NOT k=.", trap: 'Parameter is n_clusters, not k.' },
];

const PART_B_QUESTIONS = [
  {
    qNum: 'Q19/20', topic: 'Pandas DataFrame + Data Cleaning', unit: 1, prob: 96,
    appeared: ['May25', 'Jul25', 'Dec25', 'Dec23'], type: 'must',
    desc: 'Read CSV → stats → handle missing → sort. ALL 4 papers.',
    key: "pd.read_csv() → df.describe() → df.dropna()/fillna() → df.sort_values()",
  },
  {
    qNum: 'Q21/22', topic: 'Matplotlib Visualization', unit: 3, prob: 94,
    appeared: ['May25', 'Jul25', 'Dec25', 'Dec23'], type: 'must',
    desc: 'Bar/line/scatter chart with title, labels, legend. ALL 4 papers.',
    key: "plt.figure() → plt.bar() → plt.xlabel/ylabel/title/legend() → plt.show()",
  },
  {
    qNum: 'Q23/24', topic: 'GroupBy + Aggregation + Pivot', unit: 2, prob: 92,
    appeared: ['May25', 'Jul25', 'Dec25', 'Dec23'], type: 'must',
    desc: 'GroupBy column → mean/min/max. Pivot table. ALL 4 papers.',
    key: "df.groupby('col').agg({'val':['mean','min','max']}) or pd.pivot_table()",
  },
  {
    qNum: 'Q17/18', topic: 'NumPy Array Programs', unit: 1, prob: 88,
    appeared: ['May25', 'Jul25', 'Dec25'], type: 'safe',
    desc: 'Create 2D array → sort by columns → reshape.',
    key: "np.array() → np.sort() → arr.reshape() → arr.T",
  },
  {
    qNum: 'Q25/26', topic: 'Merge + Concat + Pipeline', unit: 2, prob: 85,
    appeared: ['May25', 'Jul25', 'Dec25'], type: 'safe',
    desc: 'Merge two datasets on key. Reshape with pivot/melt/stack.',
    key: "pd.merge(df1,df2,on='key',how='inner') + pd.concat([df1,df2],axis=0)",
  },
  {
    qNum: 'Q27/28 (B variant)', topic: 'Seaborn + Advanced Viz', unit: 3, prob: 70,
    appeared: ['Jul25', 'Dec25'], type: 'risky',
    desc: 'Seaborn boxplot, pairplot, histplot with KDE.',
    key: "sns.boxplot(x='col',y='val',data=df) → plt.show()",
  },
];

const PART_C = [
  {
    rank: 1, label: 'Highly Probable', color: '#ef4444',
    scenario: 'dropna + fillna + value_counts + GroupBy + bar chart',
    evidence: 'Jul25 Q27 exactly. Core pattern in all papers.',
    code: `df = pd.read_csv('data.csv')
print(df.isnull().sum())
df = df.dropna(subset=['important_col'])
df['age'].fillna(df['age'].mean(), inplace=True)
print(df['category'].value_counts())
result = df.groupby('region')['sales'].agg(['sum','mean'])
result['sum'].plot(kind='bar', title='Sales by Region')
plt.xlabel('Region'); plt.ylabel('Sales'); plt.show()`,
  },
  {
    rank: 2, label: 'Very Likely', color: '#f59e0b',
    scenario: 'merge + groupby + seaborn heatmap',
    evidence: 'May25 Q27 exactly.',
    code: `df1 = pd.read_csv('orders.csv')
df2 = pd.read_csv('customers.csv')
merged = pd.merge(df1, df2, on='customer_id', how='inner')
pivot = merged.groupby(['region','product'])['amount'].sum().unstack()
sns.heatmap(pivot, annot=True, fmt='.0f', cmap='Blues')
plt.title('Sales Heatmap')
plt.show()`,
  },
  {
    rank: 3, label: 'Possible', color: '#3b82f6',
    scenario: 'pivot_table + concat + matplotlib subplots',
    evidence: 'Dec25 Q27 pattern.',
    code: `combined = pd.concat([df1, df2], ignore_index=True)
table = pd.pivot_table(combined, values='sales',
    index='month', columns='product', aggfunc='sum')
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12,5))
table.plot(kind='bar', ax=ax1)
combined.groupby('product')['sales'].sum().plot(
    kind='pie', ax=ax2, autopct='%1.1f%%')
plt.tight_layout(); plt.show()`,
  },
];

const TYPE_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  must:  { bg: 'rgba(220,38,38,0.12)',  color: '#f87171', label: 'MUST DO' },
  safe:  { bg: 'rgba(5,150,105,0.12)',  color: '#34d399', label: 'SAFE PICK' },
  risky: { bg: 'rgba(217,119,6,0.12)',  color: '#fbbf24', label: 'RISKY' },
};

const PROB_COLOR = (p: number) =>
  p >= 90 ? '#ef4444' : p >= 80 ? '#f59e0b' : p >= 70 ? '#3b82f6' : '#6b7280';

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: '16px',
      padding: '20px',
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{
      fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: '#2997ff', marginBottom: '12px',
    }}>
      {text}
    </div>
  );
}

export function DSAnalysisMobile({ onBack }: Props) {
  const [activeUnit, setActiveUnit] = useState<1 | 2 | 3 | 'all'>('all');
  const [expandedMCQ, setExpandedMCQ] = useState<number | null>(null);
  const [expandedB, setExpandedB] = useState<number | null>(null);
  const [expandedC, setExpandedC] = useState<number | null>(null);

  const filteredMCQ = activeUnit === 'all' ? MCQ_TOPICS : MCQ_TOPICS.filter(t => t.unit === activeUnit);

  return (
    <div style={{
      minHeight: '100svh',
      background: 'transparent',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',
      overflowX: 'hidden',
    }}>

      {/* Sticky top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#ffffff', cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
        </button>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Data Science
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}>
            21CSS303T · PYQ Analysis
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '28px 20px', paddingBottom: 'calc(40px + env(safe-area-inset-bottom))' }}>

        {/* Hero stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '32px' }}
        >
          <div style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.04em', marginBottom: '6px' }}>
            4 Papers. 15 Topics.
          </div>
          <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, marginBottom: '20px' }}>
            Every pattern decoded. Safe combo: Wrangling + Viz + 1 ML = 65/75
          </div>

          {/* 4 quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { n: '4', label: 'Papers Analyzed' },
              { n: '15', label: 'Topics Mapped' },
              { n: '75', label: 'Total Marks' },
              { n: '100%', label: 'Q27 Hit Rate' },
            ].map(({ n, label }) => (
              <Card key={label} style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '26px', fontWeight: 600, color: '#2997ff', letterSpacing: '-0.04em' }}>{n}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>{label}</div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Critical findings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '32px' }}
        >
          <SectionLabel text="Key Findings" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { text: 'Q27 = Data Wrangling in ALL 3 recent papers (100% hit)', color: '#ef4444' },
              { text: 'Pandas + Matplotlib appear in every single paper', color: '#f59e0b' },
              { text: 'Wrangling + Viz + 1 ML = safe 65/75 strategy', color: '#34d399' },
            ].map(({ text, color }) => (
              <div key={text} style={{
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px', padding: '14px',
              }}>
                <div style={{ width: '3px', flexShrink: 0, borderRadius: '2px', background: color, alignSelf: 'stretch' }} />
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Part C — most critical */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '32px' }}
        >
          <SectionLabel text="Part C — Q27 (15 Marks)" />
          <div style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            The 15-mark prediction
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PART_C.map((item, i) => (
              <Card key={i} style={{ padding: 0, overflow: 'hidden' }}>
                {/* Header — always visible, tappable */}
                <button
                  onClick={() => setExpandedC(expandedC === i ? null : i)}
                  style={{
                    width: '100%', background: 'none', border: 'none',
                    padding: '18px 20px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left',
                  }}
                >
                  {/* Rank badge */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: `${item.color}18`,
                    border: `1.5px solid ${item.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '14px', fontWeight: 700, color: item.color,
                  }}>
                    #{item.rank}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', color: item.color, fontWeight: 600, marginBottom: '2px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 500, lineHeight: 1.35 }}>
                      {item.scenario}
                    </div>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                    {expandedC === i ? <ChevronUp size={16} strokeWidth={1.5} /> : <ChevronDown size={16} strokeWidth={1.5} />}
                  </div>
                </button>

                {/* Expanded code */}
                <AnimatePresence initial={false}>
                  {expandedC === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 20px 18px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', paddingTop: '14px', marginBottom: '10px' }}>
                          {item.evidence}
                        </div>
                        <pre style={{
                          margin: 0, padding: '14px',
                          background: 'rgba(0,0,0,0.4)',
                          borderRadius: '10px',
                          fontSize: '11px', lineHeight: 1.65,
                          color: 'rgba(255,255,255,0.75)',
                          fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
                          overflowX: 'auto',
                          whiteSpace: 'pre',
                        }}>
                          {item.code}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Part B */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '32px' }}
        >
          <SectionLabel text="Part B — 4 of 6 (10 Marks each)" />
          <div style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Pick 4. Here's what to pick.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PART_B_QUESTIONS.map((q, i) => {
              const badge = TYPE_STYLE[q.type];
              return (
                <Card key={i} style={{ padding: 0, overflow: 'hidden' }}>
                  <button
                    onClick={() => setExpandedB(expandedB === i ? null : i)}
                    style={{
                      width: '100%', background: 'none', border: 'none',
                      padding: '16px 18px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em',
                          padding: '2px 8px', borderRadius: '100px',
                          background: badge.bg, color: badge.color,
                        }}>
                          {badge.label}
                        </span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono',monospace" }}>
                          {q.qNum}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff', lineHeight: 1.3 }}>
                        {q.topic}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '13px', fontWeight: 700, color: PROB_COLOR(q.prob),
                      flexShrink: 0,
                    }}>
                      {q.prob}%
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                      {expandedB === i ? <ChevronUp size={14} strokeWidth={1.5} /> : <ChevronDown size={14} strokeWidth={1.5} />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {expandedB === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 18px 16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, margin: '12px 0 10px' }}>
                            {q.desc}
                          </p>
                          <div style={{
                            padding: '10px 12px',
                            background: 'rgba(0,0,0,0.35)',
                            borderRadius: '10px',
                            fontFamily: "'JetBrains Mono','SF Mono',monospace",
                            fontSize: '11px', color: 'rgba(255,255,255,0.7)',
                            lineHeight: 1.6, overflowX: 'auto',
                          }}>
                            {q.key}
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                            {q.appeared.map(p => (
                              <span key={p} style={{
                                fontSize: '10px', fontWeight: 500,
                                padding: '3px 9px', borderRadius: '100px',
                                background: 'rgba(41,151,255,0.12)',
                                color: '#2997ff',
                                border: '1px solid rgba(41,151,255,0.2)',
                              }}>
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* Part A MCQ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '32px' }}
        >
          <SectionLabel text="Part A — MCQ (20 × 1 Mark)" />
          <div style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            High-probability topics
          </div>

          {/* Unit filter */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
            {(['all', 1, 2, 3] as const).map(u => (
              <button
                key={u}
                onClick={() => { setActiveUnit(u); setExpandedMCQ(null); }}
                style={{
                  padding: '8px 16px', borderRadius: '100px', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap',
                  border: 'none',
                  background: activeUnit === u ? '#2997ff' : 'rgba(255,255,255,0.08)',
                  color: activeUnit === u ? '#ffffff' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.18s',
                  flexShrink: 0,
                }}
              >
                {u === 'all' ? 'All Units' : `Unit ${u}`}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeUnit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
            >
              {filteredMCQ.map((t, i) => (
                <Card key={i} style={{ padding: 0, overflow: 'hidden' }}>
                  <button
                    onClick={() => setExpandedMCQ(expandedMCQ === i ? null : i)}
                    style={{
                      width: '100%', background: 'none', border: 'none',
                      padding: '14px 16px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                    }}
                  >
                    {/* Prob indicator */}
                    <div style={{
                      width: '4px', height: '36px', borderRadius: '2px',
                      background: PROB_COLOR(t.prob), flexShrink: 0,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.9)', lineHeight: 1.35 }}>
                        {t.topic}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                        Unit {t.unit}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: PROB_COLOR(t.prob), flexShrink: 0 }}>
                      {t.prob}%
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>
                      {expandedMCQ === i ? <ChevronUp size={14} strokeWidth={1.5} /> : <ChevronDown size={14} strokeWidth={1.5} />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {expandedMCQ === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 16px 14px 36px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.55, margin: '12px 0 0' }}>
                            {t.tip}
                          </p>
                          {t.trap && (
                            <div style={{
                              display: 'flex', gap: '8px', alignItems: 'flex-start',
                              marginTop: '10px', padding: '10px 12px',
                              background: 'rgba(239,68,68,0.08)',
                              border: '1px solid rgba(239,68,68,0.2)',
                              borderRadius: '10px',
                            }}>
                              <AlertTriangle size={12} strokeWidth={1.5} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
                              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                                {t.trap}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Exam strategy summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '28px' }}
        >
          <SectionLabel text="Exam Strategy" />
          <Card style={{ padding: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '16px' }}>
              Safe path to 65+/75
            </div>
            {[
              { part: 'Part A', marks: '20', action: 'Revise dropna/fillna axis, loc vs iloc, precision formula' },
              { part: 'Part B', marks: '40', action: 'Do Q19, Q21, Q23 (all 4 papers). Skip 1 risky question.' },
              { part: 'Part C', marks: '15', action: 'Write dropna+fillna+groupby+bar chart. 100% hit rate.' },
            ].map(({ part, marks, action }) => (
              <div key={part} style={{
                display: 'flex', gap: '14px', marginBottom: '14px',
                paddingBottom: '14px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ flexShrink: 0, width: '52px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#2997ff' }}>{part}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{marks} marks</div>
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                  {action}
                </div>
              </div>
            ))}
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
              Covers all 6 units via the right question picks.
            </div>
          </Card>
        </motion.div>

        {/* PDF CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={() => window.open('/prepguide.pdf', '_blank')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '16px', borderRadius: '14px', width: '100%',
              background: '#0066cc',
              border: 'none',
              color: '#ffffff',
              fontSize: '15px', fontWeight: 500, letterSpacing: '-0.02em',
              cursor: 'pointer',
            }}
          >
            Download Prep Guide PDF
          </button>
        </motion.div>

      </div>
    </div>
  );
}
