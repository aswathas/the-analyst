import { test, expect } from '@playwright/test';
import { validateSubject } from '../src/data/subjects/validate';
import type { LongQuestion, MCQ, SubjectSpec } from '../src/data/subjects/types';

const mcqs: MCQ[] = Array.from({ length: 20 }, (_, i) => ({
  id: `m${i + 1}`,
  unit: (i % 5) + 1,
  topic: `Topic ${String.fromCharCode(65 + (i % 5))}`,
  question: `Sample question ${i + 1}?`,
  options: ['option a', 'option b', 'option c', 'option d'],
  correct: i % 4,
  explanation: `Explanation ${i + 1}: the answer follows from the unit ${(i % 5) + 1} definition.`,
  source: 'archetype',
}));

const partB: LongQuestion[] = Array.from({ length: 5 }, (_, i) => ({
  id: `b${i + 1}`,
  unit: i + 1,
  marks: 8,
  question: `Part B question ${i + 1}?`,
  modelAnswer: ['point one', 'point two'],
  keyPoints: ['point one'],
}));

const partC: LongQuestion[] = Array.from({ length: 2 }, (_, i) => ({
  id: `c${i + 1}`,
  unit: i + 1,
  marks: 15,
  question: `Part C question ${i + 1}?`,
  modelAnswer: ['step one'],
  keyPoints: ['step one'],
}));
const base: SubjectSpec = {
  code: '21CSE999T',
  title: 'Test Subject',
  shortTitle: 'Test',
  category: 'professional-elective',
  semester: 7,
  examDate: '2026-12-01',
  examSession: 'FN',
  accent: '#0066cc',
  hours: 45,
  credits: 3,
  oneLiner: 'A test subject',
  pyqStatus: 'none-first-offered',
  pyqNote: 'First-time-offered elective.',
  units: [
    { unit: 1, name: 'Unit One', hours: 9, topics: [{ name: 'Topic A', priority: 'must', minutes: 30 }] },
    { unit: 2, name: 'Unit Two', hours: 9, topics: [{ name: 'Topic B', priority: 'should', minutes: 20 }] },
    { unit: 3, name: 'Unit Three', hours: 9, topics: [{ name: 'Topic C', priority: 'skip', minutes: 10 }] },
    { unit: 4, name: 'Unit Four', hours: 9, topics: [{ name: 'Topic D', priority: 'must', minutes: 25 }] },
    { unit: 5, name: 'Unit Five', hours: 9, topics: [{ name: 'Topic E', priority: 'should', minutes: 15 }] },
  ],
  blueprint: {
    partA: { count: 20, marksEach: 1 },
    partB: { count: 5, marksEach: 8, answerAny: 5 },
    partC: { count: 2, marksEach: 15, answerAny: 1 },
    total: 75,
  },
  safeCombo: [{ unit: 1, topics: ['Topic A'], marks: 30, claim: 'Topic A alone carries it' }],
  mcqs,
  partB,
  partC,
  ct: { mcqs: [], partB: [], partC: [] },
  resources: [{ label: 'Official syllabus PDF', url: 'https://example.com/s.pdf', note: 'SRMIST control copy' }],
};
test('a valid subject produces no problems', () => {
  expect(validateSubject(base)).toEqual([]);
});

test('a subject with the wrong unit count is rejected', () => {
  const bad = { ...base, units: base.units.slice(0, 4) };
  expect(validateSubject(bad).join(' ')).toContain('5 units');
});

test('a subject whose blueprint does not total 75 is rejected', () => {
  const bad = { ...base, blueprint: { ...base.blueprint, total: 70 } };
  expect(validateSubject(bad).join(' ')).toContain('75');
});

test('a question with three options is rejected', () => {
  const bad = { ...base, mcqs: [{ ...base.mcqs[0], options: ['a', 'b', 'c'] }] };
  expect(validateSubject(bad).join(' ')).toContain('4 options');
});

test('a question with an out-of-range answer index is rejected', () => {
  const bad = { ...base, mcqs: [{ ...base.mcqs[0], correct: 7 }] };
  expect(validateSubject(bad).join(' ')).toContain('answer index');
});

test('a safe combo that claims more marks than the paper is rejected', () => {
  const bad = { ...base, safeCombo: [{ ...base.safeCombo[0], marks: 90 }] };
  expect(validateSubject(bad).join(' ')).toContain('safe combo');
});

test('a first-time-offered subject must carry the pyq note', () => {
  const bad = { ...base, pyqNote: '' };
  expect(validateSubject(bad).join(' ')).toContain('pyqNote');
});