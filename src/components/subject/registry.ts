import { SUBJECTS as REGISTRY } from '../../data/subjects';
import { SMART_CONTRACTS_21CSE435T } from '../../data/subjects/21cse435t';
import { HYPERLEDGER_21CSE432T } from '../../data/subjects/21cse432t';
import { BUSINESS_MODELS_21CSE433T } from '../../data/subjects/21cse433t';
import { BITCOIN_21CSE436T } from '../../data/subjects/21cse436t';
import { TQM_21MEO104T } from '../../data/subjects/21meo104t';
import type { SubjectSpec } from '../../data/subjects/types';

/** The five sem-7 subject specs, whether or not the registry has been filled in yet. */
const SEM7_SPECS: SubjectSpec[] = [
  SMART_CONTRACTS_21CSE435T,
  HYPERLEDGER_21CSE432T,
  BUSINESS_MODELS_21CSE433T,
  BITCOIN_21CSE436T,
  TQM_21MEO104T,
];

export const SUBJECTS: SubjectSpec[] = [
  ...REGISTRY,
  ...SEM7_SPECS.filter(s => !REGISTRY.some(r => r.code === s.code)),
];

export function getSubject(code: string): SubjectSpec | undefined {
  return SUBJECTS.find(s => s.code.toLowerCase() === code.toLowerCase());
}

export function semesters(): number[] {
  return [...new Set(SUBJECTS.map(s => s.semester))].sort((a, b) => b - a);
}

export function subjectsBySemester(sem: number): SubjectSpec[] {
  return SUBJECTS.filter(s => s.semester === sem);
}
