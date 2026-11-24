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
      <div data-testid="pdf-coming" style={{ padding: 16, borderRadius: 12, border: '1px dashed var(--border-strong)', color: 'var(--text-secondary)' }}>
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
            style={{ ...buttonBase, background: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
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
            style={{ ...buttonBase, border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}
          >
            Mirror (GitHub)
          </a>
        )}
        {pdf.pages > 0 && <span style={{ ...mono, color: muted }}>{pdf.pages} pages</span>}
      </div>
      <div style={{ ...mono, color: muted, marginTop: '10px' }}>{shortTitle} master notes · {code}</div>
    </div>
  );
}
