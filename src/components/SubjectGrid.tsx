import { motion } from 'framer-motion';
import { BarChart2, BookOpen, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Subject {
  code: string;
  name: string;
  status: 'complete' | 'coming';
  color: string;
  stats?: { papers: number; topics: number; marks: number; hitRate: string };
  findings?: string[];
}

const SUBJECTS: Subject[] = [
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
  { code: 'TBC', name: 'Software Engineering & Project Management', status: 'coming', color: '#059669' },
  { code: 'TBC', name: 'Hybrid Vehicles', status: 'coming', color: '#d97706' },
];

function openPDF(subjectCode: string) {
  const pdfs: Record<string, string> = {
    '21CSS303T': '/prepguide.pdf',
    '21ECC302T': '/ADC_Prep_Guide.docx',
    '21CCT301T': '/CCBF_Prep_Guide.docx',
  };
  window.open(pdfs[subjectCode] || '/prepguide.pdf', '_blank');
}

function SubjectCard({ subject, index }: { subject: Subject; index: number }) {
  const navigate = useNavigate();
  const routeMap: Record<string, string> = {
    '21CSS303T': '/ds-analysis',
    '21ECC302T': '/adc-analysis',
    '21CCT301T': '/ccbf-analysis',
  };
  const masterRouteMap: Record<string, string> = {
    '21CSS303T': '/pyq-master',
    '21ECC302T': '/adc-master',
    '21CCT301T': '/ccbf-master',
  };
  const handleViewAnalysis = () => {
    navigate(routeMap[subject.code] || '/ds-analysis');
  };
  const handleViewMasterSheet = () => {
    navigate(masterRouteMap[subject.code] || '/pyq-master');
  };
  const masterSheetPDFs: Record<string, string> = {
    '21CSS303T': '/mastersheet.pdf',
    '21ECC302T': '/adc-mastersheet.pdf',
    '21CCT301T': '/prepguide.pdf',
  };

  if (subject.status === 'coming') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px' }}
        transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <div style={{ height: '3px', background: subject.color }} />
        <div style={{ padding: '24px', borderRadius: '12px', background: '#f5f5f7', border: '1px dashed rgba(0,0,0,0.10)', textAlign: 'center' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: `${subject.color}14`, border: `1.5px solid ${subject.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px',
          }}>
            <BarChart2 size={14} strokeWidth={1.5} style={{ color: subject.color }} />
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.224px' }}>Analysis in progress</div>
          <div style={{ fontSize: '12px', color: '#6e6e73', marginTop: '4px' }}>PYQs → Pattern → Guide</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: '#ffffff',
        borderRadius: '18px',
        border: '1px solid rgba(0,0,0,0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ height: '3px', background: subject.color, flexShrink: 0 }} />
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
              fontSize: '10px', fontWeight: 600, letterSpacing: '0.09em',
              textTransform: 'uppercase', color: '#6e6e73', marginBottom: '5px',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {subject.code}
            </div>
            <h3 style={{
              fontSize: '17px', fontWeight: 600, color: '#1d1d1f',
              margin: 0, letterSpacing: '-0.374px', lineHeight: 1.24,
            }}>
              {subject.name}
            </h3>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '11px', fontWeight: 600, color: '#34c759',
            background: 'rgba(52,199,89,0.10)', padding: '4px 10px', borderRadius: '100px',
            flexShrink: 0, border: '1px solid rgba(52,199,89,0.2)',
          }}>
            <CheckCircle size={10} strokeWidth={2.5} />
            Complete
          </div>
        </div>

        {subject.stats && (
          <>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1px', background: 'rgba(0,0,0,0.06)', borderRadius: '12px',
              overflow: 'hidden',
            }}>
              {[
                { n: subject.stats.papers, l: 'Papers' },
                { n: subject.stats.topics, l: 'Topics' },
                { n: subject.stats.marks, l: 'Marks' },
                { n: subject.stats.hitRate, l: 'Q27' },
              ].map(({ n, l }) => (
                <div key={l} style={{ background: '#ffffff', padding: '12px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '17px', fontWeight: 600, color: subject.color, letterSpacing: '-0.374px' }}>{n}</div>
                  <div style={{ fontSize: '10px', color: '#6e6e73', fontWeight: 400, marginTop: '2px' }}>{l}</div>
                </div>
              ))}
            </div>

            {subject.findings && (
              <div>
                {subject.findings.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div style={{
                      width: '4px', height: '4px', borderRadius: '50%',
                      background: subject.color, marginTop: '8px', flexShrink: 0,
                    }} />
                    <span style={{ fontSize: '14px', color: '#6e6e73', lineHeight: 1.47, letterSpacing: '-0.224px' }}>{f}</span>
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
                  background: subject.color, color: '#ffffff',
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
                  background: 'rgba(255,255,255,0.08)', color: '#ffffff',
                  border: `1px solid rgba(255,255,255,0.15)`, fontSize: '14px', fontWeight: 500,
                  letterSpacing: '-0.224px', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
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
  return (
    <section id="subjects" style={{
      background: '#f5f5f7',
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
            textTransform: 'uppercase', color: '#6e6e73', marginBottom: '10px',
          }}>
            6 Subjects · SRM Institute
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600, color: '#1d1d1f',
            letterSpacing: '-0.03em', lineHeight: 1.07, margin: '0 0 14px',
          }}>
            Every subject. Every pattern.
          </h2>
          <p style={{
            fontSize: '17px', fontWeight: 400, lineHeight: 1.47, color: '#6e6e73',
            margin: 0, letterSpacing: '-0.374px', maxWidth: '600px',
          }}>
            4 PYQs analyzed per subject. Topic heatmaps, exam strategy, and first-principles PDF guides.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {SUBJECTS.map((subject, i) => (
            <SubjectCard key={i} subject={subject} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}