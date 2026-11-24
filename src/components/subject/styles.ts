import type { CSSProperties } from 'react';

/** Shared look for the sem-7 subject pages. Mirrors the site's existing card language. */
export const card: CSSProperties = {
  background: 'var(--bg-card)',
  borderRadius: '18px',
  border: '1px solid var(--border-card)',
  padding: '24px',
};

export const sectionTitle: CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
  margin: '0 0 12px',
  fontFamily: "'JetBrains Mono', monospace",
};

export const body: CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.55,
  color: 'var(--text-primary)',
  letterSpacing: '-0.224px',
};

export const mono: CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '11px',
  letterSpacing: '0.04em',
};

export const muted = 'var(--text-secondary)';

/**
 * Attach a subject accent to an element so the accent tokens resolve.
 * The element must also carry `data-accent`.
 */
export function accentScope(accent: string, style?: CSSProperties): CSSProperties {
  return { ...style, '--accent': accent } as CSSProperties;
}

/** Unit colour carried by a small dot, never a thick one-side border. */
export function dot(color: string): CSSProperties {
  return { width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 };
}

/**
 * Priority language, one definition for the whole subject page.
 * must = red, should = amber, skip = grey.
 */
export const PRIORITY_COLOR: Record<'must' | 'should' | 'skip', string> = {
  must: 'var(--prio-must)',
  should: 'var(--prio-should)',
  skip: 'var(--prio-skip)',
};

export const PRIORITY_SOFT: Record<'must' | 'should' | 'skip', string> = {
  must: 'var(--prio-must-soft)',
  should: 'var(--prio-should-soft)',
  skip: 'var(--prio-skip-soft)',
};

export const PRIORITY_LINE: Record<'must' | 'should' | 'skip', string> = {
  must: 'var(--prio-must-line)',
  should: 'var(--prio-should-line)',
  skip: 'var(--prio-skip-line)',
};

/** The five unit hues, as theme-aware tokens. */
const UNIT_TOKENS = ['var(--unit-1)', 'var(--unit-2)', 'var(--unit-3)', 'var(--unit-4)', 'var(--unit-5)'];

/** Unit 1 takes the subject accent; the rest walk the palette. */
export function unitColor(index: number): string {
  return index === 0 ? 'var(--accent-ink)' : UNIT_TOKENS[(index - 1) % UNIT_TOKENS.length];
}
