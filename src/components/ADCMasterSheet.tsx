// ADC Master Sheet — 21ECC302T Analog and Digital Communication
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Star, ChevronDown, ChevronUp,
  FileText, BookOpen, AlertCircle, CheckCircle2, Target, TrendingUp, Zap,
} from 'lucide-react';
import { ADC_PART_A, ADC_PART_B, ADC_PART_C } from '../data/adcMasterSheet';

interface Props {
  onBack: () => void;
}

// ─────────────────────────────────────────
// UNIT DATA
// ─────────────────────────────────────────

const UNIT_DATA = [
  { unit: 1, name: 'Amplitude Modulation', marks: 20, badge: 'MUST', badgeColor: '#ef4444', topics: 'AM, DSB-SC, SSB' },
  { unit: 2, name: 'Frequency & Phase Modulation', marks: 20, badge: 'MUST', badgeColor: '#ef4444', topics: 'FM, PM, Armstrong method' },
  { unit: 3, name: 'Pulse Modulation & Sampling', marks: 15, badge: 'IMPORTANT', badgeColor: '#f59e0b', topics: 'Sampling theorem, PAM, PWM, PPM' },
  { unit: 4, name: 'Digital Modulation', marks: 20, badge: 'IMPORTANT', badgeColor: '#f59e0b', topics: 'ASK, FSK, BPSK, QAM' },
  { unit: 5, name: 'Noise & Noise Figure', marks: 15, badge: 'SAFE', badgeColor: '#30d158', topics: 'Thermal noise, SNR, Friis formula' },
];

// ─────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────

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

function PriorityBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: '10px', fontWeight: 600, color,
      background: `${color}18`, padding: '3px 8px', borderRadius: '100px',
      border: `1px solid ${color}30`,
    }}>{label}</span>
  );
}

function UnitBadge({ unit }: { unit: number }) {
  const colors = ['#ef4444', '#22c55e', '#06b6d4', '#8b5cf6', '#f59e0b'];
  return (
    <div style={{
      width: '28px', height: '28px', borderRadius: '8px',
      background: `${colors[unit - 1]}18`, border: `1px solid ${colors[unit - 1]}30`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '11px', fontWeight: 700, color: colors[unit - 1],
      fontFamily: 'JetBrains Mono, monospace', flexShrink: 0,
    }}>
      U{unit}
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────

export default function ADCMasterSheet({ onBack }: Props) {
  const [activeUnit, setActiveUnit] = useState<number | null>(null);
  const [openMCQTopic, setOpenMCQTopic] = useState<string | null>('AM');
  const [openPartB, setOpenPartB] = useState<string | null>('pb1');
  const [openPartC, setOpenPartC] = useState<string | null>('pc1');

  const toggleMCQTopic = (topic: string) => setOpenMCQTopic(openMCQTopic === topic ? null : topic);
  const togglePartB = (id: string) => setOpenPartB(openPartB === id ? null : id);
  const togglePartC = (id: string) => setOpenPartC(openPartC === id ? null : id);

  // Group Part A by topic
  const groupedPartA = ADC_PART_A.reduce((acc, q) => {
    if (!acc[q.topic]) acc[q.topic] = [];
    acc[q.topic].push(q);
    return acc;
  }, {} as Record<string, typeof ADC_PART_A>);

  // Filter helpers
  const filterPartA = (topic: string) => {
    let questions = groupedPartA[topic] || [];
    if (activeUnit !== null) questions = questions.filter(q => q.unit === activeUnit);
    return questions;
  };

  const filteredPartB = activeUnit === null
    ? ADC_PART_B
    : ADC_PART_B.filter(q => q.unit === activeUnit);

  const filteredPartC = activeUnit === null
    ? ADC_PART_C
    : ADC_PART_C.filter(q => q.unit === activeUnit);

  const unitBadgeIcon = (badge: string) => {
    if (badge === 'MUST') return <AlertCircle size={11} strokeWidth={2} />;
    if (badge === 'IMPORTANT') return <Zap size={11} strokeWidth={2} />;
    return <CheckCircle2 size={11} strokeWidth={2} />;
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>

      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'saturate(180%) blur(20px)',
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
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>ADC</span>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>21ECC302T</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => window.open('/prepguide.pdf', '_blank')}
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
            21ECC302T · SRM Institute · Sixth Semester
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 600, color: '#ffffff',
            letterSpacing: '-0.04em', lineHeight: 1.08, margin: '0 0 14px',
          }}>
            ADC Master Sheet
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0, letterSpacing: '-0.02em' }}>
            All Questions · All Answers · Cross-Paper Analysis
          </p>

          {/* Stats bar */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
            {[
              { n: '3', l: 'Papers', c: '#2997ff' },
              { n: '18', l: 'MCQs', c: '#bf5af2' },
              { n: '10', l: 'Part B Qs', c: '#30d158' },
              { n: '3', l: 'Part C Predictions', c: '#ff9f0a' },
              { n: '75', l: 'Total Marks', c: '#ef4444' },
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

        {/* ── UNIT FILTER ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '56px' }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <button
              onClick={() => setActiveUnit(null)}
              style={{
                padding: '7px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500,
                cursor: 'pointer', border: '1px solid',
                background: activeUnit === null ? '#2997ff' : 'transparent',
                borderColor: activeUnit === null ? '#2997ff' : 'rgba(255,255,255,0.15)',
                color: activeUnit === null ? '#fff' : 'rgba(255,255,255,0.6)',
                transition: 'all 0.2s',
              }}
            >
              All Units
            </button>
            {[1, 2, 3, 4, 5].map(u => (
              <button
                key={u}
                onClick={() => setActiveUnit(activeUnit === u ? null : u)}
                style={{
                  padding: '7px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', border: '1px solid',
                  background: activeUnit === u ? '#2997ff' : 'transparent',
                  borderColor: activeUnit === u ? '#2997ff' : 'rgba(255,255,255,0.15)',
                  color: activeUnit === u ? '#fff' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.2s',
                }}
              >
                U{u}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
            {activeUnit ? `Showing Unit ${activeUnit} content only` : 'Showing all units — click a unit to filter'}
          </div>
        </motion.div>

        {/* ── UNIT PRIORITY CARDS ────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle
            label="Unit Priority"
            title="Unit-wise Breakdown"
            desc="Know which units carry the most marks and how to prioritize your revision."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {UNIT_DATA.map((unit) => {
              const isActive = activeUnit === unit.unit;
              return (
                <motion.div
                  key={unit.unit}
                  layout
                  onClick={() => setActiveUnit(isActive ? null : unit.unit)}
                  style={{
                    background: '#1c1c1e', borderRadius: '14px', padding: '20px',
                    border: `1px solid ${isActive ? unit.badgeColor + '50' : 'rgba(255,255,255,0.07)'}`,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                        background: unit.badgeColor,
                      }}
                    />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{
                      fontSize: '11px', fontWeight: 700, color: '#2997ff',
                      background: 'rgba(41,151,255,0.12)', padding: '3px 8px', borderRadius: '6px',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>
                      Unit {unit.unit}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: unit.badgeColor }}>
                      {unitBadgeIcon(unit.badge)}
                      <span style={{ fontSize: '10px', fontWeight: 600 }}>{unit.badge}</span>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', margin: '0 0 6px', lineHeight: 1.3 }}>
                    {unit.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: '0 0 12px', lineHeight: 1.5 }}>
                    {unit.topics}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '22px', fontWeight: 700, color: unit.badgeColor }}>{unit.marks}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>marks</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── PART A: MCQ MASTER LIST ──────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle
            label="Part A · 18 × 1 = 18 marks"
            title="MCQ Master List — All Topics"
            desc="All Part A questions grouped by topic from all 3 papers. Master these for 18 guaranteed marks."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(groupedPartA).map(([topic, questions]) => {
              const isOpen = openMCQTopic === topic;
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
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: '100px' }}>
                        {filterPartA(topic).length} Qs
                      </span>
                    </div>
                    {isOpen
                      ? <ChevronUp size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />
                      : <ChevronDown size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />}
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
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', minWidth: '560px' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                {['Q', 'Paper', 'Question', 'Options', 'Answer'].map(h => (
                                  <th key={h} style={{ padding: '10px 8px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {questions.map((q, qi) => (
                                <tr key={qi} style={{ borderBottom: qi < questions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                                  <td style={{ padding: '10px 8px', color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>{qi + 1}</td>
                                  <td style={{ padding: '10px 8px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#2997ff', background: 'rgba(41,151,255,0.12)', padding: '2px 6px', borderRadius: '100px' }}>{q.paper}</span>
                                  </td>
                                  <td style={{ padding: '10px 8px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.4, maxWidth: '240px' }}>{q.question}</td>
                                  <td style={{ padding: '10px 8px', color: 'rgba(255,255,255,0.45)', fontSize: '11px', lineHeight: 1.4 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                      {q.options.map((opt, oi) => (
                                        <span key={oi} style={{ color: oi === q.correctAnswer ? '#30d158' : 'rgba(255,255,255,0.35)' }}>
                                          {String.fromCharCode(65 + oi)}. {opt}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                  <td style={{ padding: '10px 8px', fontFamily: 'JetBrains Mono, monospace', color: '#30d158', fontSize: '11px', fontWeight: 600 }}>
                                    {String.fromCharCode(65 + q.correctAnswer)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {/* Explanation section */}
                          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {questions.map((q, qi2) => (
                              <div key={q.id} style={{
                                background: 'rgba(41,151,255,0.05)', borderRadius: '8px', padding: '12px 14px',
                                border: '1px solid rgba(41,151,255,0.12)',
                              }}>
                                <div style={{ fontSize: '11px', fontWeight: 600, color: '#2997ff', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  Q{qi2 + 1} · {q.topic} · {q.paper}
                                </div>
                                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.55 }}>{q.explanation}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── PART B: LONG ANSWER ─────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle
            label="Part B · 4 × 10 = 40 marks"
            title="Long Answer Questions"
            desc="All Part B questions with full model answers and key points. Prepare 4 of these."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredPartB.map((q) => {
              const isOpen = openPartB === q.id;
              const priorityBadgeColor = q.mark === 15 ? '#ef4444' : q.mark === 10 ? '#f59e0b' : '#6b7280';
              return (
                <motion.div
                  key={q.id}
                  layout
                  style={{
                    background: '#1c1c1e', borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.07)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => togglePartB(q.id)}
                    style={{
                      width: '100%', padding: '16px 20px', display: 'flex',
                      alignItems: 'center', gap: '12px', background: 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <UnitBadge unit={q.unit} />
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{q.topic}</span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: '100px' }}>
                        {q.mark} marks
                      </span>
                      <PriorityBadge label={q.mark === 15 ? 'HIGH VALUE' : 'STANDARD'} color={priorityBadgeColor} />
                    </div>
                    {isOpen
                      ? <ChevronUp size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />
                      : <ChevronDown size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />}
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
                        <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {/* Question text */}
                          <div style={{ paddingTop: '12px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#2997ff', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Question
                            </div>
                            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, fontStyle: 'italic' }}>
                              {q.question}
                            </div>
                          </div>

                          {/* Papers */}
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {q.papers.map((paper) => (
                              <span key={paper} style={{
                                fontSize: '10px', fontWeight: 600, color: '#2997ff',
                                background: 'rgba(41,151,255,0.1)', padding: '3px 8px', borderRadius: '100px',
                                border: '1px solid rgba(41,151,255,0.2)',
                              }}>{paper}</span>
                            ))}
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginLeft: '4px', alignSelf: 'center' }}>appeared</span>
                          </div>

                          {/* Model answer */}
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#30d158', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Model Answer
                            </div>
                            <div style={{
                              background: 'rgba(48,209,88,0.04)', borderRadius: '10px', padding: '14px 16px',
                              border: '1px solid rgba(48,209,88,0.12)',
                              fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75,
                              whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                            }}>
                              {q.modelAnswer}
                            </div>
                          </div>

                          {/* Key points */}
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#ff9f0a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Key Points
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {q.keyPoints.map((kp, ki) => (
                                <div key={ki} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#ff9f0a', flexShrink: 0, marginTop: '1px' }}>→</span>
                                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{kp}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── PART C: 15-MARK NUMERICAL ───────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle
            label="Part C · 1 × 15 = 15 marks"
            title="15-Mark Numerical Predictions"
            desc="Step-by-step solutions for the most likely Part C numerical problems. Ranked by probability."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredPartC.map((q) => {
              const isOpen = openPartC === q.id;
              const rankColors: Record<string, string> = {
                'Highly Probable': '#ef4444',
                'Very Likely': '#f59e0b',
                'Possible': '#30d158',
              };
              const color = rankColors[q.rank] || '#2997ff';
              return (
                <motion.div
                  key={q.id}
                  layout
                  style={{
                    background: '#1c1c1e', borderRadius: '14px',
                    border: `1px solid ${color}25`,
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => togglePartC(q.id)}
                    style={{
                      width: '100%', padding: '16px 20px', display: 'flex',
                      alignItems: 'center', gap: '12px', background: 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <UnitBadge unit={q.unit} />
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', flex: 1 }}>{q.scenario.slice(0, 65)}...</span>
                      <PriorityBadge label={q.rank} color={color} />
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: '100px' }}>
                        {q.mark} marks
                      </span>
                    </div>
                    {isOpen
                      ? <ChevronUp size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />
                      : <ChevronDown size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />}
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
                        <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {/* Topics */}
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingTop: '12px' }}>
                            {q.topics.map((t) => (
                              <span key={t} style={{
                                fontSize: '10px', fontWeight: 600, color: '#a855f7',
                                background: 'rgba(168,85,247,0.1)', padding: '3px 8px', borderRadius: '100px',
                                border: '1px solid rgba(168,85,247,0.2)',
                              }}>{t}</span>
                            ))}
                          </div>

                          {/* Full question */}
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#2997ff', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Full Question
                            </div>
                            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                              {q.scenario}
                            </div>
                          </div>

                          {/* Evidence */}
                          <div style={{
                            background: 'rgba(168,85,247,0.05)', borderRadius: '10px', padding: '12px 14px',
                            border: '1px solid rgba(168,85,247,0.15)',
                          }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#a855f7', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Evidence
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>{q.evidence}</div>
                          </div>

                          {/* Step-by-step solution */}
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#30d158', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Step-by-Step Solution
                            </div>
                            <div style={{
                              background: 'rgba(48,209,88,0.04)', borderRadius: '10px', padding: '14px 16px',
                              border: '1px solid rgba(48,209,88,0.12)',
                              fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8,
                              whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                            }}>
                              {q.modelAnswer}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── STUDY PLAN & EXAM STRATEGY ──────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle
            label="Study Plan"
            title="Exam Strategy & Score Breakdown"
            desc="How to approach each part for maximum marks."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Part A Strategy */}
            <div style={{
              background: '#1c1c1e', borderRadius: '14px', padding: '20px',
              border: '1px solid rgba(191,90,242,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ color: '#bf5af2' }}><Star size={16} strokeWidth={1.5} /></div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Part A Strategy</span>
              </div>
              <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Focus on FM deviation ratio and Carson\'s rule — most repeated topic',
                  'AM power calculations: m = Em/Ec, Pt = Pc(1 + m²/2)',
                  'Nyquist sampling theorem: fs ≥ 2B — must know definition',
                  'BPSK: 1 bit/symbol, QPSK: 2 bits/symbol — memorize constellation',
                  'Noise: Pn = kTB, SNR(dB) = 10 log₁₀(Ps/Pn) — formula-based',
                  'Review all 18 MCQs from data file — 1 mark each',
                ].map((s, i) => (
                  <li key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Part B Strategy */}
            <div style={{
              background: '#1c1c1e', borderRadius: '14px', padding: '20px',
              border: '1px solid rgba(48,209,88,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ color: '#30d158' }}><Target size={16} strokeWidth={1.5} /></div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Part B Strategy</span>
              </div>
              <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Pick any 4 of 6 — choose what you know best',
                  'AM derivation + m ≤ 1 condition — 10 marks, easy',
                  'BPSK probability of error: Pe = Q(√(2Es/N0)) — memorize',
                  'Friis formula: first stage dominates (divide by G1)',
                  'Sampling theorem: fs ≥ 2B — state, prove, aliasing',
                  'Always include a table in comparison questions',
                ].map((s, i) => (
                  <li key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Part C Strategy */}
            <div style={{
              background: '#1c1c1e', borderRadius: '14px', padding: '20px',
              border: '1px solid rgba(255,159,10,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ color: '#ff9f0a' }}><TrendingUp size={16} strokeWidth={1.5} /></div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Part C Strategy</span>
              </div>
              <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Highly Probable: AM numerical (sidebands, power, BW)',
                  'Highly Probable: FM Carson\'s rule + deviation ratio',
                  'Very Likely: Friis formula cascade noise figure',
                  'Always show all steps — partial marks for method',
                  'Include given values at start of solution',
                  'Comment on relationship in final part',
                ].map((s, i) => (
                  <li key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Score breakdown */}
          <div style={{
            background: '#1c1c1e', borderRadius: '14px', padding: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>Score Breakdown Target</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { part: 'Part A (MCQ)', target: '18', total: '18', color: '#bf5af2', tip: 'Target: 18/18 — all MCQs are predictable from past papers' },
                { part: 'Part B (Long)', target: '35', total: '40', color: '#30d158', tip: 'Target: 35+/40 — answer 4 well-structured questions' },
                { part: 'Part C (Numerical)', target: '12', total: '15', color: '#ff9f0a', tip: 'Target: 12+/15 — one solid numerical with all steps shown' },
                { part: 'Total Target', target: '65', total: '75', color: '#ef4444', tip: 'Target: 65+/75 — B+ grade, very achievable' },
              ].map((row) => (
                <div key={row.part} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#ffffff', marginBottom: '2px' }}>{row.part}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{row.tip}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '22px', fontWeight: 700, color: row.color }}>{row.target}</span>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>/{row.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Footer */}
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
            Aswath AS · SRM Institute · "I got bored studying. So I analysed all 3 previous year papers."
          </p>
        </motion.div>
      </div>
    </div>
  );
}
