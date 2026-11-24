import type { SubjectSpec } from '../../data/subjects/types';
import { card, sectionTitle, mono, muted, dot, unitColor, PRIORITY_COLOR, PRIORITY_SOFT, PRIORITY_LINE } from './styles';

export function UnitBreakdown({ spec }: { spec: SubjectSpec }) {
  return (
    <div style={card}>
      <h3 style={sectionTitle}>Unit breakdown</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {spec.units.map((unit, ui) => {
          const color = unitColor(ui);
          const totalMinutes = unit.topics.reduce((sum, t) => sum + t.minutes, 0);
          return (
            <div key={unit.unit}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={dot(color)} />
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary, #1d1d1f)', letterSpacing: '-0.24px' }}>
                  Unit {unit.unit} · {unit.name}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {unit.topics.map((topic) => (
                  <div
                    key={topic.name}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      padding: '10px 12px',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ flex: '1 1 220px', minWidth: 0, fontSize: '14px', color: 'var(--text-primary, #1d1d1f)', lineHeight: 1.45 }}>
                      {topic.name}
                      {topic.why && (
                        <span style={{ display: 'block', fontSize: '12px', color: muted, marginTop: '4px' }}>{topic.why}</span>
                      )}
                    </span>
                    <span
                      style={{
                        ...mono,
                        color: PRIORITY_COLOR[topic.priority],
                        border: `1px solid ${PRIORITY_LINE[topic.priority]}`,
                        background: PRIORITY_SOFT[topic.priority],
                        borderRadius: '999px',
                        padding: '3px 9px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        flexShrink: 0,
                      }}
                    >
                      {topic.priority}
                    </span>
                    <span style={{ ...mono, color: muted, flexShrink: 0, minWidth: '58px', textAlign: 'right' }}>
                      {topic.minutes} min
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ ...mono, color: muted, marginTop: '8px' }}>Unit total: {totalMinutes} min</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
