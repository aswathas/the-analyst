/**
 * ADC Topics Data File
 * Course: 21ECC302T Analog and Digital Communication
 *
 * Grounded in exam patterns from:
 * - Jan 2026 FN (Forenoon)
 * - Jul 2025 FN
 * - May 2025 AN (Afternoon)
 */

// ============================================================
// Type Definitions
// ============================================================

export interface adcTopics {
  unit: number;
  name: string;
  topics: string[];
  marksWeight: number;
  priorityLevel: 'high' | 'medium' | 'low';
}

export interface topicFrequency {
  topic: string;
  unit: number;
  score: number;
  papersAppeared: number;
  lastAppeared: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface unitConnection {
  fromUnit: number;
  toUnit: number;
  connectionType: 'applies_to' | 'builds_on' | 'prerequisite' | 'related';
  sharedTopics: string[];
  description: string;
}

export interface examPattern {
  pattern: string;
  likelyUnit: number;
  marks: number;
  frequency: 'very_high' | 'high' | 'medium' | 'low';
}

// ============================================================
// ADC_SYLLABUS_MAP
// Maps all 5 units with topics, marks weight, and priority
// ============================================================

export const ADC_SYLLABUS_MAP: adcTopics[] = [
  {
    unit: 1,
    name: 'Amplitude Modulation',
    topics: [
      'AM equation and mathematical representation',
      'Modulation index m and its significance',
      'Power relations in AM (carrier and sidebands)',
      'DSB-SC (Double Sideband Suppressed Carrier)',
      'SSB (Single Sideband) modulation',
      'Hilbert transform in SSB generation',
      'Single sideband generation methods',
      'Vestigial Sideband (VSB) modulation',
    ],
    marksWeight: 16,
    priorityLevel: 'high',
  },
  {
    unit: 2,
    name: 'Angle Modulation',
    topics: [
      'Frequency Modulation (FM) equation and representation',
      'Phase Modulation (PM) relationship with FM',
      'Deviation ratio (β) calculation',
      'Carson bandwidth rule: BW = 2(Δf + fm)',
      'Armstrong indirect method for FM generation',
      'Pre-emphasis and de-emphasis circuits',
      'FM stereo transmission and reception',
      'FM noise superiority over AM',
    ],
    marksWeight: 16,
    priorityLevel: 'high',
  },
  {
    unit: 3,
    name: 'Pulse Modulation',
    topics: [
      'Sampling theorem (Nyquist criterion)',
      'PAM (Pulse Amplitude Modulation)',
      'PWM (Pulse Width Modulation)',
      'PPM (Pulse Position Modulation)',
      'TDM (Time Division Multiplexing)',
      'FDM (Frequency Division Multiplexing)',
      'PCM (Pulse Code Modulation)',
      'Quantization noise and SNR',
    ],
    marksWeight: 14,
    priorityLevel: 'medium',
  },
  {
    unit: 4,
    name: 'Digital Modulation',
    topics: [
      'ASK (Amplitude Shift Keying)',
      'FSK (Frequency Shift Keying)',
      'BPSK (Binary Phase Shift Keying)',
      'QPSK (Quaternary Phase Shift Keying)',
      '16-QAM (Quadrature Amplitude Modulation)',
      'Constellation diagrams interpretation',
      'Probability of error (Pe) calculations',
      'Spectral efficiency (bits/second/Hz)',
    ],
    marksWeight: 18,
    priorityLevel: 'high',
  },
  {
    unit: 5,
    name: 'Noise in Communication Systems',
    topics: [
      'Thermal noise characteristics',
      'Shot noise in semiconductor devices',
      'Signal-to-Noise Ratio (SNR) calculations',
      'Noise figure (F) definition and measurement',
      'Equivalent noise temperature (Te)',
      'Friis transmission formula for cascading',
      'Cascaded amplifier noise analysis',
      'Noise bandwidth considerations',
    ],
    marksWeight: 16,
    priorityLevel: 'high',
  },
];

// ============================================================
// ADC_TOPIC_FREQUENCY
// All sub-topics with score, papers appeared, last appeared, trend
// ============================================================

export const ADC_TOPIC_FREQUENCY: topicFrequency[] = [
  // Unit 1: Amplitude Modulation
  {
    topic: 'AM equation and mathematical representation',
    unit: 1,
    score: 75,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'stable',
  },
  {
    topic: 'Modulation index (m) and its significance',
    unit: 1,
    score: 90,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'increasing',
  },
  {
    topic: 'Power relations in AM (carrier and sidebands)',
    unit: 1,
    score: 85,
    papersAppeared: 3,
    lastAppeared: 'Jul 2025 FN',
    trend: 'stable',
  },
  {
    topic: 'DSB-SC (Double Sideband Suppressed Carrier)',
    unit: 1,
    score: 70,
    papersAppeared: 2,
    lastAppeared: 'May 2025 AN',
    trend: 'stable',
  },
  {
    topic: 'SSB (Single Sideband) modulation',
    unit: 1,
    score: 80,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'stable',
  },
  {
    topic: 'Hilbert transform in SSB generation',
    unit: 1,
    score: 55,
    papersAppeared: 1,
    lastAppeared: 'Jul 2025 FN',
    trend: 'decreasing',
  },
  {
    topic: 'Single sideband generation methods',
    unit: 1,
    score: 65,
    papersAppeared: 2,
    lastAppeared: 'Jan 2026 FN',
    trend: 'increasing',
  },
  {
    topic: 'Vestigial Sideband (VSB) modulation',
    unit: 1,
    score: 40,
    papersAppeared: 1,
    lastAppeared: 'May 2025 AN',
    trend: 'decreasing',
  },

  // Unit 2: Angle Modulation
  {
    topic: 'Frequency Modulation (FM) equation and representation',
    unit: 2,
    score: 85,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'stable',
  },
  {
    topic: 'Phase Modulation (PM) relationship with FM',
    unit: 2,
    score: 60,
    papersAppeared: 2,
    lastAppeared: 'Jul 2025 FN',
    trend: 'stable',
  },
  {
    topic: 'Deviation ratio (β) calculation',
    unit: 2,
    score: 80,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'increasing',
  },
  {
    topic: 'Carson bandwidth rule: BW = 2(Δf + fm)',
    unit: 2,
    score: 95,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'increasing',
  },
  {
    topic: 'Armstrong indirect method for FM generation',
    unit: 2,
    score: 70,
    papersAppeared: 2,
    lastAppeared: 'Jul 2025 FN',
    trend: 'stable',
  },
  {
    topic: 'Pre-emphasis and de-emphasis circuits',
    unit: 2,
    score: 50,
    papersAppeared: 2,
    lastAppeared: 'May 2025 AN',
    trend: 'stable',
  },
  {
    topic: 'FM stereo transmission and reception',
    unit: 2,
    score: 35,
    papersAppeared: 1,
    lastAppeared: 'May 2025 AN',
    trend: 'decreasing',
  },
  {
    topic: 'FM noise superiority over AM',
    unit: 2,
    score: 45,
    papersAppeared: 1,
    lastAppeared: 'Jul 2025 FN',
    trend: 'decreasing',
  },

  // Unit 3: Pulse Modulation
  {
    topic: 'Sampling theorem (Nyquist criterion)',
    unit: 3,
    score: 100,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'increasing',
  },
  {
    topic: 'PAM (Pulse Amplitude Modulation)',
    unit: 3,
    score: 60,
    papersAppeared: 2,
    lastAppeared: 'Jul 2025 FN',
    trend: 'stable',
  },
  {
    topic: 'PWM (Pulse Width Modulation)',
    unit: 3,
    score: 55,
    papersAppeared: 2,
    lastAppeared: 'May 2025 AN',
    trend: 'stable',
  },
  {
    topic: 'PPM (Pulse Position Modulation)',
    unit: 3,
    score: 50,
    papersAppeared: 2,
    lastAppeared: 'Jul 2025 FN',
    trend: 'decreasing',
  },
  {
    topic: 'TDM (Time Division Multiplexing)',
    unit: 3,
    score: 75,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'stable',
  },
  {
    topic: 'FDM (Frequency Division Multiplexing)',
    unit: 3,
    score: 65,
    papersAppeared: 2,
    lastAppeared: 'Jan 2026 FN',
    trend: 'increasing',
  },
  {
    topic: 'PCM (Pulse Code Modulation)',
    unit: 3,
    score: 85,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'increasing',
  },
  {
    topic: 'Quantization noise and SNR',
    unit: 3,
    score: 70,
    papersAppeared: 3,
    lastAppeared: 'Jul 2025 FN',
    trend: 'stable',
  },

  // Unit 4: Digital Modulation
  {
    topic: 'ASK (Amplitude Shift Keying)',
    unit: 4,
    score: 55,
    papersAppeared: 2,
    lastAppeared: 'May 2025 AN',
    trend: 'stable',
  },
  {
    topic: 'FSK (Frequency Shift Keying)',
    unit: 4,
    score: 80,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'stable',
  },
  {
    topic: 'BPSK (Binary Phase Shift Keying)',
    unit: 4,
    score: 85,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'increasing',
  },
  {
    topic: 'QPSK (Quaternary Phase Shift Keying)',
    unit: 4,
    score: 90,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'increasing',
  },
  {
    topic: '16-QAM (Quadrature Amplitude Modulation)',
    unit: 4,
    score: 75,
    papersAppeared: 3,
    lastAppeared: 'Jul 2025 FN',
    trend: 'stable',
  },
  {
    topic: 'Constellation diagrams interpretation',
    unit: 4,
    score: 85,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'increasing',
  },
  {
    topic: 'Probability of error (Pe) calculations',
    unit: 4,
    score: 70,
    papersAppeared: 3,
    lastAppeared: 'Jul 2025 FN',
    trend: 'stable',
  },
  {
    topic: 'Spectral efficiency (bits/second/Hz)',
    unit: 4,
    score: 65,
    papersAppeared: 2,
    lastAppeared: 'Jan 2026 FN',
    trend: 'increasing',
  },

  // Unit 5: Noise in Communication Systems
  {
    topic: 'Thermal noise characteristics',
    unit: 5,
    score: 80,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'stable',
  },
  {
    topic: 'Shot noise in semiconductor devices',
    unit: 5,
    score: 60,
    papersAppeared: 2,
    lastAppeared: 'May 2025 AN',
    trend: 'stable',
  },
  {
    topic: 'Signal-to-Noise Ratio (SNR) calculations',
    unit: 5,
    score: 90,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'increasing',
  },
  {
    topic: 'Noise figure (F) definition and measurement',
    unit: 5,
    score: 85,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'stable',
  },
  {
    topic: 'Equivalent noise temperature (Te)',
    unit: 5,
    score: 75,
    papersAppeared: 3,
    lastAppeared: 'Jul 2025 FN',
    trend: 'stable',
  },
  {
    topic: 'Friis transmission formula for cascading',
    unit: 5,
    score: 70,
    papersAppeared: 3,
    lastAppeared: 'Jan 2026 FN',
    trend: 'stable',
  },
  {
    topic: 'Cascaded amplifier noise analysis',
    unit: 5,
    score: 65,
    papersAppeared: 2,
    lastAppeared: 'Jul 2025 FN',
    trend: 'stable',
  },
  {
    topic: 'Noise bandwidth considerations',
    unit: 5,
    score: 50,
    papersAppeared: 1,
    lastAppeared: 'May 2025 AN',
    trend: 'decreasing',
  },
];

// ============================================================
// ADC_UNIT_CONNECTIONS
// Shows how topics connect across different units
// ============================================================

export const ADC_UNIT_CONNECTIONS: unitConnection[] = [
  // Noise (Unit 5) connects to all modulation types
  {
    fromUnit: 5,
    toUnit: 1,
    connectionType: 'applies_to',
    sharedTopics: ['SNR in AM systems', 'AM noise performance'],
    description: 'Noise analysis applies to all AM systems - thermal noise affects signal quality in amplitude modulation',
  },
  {
    fromUnit: 5,
    toUnit: 2,
    connectionType: 'applies_to',
    sharedTopics: ['FM threshold effect', 'Pre/de-emphasis SNR improvement', 'FM noise figure'],
    description: 'FM noise performance is superior to AM - pre/de-emphasis improves SNR in FM systems',
  },
  {
    fromUnit: 5,
    toUnit: 3,
    connectionType: 'applies_to',
    sharedTopics: ['Quantization noise in PCM', 'SNR in PCM', 'TDM noise considerations'],
    description: 'Quantization noise is fundamental to PCM and digital pulse modulation systems',
  },
  {
    fromUnit: 5,
    toUnit: 4,
    connectionType: 'applies_to',
    sharedTopics: ['Probability of error Pe', 'SNR vs Pe relationship', 'Noise in constellation diagrams'],
    description: 'Digital modulation error rates are directly tied to SNR - noise determines bit error rate',
  },

  // AM and Angle Modulation relationship (Unit 1 -> Unit 2)
  {
    fromUnit: 1,
    toUnit: 2,
    connectionType: 'builds_on',
    sharedTopics: ['Modulation index concepts', 'Bandwidth calculation', 'Sideband analysis'],
    description: 'Angle modulation extends AM concepts - both deal with carrier modification and spectral analysis',
  },

  // Pulse Modulation foundations for Digital (Unit 3 -> Unit 4)
  {
    fromUnit: 3,
    toUnit: 4,
    connectionType: 'builds_on',
    sharedTopics: ['Sampling theorem', 'PCM as digital base', 'Quantization'],
    description: 'Digital modulation builds on pulse modulation - PCM concept leads to binary digital schemes',
  },

  // AM to SSB internal connection (Unit 1 -> Unit 1)
  {
    fromUnit: 1,
    toUnit: 1,
    connectionType: 'prerequisite',
    sharedTopics: ['Hilbert transform', 'SSB generation'],
    description: 'Hilbert transform is essential for SSB generation - mathematical foundation for single sideband',
  },

  // FSK and FM relationship (Unit 2 -> Unit 4)
  {
    fromUnit: 2,
    toUnit: 4,
    connectionType: 'builds_on',
    sharedTopics: ['Frequency deviation concept', 'Bandwidth in FM/FSK'],
    description: 'FSK is digital FM - frequency deviation concepts from FM directly apply to FSK',
  },

  // QAM requires both PSK and amplitude concepts (Unit 4 -> Unit 1)
  {
    fromUnit: 4,
    toUnit: 1,
    connectionType: 'builds_on',
    sharedTopics: ['Amplitude variation', 'Constellation for QAM'],
    description: 'QAM combines amplitude and phase modulation - builds on AM and PSK concepts',
  },

  // TDM and FDM multiplexing (Unit 3 internal)
  {
    fromUnit: 3,
    toUnit: 3,
    connectionType: 'related',
    sharedTopics: ['Multiplexing techniques', 'Bandwidth efficiency'],
    description: 'TDM and FDM are complementary multiplexing methods - both achieve channel sharing',
  },

  // Constellation diagrams span digital modulations (Unit 4 internal)
  {
    fromUnit: 4,
    toUnit: 4,
    connectionType: 'related',
    sharedTopics: ['BPSK, QPSK, 16-QAM constellation', 'Symbol decision regions'],
    description: 'Constellation diagrams are common framework for all digital modulation types',
  },
];

// ============================================================
// ADC_EXAM_PATTERNS
// Recurring question patterns with marks and frequency
// ============================================================

export const ADC_EXAM_PATTERNS: examPattern[] = [
  // High-frequency patterns (appeared in 3 papers)
  {
    pattern: 'Derive and explain the Carson bandwidth rule and calculate BW for given Δf and fm values',
    likelyUnit: 2,
    marks: 10,
    frequency: 'very_high',
  },
  {
    pattern: 'Explain sampling theorem with mathematical proof and Nyquist criterion',
    likelyUnit: 3,
    marks: 8,
    frequency: 'very_high',
  },
  {
    pattern: 'Compare BPSK, QPSK, and 16-QAM with constellation diagrams and spectral efficiency',
    likelyUnit: 4,
    marks: 12,
    frequency: 'very_high',
  },
  {
    pattern: 'Derive SNR relationship and noise figure for cascaded systems using Friis formula',
    likelyUnit: 5,
    marks: 10,
    frequency: 'very_high',
  },
  {
    pattern: 'Calculate modulation index m for AM and determine over/under/modulated conditions',
    likelyUnit: 1,
    marks: 8,
    frequency: 'very_high',
  },
  {
    pattern: 'Explain PCM encoding process with quantization and calculate quantization noise',
    likelyUnit: 3,
    marks: 10,
    frequency: 'very_high',
  },

  // Medium-frequency patterns (appeared in 2 papers)
  {
    pattern: 'Derive FM equation from angular modulation principles and explain deviation ratio β',
    likelyUnit: 2,
    marks: 10,
    frequency: 'high',
  },
  {
    pattern: 'Explain SSB generation using Hilbert transform with block diagram',
    likelyUnit: 1,
    marks: 8,
    frequency: 'high',
  },
  {
    pattern: 'Compare TDM and FDM multiplexing techniques with applications',
    likelyUnit: 3,
    marks: 6,
    frequency: 'high',
  },
  {
    pattern: 'Derive probability of error Pe for BPSK and compare with other digital schemes',
    likelyUnit: 4,
    marks: 10,
    frequency: 'high',
  },
  {
    pattern: 'Explain thermal noise and shot noise with mathematical expressions',
    likelyUnit: 5,
    marks: 6,
    frequency: 'high',
  },
  {
    pattern: 'Explain Armstrong indirect method for FM generation with circuit diagram',
    likelyUnit: 2,
    marks: 8,
    frequency: 'high',
  },

  // Lower-frequency patterns (appeared in 1 paper or selective)
  {
    pattern: 'Compare DSB-SC and SSB with spectra, power relations, and bandwidth requirements',
    likelyUnit: 1,
    marks: 10,
    frequency: 'medium',
  },
  {
    pattern: 'Explain pre-emphasis and de-emphasis circuits in FM with frequency response',
    likelyUnit: 2,
    marks: 6,
    frequency: 'medium',
  },
  {
    pattern: 'Compare PAM, PWM, and PPM with waveforms, bandwidth, and applications',
    likelyUnit: 3,
    marks: 8,
    frequency: 'medium',
  },
  {
    pattern: 'Explain ASK and FSK with constellation diagrams, bandwidth, and applications',
    likelyUnit: 4,
    marks: 8,
    frequency: 'medium',
  },
  {
    pattern: 'Calculate noise temperature and noise figure for cascaded receivers',
    likelyUnit: 5,
    marks: 10,
    frequency: 'medium',
  },
  {
    pattern: 'Explain FM stereo transmission and reception system',
    likelyUnit: 2,
    marks: 6,
    frequency: 'low',
  },
  {
    pattern: 'Derive power relations in AM showing total power and sideband power',
    likelyUnit: 1,
    marks: 8,
    frequency: 'low',
  },
];

// ============================================================
// Export all data as a combined object for convenience
// ============================================================

export const ADC_DATA = {
  syllabus: ADC_SYLLABUS_MAP,
  topicFrequency: ADC_TOPIC_FREQUENCY,
  unitConnections: ADC_UNIT_CONNECTIONS,
  examPatterns: ADC_EXAM_PATTERNS,
};

export default ADC_DATA;
