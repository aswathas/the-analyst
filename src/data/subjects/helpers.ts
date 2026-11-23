import type { LongQuestion, MCQ, Priority, Topic } from './types';

export const t = (name: string, priority: Priority, minutes: number, why?: string): Topic => ({ name, priority, minutes, why });

export const m = (id: string, unit: number, topic: string, question: string, options: string[], correct: number, explanation: string): MCQ => ({
  id, unit, topic, question, options, correct, explanation, source: 'archetype',
});

export const q = (id: string, unit: number, marks: number, question: string, modelAnswer: string[], keyPoints: string[]): LongQuestion => ({
  id, unit, marks, question, modelAnswer, keyPoints,
});
