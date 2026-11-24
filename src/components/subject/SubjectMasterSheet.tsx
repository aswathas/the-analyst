import type { SubjectSpec } from '../../data/subjects/types';
import { PdfDownload } from './PdfDownload';
import { TopicNotes } from './TopicNotes';
import { card, sectionTitle, mono, muted, body } from './styles';

function PaperHead({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...mono, color: muted, textTransform: 'uppercase', marginBottom: '10px' }}>
      {children}
    </div>
  );
}

export function SubjectMasterSheet({ spec, onBack }: { spec: SubjectSpec; onBack: () => void }) {
  const b = spec.blueprint;

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: 'clamp(24px, 4vw, 48px) clamp(16px, 4vw, 32px) 64px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          background: 'none',
          border: '1px solid var(--border-card, rgba(0,0,0,0.08))',
          borderRadius: '9999px',
          padding: '6px 14px',
          fontSize: '13px',
          color: muted,
          cursor: 'pointer',
        }}
      >
        ← Back
      </button>

      {/* Paper front page */}
      <div style={{ ...card, textAlign: 'center', padding: '40px 24px' }}>
        <PaperHead>SRM Institute · End semester · {spec.examSession}</PaperHead>
        <div style={{ ...mono, color: muted, marginBottom: '10px' }}>{spec.code}</div>
        <h1 data-testid="master-title" style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.12, margin: '0 0 12px', color: 'var(--text-primary, #1d1d1f)' }}>
          {spec.title}
        </h1>
        <div style={{ ...body, color: muted, margin: '0 0 6px' }}>
          {spec.hours} hours · {spec.credits} credits · Semester {spec.semester}
        </div>
        <div style={{ ...body, color: muted, margin: '0 0 16px' }}>Exam date: {spec.examDate} ({spec.examSession})</div>
        <div style={{ ...mono, color: muted, borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '12px' }}>
          Student-made analysis. Not an official SRMIST document.
        </div>
      </div>

      {/* Blueprint front page */}
      <div style={card}>
        <h3 style={sectionTitle}>Blueprint · {b.total} marks</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', ...mono }}>
          <thead>
            <tr style={{ color: muted, textAlign: 'left' }}>
              <th style={{ padding: '6px 0', fontWeight: 400 }}>Part</th>
              <th style={{ padding: '6px 0', fontWeight: 400 }}>Questions</th>
              <th style={{ padding: '6px 0', fontWeight: 400 }}>Marks each</th>
              <th style={{ padding: '6px 0', fontWeight: 400 }}>Answer</th>
              <th style={{ padding: '6px 0', fontWeight: 400, textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody style={{ color: 'var(--text-primary, #1d1d1f)' }}>
            <tr style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <td style={{ padding: '8px 0' }}>Part A</td>
              <td style={{ padding: '8px 0' }}>{spec.mcqs.length} MCQs</td>
              <td style={{ padding: '8px 0' }}>{b.partA.marksEach}</td>
              <td style={{ padding: '8px 0' }}>all</td>
              <td style={{ padding: '8px 0', textAlign: 'right' }}>{spec.mcqs.length * b.partA.marksEach}</td>
            </tr>
            <tr style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <td style={{ padding: '8px 0' }}>Part B</td>
              <td style={{ padding: '8px 0' }}>{spec.partB.length}</td>
              <td style={{ padding: '8px 0' }}>{b.partB.marksEach}</td>
              <td style={{ padding: '8px 0' }}>any {b.partB.answerAny}</td>
              <td style={{ padding: '8px 0', textAlign: 'right' }}>{b.partB.answerAny * b.partB.marksEach}</td>
            </tr>
            <tr style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <td style={{ padding: '8px 0' }}>Part C</td>
              <td style={{ padding: '8px 0' }}>{spec.partC.length}</td>
              <td style={{ padding: '8px 0' }}>{b.partC.marksEach}</td>
              <td style={{ padding: '8px 0' }}>any {b.partC.answerAny}</td>
              <td style={{ padding: '8px 0', textAlign: 'right' }}>{b.partC.answerAny * b.partC.marksEach}</td>
            </tr>
            <tr style={{ borderTop: '1px solid rgba(0,0,0,0.06)', fontWeight: 700, color: spec.accent }}>
              <td style={{ padding: '8px 0' }}>Total</td>
              <td style={{ padding: '8px 0' }} />
              <td style={{ padding: '8px 0' }} />
              <td style={{ padding: '8px 0' }} />
              <td style={{ padding: '8px 0', textAlign: 'right' }}>{b.total}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Every topic, taught */}
      {spec.units.map((unit) => (
        <div key={unit.unit} style={card}>
          <h3 style={sectionTitle}>Unit {unit.unit} · {unit.name}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {unit.topics.map((topic) => (
              <TopicNotes key={topic.name} topic={topic} accent={spec.accent} />
            ))}
          </div>
        </div>
      ))}

      {/* Quick reference */}
      <div style={card}>
        <h3 style={sectionTitle}>Quick reference</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {spec.units.map(u => (
            <div key={u.unit}>
              <div style={{ ...mono, color: spec.accent, fontWeight: 600, marginBottom: '4px' }}>Unit {u.unit} · {u.name}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {u.topics.map(t => (
                  <span key={t.name} style={{ ...mono, color: 'var(--text-primary, #1d1d1f)', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '999px', padding: '3px 9px' }}>
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="master-pdf">
        <PdfDownload pdf={spec.pdf} code={spec.code} shortTitle={spec.shortTitle} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <a
          data-testid="master-pdf-link"
          href={spec.pdf?.siteUrl || '#master-pdf'}
          target={spec.pdf?.siteUrl ? '_blank' : undefined}
          rel="noreferrer"
          style={{ ...mono, color: spec.accent, textDecoration: 'none', fontWeight: 600 }}
        >
          {spec.pdf?.siteUrl ? 'Download the master PDF' : 'Master PDF — see the download block above'}
        </a>
      </div>
    </div>
  );
}
