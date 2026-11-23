export function CountdownChip({ examDate, examSession }: { examDate: string; examSession: 'FN' | 'AN' }) {
  const target = new Date(`${examDate}T09:00:00`).getTime();
  const now = Date.now();
  const days = Math.ceil((target - now) / 86_400_000);

  let label: string;
  let tone: string;
  if (days < 0) {
    label = 'Exam over';
    tone = '#6e6e73';
  } else if (days === 0) {
    label = `Exam today · ${examSession}`;
    tone = '#dc2626';
  } else {
    label = `${days} day${days === 1 ? '' : 's'} to exam`;
    tone = days <= 3 ? '#dc2626' : '#0066cc';
  }

  return (
    <span data-testid="countdown" style={{ background: `${tone}14`, color: tone, border: `1px solid ${tone}33`, borderRadius: 999, padding: '4px 12px', fontSize: 13, fontWeight: 600 }}>
      {label}
    </span>
  );
}
