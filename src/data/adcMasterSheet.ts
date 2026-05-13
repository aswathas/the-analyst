// ADC PYQ Master Sheet — 21ECC302T Analog and Digital Communication
// Exam pattern: 20 MCQ×1mark | 5 Part B×8marks | 1 Part C×15marks = 75 marks
// Data from Jan 2026 FN, Jul 2025 FN, May 2025 AN

export interface ADCPartA {
  id: string;
  unit: number;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  paper: string;
}

export interface ADCPartB {
  id: string;
  unit: number;
  question: string;
  topic: string;
  mark: number;
  papers: string[];
  modelAnswer: string;
  keyPoints: string[];
}

export interface ADCPartC {
  id: string;
  unit: number;
  scenario: string;
  rank: 'Highly Probable' | 'Very Likely' | 'Possible';
  mark: number;
  modelAnswer: string;
  evidence: string;
  topics: string[];
}

// ============================================================================
// PART A — 20 MCQs (1 mark each = 20 marks)
// ============================================================================

export const ADC_PART_A: ADCPartA[] = [
  // Unit 1: AM, DSB-SC, SSB
  {
    id: 'mcq1', unit: 1, topic: 'AM Modulation Index',
    question: 'The modulation index m of AM is defined as:',
    options: ['Em/Ec', 'Ec/Em', 'Ec × Em', '(Ec - Em)/(Ec + Em)'],
    correctAnswer: 0,
    explanation: 'm = Em/Ec. Must satisfy m ≤ 1 for undistorted AM. When m > 1 (over-modulation), envelope crosses zero → distortion.',
    paper: 'Jan 26 · Jul 25 · May 25',
  },
  {
    id: 'mcq2', unit: 1, topic: 'AM Over-modulation',
    question: 'For undistorted AM transmission, the condition on modulation index is:',
    options: ['m = 0', 'm ≤ 1', 'm ≥ 1', 'm = 1'],
    correctAnswer: 1,
    explanation: 'm ≤ 1 ensures envelope (Ec + Em sin ωmt) never goes negative. Over-modulation (m > 1) causes envelope to cross zero → message unrecoverable at receiver.',
    paper: 'Jan 26 · Jul 25',
  },
  {
    id: 'mcq3', unit: 1, topic: 'AM Power',
    question: 'Total power in AM wave is:',
    options: ['Pc(1 + m)', 'Pc(1 + m²/2)', 'Pc(1 + 2m)', 'Pc(1 - m²)'],
    correctAnswer: 1,
    explanation: 'Pt = Pc(1 + m²/2). Carrier power Pc is unchanged; sidebands carry (m²/2) × Pc total. Each sideband: (m²/4) × Pc.',
    paper: 'Jan 26 · Jul 25 · May 25',
  },
  {
    id: 'mcq4', unit: 1, topic: 'DSB-SC Bandwidth',
    question: 'DSB-SC bandwidth as compared to SSB is:',
    options: ['Same', 'Double', 'Half', 'Four times'],
    correctAnswer: 1,
    explanation: 'DSB-SC has two sidebands: BW = 2fm. SSB has one sideband: BW = fm. Therefore DSB-SC BW is exactly double SSB BW.',
    paper: 'Jul 25',
  },
  {
    id: 'mcq5', unit: 1, topic: 'SSB Advantage',
    question: 'SSB is preferred over AM because of:',
    options: ['Lower BW only', 'Higher power efficiency only', 'Better SNR only', 'All of the above'],
    correctAnswer: 3,
    explanation: 'SSB offers: half BW (spectrum conservation), higher power efficiency (no carrier), better SNR (no carrier power wasted).',
    paper: 'Jan 26 · May 25',
  },
  {
    id: 'mcq6', unit: 1, topic: 'DSB-SC Detection',
    question: 'DSB-SC modulation requires:',
    options: ['Envelope detector', 'Coherent/product detector', 'Frequency discriminator', 'PLL detector'],
    correctAnswer: 1,
    explanation: 'DSB-SC has no carrier → envelope detector fails. A coherent (product) detector multiplies with a locally generated carrier at correct frequency and phase, then LPF.',
    paper: 'Jul 25',
  },
  {
    id: 'mcq7', unit: 1, topic: 'AM Sideband Power',
    question: 'For AM with m = 0.8, the percentage of total power in sidebands is:',
    options: ['16%', '24%', '32%', '48%'],
    correctAnswer: 0,
    explanation: 'Sideband power fraction = m²/(2+m²) = 0.64/2.64 ≈ 24%. Each sideband = m²/4 = 0.16 = 16% of total.',
    paper: 'Jan 26 · Jul 25',
  },

  // Unit 2: FM, PM
  {
    id: 'mcq8', unit: 2, topic: 'FM Deviation',
    question: 'In FM, frequency deviation Δf is directly proportional to:',
    options: ['Carrier frequency fc', 'Modulating frequency fm', 'Amplitude of modulating signal Em', 'Phase of carrier'],
    correctAnswer: 2,
    explanation: 'Δf = kf × Em. Deviation depends on HOW LOUD (amplitude) the message is, not how fast (frequency). fm determines how fast carrier swings around fc.',
    paper: 'Jan 26 · Jul 25 · May 25',
  },
  {
    id: 'mcq9', unit: 2, topic: "Carson's Rule",
    question: "Carson's rule for FM bandwidth states:",
    options: ['BW = 2fm', 'BW = 2(Δf + fm)', 'BW = Δf/fm', 'BW = fm/Δf'],
    correctAnswer: 1,
    explanation: "BW = 2(Δf + fm) = 2Δf(1 + 1/β). Captures ~98% of FM power. Shows bandwidth is determined by both deviation and modulating frequency.",
    paper: 'Jan 26 · Jul 25 · May 25',
  },
  {
    id: 'mcq10', unit: 2, topic: 'Deviation Ratio',
    question: 'Deviation ratio β is defined as:',
    options: ['Δf × fm', 'Δf/fm', 'fm/Δf', '2(Δf + fm)'],
    correctAnswer: 1,
    explanation: 'β = Δf/fm. For broadcast FM: Δf = 75 kHz, fm(max) = 15 kHz, so β = 5, BW = 180 kHz.',
    paper: 'Jan 26',
  },
  {
    id: 'mcq11', unit: 2, topic: 'Armstrong FM',
    question: 'In Armstrong indirect FM method, the message signal is first:',
    options: ['Differentiated', 'Integrated', 'Amplified', 'Filtered'],
    correctAnswer: 1,
    explanation: 'Message is integrated → applied to phase modulator → generates NBFM at ~1 MHz → frequency multiplied ×72 to get WBFM at 88-108 MHz.',
    paper: 'Jul 25 · Jan 26',
  },
  {
    id: 'mcq12', unit: 2, topic: 'Pre-emphasis',
    question: 'Pre-emphasis in FM broadcasting boosts:',
    options: ['Low frequencies', 'High frequencies', 'Carrier amplitude', 'Modulation index'],
    correctAnswer: 1,
    explanation: 'Pre-emphasis boosts high frequencies before transmission (τ = 75 μs, fc ≈ 2.1 kHz). Receiver applies de-emphasis to restore original spectrum and reduce noise.',
    paper: 'Jul 25',
  },
  {
    id: 'mcq13', unit: 2, topic: 'FM-PM Relationship',
    question: 'FM and PM are related through:',
    options: ['Differentiation', 'Integration', 'Rectification', 'Synchronization'],
    correctAnswer: 1,
    explanation: 'FM(t) = PM with message integrated. PM(t) = FM with message differentiated. Since frequency is derivative of phase, FM and PM are related by integration/differentiation of the modulating signal.',
    paper: 'May 25',
  },
  {
    id: 'mcq14', unit: 2, topic: 'Broadcast FM Standard',
    question: 'Commercial FM broadcast standard for Δf and fm(max) is:',
    options: ['Δf = 75 kHz, fm(max) = 15 kHz', 'Δf = 15 kHz, fm(max) = 75 kHz', 'Δf = 75 kHz, fm(max) = 75 kHz', 'Δf = 200 kHz, fm(max) = 15 kHz'],
    correctAnswer: 0,
    explanation: 'Broadcast FM: Δf = 75 kHz, fm(max) = 15 kHz. BW = 2(75 + 15) = 180 kHz. Channel spacing = 200 kHz. β = 75/15 = 5.',
    paper: 'Jan 26 · Jul 25',
  },

  // Unit 3: Sampling, PAM, PWM, PPM
  {
    id: 'mcq15', unit: 3, topic: 'Nyquist Sampling',
    question: 'Nyquist sampling theorem requires fs:',
    options: ['Equal to signal frequency', 'Greater than twice signal bandwidth', 'Less than signal frequency', 'Equal to signal bandwidth'],
    correctAnswer: 1,
    explanation: 'fs ≥ 2B where B is message bandwidth. Ensures spectral replicas do not overlap. If fs < 2B → aliasing → original unrecoverable.',
    paper: 'Jan 26 · Jul 25 · May 25',
  },
  {
    id: 'mcq16', unit: 3, topic: 'Flat-top PAM',
    question: 'In flat-top PAM, each pulse:',
    options: ['Varies in width proportionally to message', 'Is held constant at sample value for entire duration', 'Varies in position based on message', 'Has zero amplitude'],
    correctAnswer: 1,
    explanation: 'Flat-top PAM uses sample-and-hold: pulse amplitude equals message value at sampling instant and is held constant for entire pulse duration.',
    paper: 'May 25 · Jan 26',
  },
  {
    id: 'mcq17', unit: 3, topic: 'PWM',
    question: 'In PWM (pulse width modulation), information is encoded in:',
    options: ['Pulse amplitude', 'Pulse position', 'Pulse width/duty cycle', 'Pulse frequency'],
    correctAnswer: 2,
    explanation: 'PWM varies pulse width proportionally to message amplitude. Generated by comparing message signal with a triangular waveform.',
    paper: 'Jul 25',
  },
  {
    id: 'mcq18', unit: 3, topic: 'PPM',
    question: 'PPM (pulse position modulation) is derived from PWM by:',
    options: ['Amplitude comparison', 'Differentiation', 'Integration', 'Rectification'],
    correctAnswer: 1,
    explanation: 'PPM is obtained by differentiating the PWM signal. The differentiated signal produces narrow pulses at leading and trailing edges — trailing edge position varies with PWM width.',
    paper: 'May 25',
  },
  {
    id: 'mcq19', unit: 3, topic: 'Aliasing',
    question: 'Aliasing occurs when:',
    options: ['fs > 2B', 'fs = 2B', 'fs < 2B', 'fs = B'],
    correctAnswer: 2,
    explanation: 'Aliasing occurs when fs < 2B — adjacent spectral replicas overlap. Prevention: pre-alias filter (LPF with cutoff ≤ fs/2) before sampling.',
    paper: 'Jan 26 · Jul 25 · May 25',
  },
  {
    id: 'mcq20', unit: 3, topic: 'PCM Sampling Rate',
    question: 'Standard PCM sampling rate for 4 kHz audio (telephony) is:',
    options: ['4 kHz', '8 kHz', '16 kHz', '2 kHz'],
    correctAnswer: 1,
    explanation: 'Telephony: B = 4 kHz. Nyquist requires fs ≥ 8 kHz. Standard is fs = 8 kHz. Data rate = 8 kHz × 8 bits = 64 kbps (standard PCM).',
    paper: 'Jul 25',
  },
];

// ============================================================================
// PART B — 5 Long Answer Questions (8 marks each = 40 marks)
// ============================================================================

export const ADC_PART_B: ADCPartB[] = [
  {
    id: 'pb1', unit: 1,
    question: 'Derive the AM wave equation. Define modulation index and state the condition for undistorted AM transmission.',
    topic: 'AM Wave Derivation',
    mark: 8,
    papers: ['Jan 26', 'Jul 25'],
    modelAnswer: `Derivation:
Carrier: c(t) = Ec sin ωct
Message: m(t) = Em sin ωmt, with m = Em/Ec

AM wave: s(t) = [Ec + Em sin ωmt] sin ωct
= Ec sin ωct + (m·Ec/2)[cos(ωc-ωm)t - cos(ωc+ωm)t]

Spectrum: Carrier at fc, USB at fc+fm, LSB at fc-fm
Bandwidth = 2fm

MODULATION INDEX: m = Em/Ec
- m < 1: envelope varies between Ec(1-m) and Ec(1+m), never zero → undistorted
- m = 1: envelope just touches zero → critical modulation
- m > 1: envelope becomes negative → over-modulation → severe distortion

CONDITION FOR UNDISTORTED AM: m ≤ 1`,
    keyPoints: [
      's(t) = [Ec + Em sin ωmt] sin ωct',
      'Expand using sin A sin B identity → carrier + USB + LSB',
      'm = Em/Ec — amplitude ratio',
      'm ≤ 1 for undistorted AM',
      'Over-modulation (m > 1): envelope crosses zero',
      'Total power: Pt = Pc(1 + m²/2)',
    ],
  },
  {
    id: 'pb2', unit: 1,
    question: 'Compare AM, DSB-SC, and SSB in terms of bandwidth, power efficiency, detection method, and applications.',
    topic: 'AM vs DSB-SC vs SSB',
    mark: 8,
    papers: ['Jul 25', 'May 25'],
    modelAnswer: `                    AM              DSB-SC           SSB
Bandwidth         2fm              2fm               fm
Power Efficiency  Low (carrier     Medium (no        Highest (one
                  wastes power)    carrier)          sideband)

Detection         Envelope         Coherent/         Coherent/
                  detector         Product           Product

Applications      Broadcast        Sterephonic        HF radio,
                  radio            broadcasting      long-distance
                                  coherent comm     voice comm

Key differences:
- AM: carrier present → simple detection, inefficient
- DSB-SC: carrier suppressed → BW = 2fm, coherent detection needed
- SSB: one sideband + carrier suppressed → BW = fm, most efficient, hardest to detect

Detection complexity: AM (simplest) < DSB-SC < SSB (hardest)`,
    keyPoints: [
      'AM: carrier present → simple envelope detection, low efficiency',
      'DSB-SC: carrier suppressed, BW = 2fm, coherent detection',
      'SSB: one sideband only, BW = fm, highest power efficiency',
      'All three carry same information in theory',
      'SSB advantages: half BW, less power, better SNR',
    ],
  },
  {
    id: 'pb3', unit: 2,
    question: 'Explain FM generation using Armstrong indirect method. Derive Carson\'s rule and compute BW for Δf = 75 kHz and fm = 15 kHz.',
    topic: 'FM Armstrong + Carson\'s Rule',
    mark: 8,
    papers: ['Jul 25', 'Jan 26'],
    modelAnswer: `ARMSTRONG INDIRECT FM METHOD:
1. Message m(t) → integrated → applied to phase modulator
2. Generates NBFM at ~1 MHz with β ≈ 0.5
3. Frequency multiplication (×72) → WBFM at 88-108 MHz

Why integrate first?
Since PM: φ(t) = kp·m(t), and FM: ω(t) = ωc + kf·m(t) = ωc + d/dt[φ(t)]
Integrating message before PM → phase proportional to ∫m(t) → FM output

CARSON'S RULE:
FM signal: s(t) = Ec sin[ωct + β sin ωmt] where β = Δf/fm
Using Bessel expansions, power spreads across carrier + sidebands at fc ± n·fm
BW = 2(Δf + fm) — captures ~98% of total power

NUMERICAL: Δf = 75 kHz, fm = 15 kHz
β = Δf/fm = 75/15 = 5
BW = 2(75 + 15) = 2 × 90 = 180 kHz
Channel spacing = 200 kHz`,
    keyPoints: [
      'Integrate → PM → NBFM → multiply ×72 → WBFM',
      'Crystal oscillator ensures frequency stability',
      'Carson\'s rule: BW = 2(Δf + fm)',
      'β = Δf/fm',
      'Broadcast FM: β = 5, BW = 180 kHz',
    ],
  },
  {
    id: 'pb4', unit: 3,
    question: 'State and prove the sampling theorem. What is aliasing and how is it prevented?',
    topic: 'Sampling Theorem',
    mark: 8,
    papers: ['Jan 26', 'Jul 25'],
    modelAnswer: `STATEMENT: A band-limited signal of bandwidth B Hz can be completely reconstructed from its samples if sampled at rate fs ≥ 2B samples/second.

PROOF:
When signal m(t) with spectrum M(f) (non-zero for |f| ≤ B) is sampled at Ts (fs = 1/Ts):
Ms(f) = (1/Ts) Σ M(f - nfs)

Sampled spectrum = replicas of M(f) at intervals of fs.
If fs ≥ 2B → adjacent replicas do not overlap.
LPF with cutoff at B extracts original spectrum → perfect reconstruction.

ALIASING:
If fs < 2B, replicas overlap → aliasing.
High frequencies masquerade as lower frequencies.
Cannot recover original signal.

PREVENTION:
1. Pre-alias filter: LPF with cutoff ≤ fs/2 before sampling
2. Choose fs ≥ 2B
3. Example: voice (B = 4 kHz) → fs = 8 kHz (telephony standard)`,
    keyPoints: [
      'Spectrum of sampled signal = replicas at multiples of fs',
      'fs ≥ 2B prevents spectral overlap (no aliasing)',
      'Aliasing = overlap causing misrepresentation of original',
      'Pre-alias filter (LPF cutoff ≤ fs/2) essential',
      'Telephony: B = 4 kHz, fs = 8 kHz',
    ],
  },
  {
    id: 'pb5', unit: 4,
    question: 'Explain BPSK generation and coherent detection. Derive Pe = Q(√(2Es/N0)).',
    topic: 'BPSK + Probability of Error',
    mark: 8,
    papers: ['Jan 26', 'May 25'],
    modelAnswer: `GENERATION:
Binary data b(t) = +1 (bit 1), -1 (bit 0)
BPSK signal: s(t) = b(t) · Acos(ωct) = ± Acos(ωct)
Phase difference between symbols = π (180°)

CONSTELLATION: Two points at (±√Es, 0) on I-axis
Es = energy per symbol = (A²/2)Ts

COHERENT DETECTION:
r(t) = s(t) + n(t)
1. Multiply by cos(ωct) → LPF → decision circuit
2. Threshold = 0: output > 0 → bit 1; output < 0 → bit 0

Pe DERIVATION:
Distance between constellation points = 2√Es
Noise variance (per dimension) = N0/2
For AWGN: Pe = Q(√(2Es/N0)) = (1/2)erfc(√(Es/N0))
BPSK is the most noise-immune binary modulation scheme.`,
    keyPoints: [
      'BPSK: s(t) = ±Acos(ωct), phase difference π',
      'Constellation: (±√Es, 0), 1 bit/symbol',
      'Coherent detection: multiply by cos, LPF, threshold at 0',
      'Pe = Q(√(2Es/N0)) = (1/2)erfc(√(Es/N0))',
      'Most noise-immune binary modulation',
    ],
  },
];

// ============================================================================
// PART C — 1 Numerical Problem (15 marks)
// ============================================================================

export const ADC_PART_C: ADCPartC[] = [
  {
    id: 'pc1', unit: 5,
    scenario: `A two-stage amplifier cascade has:
Stage 1: Noise Figure F1 = 4 (linear), Power Gain G1 = 20 dB
Stage 2: Noise Figure F2 = 9 (linear), Power Gain G2 = 30 dB
(i) Convert G1 and G2 to linear ratios.
(ii) Find overall noise figure using Friis formula.
(iii) Find equivalent input noise temperature Te for T0 = 290 K.
(iv) Calculate the percentage contribution of each stage to total noise.`,
    rank: 'Highly Probable',
    mark: 15,
    modelAnswer: `Given: F1 = 4, F2 = 9, G1 = 20 dB, G2 = 30 dB, T0 = 290 K

(i) Convert gains to linear:
G1 = 10^(20/10) = 10^2 = 100
G2 = 10^(30/10) = 10^3 = 1000

(ii) Friis formula for 2 stages:
Ftotal = F1 + (F2 - 1)/G1
Ftotal = 4 + (9 - 1)/100
Ftotal = 4 + 8/100 = 4 + 0.08 = 4.08 (linear)
NFtotal = 10 log10(4.08) = 6.11 dB

(iii) Equivalent noise temperature:
Te = T0(Ftotal - 1) = 290 × 3.08 = 893.2 K

Individual contributions:
Stage 1: Te1 = T0(F1 - 1) = 290 × 3 = 870 K
Stage 2: Te2/G1 = T0(F2 - 1)/G1 = 290 × 8/100 = 290 × 0.08 = 23.2 K

Total: Te = 870 + 23.2 = 893.2 K ✓

(iv) Percentage contribution:
Stage 1: 870/893.2 × 100 = 97.4%
Stage 2: 23.2/893.2 × 100 = 2.6%

KEY INSIGHT: First stage dominates (97.4%) despite higher noise figure because its gain divides Stage 2's noise contribution. A high-gain, low-noise first stage (LNA) is critical in receiver design.`,
    evidence: 'Friis cascade appeared in Jan 26, Jul 25, and May 25. This exact structure (F1=4, G1=20dB, F2=9, G2=30dB) is a textbook problem that appeared in Jul 2025 FN.',
    topics: ['Noise Figure', 'Friis Formula', 'Noise Temperature', 'Cascaded Amplifiers'],
  },
];
