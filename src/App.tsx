import { lazy, Suspense, useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { motion } from 'framer-motion';
import { Cursor } from './components/Cursor';
import { Hero } from './components/Hero';
import { StoicSection } from './components/StoicSection';
import { SubjectGrid } from './components/SubjectGrid';
import { PWAPrompt } from './components/PWAPrompt';
import SplashCursor from './components/SplashCursor';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, useParams } from 'react-router';
import { Sun, Moon } from 'lucide-react';
import { SubjectAnalysis } from './components/subject/SubjectAnalysis';
import { SubjectMasterSheet } from './components/subject/SubjectMasterSheet';
import { getSubject } from './components/subject/registry';

// Lazy-load heavy components — deferred until needed
const DSAnalysisPage = lazy(() => import('./components/DSAnalysisPage').then(m => ({ default: m.DSAnalysisPage })));
const DSAnalysisMobile = lazy(() => import('./components/DSAnalysisMobile').then(m => ({ default: m.DSAnalysisMobile })));
const PYQMasterSheet = lazy(() => import('./components/PYQMasterSheet').then(m => ({ default: m.PYQMasterSheet })));
const ADCAnalysisPage = lazy(() => import('./components/ADCAnalysisPage').then(m => ({ default: m.ADCAnalysisPage })));
const ADCAnalysisMobile = lazy(() => import('./components/ADCAnalysisMobile').then(m => ({ default: m.ADCAnalysisMobile })));
const ADCMasterSheet = lazy(() => import('./components/ADCMasterSheet').then(m => ({ default: m.default })));
const CCBFAnalysisPage = lazy(() => import('./components/CCBFAnalysisPage').then(m => ({ default: m.CCBFAnalysisPage })));
const CCBFMasterSheet = lazy(() => import('./components/CCBFMasterSheet').then(m => ({ default: m.default })));
const SEPMAnalysisPage = lazy(() => import('./components/SEPMAnalysisPage').then(m => ({ default: m.SEPMAnalysisPage })));
const CDAnalysisPage = lazy(() => import('./components/CDAnalysisPage').then(m => ({ default: m.CDAnalysisPage })));
const CDAnalysisMobile = lazy(() => import('./components/CDAnalysisMobile').then(m => ({ default: m.CDAnalysisMobile })));
const CDMasterSheet = lazy(() => import('./components/CDMasterSheet').then(m => ({ default: m.default })));
const CryptoAnalysisPage = lazy(() => import('./components/CryptoAnalysisPage').then(m => ({ default: m.CryptoAnalysisPage })));
const CryptoExamAnalysis = lazy(() => import('./components/CryptoExamAnalysis').then(m => ({ default: m.CryptoExamAnalysis })));
const CryptoFlashCards = lazy(() => import('./components/CryptoFlashCards').then(m => ({ default: m.CryptoFlashCards })));
const CryptoLearnMode = lazy(() => import('./components/CryptoLearnMode').then(m => ({ default: m.CryptoLearnMode })));

// Detect mobile/touch once at module level — stable across renders
const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

function Footer() {
  return (
    <footer
      id="about"
      style={{
        background: 'var(--bg-grid)',
        borderTop: '1px solid var(--border-card)',
        padding: '48px clamp(16px, 5vw, 80px)',
      }}
    >
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '12px',
      }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Aswath AS · The Analyst
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '-0.12px' }}>
            Semester Exam Intelligence · 6 Subjects
          </div>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '-0.12px' }}>
          21CSS303T · 2025
        </span>
      </div>
    </footer>
  );
}

const CURSOR_THEMES = [
  { name: 'Burning Red', color: '#f53636', densityDissipation: 1, velocityDissipation: 2, pressure: 0.2, curl: 50, splatForce: 5500, colorUpdateSpeed: 10, rainbow: false },
  { name: 'Ice Blue', color: '#00d4ff', densityDissipation: 1, velocityDissipation: 2, pressure: 0.12, curl: 20, splatForce: 5000, colorUpdateSpeed: 7, rainbow: false },
  { name: 'Ghost White', color: '#e0e0e0', densityDissipation: 4, velocityDissipation: 0.5, pressure: 0.1, curl: 30, splatForce: 4000, colorUpdateSpeed: 3, rainbow: true },
  { name: 'Sun Yellow', color: '#FF6B00', densityDissipation: 0.8, velocityDissipation: 0.4, pressure: 0.04, curl: 10, splatForce: 3000, colorUpdateSpeed: 4, rainbow: false },
  { name: 'Shadow Monarch', color: '#6d28d9', densityDissipation: 1.5, velocityDissipation: 1, pressure: 0.15, curl: 40, splatForce: 6000, colorUpdateSpeed: 8, rainbow: false },
  { name: 'Winter Frost', color: '#ffe8e8', densityDissipation: 4, velocityDissipation: 10, pressure: 0.2, curl: 39, splatRadius: 0.21, splatForce: 20000, colorUpdateSpeed: 1, rainbow: false, colors: ['#152232', '#253c2c', '#7d9c72', '#c2d9df', '#e5e6e1'] },
  { name: 'Emerald Tide', color: '#34d399', densityDissipation: 2.4, velocityDissipation: 1.2, pressure: 0.14, curl: 26, splatForce: 6500, colorUpdateSpeed: 6, rainbow: false },
  { name: 'Rose Quartz', color: '#fb7185', densityDissipation: 1.6, velocityDissipation: 1.1, pressure: 0.16, curl: 34, splatForce: 5800, colorUpdateSpeed: 5, rainbow: false },
];

function FloatingControls({ isDark, setIsDark, themeIndex, setThemeIndex, paletteOpen, setPaletteOpen, cursorOff, setCursorOff }: {
  isDark: boolean; setIsDark: (v: boolean) => void;
  themeIndex: number; setThemeIndex: (v: number) => void;
  paletteOpen: boolean; setPaletteOpen: (v: boolean) => void;
  cursorOff: boolean; setCursorOff: (v: boolean) => void;
}) {
  const theme = CURSOR_THEMES[themeIndex];
  return (
    <>
      {/* Theme toggle button — below palette */}
      <button
        onClick={() => setIsDark(!isDark)}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        style={{
          position: 'fixed', bottom: 24, right: 78, zIndex: 100,
          width: 38, height: 38, borderRadius: '50%', cursor: 'pointer',
          background: 'var(--btn-master-bg)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid var(--btn-master-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease', color: 'var(--btn-master-text)',
          padding: 0,
        }}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      {/* Cursor theme palette */}
      <div
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100 }}
        onMouseEnter={() => setPaletteOpen(true)}
        onMouseLeave={() => setPaletteOpen(false)}
      >
        {/* Fan-out options */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center',
          marginBottom: paletteOpen ? 10 : 0,
          opacity: paletteOpen ? 1 : 0,
          transform: paletteOpen ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 0.25s ease',
          pointerEvents: paletteOpen ? 'auto' : 'none',
        }}>
          {CURSOR_THEMES.map((t, i) => {
            const isActive = !cursorOff && themeIndex === i;
            return (
              <button
                key={t.name}
                onClick={(e) => { e.stopPropagation(); setThemeIndex(i); setCursorOff(false); }}
                title={t.name}
                style={{
                  width: 34, height: 34, borderRadius: '50%', cursor: 'pointer',
                  border: isActive ? '2.5px solid var(--text-primary)' : '2px solid var(--border-strong)',
                  background: t.color,
                  boxShadow: isActive ? `0 0 16px ${t.color}` : '0 2px 6px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s ease',
                  animation: isActive ? `pulse-glow 1.5s ease-in-out infinite` : 'none',
                  position: 'relative',
                }}
              >
                {isActive && (
                  <>
                    <span style={{
                      position: 'absolute', inset: -4, borderRadius: '50%',
                      border: `1.5px solid ${t.color}`,
                      animation: 'ripple-out 2s ease-out infinite',
                    }} />
                    <span style={{
                      position: 'absolute', inset: -4, borderRadius: '50%',
                      border: `1px solid ${t.color}`,
                      animation: 'ripple-out 2s ease-out 0.7s infinite',
                    }} />
                  </>
                )}
              </button>
            );
          })}
          {/* OFF button */}
          <button
            onClick={(e) => { e.stopPropagation(); setCursorOff(true); }}
            title="Turn off cursor effect"
            style={{
              width: 34, height: 34, borderRadius: '50%', cursor: 'pointer',
              border: cursorOff ? '2.5px solid var(--text-primary)' : '2px solid var(--border-strong)',
              background: cursorOff ? 'var(--bg-elevated)' : 'var(--btn-master-bg)',
              boxShadow: cursorOff ? '0 0 10px var(--btn-master-border)' : '0 2px 6px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span style={{
              fontSize: 14, fontWeight: 700, color: cursorOff ? 'var(--text-muted)' : 'var(--text-secondary)',
              fontFamily: "'JetBrains Mono', monospace", lineHeight: 1,
            }}>/</span>
          </button>
        </div>
        {/* Main palette button */}
        <div style={{
          width: 46, height: 46, borderRadius: '50%', cursor: 'pointer',
          background: cursorOff ? 'var(--btn-master-bg)' : 'var(--btn-master-bg)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${cursorOff ? 'var(--border-card)' : 'var(--btn-master-border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: cursorOff ? 'none' : `0 0 18px ${theme.color}30`,
          transition: 'all 0.2s ease',
          position: 'relative',
        }}>
          {cursorOff ? (
            <span style={{ fontSize: 18, color: 'var(--text-muted)', opacity: 0.5 }}>·</span>
          ) : (
            <img
              src="/palette-icon.png"
              alt=""
              style={{
                width: 28, height: 28, borderRadius: '50%',
                objectFit: 'cover',
                filter: `drop-shadow(0 0 6px ${theme.color}80)`,
              }}
            />
          )}
          <div style={{ position: 'absolute', top: 4, right: 6, width: 5, height: 5, borderRadius: '50%', background: '#e0e0e0', opacity: 0.7 }} />
          <div style={{ position: 'absolute', top: 4, right: 14, width: 4, height: 4, borderRadius: '50%', background: '#7d9c72', opacity: 0.7 }} />
          <div style={{ position: 'absolute', bottom: 6, right: 6, width: 4, height: 4, borderRadius: '50%', background: '#152232', opacity: 0.7 }} />
        </div>
      </div>
      {/* CSS animations */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes ripple-out {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </>
  );
}

function Home() {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Hero
        onViewAnalysis={() => window.location.href = '/subject/21CSE435T'}
        onOpenSubject={(code) => { window.location.href = `/subject/${code}`; }}
      />
      <SubjectGrid />
      <StoicSection />
      <Footer />
    </div>
  );
}

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved !== 'light';
  });
  const [themeIndex, setThemeIndex] = useState(2);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [cursorOff, setCursorOff] = useState(false);

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    const meta = document.getElementById('theme-color-meta');
    if (meta) meta.setAttribute('content', isDark ? '#0a0a0a' : '#f7f8fc');
  }, [isDark]);

  return (
    <BrowserRouter>
      <AppShell
        isDark={isDark}
        setIsDark={setIsDark}
        themeIndex={themeIndex}
        setThemeIndex={setThemeIndex}
        paletteOpen={paletteOpen}
        setPaletteOpen={setPaletteOpen}
        cursorOff={cursorOff}
        setCursorOff={setCursorOff}
      />
    </BrowserRouter>
  );
}

function AppShell({
  isDark,
  setIsDark,
  themeIndex,
  setThemeIndex,
  paletteOpen,
  setPaletteOpen,
  cursorOff,
  setCursorOff,
}: {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  themeIndex: number;
  setThemeIndex: (v: number) => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  cursorOff: boolean;
  setCursorOff: (v: boolean) => void;
}) {
  const theme = CURSOR_THEMES[themeIndex];
  const location = useLocation();
  const showHomeCursor = location.pathname === '/';

  return (
    <>
      <Analytics />
      <Cursor />
      <PWAPrompt />
      {!cursorOff && showHomeCursor && (
        <SplashCursor
          key={themeIndex}
          DENSITY_DISSIPATION={theme.densityDissipation}
          VELOCITY_DISSIPATION={theme.velocityDissipation}
          PRESSURE={theme.pressure}
          CURL={theme.curl}
          SPLAT_RADIUS={theme.splatRadius || 0.43}
          SPLAT_FORCE={theme.splatForce}
          COLOR_UPDATE_SPEED={theme.colorUpdateSpeed}
          SHADING
          RAINBOW_MODE={theme.rainbow}
          COLOR={theme.color}
          COLORS={theme.colors}
        />
      )}
      <FloatingControls
        isDark={isDark} setIsDark={setIsDark}
        themeIndex={themeIndex} setThemeIndex={setThemeIndex}
        paletteOpen={paletteOpen} setPaletteOpen={setPaletteOpen}
        cursorOff={cursorOff} setCursorOff={setCursorOff}
      />
      <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-body)' }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ds-analysis" element={<DSAnalysisPageWrapper />} />
          <Route path="/pyq-master" element={<PYQMasterSheetWrapper />} />
          <Route path="/adc-analysis" element={<ADCAnalysisPageWrapper />} />
          <Route path="/adc-master" element={<ADCMasterSheetWrapper />} />
          <Route path="/ccbf-analysis" element={<CCBFAnalysisPageWrapper />} />
          <Route path="/ccbf-master" element={<CCBFMasterSheetWrapper />} />
          <Route path="/sepm-analysis" element={<SEPMAnalysisPageWrapper />} />
          <Route path="/cd-analysis" element={<CDAnalysisPageWrapper />} />
          <Route path="/cd-master" element={<CDMasterSheetWrapper />} />
          <Route path="/crypto-analysis" element={<CryptoAnalysisPageWrapper />} />
          <Route path="/crypto-exam" element={<CryptoExamAnalysisWrapper />} />
          <Route path="/crypto-flash" element={<CryptoFlashCardsWrapper />} />
          <Route path="/crypto-learn" element={<CryptoLearnModeWrapper />} />
          <Route path="/subject/:code" element={<SubjectAnalysisWrapper />} />
          <Route path="/subject/:code/master" element={<SubjectMasterWrapper />} />
        </Routes>
      </Suspense>
    </>
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

function CCBFAnalysisPageWrapper() {
  const navigate = useNavigate();
  return (
    <motion.div
      key="ccbf-analysis"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', zIndex: 2 }}
    >
      <CCBFAnalysisPage onBack={() => navigate('/')} />
    </motion.div>
  );
}

function CCBFMasterSheetWrapper() {
  const navigate = useNavigate();
  return (
    <motion.div
      key="ccbf-master"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', zIndex: 2 }}
    >
      <CCBFMasterSheet onBack={() => navigate('/')} />
    </motion.div>
  );
}

function SEPMAnalysisPageWrapper() {
  const navigate = useNavigate();
  return (
    <motion.div
      key="sepm-analysis"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', zIndex: 2 }}
    >
      <SEPMAnalysisPage onBack={() => navigate('/')} />
    </motion.div>
  );
}

function CDAnalysisPageWrapper() {
  const navigate = useNavigate();
  return (
    <motion.div
      key="cd-analysis"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', zIndex: 2 }}
    >
      {isMobile
        ? <CDAnalysisMobile onBack={() => navigate('/')} />
        : <CDAnalysisPage onBack={() => navigate('/')} />
      }
    </motion.div>
  );
}

function CDMasterSheetWrapper() {
  const navigate = useNavigate();
  return (
    <motion.div
      key="cd-master"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', zIndex: 2 }}
    >
      <CDMasterSheet onBack={() => navigate('/')} />
    </motion.div>
  );
}

function CryptoAnalysisPageWrapper() {
  const navigate = useNavigate();
  return (
    <motion.div
      key="crypto-analysis"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', zIndex: 2 }}
    >
      <CryptoAnalysisPage onBack={() => navigate('/')} />
    </motion.div>
  );
}

function CryptoExamAnalysisWrapper() {
  const navigate = useNavigate();
  return (
    <motion.div
      key="crypto-exam"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', zIndex: 2 }}
    >
      <CryptoExamAnalysis onBack={() => navigate('/')} />
    </motion.div>
  );
}

function CryptoFlashCardsWrapper() {
  const navigate = useNavigate();
  return (
    <motion.div
      key="crypto-flash"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', zIndex: 2 }}
    >
      <CryptoFlashCards onBack={() => navigate('/')} />
    </motion.div>
  );
}

function CryptoLearnModeWrapper() {
  const navigate = useNavigate();
  return (
    <motion.div
      key="crypto-learn"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.22 } }}
      transition={{ duration: 0.42 }}
      style={{ position: 'relative', zIndex: 2 }}
    >
      <CryptoLearnMode onBack={() => navigate('/')} />
    </motion.div>
  );
}

function SubjectAnalysisWrapper() {
  const { code } = useParams();
  const navigate = useNavigate();
  const spec = code ? getSubject(code) : undefined;

  if (!spec) {
    return (
      <div data-testid="subject-not-found" style={{ padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
          Subject not found
        </h2>
        <p style={{ color: 'var(--text-secondary)', margin: '0 0 20px' }}>
          No subject with code <strong>{code}</strong> is published yet.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{ padding: '10px 18px', borderRadius: '9999px', border: '1px solid var(--border-strong)', background: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          Back to subjects
        </button>
      </div>
    );
  }

  return (
    <motion.div
      key={`subject-${spec.code}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', zIndex: 2 }}
    >
      <SubjectAnalysis spec={spec} onBack={() => navigate('/')} />
    </motion.div>
  );
}

function SubjectMasterWrapper() {
  const { code } = useParams();
  const navigate = useNavigate();
  const spec = code ? getSubject(code) : undefined;

  if (!spec) {
    return (
      <div data-testid="subject-not-found" style={{ padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
          Subject not found
        </h2>
        <button
          onClick={() => navigate('/')}
          style={{ padding: '10px 18px', borderRadius: '9999px', border: '1px solid var(--border-strong)', background: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          Back to subjects
        </button>
      </div>
    );
  }

  return (
    <motion.div
      key={`subject-master-${spec.code}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', zIndex: 2 }}
    >
      <SubjectMasterSheet spec={spec} onBack={() => navigate('/')} />
    </motion.div>
  );
}

export default App;
