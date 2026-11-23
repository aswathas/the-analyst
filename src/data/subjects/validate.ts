import type { MCQ, SubjectSpec } from './types';

export function validateSubject(spec: SubjectSpec): string[] {
  const problems: string[] = [];
  const add = (message: string) => problems.push(`${spec.code}: ${message}`);

  if (spec.units.length !== 5) {
    add(`expected 5 units, found ${spec.units.length}`);
  }
  spec.units.forEach((unit, index) => {
    if (unit.unit !== index + 1) {
      add(`unit at index ${index} must have number ${index + 1}, found ${unit.unit}`);
    }
    if (unit.hours !== 9) {
      add(`unit ${unit.unit} must have 9 hours, found ${unit.hours}`);
    }
    if (unit.topics.length === 0) {
      add(`unit ${unit.unit} must contain at least one topic`);
    }
  });

  if (spec.blueprint.total !== 75) {
    add(`blueprint.total must be 75, found ${spec.blueprint.total}`);
  }
  const { partA, partB, partC } = spec.blueprint;
  const computed =
    partA.count * partA.marksEach +
    partB.count * partB.marksEach +
    partC.answerAny * partC.marksEach;
  if (computed !== 75) {
    add(`blueprint sections must total 75, computed ${computed}`);
  }
  const allMcqs: MCQ[] = [...spec.mcqs, ...spec.ct.mcqs];
  allMcqs.forEach((question) => {
    if (question.options.length !== 4) {
      add(`question ${question.id} must have exactly 4 options, found ${question.options.length}`);
    }
    if (!Number.isInteger(question.correct) || question.correct < 0 || question.correct > 3) {
      add(`question ${question.id} answer index must be between 0 and 3, found ${question.correct}`);
    }
    if (!question.explanation || question.explanation.trim() === '') {
      add(`question ${question.id} must have a non-empty explanation`);
    }
  });

  if (spec.mcqs.length !== partA.count) {
    add(`expected ${partA.count} Part A MCQs, found ${spec.mcqs.length}`);
  }
  if (spec.partB.length !== partB.count) {
    add(`expected ${partB.count} Part B questions, found ${spec.partB.length}`);
  }
  if (spec.partC.length !== partC.count) {
    add(`expected ${partC.count} Part C questions, found ${spec.partC.length}`);
  }

  spec.safeCombo.forEach((combo, index) => {
    if (combo.marks > 75) {
      add(`safe combo ${index + 1} claims ${combo.marks} marks, which exceeds the 75-mark paper`);
    }
    if (!combo.claim || combo.claim.trim() === '') {
      add(`safe combo ${index + 1} must have a non-empty claim`);
    }
  });

  if (spec.pyqStatus === 'none-first-offered' && (!spec.pyqNote || spec.pyqNote.trim() === '')) {
    add('pyqNote must be present for a first-time-offered subject');
  }

  if (!/^21[A-Z]{3}\d{3}[A-Z]$/.test(spec.code)) {
    add(`code ${spec.code} does not match the 21XXX000X format`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(spec.examDate)) {
    add(`examDate ${spec.examDate} must be an ISO YYYY-MM-DD date`);
  }

  return problems;
}