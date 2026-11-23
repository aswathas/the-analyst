import type { SubjectSpec } from './types';

export const SUBJECTS: SubjectSpec[] = [];

export function getSubject(code: string): SubjectSpec | undefined {
  return SUBJECTS.find((s) => s.code.toLowerCase() === code.toLowerCase());
}

export function semesters(): number[] {
  return [...new Set(SUBJECTS.map((s) => s.semester))].sort((a, b) => b - a);
}

export function subjectsBySemester(sem: number): SubjectSpec[] {
  return SUBJECTS.filter((s) => s.semester === sem);
}