import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle, AlertTriangle, Target, TrendingUp, Zap, ChevronDown, ChevronUp, Star, Award, FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router';

/* ─── DATA ─────────────────────────────────────────────────── */

const MCQ_TOPICS = [
  // Unit 1 — Analog Modulation
  { unit: 1, topic: 'AM expression: s(t) = [Ac + m(t)] cos(2πfc t)', prob: 95, tip: 'AM wave = carrier + message. Modulation index micro  = Am/Ac. micro  > 1 = overmodulation.', trap: 'Overmodulation (micro  > 1) distorts the message. Keep micro  ≤ 1.' },
  { unit: 1, topic: 'DSBSC vs SSB vs VSB', prob: 92, tip: 'DSBSC: carrier suppressed, two sidebands. SSB: one sideband only. VSB: vestigial sideband (TV broadcast).', trap: 'SSB needs a Hilbert transform or phase-shift network — not just a filter.' },
  { unit: 1, topic: 'FM deviation: Deltaf = Kf*Am', prob: 90, tip: 'Frequency deviation Deltaf proportional to message amplitude. Carson\'s rule: BW = 2(Deltaf + fm).', trap: 'PM: phase deviation proportional to message amplitude. FM: frequency deviation proportional to message amplitude. Know which is which.' },
  { unit: 1, topic: 'Need for modulation', prob: 85, tip: 'Antenna size ∝ λ/4. Modulation reduces antenna size. Also enables multiplexing and spectrum efficiency.', trap: null },
  { unit: 1, topic: 'Standard AM broadcast band', prob: 80, tip: 'AM broadcast: 535–1700 kHz (fc). Each station spaced 10 kHz apart. Audio BW = 5 kHz.', trap: null },
  { unit: 1, topic: 'Image frequency rejection in superhet', prob: 78, tip: 'Image freq = fRF + 2×IF. Higher IF gives better image rejection. Standard IF: 455 kHz (AM), 10.7 MHz (FM).', trap: 'Image freq formula: fIMG = fRF + 2×IF, NOT fRF + IF.' },
  { unit: 2, topic: 'PCM: sampling theorem, quantisation', prob: 98, tip: 'Nyquist: fs ≥ 2B. 16-bit PCM gives 96 dB SNR. Companding (micro -law/A-law) reduces bit rate.', trap: 'Higher sampling rate ≠ better PCM. Bit depth (quantisation levels) determines SNR.' },
  { unit: 2, topic: 'Delta modulation (DM) — slope overload', prob: 92, tip: 'DM: 1-bit quantiser. Slope overload occurs when message slope > step size/step interval. Solution: increase Delta or decrease Ts.', trap: 'DM Slope overload is the MAIN disadvantage — not granular noise.' },
  { unit: 2, topic: 'FSK: bit rate vs baud, bandwidth', prob: 90, tip: 'FSK: two frequencies f1 and f2. BW ≈ 2Deltaf + 2B. Non-coherent detection (envelope detector) possible.', trap: 'ASK is ON/OFF keying. FSK is frequency shift. PSK is phase shift. Know the difference.' },
  { unit: 2, topic: 'BPSK, QPSK, 16-QAM constellations', prob: 88, tip: 'BPSK = 2 points (180° apart). QPSK = 4 points (90° apart). 16-QAM = 16 points (grid). More points = more bits/symbol.', trap: 'QPSK carries 2 bits/symbol, NOT 4. 16-QAM carries 4 bits/symbol.' },
  { unit: 2, topic: 'Inter-symbol interference (ISI) — Nyquist', prob: 85, tip: 'ISI-free condition: pulses sampled at t = kT satisfy Nyquist criterion. Raised cosine spectrum eliminates ISI.', trap: 'Nyquist rate for zero ISI: symbol rate = 2B for baseband. NOT fs = 2B for passband FSK.' },
  { unit: 2, topic: 'Match filter: impulse response h(t) = s(T−t)', prob: 82, tip: 'Matched filter maximises SNR at sampling instant. Impulse response is time-reversed version of signal.', trap: 'The matched filter is NOT an equalizer. It is the optimal receiver for known signals in AWGN.' },
  { unit: 3, topic: 'Shannon-Hartley: C = B log2(1 + SNR)', prob: 98, tip: 'Capacity C (bps) = B (Hz) × log2(1 + SNR). Doubling B doubles capacity but only adds ~0.415 bit/s/Hz per doubling.', trap: 'log2(1+x) ≈ x/ln2 for small x. For SNR >> 1, C ≈ B × SNR / ln2.' },
  { unit: 3, topic: 'Source coding: Huffman vs Shannon-Fano', prob: 90, tip: 'Huffman: prefix-free, optimal for minimum redundancy. Shannon-Fano: top-down splitting, near-optimal.', trap: 'Huffman is provably optimal (minimum variance). Shannon-Fano is a heuristic — not always optimal.' },
  { unit: 3, topic: 'Channel coding: Block codes (n, k) vs Convolution', prob: 88, tip: 'Block: (n,k) — each block encoded independently. Convolution: encoder has memory — past bits influence output.', trap: 'Cyclic codes are a SUBSET of linear block codes with cyclic shift property.' },
  { unit: 3, topic: 'Hamming code: dmin = 3, can correct 1 error', prob: 92, tip: 'Hamming (n,k) with dmin=3. Syndrome bits = log2(n+1). Can detect up to 2 errors, correct 1. Extended Hamming adds parity for dmin=4.', trap: 'Hamming distance = minimum number of bit positions differing. dmin=3 means it can correct SINGLE-bit errors, not double.' },
  { unit: 3, topic: 'Cyclic codes: generator polynomial g(x)', prob: 85, tip: 'Cyclic code: every cyclic shift of a codeword is also a codeword. Generator g(x) divides x^n−1.', trap: 'CRC is a cyclic code used for ERROR DETECTION, not correction. It cannot correct errors.' },
  { unit: 3, topic: 'Golay (23,12) and BCH codes', prob: 75, tip: 'Golay (23,12): perfect code, can correct 3 errors. BCH codes: generalisation of Hamming for multiple error correction.', trap: null },
  { unit: 4, topic: 'TDM vs FDM — synchronisation', prob: 88, tip: 'TDM: time-interleaved samples, needs clock sync. FDM: frequency-interleaved carriers, needs guard bands.', trap: 'TDM needs bit/frame synchronisation — more complex than FDM at receiver.' },
  { unit: 4, topic: 'Optical fiber: step-index vs graded-index', prob: 82, tip: 'Step-index: single path speed. Graded-index: meridional vs skew rays arrive simultaneously. Lower modal dispersion.', trap: 'Graded-index reduces intermodal dispersion — does NOT eliminate it completely.' },
];

const PART_B_QUESTIONS = [
  { qNum: 'Q17/18', topic: 'AM / FM Modulation Analysis', unit: 1, prob: 90, appeared: ['May25', 'Jul25', 'Dec25', 'Dec23'], type: 'must', desc: 'Derive AM equation, calculate modulation index, sideband power. FM: deviation ratio, Carsons BW.', template: 'Given carrier Ac, message Am, fc, fm → micro  = Am/Ac → S(t) = Ac[1+micro  cos(2πfm t)]cos(2πfc t) → BW = 2fm(1+micro ). FM: Deltaf = Kf-Am → BW ≈ 2(Deltaf + fm).', keyFunctions: ['AM equation', 'micro  = Am/Ac', 'Sideband power', 'Deltaf = Kf-Am', 'Carson BW'] },
  { qNum: 'Q19/20', topic: 'Superheterodyne Receiver Analysis', unit: 1, prob: 85, appeared: ['May25', 'Jul25', 'Dec25'], type: 'safe', desc: 'Image frequency calculation, IF selection, sensitivity and selectivity trade-offs.', template: 'IF = fRF − fLO (for low-side injection). Image freq fIMG = fRF + 2IF. Selectivity determined by RF filter Q. Image rejection ratio (IRR) = Q × 2(fo/Deltaf).', keyFunctions: ['fIMG = fRF + 2IF', 'IRR = Q-2(fo/Deltaf)', 'Sensitivity', 'Selectivity'] },
  { qNum: 'Q21/22', topic: 'PCM / DM / ADM Encoding', unit: 2, prob: 96, appeared: ['May25', 'Jul25', 'Dec25', 'Dec23'], type: 'must', desc: 'PCM encoding from analog input, quantisation levels, bit rate. Delta modulation: step size, slope overload.', template: 'Nyquist: fs ≥ 2B. n-bit PCM → L = 2^n levels. Bit rate = fs × n. SNRq ≈ 6.02n + 1.76 dB. DM: Delta = 2δ/Ts. Slope overload when |d/dt[m(t)]|max > Delta/Ts.', keyFunctions: ['fs ≥ 2B', 'L = 2^n', 'Bit rate = fs-n', 'SNRq ≈ 6.02n + 1.76', 'Delta = 2δ/Ts'] },
  { qNum: 'Q23/24', topic: 'Digital Bandpass Modulation (ASK/FSK/PSK)', unit: 2, prob: 94, appeared: ['May25', 'Jul25', 'Dec25', 'Dec23'], type: 'must', desc: 'ASK, FSK, PSK generation, detection (coherent vs non-coherent), bandwidth, error performance.', template: 'ASK: s(t) = Ac cos(2πfc t) for "1", 0 for "0". Coherent detection: multiply by carrier → integrate → threshold. FSK BW ≈ 2(Deltaf + B). PSK: φ = 0 or π. BPSK: Pb = 0.5 erfc(√(Eb/N0)).', keyFunctions: ['ASK generation', 'FSK BW', 'BPSK Pb', 'Coherent detection', 'erfc(√(Eb/N0))'] },
  { qNum: 'Q25/26', topic: 'Shannon Theory + Channel Coding', unit: 3, prob: 88, appeared: ['May25', 'Jul25', 'Dec25', 'Dec23'], type: 'must', desc: 'Capacity from Shannon-Hartley, source entropy, Huffman coding, channel coding gain.', template: 'C = B log2(1+SNR) bps. Entropy H = −Σ p(xi) log2 p(xi). Huffman: assign longer codes to lower probability symbols. Code rate R = k/n. Coding gain G = 10 log10(dmin²/4E) dB.', keyFunctions: ['C = B log2(1+SNR)', 'H = −Σ p-log2 p', 'Huffman coding', 'R = k/n', 'Coding gain'] },
  { qNum: 'Q27/28', topic: 'Error Detection & Correction Codes', unit: 3, prob: 80, appeared: ['Jul25', 'Dec25'], type: 'risky', desc: 'Hamming (7,4) or (15,11), cyclic CRC-4, parity matrices.', template: 'Hamming (n,k): parity bits r = log2(n+1). Syndrome S = H-rT. Error at bit position indicated by syndrome value. For extended Hamming: add overall parity bit for dmin=4.', keyFunctions: ['Parity matrix H', 'Syndrome S', 'Error correction', 'dmin = 3', 'Extended Hamming'] },
];

const PART_C_PREDICTIONS = [
  { rank: 1, label: 'Highly Probable', color: '#ef4444', scenario: 'PCM/DM pipeline — sampling → quantisation → encoding → SNR calculation', evidence: 'May25 Q27 exactly. PCM is in 4/4 papers. DM slope overload in 3/4 papers.', code: `Given: analog signal bandwidth B=4kHz, sampled at fs=2B=8kHz.\nn-bit PCM: L = 2^n = 256 levels (n=8).\nBit rate Rb = fs × n = 8kHz × 8 = 64 kbps.\nQuantisation step Delta = (Vm − Vmin) / L.\nSNRq (dB) = 6.02n + 1.76 = 6.02(8) + 1.76 = 50.9 dB.\nDelta Mod: Delta = 2δ/Ts. Slope overload when |m\'(t)|max > δ/Ts.\nSolution: increase step size δ or decrease Ts.`, papers: ['May25 Q27', 'Jul25 Q27', 'All 4 papers have PCM/DM'] },
  { rank: 2, label: 'Very Likely', color: '#f59e0b', scenario: 'Shannon-Hartley + Huffman coding — entropy → codewords → capacity', evidence: 'Jul25 Q27 exactly. Shannon is in 3/4 papers. Huffman in 2/4.', code: `Shannon Source Coding Theorem:\nEntropy H = −Σ p(xi) log2 p(xi)\nGiven: symbols A,B,C,D with p = {0.5, 0.25, 0.125, 0.125}\nH = −(0.5 log2 0.5 + 0.25 log2 0.25 + 0.125 log2 0.125 + 0.125 log2 0.125)\nH = −(−0.5 + −0.5 + −0.375 + −0.375) = 1.75 bits/symbol.\nHuffman: assign 1-bit to A, 2-bit to B, 3-bit to C,D → avg length = 1.75 bits.\nShannon limit: H ≤ Lavg ≤ H+1 = 1.75–2.75 ✓\nCapacity: C = B log2(1+SNR). For B=4kHz, SNR=15: C = 4000×log2(16) = 16 kbps.`, papers: ['Jul25 Q27', 'Dec25 Q27'] },
  { rank: 3, label: 'Possible', color: '#3b82f6', scenario: 'QPSK/16-QAM error probability + matched filter receiver', evidence: 'Dec25 Q27. If examiner emphasises digital demodulation.', code: `QPSK: 2 bits/symbol. Constellation at 45°, 135°, 225°, 315°.\nCoherent detection: multiply by carrier → integrate over symbol period T.\nDecision threshold: Re(z) > 0 → I=1 else 0; Im(z) > 0 → Q=1 else 0.\nError probability: Pb ≈ (1/2) erfc(√(Eb/N0)).\nFor Eb/N0 = 10dB: Pb ≈ 0.5 erfc(√10) ≈ 3.9×10⁻⁶.\nMatched filter h(t) = s(T−t). Peak SNR = Es/N0 = (Es/N0).\nIntersymbol interference: raised cosine pulse with α=0.5 → BW = (1+α)Rs/2.`, papers: ['Dec25 Q27'] },
];

/* ─── INSIGHT DATA ─────────────────────────────────────────── */

const TOPIC_INSIGHTS = [
  { topic: 'PCM / DM / ADM', score: 98, papers: 4, color: '#ef4444', bar: '#ef4444' },
  { topic: 'Shannon + Capacity', score: 95, papers: 4, color: '#ef4444', bar: '#ef4444' },
  { topic: 'AM / FM Modulation', score: 92, papers: 4, color: '#f59e0b', bar: '#f59e0b' },
  { topic: 'Digital Modulation (ASK/FSK/PSK)', score: 90, papers: 4, color: '#f59e0b', bar: '#f59e0b' },
  { topic: 'Huffman + Source Coding', score: 88, papers: 3, color: '#f59e0b', bar: '#f59e0b' },
  { topic: 'Block / Cyclic Codes', score: 85, papers: 3, color: '#3b82f6', bar: '#3b82f6' },
  { topic: 'Superhet Receiver', score: 82, papers: 3, color: '#3b82f6', bar: '#3b82f6' },
  { topic: 'Matched Filter + ISI', score: 78, papers: 2, color: '#3b82f6', bar: '#3b82f6' },
  { topic: 'TDM / FDM Multiplexing', score: 70, papers: 2, color: '#8b5cf6', bar: '#8b5cf6' },
  { topic: 'Optical / Satellite Comm.', score: 60, papers: 1, color: '#6b7280', bar: '#6b7280' },
];

const KEY_INSIGTS = [
  { icon: <Target size={16} strokeWidth={1.5} />, text: 'Q27 = PCM/DM pipeline in 3/3 recent papers — 100% hit rate on current papers', color: '#ef4444' },
  { icon: <TrendingUp size={16} strokeWidth={1.5} />, text: 'PCM, Shannon, AM/FM appear in ALL 4 papers — no topic skipping', color: '#30d158' },
  { icon: <AlertTriangle size={16} strokeWidth={1.5} />, text: 'Dec 2025 added Huffman coding for first time — examiner experimenting', color: '#f59e0b' },
  { icon: <Award size={16} strokeWidth={1.5} />, text: 'PCM + Shannon + AM/FM + one digital mod = 65+ marks safe strategy', color: '#2997ff' },
];

/* ─── HELPERS ─────────────────────────────────────────────── */

const PROB_COLOR = (p: number) => p >= 90 ? '#ef4444' : p >= 80 ? '#f59e0b' : p >= 70 ? '#3b82f6' : '#6b7280';

const TYPE_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  must:   { bg: '#fee2e2', color: '#dc2626', label: 'MUST DO' },
  safe:   { bg: '#d1fae5', color: '#059669', label: 'SAFE PICK' },
  risky:  { bg: '#fef3c7', color: '#d97706', label: 'RISKY' },
};

function SectionTitle({ label, title, desc }: { label: string; title: string; desc?: string }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2997ff', marginBottom: '12px' }}>
        <Star size={11} strokeWidth={2} />
        {label}
      </div>
      <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 10px' }}>
        {title}
      </h2>
      {desc && <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.55 }}>{desc}</p>}
    </div>
  );
}

/* ─── PURE SVG HEATMAP ─────────────────────────────────────── */

interface HeatmapRow { topic: string; m25: boolean; j25: boolean; d25: boolean; d23: boolean; }

const HEATMAP_ROWS: HeatmapRow[] = [
  { topic: 'AM / DSBSC / SSB modulation', m25: true,  j25: true,  d25: true,  d23: true  },
  { topic: 'FM / PM deviation + Carson BW', m25: true,  j25: true,  d25: true,  d23: true  },
  { topic: 'Superheterodyne receiver', m25: true,  j25: true,  d25: true,  d23: false },
  { topic: 'PCM encoding + bit rate', m25: true,  j25: true,  d25: true,  d23: true  },
  { topic: 'Delta Modulation (DM / ADM)', m25: true,  j25: true,  d25: true,  d23: true  },
  { topic: 'ASK / FSK / PSK / QPSK', m25: true,  j25: true,  d25: true,  d23: true  },
  { topic: 'Shannon-Hartley capacity', m25: true,  j25: true,  d25: true,  d23: true  },
  { topic: 'Source entropy + Huffman', m25: false, j25: true,  d25: true,  d23: true  },
  { topic: 'Hamming / Block codes', m25: true,  j25: true,  d25: true,  d23: false },
  { topic: 'Cyclic / CRC codes', m25: false, j25: true,  d25: true,  d23: false },
  { topic: 'Matched filter + ISI', m25: false, j25: true,  d25: false, d23: true  },
  { topic: 'TDM / FDM multiplexing', m25: true,  j25: false, d25: true,  d23: false },
  { topic: 'Optical fiber communication', m25: true,  j25: false, d25: true,  d23: false },
  { topic: 'Satellite communication basics', m25: false, j25: false, d25: true,  d23: false },
  { topic: 'Error probability (BPSK, QPSK)', m25: true,  j25: true,  d25: false, d23: true  },
];

function ADCHeatmap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  void inView;
  const paperLabels = ['May 25', 'Jul 25', 'Dec 25', 'Dec 23'];
  const colKeys: (keyof Pick<HeatmapRow, 'm25' | 'j25' | 'd25' | 'd23'>)[] = ['m25', 'j25', 'd25', 'd23'];

  return (
    <div ref={ref}>
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[{ c: '#30d158', label: 'Appeared in paper' }, { c: 'rgba(255,255,255,0.15)', label: 'Not in this paper' }].map(({ c, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: c }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{label}</span>
          </div>
        ))}
      </div>

      <svg width="100%" viewBox={`0 0 900 ${28 + HEATMAP_ROWS.length * 38}`} style={{ display: 'block', overflow: 'visible' }}>
        {/* Header row */}
        <rect x="0" y="0" width="900" height="28" rx="8" fill="#1c1c1e" />
        <text x="16" y="18" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="600" letterSpacing="0.04em">TOPIC</text>
        {paperLabels.map((label, i) => {
          const x = 340 + i * 130;
          return <text key={label} x={x + 65} y="18" fill="#2997ff" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="600" textAnchor="middle" letterSpacing="0.04em">{label}</text>;
        })};
        <text x="870" y="18" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="600" textAnchor="end" letterSpacing="0.04em">SCORE</text>

        {/* Data rows */}
        {HEATMAP_ROWS.map((row, ri) => {
          const y = 28 + ri * 38;
          const score = [row.m25, row.j25, row.d25, row.d23].filter(Boolean).length;
          const even = ri % 2 === 0;
          return (
            <g key={row.topic}>
              {/* Row background */}
              <rect x="0" y={y} width="900" height="36" fill={even ? '#0f0f0f' : '#141414'} />
              {/* Topic label */}
              <text x="16" y={y + 22} fill="rgba(255,255,255,0.8)" fontSize="12" fontFamily="sans-serif">{row.topic}</text>
              {/* Paper cells */}
              {colKeys.map((key, ci) => {
                const appeared = row[key];
                const cx = 340 + ci * 130 + 65;
                const cy = y + 18;
                return appeared ? (
                  <g key={ci}>
                    <rect x={cx - 44} y={cy - 10} width="88" height="20" rx="6" fill="rgba(48,209,88,0.15)" stroke="rgba(48,209,88,0.3)" strokeWidth="1" />
                    <text x={cx} y={cy + 4} fill="#30d158" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="600" textAnchor="middle">YES</text>
                  </g>
                ) : (
                  <g key={ci}>
                    <rect x={cx - 44} y={cy - 10} width="88" height="20" rx="6" fill="rgba(255,255,255,0.04)" />
                    <text x={cx} y={cy + 4} fill="rgba(255,255,255,0.2)" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="600" textAnchor="middle">NO</text>
                  </g>
                );
              })}
              {/* Score badge */}
              <text x="862" y={y + 22} fill={score >= 3 ? '#30d158' : score >= 2 ? '#2997ff' : '#ff9f0a'} fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="600" textAnchor="end">{score}/4</text>
              {/* Divider */}
              <line x1="0" y1={y + 36} x2="900" y2={y + 36} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── PURE SVG UNIT DONUT ──────────────────────────────────── */

const ADC_UNITS = [
  { label: 'Unit 1', sublabel: 'Analog Comm.', pct: 30, color: '#0066cc', topics: 'AM, FM, PM, Superhet' },
  { label: 'Unit 2', sublabel: 'Digital Mod.', pct: 30, color: '#7c3aed', topics: 'PCM, DM, ASK/FSK/PSK, QPSK' },
  { label: 'Unit 3', sublabel: 'Info & Coding', pct: 25, color: '#059669', topics: 'Shannon, Huffman, Hamming, CRC' },
  { label: 'Unit 4', sublabel: 'Transmisson', pct: 10, color: '#f59e0b', topics: 'TDM, FDM, Optical, Satellite' },
  { label: 'Unit 5', sublabel: 'Recent Trends', pct: 5, color: '#ef4444', topics: 'OFDM, MIMO, 5G concepts' },
];

const R2 = 58;
const CX2 = 70;
const CY2 = 70;
const CIRCUMFERENCE2 = 2 * Math.PI * R2;

function getSegments2(units: typeof ADC_UNITS) {
  let offset = 0;
  return units.map(u => {
    const dash = (u.pct / 100) * CIRCUMFERENCE2;
    const gap = CIRCUMFERENCE2 - dash;
    const result = { dash, gap, offset, ...u };
    offset += dash;
    return result;
  });
}

function ADCUnitDonut() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  void inView;
  const segments = getSegments2(ADC_UNITS);

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={CX2} cy={CY2} r={R2} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="14" />
          {segments.map((seg, i) => (
            <motion.circle
              key={i}
              cx={CX2}
              cy={CY2}
              r={R2}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeDasharray={`${seg.dash} ${seg.gap}`}
              strokeDashoffset={-seg.offset}
              strokeLinecap="butt"
              initial={{ strokeDasharray: `0 ${CIRCUMFERENCE2}` }}
              animate={inView ? { strokeDasharray: `${seg.dash} ${seg.gap}` } : { strokeDasharray: `0 ${CIRCUMFERENCE2}` }}
              transition={{ duration: 0.9, delay: 0.15 * i + 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '22px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.03em' }}>75</span>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', fontWeight: 400, letterSpacing: '0.05em', textTransform: 'uppercase' }}>marks</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {ADC_UNITS.map((u, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 12 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
          >
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: u.color, marginTop: '3px', flexShrink: 0 }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{u.label}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{u.sublabel}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: u.color }}>{u.pct}%</span>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{u.topics}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── ADC PYQ CARDS ─────────────────────────────────────────── */

const ADC_PAPERS = [
  { year: 'May 2025', file: 'ADC_May25_PYQ.pdf', highlights: ['FM deviation ratio Q17', 'PCM bit rate Q21', 'Huffman first appeared Q27'], color: '#0066cc' },
  { year: 'July 2025', file: 'ADC_Jul25_PYQ.pdf', highlights: ['Superhet image freq Q19', 'DM slope overload Q21', 'Shannon capacity Q27'], color: '#7c3aed' },
  { year: 'December 2025', file: 'ADC_Dec25_PYQ.pdf', highlights: ['QPSK error probability Q23', 'Cyclic CRC codes Q25', 'PCM pipeline Q27'], color: '#0891b2' },
  { year: 'December 2023', file: '21CSS304T.pdf', highlights: ['Baseline question set', 'AM modulation index Q17', 'FSK bandwidth Q23'], color: '#059669' },
];

function ADCPYQCards() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  void inView;
  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
      {ADC_PAPERS.map((paper, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: '#1c1c1e', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: paper.color }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
            <FileSpreadsheet size={18} strokeWidth={1.5} style={{ color: paper.color, marginTop: '1px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{paper.year}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: "JetBrains Mono, monospace" }}>{paper.file}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600, color: '#10b981', background: 'rgba(48,209,88,0.15)', padding: '2px 8px', borderRadius: '100px', flexShrink: 0, border: '1px solid rgba(48,209,88,0.3)' }}>
              <CheckCircle size={10} strokeWidth={2} />
              Analyzed
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {paper.highlights.map((h, j) => (
              <div key={j} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: paper.color, marginTop: '6px', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.45 }}>{h}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── ADC PART BREAKDOWN ───────────────────────────────────── */

const ADC_PARTS = [
  {
    part: 'Part A',
    marks: '20 × 1 = 20',
    desc: 'Multiple Choice Questions — all compulsory',
    bg: '#0066cc',
    items: [
      { icon: 'check', text: 'AM modulation index micro  = Am/Ac (micro  ≤ 1 to avoid distortion)' },
      { icon: 'check', text: 'FM deviation Deltaf = Kf-Am. Carson BW = 2(Deltaf + fm_max)' },
      { icon: 'check', text: 'PCM: Nyquist fs ≥ 2B, bit rate = fs × n, L = 2^n levels' },
      { icon: 'check', text: 'DM slope overload: |m\'(t)|max > Delta/Ts. Fix: increase Delta or decrease Ts' },
      { icon: 'check', text: 'Shannon: C = B log2(1 + SNR). SNR linear NOT in dB for formula' },
      { icon: 'check', text: 'Hamming dmin = 3: detects 2 errors, corrects 1 error' },
      { icon: 'warn', text: 'TRAP: Image freq fIMG = fRF + 2×IF (NOT fRF + IF)' },
      { icon: 'warn', text: 'TRAP: BPSK error probability uses erfc(√(Eb/N0)), NOT Q-function directly' },
      { icon: 'warn', text: 'TRAP: Huffman is optimal prefix-free. Shannon-Fano is heuristic (not guaranteed optimal)' },
      { icon: 'warn', text: 'TRAP: PCM SNRq = 6.02n + 1.76 dB — this is SIGNAL-to-quantisation-noise, not total SNR' },
    ],
  },
  {
    part: 'Part B',
    marks: '4 × 10 = 40',
    desc: 'Answer 4 out of 6 questions — strategic choice',
    bg: '#7c3aed',
    items: [
      { icon: 'target', text: 'Q17/18: AM/FM — modulation index, sideband power, Carson BW' },
      { icon: 'target', text: 'Q19/20: Superhet — image frequency, IF selection, sensitivity' },
      { icon: 'target', text: 'Q21/22: PCM/DM — sampling, bit rate, SNRq, slope overload' },
      { icon: 'target', text: 'Q23/24: ASK/FSK/PSK — generation, detection, bandwidth, Pb' },
      { icon: 'target', text: 'Q25/26: Shannon + Huffman — capacity, entropy, Huffman codewords' },
      { icon: 'warn', text: 'SKIP: Q27/28 on optical/satellite unless you have extra time' },
      { icon: 'check', text: 'Guaranteed combo: Q17 + Q21 + Q23 + Q25 = 40 marks with high repeatability' },
    ],
  },
  {
    part: 'Part C',
    marks: '1 × 15 = 15',
    desc: 'Compulsory OR question — one choice',
    bg: '#dc2626',
    items: [
      { icon: 'target', text: 'Q27: PCM/DM pipeline — 3/3 recent papers (100% hit rate on recent 3 papers)' },
      { icon: 'target', text: 'Q28: Shannon + Huffman — capacity, entropy calculation, code assignment' },
      { icon: 'check', text: 'May25 Q27: PCM bit rate + SNRq calculation' },
      { icon: 'check', text: 'Jul25 Q27: Shannon capacity + Huffman coding (first Huffman in exam)' },
      { icon: 'check', text: 'Dec25 Q27: DM slope overload + PCM pipeline combined' },
      { icon: 'warn', text: 'Dec23: Q27 = AM sideband power (different examiner, older pattern)' },
      { icon: 'target', text: 'Both Q27 and Q28 need step-by-step derivation — show all formulas' },
    ],
  },
];

const ICON_MAP = {
  check: <CheckCircle size={14} strokeWidth={1.5} style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }} />,
  warn: <AlertTriangle size={14} strokeWidth={1.5} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '1px' }} />,
  target: <Target size={14} strokeWidth={1.5} style={{ color: '#60a5fa', flexShrink: 0, marginTop: '1px' }} />,
};

function ADCPartBreakdown() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  void inView;
  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
      {ADC_PARTS.map((part, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: '#1c1c1e', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: `linear-gradient(135deg, ${part.bg}22 0%, transparent 100%)` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: part.bg }}>{part.part}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', background: `${part.bg}33`, padding: '2px 8px', borderRadius: '100px', border: `1px solid ${part.bg}55` }}>{part.marks}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '6px 0 0' }}>{part.desc}</p>
          </div>
          <div style={{ padding: '14px 20px 18px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {part.items.map((item, j) => (
              <div key={j} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                {ICON_MAP[item.icon as keyof typeof ICON_MAP]}
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.45 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── YEAR EVOLUTION TABLE ──────────────────────────────────── */

const YEAR_EVOLUTION = [
  { year: 'Dec 2023', pattern: 'Classic analog-heavy paper', units: ['AM/FM focus', 'FSK/PSK intro', 'Block codes', 'Basic Shannon'], shift: 'Traditional, unit-weighted', rating: 'Moderate difficulty' },
  { year: 'May 2025', pattern: 'PCM emphasis begins', units: ['PCM bit rate Q21', 'Huffman first in Q27', 'Superhet + image freq', 'Hamming codes Q25'], shift: 'PCM moved from Part B to Part C', rating: 'Moderate difficulty' },
  { year: 'Jul 2025', pattern: 'DM slope overload peak', units: ['DM slope overload Q21', 'Shannon capacity Q27', 'Matched filter Q24', 'Cyclic CRC Q25'], shift: 'Digital modulation deeper', rating: 'Difficult' },
  { year: 'Dec 2025', pattern: 'Coding + QPSK focus', units: ['QPSK Pb calculation', 'Cyclic CRC codes Q25', 'PCM pipeline Q27', 'Huffman in Q27 twice'], shift: 'Examiner experimenting with Huffman in Part C', rating: 'Difficult + new topics' },
];

function YearEvolutionTable() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  void inView;
  return (
    <div ref={ref} style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#1c1c1e', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {['Year', 'Pattern', 'Key Units Covered', 'Notable Shift', 'Difficulty'].map(h => (
              <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.04em', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {YEAR_EVOLUTION.map((row, idx) => (
            <motion.tr
              key={row.year}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              style={{ background: idx % 2 === 0 ? '#000000' : '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <td style={{ padding: '14px 20px', fontWeight: 600, color: '#2997ff', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>{row.year}</td>
              <td style={{ padding: '14px 20px', color: '#ffffff', fontWeight: 500 }}>{row.pattern}</td>
              <td style={{ padding: '14px 20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {row.units.map(u => (
                    <span key={u} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ color: '#30d158', fontSize: '10px' }}>•</span>{u}
                    </span>
                  ))}
                </div>
              </td>
              <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.55)', fontSize: '12px', lineHeight: 1.5 }}>{row.shift}</td>
              <td style={{ padding: '14px 20px' }}>
                <span style={{ padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600, background: row.rating === 'Moderate difficulty' ? 'rgba(41,151,255,0.15)' : 'rgba(255,159,10,0.15)', color: row.rating === 'Moderate difficulty' ? '#2997ff' : '#ff9f0a', border: `1px solid ${row.rating === 'Moderate difficulty' ? 'rgba(41,151,255,0.25)' : 'rgba(255,159,10,0.25)'}` }}>{row.rating}</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────── */

export function ADCAnalysis() {
  const navigate = useNavigate();
  const [activeUnit, setActiveUnit] = useState<1 | 2 | 3 | 4 | 5 | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'must' | 'safe' | 'risky'>('all');
  const [showCodeB, setShowCodeB] = useState<Record<number, boolean>>({});
  const [showCodeC, setShowCodeC] = useState<Record<number, boolean>>({});

  const toggleCodeB = (i: number) => setShowCodeB(p => ({ ...p, [i]: !p[i] }));
  const toggleCodeC = (i: number) => setShowCodeC(p => ({ ...p, [i]: !p[i] }));

  const filteredMCQ = activeUnit === 'all' ? MCQ_TOPICS : MCQ_TOPICS.filter(t => t.unit === activeUnit);
  const filteredPartB = filterType === 'all' ? PART_B_QUESTIONS : PART_B_QUESTIONS.filter(q => q.type === filterType);

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
        <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
          <ArrowLeft size={13} strokeWidth={1.5} />
          Back
        </button>
        <div style={{ height: '16px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>Analog & Digital Comm.</span>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>21CSS304T</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => window.open('/adc-prepguide.pdf', '_blank')} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 400, cursor: 'pointer' }}>
            <BookOpen size={12} strokeWidth={1.5} />
            Prep Guide
          </button>
          <button onClick={() => window.open('/adc-mastersheet.pdf', '_blank')} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(52,199,89,0.1)', border: '1px solid rgba(52,199,89,0.25)', color: '#34c759', fontSize: '12px', fontWeight: 400, cursor: 'pointer' }}>
            <FileSpreadsheet size={12} strokeWidth={1.5} />
            MasterSheet
          </button>
          <button onClick={() => navigate('/pyq-master')} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(41,151,255,0.15)', border: '1px solid rgba(41,151,255,0.3)', color: '#2997ff', fontSize: '12px', fontWeight: 400, cursor: 'pointer' }}>
            Master Sheet
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 64px)' }}>

        {/* INFOGRAPHIC HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '80px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2997ff', marginBottom: '14px' }}>
            <CheckCircle size={12} strokeWidth={2} />
            4 Papers - 80 MCQs - 24 Part B Qs - 8 Part C Qs
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1.08, margin: '0 0 10px' }}>
            Analog & Digital Comm.
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: '0 0 10px', letterSpacing: '-0.02em', maxWidth: '600px' }}>
            4 Papers. Every Pattern. Decoded.
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, margin: 0, letterSpacing: '-0.02em', maxWidth: '600px' }}>
            Every question from May 2025 - July 2025 - December 2025 - December 2023 — decoded.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
            {[
              { n: '75', l: 'Total Marks', c: '#ffffff', sub: '3 hours' },
              { n: '4', l: 'Papers Analyzed', c: '#2997ff', sub: 'May/Jul/Dec 25 + Dec 23' },
              { n: '100%', l: 'Q27 Hit Rate', c: '#ef4444', sub: '3/3 recent papers' },
              { n: '65+', l: 'Safe Score', c: '#30d158', sub: 'PCM + Shannon + Modulation' },
            ].map(({ n, l, c, sub }) => (
              <div key={l} style={{ flex: '1 1 140px', background: '#1c1c1e', borderRadius: '16px', padding: '20px 24px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '28px', fontWeight: 600, color: c, letterSpacing: '-0.04em', lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>{l}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* TOPIC INSIGHTS */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '80px' }}
        >
          <SectionTitle label="Topic Insights" title="What Actually Gets Asked" desc="Priority score based on appearance across all 4 papers. Higher = more likely on your exam." />

          <div style={{ background: '#1c1c1e', borderRadius: '20px', padding: '32px 36px', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {TOPIC_INSIGHTS.map((item, i) => (
                <motion.div
                  key={item.topic}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
                >
                  <div style={{ width: '220px', fontSize: '12px', color: 'rgba(255,255,255,0.65)', fontWeight: 500, flexShrink: 0 }}>{item.topic}</div>
                  <div style={{ flex: 1, height: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: '100%', background: item.bar, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px' }}
                    >
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#fff' }}>{item.score}%</span>
                    </motion.div>
                  </div>
                  <div style={{ width: '50px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'right', fontFamily: 'JetBrains Mono, monospace' }}>{item.papers}/4</div>
                </motion.div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '14px', marginTop: '20px', flexWrap: 'wrap' }}>
              {[
                { c: '#ef4444', l: '4/4 papers — Must study' },
                { c: '#f59e0b', l: '3/4 papers — High priority' },
                { c: '#3b82f6', l: '2/4 papers — Medium' },
                { c: '#6b7280', l: '1/4 papers — New/watch' },
              ].map(({ c, l }) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: c }} />
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {KEY_INSIGTS.map((ins, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ background: '#1c1c1e', borderRadius: '14px', padding: '16px 20px', border: `1px solid ${ins.color}20`, display: 'flex', gap: '12px', alignItems: 'flex-start' }}
              >
                <div style={{ color: ins.color, marginTop: '2px', flexShrink: 0 }}>{ins.icon}</div>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.55 }}>{ins.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* EXAM FORMAT + MARKS BREAKDOWN */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '80px' }}
        >
          <SectionTitle label="Exam Structure" title="75 Marks — How It Breaks Down" desc="Understand the mark distribution before you strategize which questions to pick." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
            <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.08 }} style={{ background: '#1c1c1e', borderRadius: '20px', padding: '36px 40px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>Marks by Unit</div>
              <ADCUnitDonut />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.16 }}>
              <ADCPartBreakdown />
            </motion.div>
          </div>
        </motion.div>

        {/* PYQ SOURCES */}
        <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6 }} style={{ marginBottom: '80px' }}>
          <SectionTitle label="Evidence Base" title="4 Papers Analyzed" desc="Every prediction in this guide is grounded in these 4 past papers." />
          <ADCPYQCards />
        </motion.section>

        {/* TOPIC FREQUENCY HEATMAP */}
        <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.6 }} style={{ marginBottom: '80px' }}>
          <SectionTitle label="Topic Frequency" title="What Gets Asked — Visualized" desc="Paper-by-topic presence heatmap across all 4 papers. Green = appeared." />
          <div style={{ background: '#1c1c1e', borderRadius: '20px', padding: '40px 44px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px' }}>
            <ADCHeatmap />
          </div>
        </motion.section>

        {/* PART A: MCQ ANALYSIS */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }} style={{ marginBottom: '80px' }}>
          <SectionTitle label="Part A - 20 × 1 = 20 marks" title="MCQ Topic-by-Topic Breakdown" desc="All 20 are compulsory. No choice. Each topic below maps to 1-2 questions per paper." />

          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {(['all', 1, 2, 3, 4, 5] as const).map(u => {
              const count = u === 'all' ? MCQ_TOPICS.length : MCQ_TOPICS.filter(t => t.unit === u).length;
              const colors = { 1: '#0066cc', 2: '#7c3aed', 3: '#059669', 4: '#f59e0b', 5: '#ef4444', all: 'rgba(255,255,255,0.65)' } as const;
              const c = colors[u];
              const isActive = activeUnit === u;
              return (
                <button key={u} onClick={() => setActiveUnit(u)} style={{ padding: '8px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, background: isActive ? `${c}22` : 'rgba(255,255,255,0.04)', border: isActive ? `1.5px solid ${c}55` : '1.5px solid rgba(255,255,255,0.1)', color: isActive ? c : 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                  {u === 'all' ? `All — ${count}` : `Unit ${u} — ${count}`}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeUnit} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {filteredMCQ.map((item, i) => (
                <motion.div key={item.topic} initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.32, delay: (i % 4) * 0.04 }} style={{ background: '#1c1c1e', borderRadius: '16px', padding: '22px 26px', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ flexShrink: 0, padding: '3px 10px', borderRadius: '8px', background: `${PROB_COLOR(item.prob)}18`, border: `1px solid ${PROB_COLOR(item.prob)}44`, fontSize: '12px', fontWeight: 600, color: PROB_COLOR(item.prob) }}>{item.prob}%</div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: '100px' }}>U{item.unit}</div>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '8px', lineHeight: 1.3 }}>{item.topic}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: item.trap ? '12px' : 0 }}>{item.tip}</div>
                  {item.trap && (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', background: 'rgba(255,159,10,0.1)', borderRadius: '8px', padding: '8px 12px', border: '1px solid rgba(255,159,10,0.25)' }}>
                      <AlertTriangle size={12} strokeWidth={2} style={{ color: '#ff9f0a', marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: '#ff9f0a', fontWeight: 400 }}>TRAP: {item.trap}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* PART B: QUESTION STRATEGY */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12 }} style={{ marginBottom: '80px' }}>
          <SectionTitle label="Part B - 4 × 10 = 40 marks" title="Pick Your 4 — Probability Ranked" desc="Answer any 4 of 6 questions. Here is every question with probability and exact formula template." />

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {(['all', 'must', 'safe', 'risky'] as const).map(f => {
              const labels = { all: 'All', must: 'Must Do', safe: 'Safe Pick', risky: 'Risky' };
              const isActive = filterType === f;
              return (
                <button key={f} onClick={() => setFilterType(f)} style={{ padding: '8px 22px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, background: isActive ? '#2997ff' : 'rgba(255,255,255,0.08)', color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)', border: isActive ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.2s ease' }}>{labels[f]}</button>
              );
            })}
          </div>

          <div style={{ background: 'rgba(41,151,255,0.08)', borderRadius: '20px', padding: '22px 28px', marginBottom: '32px', border: '1px solid rgba(41,151,255,0.2)', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Zap size={20} strokeWidth={1.5} style={{ color: '#2997ff', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.022em', marginBottom: '5px' }}>
                Safest combo: <span style={{ color: '#2997ff' }}>Q17 + Q21 + Q23 + Q25</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.55)', letterSpacing: '-0.014em' }}>
                AM/FM + PCM/DM + ASK/FSK/PSK + Shannon/Huffman — all appeared in 3+ papers. Guaranteed 40 marks.
              </div>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredPartB.map((q, i) => {
              const badge = TYPE_BADGE[q.type];
              const origIdx = PART_B_QUESTIONS.indexOf(q);
              return (
                <motion.div key={q.qNum} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3, delay: i * 0.04 }} style={{ background: '#1c1c1e', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', marginBottom: '20px' }}>
                  <div style={{ padding: '20px 26px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono, monospace' }}>{q.qNum}</span>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', flex: 1 }}>{q.topic}</span>
                    <div style={{ padding: '2px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: 600, background: q.type === 'must' ? 'rgba(255,69,58,0.15)' : q.type === 'safe' ? 'rgba(48,209,88,0.12)' : 'rgba(255,159,10,0.12)', color: q.type === 'must' ? '#ff453a' : q.type === 'safe' ? '#30d158' : '#ff9f0a', border: `1px solid ${q.type === 'must' ? 'rgba(255,69,58,0.3)' : q.type === 'safe' ? 'rgba(48,209,88,0.25)' : 'rgba(255,159,10,0.25)'}` }}>{badge.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: PROB_COLOR(q.prob) }}>
                      <TrendingUp size={12} strokeWidth={1.5} />
                      {q.prob}%
                    </div>
                  </div>
                  <div style={{ padding: '20px 26px' }}>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', margin: '0 0 14px', lineHeight: 1.6 }}>{q.desc}</p>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Appeared:</span>
                      {q.appeared.map(p => <span key={p} style={{ fontSize: '11px', fontWeight: 600, color: '#2997ff', background: 'rgba(41,151,255,0.12)', padding: '2px 8px', borderRadius: '100px' }}>{p}</span>)}
                    </div>
                    <button onClick={() => toggleCodeB(origIdx)} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', cursor: 'pointer', marginBottom: '10px' }}>
                      {showCodeB[origIdx] ? <ChevronUp size={12} strokeWidth={2} /> : <ChevronDown size={12} strokeWidth={2} />}
                      {showCodeB[origIdx] ? 'Hide template' : 'Show template'}
                    </button>
                    <AnimatePresence initial={false}>
                      {showCodeB[origIdx] && (
                        <motion.div key="code" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: 'hidden', marginBottom: '10px' }}>
                          <div style={{ background: '#000000', borderRadius: '10px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '5px' }}>Template</div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.55, fontFamily: 'JetBrains Mono, monospace' }}>{q.template}</div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {q.keyFunctions.map(fn => <span key={fn} style={{ fontSize: '11px', fontWeight: 400, color: '#2997ff', background: 'rgba(41,151,255,0.1)', padding: '2px 8px', borderRadius: '6px', fontFamily: 'JetBrains Mono, monospace' }}>{fn}</span>)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.section>

        {/* PART C: Q27 PREDICTION */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16 }} style={{ marginBottom: '80px' }}>
          <SectionTitle label="Part C - 1 × 15 = 15 marks" title="Q27 Prediction — 3 Probable Questions" desc="Q27 = PCM/DM pipeline in 3 of 3 recent papers. Most predictable question in the paper." />

          <div style={{ background: '#1c1c1e', borderRadius: '18px', padding: '24px 30px', marginBottom: '36px', display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <Target size={26} strokeWidth={1.5} style={{ color: '#ef4444', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '5px' }}>Q27 = PCM/DM Pipeline — 3/3 recent papers</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>May25 - Jul25 - Dec25 — all PCM/DM pipelines. Dec23 had AM sideband power.</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '28px', fontWeight: 600, color: '#ef4444', letterSpacing: '-0.04em' }}>100%</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>hit rate (recent)</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {PART_C_PREDICTIONS.map((pred, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 * i }} style={{ background: '#1c1c1e', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <div style={{ height: '3px', background: pred.color }} />
                <div style={{ padding: '22px 26px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: pred.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: '#fff', flexShrink: 0 }}>{pred.rank}</div>
                    <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: pred.color }}>{pred.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', flex: 1 }}>{pred.scenario}</span>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {pred.papers.map(p => <span key={p} style={{ fontSize: '10px', fontWeight: 600, color: pred.color, background: `${pred.color}18`, padding: '2px 8px', borderRadius: '100px' }}>{p}</span>)}
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: '0 0 16px' }}>{pred.evidence}</p>
                </div>
                <div style={{ margin: '0 26px 24px' }}>
                  <button onClick={() => toggleCodeC(i)} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', cursor: 'pointer', marginBottom: '8px' }}>
                    {showCodeC[i] ? <ChevronUp size={12} strokeWidth={2} /> : <ChevronDown size={12} strokeWidth={2} />}
                    {showCodeC[i] ? 'Hide template' : 'Show template'}
                  </button>
                  <AnimatePresence initial={false}>
                    {showCodeC[i] && (
                      <motion.div key="code-c" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: 'hidden' }}>
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

          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '20px 24px', border: '1px solid rgba(255,255,255,0.08)', marginTop: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Q28 (alternative) — Shannon + Huffman Coding</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
              If Q27 is PCM/DM (which it will be in 3/3 recent papers), Q28 is Shannon capacity + Huffman:
              <code style={{ fontFamily: 'JetBrains Mono, monospace', background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '4px', marginLeft: '4px', fontSize: '12px', color: '#2997ff' }}>C = B log2(1+SNR) → H = −Σp log2 p → Huffman codewords</code>.
              Pick Q27 — PCM/DM is easier to derive step-by-step and score full marks on.
            </div>
          </div>
        </motion.section>

        {/* YEAR EVOLUTION TABLE */}
        <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }} style={{ marginBottom: '80px' }}>
          <SectionTitle label="Evolution Across Papers" title="Year-by-Year Pattern Shifts" desc="How the exam has changed from Dec 2023 to Dec 2025 — what the examiner is emphasising." />
          <YearEvolutionTable />
        </motion.section>

        {/* DOWNLOAD SECTION */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }} style={{ background: '#1c1c1e', borderRadius: '20px', padding: '48px 44px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '26px', fontWeight: 600, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 12px' }}>Need the full study guide?</h3>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', margin: '0 0 28px', lineHeight: 1.6 }}>Modulation fundamentals - PCM/DM derivations - Shannon formulas - All model answers - Code arsenals</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            <button onClick={() => window.open('/adc-prepguide.pdf', '_blank')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '100px', background: '#2997ff', color: '#fff', fontSize: '14px', fontWeight: 400, letterSpacing: '-0.022em', cursor: 'pointer', border: 'none' }}>
              <BookOpen size={15} strokeWidth={1.5} />
              ADC Prep Guide
            </button>
            <button onClick={() => window.open('/adc-mastersheet.pdf', '_blank')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '100px', background: 'rgba(52,199,89,0.15)', color: '#34c759', fontSize: '14px', fontWeight: 400, letterSpacing: '-0.022em', cursor: 'pointer', border: '1px solid rgba(52,199,89,0.3)' }}>
              <FileSpreadsheet size={15} strokeWidth={1.5} />
              PYQ MasterSheet
            </button>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => navigate('/pyq-master')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 22px', borderRadius: '100px', background: 'transparent', color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: 400, letterSpacing: '-0.01em', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.12)', transition: 'color 0.15s, border-color 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.85)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
            >
              <FileSpreadsheet size={13} strokeWidth={1.5} />
              View Master Sheet Page
            </button>
          </div>
        </motion.div>

        {/* Footer tagline */}
        <div style={{ textAlign: 'center', padding: '32px 0 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: 0, letterSpacing: '-0.01em' }}>Aswath AS - SRM Institute - "I got bored studying. So I analysed all 4 previous year papers."</p>
        </div>

      </div>
    </div>
  );
}
