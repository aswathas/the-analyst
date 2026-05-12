import { lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { motion } from 'framer-motion';
import { Cursor } from './components/Cursor';
import { Hero } from './components/Hero';
import { StoicSection } from './components/StoicSection';
import { SubjectGrid } from './components/SubjectGrid';
import { PWAPrompt } from './components/PWAPrompt';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router';

// Lazy-load heavy components — deferred until needed
const DSAnalysisPage = lazy(() => import('./components/DSAnalysisPage').then(m => ({ default: m.DSAnalysisPage })));
const DSAnalysisMobile = lazy(() => import('./components/DSAnalysisMobile').then(m => ({ default: m.DSAnalysisMobile })));
const PYQMasterSheet = lazy(() => import('./components/PYQMasterSheet').then(m => ({ default: m.PYQMasterSheet })));
const ADCAnalysisPage = lazy(() => import('./components/ADCAnalysisPage').then(m => ({ default: m.ADCAnalysisPage })));
const ADCAnalysisMobile = lazy(() => import('./components/ADCAnalysisMobile').then(m => ({ default: m.ADCAnalysisMobile })));
const ADCMasterSheet = lazy(() => import('./components/ADCMasterSheet').then(m => ({ default: m.default })));

// Detect mobile/touch once at module level — stable across renders
const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

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

function Home() {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Hero onViewAnalysis={() => window.location.href = '/ds-analysis'} />
      <SubjectGrid />
      <StoicSection />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Cursor />
      <PWAPrompt />
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#1d1d1f' }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ds-analysis" element={<DSAnalysisPageWrapper />} />
          <Route path="/pyq-master" element={<PYQMasterSheetWrapper />} />
          <Route path="/adc-analysis" element={<ADCAnalysisPageWrapper />} />
          <Route path="/adc-master" element={<ADCMasterSheetWrapper />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function DSAnalysisPageWrapper() {
  const navigate = useNavigate();
  return (
    <motion.div
      key="ds-analysis"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', zIndex: 2 }}
    >
      {isMobile
        ? <DSAnalysisMobile onBack={() => navigate('/')} />
        : <DSAnalysisPage onBack={() => navigate('/')} />
      }
    </motion.div>
  );
}

function PYQMasterSheetWrapper() {
  const navigate = useNavigate();
  return (
    <motion.div
      key="pyq-master"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', zIndex: 2 }}
    >
      <PYQMasterSheet onBack={() => navigate('/')} />
    </motion.div>
  );
}

function ADCAnalysisPageWrapper() {
  const navigate = useNavigate();
  return (
    <motion.div
      key="adc-analysis"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', zIndex: 2 }}
    >
      {isMobile
        ? <ADCAnalysisMobile onBack={() => navigate('/')} />
        : <ADCAnalysisPage onBack={() => navigate('/')} />
      }
    </motion.div>
  );
}

function ADCMasterSheetWrapper() {
  const navigate = useNavigate();
  return (
    <motion.div
      key="adc-master"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', zIndex: 2 }}
    >
      <ADCMasterSheet onBack={() => navigate('/')} />
    </motion.div>
  );
}

export default App;