import { useState } from 'react';

export function CountdownChip({ examDate, examSession }: { examDate: string; examSession: 'FN' | 'AN' }) {
  // Read the clock once at mount: Date.now() during render is an impure read.
  const [now] = useState(() => Date.now());
  const target = new Date(`${examDate}T09:00:00`).getTime();
  const days = Math.ceil((target - now) / 86_400_000);

  let label: string;
  let tone: 'over' | 'urgent' | 'calm';
  if (days < 0) {
    label = 'Exam over';
    tone = 'over';
  } else if (days === 0) {
    label = `Exam today · ${examSession}`;
    tone = 'urgent';
  } else {
    label = `${days} day${days === 1 ? '' : 's'} to exam`;
    tone = days <= 3 ? 'urgent' : 'calm';
  }

  const TONE = {
    over: { ink: 'var(--prio-skip)', soft: 'var(--prio-skip-soft)', line: 'var(--prio-skip-line)' },
    urgent: { ink: 'var(--prio-must)', soft: 'var(--prio-must-soft)', line: 'var(--prio-must-line)' },
    calm: { ink: 'var(--accent-ink)', soft: 'var(--accent-soft)', line: 'var(--accent-line)' },
  }[tone];

  return (
    <span data-testid="countdown" style={{ background: TONE.soft, color: TONE.ink, border: `1px solid ${TONE.line}`, borderRadius: 999, padding: '4px 12px', fontSize: 13, fontWeight: 600 }}>
      {label}
    </span>
  );
}
