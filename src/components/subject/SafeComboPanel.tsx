import type { SubjectSpec } from '../../data/subjects/types';
import { card, sectionTitle, mono, muted, dot, unitColor } from './styles';

export function SafeComboPanel({ spec }: { spec: SubjectSpec }) {
  return (
    <div style={card}>
      <h3 style={sectionTitle}>Safe combo</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {spec.safeCombo.map((combo, i) => {
          const body = (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={dot(unitColor(i, spec.accent))} />
                <span style={{ fontSize: '16px', fontWeight: 600, color: i === 0 ? spec.accent : 'var(--text-primary, #1d1d1f)', letterSpacing: '-0.3px' }}>
                  {combo.claim}
                </span>
              </div>
              <div style={{ ...mono, color: muted }}>Unit {combo.unit}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {combo.topics.map((t) => (
                  <span
                    key={t}
                    style={{
                      ...mono,
                      color: 'var(--text-primary, #1d1d1f)',
                      background: 'rgba(0,0,0,0.04)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: '999px',
                      padding: '4px 10px',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ ...mono, color: muted }}>Expected marks: {combo.marks} of {spec.blueprint.total}</div>
            </>
          );
          return (
            <div
              key={i}
              {...(i === 0 ? { 'data-testid': 'safe-combo-claim' } : {})}
              style={{
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {body}
            </div>
          );
        })}
      </div>
    </div>
  );
}
