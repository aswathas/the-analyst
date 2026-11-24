import type { SubjectSpec } from './types';
import { SMART_CONTRACTS_21CSE435T } from './21cse435t';
import { HYPERLEDGER_21CSE432T } from './21cse432t';
import { BUSINESS_MODELS_21CSE433T } from './21cse433t';
import { BITCOIN_21CSE436T } from './21cse436t';
import { TQM_21MEO104T } from './21meo104t';

export const SUBJECTS: SubjectSpec[] = [
  SMART_CONTRACTS_21CSE435T,
  HYPERLEDGER_21CSE432T,
  BUSINESS_MODELS_21CSE433T,
  BITCOIN_21CSE436T,
  TQM_21MEO104T,
];

export function getSubject(code: string): SubjectSpec | undefined {
  return SUBJECTS.find((s) => s.code.toLowerCase() === code.toLowerCase());
}

export function semesters(): number[] {
  return [...new Set(SUBJECTS.map((s) => s.semester))].sort((a, b) => b - a);
}

export function subjectsBySemester(sem: number): SubjectSpec[] {
  return SUBJECTS.filter((s) => s.semester === sem);
}