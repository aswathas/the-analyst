interface StubProps { onBack?: () => void }
export function CryptoAnalysisPage({ onBack }: StubProps) {
  return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <h2>Advanced Cryptography learning hub coming soon</h2>
      <p style={{ color: 'var(--text-muted)' }}>This analysis is not published yet.</p>
      <button onClick={onBack}>Back</button>
    </div>
  );
}
