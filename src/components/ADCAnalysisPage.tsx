import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, BookOpen, FileText, ChevronDown, ChevronUp,
  AlertTriangle, Shield, CheckCircle2, Target, Zap, TrendingUp
} from 'lucide-react';

// ─────────────────────────────────────────
// DATA (from 3 PYQ papers: Jan 2026 FN, Jul 2025 FN, May 2025 AN)
// ─────────────────────────────────────────

const PAPERS = [
  {
    code: 'Jan 2026 FN',
    date: '06.01.2026',
    file: '/ADC_Jan26_PYQ.pdf',
    highlight: 'FM Carson\'s rule numerical + AM sideband power',
    keyTopics: ['AM mod index m≤1', 'DSB-SC BW', 'SSB advantage', 'FM deviation ∝ amplitude', 'Carson BW=2(Δf+fm)', 'pre-emphasis', 'Nyquist fs≥2B', 'PAM flat-top hold', 'PWM info in width', 'ASK susceptibility', 'FSK BW≈2fb', 'BPSK 1bit/sym', 'Pn=kTB', 'SNR dB=10log', 'NF ideal=0dB'],
  },
  {
    code: 'Jul 2025 FN',
    date: '14.07.2025',
    file: '/ADC_Jul25_PYQ.pdf',
    highlight: 'Friis cascade + 16-QAM vs QPSK comparison',
    keyTopics: ['AM mod index', 'DSB-SC double SSB BW', 'SSB all advantages', 'FM Carson rule', 'FM deviation ∝ Em', 'pre-emphasis use', 'Nyquist fs≥2B', 'PAM flat-top', 'PWM info in width', 'FSK BW≈2fb', 'QAM 16-points=4bits/sym', 'Pn=kTB', 'SNR dB=10log', 'NF ideal=0dB'],
  },
  {
    code: 'May 2025 AN',
    date: '22.05.2025',
    file: '/ADC_May25_PYQ.pdf',
    highlight: 'DSB-SC vs SSB table + BPSK Pe derivation',
    keyTopics: ['SSB advantage', 'Carson rule', 'FM/PM diff (integration)', 'Nyquist fs≥2B', 'PAM flat-top', 'ASK susceptibility', 'BPSK 1bit/sym', 'Pn=kTB', 'SNR dB=10log', 'NF ideal=0dB'],
  },
];

const STATS = {
  papers: 3,
  mcqs: 20,
  marks: 75,
  safeScore: '65+',
  partB: 5,
  partC: 1,
};

const UNITS = [
  { unit: 1, name: 'AM, DSB-SC, SSB', marks: 20, color: '#ef4444', priority: 'HIGH' },
  { unit: 2, name: 'FM, PM', marks: 15, color: '#ff9f0a', priority: 'HIGH' },
  { unit: 3, name: 'PAM, PWM, PPM, TDM', marks: 15, color: '#2997ff', priority: 'MED' },
  { unit: 4, name: 'ASK, FSK, PSK, QAM', marks: 15, color: '#30d158', priority: 'MED' },
  { unit: 5, name: 'Noise, SNR, Friis', marks: 10, color: '#a855f7', priority: 'HIGH' },
];

// Topic frequency from PYQ analysis — 20 MCQs mapped to 5 units
const TOPICS = [
  { topic: 'AM Modulation Index / Power', score: 100, papers: 3, color: '#ef4444', unit: 1 },
  { topic: "Carson's Rule / FM Bandwidth", score: 100, papers: 3, color: '#ff9f0a', unit: 2 },
  { topic: 'Sampling Theorem / Nyquist', score: 100, papers: 3, color: '#2997ff', unit: 3 },
  { topic: 'BPSK / QPSK / QAM', score: 100, papers: 3, color: '#30d158', unit: 4 },
  { topic: 'Noise / SNR / Friis', score: 100, papers: 3, color: '#a855f7', unit: 5 },
  { topic: 'DSB-SC vs SSB', score: 67, papers: 2, color: '#ef4444', unit: 1 },
  { topic: 'FSK Bandwidth', score: 67, papers: 2, color: '#30d158', unit: 4 },
  { topic: 'PAM / PWM / PPM', score: 67, papers: 2, color: '#2997ff', unit: 3 },
  { topic: 'Deviation Ratio β', score: 67, papers: 2, color: '#ff9f0a', unit: 2 },
  { topic: 'Pre-emphasis / FM-PM', score: 33, papers: 1, color: '#ff9f0a', unit: 2 },
];

// Radar data per unit: [MCQ density, Part B freq, Part C presence] (0-100)
const RADAR_DATA = [
  { unit: 'U1', mcq: 95, partB: 85, partC: 60, label: 'AM/DSB/SC/SSB' },
  { unit: 'U2', mcq: 90, partB: 100, partC: 80, label: 'FM/PM' },
  { unit: 'U3', mcq: 75, partB: 60, partC: 30, label: 'Pulse Mod' },
  { unit: 'U4', mcq: 85, partB: 70, partC: 50, label: 'Digital Mod' },
  { unit: 'U5', mcq: 100, partB: 95, partC: 70, label: 'Noise' },
];

// Heatmap: rows=10 topics, cols=3 papers (Y/N)
const HEATMAP = [
  ['Y', 'Y', 'Y'], // AM mod index/power
  ['Y', 'Y', 'Y'], // Carson rule
  ['Y', 'Y', 'Y'], // Sampling
  ['Y', 'Y', 'Y'], // BPSK/QPSK/QAM
  ['Y', 'Y', 'Y'], // Noise/SNR/Friis
  ['Y', 'Y', 'N'], // DSB-SC vs SSB
  ['Y', 'N', 'Y'], // FSK
  ['Y', 'N', 'Y'], // PAM/PWM/PPM
  ['Y', 'Y', 'N'], // Deviation ratio
  ['N', 'Y', 'N'], // Pre-emphasis/FM-PM
];

// ─────────────────────────────────────────
// PART A MCQs (by topic)
// ─────────────────────────────────────────

const PART_A_MCQS: Record<string, {
  source: string;
  question: string;
  options: string[];
  correct: number; // 0-3
  explanation: string;
}[]> = {
  'AM / Modulation Index': [
    {
      source: 'Jan 26 · Jul 25 · May 25',
      question: 'The modulation index m of AM is defined as:',
      options: ['Em/Ec', 'Ec/Em', 'Ec × Em', '(Ec - Em)/(Ec + Em)'],
      correct: 0,
      explanation: 'm = Em/Ec. Must satisfy m ≤ 1 for undistorted AM. Over-modulation (m > 1) causes envelope to cross zero → message unrecoverable.',
    },
    {
      source: 'Jan 26 · Jul 25',
      question: 'For undistorted AM transmission, the condition on modulation index is:',
      options: ['m = 0', 'm ≤ 1', 'm ≥ 1', 'm = 1'],
      correct: 1,
      explanation: 'm ≤ 1 ensures envelope (Ec + Em sin ωmt) never goes negative. Over-modulation causes distortion.',
    },
    {
      source: 'Jan 26 · Jul 25 · May 25',
      question: 'Total power in AM wave is:',
      options: ['Pc(1 + m)', 'Pc(1 + m²/2)', 'Pc(1 + 2m)', 'Pc(1 - m²)'],
      correct: 1,
      explanation: 'Pt = Pc(1 + m²/2). Carrier power unchanged; sidebands carry (m²/2) × Pc total.',
    },
    {
      source: 'Jul 25',
      question: 'DSB-SC bandwidth compared to SSB is:',
      options: ['Same', 'Double', 'Half', 'Four times'],
      correct: 1,
      explanation: 'DSB-SC: BW = 2fm. SSB: BW = fm. DSB-SC BW is exactly double SSB BW.',
    },
  ],
  'FM / Carson\'s Rule': [
    {
      source: 'Jan 26 · Jul 25 · May 25',
      question: "Carson's rule for FM bandwidth states:",
      options: ['BW = 2fm', 'BW = 2(Δf + fm)', 'BW = Δf/fm', 'BW = fm/Δf'],
      correct: 1,
      explanation: "BW = 2(Δf + fm). Captures ~98% of FM power.",
    },
    {
      source: 'Jan 26 · Jul 25 · May 25',
      question: 'In FM, frequency deviation Δf is directly proportional to:',
      options: ['Carrier frequency fc', 'Modulating frequency fm', 'Amplitude of modulating signal Em', 'Phase of carrier'],
      correct: 2,
      explanation: 'Δf = kf × Em. Deviation depends on message amplitude, NOT frequency.',
    },
    {
      source: 'Jan 26',
      question: 'Deviation ratio β is defined as:',
      options: ['Δf × fm', 'Δf/fm', 'fm/Δf', '2(Δf + fm)'],
      correct: 1,
      explanation: 'β = Δf/fm. Broadcast FM: Δf = 75 kHz, fm(max) = 15 kHz, β = 5, BW = 180 kHz.',
    },
    {
      source: 'Jul 25',
      question: 'In Armstrong indirect FM, the message signal is first:',
      options: ['Differentiated', 'Integrated', 'Amplified', 'Filtered'],
      correct: 1,
      explanation: 'Message integrated → PM → NBFM → frequency multiplied ×72 → WBFM at 88-108 MHz.',
    },
  ],
  'Sampling / PAM / PWM': [
    {
      source: 'Jan 26 · Jul 25 · May 25',
      question: 'Nyquist sampling theorem requires fs:',
      options: ['Equal to signal frequency', 'Greater than twice signal bandwidth', 'Less than signal frequency', 'Equal to signal bandwidth'],
      correct: 1,
      explanation: 'fs ≥ 2B where B is message bandwidth. Prevents aliasing.',
    },
    {
      source: 'May 25 · Jan 26',
      question: 'In flat-top PAM, each pulse:',
      options: ['Varies in width', 'Is held constant at sample value for entire duration', 'Varies in position', 'Has zero amplitude'],
      correct: 1,
      explanation: 'Flat-top PAM uses sample-and-hold: pulse amplitude held constant for entire pulse duration.',
    },
    {
      source: 'Jul 25',
      question: 'In PWM, information is encoded in:',
      options: ['Pulse amplitude', 'Pulse position', 'Pulse width/duty cycle', 'Pulse frequency'],
      correct: 2,
      explanation: 'PWM varies pulse width proportionally to message amplitude. Generated by comparing with triangular waveform.',
    },
    {
      source: 'May 25',
      question: 'PPM is derived from PWM by:',
      options: ['Amplitude comparison', 'Differentiation', 'Integration', 'Rectification'],
      correct: 1,
      explanation: 'PPM obtained by differentiating PWM. Trailing edge position varies with PWM width → carries message.',
    },
  ],
  'Digital Modulation': [
    {
      source: 'Jan 26 · Jul 25 · May 25',
      question: 'BPSK transmits _______ bit(s) per symbol:',
      options: ['1', '2', '4', '8'],
      correct: 0,
      explanation: 'BPSK: 1 bit/symbol. QPSK: 2 bits/symbol. 16-QAM: 4 bits/symbol.',
    },
    {
      source: 'Jul 25',
      question: '16-QAM constellation has _______ points and transmits _______ bits/symbol:',
      options: ['8, 3', '16, 4', '32, 5', '4, 2'],
      correct: 1,
      explanation: '16-QAM = 16 points = 2⁴ = 4 bits/symbol. QPSK = 4 points = 2 bits/symbol.',
    },
    {
      source: 'May 25',
      question: 'ASK is most susceptible to:',
      options: ['Noise', 'Distortion', 'Interference', 'Fading'],
      correct: 0,
      explanation: 'ASK amplitude varies with data → noise directly corrupts amplitude → most vulnerable to noise.',
    },
    {
      source: 'Jan 26 · Jul 25',
      question: 'FSK bandwidth is approximately:',
      options: ['fb', '2fb', '4fb', 'fb/2'],
      correct: 1,
      explanation: 'FSK BW ≈ 2fb where fb is bit rate. Accounts for mark and space frequencies.',
    },
  ],
  'Noise / SNR': [
    {
      source: 'Jan 26 · Jul 25 · May 25',
      question: 'Thermal noise power Pn =',
      options: ['kTB', 'kT/B', 'kBT', 'k²TB'],
      correct: 0,
      explanation: 'Pn = kTB where k = 1.38 × 10⁻²³ J/K (Boltzmann constant), T in K, B in Hz.',
    },
    {
      source: 'Jan 26 · Jul 25 · May 25',
      question: 'SNR in dB =',
      options: ['10 log₁₀(Ps/Pn)', '20 log₁₀(Ps/Pn)', 'log₁₀(Ps/Pn)', 'ln(Ps/Pn)'],
      correct: 0,
      explanation: 'SNR(dB) = 10 log₁₀(Ps/Pn) for power ratios. Use 20 log for voltage ratios.',
    },
    {
      source: 'May 25',
      question: 'Ideal amplifier noise figure is:',
      options: ['0 dB', '1 dB', '3 dB', '∞'],
      correct: 0,
      explanation: 'Ideal NF = 0 dB (no noise added). Real amplifiers have NF > 0 dB.',
    },
    {
      source: 'Jul 25',
      question: 'Equivalent noise temperature Te is related to F by:',
      options: ['Te = T/(F-1)', 'Te = T(F-1)', 'Te = F(T-1)', 'Te = T/F'],
      correct: 1,
      explanation: 'Te = T(F - 1) where T is reference temperature (typically 290 K).',
    },
  ],
};

// ─────────────────────────────────────────
// PART B QUESTIONS
// ─────────────────────────────────────────

const PART_B_QUESTIONS = [
  {
    unit: 1,
    question: 'Derive the AM wave equation. Define modulation index and state the condition for undistorted AM transmission.',
    marks: 8,
    sources: ['Jan 26', 'Jul 25'],
    keyPoints: [
      's(t) = [Ec + Em sin ωmt] sin ωct',
      'Expand: Ec sin ωct + (mEc/2)[cos(ωc-ωm)t - cos(ωc+ωm)t]',
      'm = Em/Ec — modulation index',
      'm ≤ 1 for undistorted AM',
      'Over-modulation (m > 1): envelope crosses zero → distortion',
      'Total power: Pt = Pc(1 + m²/2)',
    ],
  },
  {
    unit: 1,
    question: 'Compare AM, DSB-SC, and SSB in terms of bandwidth, power efficiency, detection method, and applications.',
    marks: 8,
    sources: ['Jul 25', 'May 25'],
    keyPoints: [
      'AM: carrier present, BW = 2fm, envelope detection',
      'DSB-SC: carrier suppressed, BW = 2fm, coherent detection',
      'SSB: one sideband, BW = fm, coherent detection, most efficient',
      'SSB advantages: half BW, less power, better SNR',
      'Detection complexity: AM simplest, SSB hardest',
    ],
  },
  {
    unit: 2,
    question: 'Explain FM generation using Armstrong indirect method. Derive Carson\'s rule and compute BW for Δf = 75 kHz, fm = 15 kHz.',
    marks: 8,
    sources: ['Jul 25', 'Jan 26'],
    keyPoints: [
      'Integrate → PM → NBFM → multiply ×72 → WBFM at 88-108 MHz',
      'Why integrate first? FM = PM with integrated message',
      'Carson\'s rule: BW = 2(Δf + fm)',
      'β = Δf/fm',
      'Numerical: β = 75/15 = 5, BW = 2(75+15) = 180 kHz',
    ],
  },
  {
    unit: 3,
    question: 'State and prove the sampling theorem. What is aliasing and how is it prevented?',
    marks: 8,
    sources: ['Jan 26', 'Jul 25'],
    keyPoints: [
      'fs ≥ 2B — Nyquist rate, B = message bandwidth',
      'Sampled spectrum: replicas at multiples of fs',
      'fs < 2B → aliasing (overlap) → original unrecoverable',
      'Pre-alias filter (LPF cutoff ≤ fs/2) essential',
      'Telephony: B = 4 kHz, fs = 8 kHz standard',
    ],
  },
  {
    unit: 4,
    question: 'Explain BPSK generation and coherent detection. Derive Pe = Q(√(2Es/N0)).',
    marks: 8,
    sources: ['Jan 26', 'May 25'],
    keyPoints: [
      'BPSK: s(t) = ±Acos(ωct), phase difference π',
      'Constellation: (±√Es, 0), 1 bit/symbol',
      'Coherent detection: multiply by cos, LPF, threshold at 0',
      'Pe = Q(√(2Es/N0))',
      'Most noise-immune binary modulation',
    ],
  },
];

// ─────────────────────────────────────────
// PART C QUESTIONS (Numericals)
// ─────────────────────────────────────────

const PART_C_QUESTIONS = [
  {
    scenario: 'A two-stage amplifier cascade has: Stage 1: F1 = 4 (linear), G1 = 20 dB. Stage 2: F2 = 9 (linear), G2 = 30 dB. (i) Convert G1 and G2 to linear. (ii) Find overall noise figure using Friis formula. (iii) Find Te for T0 = 290 K. (iv) Calculate percentage contribution of each stage.',
    rank: 'HIGHLY PROBABLE',
    rankColor: '#ef4444',
    probability: 90,
    unit: 5,
    sources: ['Jan 26', 'Jul 25', 'May 25'],
    solution: [
      { step: '(i) Convert gains', value: 'G1 = 10^(20/10) = 100, G2 = 10^(30/10) = 1000' },
      { step: '(ii) Friis formula', value: 'Ftotal = F1 + (F2-1)/G1 = 4 + (9-1)/100 = 4.08' },
      { step: 'NFtotal', value: '10 log(4.08) = 6.11 dB' },
      { step: '(iii) Te', value: 'Te = T0(Ftotal-1) = 290 × 3.08 = 893.2 K' },
      { step: 'Stage 1 contribution', value: '870 K = 97.4% — FIRST STAGE DOMINATES' },
      { step: 'Stage 2 contribution', value: '23.2 K = 2.6% — divided by G1' },
    ],
  },
];

// ─────────────────────────────────────────
// STYLES (Google Fonts injected via style tag)
// ─────────────────────────────────────────

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .adc-page {
    font-family: 'Space Grotesk', sans-serif;
    background: #0a0a0a;
    color: #e5e5e5;
    min-height: 100vh;
  }

  .mono {
    font-family: 'JetBrains Mono', monospace;
  }

  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  @keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.97; }
  }

  .scanline-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
  }

  .scanline-overlay::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(180deg, transparent, rgba(41,151,255,0.15), transparent);
    animation: scanline 4s linear infinite;
  }

  .scanline-overlay::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.03) 2px,
      rgba(0,0,0,0.03) 4px
    );
  }

  .card {
    background: #1c1c1e;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    overflow: hidden;
  }

  .card-glow:hover {
    box-shadow: 0 0 30px rgba(41,151,255,0.1);
  }

  .tag-danger { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; }
  .tag-warning { background: rgba(255,159,10,0.15); border: 1px solid rgba(255,159,10,0.3); color: #ff9f0a; }
  .tag-success { background: rgba(48,209,88,0.15); border: 1px solid rgba(48,209,88,0.3); color: #30d158; }
  .tag-info { background: rgba(41,151,255,0.15); border: 1px solid rgba(41,151,255,0.3); color: #2997ff; }
  .tag-purple { background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.3); color: #a855f7; }
`;

// ─────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────

function StickyHeader({ onBack, activeTab, onTabChange }: {
  onBack: () => void;
  activeTab: string;
  onTabChange: (t: string) => void;
}) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,10,10,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '0 clamp(16px, 4vw, 32px)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center', gap: 16,
        height: 56,
      }}>
        <button onClick={onBack} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8, padding: '6px 8px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', color: '#e5e5e5',
        }}>
          <ArrowLeft size={16} />
        </button>
        <div style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 10, color: '#ff9f0a', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            21ECC302T
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>
            Analog and Digital Communication
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 4 }}>
          {[
            { key: 'analysis', label: 'Analysis' },
            { key: 'mastersheet', label: 'Master Sheet' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              style={{
                padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                background: activeTab === tab.key ? '#2997ff' : 'transparent',
                color: activeTab === tab.key ? '#fff' : '#888',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/ADC_Syllabus.pdf" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.06)', color: '#888',
            textDecoration: 'none', fontSize: 12, border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <BookOpen size={12} /> Syllabus
          </a>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(180deg, #0f0f12 0%, #0a0a0a 100%)',
      padding: 'clamp(40px, 8vw, 80px) clamp(16px, 4vw, 48px)',
      overflow: 'hidden',
    }}>
      <div className="scanline-overlay" />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(41,151,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(41,151,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        zIndex: 0,
      }} />

      {/* Corner accents */}
      <div style={{ position: 'absolute', top: 16, left: 16, width: 40, height: 1, background: '#2997ff', opacity: 0.4 }} />
      <div style={{ position: 'absolute', top: 16, left: 16, width: 1, height: 40, background: '#2997ff', opacity: 0.4 }} />
      <div style={{ position: 'absolute', bottom: 16, right: 16, width: 40, height: 1, background: '#2997ff', opacity: 0.4 }} />
      <div style={{ position: 'absolute', bottom: 16, right: 16, width: 1, height: 40, background: '#2997ff', opacity: 0.4 }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Header line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div className="mono" style={{ fontSize: 10, color: '#ff4444', letterSpacing: '0.1em' }}>
            ██ EXAM COMMAND CENTER ██
          </div>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />
          <div className="mono" style={{ fontSize: 10, color: '#666', letterSpacing: '0.1em' }}>
            21ECC302T — ADC
          </div>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: 'clamp(24px, 5vw, 42px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.03em',
            marginBottom: 8,
            lineHeight: 1.1,
          }}
        >
          Analog & Digital<br />
          <span style={{ color: '#2997ff' }}>Communication</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ fontSize: 14, color: '#888', marginBottom: 32, maxWidth: 500 }}
        >
          PYQ analysis across 3 semester papers. Unit-wise coverage, probability rankings, and predicted questions for upcoming exam.
        </motion.p>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 12,
          marginBottom: 24,
          maxWidth: 700,
        }}>
          {[
            { n: STATS.papers, l: 'Papers Analyzed', c: '#2997ff', icon: '◆' },
            { n: STATS.mcqs, l: 'MCQs Covered', c: '#30d158', icon: '◇' },
            { n: STATS.marks, l: 'Total Marks', c: '#ff9f0a', icon: '◈' },
            { n: STATS.safeScore, l: 'Safe Score', c: '#ef4444', icon: '▲' },
          ].map(({ n, l, c }, i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${c}25`,
                borderLeft: `2px solid ${c}`,
                borderRadius: 8, padding: '14px 16px',
              }}
            >
              <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: c, letterSpacing: '-0.04em' }}>{n}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
            </motion.div>
          ))}
        </div>

        {/* Alert badges */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { icon: <CheckCircle2 size={11} />, text: 'FM Carson\'s rule — 3/3 papers', color: '#ff9f0a' },
            { icon: <CheckCircle2 size={11} />, text: 'Noise/Friis — 3/3 papers', color: '#a855f7' },
            { icon: <CheckCircle2 size={11} />, text: 'AM mod index — 3/3 papers', color: '#ef4444' },
            { icon: <AlertTriangle size={11} />, text: 'U2 + U5 highest priority — 25 marks guaranteed', color: '#ef4444' },
          ].map(({ icon, text, color }) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 6,
                background: `${color}12`, border: `1px solid ${color}25`,
                fontSize: 12, color: '#ccc',
              }}
            >
              <span style={{ color }}>{icon}</span>
              {text}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// RADAR CHART (SVG, pure React)
// ─────────────────────────────────────────

function RadarChart() {
  const cx = 160, cy = 145, r = 100;
  const axes = 5;
  const datasets = [
    { label: 'MCQ Density', color: '#2997ff', values: RADAR_DATA.map(d => d.mcq) },
    { label: 'Part B Frequency', color: '#ff9f0a', values: RADAR_DATA.map(d => d.partB) },
    { label: 'Part C Presence', color: '#ef4444', values: RADAR_DATA.map(d => d.partC) },
  ];

  const toXY = (i: number, val: number) => {
    const angle = (Math.PI * 2 * i) / axes - Math.PI / 2;
    const dist = (val / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const gridLevels = [20, 40, 60, 80, 100];

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Target size={14} color="#2997ff" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>
          UNIT COVERAGE RADAR
        </h3>
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <svg width={320} height={290} viewBox="0 0 320 290">
          {/* Grid rings */}
          {gridLevels.map(level => {
            const pts = Array.from({ length: axes }, (_, i) => {
              const { x, y } = toXY(i, level);
              return `${x},${y}`;
            }).join(' ');
            return <polygon key={level} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />;
          })}

          {/* Axis lines */}
          {Array.from({ length: axes }, (_, i) => {
            const { x, y } = toXY(i, 100);
            return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />;
          })}

          {/* Unit labels */}
          {RADAR_DATA.map((d, i) => {
            const { x, y } = toXY(i, 118);
            return (
              <text key={d.unit} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                fontSize={10} fontWeight={600} fill="#888" fontFamily="'JetBrains Mono', monospace">
                {d.unit}
              </text>
            );
          })}

          {/* Dataset polygons */}
          {datasets.map((ds, di) => {
            const pts = ds.values.map((v, i) => {
              const { x, y } = toXY(i, v);
              return `${x},${y}`;
            }).join(' ');
            return (
              <polygon key={di} points={pts} fill={`${ds.color}18`} stroke={ds.color} strokeWidth={1.5}
                opacity={0.9} />
            );
          })}

          {/* Data points */}
          {datasets.map((ds, di) =>
            ds.values.map((v, i) => {
              const { x, y } = toXY(i, v);
              return <circle key={`${di}-${i}`} cx={x} cy={y} r={3} fill={ds.color} />;
            })
          )}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {datasets.map((ds) => (
            <div key={ds.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 2, background: ds.color, borderRadius: 1 }} />
              <span style={{ fontSize: 11, color: '#888', fontFamily: "'JetBrains Mono', monospace" }}>{ds.label}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: 10, color: '#555', lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace" }}>
            5 axes = 5 units<br />
            Outer ring = 100<br />
            U2 (FM) highest Part B<br />
            U5 (Noise) highest MCQ/C
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// TOPIC FREQUENCY BARS
// ─────────────────────────────────────────

function TopicFreqBars() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <TrendingUp size={14} color="#30d158" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>
          TOPIC PRIORITY SCORE
        </h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {TOPICS.map((t, i) => (
          <div key={t.topic}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 11, color: '#ccc' }}>{t.topic}</span>
              <span className="mono" style={{ fontSize: 10, color: '#666' }}>{t.score}% · {t.papers}/3</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${t.score}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: '100%',
                  background: t.color,
                  borderRadius: 2,
                  boxShadow: `0 0 6px ${t.color}40`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// HEATMAP
// ─────────────────────────────────────────

function Heatmap() {
  const paperLabels = ['Jan 26', 'Jul 25', 'May 25'];
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Zap size={14} color="#ff9f0a" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>
          PAPER × TOPIC HEATMAP
        </h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 450 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', fontSize: 10, color: '#555', fontWeight: 500, padding: '0 10px 8px 0', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Topic</th>
              {paperLabels.map(p => (
                <th key={p} style={{ textAlign: 'center', fontSize: 10, color: '#555', fontWeight: 500, padding: '0 0 8px 8px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOPICS.map((t, i) => (
              <tr key={t.topic} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                <td style={{ fontSize: 11, color: '#bbb', padding: '6px 10px 6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', whiteSpace: 'nowrap' }}>{t.topic}</td>
                {HEATMAP[i].map((val, j) => (
                  <td key={j} style={{ textAlign: 'center', padding: '6px 0 6px 8px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    {val === 'Y' ? (
                      <div style={{
                        width: 20, height: 20, borderRadius: 4,
                        background: 'rgba(48,209,88,0.12)', border: '1px solid rgba(48,209,88,0.25)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: 2, background: '#30d158' }} />
                      </div>
                    ) : (
                      <div style={{
                        width: 20, height: 20, borderRadius: 4,
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: 2, background: '#333' }} />
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// PYQ PAPER CARDS
// ─────────────────────────────────────────

function PYQCards() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <FileText size={14} color="#2997ff" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>
          PYQ PAPER SOURCES
        </h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        {PAPERS.map((p, i) => (
          <motion.a
            key={p.code}
            href={p.file}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{ textDecoration: 'none' }}
          >
            <div className="card card-glow" style={{ padding: '16px 18px', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div className="mono" style={{ fontSize: 11, color: '#ff9f0a', marginBottom: 2 }}>{p.code}</div>
                  <div className="mono" style={{ fontSize: 10, color: '#555' }}>{p.date}</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#30d158', boxShadow: '0 0 8px rgba(48,209,88,0.5)' }} />
              </div>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 8, lineHeight: 1.5 }}>
                <Shield size={9} style={{ display: 'inline', marginRight: 4 }} />
                {p.highlight}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {p.keyTopics.slice(0, 3).map(t => (
                  <span key={t} style={{ fontSize: 9, color: '#666', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                    {t}
                  </span>
                ))}
                {p.keyTopics.length > 3 && (
                  <span style={{ fontSize: 9, color: '#555', padding: '2px 6px' }}>+{p.keyTopics.length - 3}</span>
                )}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ACCORDION
// ─────────────────────────────────────────

function AccordionItem({
  title, children, defaultOpen = false, color = '#2997ff'
}: {
  title: string; children: React.ReactNode; defaultOpen?: boolean; color?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden', marginBottom: 6,
      background: open ? `${color}08` : 'transparent',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 14px', background: 'transparent',
          border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: open ? color : '#ccc' }}>{title}</span>

        </div>
        {open ? <ChevronUp size={14} color={color} /> : <ChevronDown size={14} color="#555" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${color}15` }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────
// MASTER SHEET
// ─────────────────────────────────────────

function MasterSheet() {
  const [activeUnit, setActiveUnit] = useState<number | 'all'>('all');
  const [activePartA, setActivePartA] = useState<string>('AM / Modulation Index');

  const units = [
    { n: 'All', v: 'all' as const },
    { n: 'U1', v: 1 as const },
    { n: 'U2', v: 2 as const },
    { n: 'U3', v: 3 as const },
    { n: 'U4', v: 4 as const },
    { n: 'U5', v: 5 as const },
  ];

  const topicsPartA = Object.keys(PART_A_MCQS);

  const filteredPartB = PART_B_QUESTIONS.filter(q => activeUnit === 'all' || q.unit === activeUnit);
  const filteredPartC = PART_C_QUESTIONS.filter(q => activeUnit === 'all' || q.unit === activeUnit);

  const unitColors: Record<number, string> = { 1: '#ef4444', 2: '#ff9f0a', 3: '#2997ff', 4: '#30d158', 5: '#a855f7' };

  return (
    <div>
      {/* Unit filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {units.map(u => (
          <button
            key={u.n}
            onClick={() => setActiveUnit(u.v)}
            style={{
              padding: '6px 16px', borderRadius: 9999, cursor: 'pointer',
              fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
              background: activeUnit === u.v ? '#2997ff' : 'rgba(255,255,255,0.06)',
              color: activeUnit === u.v ? '#fff' : '#888',
              border: activeUnit === u.v ? '1px solid rgba(41,151,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {u.n}
          </button>
        ))}
      </div>

      {/* Part A section */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 3, height: 16, background: '#ef4444', borderRadius: 2 }} />
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>PART A — MCQ Analysis</h3>
          <span className="mono" style={{ fontSize: 11, color: '#555', marginLeft: 4 }}>18 × 1 = 18 marks</span>
        </div>

        {/* Topic selector for Part A */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {topicsPartA.map(topic => (
            <button
              key={topic}
              onClick={() => setActivePartA(topic)}
              style={{
                padding: '4px 12px', borderRadius: 6, cursor: 'pointer',
                fontSize: 11, fontWeight: 500, fontFamily: 'inherit',
                background: activePartA === topic ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.04)',
                color: activePartA === topic ? '#ef4444' : '#888',
                border: activePartA === topic ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* MCQs for selected topic */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PART_A_MCQS[activePartA]?.map((mcq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card"
              style={{ padding: 16 }}
            >
              <div className="mono" style={{ fontSize: 9, color: '#555', marginBottom: 8 }}>{mcq.source}</div>
              <div style={{ fontSize: 13, color: '#e5e5e5', marginBottom: 12, lineHeight: 1.5 }}>{mcq.question}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {mcq.options.map((opt, oi) => (
                  <div
                    key={oi}
                    style={{
                      padding: '8px 12px', borderRadius: 6, fontSize: 12,
                      background: oi === mcq.correct ? 'rgba(48,209,88,0.15)' : 'rgba(255,255,255,0.03)',
                      border: oi === mcq.correct ? '1px solid rgba(48,209,88,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      color: oi === mcq.correct ? '#30d158' : '#999',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    <span style={{ color: oi === mcq.correct ? '#30d158' : '#555', marginRight: 6 }}>
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 11, color: '#666' }}>{mcq.explanation}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Part B section */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 3, height: 16, background: '#ff9f0a', borderRadius: 2 }} />
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>PART B — Long Answer</h3>
          <span className="mono" style={{ fontSize: 11, color: '#555', marginLeft: 4 }}>5 × 8 = 40 marks</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredPartB.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <AccordionItem
                title={`U${q.unit} — ${q.question.slice(0, 60)}...`}
                defaultOpen={i === 0}
                color={unitColors[q.unit]}
                
              >
                <div style={{ marginBottom: 12 }}>
                  <div className="mono" style={{ fontSize: 10, color: '#666', marginBottom: 8 }}>
                    Sources: {q.sources.join(' | ')}
                  </div>
                  <div style={{ fontSize: 13, color: '#ddd', lineHeight: 1.6, marginBottom: 12 }}>
                    {q.question}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 11, color: '#ff9f0a', marginBottom: 8, fontWeight: 600 }}>KEY POINTS</div>
                  {q.keyPoints.map((kp, ki) => (
                    <div key={ki} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                      <span style={{ color: '#555', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>{ki + 1}.</span>
                      <span style={{ fontSize: 12, color: '#bbb', lineHeight: 1.5 }}>{kp}</span>
                    </div>
                  ))}
                </div>
              </AccordionItem>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Part C section */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 3, height: 16, background: '#30d158', borderRadius: 2 }} />
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>PART C — Numerical Predictions</h3>
          <span className="mono" style={{ fontSize: 11, color: '#555', marginLeft: 4 }}>1 × 15 = 15 marks</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredPartC.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card"
              style={{ padding: 16, borderLeft: `3px solid ${q.rankColor}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: q.rankColor, fontWeight: 700, marginBottom: 4 }}>
                    {q.rank} — {q.probability}% probability
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: '#555' }}>
                    Sources: {q.sources.join(' | ')} | Unit {q.unit}
                  </div>
                </div>
                <div style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                  background: `${q.rankColor}15`, color: q.rankColor,
                  border: `1px solid ${q.rankColor}30`,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  U{q.unit}
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#ccc', marginBottom: 14, lineHeight: 1.5 }}>
                {q.scenario}
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 11, color: '#30d158', marginBottom: 8, fontWeight: 600 }}>STEP-BY-STEP SOLUTION</div>
                {q.solution.map((s, si) => (
                  <div key={si} style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
                    <span className="mono" style={{ fontSize: 10, color: '#555', minWidth: 16 }}>{si + 1}.</span>
                    <div>
                      {s.step && <span style={{ fontSize: 11, color: '#999' }}>{s.step}: </span>}
                      <span className="mono" style={{ fontSize: 11, color: '#30d158' }}>{s.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Exam Strategy */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <AlertTriangle size={14} color="#ef4444" />
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>EXAM STRATEGY</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {/* Score breakdown */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: '#ff9f0a', fontWeight: 600, marginBottom: 12 }}>SCORE BREAKDOWN TARGET</div>
            {[
              { part: 'Part A (MCQs)', target: '16/18', color: '#30d158', note: 'Skip 2 max — be decisive' },
              { part: 'Part B (Long)', target: '32/40', color: '#2997ff', note: '5 questions × 8 marks' },
              { part: 'Part C (Numerical)', target: '13/15', color: '#a855f7', note: '1 numerical, full marks' },
              { part: 'TOTAL', target: '64+/75', color: '#ff9f0a', note: 'Safe passing zone' },
            ].map(s => (
              <div key={s.part} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 12, color: '#ccc' }}>{s.part}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="mono" style={{ fontSize: 13, color: s.color, fontWeight: 600 }}>{s.target}</span>
                  <span style={{ fontSize: 10, color: '#555' }}>{s.note}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Part-wise tips */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, marginBottom: 12 }}>PART-WISE TIPS</div>
            {[
              { part: 'Part A', tip: 'Carson rule, AM index, Nyquist, BPSK, Pn=kTB — all appeared 3/3. Memorize formulas first.' },
              { part: 'Part B', tip: 'Pick: AM derivation, FM+Carson, Sampling, Noise/Friis. Write key formulas, derive where asked.' },
              { part: 'Part C', tip: 'Friis cascade numerical (HIGHLY PROBABLE). Show: given → convert dB to linear → apply Friis formula → find Te. Step-by-step essential.' },
              { part: 'Time', tip: 'Part A: 15 min. Part B: 50 min. Part C: 20 min. Buffer: 5 min. Total: 90 min.' },
            ].map(t => (
              <div key={t.part} style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: '#ff9f0a', fontWeight: 600 }}>{t.part}:</span>
                <span style={{ fontSize: 11, color: '#999', marginLeft: 6 }}>{t.tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unit priority table */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Shield size={14} color="#2997ff" />
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>UNIT PRIORITY MATRIX</h3>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Unit', 'Topic', 'Marks', 'MCQ', 'Part B', 'Part C', 'Priority'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: '#555', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'JetBrains Mono', monospace" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {UNITS.map((u, i) => {
                const rowColors: Record<string, string> = { 'HIGH': '#ef4444', 'MED': '#ff9f0a' };
                return (
                  <tr key={u.unit} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: u.color, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>U{u.unit}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: '#ccc' }}>{u.name}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: '#888', fontFamily: "'JetBrains Mono', monospace" }}>{u.marks}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: '#30d158', fontFamily: "'JetBrains Mono', monospace" }}>{(RADAR_DATA[i]?.mcq ?? 0) / 100 > 0.8 ? 'HIGH' : 'MED'}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: '#ff9f0a', fontFamily: "'JetBrains Mono', monospace" }}>{(RADAR_DATA[i]?.partB ?? 0) / 100 > 0.85 ? 'HIGH' : 'MED'}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: '#a855f7', fontFamily: "'JetBrains Mono', monospace" }}>{(RADAR_DATA[i]?.partC ?? 0) / 100 > 0.6 ? 'HIGH' : (RADAR_DATA[i]?.partC ?? 0) / 100 > 0.3 ? 'MED' : 'LOW'}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                        background: `${rowColors[u.priority]}18`, color: rowColors[u.priority],
                        border: `1px solid ${rowColors[u.priority]}30`,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {u.priority}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────

interface Props { onBack: () => void; }

export function ADCAnalysisPage({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'mastersheet'>('analysis');

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div className="adc-page">
        <StickyHeader onBack={onBack} activeTab={activeTab} onTabChange={(t) => setActiveTab(t as typeof activeTab)} />
        <HeroSection />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(16px, 4vw, 48px) clamp(16px, 4vw, 48px) 80px' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'analysis' ? (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Charts row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
                  <RadarChart />
                  <TopicFreqBars />
                </div>

                {/* Heatmap */}
                <div style={{ marginBottom: 16 }}>
                  <Heatmap />
                </div>

                {/* PYQ Cards */}
                <PYQCards />
              </motion.div>
            ) : (
              <motion.div
                key="mastersheet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <MasterSheet />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
