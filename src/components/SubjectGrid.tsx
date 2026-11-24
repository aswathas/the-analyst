import { motion } from 'framer-motion';
import { BarChart2, CheckCircle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { SemesterSwitcher } from './subject/SemesterSwitcher';
import { CountdownChip } from './subject/CountdownChip';
import { SEM7_SUBJECTS } from './subject/registry';
import { accentScope } from './subject/styles';

interface Subject {
  code: string;
  name: string;
  status: 'complete' | 'coming';
  color: string;
  stats?: { papers: number; topics: number; marks: number; hitRate: string };
  findings?: string[];
}

const SEM6_SUBJECTS: Subject[] = [
  {
    code: '21CSS303T',
    name: 'Data Science',
    status: 'complete',
    color: '#0066cc',
    stats: { papers: 4, topics: 15, marks: 75, hitRate: '100%' },
    findings: [
      'Q27 = Data Wrangling in ALL 3 recent papers',
      'Pandas + Matplotlib appear in every paper',
      'Safe combo: Wrangling + Viz + 1 ML = 65/75',
    ],
  },
  {
    code: '21ECC302T',
    name: 'Analog and Digital Communication',
    status: 'complete',
    color: '#f97316',
    stats: { papers: 3, topics: 10, marks: 75, hitRate: 'Q27' },
    findings: [
      'FM Carsons rule in 3/3 recent papers',
      'AM modulation index MCQs every paper',
      'Safe combo: AM/FM theory + Digital mod + Noise = 65/75',
    ],
  },
  {
    code: '21CCT301T',
    name: 'Cloud Computing using Blockchain',
    status: 'complete',
    color: '#7c3aed',
    stats: { papers: 1, topics: 15, marks: 75, hitRate: 'N/A' },
    findings: [
      'Fog architecture in 1/1 recent papers',
      'Blockchain consensus every paper',
      'Safe combo: Fog + BC fundamentals + DApps = 60/75',
    ],
  },
  { code: 'TBC', name: 'Compiler Design', status: 'coming', color: '#0891b2' },
  { code: 'TBC', name: 'Advanced Cryptography', status: 'coming', color: '#dc2626' },
  {
    code: '21CSC303J',
    name: 'Software Engineering & Project Management',
    status: 'complete',
    color: '#059669',
    stats: { papers: 6, topics: 15, marks: 75, hitRate: '100%' },
    findings: [
      'Process models + Requirements in ALL 6 papers',
      'COCOMO estimation appears in every paper',
      'Safe combo: Process Models + Req Eng + Testing + Risk = 65/75',
    ],
  },
  { code: 'TBC', name: 'Hybrid Vehicles', status: 'coming', color: '#d97706' },
];

function SubjectCard({ subject, index, sem7 }: { subject: Subject; index: number; sem7: boolean }) {
  const navigate = useNavigate();
  const routeMap: Record<string, string> = {
    '21CSS303T': '/ds-analysis',
    '21ECC302T': '/adc-analysis',
    '21CCT301T': '/ccbf-analysis',
    '21CSC303J': '/sepm-analysis',
  };
  const masterRouteMap: Record<string, string> = {
    '21CSS303T': '/pyq-master',
    '21ECC302T': '/adc-master',
    '21CCT301T': '/ccbf-master',
    '21CSC303J': '/sepm-analysis',
  };
  const handleViewAnalysis = () => {
    navigate(sem7 ? `/subject/${subject.code}` : (routeMap[subject.code] || '/ds-analysis'));
  };
  const handleViewMasterSheet = () => {
    navigate(sem7 ? `/subject/${subject.code}/master` : (masterRouteMap[subject.code] || '/pyq-master'));
  };

  if (subject.status === 'coming') {
    return (
      <motion.div
        data-testid={`subject-card-${subject.code}`}
        data-accent=""
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px' }}
        transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
        style={accentScope(subject.color, {
          background: 'var(--bg-card)',
          borderRadius: '18px',
          border: '1px solid var(--border-card)',
          overflow: 'hidden',
        })}
      >
        <div style={{ height: '3px', background: 'var(--accent-ink)' }} />
        <div style={{ padding: '24px', borderRadius: '12px', background: 'var(--bg-elevated)', border: '1px dashed var(--border-strong)', textAlign: 'center' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--accent-soft)', border: '1.5px solid var(--accent-line)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px',
          }}>
            <BarChart2 size={14} strokeWidth={1.5} style={{ color: 'var(--accent-ink)' }} />
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.224px' }}>Analysis in progress</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>PYQs → Pattern → Guide</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      data-testid={`subject-card-${subject.code}`}
      data-accent=""
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={accentScope(subject.color, {
        background: 'var(--bg-card)',
        borderRadius: '18px',
        border: '1px solid var(--border-card)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <div style={{ height: '3px', background: 'var(--accent-ink)', flexShrink: 0 }} />
      <div style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        gap: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: '11px', fontWeight: 600, letterSpacing: '0.09em',
              textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '5px',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {subject.code}
            </div>
            <h3 style={{
              fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)',
              margin: 0, letterSpacing: '-0.374px', lineHeight: 1.24,
            }}>
              {subject.name}
            </h3>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '11px', fontWeight: 600, color: 'var(--status-ink)',
            background: 'var(--status-bg)', padding: '4px 10px', borderRadius: '100px',
            flexShrink: 0, border: '1px solid var(--status-border)',
          }}>
            <CheckCircle size={10} strokeWidth={2.5} />
            Complete
          </div>
        </div>

        {sem7 && (() => {
          const spec = SEM7_SUBJECTS.find(s => s.code === subject.code);
          if (!spec) return null;
          return (
            <div style={{ marginTop: '-6px' }}>
              <CountdownChip examDate={spec.examDate} examSession={spec.examSession} />
            </div>
          );
        })()}

        {subject.stats && (
          <>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1px', background: 'var(--border-subtle)', borderRadius: '12px',
              overflow: 'hidden',
            }}>
              {[
                { n: subject.stats.papers, l: 'Papers' },
                { n: subject.stats.topics, l: 'Topics' },
                { n: subject.stats.marks, l: 'Marks' },
                { n: subject.stats.hitRate, l: 'Q27' },
              ].map(({ n, l }) => (
                <div key={l} style={{ background: 'var(--bg-card)', padding: '12px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '17px', fontWeight: 600, color: 'var(--accent-ink)', letterSpacing: '-0.374px' }}>{n}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 400, marginTop: '2px' }}>{l}</div>
                </div>
              ))}
            </div>

            {subject.findings && (
              <div>
                {subject.findings.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div style={{
                      width: '4px', height: '4px', borderRadius: '50%',
                      background: 'var(--accent-ink)', marginTop: '8px', flexShrink: 0,
                    }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.47, letterSpacing: '-0.224px' }}>{f}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button
                onClick={handleViewAnalysis}
                style={{
                  flex: 1, display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', gap: '6px',
                  padding: '11px 16px', borderRadius: '9999px',
                  background: 'var(--accent-fill)', color: 'var(--accent-label)',
                  border: 'none', fontSize: '14px', fontWeight: 500,
                  letterSpacing: '-0.224px', cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
              >
                <BarChart2 size={13} strokeWidth={1.5} />
                Analysis
              </button>
              <button
                onClick={handleViewMasterSheet}
                style={{
                  flex: 1, display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', gap: '6px',
                  padding: '11px 16px', borderRadius: '9999px',
                  background: 'var(--btn-master-bg)', color: 'var(--btn-master-text)',
                  border: `1px solid var(--btn-master-border)`, fontSize: '14px', fontWeight: 500,
                  letterSpacing: '-0.224px', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--btn-master-border)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--btn-master-bg)'; }}
              >
                <BookOpen size={13} strokeWidth={1.5} />
                Master Sheet
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export function SubjectGrid() {
  const [sem, setSem] = useState(7);
  const sem7 = SEM7_SUBJECTS;
  const subjects: Subject[] = sem === 7
    ? sem7.map(s => ({
        code: s.code,
        name: s.title,
        status: 'complete' as const,
        color: s.accent,
        stats: {
          papers: 0,
          topics: s.units.reduce((n, u) => n + u.topics.length, 0),
          marks: s.blueprint.total,
          hitRate: 'NEW',
        },
        findings: [s.safeCombo[0]?.claim ?? ''],
      }))
    : SEM6_SUBJECTS;

  return (
    <section id="subjects" style={{
      background: 'var(--bg-grid)',
      padding: 'clamp(56px, 8vw, 96px) clamp(16px, 5vw, 80px)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '48px' }}
        >
          <div style={{
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px',
          }}>
            {sem === 7 ? '5 Subjects · Semester 7' : '6 Subjects · Semester 6'} · SRM Institute
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600, color: 'var(--text-primary)',
            letterSpacing: '-0.03em', lineHeight: 1.07, margin: '0 0 14px',
          }}>
            Every subject. Every pattern.
          </h2>
          <p style={{
            fontSize: '17px', fontWeight: 400, lineHeight: 1.47, color: 'var(--text-secondary)',
            margin: '0 0 24px', letterSpacing: '-0.374px', maxWidth: '600px',
          }}>
            {sem === 7
              ? 'First-time electives. No previous-year paper exists, so every analysis is built from the official unit-wise syllabus and the published 75-mark pattern.'
              : '4 PYQs analyzed per subject. Topic heatmaps, exam strategy, and first-principles PDF guides.'}
          </p>
          <SemesterSwitcher semesters={[7, 6]} active={sem} onChange={setSem} />
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {subjects.map((subject, i) => (
            <SubjectCard key={`${subject.code}-${i}`} subject={subject} index={i} sem7={sem === 7} />
          ))}
        </div>
      </div>
    </section>
  );
}
