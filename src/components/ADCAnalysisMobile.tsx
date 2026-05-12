import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp, AlertTriangle, BarChart2, Sheet } from 'lucide-react';
import { ADC_PART_A, ADC_PART_B, ADC_PART_C } from '../data/adcMasterSheet';

interface Props {
  onBack: () => void;
}

type Tab = 'analysis' | 'master';

const UNIT_FILTERS = [
  { label: 'All Units', value: 'all' as const },
  { label: 'Unit 1', value: 1 as const },
  { label: 'Unit 2', value: 2 as const },
  { label: 'Unit 3', value: 3 as const },
  { label: 'Unit 4', value: 4 as const },
  { label: 'Unit 5', value: 5 as const },
];

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

function AnalysisView() {
  const [activeUnit, setActiveUnit] = useState<1 | 2 | 3 | 4 | 5 | 'all'>('all');
  const [expandedC, setExpandedC] = useState<number | null>(null);
  const [expandedB, setExpandedB] = useState<number | null>(null);
  const [expandedA, setExpandedA] = useState<number | null>(null);

  const filteredA = activeUnit === 'all'
    ? ADC_PART_A
    : ADC_PART_A.filter(q => q.unit === activeUnit);

  const filteredB = activeUnit === 'all'
    ? ADC_PART_B
    : ADC_PART_B.filter(q => q.unit === activeUnit);

  const filteredC = activeUnit === 'all'
    ? ADC_PART_C
    : ADC_PART_C.filter(q => q.unit === activeUnit);

  const RANK_COLORS: Record<string, string> = {
    'Highly Probable': '#ef4444',
    'Very Likely': '#f59e0b',
    'Possible': '#3b82f6',
  };

  const TOPIC_COLOR = (topic: string) => {
    const t = topic.toLowerCase();
    if (t.includes('am')) return '#f59e0b';
    if (t.includes('fm') || t.includes('pm')) return '#a78bfa';
    if (t.includes('sampling') || t.includes('pam') || t.includes('pwm') || t.includes('ppm')) return '#34d399';
    if (t.includes('ask') || t.includes('fsk') || t.includes('psk') || t.includes('qam')) return '#60a5fa';
    if (t.includes('noise') || t.includes('snr')) return '#fb923c';
    return '#60a5fa';
  };

  return (
    <div>
      {/* Hero stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '32px' }}
      >
        <div style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.04em', marginBottom: '6px' }}>
          3 Papers. 18 MCQs.
        </div>
        <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, marginBottom: '20px' }}>
          AM/FM, Pulse Modulation, Digital Comm, Noise — all covered.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { n: '3', label: 'Papers Analyzed' },
            { n: '18', label: 'MCQs Mapped' },
            { n: '8', label: 'Part B Topics' },
            { n: '3', label: 'Part C Scenarios' },
          ].map(({ n, label }) => (
            <Card key={label} style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '26px', fontWeight: 600, color: '#2997ff', letterSpacing: '-0.04em' }}>{n}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>{label}</div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Key findings */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '32px' }}
      >
        <SectionLabel text="Key Findings" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { text: 'FM numerical (Carsons rule, deviation ratio) appeared in all 3 papers', color: '#ef4444' },
            { text: 'AM sideband/power calculation is a guaranteed Part A question', color: '#f59e0b' },
            { text: 'Friis formula noise cascade appeared Jan 2026 and May 2025', color: '#34d399' },
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

      {/* Part C — scenarios */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '32px' }}
      >
        <SectionLabel text="Part C — 15 Mark Scenarios" />
        <div style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '16px' }}>
          Highly probable exam problems
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredC.map((item, i) => {
            const color = RANK_COLORS[item.rank] ?? '#60a5fa';
            return (
              <Card key={i} style={{ padding: 0, overflow: 'hidden' }}>
                <button
                  onClick={() => setExpandedC(expandedC === i ? null : i)}
                  style={{
                    width: '100%', background: 'none', border: 'none',
                    padding: '18px 20px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: `${color}18`,
                    border: `1.5px solid ${color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '13px', fontWeight: 700, color: color,
                  }}>
                    #{i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', color, fontWeight: 600, marginBottom: '2px' }}>
                      {item.rank}
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 500, lineHeight: 1.35 }}>
                      {item.topics.join(' + ')}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{item.mark} marks</span>
                    <div style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {expandedC === i ? <ChevronUp size={16} strokeWidth={1.5} /> : <ChevronDown size={16} strokeWidth={1.5} />}
                    </div>
                  </div>
                </button>

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
                        <div style={{
                          marginTop: '14px', padding: '12px 14px',
                          background: 'rgba(0,0,0,0.35)',
                          borderRadius: '10px',
                          fontSize: '12px', color: 'rgba(255,255,255,0.7)',
                          lineHeight: 1.6, fontStyle: 'italic',
                          marginBottom: '10px',
                        }}>
                          {item.evidence}
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                          Model Answer
                        </div>
                        <pre style={{
                          margin: 0, padding: '14px',
                          background: 'rgba(0,0,0,0.4)',
                          borderRadius: '10px',
                          fontSize: '11px', lineHeight: 1.65,
                          color: 'rgba(255,255,255,0.75)',
                          fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
                          overflowX: 'auto',
                          whiteSpace: 'pre-wrap',
                        }}>
                          {item.modelAnswer}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Part B */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '32px' }}
      >
        <SectionLabel text="Part B — Long Questions (10-15 Marks)" />
        <div style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '16px' }}>
          Key topics to prepare
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredB.map((q, i) => (
            <Card key={i} style={{ padding: 0, overflow: 'hidden' }}>
              <button
                onClick={() => setExpandedB(expandedB === i ? null : i)}
                style={{
                  width: '100%', background: 'none', border: 'none',
                  padding: '16px 18px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                }}
              >
                <div style={{
                  width: '4px', height: '40px', borderRadius: '2px',
                  background: TOPIC_COLOR(q.topic), flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#ffffff', lineHeight: 1.3, marginBottom: '4px' }}>
                    {q.topic}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '100px', background: 'rgba(41,151,255,0.12)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.2)' }}>
                      Unit {q.unit}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '100px', background: 'rgba(5,150,105,0.12)', color: '#34d399', border: '1px solid rgba(5,150,105,0.2)' }}>
                      {q.mark} marks
                    </span>
                  </div>
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
                        {q.question}
                      </p>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                        Key Points
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                        {q.keyPoints.map((kp, ki) => (
                          <div key={ki} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#2997ff', flexShrink: 0, marginTop: '6px' }} />
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{kp}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {q.papers.map(p => (
                          <span key={p} style={{
                            fontSize: '10px', fontWeight: 500, padding: '3px 9px', borderRadius: '100px',
                            background: 'rgba(41,151,255,0.12)', color: '#2997ff',
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
          ))}
        </div>
      </motion.div>

      {/* Part A MCQs */}
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
          {UNIT_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => { setActiveUnit(f.value); setExpandedA(null); }}
              style={{
                padding: '8px 16px', borderRadius: '100px', cursor: 'pointer',
                fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap',
                border: 'none',
                background: activeUnit === f.value ? '#2997ff' : 'rgba(255,255,255,0.08)',
                color: activeUnit === f.value ? '#ffffff' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.18s',
                flexShrink: 0,
              }}
            >
              {f.label}
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
            {filteredA.map((q, i) => (
              <Card key={q.id} style={{ padding: 0, overflow: 'hidden' }}>
                <button
                  onClick={() => setExpandedA(expandedA === i ? null : i)}
                  style={{
                    width: '100%', background: 'none', border: 'none',
                    padding: '14px 16px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: '4px', height: '36px', borderRadius: '2px',
                    background: TOPIC_COLOR(q.topic), flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.9)', lineHeight: 1.35 }}>
                      {q.question}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '100px', background: `${TOPIC_COLOR(q.topic)}18`, color: TOPIC_COLOR(q.topic), border: `1px solid ${TOPIC_COLOR(q.topic)}30` }}>
                        {q.topic}
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '100px', background: 'rgba(41,151,255,0.12)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.2)' }}>
                        Unit {q.unit}
                      </span>
                    </div>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>
                    {expandedA === i ? <ChevronUp size={14} strokeWidth={1.5} /> : <ChevronDown size={14} strokeWidth={1.5} />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {expandedA === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 16px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {q.options.map((opt, oi) => (
                          <div key={oi} style={{
                            display: 'flex', gap: '10px', alignItems: 'flex-start',
                            padding: '8px 0',
                            borderBottom: oi < q.options.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                          }}>
                            <span style={{
                              width: '22px', height: '22px', borderRadius: '50%',
                              background: oi === q.correctAnswer ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)',
                              border: `1.5px solid ${oi === q.correctAnswer ? '#34d399' : 'rgba(255,255,255,0.15)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '10px', fontWeight: 700, flexShrink: 0,
                              color: oi === q.correctAnswer ? '#34d399' : 'rgba(255,255,255,0.3)',
                            }}>
                              {String.fromCharCode(65 + oi)}
                            </span>
                            <span style={{ fontSize: '13px', color: oi === q.correctAnswer ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
                              {opt}
                            </span>
                          </div>
                        ))}
                        <div style={{
                          display: 'flex', gap: '8px', alignItems: 'flex-start',
                          marginTop: '12px', padding: '10px 12px',
                          background: 'rgba(52,211,153,0.08)',
                          border: '1px solid rgba(52,211,153,0.2)',
                          borderRadius: '10px',
                        }}>
                          <AlertTriangle size={12} strokeWidth={1.5} style={{ color: '#34d399', flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                            {q.explanation}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                          <span style={{
                            fontSize: '10px', fontWeight: 500, padding: '3px 9px', borderRadius: '100px',
                            background: 'rgba(41,151,255,0.12)', color: '#2997ff',
                            border: '1px solid rgba(41,151,255,0.2)',
                          }}>
                            {q.paper}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Exam strategy */}
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
            { part: 'Part A', marks: '20', action: 'Revise AM power calculations, Carsons rule, Nyquist theorem, BPSK error formula' },
            { part: 'Part B', marks: '40', action: 'Focus on AM derivation, FM Armstrong method, Sampling theorem, BPSK, Friis formula' },
            { part: 'Part C', marks: '15', action: 'AM numerical or FM numerical — both have appeared multiple times' },
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
            Covers all 5 units — AM/FM, Pulse Modulation, Digital Comm, Noise.
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function MasterSheetView() {
  const [expandedA, setExpandedA] = useState<number | null>(null);
  const [expandedB, setExpandedB] = useState<number | null>(null);
  const [expandedC, setExpandedC] = useState<number | null>(null);

  const RANK_COLORS: Record<string, string> = {
    'Highly Probable': '#ef4444',
    'Very Likely': '#f59e0b',
    'Possible': '#3b82f6',
  };

  return (
    <div>
      {/* Part A Master Sheet */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '32px' }}
      >
        <SectionLabel text="Part A — 20 MCQs" />
        <div style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '16px' }}>
          All questions with answers
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {ADC_PART_A.map((q, i) => (
            <Card key={q.id} style={{ padding: 0, overflow: 'hidden' }}>
              <button
                onClick={() => setExpandedA(expandedA === i ? null : i)}
                style={{
                  width: '100%', background: 'none', border: 'none',
                  padding: '14px 16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                }}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: 'rgba(41,151,255,0.12)',
                  border: '1px solid rgba(41,151,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: '11px', fontWeight: 700, color: '#2997ff',
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', lineHeight: 1.3 }}>
                    {q.topic}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                    Unit {q.unit} · {q.paper}
                  </div>
                </div>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '6px',
                  background: 'rgba(52,211,153,0.12)',
                  border: '1px solid rgba(52,211,153,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '11px', fontWeight: 700, color: '#34d399',
                }}>
                  {String.fromCharCode(65 + q.correctAnswer)}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>
                  {expandedA === i ? <ChevronUp size={14} strokeWidth={1.5} /> : <ChevronDown size={14} strokeWidth={1.5} />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {expandedA === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 16px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.55, margin: '12px 0' }}>
                        {q.question}
                      </p>
                      {q.options.map((opt, oi) => (
                        <div key={oi} style={{
                          display: 'flex', gap: '10px', alignItems: 'flex-start',
                          padding: '6px 0',
                        }}>
                          <span style={{
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: oi === q.correctAnswer ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.05)',
                            border: `1.5px solid ${oi === q.correctAnswer ? '#34d399' : 'rgba(255,255,255,0.12)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '9px', fontWeight: 700, flexShrink: 0,
                            color: oi === q.correctAnswer ? '#34d399' : 'rgba(255,255,255,0.3)',
                          }}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span style={{ fontSize: '12px', color: oi === q.correctAnswer ? '#34d399' : 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                            {opt}
                          </span>
                        </div>
                      ))}
                      <div style={{
                        marginTop: '10px', padding: '8px 10px',
                        background: 'rgba(52,211,153,0.06)',
                        border: '1px solid rgba(52,211,153,0.15)',
                        borderRadius: '8px',
                      }}>
                        <span style={{ fontSize: '10px', color: '#34d399', fontWeight: 600 }}>Answer: </span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>{q.explanation}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Part B Master Sheet */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '32px' }}
      >
        <SectionLabel text="Part B — Long Questions" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {ADC_PART_B.map((q, i) => (
            <Card key={q.id} style={{ padding: 0, overflow: 'hidden' }}>
              <button
                onClick={() => setExpandedB(expandedB === i ? null : i)}
                style={{
                  width: '100%', background: 'none', border: 'none',
                  padding: '14px 16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                }}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: 'rgba(161,139,251,0.12)',
                  border: '1px solid rgba(161,139,251,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: '11px', fontWeight: 700, color: '#a78bfa',
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#ffffff', lineHeight: 1.3 }}>
                    {q.topic}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(41,151,255,0.12)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.2)' }}>
                      Unit {q.unit}
                    </span>
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(5,150,105,0.12)', color: '#34d399', border: '1px solid rgba(5,150,105,0.2)' }}>
                      {q.mark} marks
                    </span>
                  </div>
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
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 16px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.55, margin: '12px 0 10px' }}>
                        {q.question}
                      </p>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                        Key Points
                      </div>
                      {q.keyPoints.map((kp, ki) => (
                        <div key={ki} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#2997ff', flexShrink: 0, marginTop: '6px' }} />
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{kp}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                        {q.papers.map(p => (
                          <span key={p} style={{ fontSize: '10px', padding: '3px 9px', borderRadius: '100px', background: 'rgba(41,151,255,0.12)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.2)' }}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Part C Master Sheet */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '32px' }}
      >
        <SectionLabel text="Part C — 15 Mark Scenarios" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {ADC_PART_C.map((q, i) => {
            const color = RANK_COLORS[q.rank] ?? '#60a5fa';
            return (
              <Card key={q.id} style={{ padding: 0, overflow: 'hidden' }}>
                <button
                  onClick={() => setExpandedC(expandedC === i ? null : i)}
                  style={{
                    width: '100%', background: 'none', border: 'none',
                    padding: '14px 16px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    background: `${color}18`,
                    border: `1px solid ${color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '11px', fontWeight: 700, color: color,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#ffffff', lineHeight: 1.3 }}>
                      {q.topics.join(' + ')}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: `${color}15`, color: color, border: `1px solid ${color}30` }}>
                        {q.rank}
                      </span>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(5,150,105,0.12)', color: '#34d399', border: '1px solid rgba(5,150,105,0.2)' }}>
                        {q.mark} marks
                      </span>
                    </div>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                    {expandedC === i ? <ChevronUp size={14} strokeWidth={1.5} /> : <ChevronDown size={14} strokeWidth={1.5} />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {expandedC === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 16px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.55, margin: '12px 0 10px' }}>
                          {q.scenario}
                        </p>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic', marginBottom: '10px' }}>
                          {q.evidence}
                        </div>
                        <pre style={{
                          margin: 0, padding: '12px',
                          background: 'rgba(0,0,0,0.35)',
                          borderRadius: '10px',
                          fontSize: '11px', lineHeight: 1.6,
                          color: 'rgba(255,255,255,0.75)',
                          fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
                          overflowX: 'auto',
                          whiteSpace: 'pre-wrap',
                        }}>
                          {q.modelAnswer}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export function ADCAnalysisMobile({ onBack }: Props) {
  const [tab, setTab] = useState<Tab>('analysis');

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
            Analog & Digital Communication
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}>
            21ECC302T · PYQ Analysis
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '28px 20px', paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {tab === 'analysis' ? <AnalysisView /> : <MasterSheetView />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom tab bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.09)',
        padding: '0 20px',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '12px 0' }}>
          <button
            onClick={() => setTab('analysis')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '14px', borderRadius: '14px',
              border: 'none', cursor: 'pointer',
              background: tab === 'analysis' ? '#2997ff' : 'rgba(255,255,255,0.06)',
              color: tab === 'analysis' ? '#ffffff' : 'rgba(255,255,255,0.4)',
              fontSize: '14px', fontWeight: 600,
              transition: 'all 0.18s',
            }}
          >
            <BarChart2 size={16} strokeWidth={1.5} />
            Analysis
          </button>
          <button
            onClick={() => setTab('master')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '14px', borderRadius: '14px',
              border: 'none', cursor: 'pointer',
              background: tab === 'master' ? '#2997ff' : 'rgba(255,255,255,0.06)',
              color: tab === 'master' ? '#ffffff' : 'rgba(255,255,255,0.4)',
              fontSize: '14px', fontWeight: 600,
              transition: 'all 0.18s',
            }}
          >
            <Sheet size={16} strokeWidth={1.5} />
            Master Sheet
          </button>
        </div>
      </div>
    </div>
  );
}