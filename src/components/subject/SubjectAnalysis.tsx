import type { SubjectSpec } from '../../data/subjects/types';
import { CountdownChip } from './CountdownChip';
import { BlueprintPanel } from './BlueprintPanel';
import { SafeComboPanel } from './SafeComboPanel';
import { UnitBreakdown } from './UnitBreakdown';
import { QuestionBank } from './QuestionBank';
import { PdfDownload } from './PdfDownload';
import { UnitDonutGeneric } from './UnitDonutGeneric';
import { card, sectionTitle, mono, muted, body, unitColor } from './styles';

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSf3j8ie04bEhqdU-iluDsBiXAE5VPMG5BNLXbFsTp5HTauETw/viewform';

const CATEGORY_LABEL: Record<SubjectSpec['category'], string> = {
  core: 'Core',
  'professional-elective': 'Professional elective',
  'open-elective': 'Open elective',
};

function unitWeights(spec: SubjectSpec) {
  const minutes = spec.units.map(u => u.topics.reduce((s, t) => s + t.minutes, 0));
  const total = minutes.reduce((a, b) => a + b, 0) || 1;
  return spec.units.map((u, i) => ({
    unit: u.unit,
    label: `Unit ${u.unit}`,
    pct: Math.round((minutes[i] / total) * 100),
    color: unitColor(i, spec.accent),
  }));
}

export function SubjectAnalysis({ spec, onBack }: { spec: SubjectSpec; onBack: () => void }) {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(24px, 4vw, 48px) clamp(16px, 4vw, 32px) 64px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
        ← All subjects
      </button>

      {/* Header */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ ...mono, color: muted, textTransform: 'uppercase', marginBottom: '6px' }}>
              <span data-testid="subject-code">{spec.code}</span>
            </div>
            <h1 data-testid="subject-title" style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 8px', color: 'var(--text-primary, #1d1d1f)' }}>
              {spec.title}
            </h1>
            <p style={{ ...body, color: muted, margin: 0, maxWidth: '620px' }}>{spec.oneLiner}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <span style={{ ...mono, color: spec.accent, border: `1px solid ${spec.accent}33`, background: `${spec.accent}12`, borderRadius: '999px', padding: '4px 10px', fontWeight: 600 }}>
              {CATEGORY_LABEL[spec.category]}
            </span>
            <CountdownChip examDate={spec.examDate} examSession={spec.examSession} />
          </div>
        </div>
      </div>

      {/* Honesty line */}
      <div data-testid="pyq-note" style={{ ...body, color: muted, padding: '0 4px' }}>
        {spec.pyqNote}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', alignItems: 'start' }}>
        <BlueprintPanel spec={spec} />
        <div style={card}>
          <h3 style={sectionTitle}>Unit weight</h3>
          <UnitDonutGeneric units={unitWeights(spec)} total={spec.blueprint.total} />
        </div>
      </div>

      <SafeComboPanel spec={spec} />
      <UnitBreakdown spec={spec} />

      <div>
        <h3 style={{ ...sectionTitle, fontSize: '13px', marginBottom: '10px' }}>Practice</h3>
        <QuestionBank spec={spec} />
      </div>

      {/* Resources */}
      <div style={card}>
        <h3 style={sectionTitle}>Resources</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {spec.resources.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ ...mono, color: muted, flexShrink: 0 }}>→</span>
              <span style={{ flex: 1, fontSize: '14px', color: 'var(--text-primary, #1d1d1f)', lineHeight: 1.45 }}>
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noreferrer" style={{ color: spec.accent, textDecoration: 'none' }}>{r.label}</a>
                ) : (
                  r.label
                )}
                {r.note && <span style={{ display: 'block', ...mono, color: muted, marginTop: '2px' }}>{r.note}</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      <PdfDownload pdf={spec.pdf} code={spec.code} shortTitle={spec.shortTitle} />

      <div style={{ ...body, color: muted, textAlign: 'center' }}>
        <a href={FORM_URL} target="_blank" rel="noreferrer" style={{ color: spec.accent, textDecoration: 'none', fontWeight: 600 }}>
          What was asked in the paper?
        </a>
        <span style={{ display: 'block', ...mono, marginTop: '4px' }}>Tell us what the paper actually asked — crowdsourced, and it makes the next cohort better.</span>
      </div>
    </div>
  );
}
