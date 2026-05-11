import { useState, useEffect, lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Cursor } from './components/Cursor';
import { Hero } from './components/Hero';
import { StoicSection } from './components/StoicSection';
import { SubjectGrid } from './components/SubjectGrid';
import { PWAPrompt } from './components/PWAPrompt';

// Lazy-load heavy components — deferred until needed
const DSAnalysisPage = lazy(() => import('./components/DSAnalysisPage').then(m => ({ default: m.DSAnalysisPage })));
const DSAnalysisMobile = lazy(() => import('./components/DSAnalysisMobile').then(m => ({ default: m.DSAnalysisMobile })));

// Detect mobile/touch once at module level — stable across renders
const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

type View = 'home' | 'ds-analysis';

function Footer() {
  return (
    <footer
      id="about"
      style={{
        background: '#f5f5f7',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        padding: '48px clamp(16px, 5vw, 80px)',
      }}
    >
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '12px',
      }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Aswath AS · The Analyst
          </div>
          <div style={{ fontSize: '12px', color: '#6e6e73', letterSpacing: '-0.12px' }}>
            Semester Exam Intelligence · 6 Subjects
          </div>
        </div>
        <span style={{ fontSize: '12px', color: '#6e6e73', letterSpacing: '-0.12px' }}>
          21CSS303T · 2025
        </span>
      </div>
    </footer>
  );
}

function App() {
  const [view, setView] = useState<View>('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  return (
    <>
      {/* Base layer: true black behind the hero video */}
      <div style={{ position: 'fixed', inset: 0, background: '#000000', zIndex: 0, pointerEvents: 'none' }} />
      <Analytics />
      <Cursor />
      <PWAPrompt />
      <AnimatePresence mode="wait">
        {view === 'ds-analysis' ? (
          <motion.div
            key="ds-analysis"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', zIndex: 2 }}
          >
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#1d1d1f' }} />}>
              {isMobile
                ? <DSAnalysisMobile onBack={() => setView('home')} />
                : <DSAnalysisPage onBack={() => setView('home')} />
              }
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', zIndex: 2 }}
          >
            <Hero onViewAnalysis={() => setView('ds-analysis')} />
            <SubjectGrid onViewAnalysis={() => setView('ds-analysis')} />
            <StoicSection />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
