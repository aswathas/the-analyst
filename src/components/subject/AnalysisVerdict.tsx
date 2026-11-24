import type { SubjectSpec } from '../../data/subjects/types';
import { card, sectionTitle, mono, muted, body } from './styles';

/**
 * The analyst's verdict: the number, the plan, and what to do first.
 * A student should be able to read only this block and still know where to start.
 */
export function AnalysisVerdict({ spec }: { spec: SubjectSpec }) {
  const topics = spec.units.flatMap((u) => u.topics);
  const must = topics.filter((t) => t.priority === 'must');
  const should = topics.filter((t) => t.priority === 'should');
  const skip = topics.filter((t) => t.priority === 'skip');
  const mustMinutes = must.reduce((s, t) => s + t.minutes, 0);
  const shouldMinutes = should.reduce((s, t) => s + t.minutes, 0);
  const totalMinutes = topics.reduce((s, t) => s + t.minutes, 0);
  const days = Math.max(1, Math.ceil((mustMinutes / 60) / 1.5));
  const best = spec.safeCombo[0];
  const hours = Math.round((mustMinutes / 60) * 10) / 10;
  const shouldHours = Math.round((shouldMinutes / 60) * 10) / 10;

  return (
    <div style={{ ...card, borderTop: '3px solid var(--accent-ink)' }}>
      <h3 style={sectionTitle}>The verdict</h3>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <div style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--text-primary, #1d1d1f)', marginBottom: '10px' }}>
            {best ? best.claim : `Learn ${must.length} topics and you clear most of the paper`}
          </div>
          <p style={{ ...body, color: muted, margin: 0 }}>
            {must.length} must-know topics carry the paper and cost <b>{hours} hours</b> — about{' '}
            <b>{days} days</b> at 90 minutes a day. Add the {should.length} should-know topics
            {shouldHours > 0 ? ` (${shouldHours} more hours)` : ''} for the remaining marks, and skip the{' '}
            {skip.length} skip topics entirely.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Stat n={String(must.length)} label="Must learn" color="var(--accent-ink)" />
          <Stat n={`${hours}h`} label="To clear the core" color="var(--prio-must)" />
          <Stat n={String(skip.length)} label="Safe to skip" color="var(--prio-skip)" />
          <Stat n={`${Math.round((totalMinutes / 60) * 10) / 10}h`} label="Full syllabus" color="var(--prio-should)" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginTop: '18px' }}>
        <Plan
          title="If you have 3 days"
          lines={[
            `Day 1 — ${spec.units[0] ? `Unit ${spec.units[0].unit}: ${spec.units[0].name}` : 'Unit 1'}, all must-know topics.`,
            `Day 2 — ${spec.units[1] ? `Unit ${spec.units[1].unit}: ${spec.units[1].name}` : 'Unit 2'}, all must-know topics.`,
            `Day 3 — Units ${spec.units[2]?.unit ?? 3}–${spec.units[4]?.unit ?? 5} must-know topics, then the fact sheet.`,
          ]}
        />
        <Plan
          title="If you have 1 day"
          lines={[
            'Only the must-know topics. Nothing else.',
            'Read the first-principles lines and redraw the diagrams.',
            'Skip the worked examples you do not understand the first time.',
          ]}
        />
        <Plan
          title="On exam day"
          lines={[
            `Part A: ${spec.blueprint.partA.count} one-markers, one minute each. Learn them as facts.`,
            `Part B: answer ${spec.blueprint.partB.answerAny} of ${spec.blueprint.partB.count}, ${spec.blueprint.partB.marksEach} marks each.`,
            `Part C: answer ${spec.blueprint.partC.answerAny} of ${spec.blueprint.partC.count}, ${spec.blueprint.partC.marksEach} marks. Write one well.`,
          ]}
        />
      </div>
    </div>
  );
}

function Stat({ n, label, color }: { n: string; label: string; color: string }) {
  return (
    <div style={{ border: '1px solid var(--border-card)', borderRadius: '14px', padding: '12px 16px', minWidth: '92px' }}>
      <div style={{ fontSize: '26px', fontWeight: 600, color, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{n}</div>
      <div style={{ ...mono, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '3px' }}>{label}</div>
    </div>
  );
}

function Plan({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '14px 16px', background: 'var(--bg-inset)' }}>
      <div style={{ ...mono, fontWeight: 600, color: 'var(--text-primary, #1d1d1f)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
        {title}
      </div>
      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: muted, lineHeight: 1.6 }}>
        {lines.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
