import type { SubjectSpec } from '../../data/subjects/types';
import { card, sectionTitle, mono, muted, body } from './styles';

/**
 * How the marks are actually awarded. This is the part a student never gets
 * taught and it is worth real marks on a 15-marker.
 */
export function AnswerPlaybook({ spec }: { spec: SubjectSpec }) {
  const b = spec.blueprint;
  const rows = [
    {
      marks: '1–2',
      title: 'Define it precisely',
      text: 'Use the syllabus wording and one clause that makes it unambiguous. Restating the topic name adds nothing and scores nothing here.',
    },
    {
      marks: '3–5',
      title: 'Explain the mechanism',
      text: 'Name the parts, in order, and say what each one does. A labelled diagram earns these marks faster than a paragraph does.',
    },
    {
      marks: '6–9',
      title: 'Show the working',
      text: 'Formula first, then the numbers. State the formula before substituting so the marker can follow you even if the arithmetic slips.',
    },
    {
      marks: '10–12',
      title: 'Give a real instance',
      text: 'A named example from the course, or a worked case. This is where most answers stop, and it is where the remaining marks are.',
    },
    {
      marks: '13–15',
      title: 'Close the loop',
      text: 'State the limitation, trade-off or consequence and link it back to the topic. One sentence showing you understand why it matters.',
    },
  ];

  return (
    <div style={card}>
      <h3 style={sectionTitle}>How a {b.partC.marksEach}-mark answer is scored</h3>
      <p style={{ ...body, color: muted, margin: '0 0 14px' }}>
        Part C is worth {b.partC.marksEach} marks and you answer only {b.partC.answerAny} of {b.partC.count}. Most
        students lose marks here by writing a list of points. The examiner is looking for this shape:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {rows.map((r) => (
          <div key={r.marks} style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: '12px', alignItems: 'start' }}>
            <span
              style={{
                ...mono,
                color: spec.accent,
                border: `1px solid ${spec.accent}33`,
                background: `${spec.accent}12`,
                borderRadius: '999px',
                padding: '3px 0',
                textAlign: 'center',
                fontWeight: 600,
              }}
            >
              {r.marks}
            </span>
            <span style={{ fontSize: '14px', color: 'var(--text-primary, #1d1d1f)', lineHeight: 1.5 }}>
              <b>{r.title}.</b> <span style={{ color: muted }}>{r.text}</span>
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ ...mono, fontWeight: 600, color: 'var(--text-primary, #1d1d1f)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          The four-part answer
        </div>
        <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '14px', color: muted, lineHeight: 1.7 }}>
          <li>
            <b style={{ color: 'var(--text-primary, #1d1d1f)' }}>Claim</b> — one line: what this topic is and the answer to
            the question asked.
          </li>
          <li>
            <b style={{ color: 'var(--text-primary, #1d1d1f)' }}>Structure</b> — the parts in order, with a diagram if the
            topic has one. Four to six points.
          </li>
          <li>
            <b style={{ color: 'var(--text-primary, #1d1d1f)' }}>Working</b> — the formula or the trace, with the numbers
            substituted.
          </li>
          <li>
            <b style={{ color: 'var(--text-primary, #1d1d1f)' }}>Consequence</b> — the limitation, trade-off or example
            that shows depth.
          </li>
        </ol>
      </div>
    </div>
  );
}
