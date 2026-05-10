import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Heatmap } from './Heatmap';
import { UnitDonut } from './UnitDonut';
import { PartBreakdown } from './PartBreakdown';
import { PYQCards } from './PYQCards';
import { YearTable } from './YearTable';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#0066cc',
        background: '#eff6ff',
        padding: '4px 12px',
        borderRadius: '100px',
        marginBottom: '12px',
      }}
    >
      {children}
    </div>
  );
}

function Block({
  children,
  title,
  label,
  dark = false,
}: {
  children: React.ReactNode;
  title: string;
  label?: string;
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: 'clamp(28px, 5vw, 56px) clamp(20px, 5vw, 56px)',
        background: dark ? '#1c1c1e' : '#ffffff',
        borderRadius: '20px',
        border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e5e7eb',
      }}
    >
      {label && <SectionLabel>{label}</SectionLabel>}
      <h2
        style={{
          fontSize: 'clamp(22px, 3.5vw, 32px)',
          fontWeight: 600,
          color: dark ? '#ffffff' : '#1d1d1f',
          margin: '0 0 24px',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
        }}
      >
        {title}
      </h2>
      {children}
    </motion.div>
  );
}

const FORMAT_CARDS = [
  {
    part: 'Part A',
    detail: '20 × 1 = 20 marks',
    sub: 'All compulsory MCQs',
    color: '#0066cc',
    note: 'No choice. Every question counts.',
  },
  {
    part: 'Part B',
    detail: '4 × 10 = 40 marks',
    sub: 'Answer 4 of 6 questions',
    color: '#7c3aed',
    note: 'Pick your strongest 4.',
  },
  {
    part: 'Part C',
    detail: '1 × 15 = 15 marks',
    sub: 'One compulsory OR question',
    color: '#dc2626',
    note: 'Choose A or B — both on wrangling.',
  },
];

export function Analysis() {
  return (
    <section
      id="overview"
      style={{
        background: '#f5f5f7',
        padding: 'clamp(48px, 8vw, 96px) clamp(16px, 5vw, 80px)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <SectionLabel>Intelligence Report</SectionLabel>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 600,
              color: '#1d1d1f',
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              margin: '8px 0 12px',
            }}
          >
            4 Papers. Every Pattern. Decoded.
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            21CSS303T Data Science — SRM Institute.<br />
            Analyzed May 2025, July 2025, December 2025, and December 2023.
          </p>
        </div>

        {/* Exam Format */}
        <Block title="Exam Format at a Glance" label="Structure">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {FORMAT_CARDS.map((card, i) => (
              <div
                key={i}
                style={{
                  padding: '20px',
                  borderRadius: '14px',
                  border: `1.5px solid ${card.color}33`,
                  background: `${card.color}08`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2.5px',
                    background: card.color,
                  }}
                />
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: card.color, marginBottom: '6px' }}>
                  {card.part}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.03em' }}>
                  {card.detail}
                </div>
                <div style={{ fontSize: '12.5px', color: '#4b5563', marginTop: '4px' }}>{card.sub}</div>
                <div style={{ fontSize: '11.5px', color: '#9ca3af', marginTop: '10px', fontStyle: 'italic' }}>
                  {card.note}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            style={{
              marginTop: '20px',
              padding: '14px 20px',
              background: '#f9fafb',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: 500 }}>Total Marks</span>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.03em' }}>
              75 marks · 3 hours
            </span>
          </div>
        </Block>

        {/* PYQ Evidence */}
        <Block title="Source Papers Analyzed" label="Evidence Base">
          <PYQCards />
        </Block>

        {/* Heatmap */}
        <Block title="Topic Frequency Across All Papers" label="Topic Heatmap">
          <Heatmap />
        </Block>

        {/* Unit Coverage */}
        <Block title="Unit Coverage Distribution" label="Unit Analysis">
          <UnitDonut />
        </Block>

        {/* Part Breakdown — dark */}
        <Block title="Strategic Breakdown: Part A / B / C" label="Exam Strategy" dark>
          <PartBreakdown />
        </Block>

        {/* Year Evolution Table */}
        <Block title="Topic Appearance by Year" label="Year Evolution">
          <YearTable />
        </Block>

      </div>
    </section>
  );
}
