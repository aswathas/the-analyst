import type { Topic } from '../../data/subjects/types';
import { renderDiagram } from '../../lib/diagram';
import { mono, muted } from './styles';

const PRIORITY_COLOR = {
  must: '#0066cc',
  should: '#6e6e73',
  skip: '#dc2626',
} as const;

/**
 * One topic, taught: first principles, an analogy, a diagram and a worked example.
 * Shares the renderer with the master PDF so the page and the PDF cannot disagree.
 */
export function TopicNotes({ topic, accent }: { topic: Topic; accent: string }) {
  const diagram = topic.diagram ? renderDiagram(topic.diagram, accent) : null;

  return (
    <div
      data-testid="topic-notes"
      style={{
        border: '1px solid rgba(0,0,0,0.06)',
        borderLeft: `3px solid ${accent}`,
        borderRadius: '0 12px 12px 0',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary, #1d1d1f)', letterSpacing: '-0.2px' }}>
          {topic.name}
        </span>
        <span style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          <span
            style={{
              ...mono,
              color: PRIORITY_COLOR[topic.priority],
              border: `1px solid ${PRIORITY_COLOR[topic.priority]}33`,
              background: `${PRIORITY_COLOR[topic.priority]}12`,
              borderRadius: '999px',
              padding: '3px 9px',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {topic.priority}
          </span>
          <span style={{ ...mono, color: muted }}>{topic.minutes} min</span>
        </span>
      </div>

      {topic.principles && topic.principles.length > 0 && (
        <div>
          <div style={{ ...mono, color: muted, fontWeight: 600, marginBottom: '4px' }}>First principles</div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '14px', color: 'var(--text-primary, #1d1d1f)', lineHeight: 1.55 }}>
            {topic.principles.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {topic.analogy && (
        <div style={{ background: '#fffbeb', borderLeft: '3px solid #f59e0b', borderRadius: '0 8px 8px 0', padding: '10px 12px' }}>
          <div style={{ ...mono, color: '#b45309', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
            Remember it this way
          </div>
          <div style={{ fontSize: '14px', color: '#78350f', lineHeight: 1.5 }}>{topic.analogy}</div>
        </div>
      )}

      {diagram && (
        <div
          style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '12px', overflowX: 'auto' }}
          dangerouslySetInnerHTML={{ __html: diagram }}
        />
      )}

      {topic.example && (
        <div style={{ background: '#f0fdf4', borderLeft: '3px solid #16a34a', borderRadius: '0 8px 8px 0', padding: '10px 12px' }}>
          <div style={{ ...mono, color: '#15803d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
            Worked example
          </div>
          <div style={{ fontSize: '14px', color: '#14532d', lineHeight: 1.55 }}>{topic.example}</div>
        </div>
      )}

      {topic.why && (
        <div style={{ fontSize: '13px', color: muted, lineHeight: 1.5 }}>
          <b>How it shows up:</b> {topic.why}
        </div>
      )}
    </div>
  );
}
