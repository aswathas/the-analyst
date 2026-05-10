import { useState, useEffect } from 'react';
import { Cursor } from './components/Cursor';
import { Hero } from './components/Hero';
import { SubjectGrid } from './components/SubjectGrid';
import { DownloadSection } from './components/DownloadSection';
import { DSAnalysisPage } from './components/DSAnalysisPage';

type View = 'home' | 'ds-analysis';

function Footer() {
  return (
    <footer
      id="about"
      style={{
        background: '#1d1d1f',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '32px clamp(16px, 5vw, 80px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      <div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', letterSpacing: '-0.02em', marginBottom: '4px' }}>
          Aswath AS · The Analyst
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
          Semester Exam Intelligence · 6 Subjects
        </div>
      </div>
      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.18)' }}>
        21CSS303T · 2025
      </span>
    </footer>
  );
}

function App() {
  const [view, setView] = useState<View>('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  if (view === 'ds-analysis') {
    return (
      <>
        <Cursor />
        <DSAnalysisPage onBack={() => setView('home')} />
      </>
    );
  }

  return (
    <>
      <Cursor />
      <Hero />
      <SubjectGrid onViewAnalysis={() => setView('ds-analysis')} />
      <DownloadSection />
      <Footer />
    </>
  );
}

export default App;
