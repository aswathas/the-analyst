import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Star, Target, TrendingUp, Zap, ChevronDown, ChevronUp, FileText, Code2 } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const PAPER_SUMMARY = [
  { code: '08JF6', exam: 'July 2024', partA: '20 MCQs', partB: '6 Qs', notable: 'Online learning, scatter s=, vert= traps' },
  { code: '17MA6', exam: 'May 2025',  partA: '20 MCQs', partB: '6 Qs', notable: 'Subplots, annotate(), pivot(), pairplot()' },
  { code: '14JA6', exam: 'July 2025', partA: '20 MCQs', partB: '6 Qs', notable: 'BeautifulSoup, IQR outliers, df.head/sort_values' },
  { code: '10DA6', exam: 'Dec 2025',  partA: '20 MCQs', partB: '6 Qs', notable: 'NEW: ML topics — KNN, Logistic Reg, Overfitting, PCA' },
];

const MCQ_TOPICS = {
  'NumPy': [
    { q: 'Identity matrix in NumPy?', paper: 'May25', answer: 'numpy.eye()' },
    { q: 'Faster in NumPy than Python lists?', paper: 'Jul25', answer: 'Vectorized operations' },
    { q: 'Function to create NumPy array?', paper: 'Jul25', answer: 'array()' },
    { q: 'Join two arrays in NumPy?', paper: 'May25', answer: 'numpy.concatenate()' },
    { q: 'Create array of zeros?', paper: 'Jul25', answer: 'np.zeros()' },
    { q: 'Identity matrix in NumPy?', paper: 'Dec25', answer: 'eye()' },
    { q: 'np prefix for mean function?', paper: 'Jul24', answer: 'np (NOT npm/ng/ngm)' },
    { q: 'eye() does what?', paper: 'Jul24', answer: 'Generates identity matrix' },
  ],
  'Pandas': [
    { q: 'Best for labeled 1D data?', paper: 'May25', answer: 'Series' },
    { q: 'Best for labeled 1D data?', paper: 'Dec25', answer: 'Series' },
    { q: '1D labeled object in Pandas?', paper: 'Jul24', answer: 'Series' },
    { q: 'Difference: Series vs DataFrame?', paper: 'Jul25', answer: 'Series=1D, DataFrame=2D' },
    { q: 'DataFrame accepts?', paper: 'Jul24', answer: 'Both ndarray AND Series' },
    { q: 'df.describe() output?', paper: 'May25', answer: 'Summary statistics' },
    { q: '.drop() does what?', paper: 'May25', answer: 'Drops entries/columns from DataFrame' },
    { q: 'Change index of DataFrame?', paper: 'Jul25', answer: 'reset_index() and set_index()' },
    { q: 'Read CSV in Pandas?', paper: 'Jul25', answer: 'pd.read_csv()' },
    { q: 'Sort DataFrame by column?', paper: 'Jul25', answer: 'df.sort_values()' },
    { q: 'First few rows of DataFrame?', paper: 'Jul25', answer: 'df.head()' },
    { q: 'Remove duplicate rows?', paper: 'Jul25', answer: 'drop_duplicates()' },
    { q: 'Purpose of pivot()?', paper: 'May25', answer: 'To create a pivot table' },
    { q: 'Purpose of reindexing?', paper: 'Jul24', answer: 'To reset the index of a dataframe' },
    { q: 'Data Alignment means?', paper: 'Jul24', answer: 'Matching data based on common indices' },
  ],
  'Missing Data, Merging & Wrangling': [
    { q: 'Handle missing data in Pandas?', paper: 'May25', answer: 'fillna() and dropna()' },
    { q: 'Remove missing values?', paper: 'Jul25', answer: 'dropna()' },
    { q: 'Remove missing values from DataFrame?', paper: 'Dec25', answer: 'dropna()' },
    { q: 'Data wrangling primarily for?', paper: 'May25', answer: 'Cleaning and transforming data' },
    { q: 'Merges on common index values?', paper: 'May25', answer: 'merge_on_index()' },
    { q: 'Merge on common column?', paper: 'Jul25', answer: 'merge()' },
    { q: 'Merge on common column?', paper: 'Dec25', answer: 'merge()' },
    { q: 'Why handle missing data?', paper: 'Dec25', answer: 'Prevents model bias and errors' },
    { q: 'After acquiring data, what\'s next?', paper: 'Jul24', answer: 'Data cleaning' },
  ],
  'Data Preprocessing & Transformation': [
    { q: 'Group data into bins?', paper: 'May25', answer: 'Binning' },
    { q: 'Binning purpose?', paper: 'Jul24', answer: 'Split into categories/groups' },
    { q: 'Raw data to clean dataset called?', paper: 'May25', answer: 'Data Transformation' },
    { q: 'Data transformation involves?', paper: 'Jul24', answer: 'Converting text data into numeric format' },
    { q: 'Standardization refers to?', paper: 'May25', answer: 'Scaling to mean 0 and variance 1' },
    { q: 'Standardization aims to?', paper: 'Jul24', answer: 'Make data distribution more uniform' },
    { q: 'Outlier approach?', paper: 'Jul24', answer: 'Detecting and removing them' },
    { q: 'Detect outliers using?', paper: 'Dec25', answer: 'boxplot()' },
    { q: 'Detect outliers method?', paper: 'Jul25', answer: 'Interquartile Range (IQR)' },
    { q: 'Categorical strings before ML?', paper: 'Dec25', answer: 'One-hot encoding' },
    { q: 'Summarizing technique in stats?', paper: 'Jul24', answer: 'Aggregation' },
  ],
  'Visualization — Matplotlib & Seaborn': [
    { q: 'Plotting library in Python?', paper: 'May25', answer: 'Matplotlib' },
    { q: 'Most common viz library?', paper: 'Jul25', answer: 'Matplotlib' },
    { q: 'Box plot visualizes?', paper: 'May25', answer: 'Distribution and outliers' },
    { q: 'Box plot purpose?', paper: 'Jul25', answer: 'Display spread and detect outliers' },
    { q: 'Boxplot primarily used to?', paper: 'Dec25', answer: 'Show distribution and detect outliers' },
    { q: 'plt.boxplot() orientation param?', paper: 'Jul24', answer: 'vert (NOT Vertical, NOT Orientation)' },
    { q: 'plt.scatter() size parameter?', paper: 'Jul24', answer: 's (NOT sizes, NOT marker_size)' },
    { q: 'Save plot to file?', paper: 'Jul24', answer: 'plt.savefig()' },
    { q: 'Save plot to file?', paper: 'Dec25', answer: 'plt.savefig()' },
    { q: 'subplots() use?', paper: 'May25', answer: 'Multiple plots in one figure' },
    { q: 'Annotate text in Matplotlib?', paper: 'May25', answer: 'annotate()' },
    { q: 'Frequency distribution plot?', paper: 'May25', answer: 'Histogram' },
    { q: 'Distribution of numerical variable?', paper: 'Jul25', answer: 'Histogram' },
    { q: 'Histogram bins too wide — fix?', paper: 'Dec25', answer: 'bins parameter' },
    { q: 'Seaborn heatmap function?', paper: 'Jul24', answer: 'seaborn.heatmap() — NOT plot_heatmap' },
    { q: 'Seaborn for pairwise relationships?', paper: 'May25', answer: 'pairplot()' },
    { q: 'pairplot() comes from?', paper: 'Dec25', answer: 'Seaborn' },
    { q: 'Best viz library?', paper: 'Jul24', answer: 'Seaborn' },
  ],
  'Large Data, Web Scraping & APIs': [
    { q: 'Main challenge of large datasets?', paper: 'Jul25', answer: 'High computational cost and memory usage' },
    { q: 'Online learning handles large data by?', paper: 'Jul24', answer: 'Processing one observation at a time' },
    { q: 'Advantage of online learning?', paper: 'Jul24', answer: 'Trained without loading all data into memory' },
    { q: 'Web scraping purpose?', paper: 'Jul25', answer: 'Extract structured data from web pages automatically' },
    { q: 'Library for web scraping?', paper: 'Jul25', answer: 'BeautifulSoup' },
    { q: 'NOT used for data acquisition?', paper: 'May25', answer: 'Image rendering' },
  ],
  'Machine Learning (NEW — Dec 2025)': [
    { q: 'Supervised learning algorithm?', paper: 'Dec25', answer: 'Linear Regression' },
    { q: 'Purpose of train/test split?', paper: 'Dec25', answer: 'Evaluate model on unseen data' },
    { q: 'Categorical dependent variable?', paper: 'Dec25', answer: 'Logistic Regression' },
    { q: 'High train, low test accuracy?', paper: 'Dec25', answer: 'Overfitting' },
    { q: 'Clustering algorithm?', paper: 'Dec25', answer: 'K-means' },
    { q: 'Primary goal of unsupervised learning?', paper: 'Dec25', answer: 'Find hidden patterns in data' },
    { q: 'Dimensionality reduction method?', paper: 'Dec25', answer: 'PCA' },
    { q: 'Wrong cluster assignment cause?', paper: 'Dec25', answer: 'Poor choice of number of clusters' },
  ],
};

const PART_B_THEMES = [
  {
    theme: 1,
    name: 'Data Science Process & NumPy/Pandas Foundations',
    questions: [
      { paper: 'May25', qNo: 'Q21', question: 'Key steps involved in Data Science Process with neat sketch' },
      { paper: 'Jul25', qNo: 'Q21', question: 'NumPy: write code to calculate mean, max, min + sort temperatures array' },
      { paper: 'Dec25', qNo: 'Q21', question: 'NumPy + Pandas for retail store data — array creation, indexing, slicing, joining, aggregation' },
    ],
  },
  {
    theme: 2,
    name: 'Large Data Handling',
    questions: [
      { paper: 'May25', qNo: 'Q22', question: 'Techniques to handle large datasets + challenges faced during data wrangling' },
      { paper: 'Jul25', qNo: 'Q27a', question: 'Challenges with large datasets — provide 3 general techniques (5 marks)' },
      { paper: 'Jul25', qNo: 'Q27b', question: 'Data wrangling operations: merge on index, concatenate datasets, reshape using pivot (5 marks)' },
      { paper: 'Jul25', qNo: 'Q27c', question: 'Fill missing Salary with median per dept; remove Age outliers using IQR method (5 marks)' },
    ],
  },
  {
    theme: 3,
    name: 'Data Cleaning & Wrangling (HIGHEST FREQUENCY)',
    highlight: 'This theme dominates Part B AND Part C across all papers. Master this theme completely.',
    questions: [
      { paper: 'May25', qNo: 'Q23', question: 'Python code: clean + transform using dropna(), fillna(), replace()' },
      { paper: 'May25', qNo: 'Q26', question: 'Handle missing data + common techniques to deal with missing values' },
      { paper: 'Jul25', qNo: 'Q24', question: 'Step-by-step: identify duplicate records + missing values + standardization importance' },
      { paper: 'Dec25', qNo: 'Q22', question: 'Healthcare data: missing values, inconsistent categories, extreme outliers — full wrangling plan' },
      { paper: 'Dec25', qNo: 'Q27', question: 'COVID-19 data: load DataFrame, handle missing, standardize city names, remove age outliers' },
      { paper: 'Dec25', qNo: 'Q26', question: 'Social media text pipeline: cleaning, tokenization, stopword removal, normalization' },
    ],
  },
  {
    theme: 4,
    name: 'Visualization',
    questions: [
      { paper: 'May25', qNo: 'Q24', question: 'Explain line plots, scatter plots, box plots, and histograms used in data visualization' },
      { paper: 'May25', qNo: 'Q25', question: 'Types of visualizations + Matplotlib/Seaborn customization — 3 key techniques' },
      { paper: 'Jul25', qNo: 'Q23', question: 'Scatter plot for house price vs size data + Seaborn regression line' },
      { paper: 'Jul25', qNo: 'Q25', question: 'Types of visualizations + Matplotlib/Seaborn customization' },
      { paper: 'Jul25', qNo: 'Q26', question: 'Seaborn: scatter (Marketing Spend vs Sales Revenue) + regression line' },
      { paper: 'Jul24', qNo: 'Q25', question: 'Formatting: ticks, labels, legends in Matplotlib with examples' },
      { paper: 'Jul24', qNo: 'Q26', question: '3D surface plot using Python and Matplotlib — full code' },
      { paper: 'Dec25', qNo: 'Q23', question: 'Financial data: line, bar, histogram, boxplot, pairplot — when and why to use each' },
    ],
  },
  {
    theme: 5,
    name: 'Merging & Concatenating',
    questions: [
      { paper: 'May25', qNo: 'Q25', question: 'Steps in merging and concatenating datasets using Pandas' },
      { paper: 'Jul25', qNo: 'Q27b', question: 'Merge on index + concatenate + reshape via pivot — with examples' },
      { paper: 'Jul24', qNo: 'Q23', question: 'Merging on index labels — implications and use cases' },
    ],
  },
  {
    theme: 6,
    name: 'Web Scraping & APIs',
    questions: [
      { paper: 'Jul25', qNo: 'Q22a', question: 'What is Web Scraping? Applications and ethical concerns (5 marks)' },
      { paper: 'Jul25', qNo: 'Q22b', question: 'Compare Web APIs and Open Data Sources as data acquisition methods (5 marks)' },
      { paper: 'Jul24', qNo: 'Q24', question: 'Web APIs: explain + provide Python code snippet to retrieve data' },
    ],
  },
  {
    theme: 7,
    name: 'Machine Learning (NEW — Dec 2025)',
    highlight: 'Only appeared in Dec 2025. Prepare if your exam may follow this pattern.',
    questions: [
      { paper: 'Dec25', qNo: 'Q24', question: 'E-commerce: supervised learning — Logistic Regression/Decision Trees, train/test split, accuracy/precision/recall/F1' },
      { paper: 'Dec25', qNo: 'Q25', question: 'Telecom: K-means clustering — preprocessing, number of clusters, silhouette score' },
      { paper: 'Dec25', qNo: 'Q28', question: 'Insurance: Logistic Regression vs Decision Tree — encode + normalize + train + evaluate' },
    ],
  },
];

const PART_C_DATA = [
  { paper: 'July 2024', q27: 'Data Science lifecycle for e-commerce company — data-driven insights', q28: '(i) Data wrangling techniques with Python  (ii) String manipulation with examples' },
  { paper: 'May 2025', q27: '3D surface plot using Matplotlib — full Python program with visualization techniques', q28: 'Data cleaning and wrangling techniques on a sample dataset using Pandas' },
  { paper: 'July 2025', q27: 'Large data challenges (5m) + wrangling: merge on index / concat / pivot (5m) + missing/outlier code IQR (5m)', q28: 'E-commerce sales: explain plots (5m) + Matplotlib 4 subplots (5m) + Matplotlib/Seaborn customization (5m)' },
  { paper: 'Dec 2025', q27: 'COVID-19 data: identify quality issues (5m) + full wrangling Python code (10m)', q28: 'Insurance: Logistic Regression vs Decision Tree (5m) + full ML Python code (10m)' },
];

const PATTERN_ANALYSIS = {
  mcqFrequency: [
    { topic: 'Pandas (Series, DataFrame, functions)', papers: 4, priority: 'MUST KNOW' },
    { topic: 'Visualization (Matplotlib + Seaborn)', papers: 4, priority: 'MUST KNOW' },
    { topic: 'Data Preprocessing (binning, std, outlier)', papers: 4, priority: 'MUST KNOW' },
    { topic: 'NumPy (eye, array, concatenate)', papers: 4, priority: 'MUST KNOW' },
    { topic: 'Missing data + Merging', papers: 4, priority: 'HIGH' },
    { topic: 'Large data + Online learning', papers: 3, priority: 'HIGH' },
    { topic: 'Web scraping + APIs', papers: 2, priority: 'MEDIUM' },
    { topic: 'ML (supervised, unsupervised, K-means)', papers: 1, priority: 'NEW — WATCH' },
  ],
  partBFrequency: [
    { theme: 'Data Wrangling / Cleaning', frequency: '4/4 papers', safe: true },
    { theme: 'Visualization', frequency: '4/4 papers', safe: true },
    { theme: 'Large Data Handling', frequency: '3/4 papers', safe: true },
    { theme: 'Merging / Concatenating', frequency: '3/4 papers', safe: true },
    { theme: 'NumPy + Pandas foundations', frequency: '2/4 papers', safe: true },
    { theme: 'Web Scraping + APIs', frequency: '2/4 papers', safe: false },
    { theme: 'Machine Learning', frequency: '1/4 papers', safe: false },
  ],
};

const RECOMMENDED_PART_B = [
  { q: 'Large data challenges + 3 techniques', reason: 'Appeared in 3/4 papers. Easy 10 marks with 5 bullet points', questions: 'Q22 / Q27a' },
  { q: 'Merging on index + concatenate + pivot', reason: 'Appears every paper. Code is short and reusable', questions: 'Q25 / Q27b' },
  { q: 'Missing data + outlier handling (IQR)', reason: 'Core of every wrangling question. 3-4 functions = 10 marks', questions: 'Q23 / Q26' },
  { q: 'Visualization: line/scatter/box/histogram + customization', reason: '4/4 papers have this. Know what each chart is for', questions: 'Q24 / Q25' },
];

const WRANGLING_TEMPLATE = `import pandas as pd
df = pd.read_csv('data.csv')
df.isnull().sum()                     # find missing
df.fillna(df.mean(), inplace=True)    # fill numeric
df.dropna(inplace=True)               # drop remaining
df.drop_duplicates(inplace=True)      # remove duplicates
df['col'] = df['col'].astype(float)   # fix dtype
Q1 = df['col'].quantile(0.25)         # IQR outlier removal
Q3 = df['col'].quantile(0.75)
IQR = Q3 - Q1
df = df[(df['col'] >= Q1-1.5*IQR) & (df['col'] <= Q3+1.5*IQR)]
merged = pd.merge(df1, df2, on='id', how='inner')   # merge
df['name'].str.lower().str.strip()    # string cleaning`;

const SURFACE_PLOT_TEMPLATE = `from mpl_toolkits.mplot3d import Axes3D
import matplotlib.pyplot as plt
import numpy as np
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
X, Y = np.meshgrid(np.linspace(-5,5,50), np.linspace(-5,5,50))
Z = np.sin(np.sqrt(X**2 + Y**2))
ax.plot_surface(X, Y, Z, cmap='viridis')
plt.show()`;

function SectionTitle({ label, title, desc }: { label: string; title: string; desc?: string }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
        textTransform: 'uppercase', color: '#2997ff',
        marginBottom: '12px',
      }}>
        <Star size={11} strokeWidth={2} />
        {label}
      </div>
      <h2 style={{
        fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 600, color: '#ffffff',
        letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 10px',
      }}>
        {title}
      </h2>
      {desc && <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.55 }}>{desc}</p>}
    </div>
  );
}

export function PYQMasterSheet({ onBack }: Props) {
  const [openMCQTopic, setOpenMCQTopic] = useState<string | null>('Pandas');
  const [openTheme, setOpenTheme] = useState<number | null>(3);
  const [showTemplate, setShowTemplate] = useState<string | null>(null);

  const toggleMCQTopic = (topic: string) => setOpenMCQTopic(openMCQTopic === topic ? null : topic);
  const toggleTheme = (theme: number) => setOpenTheme(openTheme === theme ? null : theme);
  const toggleTemplate = (t: string) => setShowTemplate(showTemplate === t ? null : t);

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>

      {/* Sticky top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'saturate(180%) blur(20px)',
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
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={13} strokeWidth={1.5} />
          Back
        </button>
        <div style={{ height: '16px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>Data Science</span>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>21CSS303T</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => window.open('/DataScience_BeautifulGuide.pdf', '_blank')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '6px 14px', borderRadius: '9999px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '12px', fontWeight: 400, cursor: 'pointer',
            }}
          >
            <BookOpen size={12} strokeWidth={1.5} />
            Prep Guide
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 64px)' }}>

        {/* ── PAGE HEADER ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '64px' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: '#2997ff', marginBottom: '14px',
          }}>
            <FileText size={12} strokeWidth={2} />
            21CSS303T · SRM Institute · Sixth Semester
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 600, color: '#ffffff',
            letterSpacing: '-0.04em', lineHeight: 1.08, margin: '0 0 14px',
          }}>
            PYQ Master Sheet
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0, letterSpacing: '-0.02em' }}>
            All Questions · All Answers · Cross-Paper Analysis
          </p>

          {/* Stats bar */}
          <div style={{
            display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap',
          }}>
            {[
              { n: '4', l: 'Papers', c: '#2997ff' },
              { n: '80', l: 'MCQs', c: '#bf5af2' },
              { n: '28', l: 'Part B Qs', c: '#30d158' },
              { n: '8', l: 'Part C Qs', c: '#ff9f0a' },
            ].map(({ n, l, c }) => (
              <div key={l} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: '#1c1c1e', borderRadius: '12px', padding: '12px 18px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 600, color: c, letterSpacing: '-0.03em' }}>{n}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>{l}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── PAPERS ANALYSED TABLE ───────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle
            label="Evidence Base"
            title="Papers Analysed"
            desc="Every prediction in this guide is grounded in these 4 past papers."
          />
          <div style={{ background: '#1c1c1e', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['Code', 'Exam', 'Part A', 'Part B', 'Notable Feature'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '11px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PAPER_SUMMARY.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    style={{ borderBottom: i < PAPER_SUMMARY.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                  >
                    <td style={{ padding: '16px 20px', fontFamily: 'JetBrains Mono, monospace', color: '#2997ff', fontSize: '12px', fontWeight: 600 }}>{row.code}</td>
                    <td style={{ padding: '16px 20px', color: '#ffffff', fontWeight: 500 }}>{row.exam}</td>
                    <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.65)', fontSize: '12px' }}>{row.partA}</td>
                    <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.65)', fontSize: '12px' }}>{row.partB}</td>
                    <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.5)', fontSize: '12px', maxWidth: '320px' }}>{row.notable}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Critical note */}
          <div style={{
            marginTop: '20px',
            background: 'rgba(239,68,68,0.08)', borderRadius: '12px', padding: '18px 22px',
            border: '1px solid rgba(239,68,68,0.2)', display: 'flex', gap: '12px', alignItems: 'flex-start',
          }}>
            <Star size={16} strokeWidth={1.5} style={{ color: '#ef4444', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                CRITICAL: Dec 2025 added 8 ML MCQs (Q13-20) + 3 ML Part B questions + ML-based Part C
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>
                If your upcoming exam follows this pattern, you must know supervised/unsupervised basics.
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── PART A MCQ MASTER LIST ────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle
            label="Part A · 20 × 1 = 20 marks"
            title="MCQ Master List — All 4 Papers"
            desc="All Part A questions from all papers, grouped by topic. Master these and you know what's coming."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(MCQ_TOPICS).map(([topic, questions]) => {
              const isOpen = openMCQTopic === topic;
              const isNew = topic.includes('Machine Learning');
              return (
                <motion.div
                  key={topic}
                  layout
                  style={{
                    background: '#1c1c1e', borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.07)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => toggleMCQTopic(topic)}
                    style={{
                      width: '100%', padding: '16px 20px', display: 'flex',
                      alignItems: 'center', gap: '12px', background: 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{topic}</span>
                      {isNew && (
                        <span style={{
                          fontSize: '10px', fontWeight: 600, color: '#f59e0b',
                          background: 'rgba(245,158,11,0.15)', padding: '2px 8px', borderRadius: '100px',
                          border: '1px solid rgba(245,158,11,0.3)',
                        }}>NEW</span>
                      )}
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: '100px' }}>
                        {questions.length} Qs
                      </span>
                    </div>
                    {isOpen ? <ChevronUp size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} /> : <ChevronDown size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 20px 16px', overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', minWidth: '480px' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <th style={{ padding: '10px 8px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Q</th>
                                <th style={{ padding: '10px 8px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Paper</th>
                                <th style={{ padding: '10px 8px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Question</th>
                                <th style={{ padding: '10px 8px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Answer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {questions.map((q, qi) => (
                                <tr key={qi} style={{ borderBottom: qi < questions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                                  <td style={{ padding: '10px 8px', color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>{qi + 1}</td>
                                  <td style={{ padding: '10px 8px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#2997ff', background: 'rgba(41,151,255,0.12)', padding: '2px 6px', borderRadius: '100px' }}>{q.paper}</span>
                                  </td>
                                  <td style={{ padding: '10px 8px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{q.q}</td>
                                  <td style={{ padding: '10px 8px', fontFamily: 'JetBrains Mono, monospace', color: '#30d158', fontSize: '11px', fontWeight: 500 }}>{q.answer}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── PART B THEMES ────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle
            label="Part B · 4 × 10 = 40 marks"
            title="All Questions Grouped by Theme"
            desc="Answer any 4 of 6. These are the themes that actually appear."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PART_B_THEMES.map((theme) => {
              const isOpen = openTheme === theme.theme;
              return (
                <motion.div
                  key={theme.theme}
                  layout
                  style={{
                    background: '#1c1c1e', borderRadius: '14px',
                    border: `1px solid ${theme.highlight ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.07)'}`,
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => toggleTheme(theme.theme)}
                    style={{
                      width: '100%', padding: '16px 20px', display: 'flex',
                      alignItems: 'center', gap: '12px', background: 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px',
                      background: 'rgba(41,151,255,0.12)', border: '1px solid rgba(41,151,255,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 600, color: '#2997ff', flexShrink: 0,
                    }}>{theme.theme}</div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', flex: 1 }}>{theme.name}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '100px' }}>
                      {theme.questions.length} Qs
                    </span>
                    {isOpen ? <ChevronUp size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} /> : <ChevronDown size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />}
                  </button>

                  {theme.highlight && (
                    <div style={{ padding: '0 20px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{
                        fontSize: '12px', color: '#ff9f0a', background: 'rgba(255,159,10,0.1)',
                        borderRadius: '8px', padding: '8px 12px', border: '1px solid rgba(255,159,10,0.2)',
                        marginTop: '10px',
                      }}>
                        {theme.highlight}
                      </div>
                    </div>
                  )}

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 20px 16px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          {theme.questions.map((q, qi) => (
                            <div key={qi} style={{
                              display: 'flex', gap: '12px', alignItems: 'flex-start',
                              background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '12px 14px',
                            }}>
                              <span style={{ fontSize: '10px', fontWeight: 600, color: '#2997ff', background: 'rgba(41,151,255,0.1)', padding: '2px 8px', borderRadius: '100px', flexShrink: 0, marginTop: '1px' }}>{q.paper}</span>
                              <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>{q.qNo}</span>
                              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{q.question}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── PART C QUESTIONS ─────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle
            label="Part C · 1 × 15 = 15 marks"
            title="All Questions — 15 Marks Each"
            desc="Q27 = Data Wrangling in ALL 4 papers. This is your guaranteed 15 marks."
          />

          <div style={{ background: '#1c1c1e', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Paper</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#ef4444', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Q27 (Wrangling)</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#bf5af2', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Q28 (Alternative)</th>
                </tr>
              </thead>
              <tbody>
                {PART_C_DATA.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    style={{ borderBottom: i < PART_C_DATA.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                  >
                    <td style={{ padding: '18px 20px', fontWeight: 600, color: '#2997ff', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>{row.paper}</td>
                    <td style={{ padding: '18px 20px', color: 'rgba(255,255,255,0.75)', fontSize: '13px', lineHeight: 1.5 }}>{row.q27}</td>
                    <td style={{ padding: '18px 20px', color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1.5 }}>{row.q28}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{
            marginTop: '20px',
            background: 'rgba(48,209,88,0.08)', borderRadius: '12px', padding: '16px 20px',
            border: '1px solid rgba(48,209,88,0.2)', display: 'flex', gap: '10px', alignItems: 'flex-start',
          }}>
            <Target size={15} strokeWidth={1.5} style={{ color: '#30d158', marginTop: '2px', flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.55 }}>
              DATA WRANGLING appears in Part C of ALL 4 papers in some form. This is your guaranteed 15 marks.
            </div>
          </div>
        </motion.section>

        {/* ── PATTERN ANALYSIS & EXAM STRATEGY ─────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle
            label="Strategy"
            title="Pattern Analysis & Exam Strategy"
            desc="Know what's coming so you can study the right things."
          />

          {/* MCQ Frequency */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '14px', letterSpacing: '-0.01em' }}>MCQ Topic Frequency</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PATTERN_ANALYSIS.mcqFrequency.map((row, i) => {
                const priorityColor = row.priority.includes('MUST') ? '#ef4444' : row.priority.includes('HIGH') ? '#f59e0b' : row.priority.includes('NEW') ? '#bf5af2' : '#6b7280';
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    background: '#1c1c1e', borderRadius: '10px', padding: '12px 16px',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#ffffff', marginBottom: '2px' }}>{row.topic}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{row.papers}/4 papers</div>
                    </div>
                    <span style={{
                      fontSize: '10px', fontWeight: 600, color: priorityColor,
                      background: `${priorityColor}18`, padding: '3px 8px', borderRadius: '100px',
                      border: `1px solid ${priorityColor}30`,
                    }}>{row.priority}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Part B Frequency */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '14px', letterSpacing: '-0.01em' }}>Part B Frequency by Theme</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PATTERN_ANALYSIS.partBFrequency.map((row, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  background: '#1c1c1e', borderRadius: '10px', padding: '12px 16px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: row.safe ? '#30d158' : '#ff9f0a', minWidth: '80px' }}>
                    {row.safe ? 'Safe' : 'Risky'}
                  </span>
                  <span style={{ fontSize: '13px', color: '#ffffff', flex: 1 }}>{row.theme}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontFamily: 'JetBrains Mono, monospace' }}>{row.frequency}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended 4 Part B */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '14px', letterSpacing: '-0.01em' }}>Recommended 4 Part B Questions to Prepare</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {RECOMMENDED_PART_B.map((r, i) => (
                <div key={i} style={{
                  background: '#1c1c1e', borderRadius: '12px', padding: '16px 20px',
                  border: '1px solid rgba(41,151,255,0.15)',
                  display: 'flex', gap: '14px', alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: 'rgba(41,151,255,0.15)', border: '1px solid rgba(41,151,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 600, color: '#2997ff', flexShrink: 0,
                  }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>{r.q}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{r.reason}</div>
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#2997ff', fontFamily: 'JetBrains Mono, monospace' }}>{r.questions}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── QUICK ANSWER TEMPLATES ────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle
            label="Code Arsenal"
            title="Quick Answer Templates"
            desc="Copy-paste ready code patterns for the most common Part B and C questions."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Wrangling template */}
            <div style={{ background: '#1c1c1e', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <button
                onClick={() => toggleTemplate('wrangling')}
                style={{
                  width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
                  background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <Code2 size={14} strokeWidth={1.5} style={{ color: '#2997ff', flexShrink: 0 }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', flex: 1 }}>Wrangling — Standard Answer Structure</span>
                {showTemplate === 'wrangling' ? <ChevronUp size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} /> : <ChevronDown size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />}
              </button>
              <AnimatePresence initial={false}>
                {showTemplate === 'wrangling' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 20px 16px' }}>
                      <div style={{ background: '#000', borderRadius: '10px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'auto' }}>
                        <pre style={{ margin: 0, fontSize: '11px', lineHeight: 1.65, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{WRANGLING_TEMPLATE}</pre>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3D Surface plot */}
            <div style={{ background: '#1c1c1e', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <button
                onClick={() => toggleTemplate('surface')}
                style={{
                  width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
                  background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <Code2 size={14} strokeWidth={1.5} style={{ color: '#bf5af2', flexShrink: 0 }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', flex: 1 }}>3D Surface Plot Template (May 2025 Part C)</span>
                {showTemplate === 'surface' ? <ChevronUp size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} /> : <ChevronDown size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />}
              </button>
              <AnimatePresence initial={false}>
                {showTemplate === 'surface' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 20px 16px' }}>
                      <div style={{ background: '#000', borderRadius: '10px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'auto' }}>
                        <pre style={{ margin: 0, fontSize: '11px', lineHeight: 1.65, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{SURFACE_PLOT_TEMPLATE}</pre>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* ── PART C STRATEGY ────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle
            label="Part C"
            title="Exam Strategy"
            desc="What to pick and why."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              {
                title: 'Safest (all papers)',
                desc: 'Data wrangling + cleaning: define wrangling → missing values → merge → string manipulation → transform → groupby. Always appears.',
                color: '#ef4444',
                icon: <Target size={16} strokeWidth={1.5} />,
              },
              {
                title: 'If viz question appears',
                desc: 'Choose it ONLY if you can write code for: 4 subplots + scatter + histogram + boxplot + plt.tight_layout() + customization.',
                color: '#f59e0b',
                icon: <TrendingUp size={16} strokeWidth={1.5} />,
              },
              {
                title: 'If ML question appears',
                desc: 'Choose ONLY if you know: train_test_split + fit() + predict() + accuracy_score() + confusion_matrix().',
                color: '#bf5af2',
                icon: <Zap size={16} strokeWidth={1.5} />,
              },
            ].map((s, i) => (
              <div key={i} style={{
                background: '#1c1c1e', borderRadius: '14px', padding: '20px',
                border: `1px solid ${s.color}20`,
                display: 'flex', flexDirection: 'column', gap: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: s.color }}>{s.icon}</div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{s.title}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.55 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Footer tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: 'center', padding: '32px 0 16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: 0, letterSpacing: '-0.01em' }}>
            Aswath AS · SRM Institute · "I got bored studying. So I analysed all 4 previous year papers."
          </p>
        </motion.div>
      </div>
    </div>
  );
}