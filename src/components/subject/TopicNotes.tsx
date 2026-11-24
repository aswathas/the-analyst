import type { Topic } from '../../data/subjects/types';
import { renderDiagram } from '../../lib/diagram';
import { mono, muted, PRIORITY_COLOR, PRIORITY_SOFT, PRIORITY_LINE } from './styles';

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
        border: '1px solid var(--border-subtle)',
        borderTop: `2px solid ${accent}`,
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
              border: `1px solid ${PRIORITY_LINE[topic.priority]}`,
              background: PRIORITY_SOFT[topic.priority],
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
        <div style={{ background: 'var(--callout-warn-bg)', border: '1px solid var(--callout-warn-line)', borderRadius: '8px', padding: '10px 12px' }}>
          <div style={{ ...mono, color: 'var(--callout-warn-label)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
            Remember it this way
          </div>
          <div style={{ fontSize: '14px', color: 'var(--callout-warn-ink)', lineHeight: 1.5 }}>{topic.analogy}</div>
        </div>
      )}

      {diagram && (
        <div
          style={{ background: 'var(--bg-figure)', border: '1px solid var(--border-figure)', borderRadius: '10px', padding: '12px', overflowX: 'auto' }}
          dangerouslySetInnerHTML={{ __html: diagram }}
        />
      )}

      {topic.example && (
        <div style={{ background: 'var(--callout-ok-bg)', border: '1px solid var(--callout-ok-line)', borderRadius: '8px', padding: '10px 12px' }}>
          <div style={{ ...mono, color: 'var(--callout-ok-label)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
            Worked example
          </div>
          <div style={{ fontSize: '14px', color: 'var(--callout-ok-ink)', lineHeight: 1.55 }}>{topic.example}</div>
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
