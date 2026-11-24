import type { SubjectSpec } from '../../data/subjects/types';
import { card, sectionTitle, mono, muted } from './styles';

function Row({
  testId,
  label,
  headline,
  extra,
}: {
  testId: string;
  label: string;
  headline: string;
  extra?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '14px',
        padding: '12px 0',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ width: '78px', flexShrink: 0, ...mono, color: muted, textTransform: 'uppercase' }}>{label}</div>
      <div data-testid={testId} style={{ ...mono, color: 'var(--text-primary, #1d1d1f)', fontWeight: 700, fontSize: '16px' }}>
        {headline}
      </div>
      {extra && <div style={{ ...mono, color: muted }}>{extra}</div>}
    </div>
  );
}

export function BlueprintPanel({ spec }: { spec: SubjectSpec }) {
  const b = spec.blueprint;
  // Real array lengths, never a hardcoded paper size.
  const partACount = spec.mcqs.length;
  const partBCount = spec.partB.length;
  const partCCount = spec.partC.length;

  return (
    <div style={card}>
      <h3 style={sectionTitle}>Exam blueprint</h3>
      <Row
        testId="blueprint-partA"
        label="Part A"
        headline={`${partACount}`}
        extra={`MCQs × ${b.partA.marksEach} mark · ${partACount * b.partA.marksEach} marks`}
      />
      <Row
        testId="blueprint-partB"
        label="Part B"
        headline={`${partBCount} questions × ${b.partB.marksEach} marks`}
        extra={`answer any ${b.partB.answerAny} · ${b.partB.answerAny * b.partB.marksEach} marks`}
      />
      <Row
        testId="blueprint-partC"
        label="Part C"
        headline={`${partCCount} questions × ${b.partC.marksEach} marks`}
        extra={`answer any ${b.partC.answerAny} · ${b.partC.answerAny * b.partC.marksEach} marks`}
      />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', paddingTop: '14px', flexWrap: 'wrap' }}>
        <div style={{ width: '78px', flexShrink: 0, ...mono, color: muted, textTransform: 'uppercase' }}>Total</div>
        <div data-testid="blueprint-total" style={{ ...mono, color: spec.accent, fontWeight: 700, fontSize: '16px' }}>
          {b.total} marks
        </div>
      </div>
    </div>
  );
}
