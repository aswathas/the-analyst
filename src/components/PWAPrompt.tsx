import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAPrompt() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Only on touch devices
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    // Already installed as standalone
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    // Already dismissed this session
    if (sessionStorage.getItem('pwa-dismissed')) return;

    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    if (ios) {
      const t = setTimeout(() => setShow(true), 4000);
      return () => clearTimeout(t);
    }

    // Android / Chrome — capture the native prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 4000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem('pwa-dismissed', '1');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          style={{
            position: 'fixed',
            bottom: 0, left: 0, right: 0,
            zIndex: 9000,
            padding: '12px 12px',
            paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
            pointerEvents: 'auto',
          }}
        >
          <div style={{
            background: 'rgba(18,18,20,0.97)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 -4px 40px rgba(0,0,0,0.6)',
          }}>

            {/* App icon */}
            <img
              src="/favicon.svg"
              alt="Analyst"
              style={{ width: 46, height: 46, borderRadius: '12px', flexShrink: 0, background: '#1a0a0a', padding: '4px' }}
            />

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>
                Install Analyst
              </div>
              {isIOS ? (
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.45, marginTop: '2px' }}>
                  Tap <Share2 size={11} style={{ display: 'inline', verticalAlign: 'middle', marginInline: '2px' }} />
                  {' '}then "Add to Home Screen"
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.45, marginTop: '2px' }}>
                  Works offline · No app store needed
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
              {!isIOS && (
                <button
                  onClick={handleInstall}
                  style={{
                    background: 'rgba(41,151,255,0.9)',
                    border: '1px solid rgba(41,151,255,0.5)',
                    color: '#fff', borderRadius: '100px',
                    padding: '8px 16px',
                    fontSize: '13px', fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '5px',
                  }}
                >
                  <Download size={13} strokeWidth={2} />
                  Add
                </button>
              )}
              <button
                onClick={dismiss}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none', color: 'rgba(255,255,255,0.5)',
                  borderRadius: '100px', padding: '8px 10px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                }}
              >
                <X size={15} strokeWidth={2} />
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
