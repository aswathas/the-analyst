export type Priority = 'must' | 'should' | 'skip';

export interface Topic {
  /** Topic name copied verbatim from the official SRMIST syllabus. */
  name: string;
  priority: Priority;
  /** Estimated minutes to study this topic. */
  minutes: number;
  /** Why this topic matters for the paper, and what an exam question on it looks like. */
  why?: string;
}

export interface Unit {
  unit: number;
  name: string;
  hours: number;
  topics: Topic[];
}

export interface MCQ {
  id: string;
  unit: number;
  topic: string;
  question: string;
  /** Exactly 4 options. */
  options: string[];
  /** Index into options, 0-3. */
  correct: number;
  explanation: string;
  /** 'archetype' = standard exam-style question, NOT from an SRM paper. 'paper' = from a real published paper. */
  source: 'archetype' | 'paper';
  /** Set only when source is 'paper': which paper the question came from. */
  paperName?: string;
}
export interface LongQuestion {
  id: string;
  unit: number;
  marks: number;
  question: string;
  /** Model answer as ordered points. */
  modelAnswer: string[];
  keyPoints: string[];
}

export interface SafeCombo {
  unit: number;
  topics: string[];
  /** Marks this topic set is expected to yield. Must not exceed the paper total. */
  marks: number;
  /** The student-facing claim, e.g. "7 topics clear 65 of 75". */
  claim: string;
}

export interface Blueprint {
  partA: { count: number; marksEach: number };
  partB: { count: number; marksEach: number; answerAny: number };
  partC: { count: number; marksEach: number; answerAny: number };
  total: number;
}

export interface Resource {
  label: string;
  url?: string;
  note?: string;
}
export interface PdfLinks {
  /** Public Drive file id or link. Empty string means not uploaded yet. */
  driveUrl: string;
  /** GitHub release asset URL. Empty string means not uploaded yet. */
  releaseUrl: string;
  pages: number;
}

export interface SubjectSpec {
  code: string;
  title: string;
  shortTitle: string;
  category: 'core' | 'professional-elective' | 'open-elective';
  semester: number;
  /** ISO date, e.g. '2026-12-01'. */
  examDate: string;
  examSession: 'FN' | 'AN';
  accent: string;
  hours: number;
  credits: number;
  oneLiner: string;
  pyqStatus: 'none-first-offered' | 'papers-available';
  pyqNote: string;
  units: Unit[];
  blueprint: Blueprint;
  safeCombo: SafeCombo[];
  mcqs: MCQ[];
  partB: LongQuestion[];
  partC: LongQuestion[];
  ct: { mcqs: MCQ[]; partB: LongQuestion[]; partC: LongQuestion[] };
  resources: Resource[];
  pdf?: PdfLinks;
}