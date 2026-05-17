import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowLeft, Shield, Lock, ChevronDown, ChevronUp, Zap, Target, TrendingUp,
  AlertTriangle, Award, Sparkles, BookOpen, Cpu, Key, Hash, Binary, Fingerprint,
  Globe, Wifi, CreditCard, Radio, Eye, Coins, Atom, Presentation
} from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  UNIT_1_EXHAUSTIVE, UNIT_2_EXHAUSTIVE, UNIT_3_EXHAUSTIVE,
  UNIT_4_EXHAUSTIVE, UNIT_5_EXHAUSTIVE
} from '../data/cryptoExhaustiveAnswers';
import type { ExhaustiveTopic } from '../data/cryptoExhaustiveAnswers';

interface Props {
  onBack: () => void;
}

/* ─── SYLLABUS UNITS ─────────────────────────────────────── */

const UNITS = [
  { unit: 1, name: 'Introduction to Cryptography', marks: 14, color: '#ef4444', icon: Lock, topics: ['Classic ciphers', 'Substitution & Transposition', 'Stream Cipher model', 'Block Cipher model', 'Confusion & Diffusion'] },
  { unit: 2, name: 'Symmetric Key Ciphers', marks: 18, color: '#f59e0b', icon: Key, topics: ['DES & Feistel Network', '3DES & Double DES pitfalls', 'AES & SPN Architecture', 'RC4, RC5, Blowfish'] },
  { unit: 3, name: 'Asymmetric Key Ciphers', marks: 20, color: '#30d158', icon: Shield, topics: ['RSA & Integer Factorization', 'Diffie-Hellman Key Exchange', 'ECC & ECDLP', 'ElGamal & DSA', 'Fiat-Shamir'] },
  { unit: 4, name: 'Message Integrity & Hash', marks: 16, color: '#3b82f6', icon: Hash, topics: ['MAC & CBC-MAC', 'HMAC structure', 'SHA-1, SHA-2, SHA-3', 'MD4, MD5', 'Sponge Construction'] },
  { unit: 5, name: 'Applications & Future', marks: 12, color: '#8b5cf6', icon: Atom, topics: ['TLS/SSL & Internet security', 'WPA3 & Wireless', '5G Mobile security', 'EMV & Payments', 'Quantum Computing', 'Post-Quantum Crypto'] },
];

/* ─── 15-MARK PREDICTIONS ────────────────────────────────── */

const PREDICTIONS_15 = [
  { rank: 1, label: 'Highly Probable', color: '#ef4444', scenario: 'RSA: Complete Trapdoor Analysis + Hybrid Crypto', evidence: 'Core asymmetric topic. Appears in every pattern.' },
  { rank: 2, label: 'Very Likely', color: '#f59e0b', scenario: 'AES vs DES: Feistel vs SPN Structural Comparison', evidence: 'Major symmetric topic. High marks density.' },
  { rank: 3, label: 'Very Likely', color: '#f59e0b', scenario: 'Quantum Threat: Shor\'s vs Grover\'s + PQC Categories', evidence: 'Future-tech. High examiner interest.' },
  { rank: 4, label: 'Possible', color: '#3b82f6', scenario: 'DES Feistel Network + 3DES EDE Justification', evidence: 'Classic symmetric structure.' },
];

/* ─── 8-MARK PRIORITIES ──────────────────────────────────── */

const PRIORITIES_8 = [
  { topic: 'HMAC vs Hash(Key||Msg)', unit: 4, prob: 95, type: 'must' as const },
  { topic: 'SHA-1 → SHA-2 → SHA-3 Evolution', unit: 4, prob: 92, type: 'must' as const },
  { topic: 'Stream vs Block Cipher (with use-cases)', unit: 1, prob: 90, type: 'must' as const },
  { topic: 'ECC vs RSA for Mobile/IoT', unit: 3, prob: 88, type: 'must' as const },
  { topic: 'Diffie-Hellman + MITM Vulnerability', unit: 3, prob: 85, type: 'must' as const },
  { topic: 'Confusion & Diffusion (Shannon)', unit: 1, prob: 85, type: 'must' as const },
  { topic: 'CBC-MAC Splicing Attack + CMAC Fix', unit: 4, prob: 80, type: 'safe' as const },
  { topic: 'Double DES Meet-in-the-Middle', unit: 2, prob: 78, type: 'safe' as const },
];

/* ─── KEY INSIGHTS ───────────────────────────────────────── */

const KEY_INSIGHTS = [
  { icon: Target, text: 'RSA + AES/DES + Quantum = 45+ marks safe strategy', color: '#ef4444' },
  { icon: TrendingUp, text: 'Unit 3 (Asymmetric) = highest weight at 20 marks', color: '#30d158' },
  { icon: AlertTriangle, text: 'Questions are TWISTED — don\'t just define, ANALYZE use-cases', color: '#f59e0b' },
  { icon: Award, text: 'Draw diagrams: Feistel, SPN, DH exchange, Sponge = +2 marks each', color: '#3b82f6' },
];

/* ─── MCQ FLASH FACTS ────────────────────────────────────── */

const MCQ_FLASH = [
  { q: 'Non-linearity in AES?', a: 'SubBytes (S-Box)' },
  { q: 'Security basis of RSA?', a: 'Integer Factorization' },
  { q: 'Security basis of ECC?', a: 'ECDLP (Discrete Log)' },
  { q: 'Double DES weakness?', a: 'Meet-in-the-Middle attack' },
  { q: 'SHA-3 construction?', a: 'Sponge (Keccak)' },
  { q: 'Quantum algorithm for RSA?', a: "Shor's Algorithm" },
  { q: 'Quantum algorithm for AES?', a: "Grover's Algorithm" },
  { q: '50% bit change effect?', a: 'Avalanche Effect' },
  { q: 'RSA key for 128-bit security?', a: '3072 bits' },
  { q: 'ECC key for 128-bit security?', a: '256 bits' },
  { q: 'HMAC vulnerability it fixes?', a: 'Length Extension Attack' },
  { q: 'AES block size?', a: '128 bits' },
  { q: 'DES key size?', a: '56 bits' },
  { q: '3DES effective key?', a: '112 or 168 bits' },
  { q: 'NIST PQC favorite?', a: 'Lattice-based (Kyber)' },
];

/* ─── UNIT SIMPLE INTROS ─────────────────────────────────── */

const UNIT_INTROS: Record<number, string> = {
  1: 'Unit 1 covers the ABCs — how ancient ciphers worked, why they broke, and how modern Stream & Block ciphers fix those flaws using Confusion and Diffusion.',
  2: 'Unit 2 is the symmetric engine — DES (the old Feistel king), 3DES (the patch), and AES (the modern SPN champion). Know their structures cold.',
  3: 'Unit 3 is asymmetric cryptography — RSA (factoring trapdoor), Diffie-Hellman (key exchange), and ECC (the mobile hero). Heaviest unit at 20 marks.',
  4: 'Unit 4 is about integrity — making sure nobody tampered with your data. HMAC, SHA family, CBC-MAC. The "seal" on your encrypted message.',
  5: 'Unit 5 is the real world and the future — TLS, Wi-Fi, 5G, payments, and the quantum apocalypse. High examiner interest in Shor\'s vs Grover\'s.',
};

/* ─── HELPERS ─────────────────────────────────────────────── */

const TYPE_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  must: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: 'MUST DO' },
  safe: { bg: 'rgba(48,209,88,0.10)', color: '#30d158', label: 'SAFE PICK' },
};

const PROB_COLOR = (p: number) => p >= 90 ? '#ef4444' : p >= 80 ? '#f59e0b' : p >= 70 ? '#3b82f6' : '#6b7280';

function SectionTitle({ label, title, desc, color = '#dc2626' }: { label: string; title: string; desc?: string; color?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} style={{ marginBottom: '32px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color, marginBottom: '12px' }}>
        <Sparkles size={11} strokeWidth={2} />
        {label}
      </div>
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, color: 'var(--analysis-text)', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 10px' }}>{title}</h2>
      {desc && <p style={{ fontSize: '14px', color: 'var(--analysis-subtle)', margin: 0, lineHeight: 1.55 }}>{desc}</p>}
    </motion.div>
  );
}

/* ─── EXAM ANSWER CARD ───────────────────────────────────── */

function ExamAnswerCard({ topic, index }: { topic: ExhaustiveTopic; index: number }) {
  const [open, setOpen] = useState(false);
  const unitColor = UNITS.find(u => u.unit === topic.unit)?.color || '#dc2626';
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      style={{ background: 'var(--analysis-hover)', borderRadius: '14px', border: '1px solid var(--analysis-border)', overflow: 'hidden', borderLeft: `3px solid ${unitColor}` }}
    >
      {/* Header — always visible */}
      <button onClick={() => setOpen(!open)} style={{ width: '100%', background: 'none', border: 'none', padding: '18px 22px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left', color: 'inherit' }}>
        <div style={{ padding: '3px 10px', borderRadius: '6px', background: `${unitColor}15`, border: `1px solid ${unitColor}35`, fontSize: '11px', fontWeight: 700, color: unitColor, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{topic.marks}M</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--analysis-text)', lineHeight: 1.35 }}>{topic.topic}</div>
          <div style={{ fontSize: '11px', color: 'var(--analysis-subtle)', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>Unit {topic.unit}</div>
        </div>
        <div style={{ color: 'var(--analysis-subtle)', flexShrink: 0 }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 22px 22px', borderTop: '1px solid var(--analysis-border)' }}>

              {/* First Principles — green box */}
              <div style={{ background: 'rgba(48,209,88,0.06)', borderRadius: '10px', padding: '14px 16px', border: '1px solid rgba(48,209,88,0.15)', margin: '14px 0' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#30d158', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>First Principles</div>
                <div style={{ fontSize: '13px', color: 'var(--analysis-text)', lineHeight: 1.6, fontStyle: 'italic' }}>"{topic.firstPrinciples}"</div>
              </div>

              {/* Twisted Question — amber box */}
              <div style={{ background: 'rgba(245,158,11,0.06)', borderRadius: '10px', padding: '14px 16px', border: '1px solid rgba(245,158,11,0.15)', margin: '14px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <AlertTriangle size={11} />
                  Twisted Exam Scenario
                </div>
                <div style={{ fontSize: '14px', color: 'var(--analysis-text)', lineHeight: 1.55, fontWeight: 500 }}>"{topic.twistedQuestion}"</div>
              </div>

              {/* Exam-Ready Answer */}
              <div style={{ background: 'var(--analysis-hover)', borderRadius: '10px', padding: '16px 18px', border: '1px solid var(--analysis-border)', margin: '14px 0' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#30d158', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Exam-Ready Answer</div>
                <div style={{ fontSize: '13px', color: 'var(--analysis-text)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{topic.examReadyAnswer}</div>
              </div>

              {/* Real World */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '12px' }}>
                <Globe size={13} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '12px', color: 'var(--analysis-muted)', lineHeight: 1.55 }}>{topic.realWorldImplications}</div>
              </div>

              {/* Conclusion */}
              <div style={{ fontSize: '12px', color: unitColor, fontWeight: 600, marginTop: '10px', fontStyle: 'italic' }}>Key takeaway: {topic.conclusion}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── CRYPTO PIPELINE VISUAL ─────────────────────────────── */

function CryptoPipeline() {
  const steps = [
    { label: 'Plaintext', icon: BookOpen, color: '#ef4444' },
    { label: 'Key Gen', icon: Key, color: '#f59e0b' },
    { label: 'Encrypt', icon: Lock, color: '#30d158' },
    { label: 'Ciphertext', icon: Binary, color: '#3b82f6' },
    { label: 'Decrypt', icon: Shield, color: '#8b5cf6' },
    { label: 'Verify', icon: Fingerprint, color: '#0891b2' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', flexWrap: 'wrap', padding: '12px 0' }}>
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 300, damping: 30, delay: i * 0.1 }} whileHover={{ scale: 1.08, y: -3 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', padding: '12px 14px', borderRadius: '12px', background: `${step.color}08`, border: `1px solid ${step.color}20`, cursor: 'default' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${step.color}15`, border: `1.5px solid ${step.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={14} strokeWidth={1.5} style={{ color: step.color }} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: 600, color: step.color }}>{step.label}</span>
            </motion.div>
            {i < steps.length - 1 && <span style={{ margin: '0 4px', color: 'var(--analysis-subtle)' }}>→</span>}
          </div>
        );
      })}
    </div>
  );
}

/* ─── APPLICATION ICONS GRID ─────────────────────────────── */

const APP_ICONS = [
  { icon: Globe, label: 'TLS/SSL', color: '#3b82f6' },
  { icon: Wifi, label: 'WPA3', color: '#30d158' },
  { icon: CreditCard, label: 'EMV', color: '#f59e0b' },
  { icon: Radio, label: '5G', color: '#ef4444' },
  { icon: Eye, label: 'TOR', color: '#8b5cf6' },
  { icon: Coins, label: 'Blockchain', color: '#FFC000' },
];

/* ─── MAIN COMPONENT ─────────────────────────────────────── */

export function CryptoExamAnalysis({ onBack }: Props) {
  const navigate = useNavigate();
  const [activeUnit, setActiveUnit] = useState<number | null>(null);

  const allAnswers = [...UNIT_1_EXHAUSTIVE, ...UNIT_2_EXHAUSTIVE, ...UNIT_3_EXHAUSTIVE, ...UNIT_4_EXHAUSTIVE, ...UNIT_5_EXHAUSTIVE];
  const filteredAnswers = activeUnit !== null ? allAnswers.filter(a => a.unit === activeUnit) : allAnswers;

  return (
    <div style={{ background: 'var(--analysis-bg)', minHeight: '100vh' }}>

      {/* ── STICKY NAV ──────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--analysis-nav)', backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid var(--analysis-border)',
        padding: '10px clamp(16px, 5vw, 80px)',
        display: 'flex', alignItems: 'center', gap: '14px',
      }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--analysis-hover)', border: '1px solid var(--analysis-border)', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 500, color: 'var(--analysis-text)', cursor: 'pointer' }}>
          <ArrowLeft size={13} strokeWidth={1.5} /> Back
        </button>
        <div style={{ height: '16px', width: '1px', background: 'var(--analysis-border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626', boxShadow: '0 0 8px #dc2626' }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--analysis-text)' }}>Advanced Cryptography</span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--analysis-subtle)', fontFamily: "'JetBrains Mono', monospace", background: 'var(--analysis-hover)', padding: '3px 8px', borderRadius: '6px' }}>21CSE335T</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button onClick={() => navigate('/crypto-flash')} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '8px', background: '#FFC000', border: 'none', color: '#000', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            <Zap size={12} strokeWidth={2} /> Flash Cards
          </button>
          <button onClick={() => navigate('/crypto-analysis')} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '8px', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', color: '#dc2626', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
            <BookOpen size={12} strokeWidth={1.5} /> Learning Hub
          </button>
          <button onClick={() => navigate('/crypto-learn')} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '8px', background: 'rgba(255,192,0,0.12)', border: '1px solid rgba(255,192,0,0.25)', color: '#FFC000', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            <Presentation size={12} strokeWidth={1.5} /> Learn Mode
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 64px)' }}>

        {/* ══════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ marginBottom: '80px' }}>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#dc2626', background: 'rgba(220,38,38,0.08)', padding: '5px 12px', borderRadius: '100px', border: '1px solid rgba(220,38,38,0.2)', marginBottom: '18px' }}>
            <Cpu size={9} strokeWidth={2} />
            5 Units · 75 Marks · Twisted Questions Decoded
          </div>

          <h1 style={{ fontSize: 'clamp(34px, 5.5vw, 60px)', fontWeight: 700, color: 'var(--analysis-text)', letterSpacing: '-0.04em', lineHeight: 0.95, margin: '0 0 14px' }}>
            Advanced Cryptography<br />
            <span style={{ color: '#dc2626' }}>Exam Analysis</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--analysis-subtle)', lineHeight: 1.6, margin: '0 0 28px', maxWidth: '550px' }}>
            Every twisted question answered. First principles → exam scenario → full answer. Your complete preparation weapon.
          </p>

          {/* Crypto Pipeline */}
          <CryptoPipeline />

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginTop: '32px' }}>
            {[
              { n: '75', l: 'Total Marks', c: 'var(--analysis-text)', sub: '3 hours' },
              { n: '5', l: 'Units', c: '#dc2626', sub: 'Syllabus mapped' },
              { n: '19', l: 'Q&As Covered', c: '#FFC000', sub: 'Twisted + answered' },
              { n: '15', l: 'MCQ Flash Facts', c: '#30d158', sub: 'Quick revision' },
            ].map(({ n, l, c, sub }) => (
              <motion.div key={l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }} whileHover={{ y: -3 }}
                style={{ background: 'var(--analysis-hover)', borderRadius: '14px', padding: '20px 22px', border: '1px solid var(--analysis-border)', cursor: 'default' }}>
                <div style={{ fontSize: '28px', fontWeight: 700, color: c, letterSpacing: '-0.04em', fontFamily: "'JetBrains Mono', monospace" }}>{n}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--analysis-muted)', marginTop: '6px' }}>{l}</div>
                <div style={{ fontSize: '11px', color: 'var(--analysis-subtle)', marginTop: '2px' }}>{sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            UNIT MAP — unique visual with marks distribution
        ══════════════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: '80px' }}>
          <SectionTitle label="Syllabus Map" title="Unit-wise Marks Distribution" desc="Unit 3 (Asymmetric) carries the highest weight. Prioritize RSA, AES, and Quantum." color="#dc2626" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {UNITS.map((u, i) => {
              const Icon = u.icon;
              return (
                <motion.div key={u.unit} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
                  whileHover={{ borderColor: `${u.color}35` }}
                  onClick={() => setActiveUnit(activeUnit === u.unit ? null : u.unit)}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '14px', background: activeUnit === u.unit ? `${u.color}08` : 'var(--analysis-hover)', border: `1px solid ${activeUnit === u.unit ? `${u.color}30` : 'var(--analysis-border)'}`, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${u.color}15`, border: `1.5px solid ${u.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} strokeWidth={1.5} style={{ color: u.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--analysis-text)' }}>Unit {u.unit}: {u.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {u.topics.map(t => <span key={t} style={{ fontSize: '10px', fontWeight: 500, color: 'var(--analysis-subtle)', background: 'var(--analysis-hover)', padding: '2px 7px', borderRadius: '4px' }}>{t}</span>)}
                    </div>
                  </div>
                  {/* Marks bar */}
                  <div style={{ width: '120px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: u.color, fontFamily: "'JetBrains Mono', monospace" }}>{u.marks} marks</span>
                      <span style={{ fontSize: '10px', color: 'var(--analysis-subtle)' }}>{Math.round(u.marks / 75 * 100)}%</span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '3px', background: 'var(--analysis-hover)' }}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${u.marks / 20 * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }} style={{ height: '100%', borderRadius: '3px', background: u.color }} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            KEY INSIGHTS
        ══════════════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: '80px' }}>
          <SectionTitle label="Strategy" title="Exam Strategy" color="#FFC000" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {KEY_INSIGHTS.map((ins, i) => {
              const Icon = ins.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} whileHover={{ y: -3 }}
                  style={{ background: 'var(--analysis-hover)', borderRadius: '14px', padding: '18px 20px', border: `1px solid ${ins.color}18`, display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'default' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${ins.color}12`, border: `1.5px solid ${ins.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={13} style={{ color: ins.color }} />
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--analysis-muted)', lineHeight: 1.55 }}>{ins.text}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            15-MARK PREDICTIONS
        ══════════════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: '80px' }}>
          <SectionTitle label="Part C · 2 × 15 = 30 marks" title="15-Mark Predictions" desc="RSA, AES/DES structure, and Quantum/PQC are the high-value targets." color="#dc2626" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {PREDICTIONS_15.map((pred, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ borderColor: `${pred.color}30` }}
                style={{ background: 'var(--analysis-hover)', borderRadius: '14px', border: '1px solid var(--analysis-border)', overflow: 'hidden' }}
              >
                <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 * i }} style={{ height: '3px', background: pred.color, transformOrigin: 'left' }} />
                <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `${pred.color}15`, border: `1.5px solid ${pred.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: pred.color, flexShrink: 0 }}>
                    {pred.rank}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: pred.color }}>{pred.label}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--analysis-text)', flex: 1 }}>{pred.scenario}</span>
                  <span style={{ fontSize: '12px', color: 'var(--analysis-subtle)' }}>{pred.evidence}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            8-MARK PRIORITIES
        ══════════════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: '80px' }}>
          <SectionTitle label="Part B · 5 × 8 = 40 marks" title="8-Mark Priority Questions" desc="These are the safest picks based on syllabus weight and question patterns." color="#FFC000" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
            {PRIORITIES_8.map((q, i) => {
              const badge = TYPE_BADGE[q.type];
              return (
                <motion.div key={q.topic} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.04 }} whileHover={{ y: -3 }}
                  style={{ background: 'var(--analysis-hover)', borderRadius: '14px', padding: '18px 20px', border: '1px solid var(--analysis-border)', cursor: 'default' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ padding: '2px 8px', borderRadius: '4px', background: badge.bg, color: badge.color, fontSize: '9px', fontWeight: 700, letterSpacing: '0.04em' }}>{badge.label}</div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: PROB_COLOR(q.prob), fontFamily: "'JetBrains Mono', monospace" }}>{q.prob}%</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--analysis-text)', lineHeight: 1.35 }}>{q.topic}</div>
                  <div style={{ fontSize: '11px', color: 'var(--analysis-subtle)', marginTop: '6px' }}>Unit {q.unit}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            ALL EXAM ANSWERS (expandable)
        ══════════════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: '80px' }}>
          <SectionTitle label="Complete Q&A Bank" title="Every Twisted Question — Answered" desc="Click any card to reveal: first principles → twisted scenario → full exam answer → real-world connection." color="#dc2626" />

          {/* Unit filter */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <motion.button onClick={() => setActiveUnit(null)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: '8px 20px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, background: activeUnit === null ? 'rgba(220,38,38,0.15)' : 'var(--analysis-hover)', border: activeUnit === null ? '1.5px solid rgba(220,38,38,0.4)' : '1.5px solid var(--analysis-border)', color: activeUnit === null ? '#dc2626' : 'var(--analysis-subtle)', cursor: 'pointer', transition: 'all 0.2s' }}>
              All Units — {allAnswers.length}
            </motion.button>
            {UNITS.map(u => (
              <motion.button key={u.unit} onClick={() => setActiveUnit(activeUnit === u.unit ? null : u.unit)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ padding: '8px 20px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, background: activeUnit === u.unit ? `${u.color}15` : 'var(--analysis-hover)', border: activeUnit === u.unit ? `1.5px solid ${u.color}40` : '1.5px solid var(--analysis-border)', color: activeUnit === u.unit ? u.color : 'var(--analysis-subtle)', cursor: 'pointer', transition: 'all 0.2s' }}>
                U{u.unit} — {allAnswers.filter(a => a.unit === u.unit).length}
              </motion.button>
            ))}
          </div>

          {/* Unit intro when filtering */}
          <AnimatePresence>
            {activeUnit !== null && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} style={{ marginBottom: '20px' }}>
                <div style={{ background: `${UNITS.find(u => u.unit === activeUnit)?.color}08`, borderRadius: '12px', padding: '16px 20px', border: `1px solid ${UNITS.find(u => u.unit === activeUnit)?.color}15` }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--analysis-text)', marginBottom: '6px' }}>
                    Unit {activeUnit}: {UNITS.find(u => u.unit === activeUnit)?.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--analysis-muted)', lineHeight: 1.6 }}>
                    {UNIT_INTROS[activeUnit]}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Answer cards */}
          <AnimatePresence mode="wait">
            <motion.div key={activeUnit ?? 'all'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredAnswers.map((topic, i) => (
                <ExamAnswerCard key={`${topic.unit}-${topic.topic}`} topic={topic} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            MCQ FLASH FACTS
        ══════════════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: '80px' }}>
          <SectionTitle label="Part A · 20 × 1 = 20 marks" title="MCQ Flash Facts" desc="Quick 1-line Q&As for the 20 compulsory MCQs. Memorize these." color="#FFC000" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
            {MCQ_FLASH.map((mcq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: (i % 5) * 0.04 }}
                style={{ background: 'var(--analysis-hover)', borderRadius: '10px', padding: '14px 16px', border: '1px solid var(--analysis-border)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--analysis-text)', marginBottom: '6px', lineHeight: 1.4 }}>{mcq.q}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#30d158', fontFamily: "'JetBrains Mono', monospace" }}>{mcq.a}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            APPLICATIONS OVERVIEW
        ══════════════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: '80px' }}>
          <SectionTitle label="Unit 5 · Real-World" title="Where Crypto Lives" desc="Cryptography isn't just theory — it secures everything you use daily." color="#3b82f6" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            {APP_ICONS.map((app, i) => {
              const Icon = app.icon;
              return (
                <motion.div key={app.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.05 }} whileHover={{ y: -4, scale: 1.04 }}
                  style={{ background: `${app.color}06`, borderRadius: '14px', padding: '24px 16px', border: `1px solid ${app.color}15`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'default', textAlign: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${app.color}12`, border: `1.5px solid ${app.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} strokeWidth={1.5} style={{ color: app.color }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: app.color }}>{app.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            EXAM STRATEGY
        ══════════════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ background: 'rgba(220,38,38,0.05)', borderRadius: '16px', padding: '28px 32px', border: '1px solid rgba(220,38,38,0.12)', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Zap size={20} style={{ color: '#dc2626' }} />
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--analysis-text)' }}>Safe Path to 60+/75</span>
          </div>
          {[
            { part: 'Part A (20M)', action: 'Memorize the 15 MCQ flash facts above. Revise Confusion/Diffusion, Avalanche Effect, algorithm security bases.', color: '#FFC000' },
            { part: 'Part B (40M)', action: 'Answer: HMAC vs Hash(Key||Msg), SHA evolution, Stream vs Block, ECC vs RSA, DH + MITM. All 5 are safe picks.', color: '#30d158' },
            { part: 'Part C (15M)', action: 'RSA trapdoor analysis OR AES vs DES structure comparison. Both are high-probability 15-markers.', color: '#dc2626' },
          ].map(({ part, action, color }) => (
            <div key={part} style={{ display: 'flex', gap: '14px', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid var(--analysis-border)' }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color }}>{part}</div>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--analysis-muted)', lineHeight: 1.55 }}>{action}</div>
            </div>
          ))}
          <div style={{ fontSize: '12px', color: 'var(--analysis-subtle)' }}>Keywords to use: Confusion, Diffusion, Avalanche Effect, Trapdoor Function, S-Box, Feistel, SPN, Sponge, Shor's, Grover's, Lattice-based</div>
        </motion.div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '32px 0 16px', borderTop: '1px solid var(--analysis-border)' }}>
          <p style={{ fontSize: '12px', color: 'var(--analysis-subtle)', margin: '0' }}>
            Aswath AS · SRM Institute · 21CSE335T Advanced Cryptography
          </p>
        </div>
      </div>
    </div>
  );
}
