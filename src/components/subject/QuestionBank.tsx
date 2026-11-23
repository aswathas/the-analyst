import { useState } from 'react';
import type { SubjectSpec, MCQ, LongQuestion } from '../../data/subjects/types';
import { card, sectionTitle, mono, muted } from './styles';

function McqItem({ mcq, index }: { mcq: MCQ; index: number }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '14px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
        <span style={{ ...mono, color: muted, fontWeight: 600, flexShrink: 0 }}>Q{index + 1}.</span>
        <span style={{ fontSize: '14px', color: 'var(--text-primary, #1d1d1f)', lineHeight: 1.45, flex: 1 }}>{mcq.question}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '6px', marginBottom: '10px' }}>
        {mcq.options.map((opt, oi) => {
          const isCorrect = revealed && oi === mcq.correct;
          return (
            <div
              key={oi}
              style={{
                ...mono,
                color: isCorrect ? '#34c759' : 'var(--text-primary, #1d1d1f)',
                background: isCorrect ? 'rgba(52,199,89,0.10)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${isCorrect ? 'rgba(52,199,89,0.25)' : 'rgba(0,0,0,0.06)'}`,
                borderRadius: '10px',
                padding: '8px 10px',
                lineHeight: 1.4,
              }}
            >
              {String.fromCharCode(65 + oi)}. {opt}
              {isCorrect && ' ✓'}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => setRevealed(!revealed)}
        style={{
          ...mono,
          background: 'none',
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: '999px',
          padding: '5px 12px',
          color: 'var(--text-secondary, #6e6e73)',
          cursor: 'pointer',
        }}
      >
        {revealed ? 'Hide answer' : 'Reveal answer'}
      </button>
      <div style={{ ...mono, color: muted, marginTop: '8px' }}>
        {mcq.source === 'archetype' ? 'Reference archetype — not from an SRM paper' : `From an SRM paper${mcq.paperName ? ` — ${mcq.paperName}` : ''}`}
      </div>
      {revealed && (
        <div style={{ marginTop: '8px', fontSize: '13px', color: muted, lineHeight: 1.5 }}>
          {mcq.explanation}
        </div>
      )}
    </div>
  );
}

function LongItem({ q, index, label }: { q: LongQuestion; index: number; label: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '14px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}>
        <span style={{ ...mono, color: muted, fontWeight: 600, flexShrink: 0 }}>{label}{index + 1}.</span>
        <span style={{ fontSize: '14px', color: 'var(--text-primary, #1d1d1f)', lineHeight: 1.45, flex: 1 }}>{q.question}</span>
        <span style={{ ...mono, color: muted, flexShrink: 0 }}>{q.marks} marks</span>
      </div>
      <button
        onClick={() => setRevealed(!revealed)}
        style={{
          ...mono,
          background: 'none',
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: '999px',
          padding: '5px 12px',
          color: 'var(--text-secondary, #6e6e73)',
          cursor: 'pointer',
        }}
      >
        {revealed ? 'Hide answer' : 'Reveal model answer'}
      </button>
      {revealed && (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <div style={{ ...mono, color: muted, fontWeight: 600, marginBottom: '4px' }}>Model answer</div>
            <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: muted, lineHeight: 1.55 }}>
              {q.modelAnswer.map((point, pi) => <li key={pi}>{point}</li>)}
            </ol>
          </div>
          <div>
            <div style={{ ...mono, color: muted, fontWeight: 600, marginBottom: '4px' }}>Key points</div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: muted, lineHeight: 1.55 }}>
              {q.keyPoints.map((point, pi) => <li key={pi}>{point}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export function QuestionBank({ spec }: { spec: SubjectSpec }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={card}>
        <h3 style={sectionTitle}>
          Part A — <span data-testid="mcq-count">{spec.mcqs.length}</span> MCQs
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {spec.mcqs.map((mcq, i) => <McqItem key={mcq.id} mcq={mcq} index={i} />)}
        </div>
      </div>

      <div style={card}>
        <h3 style={sectionTitle}>Part B — {spec.partB.length} questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {spec.partB.map((q, i) => <LongItem key={q.id} q={q} index={i} label="B" />)}
        </div>
      </div>

      <div style={card}>
        <h3 style={sectionTitle}>Part C — {spec.partC.length} questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {spec.partC.map((q, i) => <LongItem key={q.id} q={q} index={i} label="C" />)}
        </div>
      </div>
    </div>
  );
}
