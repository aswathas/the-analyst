import type { CSSProperties } from 'react';

/** Shared look for the sem-7 subject pages. Mirrors the site's existing card language. */
export const card: CSSProperties = {
  background: 'var(--bg-card, #ffffff)',
  borderRadius: '18px',
  border: '1px solid var(--border-card, rgba(0,0,0,0.08))',
  padding: '24px',
};

export const sectionTitle: CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary, #6e6e73)',
  margin: '0 0 12px',
  fontFamily: "'JetBrains Mono', monospace",
};

export const body: CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.55,
  color: 'var(--text-primary, #1d1d1f)',
  letterSpacing: '-0.224px',
};

export const mono: CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '11px',
  letterSpacing: '0.04em',
};

export const muted = 'var(--text-secondary, #6e6e73)';

/** Unit colour carried by a small dot, never a thick one-side border. */
export function dot(color: string): CSSProperties {
  return { width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 };
}

export const PRIORITY_COLOR: Record<'must' | 'should' | 'skip', string> = {
  must: '#dc2626',
  should: '#f59e0b',
  skip: '#6e6e73',
};

export const UNIT_COLORS = ['#0066cc', '#7c3aed', '#f59e0b', '#10b981', '#dc2626'];

export function unitColor(index: number, accent: string): string {
  return index === 0 ? accent : UNIT_COLORS[index % UNIT_COLORS.length];
}
