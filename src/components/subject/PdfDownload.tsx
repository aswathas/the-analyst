import type { PdfLinks } from '../../data/subjects/types';
import { card, sectionTitle, mono, muted } from './styles';

const buttonBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '10px 18px',
  borderRadius: '9999px',
  fontSize: '14px',
  fontWeight: 500,
  textDecoration: 'none',
};

export function PdfDownload({ pdf, code, shortTitle }: { pdf?: PdfLinks; code: string; shortTitle: string }) {
  if (!pdf || (!pdf.siteUrl && !pdf.releaseUrl)) {
    return (
      <div data-testid="pdf-coming" style={{ padding: 16, borderRadius: 12, border: '1px dashed rgba(0,0,0,0.15)', color: '#6e6e73' }}>
        Master PDF for {code} is being generated. Check back before the exam.
      </div>
    );
  }

  return (
    <div style={card}>
      <h3 style={sectionTitle}>Master PDF</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        {pdf.siteUrl && (
          <a
            data-testid="pdf-site"
            href={pdf.siteUrl}
            target="_blank"
            rel="noreferrer"
            style={{ ...buttonBase, background: '#0066cc', color: '#ffffff' }}
          >
            Download master PDF
          </a>
        )}
        {pdf.releaseUrl && (
          <a
            data-testid="pdf-mirror"
            href={pdf.releaseUrl}
            target="_blank"
            rel="noreferrer"
            style={{ ...buttonBase, border: '1px solid rgba(0,0,0,0.12)', color: 'var(--text-primary, #1d1d1f)' }}
          >
            Mirror (GitHub)
          </a>
        )}
        {pdf.driveUrl && (
          <a
            data-testid="pdf-drive"
            href={pdf.driveUrl}
            target="_blank"
            rel="noreferrer"
            style={{ ...buttonBase, border: '1px solid rgba(0,0,0,0.12)', color: 'var(--text-primary, #1d1d1f)' }}
          >
            Drive copy
          </a>
        )}
        {pdf.pages > 0 && <span style={{ ...mono, color: muted }}>{pdf.pages} pages</span>}
      </div>
      <div style={{ ...mono, color: muted, marginTop: '10px' }}>{shortTitle} master sheet · {code}</div>
    </div>
  );
}
