import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ExternalLink, AlertTriangle, CheckCircle, Target, TrendingUp, Zap } from 'lucide-react';

interface Props {
  onBack: () => void;
}

/* ─── DATA ─────────────────────────────────────────────────── */

const MCQ_TOPICS = [
  // Unit 1
  { unit: 1, topic: 'NumPy ndarray vs Python list', prob: 95, tip: 'ndarray = homogeneous, fixed-type. List = heterogeneous. Key: dtype, shape, broadcasting.', trap: null },
  { unit: 1, topic: 'Pandas Series vs DataFrame', prob: 95, tip: 'Series = 1D labelled array. DataFrame = 2D table. Both have index.', trap: 'Series has no columns, only index + values.' },
  { unit: 1, topic: 'NumPy functions: eye(), zeros(), ones(), reshape()', prob: 85, tip: 'eye(n) = identity matrix. reshape(-1, col) = auto-compute rows.', trap: 'eye() ≠ identity() — identity() is strict float64.' },
  { unit: 1, topic: 'Data Science Process steps', prob: 80, tip: 'Collect → Clean → Explore → Model → Evaluate → Deploy. 6 steps.', trap: null },
  { unit: 1, topic: 'DataFrame indexing: loc vs iloc', prob: 90, tip: 'loc = label-based. iloc = integer position-based. Both inclusive/exclusive differ.', trap: 'loc is INCLUSIVE on both ends. iloc is exclusive of stop.' },
  { unit: 1, topic: 'Web API / data acquisition method', prob: 70, tip: 'requests.get(url).json() → into DataFrame. Always check status_code == 200.', trap: null },
  // Unit 2
  { unit: 2, topic: 'dropna() axis parameter', prob: 98, tip: 'axis=0 drops ROWS with NaN (default). axis=1 drops COLUMNS with NaN.', trap: 'axis=0 = rows. axis=1 = columns. Most MCQs test this swap.' },
  { unit: 2, topic: 'fillna() methods: mean, ffill, bfill', prob: 90, tip: 'ffill = forward fill (uses previous value). bfill = backward fill. .fillna(df.mean()) fills with column mean.', trap: null },
  { unit: 2, topic: 'merge() vs concat() vs join()', prob: 92, tip: 'merge() = SQL join on key. concat() = stack rows/cols. join() = index-based merge (method on df).', trap: 'merge is a FUNCTION (pd.merge). join is a METHOD (df.join).' },
  { unit: 2, topic: 'groupby() + agg() vs apply()', prob: 88, tip: 'agg() = fast, applies named functions (mean, sum). apply() = flexible, row/group lambda.', trap: 'agg takes string names like "mean". apply takes a function.' },
  { unit: 2, topic: 'Binning: cut() vs qcut()', prob: 75, tip: 'cut() = equal-width bins. qcut() = equal-frequency (quantile) bins.', trap: null },
  { unit: 2, topic: 'StandardScaler: fit vs fit_transform', prob: 88, tip: 'fit() learns mean/std. transform() applies it. fit_transform() does both. ONLY fit on train data.', trap: 'NEVER fit on test data. fit_transform on train, transform only on test.' },
  { unit: 2, topic: 'Outlier detection: IQR method', prob: 80, tip: 'IQR = Q3 - Q1. Lower = Q1 - 1.5×IQR. Upper = Q3 + 1.5×IQR. Values outside = outliers.', trap: null },
  // Unit 3
  { unit: 3, topic: 'plt.show() vs plt.savefig()', prob: 88, tip: 'savefig() MUST come before show(). show() clears the figure buffer.', trap: 'If savefig() after show() → saves blank image.' },
  { unit: 3, topic: 'plt.subplot() vs plt.subplots()', prob: 82, tip: 'subplot(rows, cols, index) — 1-based index. subplots(rows, cols) returns fig, axes array.', trap: 'subplot() index starts at 1, not 0.' },
  { unit: 3, topic: 'Seaborn plot types', prob: 85, tip: 'sns.heatmap(corr). sns.boxplot(x=, y=, data=). sns.pairplot(df). sns.histplot(df, kde=True).', trap: null },
  { unit: 3, topic: 'train_test_split signature', prob: 90, tip: 'train_test_split(X, y, test_size=0.2, random_state=42). Default test_size=0.25.', trap: 'Default test_size is 0.25, not 0.2. random_state ≠ random_seed.' },
  { unit: 3, topic: 'Confusion matrix: precision vs accuracy', prob: 92, tip: 'Accuracy = (TP+TN)/(all). Precision = TP/(TP+FP). Recall = TP/(TP+FN). F1 = harmonic mean.', trap: 'Precision = TP/(TP+FP). NOT TP/(TP+TN). Classic trap.' },
  { unit: 3, topic: 'K-Means: n_clusters parameter', prob: 85, tip: 'KMeans(n_clusters=3, random_state=42). NOT k= or clusters=. Must specify n_clusters.', trap: 'Parameter is n_clusters, not k. k is just the math notation.' },
  { unit: 3, topic: 'sklearn import paths', prob: 80, tip: 'from sklearn.linear_model import LinearRegression / LogisticRegression. from sklearn.tree import DecisionTreeClassifier.', trap: null },
];

const PART_B_QUESTIONS = [
  {
    qNum: 'Q17/18',
    topic: 'NumPy Array Programs',
    unit: 1,
    prob: 88,
    appeared: ['May25', 'Jul25', 'Dec25'],
    type: 'safe',
    desc: 'Create 2D array → sorting by columns, checking equality, complex sort. Usually 3-4 sub-parts.',
    template: 'Create array → reshape → sort → print result. 10 marks = definition (2) + code (6) + output (2).',
    keyFunctions: ['np.array()', 'np.sort()', 'np.argsort()', 'arr.reshape()', 'arr.T'],
  },
  {
    qNum: 'Q19/20',
    topic: 'Pandas DataFrame + Data Cleaning',
    unit: 1,
    prob: 96,
    appeared: ['May25', 'Jul25', 'Dec25', 'Dec23'],
    type: 'must',
    desc: 'Read CSV → display stats → handle missing values → rank/sort. Appears in ALL 4 papers.',
    template: 'pd.read_csv() → df.describe() → df.dropna()/fillna() → df.sort_values() → print.',
    keyFunctions: ['pd.read_csv()', 'df.describe()', 'df.dropna()', 'df.fillna()', 'df.sort_values()'],
  },
  {
    qNum: 'Q21/22',
    topic: 'Matplotlib Visualization',
    unit: 3,
    prob: 94,
    appeared: ['May25', 'Jul25', 'Dec25', 'Dec23'],
    type: 'must',
    desc: 'Customized bar/line/scatter chart with title, labels, legend, axis. Appears in ALL 4 papers.',
    template: 'plt.figure() → plt.bar/plot/scatter() → plt.xlabel/ylabel/title/legend() → plt.show().',
    keyFunctions: ['plt.bar()', 'plt.plot()', 'plt.xlabel()', 'plt.title()', 'plt.legend()'],
  },
  {
    qNum: 'Q23/24',
    topic: 'GroupBy + Aggregation + Pivot',
    unit: 2,
    prob: 92,
    appeared: ['May25', 'Jul25', 'Dec25', 'Dec23'],
    type: 'must',
    desc: 'GroupBy by column → mean/min/max values. Pivot table for manager-wise purchase. ALL 4 papers.',
    template: 'df.groupby("col").agg({"val": ["mean","min","max"]}) or pd.pivot_table().',
    keyFunctions: ['df.groupby()', '.agg()', 'pd.pivot_table()', '.mean()', '.min()', '.max()'],
  },
  {
    qNum: 'Q25/26',
    topic: 'Merge + Concat + Data Pipeline',
    unit: 2,
    prob: 85,
    appeared: ['May25', 'Jul25', 'Dec25'],
    type: 'safe',
    desc: 'Merge two datasets on common key using merge() AND concat(). Reshape with pivot/melt/stack.',
    template: 'pd.merge(df1, df2, on="key", how="inner") and pd.concat([df1, df2], axis=0).',
    keyFunctions: ['pd.merge()', 'pd.concat()', 'df.pivot()', 'df.melt()', 'df.stack()'],
  },
  {
    qNum: 'Q27/28 (Part B variant)',
    topic: 'Seaborn + Advanced Viz',
    unit: 3,
    prob: 70,
    appeared: ['Jul25', 'Dec25'],
    type: 'risky',
    desc: 'Seaborn boxplot, pairplot, histplot with KDE. Sometimes appears in Part B, not just Part C.',
    template: 'import seaborn as sns; sns.boxplot(x="col", y="val", data=df); plt.show().',
    keyFunctions: ['sns.boxplot()', 'sns.pairplot()', 'sns.histplot(kde=True)', 'sns.heatmap()'],
  },
];

const PART_C_PREDICTIONS = [
  {
    rank: 1,
    label: 'Highly Probable',
    color: '#ef4444',
    scenario: 'dropna + fillna + value_counts + GroupBy + bar chart',
    evidence: 'Jul25 Q27 exactly. Core pattern repeated across all papers. Simplest to ask.',
    code: `df = pd.read_csv('data.csv')
# Step 1: Inspect
print(df.isnull().sum())
# Step 2: Clean
df = df.dropna(subset=['important_col'])
df['age'].fillna(df['age'].mean(), inplace=True)
# Step 3: Analyze
print(df['category'].value_counts())
# Step 4: GroupBy
result = df.groupby('region')['sales'].agg(['sum','mean'])
# Step 5: Visualize
result['sum'].plot(kind='bar', title='Sales by Region')
plt.xlabel('Region'); plt.ylabel('Sales'); plt.show()`,
    papers: ['Jul25 Q27', 'All papers have dropna/fillna'],
  },
  {
    rank: 2,
    label: 'Very Likely',
    color: '#f59e0b',
    scenario: 'merge + groupby + seaborn heatmap',
    evidence: 'May25 Q27 exactly. merge() is tested heavily in MCQ too — examiners like consistency.',
    code: `df1 = pd.read_csv('orders.csv')
df2 = pd.read_csv('customers.csv')
# Step 1: Merge
merged = pd.merge(df1, df2, on='customer_id', how='inner')
# Step 2: GroupBy
pivot = merged.groupby(['region','product'])['amount'].sum().unstack()
# Step 3: Heatmap
plt.figure(figsize=(10,6))
sns.heatmap(pivot, annot=True, fmt='.0f', cmap='Blues')
plt.title('Sales Heatmap by Region and Product')
plt.show()`,
    papers: ['May25 Q27', 'Merge tested in May25 Part A too'],
  },
  {
    rank: 3,
    label: 'Possible',
    color: '#3b82f6',
    scenario: 'pivot_table + concat + matplotlib subplots',
    evidence: 'Dec25 Q27. If Dec25 is fresh in examiner memory for the next exam cycle.',
    code: `df1 = pd.read_csv('q1.csv')
df2 = pd.read_csv('q2.csv')
# Step 1: Concat
combined = pd.concat([df1, df2], ignore_index=True)
# Step 2: Pivot
table = pd.pivot_table(combined, values='sales',
    index='month', columns='product', aggfunc='sum')
# Step 3: Subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
table.plot(kind='bar', ax=ax1, title='Sales by Month')
combined.groupby('product')['sales'].sum().plot(
    kind='pie', ax=ax2, autopct='%1.1f%%', title='Product Share')
plt.tight_layout(); plt.show()`,
    papers: ['Dec25 Q27'],
  },
];

/* ─── HELPERS ─────────────────────────────────────────────── */

const PROB_COLOR = (p: number) =>
  p >= 90 ? '#ef4444' : p >= 80 ? '#f59e0b' : p >= 70 ? '#3b82f6' : '#6b7280';

const TYPE_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  must:   { bg: '#fee2e2', color: '#dc2626', label: 'MUST DO' },
  safe:   { bg: '#d1fae5', color: '#059669', label: 'SAFE PICK' },
  risky:  { bg: '#fef3c7', color: '#d97706', label: 'RISKY' },
};

function SectionTitle({ label, title, desc }: { label: string; title: string; desc?: string }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: '#0066cc', background: '#eff6ff',
        padding: '4px 12px', borderRadius: '100px', marginBottom: '10px',
      }}>
        {label}
      </div>
      <h2 style={{
        fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 600, color: '#1d1d1f',
        letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 8px',
      }}>
        {title}
      </h2>
      {desc && <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{desc}</p>}
    </div>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────── */

export function DSAnalysisPage({ onBack }: Props) {
  return (
    <div style={{ background: '#f5f5f7', minHeight: '100vh' }}>

      {/* Sticky top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(245,245,247,0.88)', backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px clamp(16px, 5vw, 80px)',
        display: 'flex', alignItems: 'center', gap: '14px',
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px',
            padding: '6px 12px', fontSize: '12.5px', fontWeight: 500, color: '#374151',
            cursor: 'none', transition: 'background 0.15s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#fff')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'none')}
        >
          <ArrowLeft size={13} strokeWidth={1.5} />
          Back
        </button>
        <div style={{ height: '16px', width: '1px', background: '#e5e7eb' }} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f' }}>Data Science</span>
        <span style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'JetBrains Mono, monospace' }}>21CSS303T</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a
            href="../exam_bible.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '6px 12px', borderRadius: '8px', background: '#0066cc',
              color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: 600,
              cursor: 'none',
            }}
          >
            <BookOpen size={12} strokeWidth={1.5} />
            Open PDF Guide
            <ExternalLink size={10} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: 'clamp(32px, 5vw, 56px) clamp(16px, 5vw, 80px)' }}>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '48px' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#0066cc', marginBottom: '12px',
          }}>
            <CheckCircle size={12} strokeWidth={2} />
            4 Papers Analyzed · Full Breakdown
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 600, color: '#1d1d1f',
            letterSpacing: '-0.04em', lineHeight: 1.1, margin: '0 0 12px',
          }}>
            Data Science — Exam Intelligence
          </h1>
          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, margin: 0, maxWidth: '600px' }}>
            Every question from May 2025 · July 2025 · December 2025 · December 2023 — decoded.
            What to study for Part A, which questions to pick in Part B, and exactly what Q27 will ask.
          </p>

          {/* Quick stats */}
          <div style={{
            display: 'flex', gap: '20px', marginTop: '24px', flexWrap: 'wrap',
          }}>
            {[
              { icon: '📊', n: '20', l: 'MCQs decoded', c: '#0066cc' },
              { icon: '📝', n: '4 of 6', l: 'Part B picks', c: '#7c3aed' },
              { icon: '🎯', n: '100%', l: 'Q27 hit rate', c: '#dc2626' },
              { icon: '✅', n: '65+', l: 'Achievable marks', c: '#059669' },
            ].map(({ icon, n, l, c }) => (
              <div key={l} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: '#fff', borderRadius: '10px', padding: '10px 16px',
                border: '1px solid #e5e7eb',
              }}>
                <span style={{ fontSize: '16px' }}>{icon}</span>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: c, letterSpacing: '-0.03em' }}>{n}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>{l}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── PART A: MCQ Analysis ─────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          style={{ marginBottom: '48px' }}
        >
          <SectionTitle
            label="Part A · 20 × 1 = 20 marks"
            title="MCQ Topic-by-Topic Breakdown"
            desc="All 20 are compulsory. No choice. Each topic below maps to 1-2 questions per paper."
          />

          {/* Unit tabs visual */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {[1, 2, 3].map(u => {
              const count = MCQ_TOPICS.filter(t => t.unit === u).length;
              const colors = ['#0066cc', '#7c3aed', '#059669'];
              return (
                <div key={u} style={{
                  padding: '5px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 600,
                  background: `${colors[u-1]}14`, border: `1.5px solid ${colors[u-1]}33`,
                  color: colors[u-1],
                }}>
                  Unit {u} — ~{count} MCQs
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MCQ_TOPICS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.04 * i }}
                style={{
                  background: '#fff', borderRadius: '14px', padding: '16px 18px',
                  border: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'flex-start',
                }}
              >
                {/* Probability pill */}
                <div style={{
                  flexShrink: 0, width: '48px', textAlign: 'center',
                  padding: '4px 0', borderRadius: '8px',
                  background: `${PROB_COLOR(item.prob)}14`,
                  border: `1.5px solid ${PROB_COLOR(item.prob)}33`,
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: PROB_COLOR(item.prob) }}>{item.prob}%</div>
                  <div style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 500 }}>U{item.unit}</div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1d1d1f', marginBottom: '4px' }}>
                    {item.topic}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#4b5563', lineHeight: 1.5, marginBottom: item.trap ? '6px' : 0 }}>
                    {item.tip}
                  </div>
                  {item.trap && (
                    <div style={{
                      display: 'flex', gap: '5px', alignItems: 'flex-start',
                      background: '#fff7ed', borderRadius: '6px', padding: '5px 10px',
                      border: '1px solid #fed7aa',
                    }}>
                      <AlertTriangle size={11} strokeWidth={2} style={{ color: '#f59e0b', marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '11.5px', color: '#92400e', fontWeight: 500 }}>TRAP: {item.trap}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── PART B: Question Strategy ───────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          style={{ marginBottom: '48px' }}
        >
          <SectionTitle
            label="Part B · 4 × 10 = 40 marks"
            title="Pick Your 4 — Probability Ranked"
            desc="Answer any 4 of 6 questions. Here's every question with probability and exact template."
          />

          {/* Recommended combo banner */}
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
            borderRadius: '14px', padding: '16px 20px', marginBottom: '20px',
            border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '12px',
            flexWrap: 'wrap',
          }}>
            <Zap size={18} strokeWidth={1.5} style={{ color: '#0066cc', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1d1d1f', marginBottom: '3px' }}>
                Recommended combo: <span style={{ color: '#0066cc' }}>Q19 + Q21 + Q23 + Q25</span>
              </div>
              <div style={{ fontSize: '12px', color: '#4b5563' }}>
                Data cleaning + Visualization + GroupBy + Merge — all appeared in 3+ papers. Safest 40 marks.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {PART_B_QUESTIONS.map((q, i) => {
              const badge = TYPE_BADGE[q.type];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.06 * i }}
                  style={{
                    background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                  }}
                >
                  {/* Header */}
                  <div style={{
                    padding: '14px 20px', borderBottom: '1px solid #f3f4f6',
                    display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontSize: '13px', fontWeight: 700, color: '#1d1d1f',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>{q.qNum}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', flex: 1 }}>{q.topic}</span>
                    <div style={{
                      padding: '2px 10px', borderRadius: '100px', fontSize: '10.5px',
                      fontWeight: 700, background: badge.bg, color: badge.color,
                    }}>{badge.label}</div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      fontSize: '13px', fontWeight: 700, color: PROB_COLOR(q.prob),
                    }}>
                      <TrendingUp size={12} strokeWidth={1.5} />
                      {q.prob}%
                    </div>
                  </div>

                  <div style={{ padding: '14px 20px' }}>
                    <p style={{ fontSize: '13px', color: '#4b5563', margin: '0 0 10px', lineHeight: 1.55 }}>
                      {q.desc}
                    </p>

                    {/* Appeared in */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>Appeared:</span>
                      {q.appeared.map(p => (
                        <span key={p} style={{
                          fontSize: '11px', fontWeight: 600, color: '#0066cc',
                          background: '#eff6ff', padding: '2px 8px', borderRadius: '100px',
                        }}>{p}</span>
                      ))}
                    </div>

                    {/* Template */}
                    <div style={{
                      background: '#f9fafb', borderRadius: '10px', padding: '12px 14px',
                      border: '1px solid #f3f4f6', marginBottom: '10px',
                    }}>
                      <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '5px' }}>Template Answer</div>
                      <div style={{ fontSize: '12.5px', color: '#374151', lineHeight: 1.55 }}>{q.template}</div>
                    </div>

                    {/* Key functions */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {q.keyFunctions.map(fn => (
                        <span key={fn} style={{
                          fontSize: '11px', fontWeight: 500, color: '#374151',
                          background: '#f3f4f6', padding: '2px 8px', borderRadius: '6px',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}>{fn}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── PART C: Q27 Prediction ──────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          style={{ marginBottom: '48px' }}
        >
          <SectionTitle
            label="Part C · 1 × 15 = 15 marks"
            title="Q27 Prediction — 3 Probable Questions"
            desc="Q27 = Data Wrangling pipeline in 3 of 3 recent papers. This is the most predictable question in the paper."
          />

          {/* Hit rate banner */}
          <div style={{
            background: '#1c1c1e', borderRadius: '14px', padding: '18px 22px',
            marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px',
            flexWrap: 'wrap',
          }}>
            <Target size={22} strokeWidth={1.5} style={{ color: '#ef4444', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '3px' }}>
                Q27 = Data Wrangling — 3/3 recent papers (100% hit rate)
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                May25 Q27 · Jul25 Q27 · Dec25 Q27 — all wrangling pipelines.
                Even Dec23 had wrangling as one of the Part C options.
              </div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444', letterSpacing: '-0.04em' }}>100%</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>hit rate</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {PART_C_PREDICTIONS.map((pred, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 * i }}
                style={{
                  background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                }}
              >
                {/* Rank bar */}
                <div style={{ height: '3px', background: pred.color }} />
                <div style={{ padding: '16px 20px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '26px', height: '26px', borderRadius: '50%',
                      background: pred.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>{pred.rank}</div>
                    <span style={{
                      fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: pred.color,
                    }}>{pred.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', flex: 1 }}>
                      {pred.scenario}
                    </span>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {pred.papers.map(p => (
                        <span key={p} style={{
                          fontSize: '10.5px', fontWeight: 600, color: pred.color,
                          background: `${pred.color}14`, padding: '2px 8px', borderRadius: '100px',
                        }}>{p}</span>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#4b5563', lineHeight: 1.55, margin: '0 0 14px' }}>
                    {pred.evidence}
                  </p>
                </div>

                {/* Code block */}
                <div style={{
                  margin: '0 20px 18px',
                  background: '#0d1117', borderRadius: '10px', padding: '14px 16px',
                  border: '1px solid rgba(255,255,255,0.06)', overflow: 'auto',
                }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Template Code
                  </div>
                  <pre style={{
                    margin: 0, fontSize: '12px', lineHeight: 1.65,
                    fontFamily: 'JetBrains Mono, monospace', color: '#e2e8f0',
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  }}>{pred.code}</pre>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Q28 note */}
          <div style={{
            background: '#f9fafb', borderRadius: '12px', padding: '14px 18px',
            border: '1px solid #e5e7eb', marginTop: '16px',
          }}>
            <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#4b5563', marginBottom: '5px' }}>
              Q28 (alternative) — ML Pipeline
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>
              If Q27 is wrangling (which it will be), Q28 is an ML pipeline:
              <code style={{ fontFamily: 'JetBrains Mono, monospace', background: '#f3f4f6', padding: '1px 5px', borderRadius: '4px', marginLeft: '4px', fontSize: '11.5px' }}>
                train_test_split → fit → predict → confusion_matrix
              </code>.
              But you only need to answer ONE — pick Q27 (wrangling is easier to score full marks on).
            </div>
          </div>
        </motion.section>

        {/* ── Download ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: '#1d1d1f', borderRadius: '20px', padding: '32px 36px',
            textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 8px' }}>
            Need the full study guide?
          </h3>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 20px' }}>
            First principles explanations · Memory techniques · All model answers · Code arsenal
          </p>
          <a
            href="../exam_bible.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px', borderRadius: '100px', background: '#0066cc',
              color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600,
              cursor: 'none', transition: 'background 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#0077ed')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#0066cc')}
          >
            <BookOpen size={15} strokeWidth={1.5} />
            Open Exam Bible
            <ExternalLink size={13} strokeWidth={1.5} />
          </a>
        </motion.div>

      </div>
    </div>
  );
}
