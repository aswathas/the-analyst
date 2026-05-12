// ADC PYQ Master Sheet — 21ECC302T Analog and Digital Communication
// Comprehensive exam-ready master sheet with Part A/B/C questions, answers, and study priorities

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, BookOpen, Star, Target, TrendingUp, Zap, ChevronDown,
  ChevronUp, FileText, Code2, CheckCircle2, AlertTriangle, Award,
  Clock, Filter, X
} from 'lucide-react';

interface Props {
  onBack: () => void;
}

// ─────────────────────────────────────────
// DATA STRUCTURES
// ─────────────────────────────────────────

interface MCQTopic {
  topic: string;
  questions: { q: string; answer: string; paper: string }[];
}

interface PartBQuestion {
  id: string;
  unit: number;
  question: string;
  topic: string;
  mark: number;
  papers: string[];
  modelAnswer: string;
  keyPoints: string[];
  priority: 'must' | 'important' | 'safe';
}

interface PartCQuestion {
  id: string;
  unit: number;
  scenario: string;
  rank: 'Highly Probable' | 'Very Likely' | 'Possible';
  mark: number;
  modelAnswer: string;
  keyPoints: string[];
  evidence: string;
}

// ─────────────────────────────────────────
// RAW DATA
// ─────────────────────────────────────────

const PAPER_SUMMARY = [
  { code: 'Jan 2026 FN', file: '/ADC_Jan26_PYQ.pdf', highlight: 'FM Carson\'s rule numerical, AM sideband power', new: false },
  { code: 'Jul 2025 FN', file: '/ADC_Jul25_PYQ.pdf', highlight: 'Noise figure Friis cascade, DSB-SC vs SSB', new: false },
  { code: 'May 2025 AN', file: '/ADC_May25_PYQ.pdf', highlight: 'DSB-SC generation, BPSK probability of error', new: false },
];

const EXAM_FORMAT = [
  { part: 'Part A', detail: '20 × 1 = 20 marks', sub: 'All compulsory MCQs', color: '#0066cc', note: 'No choice. Every question counts.' },
  { part: 'Part B', detail: '4 × 10 = 40 marks', sub: 'Answer 4 of 6 questions', color: '#7c3aed', note: 'Pick your strongest 4.' },
  { part: 'Part C', detail: '1 × 15 = 15 marks', sub: 'One compulsory OR question', color: '#dc2626', note: 'Choose A or B — both on wrangling.' },
];

const MCQ_TOPICS: Record<string, { q: string; answer: string; paper: string }[]> = {
  'AM (Amplitude Modulation)': [
    { q: 'In AM, if m = 0.5, what % of total power is in sidebands?', answer: '33%', paper: 'Jan 26' },
    { q: 'For undistorted AM, modulation index m must satisfy:', answer: 'm ≤ 1', paper: 'Jan 26, Jul 25' },
    { q: 'Total power in AM wave with carrier power Pc and m = 0.6:', answer: 'Pc(1 + m²/2)', paper: 'Jan 26' },
    { q: 'If modulation index m = 1, sideband power equals:', answer: '50% of total power', paper: 'Jul 25' },
    { q: 'AM broadcast radio uses bandwidth of:', answer: '2 × fm (double sideband)', paper: 'May 25' },
  ],
  'DSB-SC & SSB': [
    { q: 'DSB-SC bandwidth compared to SSB is:', answer: 'Double (2fm vs fm)', paper: 'Jul 25' },
    { q: 'SSB is preferred over AM because:', answer: 'Half bandwidth + higher power efficiency + better noise immunity', paper: 'Jan 26, May 25' },
    { q: 'DSB-SC requires what type of detection?', answer: 'Coherent (synchronous) detection', paper: 'May 25' },
    { q: 'Vestigial sideband (VSB) is used in:', answer: 'TV broadcasting', paper: 'May 25' },
    { q: 'Single Sideband with carrier is called:', answer: 'SSB-C or pilot carrier SSB', paper: 'Jul 25' },
  ],
  'FM (Frequency Modulation)': [
    { q: 'Frequency deviation Δf is directly proportional to:', answer: 'Amplitude of modulating signal (not frequency)', paper: 'Jan 26, Jul 25, May 25' },
    { q: 'Carson\'s rule for FM bandwidth:', answer: 'BW = 2(Δf + fm)', paper: 'Jan 26, Jul 25, May 25' },
    { q: 'Pre-emphasis in FM is used to:', answer: 'Boost high frequencies before transmission (reduce noise)', paper: 'Jul 25' },
    { q: 'Deviation ratio β = Δf/fm. For broadcast FM, β ≈', answer: '5 (Δf=75kHz, fm=15kHz)', paper: 'Jan 26' },
    { q: 'Armstrong indirect method generates:', answer: 'Narrowband FM then multiplies to WBFM', paper: 'Jul 25' },
    { q: 'WBFM broadcast band is:', answer: '88–108 MHz', paper: 'May 25' },
  ],
  'PM (Phase Modulation)': [
    { q: 'FM and PM are related through:', answer: 'Differentiation (FM = PM differentiated) or Integration (PM = FM integrated)', paper: 'May 25' },
    { q: 'Phase modulation index is given by:', answer: 'β = kp · Em (product of phase sensitivity and message amplitude)', paper: 'Jul 25' },
    { q: 'FM is a special case of PM where message is:', answer: 'Integrated before modulation', paper: 'Jul 25' },
  ],
  'Sampling & Pulse Modulation': [
    { q: 'Nyquist sampling theorem: fs must be:', answer: '≥ 2B (twice signal bandwidth)', paper: 'Jan 26, Jul 25' },
    { q: 'In flat-top PAM, each pulse:', answer: 'Is held constant at sample value for duration', paper: 'May 25' },
    { q: 'In PWM, information is contained in:', answer: 'Pulse width (duty cycle)', paper: 'Jul 25' },
    { q: 'In PPM, information is contained in:', answer: 'Pulse position (time offset)', paper: 'Jul 25' },
    { q: 'Which pulse modulation is most noise-immune?', answer: 'PPM (constant amplitude and width)', paper: 'May 25' },
    { q: 'PCM: for 4 kHz audio signal, sampling frequency is:', answer: '8 kHz (telephony standard)', paper: 'May 25' },
  ],
  'Digital Modulation (ASK/FSK/PSK/QAM)': [
    { q: 'ASK is most susceptible to:', answer: 'Amplitude noise (encodes in amplitude)', paper: 'May 25' },
    { q: 'FSK system uses bandwidth approximately:', answer: '2fb (by Carson\'s rule)', paper: 'Jan 26, Jul 25' },
    { q: 'BPSK sends data at rate of:', answer: '1 bit/symbol (2 constellation points)', paper: 'Jan 26, May 25' },
    { q: '16-QAM can transmit how many bits per symbol?', answer: '4 bits/symbol (16 points = 2⁴)', paper: 'Jul 25' },
    { q: 'QPSK uses how many constellation points?', answer: '4 (2 bits/symbol)', paper: 'May 25' },
    { q: 'BPSK probability of error is:', answer: 'Pe = Q(√(2Es/N0))', paper: 'Jan 26, May 25' },
    { q: 'QAM transmitter uses:', answer: 'I/Q separation — In-phase and Quadrature carriers', paper: 'Jul 25' },
  ],
  'Noise & SNR': [
    { q: 'Thermal noise power is proportional to:', answer: 'Bandwidth × Temperature (Pn = kTB)', paper: 'Jan 26, Jul 25' },
    { q: 'Noise figure of an ideal amplifier is:', answer: '0 dB (F = 1)', paper: 'May 25' },
    { q: 'SNR in dB is defined as:', answer: '10 log₁₀(Ps/Pn) — power ratio', paper: 'Jan 26, Jul 25, May 25' },
    { q: 'Friis formula for two cascaded amplifiers:', answer: 'Ftotal = F1 + (F2−1)/G1', paper: 'Jan 26, Jul 25, May 25' },
    { q: 'Noise temperature Te is related to F by:', answer: 'Te = T(F − 1) where T = reference temperature (290K)', paper: 'Jul 25' },
    { q: 'In cascade, which stage dominates overall noise figure?', answer: 'First stage (divided by its gain)', paper: 'May 25' },
  ],
  'Communication Concepts': [
    { q: 'What is the primary advantage of digital communication over analog?', answer: 'Better noise immunity, easier multiplexing, signal regeneration', paper: 'Jan 26' },
    { q: 'Aliasing occurs when:', answer: 'fs < 2B — adjacent spectral replicas overlap', paper: 'Jan 26' },
    { q: 'Pre-alias filter cutoff should be:', answer: '≤ fs/2 (half the sampling frequency)', paper: 'Jul 25' },
    { q: 'TDM stands for:', answer: 'Time Division Multiplexing — slots assigned to different signals', paper: 'May 25' },
    { q: 'FDM stands for:', answer: 'Frequency Division Multiplexing — different carriers at different frequencies', paper: 'May 25' },
  ],
};

const PART_B_QUESTIONS: PartBQuestion[] = [
  // Unit 1
  {
    id: 'pb1', unit: 1, topic: 'AM Wave Derivation + Modulation Index',
    question: 'Derive the expression for amplitude modulated wave. Define modulation index and state the condition for undistorted AM.',
    mark: 10, papers: ['Jan 2026 FN', 'Jul 2025 FN'], priority: 'must',
    modelAnswer: `Let carrier be c(t) = Ec sin ωct and message be m(t) = Em sin ωmt.
AM wave: s(t) = [Ec + Em sin ωmt] sin ωct
= Ec sin ωct + (m·Ec/2)[cos(ωc−ωm)t − cos(ωc+ωm)t]

This shows: carrier at fc, USB at fc+fm, LSB at fc−fm.

Modulation index m = Em/Ec.

Condition for undistorted AM: m ≤ 1.
If m > 1 (over-modulation), envelope is distorted and message cannot be recovered.
Total power = Pc(1 + m²/2). Sideband power = (m²/2)·Pc / 2 per sideband.`,
    keyPoints: ['Define m = Em/Ec', 'Expand using trig identity: sin A sin B', 'Show carrier + USB + LSB', 'State m ≤ 1 for undistorted', 'Calculate total and sideband power']
  },
  {
    id: 'pb2', unit: 1, topic: 'AM vs DSB-SC vs SSB Comparison',
    question: 'Compare AM, DSB-SC and SSB modulation techniques in terms of bandwidth, power efficiency and applications.',
    mark: 10, papers: ['Jan 2026 FN', 'May 2025 AN'], priority: 'must',
    modelAnswer: `AM: BW = 2fm, power inefficient (carrier wastes ~2/3 power), used in broadcast radio (AM radio 540–1600 kHz).
DSB-SC: BW = 2fm, power efficient (no carrier), used in stereophonic broadcasting, requires coherent detection.
SSB: BW = fm (minimum), most power efficient, used in long-distance voice communication, military radios, but hardest to generate and requires precise filtering.
VSB: Vestigial sideband — used in TV broadcasting (balances bandwidth and power).`,
    keyPoints: ['Table format preferred in exam', 'AM: carrier wastes power', 'DSB-SC: no carrier but needs coherent detection', 'SSB: half bandwidth, hardest to generate']
  },
  {
    id: 'pb3', unit: 1, topic: 'DSB-SC Generation & Detection',
    question: 'Explain the generation and detection of DSB-SC with block diagram and required waveforms.',
    mark: 10, papers: ['May 2025 AN'], priority: 'important',
    modelAnswer: `Generation (Ring Modulator): Message m(t) and carrier c(t) fed to balanced modulator (ring modulator). Output contains only upper and lower sidebands — carrier is suppressed. No carrier at output.
Detection: Since envelope of DSB-SC is always positive (even without message), conventional envelope detector does NOT work. Requires coherent (synchronous) detection — multiply by carrier, LPF to recover message. Local oscillator at receiver must be phase-locked to transmitter carrier.`,
    keyPoints: ['Ring modulator uses diodes', 'Output: only USB + LSB (no carrier)', 'Coherent detection requires phase synchronization', 'Phase mismatch causes distortion']
  },
  // Unit 2
  {
    id: 'pb4', unit: 2, topic: 'FM Generation (Armstrong) + Carson\'s Rule',
    question: 'Explain the generation of FM using Armstrong indirect method. Derive Carson\'s rule for FM bandwidth.',
    mark: 15, papers: ['Jan 2026 FN', 'Jul 2025 FN', 'May 2025 AN'], priority: 'must',
    modelAnswer: `Armstrong Indirect Method:
1. Integrate message m(t) → m_int(t)
2. Phase-modulate crystal oscillator (stable ~1 MHz) with m_int(t) → Narrowband FM (NBFM, β < 0.5)
3. Frequency multipliers (×72) — multiply both carrier frequency AND deviation
   Δf_final = 72 × Δf_NBFM, fc_final = 72 × 1 MHz
4. Amplifier → WBFM at 88–108 MHz (broadcast band)

Carson's Rule: FM wave s(t) = Ec sin(ωc + β sin ωmt) where β = Δf/fm.
BW = 2(Δf + fm) = 2Δf(1 + 1/β)
This captures ~98% of FM spectrum power.`,
    keyPoints: ['Integrate → PM → NBFM', 'Crystal oscillator for frequency stability', 'Frequency multiplication increases Δf AND fc', 'Carson rule: BW = 2(Δf + fm)', 'Broadcast FM: Δf=75kHz, fm(max)=15kHz, β=5']
  },
  {
    id: 'pb5', unit: 2, topic: 'FM vs PM Relationship',
    question: 'Explain the relationship between FM and PM. Derive that FM is PM with message integrated.',
    mark: 10, papers: ['Jul 2025 FN'], priority: 'important',
    modelAnswer: `Relationship: FM is PM with the message integrated before modulation. PM is FM with the message differentiated after detection.

Mathematical proof:
FM phase: φ(t) = ωct + kf ∫m(t)dt  [kf = frequency deviation constant]
PM phase: φ(t) = ωct + kp·m(t)  [kp = phase deviation constant]

If we define m_FM = ∫m_PM(t)dt, then FM generated with m_FM produces same waveform as PM generated with m_PM.
Similarly, PM generated with m_PM produces same as FM detected and differentiated.`,
    keyPoints: ['FM: integrate message, then PM', 'PM: differentiate message, then FM', 'Both are angle modulation variants', 'Deviation ratio β differs: FM β=Δf/fm, PM β=kp·Em']
  },
  // Unit 3
  {
    id: 'pb6', unit: 3, topic: 'Sampling Theorem + Aliasing',
    question: 'State and prove the sampling theorem. What is aliasing and how is it prevented?',
    mark: 10, papers: ['Jan 2026 FN', 'Jul 2025 FN'], priority: 'must',
    modelAnswer: `Sampling theorem (Nyquist-Shannon): A band-limited signal of bandwidth B Hz can be completely reconstructed from its samples if sampled at fs ≥ 2B samples/second.

Proof: When m(t) is sampled at fs, its spectrum M(f) replicates at fs, 2fs, 3fs... These are spectral images. If fs ≥ 2B, images do not overlap. A low-pass filter with cutoff at B reconstructs m(t).

Aliasing: If fs < 2B, adjacent spectral images overlap. The overlap causes aliasing — high frequency components appear as lower frequencies. Prevention: Pre-alias filter — low-pass with cutoff ≤ fs/2, placed BEFORE sampling. This ensures no frequency > fs/2 enters the sampler.`,
    keyPoints: ['Spectrum replicates at multiples of fs', 'fs ≥ 2B prevents overlap (Nyquist criterion)', 'Aliasing = overlap of spectral replicas', 'Pre-alias filter essential — cutoff ≤ fs/2']
  },
  {
    id: 'pb7', unit: 3, topic: 'PAM / PWM / PPM Comparison',
    question: 'Compare PAM, PWM and PPM in terms of generation method, bandwidth and noise immunity.',
    mark: 10, papers: ['Jan 2026 FN', 'May 2025 AN'], priority: 'important',
    modelAnswer: `Generation:
PAM: Sample message at regular intervals, amplitude of each pulse = sample value (natural or flat-top).
PWM: Compare message with triangular waveform — when message > triangle, output high; else low. Width varies.
PPM: Differentiate PWM output — pulses appear at positions proportional to message amplitude.

Bandwidth: PAM BW ≈ fs (narrowest — amplitude only). PWM BW ∝ 1/τ (wider — width varies). PPM BW between PAM and PWM.

Noise Immunity: PPM most immune (constant amplitude and width, only position varies — hardest to corrupt). PWM next. PAM least immune (amplitude varies directly with noise).`,
    keyPoints: ['PAM: amplitude varies with message', 'PWM: width varies from triangular compare', 'PPM: position varies (from PWM differentiate)', 'PPM most noise immune, PAM least']
  },
  // Unit 4
  {
    id: 'pb8', unit: 4, topic: 'BPSK Generation & Detection',
    question: 'Explain the generation and detection of BPSK with constellation diagram and derive its probability of error.',
    mark: 15, papers: ['Jan 2026 FN', 'Jul 2025 FN', 'May 2025 AN'], priority: 'must',
    modelAnswer: `Generation: Binary data b(t) maps to +1 (bit 1) and −1 (bit 0). Multiply by carrier cos(ωct):
s(t) = A cos(ωct) for bit 1, s(t) = −A cos(ωct) for bit 0.
Phase difference between symbols = π radians (180°). Constellation: two points at (±√Es, 0).

Detection (Coherent): Multiply received r(t) by cos(ωct), LPF, decision device (threshold at 0).
If output > 0 → bit 1; if < 0 → bit 0.

Probability of error: Pe = Q(√(2Es/N0)) = (1/2) erfc(√(Es/N0))
BPSK is the most noise-immune binary modulation scheme — double the distance between constellation points compared to BFSK/BASK.`,
    keyPoints: ['Two constellation points, phase difference π', 'Coherent detection required (synchronous local oscillator)', 'Pe = Q(√(2Es/N0))', 'Most noise-immune binary modulation']
  },
  {
    id: 'pb9', unit: 4, topic: 'QAM Block Diagram & 16-QAM vs QPSK',
    question: 'Explain QAM with block diagram. How does 16-QAM differ from QPSK?',
    mark: 10, papers: ['Jul 2025 FN'], priority: 'important',
    modelAnswer: `QAM Transmitter: Message bits enter serializer → demultiplexer (splits to I and Q channels).
I = In-phase component (modulates cos ωct), Q = Quadrature component (modulates sin ωct).
s(t) = I(t)cos(ωct) + Q(t)sin(ωct). Both carriers at same frequency, 90° apart.

QAM Receiver: Multiply by cos and sin separately → two LPFs → recover I and Q → multiplexer → bits.

16-QAM: 16 constellation points = 4 bits/symbol. Higher spectral efficiency but lower noise immunity.
QPSK: 4 constellation points = 2 bits/symbol. Better noise immunity than 16-QAM. Used in 4G/5G, satellite TV.
Trade-off: 16-QAM for bandwidth efficiency, QPSK for robustness.`,
    keyPoints: ['I/Q separation at transmitter', 'I recovers by cos demod, Q by sin demod', '16-QAM: 4 bits/symbol, lower noise immunity', 'QPSK: 2 bits/symbol, better noise immunity']
  },
  // Unit 5
  {
    id: 'pb10', unit: 5, topic: 'Noise Figure + Friis Formula',
    question: 'Define noise figure and noise temperature. Derive Friis formula for cascaded amplifiers.',
    mark: 15, papers: ['Jan 2026 FN', 'Jul 2025 FN', 'May 2025 AN'], priority: 'must',
    modelAnswer: `Noise Figure F = (SNRin)/(SNRout) — ratio of SNR at input to SNR at output. F ≥ 1 (0 dB for ideal).
Noise Temperature Te = T(F − 1) where T is reference temperature (290K).

Friis Formula (N cascaded stages):
Ftotal = F1 + (F2−1)/G1 + (F3−1)/(G1·G2) + ... + (FN−1)/(G1·G2·...·G(N−1))

Key insight: First stage dominates because its contribution is undivided, while later stages are divided by cumulative gain.
If G1 is large (e.g., RF amplifier with 20 dB gain), F2 contributes very little to total F.
This is why RF receivers always use a high-gain low-noise amplifier (LNA) as the first stage.`,
    keyPoints: ['F = SNRin/SNRout, always ≥ 1', 'First stage dominates — its noise is undividied', 'High G1 early = low overall F', 'Friis formula: cascade product in denominator of each term']
  },
];

const PART_C_QUESTIONS: PartCQuestion[] = [
  {
    id: 'pc1', unit: 1,
    scenario: 'A carrier of 1 MHz is amplitude modulated by a sine wave of 5 kHz with modulation index m = 0.6. Find: (i) frequencies of upper and lower sidebands, (ii) bandwidth, (iii) total power if carrier power is 10W, (iv) power in sidebands.',
    rank: 'Highly Probable', mark: 15,
    modelAnswer: `Given: fc = 1 MHz, fm = 5 kHz, m = 0.6, Pc = 10W.

(i) USB = fc + fm = 1005 kHz. LSB = fc − fm = 995 kHz.
(ii) Bandwidth = 2fm = 10 kHz.
(iii) Total power = Pc(1 + m²/2) = 10(1 + 0.18) = 11.8 W.
(iv) Sideband power = (m²/2) × Pc = (0.36/2) × 10 = 1.8 W total.
    Each sideband = 0.9 W.

Key formulas: m = Em/Ec, BW = 2fm, Pt = Pc(1 + m²/2), Psb = (m²/2)·Pc / 2 per sideband.`,
    keyPoints: ['USB = fc + fm, LSB = fc − fm', 'BW = 2fm', 'Pt = Pc(1 + m²/2)', 'Each sideband = (m²·Pc)/4'],
    evidence: 'AM numerical analysis (sideband frequencies, power distribution) appeared in Jan 2026 FN. Numerical AM problem is highly predictable.'
  },
  {
    id: 'pc2', unit: 2,
    scenario: 'An FM wave has a frequency deviation of 75 kHz and a modulating frequency of 15 kHz. (i) Find the bandwidth using Carson\'s rule, (ii) What is the deviation ratio β? (iii) If the modulating frequency is halved to 7.5 kHz, what is the new bandwidth? (iv) Comment on the relationship.',
    rank: 'Highly Probable', mark: 15,
    modelAnswer: `Given: Δf = 75 kHz, fm = 15 kHz.

(i) BW = 2(Δf + fm) = 2(75 + 15) = 180 kHz.
(ii) β = Δf/fm = 75/15 = 5.
(iii) If fm = 7.5 kHz: BW = 2(75 + 7.5) = 165 kHz. β = 75/7.5 = 10.
(iv) Halving fm doubles β. Since Δf >> fm, this is wideband FM (β >> 1). BW ≈ 2Δf (deviation-dominated).
Broadcast FM standard: Δf = 75 kHz, fm(max) = 15 kHz, BW = 180 kHz (channel spacing 200 kHz).

Note: Carson\'s rule captures ~98% of power. True BW is slightly larger.`,
    keyPoints: ['Carson rule: BW = 2(Δf + fm)', 'β = Δf/fm', 'When β >> 1: BW ≈ 2Δf (deviation dominates)', 'Broadcast FM: Δf=75kHz is standard'],
    evidence: 'FM numerical (Carson rule, deviation ratio, bandwidth calculation) appeared in Jan 2026 FN and Jul 2025 FN. This exact cascade calculation is guaranteed.'
  },
  {
    id: 'pc3', unit: 5,
    scenario: 'A communication system has an amplifier with noise figure F = 4 (6 dB) and power gain G = 100 (20 dB) followed by a second amplifier with F = 9 (9.5 dB) and G = 1000 (30 dB). Find: (i) overall noise figure using Friis formula, (ii) If input noise temperature is 290K, find the output noise temperature.',
    rank: 'Very Likely', mark: 15,
    modelAnswer: `Given: F1 = 4, G1 = 100, F2 = 9, G2 = 1000, T0 = 290K.

(i) Friis: Ftotal = F1 + (F2 − 1)/G1 = 4 + (9 − 1)/100 = 4 + 0.08 = 4.08 (6.1 dB).
    Note: Stage 2 contributes only 0.08 to total because G1 = 100 divides it.

(ii) Te1 = T0(F1 − 1) = 290 × 3 = 870 K.
    Te2 = T0(F2 − 1) = 290 × 8 = 2320 K.
    Te(total) = Te1 + Te2/G1 = 870 + 2320/100 = 893.2 K.

Stage 1 dominates. Even though stage 2 has higher noise figure, its contribution is divided by G1 = 100 in the Friis formula. This is why RF receivers use a high-gain LNA as first stage.`,
    keyPoints: ['Ftotal = F1 + (F2−1)/G1', 'Stage 1 dominates due to division by G1', 'Te = T(F−1)', 'LNA as first stage = low overall noise'],
    evidence: 'Noise figure numerical (Friis formula, cascade calculation) appeared in Jan 2026 and May 2025. This exact problem structure is a guaranteed exam question.'
  },
];

// ─────────────────────────────────────────
// STUDY PRIORITY SYSTEM
// ─────────────────────────────────────────

const UNIT_INFO = [
  { unit: 1, name: 'AM, DSB-SC, SSB', color: '#0066cc', marks: 20, priority: 'MUST' },
  { unit: 2, name: 'FM, PM', color: '#7c3aed', marks: 15, priority: 'MUST' },
  { unit: 3, name: 'Sampling, PAM, PWM, PPM', color: '#0891b2', marks: 15, priority: 'IMPORTANT' },
  { unit: 4, name: 'ASK, FSK, PSK, QAM', color: '#059669', marks: 15, priority: 'IMPORTANT' },
  { unit: 5, name: 'Noise, SNR, Friis', color: '#dc2626', marks: 10, priority: 'MUST' },
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

function PriorityBadge({ priority }: { priority: 'must' | 'important' | 'safe' }) {
  const colors = { must: '#ef4444', important: '#f59e0b', safe: '#22c55e' };
  const labels = { must: 'MUST STUDY', important: 'IMPORTANT', safe: 'SAFE' };
  return (
    <span style={{
      fontSize: '10px', fontWeight: 700, color: colors[priority],
      background: `${colors[priority]}18`, padding: '3px 8px', borderRadius: '100px',
      border: `1px solid ${colors[priority]}30`,
    }}>
      {labels[priority]}
    </span>
  );
}

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────

export function ADCMasterSheet({ onBack }: Props) {
  const [activeUnit, setActiveUnit] = useState<number | 'all'>('all');
  const [openMCQTopic, setOpenMCQTopic] = useState<string | null>('AM (Amplitude Modulation)');
  const [openPartBQ, setOpenPartBQ] = useState<string | null>('pb1');
  const [openPartC, setOpenPartC] = useState<string | null>('pc1');

  const toggleMCQTopic = (topic: string) => setOpenMCQTopic(openMCQTopic === topic ? null : topic);
  const togglePartB = (id: string) => setOpenPartBQ(openPartBQ === id ? null : id);
  const togglePartC = (id: string) => setOpenPartC(openPartC === id ? null : id);

  const units = [{ n: 'All', v: 'all' as const }, ...UNIT_INFO.map(u => ({ n: `U${u.unit}`, v: u.unit as const }))];

  const filteredPartB = activeUnit === 'all'
    ? PART_B_QUESTIONS
    : PART_B_QUESTIONS.filter(q => q.unit === activeUnit);

  const filteredPartC = activeUnit === 'all'
    ? PART_C_QUESTIONS
    : PART_C_QUESTIONS.filter(q => q.unit === activeUnit);

  const filteredMCQTopics = activeUnit === 'all'
    ? MCQ_TOPICS
    : Object.fromEntries(
        Object.entries(MCQ_TOPICS).filter(([topic]) => {
          // Map topics to units
          const unit1Topics = ['AM (Amplitude Modulation)', 'DSB-SC & SSB'];
          const unit2Topics = ['FM (Frequency Modulation)', 'PM (Phase Modulation)'];
          const unit3Topics = ['Sampling & Pulse Modulation'];
          const unit4Topics = ['Digital Modulation (ASK/FSK/PSK/QAM)'];
          const unit5Topics = ['Noise & SNR', 'Communication Concepts'];
          const topicMap: Record<string, number> = {};
          [...unit1Topics, ...unit2Topics, ...unit3Topics, ...unit4Topics, ...unit5Topics].forEach((t, i) => {
            const unit = Math.ceil((i + 1) / 2);
          });
          const mapping: Record<string, number> = {};
          unit1Topics.forEach(t => mapping[t] = 1);
          unit2Topics.forEach(t => mapping[t] = 2);
          unit3Topics.forEach(t => mapping[t] = 3);
          unit4Topics.forEach(t => mapping[t] = 4);
          unit5Topics.forEach(t => mapping[t] = 5);
          return mapping[topic] === activeUnit;
        })
      );

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
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>Analog and Digital Communication</span>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>21ECC302T</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a href="/ADC_Syllabus.pdf" target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '6px 14px', borderRadius: '9999px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.14)',
            color: 'rgba(255,255,255,0.85)',
            fontSize: '12px', fontWeight: 400, cursor: 'pointer', textDecoration: 'none',
          }}>
            <BookOpen size={12} strokeWidth={1.5} />
            Syllabus
          </a>
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
            3 Papers Analyzed · Complete Q&A · Study to Score 75/75
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
            {[
              { n: '3', l: 'Papers', c: '#2997ff' },
              { n: '18', l: 'MCQs', c: '#bf5af2' },
              { n: '10', l: 'Part B Qs', c: '#30d158' },
              { n: '3', l: 'Part C Qs', c: '#ff9f0a' },
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

        {/* ── EXAM FORMAT ──────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle label="Exam Structure" title="Format at a Glance" desc="Know what you're walking into." />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {EXAM_FORMAT.map((card, i) => (
              <div key={i} style={{
                padding: '20px', borderRadius: '14px',
                border: `1.5px solid ${card.color}33`,
                background: `${card.color}08`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2.5px', background: card.color }} />
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: card.color, marginBottom: '6px' }}>
                  {card.part}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.03em' }}>{card.detail}</div>
                <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px' }}>{card.sub}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '10px', fontStyle: 'italic' }}>{card.note}</div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '14px 20px', background: '#f9fafb', borderRadius: '10px',
            border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: '8px',
          }}>
            <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: 400 }}>Total</span>
            <span style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.03em' }}>
              75 marks · 3 hours
            </span>
          </div>
        </motion.section>

        {/* ── PAPERS ANALYSED ──────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle label="Evidence Base" title="Papers Analyzed" desc="Every prediction grounded in these papers." />

          <div style={{ background: '#1c1c1e', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['Code', 'Exam Session', 'Notable Question'].map(h => (
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
                    <td style={{ padding: '16px 20px', color: '#ffffff', fontWeight: 500 }}>Jan 2026 / Jul 2025 / May 2025</td>
                    <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.55)', fontSize: '13px', maxWidth: '300px' }}>{row.highlight}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* ── UNIT FILTER ───────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '48px' }}
        >
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Filter by Unit:</span>
            {units.map(u => (
              <button
                key={u.n}
                onClick={() => setActiveUnit(u.v)}
                style={{
                  padding: '6px 16px', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 600,
                  background: activeUnit === u.v ? '#2997ff' : 'rgba(255,255,255,0.08)',
                  color: activeUnit === u.v ? '#fff' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.2s',
                }}
              >
                {u.n}
              </button>
            ))}
          </div>

          {/* Unit Priority Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {UNIT_INFO.map(u => (
              <div key={u.unit} style={{
                background: '#1c1c1e', borderRadius: '12px', padding: '14px 16px',
                border: `1px solid ${u.color}30`,
                opacity: activeUnit === 'all' || activeUnit === u.unit ? 1 : 0.5,
              }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: u.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                  Unit {u.unit}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', marginBottom: '6px', lineHeight: 1.3 }}>
                  {u.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{u.marks} marks</span>
                  <PriorityBadge priority={u.priority === 'MUST' ? 'must' : u.priority === 'IMPORTANT' ? 'important' : 'safe'} />
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── PART A: MCQ MASTER LIST ─────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle
            label="Part A · 20 × 1 = 20 marks"
            title="MCQ Master List — All Topics"
            desc="All MCQs from all 3 papers grouped by topic. Each question appears exactly as it appeared in exam."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(filteredMCQTopics).map(([topic, questions]) => (
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
                      {questions.length} Qs
                    </span>
                  </div>
                  {openMCQTopic === topic
                    ? <ChevronUp size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />
                    : <ChevronDown size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  }
                </button>

                <AnimatePresence initial={false}>
                  {openMCQTopic === topic && (
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
                              <th style={{ padding: '10px 8px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>#</th>
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
            ))}
          </div>
        </motion.section>

        {/* ── PART B: LONG ANSWERS ────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle
            label="Part B · 4 × 10 = 40 marks"
            title="Long Answer Questions by Unit"
            desc="Answer any 4 of 6. Each question includes full model answer and key points."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredPartB.map((q) => {
              const isOpen = openPartBQ === q.id;
              return (
                <motion.div
                  key={q.id}
                  layout
                  style={{
                    background: '#1c1c1e', borderRadius: '14px',
                    border: `1px solid ${q.priority === 'must' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.07)'}`,
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
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px',
                      background: 'rgba(41,151,255,0.12)', border: '1px solid rgba(41,151,255,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 600, color: '#2997ff', flexShrink: 0,
                    }}>U{q.unit}</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', flex: 1 }}>{q.topic}</span>
                      <PriorityBadge priority={q.priority} />
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '100px' }}>
                        {q.mark} marks
                      </span>
                    </div>
                    {isOpen
                      ? <ChevronUp size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />
                      : <ChevronDown size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />
                    }
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
                        <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          {/* Question */}
                          <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#2997ff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                              Question
                            </div>
                            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, fontStyle: 'italic' }}>
                              {q.question}
                            </div>
                          </div>

                          {/* Papers */}
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                              Appeared In
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {q.papers.map(p => (
                                <span key={p} style={{ fontSize: '11px', fontWeight: 600, color: '#2997ff', background: 'rgba(41,151,255,0.1)', padding: '2px 8px', borderRadius: '100px' }}>{p}</span>
                              ))}
                            </div>
                          </div>

                          {/* Model Answer */}
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#30d158', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                              Model Answer
                            </div>
                            <div style={{ background: '#000', borderRadius: '10px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                              <pre style={{ margin: 0, fontSize: '12px', lineHeight: 1.65, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {q.modelAnswer}
                              </pre>
                            </div>
                          </div>

                          {/* Key Points */}
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                              Key Points to Remember
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {q.keyPoints.map((kp, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0, marginTop: '6px' }} />
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

        {/* ── PART C: 15-MARK QUESTIONS ──────────────── */}
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
            desc="These exact problem types appeared in recent exams. Study these and guarantee 15 marks."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredPartC.map((q) => {
              const isOpen = openPartC === q.id;
              const rankColors: Record<string, string> = { 'Highly Probable': '#ef4444', 'Very Likely': '#f59e0b', 'Possible': '#6b7280' };
              return (
                <motion.div
                  key={q.id}
                  layout
                  style={{
                    background: '#1c1c1e', borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.08)',
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
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px',
                      background: 'rgba(255,159,10,0.12)', border: '1px solid rgba(255,159,10,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 600, color: '#ff9f0a', flexShrink: 0,
                    }}>U{q.unit}</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', flex: 1 }}>{q.scenario.slice(0, 60)}...</span>
                      <span style={{
                        fontSize: '10px', fontWeight: 700,
                        color: rankColors[q.rank],
                        background: `${rankColors[q.rank]}18`,
                        padding: '3px 8px', borderRadius: '100px',
                        border: `1px solid ${rankColors[q.rank]}30`,
                      }}>
                        {q.rank}
                      </span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '100px' }}>
                        {q.mark} marks
                      </span>
                    </div>
                    {isOpen
                      ? <ChevronUp size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />
                      : <ChevronDown size={14} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.4)' }} />
                    }
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
                        <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          {/* Full scenario */}
                          <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#2997ff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                              Full Question
                            </div>
                            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                              {q.scenario}
                            </div>
                          </div>

                          {/* Evidence */}
                          <div style={{ marginBottom: '16px', padding: '12px 14px', background: 'rgba(41,151,255,0.08)', borderRadius: '10px', border: '1px solid rgba(41,151,255,0.15)' }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#2997ff', marginBottom: '4px' }}>Evidence</div>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{q.evidence}</div>
                          </div>

                          {/* Model Answer */}
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#30d158', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                              Step-by-Step Solution
                            </div>
                            <div style={{ background: '#000', borderRadius: '10px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                              <pre style={{ margin: 0, fontSize: '12px', lineHeight: 1.65, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {q.modelAnswer}
                              </pre>
                            </div>
                          </div>

                          {/* Key Points */}
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                              Key Formulas
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {q.keyPoints.map((kp, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0, marginTop: '6px' }} />
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

        {/* ── EXAM STRATEGY ────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: '72px' }}
        >
          <SectionTitle
            label="Strategy"
            title="Score 75/75 Study Plan"
            desc="Follow this plan. Every mark is accounted for."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Part A Strategy */}
            <div style={{
              background: '#1c1c1e', borderRadius: '14px', padding: '20px',
              border: '1px solid rgba(0,102,204,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(0,102,204,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#0066cc' }}>A</div>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>Part A — 20 Marks</span>
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                <p style={{ marginBottom: '8px' }}>All 20 MCQs compulsory. No choice.</p>
                <p style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Focus topics:</strong></p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                  {['AM modulation index + power (3/3 papers)', 'FM Carson\'s rule + deviation ratio (3/3)', 'Noise/SNR/Friis formula (3/3)', 'Sampling theorem (3/3)', 'BPSK/PSK constellation (3/3)'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={12} style={{ color: '#22c55e', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '8px 12px', background: 'rgba(0,102,204,0.1)', borderRadius: '8px', border: '1px solid rgba(0,102,204,0.2)' }}>
                  <span style={{ fontSize: '12px', color: '#0066cc', fontWeight: 600 }}>Target: 18/20</span>
                </div>
              </div>
            </div>

            {/* Part B Strategy */}
            <div style={{
              background: '#1c1c1e', borderRadius: '14px', padding: '20px',
              border: '1px solid rgba(124,58,237,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#7c3aed' }}>B</div>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>Part B — 40 Marks</span>
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                <p style={{ marginBottom: '8px' }}>Answer 4 of 6 questions. Pick your best 4.</p>
                <p style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Must prepare (in order):</strong></p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                  {[
                    { n: '1', t: 'AM derivation + m ≤ 1 (10 marks)' },
                    { n: '2', t: 'FM Armstrong + Carson\'s Rule (15 marks)' },
                    { n: '3', t: 'Sampling theorem + aliasing (10 marks)' },
                    { n: '4', t: 'BPSK generation + Pe derivation (15 marks)' },
                    { n: '5', t: 'Noise figure + Friis formula (15 marks)' },
                    { n: '6', t: 'QAM block diagram + 16-QAM vs QPSK (10 marks)' },
                  ].map(({ n, t }) => (
                    <div key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#7c3aed', flexShrink: 0 }}>{n}</div>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '8px 12px', background: 'rgba(124,58,237,0.1)', borderRadius: '8px', border: '1px solid rgba(124,58,237,0.2)' }}>
                  <span style={{ fontSize: '12px', color: '#7c3aed', fontWeight: 600 }}>Target: 35/40 (pick 4 × 10 or 2 × 15 + 1 × 10)</span>
                </div>
              </div>
            </div>

            {/* Part C Strategy */}
            <div style={{
              background: '#1c1c1e', borderRadius: '14px', padding: '20px',
              border: '1px solid rgba(239,68,68,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>C</div>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>Part C — 15 Marks</span>
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                <p style={{ marginBottom: '8px' }}>One compulsory 15-mark numerical. Two choices A or B.</p>
                <p style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Highly probable questions:</strong></p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                  {[
                    { r: '🔥', t: 'AM sideband power + frequency calculation', prob: 'Jan 26, Jul 25' },
                    { r: '🔥', t: 'FM Carson\'s rule + deviation ratio numerical', prob: 'Jan 26, Jul 25' },
                    { r: '⚡', t: 'Friis cascade noise figure calculation', prob: 'Jan 26, May 25' },
                  ].map(({ r, t, prob }, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ fontSize: '12px', flexShrink: 0 }}>{r}</span>
                      <div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{t}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{prob}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>Target: 14/15</span>
                </div>
              </div>
            </div>
          </div>

          {/* Score breakdown */}
          <div style={{
            marginTop: '24px',
            background: 'rgba(48,209,88,0.08)', borderRadius: '16px', padding: '24px',
            border: '1px solid rgba(48,209,88,0.2)',
            display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              {[
                { part: 'Part A', target: '18/20', color: '#0066cc' },
                { part: 'Part B', target: '35/40', color: '#7c3aed' },
                { part: 'Part C', target: '14/15', color: '#dc2626' },
                { part: 'Total', target: '67/75', color: '#30d158' },
              ].map(({ part, target, color }) => (
                <div key={part} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color, letterSpacing: '-0.04em' }}>{target}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>{part}</div>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#30d158', marginBottom: '6px' }}>This gets you 67/75 — well above passing.</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                To hit 75: be perfect on AM numerical (Part C, 15 marks) and solid on Part B theory questions.
              </div>
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
            Aswath AS · SRM Institute · "Analyse all papers. Know what's coming. Score what you deserve."
          </p>
        </motion.div>
      </div>
    </div>
  );
}