interface StubProps { onBack?: () => void }
export default function CDMasterSheet({ onBack }: StubProps) {
  return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <h2>Compiler Design master sheet coming soon</h2>
      <p style={{ color: '#6e6e73' }}>This analysis is not published yet.</p>
      <button onClick={onBack}>Back</button>
    </div>
  );
}
