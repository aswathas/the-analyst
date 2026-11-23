export function SemesterSwitcher({ semesters, active, onChange }: { semesters: number[]; active: number; onChange: (sem: number) => void }) {
  return (
    <div
      role="tablist"
      aria-label="Semester"
      style={{
        display: 'inline-flex',
        gap: '4px',
        padding: '4px',
        borderRadius: '9999px',
        background: 'rgba(0,0,0,0.04)',
        border: '1px solid var(--border-card, rgba(0,0,0,0.08))',
      }}
    >
      {semesters.map(sem => {
        const selected = active === sem;
        return (
          <button
            key={sem}
            role="tab"
            data-testid={`semester-tab-${sem}`}
            aria-selected={selected}
            onClick={() => onChange(sem)}
            style={{
              padding: '7px 18px',
              borderRadius: '9999px',
              border: 'none',
              background: selected ? 'var(--bg-card, #ffffff)' : 'transparent',
              color: selected ? 'var(--text-primary, #1d1d1f)' : 'var(--text-secondary, #6e6e73)',
              fontSize: '13px',
              fontWeight: selected ? 600 : 500,
              cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.02em',
              boxShadow: selected ? '0 1px 3px rgba(0,0,0,0.10)' : 'none',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            Sem {sem}
          </button>
        );
      })}
    </div>
  );
}
