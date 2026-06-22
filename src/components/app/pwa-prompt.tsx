import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/use-translation';

export function PwaPrompt() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    // Already dismissed?
    if (localStorage.getItem('hayd-pwa-prompt-dismissed')) return;

    // Check if running as PWA (standalone mode)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator &&
        (window.navigator as unknown as Record<string, boolean>).standalone);
    if (isStandalone) return;

    // Detect mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
    if (!isMobile) return;

    setIsIOS(/iPhone|iPad|iPod/i.test(navigator.userAgent));

    // Android: listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // iOS: show prompt directly (no beforeinstallprompt support)
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      setVisible(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (
      deferredPrompt &&
      'prompt' in deferredPrompt &&
      typeof (deferredPrompt as { prompt?: () => Promise<void> }).prompt === 'function'
    ) {
      await (deferredPrompt as { prompt: () => Promise<void> }).prompt();
      const result = await (
        deferredPrompt as { userChoice?: Promise<{ outcome: string }> }
      ).userChoice;
      if (result?.outcome === 'accepted') {
        localStorage.setItem('hayd-pwa-prompt-dismissed', '1');
      }
    }
    setVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('hayd-pwa-prompt-dismissed', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4"
      onClick={handleDismiss}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" x2="12" y1="2" y2="15" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t('pwa.title')}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {isIOS ? t('pwa.ios_desc') : t('pwa.android_desc')}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            {t('pwa.later')}
          </button>
          {deferredPrompt && (
            <button
              type="button"
              onClick={handleInstall}
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t('pwa.install')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
