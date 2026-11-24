import {
  SUBJECTS,
  getSubject,
  semesters,
  subjectsBySemester,
} from '../../data/subjects';
import type { SubjectSpec } from '../../data/subjects/types';

export { SUBJECTS, getSubject, semesters, subjectsBySemester };

/** The sem 7 subjects only, in registry order. */
export const SEM7_SUBJECTS: SubjectSpec[] = SUBJECTS.filter(s => s.semester === 7);
