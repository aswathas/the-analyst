import type { SubjectSpec } from '../../data/subjects/types';
import { card, sectionTitle, mono, muted, unitColor, PRIORITY_COLOR } from './styles';

const PRIORITY_RANK = { must: 0, should: 1, skip: 2 } as const;

/**
 * The study plan: every topic ranked the way an analyst would rank it —
 * by marks per minute of study, not by the order the syllabus lists it.
 */
export function StudyPlanTable({ spec }: { spec: SubjectSpec }) {
  // Marks a topic is worth, taken from the safe-combo blocks it belongs to.
  const marksByUnit = new Map<number, number>();
  for (const combo of spec.safeCombo) {
    marksByUnit.set(combo.unit, (marksByUnit.get(combo.unit) ?? 0) + combo.marks);
  }

  const rows = spec.units
    .flatMap((unit) =>
      unit.topics.map((topic) => {
        const unitMarks = marksByUnit.get(unit.unit) ?? 0;
        const share = unit.topics.length ? unitMarks / unit.topics.length : 0;
        const weight = topic.priority === 'must' ? 1 : topic.priority === 'should' ? 0.55 : 0.15;
        const value = share * weight;
        const perMinute = topic.minutes > 0 ? (value / topic.minutes) * 60 : 0;
        return { unit, topic, value, perMinute };
      }),
    )
    .sort((a, b) => {
      const p = PRIORITY_RANK[a.topic.priority] - PRIORITY_RANK[b.topic.priority];
      if (p !== 0) return p;
      return b.perMinute - a.perMinute;
    });

  const mustCount = rows.filter((r) => r.topic.priority === 'must').length;

  return (
    <div style={card}>
      <h3 style={sectionTitle}>Study order — ranked by marks per minute</h3>
      <p style={{ fontSize: '13px', color: muted, margin: '0 0 14px', lineHeight: 1.55 }}>
        Not syllabus order — value order. Topics are sorted by the marks they are worth against the time they cost, so the
        highest-yield material is at the top. The first {mustCount} are the ones that carry the paper.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {rows.map((row, i) => {
          const unitIndex = spec.units.findIndex((u) => u.unit === row.unit.unit);
          const color = unitColor(unitIndex, spec.accent);
          return (
            <div
              key={`${row.unit.unit}-${row.topic.name}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '26px 1fr auto auto',
                gap: '10px',
                alignItems: 'baseline',
                padding: '8px 10px',
                borderRadius: '10px',
                background: i < mustCount ? 'rgba(220,38,38,0.045)' : 'transparent',
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <span style={{ ...mono, color: muted, textAlign: 'right' }}>{i + 1}</span>
              <span style={{ fontSize: '14px', color: 'var(--text-primary, #1d1d1f)', lineHeight: 1.4, minWidth: 0 }}>
                {row.topic.name}
                <span style={{ display: 'block', ...mono, color: muted, marginTop: '2px' }}>
                  Unit {row.unit.unit} · {row.unit.name}
                </span>
              </span>
              <span
                style={{
                  ...mono,
                  color: PRIORITY_COLOR[row.topic.priority],
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {row.topic.priority}
              </span>
              <span style={{ ...mono, color, whiteSpace: 'nowrap', minWidth: '58px', textAlign: 'right' }}>
                {row.topic.minutes} min
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
