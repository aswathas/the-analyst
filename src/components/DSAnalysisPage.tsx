import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, AlertTriangle, CheckCircle, Target, TrendingUp, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { UnitDonut } from './UnitDonut';
import { PartBreakdown } from './PartBreakdown';
import { PYQCards } from './PYQCards';
import { Heatmap } from './Heatmap';

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
    <div style={{ marginBottom: '44px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
        textTransform: 'uppercase', color: '#2997ff',
        marginBottom: '12px',
      }}>
        {label}
      </div>
      <h2 style={{
        fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 600, color: '#ffffff',
        letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 12px',
      }}>
        {title}
      </h2>
      {desc && <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.55 }}>{desc}</p>}
    </div>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────── */

export function DSAnalysisPage({ onBack }: Props) {
  const [activeUnit, setActiveUnit] = useState<1 | 2 | 3 | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'must' | 'safe' | 'risky'>('all');
  const [showCodeB, setShowCodeB] = useState<Record<number, boolean>>({});
  const [showCodeC, setShowCodeC] = useState<Record<number, boolean>>({});

  const toggleCodeB = (i: number) => setShowCodeB(p => ({ ...p, [i]: !p[i] }));
  const toggleCodeC = (i: number) => setShowCodeC(p => ({ ...p, [i]: !p[i] }));

  const filteredMCQ = activeUnit === 'all' ? MCQ_TOPICS : MCQ_TOPICS.filter(t => t.unit === activeUnit);
  const filteredPartB = filterType === 'all' ? PART_B_QUESTIONS : PART_B_QUESTIONS.filter(q => q.type === filterType);

  return (
    <div style={{ background: '#1d1d1f', minHeight: '100vh' }}>

      {/* Sticky top bar — dark frosted */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '12px clamp(16px, 5vw, 80px)',
        display: 'flex', alignItems: 'center', gap: '14px',
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
            padding: '6px 12px', fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.7)',
            cursor: 'none',
          }}
        >
          <ArrowLeft size={13} strokeWidth={1.5} />
          Back
        </button>
        <div style={{ height: '16px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>Data Science</span>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>21CSS303T</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Liquid glass Prep Guide button */}
          <button
            onClick={() => window.open('/DS_Prep_Guide.pdf', '_blank')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '6px 14px', borderRadius: '9999px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '12px', fontWeight: 400, cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.25)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.14)';
            }}
          >
            <BookOpen size={12} strokeWidth={1.5} />
            Prep Guide
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: 'clamp(56px, 7vw, 88px) clamp(20px, 5vw, 80px)' }}>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '88px' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: '#2997ff', marginBottom: '14px',
          }}>
            <CheckCircle size={12} strokeWidth={2} />
            4 Papers Analyzed · Full Breakdown
          </div>
          <h1 style={{
            fontSize: 'clamp(32px, 5.5vw, 60px)', fontWeight: 600, color: '#ffffff',
            letterSpacing: '-0.04em', lineHeight: 1.08, margin: '0 0 16px',
          }}>
            Data Science — Exam Intelligence
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0, maxWidth: '640px', letterSpacing: '-0.022em' }}>
            Every question from May 2025 · July 2025 · December 2025 · December 2023 — decoded.
            What to study for Part A, which questions to pick in Part B, and exactly what Q27 will ask.
          </p>

          {/* Quick stats */}
          <div style={{
            display: 'flex', gap: '16px', marginTop: '32px', flexWrap: 'wrap',
          }}>
            {[
              { n: '20', l: 'MCQs decoded', c: '#2997ff' },
              { n: '4 of 6', l: 'Part B picks', c: '#bf5af2' },
              { n: '100%', l: 'Q27 hit rate', c: '#ff453a' },
              { n: '65+', l: 'Achievable marks', c: '#30d158' },
            ].map(({ n, l, c }) => (
              <div key={l} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: '#1c1c1e', borderRadius: '14px', padding: '16px 22px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 600, color: c, letterSpacing: '-0.03em' }}>{n}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 400, marginTop: '2px' }}>{l}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── EXAM STRUCTURE OVERVIEW ──────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '88px' }}
        >
          <SectionTitle
            label="Exam Structure"
            title="75 Marks — How It Breaks Down"
            desc="Understand the mark distribution before you strategize which questions to pick."
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'start',
          }}>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              style={{
                background: '#1c1c1e', borderRadius: '20px', padding: '40px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{
                fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px',
              }}>Marks by Unit</div>
              <UnitDonut />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.16 }}

            >
              <PartBreakdown />
            </motion.div>
          </div>
        </motion.section>

        {/* ── PYQ SOURCES ───────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '88px' }}
        >
          <SectionTitle
            label="4 Papers Analyzed"
            title="Evidence Base"
            desc="Every prediction in this guide is grounded in these 4 past papers."
          />
          <PYQCards dark />
        </motion.section>

        {/* ── TOPIC FREQUENCY ───────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '88px' }}
        >
          <SectionTitle
            label="Topic Frequency"
            title="What Gets Asked — Visualized"
            desc="Animated probability bars across all 15 tracked topics. Red = exam critical."
          />
          <div style={{
            background: '#1c1c1e', borderRadius: '20px', padding: '40px 44px',
            border: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px',
          }}>
            <Heatmap />
          </div>
        </motion.section>

        {/* ── PART A: MCQ Analysis ─────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          style={{ marginBottom: '88px' }}
        >
          <SectionTitle
            label="Part A · 20 × 1 = 20 marks"
            title="MCQ Topic-by-Topic Breakdown"
            desc="All 20 are compulsory. No choice. Each topic below maps to 1-2 questions per paper."
          />

          {/* Unit tabs — functional filter */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {(['all', 1, 2, 3] as const).map(u => {
              const count = u === 'all' ? MCQ_TOPICS.length : MCQ_TOPICS.filter(t => t.unit === u).length;
              const colors = { 1: '#2997ff', 2: '#bf5af2', 3: '#30d158', all: 'rgba(255,255,255,0.65)' } as const;
              const c = colors[u];
              const isActive = activeUnit === u;
              return (
                <button key={u} onClick={() => setActiveUnit(u)} style={{
                  padding: '8px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: 600,
                  background: isActive ? `${c}22` : 'rgba(255,255,255,0.04)',
                  border: isActive ? `1.5px solid ${c}55` : '1.5px solid rgba(255,255,255,0.1)',
                  color: isActive ? c : 'rgba(255,255,255,0.35)',
                  cursor: 'none', transition: 'all 0.2s ease',
                }}>
                  {u === 'all' ? `All — ${count}` : `Unit ${u} — ${count}`}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeUnit}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '16px',
              }}
            >
              {filteredMCQ.map((item, i) => (
                <motion.div
                  key={item.topic}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.32, delay: (i % 4) * 0.04 }}
                  style={{
                    background: '#1c1c1e', borderRadius: '16px', padding: '22px 26px',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{
                      flexShrink: 0, padding: '3px 10px', borderRadius: '8px',
                      background: `${PROB_COLOR(item.prob)}18`, border: `1px solid ${PROB_COLOR(item.prob)}44`,
                      fontSize: '12px', fontWeight: 600, color: PROB_COLOR(item.prob),
                    }}>{item.prob}%</div>
                    <div style={{
                      fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.3)',
                      background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: '100px',
                    }}>U{item.unit}</div>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '8px', lineHeight: 1.3 }}>
                    {item.topic}
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: item.trap ? '12px' : 0 }}>
                    {item.tip}
                  </div>
                  {item.trap && (
                    <div style={{
                      display: 'flex', gap: '6px', alignItems: 'flex-start',
                      background: 'rgba(255,159,10,0.1)', borderRadius: '8px', padding: '8px 12px',
                      border: '1px solid rgba(255,159,10,0.25)',
                    }}>
                      <AlertTriangle size={12} strokeWidth={2} style={{ color: '#ff9f0a', marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: '#ff9f0a', fontWeight: 400 }}>TRAP: {item.trap}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* ── PART B: Question Strategy ───────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          style={{ marginBottom: '88px' }}
        >
          <SectionTitle
            label="Part B · 4 × 10 = 40 marks"
            title="Pick Your 4 — Probability Ranked"
            desc="Answer any 4 of 6 questions. Here's every question with probability and exact template."
          />

          {/* Filter bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {(['all', 'must', 'safe', 'risky'] as const).map(f => {
              const labels = { all: 'All', must: 'Must Do', safe: 'Safe Pick', risky: 'Risky' };
              const isActive = filterType === f;
              return (
                <button key={f} onClick={() => setFilterType(f)} style={{
                  padding: '8px 22px', borderRadius: '100px', fontSize: '13px', fontWeight: 600,
                  background: isActive ? '#2997ff' : 'rgba(255,255,255,0.08)',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
                  border: isActive ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'none', transition: 'all 0.2s ease',
                }}>{labels[f]}</button>
              );
            })}
          </div>

          {/* Recommended combo */}
          <div style={{
            background: 'rgba(41,151,255,0.08)',
            borderRadius: '20px', padding: '22px 28px', marginBottom: '32px',
            border: '1px solid rgba(41,151,255,0.2)', display: 'flex', alignItems: 'center', gap: '16px',
            flexWrap: 'wrap',
          }}>
            <Zap size={20} strokeWidth={1.5} style={{ color: '#2997ff', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.022em', marginBottom: '5px' }}>
                Safest combo: <span style={{ color: '#2997ff' }}>Q19 + Q21 + Q23 + Q25</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.55)', letterSpacing: '-0.014em' }}>
                Data cleaning + Visualization + GroupBy + Merge — all appeared in 3+ papers. Guaranteed 40 marks.
              </div>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredPartB.map((q, i) => {
              const badge = TYPE_BADGE[q.type];
              const origIdx = PART_B_QUESTIONS.indexOf(q);
              return (
                <motion.div
                  key={q.qNum}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  style={{
                    background: '#1c1c1e', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.07)',
                    overflow: 'hidden', marginBottom: '20px',
                  }}
                >
                  {/* Header */}
                  <div style={{
                    padding: '20px 26px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono, monospace' }}>{q.qNum}</span>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', flex: 1 }}>{q.topic}</span>
                    <div style={{
                      padding: '2px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: 600,
                      background: q.type === 'must' ? 'rgba(255,69,58,0.15)' : q.type === 'safe' ? 'rgba(48,209,88,0.12)' : 'rgba(255,159,10,0.12)',
                      color: q.type === 'must' ? '#ff453a' : q.type === 'safe' ? '#30d158' : '#ff9f0a',
                      border: `1px solid ${q.type === 'must' ? 'rgba(255,69,58,0.3)' : q.type === 'safe' ? 'rgba(48,209,88,0.25)' : 'rgba(255,159,10,0.25)'}`,
                    }}>{badge.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: PROB_COLOR(q.prob) }}>
                      <TrendingUp size={12} strokeWidth={1.5} />
                      {q.prob}%
                    </div>
                  </div>

                  <div style={{ padding: '20px 26px' }}>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', margin: '0 0 14px', lineHeight: 1.6 }}>{q.desc}</p>

                    <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Appeared:</span>
                      {q.appeared.map(p => (
                        <span key={p} style={{ fontSize: '11px', fontWeight: 600, color: '#2997ff', background: 'rgba(41,151,255,0.12)', padding: '2px 8px', borderRadius: '100px' }}>{p}</span>
                      ))}
                    </div>

                    {/* Collapsible template */}
                    <button onClick={() => toggleCodeB(origIdx)} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: 600,
                      color: 'rgba(255,255,255,0.55)', cursor: 'none', marginBottom: '10px',
                    }}>
                      {showCodeB[origIdx] ? <ChevronUp size={12} strokeWidth={2} /> : <ChevronDown size={12} strokeWidth={2} />}
                      {showCodeB[origIdx] ? 'Hide template' : 'Show template'}
                    </button>

                    <AnimatePresence initial={false}>
                      {showCodeB[origIdx] && (
                        <motion.div
                          key="code"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: 'hidden', marginBottom: '10px' }}
                        >
                          <div style={{ background: '#000000', borderRadius: '10px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '5px' }}>Template</div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.55, fontFamily: 'JetBrains Mono, monospace' }}>{q.template}</div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {q.keyFunctions.map(fn => (
                        <span key={fn} style={{ fontSize: '11px', fontWeight: 400, color: '#2997ff', background: 'rgba(41,151,255,0.1)', padding: '2px 8px', borderRadius: '6px', fontFamily: 'JetBrains Mono, monospace' }}>{fn}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.section>

        {/* ── PART C: Q27 Prediction ──────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          style={{ marginBottom: '88px' }}
        >
          <SectionTitle
            label="Part C · 1 × 15 = 15 marks"
            title="Q27 Prediction — 3 Probable Questions"
            desc="Q27 = Data Wrangling pipeline in 3 of 3 recent papers. This is the most predictable question in the paper."
          />

          {/* Hit rate banner */}
          <div style={{
            background: '#1c1c1e', borderRadius: '18px', padding: '24px 30px',
            marginBottom: '36px', display: 'flex', alignItems: 'center', gap: '18px',
            flexWrap: 'wrap',
          }}>
            <Target size={26} strokeWidth={1.5} style={{ color: '#ef4444', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '5px' }}>
                Q27 = Data Wrangling — 3/3 recent papers (100% hit rate)
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                May25 Q27 · Jul25 Q27 · Dec25 Q27 — all wrangling pipelines.
                Even Dec23 had wrangling as one of the Part C options.
              </div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '28px', fontWeight: 600, color: '#ef4444', letterSpacing: '-0.04em' }}>100%</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>hit rate</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {PART_C_PREDICTIONS.map((pred, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 * i }}
                style={{
                  background: '#1c1c1e', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)',
                  overflow: 'hidden',
                }}
              >
                {/* Rank bar */}
                <div style={{ height: '3px', background: pred.color }} />
                <div style={{ padding: '22px 26px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '26px', height: '26px', borderRadius: '50%',
                      background: pred.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 600, color: '#fff', flexShrink: 0,
                    }}>{pred.rank}</div>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
                      textTransform: 'uppercase', color: pred.color,
                    }}>{pred.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', flex: 1 }}>
                      {pred.scenario}
                    </span>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {pred.papers.map(p => (
                        <span key={p} style={{
                          fontSize: '10px', fontWeight: 600, color: pred.color,
                          background: `${pred.color}18`, padding: '2px 8px', borderRadius: '100px',
                        }}>{p}</span>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: '0 0 16px' }}>
                    {pred.evidence}
                  </p>
                </div>

                {/* Collapsible code block */}
                <div style={{ margin: '0 26px 24px' }}>
                  <button onClick={() => toggleCodeC(i)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: 600,
                    color: 'rgba(255,255,255,0.55)', cursor: 'none', marginBottom: '8px',
                  }}>
                    {showCodeC[i] ? <ChevronUp size={12} strokeWidth={2} /> : <ChevronDown size={12} strokeWidth={2} />}
                    {showCodeC[i] ? 'Hide template' : 'Show template'}
                  </button>
                  <AnimatePresence initial={false}>
                    {showCodeC[i] && (
                      <motion.div
                        key="code-c"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ background: '#000000', borderRadius: '10px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'auto' }}>
                          <div style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Template Code</div>
                          <pre style={{ margin: 0, fontSize: '12px', lineHeight: 1.65, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{pred.code}</pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Q28 note */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '20px 24px',
            border: '1px solid rgba(255,255,255,0.08)', marginTop: '24px',
          }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
              Q28 (alternative) — ML Pipeline
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
              If Q27 is wrangling (which it will be), Q28 is an ML pipeline:
              <code style={{ fontFamily: 'JetBrains Mono, monospace', background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '4px', marginLeft: '4px', fontSize: '12px', color: '#2997ff' }}>
                train_test_split → fit → predict → confusion_matrix
              </code>.
              Pick Q27 — wrangling is easier to score full marks on.
            </div>
          </div>
        </motion.section>

        {/* ── PYQ Topic Frequency Table ──────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '88px' }}
        >
          <SectionTitle
            label="Data Analytics · PYQ Heatmap"
            title="Topic Frequency Across All 4 Papers"
            desc="Green = appeared. The more green, the safer it is to study. Red = never appeared (skip)."
          />

          <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#1c1c1e', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '16px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.04em', fontSize: '12px', textTransform: 'uppercase', minWidth: '200px' }}>Topic</th>
                  {['May 25', 'Jul 25', 'Dec 25', 'Dec 23'].map(p => (
                    <th key={p} style={{ padding: '16px 20px', textAlign: 'center', color: '#2997ff', fontWeight: 600, letterSpacing: '0.04em', fontSize: '12px', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>{p}</th>
                  ))}
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '12px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { topic: 'Pandas DataFrame ops',     m25: true,  j25: true,  d25: true,  d23: true  },
                  { topic: 'Data Wrangling (dropna/fillna)', m25: true, j25: true, d25: true, d23: true },
                  { topic: 'Matplotlib Visualization', m25: true,  j25: true,  d25: true,  d23: true  },
                  { topic: 'GroupBy + Aggregation',    m25: true,  j25: true,  d25: true,  d23: true  },
                  { topic: 'merge() / concat()',        m25: true,  j25: true,  d25: true,  d23: false },
                  { topic: 'Seaborn heatmap/plots',    m25: true,  j25: true,  d25: true,  d23: false },
                  { topic: 'train_test_split + sklearn',m25: true,  j25: true,  d25: false, d23: true  },
                  { topic: 'NumPy array ops',           m25: true,  j25: true,  d25: true,  d23: false },
                  { topic: 'StandardScaler / normalization', m25: true, j25: true, d25: false, d23: true },
                  { topic: 'Confusion matrix metrics', m25: true,  j25: false, d25: true,  d23: true  },
                  { topic: 'pivot_table / melt / stack', m25: false, j25: true, d25: true, d23: false },
                  { topic: 'K-Means clustering',       m25: false, j25: true,  d25: false, d23: true  },
                  { topic: 'iloc / loc indexing',       m25: true,  j25: false, d25: true,  d23: false },
                  { topic: 'Web API / requests.get',   m25: false, j25: true,  d25: false, d23: false },
                  { topic: 'Decision Tree / LogReg',   m25: false, j25: false, d25: true,  d23: true  },
                ].map(({ topic, m25, j25, d25, d23 }, idx) => {
                  const score = [m25, j25, d25, d23].filter(Boolean).length;
                  const rowBg = idx % 2 === 0 ? '#000000' : '#0a0a0a';
                  return (
                    <motion.tr
                      key={topic}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.3, delay: idx * 0.03 }}
                      style={{ background: rowBg, borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      <td style={{ padding: '14px 20px', color: '#ffffff', fontWeight: 400, fontSize: '14px' }}>{topic}</td>
                      {[m25, j25, d25, d23].map((appeared, ci) => (
                        <td key={ci} style={{ padding: '14px 20px', textAlign: 'center' }}>
                          {appeared ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(48,209,88,0.15)', border: '1px solid rgba(48,209,88,0.3)', fontSize: '12px', color: '#30d158' }}>✓</span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>—</span>
                          )}
                        </td>
                      ))}
                      <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block', minWidth: '32px',
                          padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600,
                          background: score === 4 ? 'rgba(48,209,88,0.15)' : score === 3 ? 'rgba(41,151,255,0.15)' : score >= 2 ? 'rgba(255,159,10,0.15)' : 'rgba(255,255,255,0.06)',
                          color: score === 4 ? '#30d158' : score === 3 ? '#2997ff' : score >= 2 ? '#ff9f0a' : 'rgba(255,255,255,0.3)',
                          border: `1px solid ${score === 4 ? 'rgba(48,209,88,0.3)' : score === 3 ? 'rgba(41,151,255,0.25)' : score >= 2 ? 'rgba(255,159,10,0.25)' : 'rgba(255,255,255,0.08)'}`,
                        }}>{score}/4</span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
            {[
              { c: '#30d158', bg: 'rgba(48,209,88,0.15)', label: '4/4 — Must study' },
              { c: '#2997ff', bg: 'rgba(41,151,255,0.15)', label: '3/4 — High priority' },
              { c: '#ff9f0a', bg: 'rgba(255,159,10,0.15)', label: '2/4 — Medium' },
            ].map(({ c, bg, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', background: bg, border: `1px solid ${c}40` }} />
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Prep Guide Downloads ──────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '24px' }}
        >
          <SectionTitle
            label="Study Materials"
            title="Data Science Prep Guide"
            desc="Complete notes — handcrafted from PYQs, syllabus analysis, and topic probability mapping."
          />

          {/* PDF download card */}
          <div>
            <motion.button
              onClick={() => window.open('/DS_Prep_Guide.pdf', '_blank')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '18px 22px', borderRadius: '18px',
                background: 'rgba(41,151,255,0.08)',
                border: '1px solid rgba(41,151,255,0.2)',
                cursor: 'pointer', width: '100%', textAlign: 'left',
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                background: 'rgba(41,151,255,0.15)', border: '1px solid rgba(41,151,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BookOpen size={20} strokeWidth={1.5} style={{ color: '#2997ff' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '3px' }}>Prep Guide PDF</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>View or print in browser</div>
              </div>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', color: '#2997ff', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                OPEN
              </div>
            </motion.button>
          </div>
        </motion.section>

        {/* ── Download ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          style={{
            background: '#1c1c1e', borderRadius: '20px', padding: '48px 44px',
            textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '32px',
          }}
        >
          <h3 style={{ fontSize: '26px', fontWeight: 600, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 12px' }}>
            Need the full study guide?
          </h3>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', margin: '0 0 28px', lineHeight: 1.6 }}>
            First principles explanations · Memory techniques · All model answers · Code arsenal
          </p>
          <button
            onClick={() => window.open('/DS_Prep_Guide.pdf', '_blank')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px', borderRadius: '100px', background: '#2997ff',
              color: '#fff', fontSize: '14px', fontWeight: 400,
              letterSpacing: '-0.022em', cursor: 'pointer', border: 'none',
            }}
          >
            <BookOpen size={15} strokeWidth={1.5} />
            Download Prep Guide
          </button>
        </motion.div>

      </div>
    </div>
  );
}
