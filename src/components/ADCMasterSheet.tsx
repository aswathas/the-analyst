// ADC Master Sheet — 21ECC302T Analog and Digital Communication
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  ChevronDown,
  ChevronUp,
  FileText,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  ADC_PART_A,
  ADC_PART_B,
  ADC_PART_C,
  ADCPartA,
  ADCPartB,
  ADCPartC,
} from '../data/adcMasterSheet';

// ─── Types ───────────────────────────────────────────────────────────────────
type UnitFilter = 'All' | 1 | 2 | 3 | 4 | 5;

interface UnitMeta {
  unit: number;
  title: string;
  priority: 'MUST' | 'IMPORTANT' | 'SAFE';
  topics: string;
  color: string;
  bg: string;
  border: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const UNITS: UnitMeta[] = [
  { unit: 1, title: 'Analog Modulation', priority: 'MUST', topics: 'AM · DSB-SC · SSB', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)' },
  { unit: 2, title: 'Angle Modulation', priority: 'IMPORTANT', topics: 'FM · PM · Pre-emphasis', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)' },
  { unit: 3, title: 'Pulse Modulation', priority: 'MUST', topics: 'Sampling · PAM · PWM · PPM', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)' },
  { unit: 4, title: 'Digital Modulation', priority: 'IMPORTANT', topics: 'ASK · FSK · PSK · QAM', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)' },
  { unit: 5, title: 'Noise & Receivers', priority: 'SAFE', topics: 'Thermal Noise · SNR · NF', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.3)' },
];

const PART_A_TOPICS = ['AM', 'FM', 'Sampling', 'Digital Mod', 'Noise'] as const;

const PART_A_TOPIC_UNITS: Record<string, number[]> = {
  AM: [1],
  FM: [2],
  Sampling: [3],
  'Digital Mod': [4],
  Noise: [5],
};

const RANK_COLORS: Record<string, string> = {
  'Highly Probable': '#ef4444',
  'Very Likely': '#f59e0b',
  'Possible': '#22c55e',
};

// ─── Animation Variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
};

const accordion = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1, transition: { duration: 0.35, ease: 'easeInOut' } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.25, ease: 'easeInOut' } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function AccordionItem({
  title,
  subtitle,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <Icon size={16} className="text-[#2997ff] shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white/90 truncate">{title}</div>
          {subtitle && <div className="text-xs text-white/40 mt-0.5 truncate">{subtitle}</div>}
        </div>
        {open ? (
          <ChevronUp size={15} className="text-white/40 shrink-0" />
        ) : (
          <ChevronDown size={15} className="text-white/40 shrink-0" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            variants={accordion}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-white/5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PartAMcqRow({ q, index }: { q: ADCPartA; index: number }) {
  const letters = ['A', 'B', 'C', 'D'];
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
      <td className="py-3 px-3 text-xs text-[#2997ff] font-mono font-bold w-8 text-center">{index}</td>
      <td className="py-3 px-3 text-xs text-white/40 font-mono w-24">{q.paper}</td>
      <td className="py-3 px-3 text-sm text-white/80">{q.question}</td>
      <td className="py-3 px-3">
        <div className="flex flex-col gap-0.5">
          {q.options.map((opt, i) => (
            <span
              key={i}
              className={`text-xs font-mono ${
                i === q.correctAnswer ? 'text-emerald-400 font-bold' : 'text-white/40'
              }`}
            >
              {letters[i]}. {opt}
            </span>
          ))}
        </div>
      </td>
      <td className="py-3 px-3 w-10 text-center">
        <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
          {letters[q.correctAnswer]}
        </span>
      </td>
    </tr>
  );
}

function PartAQTable({ questions }: { questions: ADCPartA[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-2 px-3 text-xs font-mono text-white/30 font-bold w-8 text-center">#</th>
            <th className="py-2 px-3 text-xs font-mono text-white/30 font-bold w-24">PAPER</th>
            <th className="py-2 px-3 text-xs font-mono text-white/30 font-bold">QUESTION</th>
            <th className="py-2 px-3 text-xs font-mono text-white/30 font-bold w-40">OPTIONS</th>
            <th className="py-2 px-3 text-xs font-mono text-white/30 font-bold w-10 text-center">ANS</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, i) => (
            <PartAMcqRow key={q.id} q={q} index={i + 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExplanationBox({ questions }: { questions: ADCPartA[] }) {
  return (
    <div className="mt-4 space-y-2">
      <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Explanations</div>
      {questions.map((q, i) => (
        <div key={q.id} className="bg-[#2997ff]/8 border border-[#2997ff]/20 rounded p-3">
          <div className="text-xs text-[#2997ff] font-semibold mb-1">Q{i + 1}: {q.question}</div>
          <div className="text-xs text-white/60 leading-relaxed">{q.explanation}</div>
        </div>
      ))}
    </div>
  );
}

function PartBAccordion({ q }: { q: ADCPartB }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/[0.02]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="shrink-0">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#2997ff]/20 text-[#2997ff] text-xs font-bold font-mono">
            B
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white/80 leading-snug line-clamp-2">{q.question}</div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs font-mono text-white/30">{q.papers.join(' · ')}</span>
            <span className="text-xs bg-white/10 text-white/50 px-1.5 py-0.5 rounded font-mono">{q.mark} MARKS</span>
          </div>
        </div>
        {open ? (
          <ChevronUp size={15} className="text-white/40 shrink-0 ml-2" />
        ) : (
          <ChevronDown size={15} className="text-white/40 shrink-0 ml-2" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            variants={accordion}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-white/5 space-y-4">
              <div className="bg-white/[0.04] border border-white/10 rounded p-3 mt-3">
                <div className="text-xs font-bold text-[#2997ff] uppercase tracking-widest mb-2">Model Answer</div>
                <pre className="text-xs text-white/70 whitespace-pre-wrap leading-relaxed font-mono">{q.modelAnswer}</pre>
              </div>
              <div>
                <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Key Points</div>
                <ul className="space-y-1.5">
                  {q.keyPoints.map((kp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="text-[#2997ff] mt-0.5 shrink-0">→</span>
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PartCAccordion({ q, index }: { q: ADCPartC; index: number }) {
  const [open, setOpen] = useState(false);
  const rankColor = RANK_COLORS[q.rank] || '#888';
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/[0.02]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="shrink-0">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/10 text-white/60 text-xs font-bold font-mono">
            C{index + 1}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white/80 leading-snug line-clamp-2">{q.scenario}</div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded font-mono"
              style={{ color: rankColor, backgroundColor: `${rankColor}18`, border: `1px solid ${rankColor}40` }}
            >
              {q.rank}
            </span>
            <span className="text-xs bg-white/10 text-white/50 px-1.5 py-0.5 rounded font-mono">{q.mark} MARKS</span>
            {q.topics.map((t) => (
              <span key={t} className="text-xs bg-white/8 text-white/40 px-1.5 py-0.5 rounded font-mono">{t}</span>
            ))}
          </div>
        </div>
        {open ? (
          <ChevronUp size={15} className="text-white/40 shrink-0 ml-2" />
        ) : (
          <ChevronDown size={15} className="text-white/40 shrink-0 ml-2" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            variants={accordion}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-white/5 space-y-4">
              <div className="bg-white/[0.04] border border-white/10 rounded p-3 mt-3">
                <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Evidence</div>
                <p className="text-xs text-white/50 leading-relaxed">{q.evidence}</p>
              </div>
              <div className="bg-white/[0.04] border border-white/10 rounded p-3">
                <div className="text-xs font-bold text-[#2997ff] uppercase tracking-widest mb-2">Step-by-Step Solution</div>
                <pre className="text-xs text-white/70 whitespace-pre-wrap leading-relaxed font-mono">{q.modelAnswer}</pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ADCMasterSheet() {
  const [unitFilter, setUnitFilter] = useState<UnitFilter>('All');
  const [partAOpenTopic, setPartAOpenTopic] = useState<string | null>(null);

  const filteredPartA = (qs: ADCPartA[]) =>
    unitFilter === 'All' ? qs : qs.filter((q) => q.unit === unitFilter);

  const filteredPartB = unitFilter === 'All'
    ? ADC_PART_B
    : ADC_PART_B.filter((q) => q.unit === unitFilter);

  const filteredPartC = unitFilter === 'All'
    ? ADC_PART_C
    : ADC_PART_C.filter((q) => q.unit === unitFilter);

  const totalPapers = 3;
  const totalMcqs = ADC_PART_A.length;
  const totalPartB = ADC_PART_B.length;
  const totalPartC = ADC_PART_C.length;
  const totalMarks = 75;
  const targetScore = 65;

  // Build Part A sections grouped by topic, respecting unit filter
  const partASections = (PART_A_TOPICS as readonly string[]).map((topic) => {
    const unitsForTopic = PART_A_TOPIC_UNITS[topic] ?? [];
    let questions = ADC_PART_A.filter((q) => unitsForTopic.includes(q.unit));
    if (unitFilter !== 'All') {
      questions = questions.filter((q) => q.unit === unitFilter);
    }
    return { topic, questions };
  }).filter((s) => s.questions.length > 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* ── Sticky Header ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/8">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex-1" />
          <span className="font-mono text-xs font-bold tracking-widest text-[#2997ff] bg-[#2997ff]/12 border border-[#2997ff]/25 px-2.5 py-1 rounded">
            21ECC302T
          </span>
          <button className="flex items-center gap-1.5 text-xs font-bold bg-white/8 hover:bg-white/14 border border-white/12 text-white/80 hover:text-white px-3 py-1.5 rounded transition-colors">
            <BookOpen size={13} />
            <span className="hidden sm:inline">Prep Guide</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-20 space-y-14">

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <motion.section
          className="pt-10 pb-4 text-center"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={fadeUp} custom={0}>
            <div className="inline-flex items-center gap-2 border border-white/12 bg-white/4 px-3 py-1.5 rounded-full mb-6">
              <FileText size={12} className="text-[#2997ff]" />
              <span className="text-xs font-mono text-white/50 tracking-widest uppercase">Analog and Digital Communication</span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-black text-5xl sm:text-6xl tracking-tight text-white leading-none mb-3"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            ADC Master Sheet
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="font-mono text-xs text-white/40 tracking-widest uppercase mb-8"
          >
            All Questions · All Answers · Cross-Paper Analysis
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-2xl mx-auto"
          >
            {[
              { icon: FileText, label: 'PAPERS', value: `${totalPapers} Papers` },
              { icon: Zap, label: 'PART A', value: `${totalMcqs} MCQs` },
              { icon: FileText, label: 'PART B', value: `${totalPartB} Qs` },
              { icon: Star, label: 'PART C', value: `${totalPartC} Predictions` },
              { icon: Target, label: 'TOTAL', value: `${totalMarks} Marks` },
              { icon: TrendingUp, label: 'TARGET', value: `${targetScore}+ Score` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="border border-white/10 bg-white/[0.03] rounded p-3 text-center">
                <Icon size={14} className="text-[#2997ff] mx-auto mb-1.5" />
                <div className="font-mono text-xs text-white/30 mb-0.5">{label}</div>
                <div className="font-mono text-sm font-bold text-white/90">{value}</div>
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Unit Filter Pills ───────────────────────────────────────── */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.4 } } }}
        >
          <motion.div variants={fadeUp} custom={0} className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setUnitFilter('All')}
              className={`font-mono text-xs font-bold px-4 py-2 rounded border transition-all ${
                unitFilter === 'All'
                  ? 'bg-[#2997ff] border-[#2997ff] text-white'
                  : 'bg-white/5 border-white/12 text-white/50 hover:text-white hover:bg-white/8'
              }`}
            >
              All
            </button>
            {[1, 2, 3, 4, 5].map((u) => (
              <button
                key={u}
                onClick={() => setUnitFilter(u as UnitFilter)}
                className={`font-mono text-xs font-bold px-4 py-2 rounded border transition-all ${
                  unitFilter === u
                    ? 'bg-[#2997ff] border-[#2997ff] text-white'
                    : 'bg-white/5 border-white/12 text-white/50 hover:text-white hover:bg-white/8'
                }`}
              >
                U{u}
              </button>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Unit Priority Cards ──────────────────────────────────────── */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } } }}
        >
          <motion.h2 variants={fadeUp} custom={0} className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4 text-center">
            Unit Priority Map
          </motion.h2>
          <motion.div variants={fadeUp} custom={1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {UNITS.map((u) => (
              <motion.button
                key={u.unit}
                layout
                onClick={() => setUnitFilter(u.unit === unitFilter ? 'All' : (u.unit as UnitFilter))}
                className="text-left rounded-lg p-4 border transition-all hover:scale-[1.02] active:scale-[0.99]"
                style={{
                  backgroundColor: u.bg,
                  borderColor: unitFilter === u.unit ? u.color : u.border,
                  boxShadow: unitFilter === u.unit ? `0 0 20px ${u.color}25` : 'none',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-white/40">UNIT {u.unit}</span>
                  <span
                    className="font-mono text-xs font-bold px-1.5 py-0.5 rounded"
                    style={{ color: u.color, backgroundColor: `${u.color}20`, border: `1px solid ${u.color}40` }}
                  >
                    {u.priority}
                  </span>
                </div>
                <div className="font-bold text-sm text-white/90 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{u.title}</div>
                <div className="font-mono text-xs text-white/35">{u.topics}</div>
              </motion.button>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Part A Master List ──────────────────────────────────────── */}
        {partASections.length > 0 && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.7 } } }}
          >
            <motion.div variants={fadeUp} custom={0}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 bg-[#2997ff] rounded-full" />
                <div>
                  <h2 className="font-black text-xl text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Part A — Multiple Choice
                  </h2>
                  <p className="font-mono text-xs text-white/30 mt-0.5">
                    {filteredPartA(ADC_PART_A).length} Questions · Click topic to expand
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {partASections.map(({ topic, questions }) => {
                  const isOpen = partAOpenTopic === topic;
                  const topicUnit = PART_A_TOPIC_UNITS[topic]?.[0] ?? 0;
                  return (
                    <div key={topic} className="border border-white/10 rounded-lg overflow-hidden bg-white/[0.02]">
                      <button
                        onClick={() => setPartAOpenTopic(isOpen ? null : topic)}
                        className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-white/5 transition-colors"
                      >
                        <div
                          className="flex items-center justify-center w-7 h-7 rounded bg-[#2997ff]/15 text-[#2997ff] text-xs font-bold font-mono shrink-0"
                        >
                          {topicUnit}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-sm text-white/90">{topic}</span>
                          <span className="ml-2 font-mono text-xs text-white/30">{questions.length} Qs</span>
                        </div>
                        {isOpen ? (
                          <ChevronUp size={14} className="text-white/40 shrink-0" />
                        ) : (
                          <ChevronDown size={14} className="text-white/40 shrink-0" />
                        )}
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            variants={accordion}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="overflow-hidden"
                          >
                            <div className="border-t border-white/5">
                              <PartAQTable questions={questions} />
                              <ExplanationBox questions={questions} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.section>
        )}

        {/* ── Part B ──────────────────────────────────────────────────── */}
        {filteredPartB.length > 0 && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.8 } } }}
          >
            <motion.div variants={fadeUp} custom={0}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 bg-emerald-400/60 rounded-full" />
                <div>
                  <h2 className="font-black text-xl text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Part B — Descriptive
                  </h2>
                  <p className="font-mono text-xs text-white/30 mt-0.5">
                    {filteredPartB.length} Questions · {filteredPartB.reduce((s, q) => s + q.mark, 0)} Marks total
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {filteredPartB.map((q) => (
                  <PartBAccordion key={q.id} q={q} />
                ))}
              </div>
            </motion.div>
          </motion.section>
        )}

        {/* ── Part C ──────────────────────────────────────────────────── */}
        {filteredPartC.length > 0 && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } } }}
          >
            <motion.div variants={fadeUp} custom={0}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 bg-amber-400/60 rounded-full" />
                <div>
                  <h2 className="font-black text-xl text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Part C — Numerical Predictions
                  </h2>
                  <p className="font-mono text-xs text-white/30 mt-0.5">
                    {filteredPartC.length} Probable Numericals · Ranked by likelihood
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {filteredPartC.map((q, i) => (
                  <PartCAccordion key={q.id} q={q} index={i} />
                ))}
              </div>
            </motion.div>
          </motion.section>
        )}

        {/* ── Exam Strategy ───────────────────────────────────────────── */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 1.0 } } }}
        >
          <motion.div variants={fadeUp} custom={0}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-purple-400/60 rounded-full" />
              <div>
                <h2 className="font-black text-xl text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Exam Strategy
                </h2>
                <p className="font-mono text-xs text-white/30 mt-0.5">Tactical approach for maximum score</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[
                {
                  part: 'Part A',
                  icon: CheckCircle2,
                  color: '#2997ff',
                  tips: [
                    'Attempt all MCQs — no negative marking',
                    'Use elimination: remove obviously wrong options first',
                    'AM/FM bandwidth formulas — most repeated topic',
                    'BPSK: 1 bit/symbol · QPSK: 2 bits/symbol',
                    'Pn = kTB — noise power formula must know',
                  ],
                },
                {
                  part: 'Part B',
                  icon: FileText,
                  color: '#22c55e',
                  tips: [
                    'Answer with structure: define → derive → conclude',
                    'Draw diagrams wherever applicable',
                    'Include key equations even if derivation is partial',
                    'Time allocation: ~10 min per question',
                  ],
                },
                {
                  part: 'Part C',
                  icon: Target,
                  color: '#f59e0b',
                  tips: [
                    'Highly Probable — solve completely, show all steps',
                    'Write given/find/formula/substitute/answer',
                    'Units matter — always include in final answer',
                    'Partial marks for method shown',
                  ],
                },
              ].map(({ part, icon: Icon, color, tips }) => (
                <div key={part} className="border border-white/10 bg-white/[0.02] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={14} style={{ color }} />
                    <span className="font-bold text-sm text-white/90">{part}</span>
                  </div>
                  <ul className="space-y-2">
                    {tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                        <span style={{ color }}>›</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Score Breakdown Table */}
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th className="py-3 px-4 font-mono text-xs font-bold text-white/40 uppercase tracking-widest">Section</th>
                    <th className="py-3 px-4 font-mono text-xs font-bold text-white/40 uppercase tracking-widest text-center">Questions</th>
                    <th className="py-3 px-4 font-mono text-xs font-bold text-white/40 uppercase tracking-widest text-center">Marks/Q</th>
                    <th className="py-3 px-4 font-mono text-xs font-bold text-white/40 uppercase tracking-widest text-center">Total</th>
                    <th className="py-3 px-4 font-mono text-xs font-bold text-white/40 uppercase tracking-widest text-center">Target</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-sm">
                  {[
                    { section: 'Part A', questions: '20', marks: '1', total: '20', target: '18+' },
                    { section: 'Part B', questions: '5 of 8', marks: '10/15', total: '35', target: '25+' },
                    { section: 'Part C', questions: '2 of 5', marks: '15', total: '30', target: '22+' },
                  ].map(({ section, questions, marks, total, target }) => (
                    <tr key={section} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-4 text-white/80 font-bold">{section}</td>
                      <td className="py-3 px-4 text-white/50 text-center">{questions}</td>
                      <td className="py-3 px-4 text-white/50 text-center">{marks}</td>
                      <td className="py-3 px-4 text-white/50 text-center">{total}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-emerald-400 font-bold">{target}</span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-white/[0.04]">
                    <td className="py-3 px-4 text-white font-bold">TOTAL</td>
                    <td colSpan={3} className="py-3 px-4 text-white/50 text-center">75</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[#2997ff] font-bold">65+</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.section>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <motion.footer
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-center py-8 border-t border-white/8"
        >
          <p className="font-mono text-xs text-white/20">
            ADC Master Sheet · 21ECC302T · Built for exam preparation
          </p>
          <p className="font-mono text-xs text-white/10 mt-1">
            All data sourced from Jan 2026 FN · Jul 2025 FN · May 2025 AN
          </p>
        </motion.footer>
      </main>
    </div>
  );
}
