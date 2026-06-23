import { useTranslation } from '@/lib/i18n/use-translation';

export function LangToggle() {
  const { lang, setLang, t } = useTranslation();

  const toggle = () => {
    const next = lang === 'id' ? 'en' : 'id';
    setLang(next);
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('lang.switch')}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <span className="text-sm font-semibold leading-none">{lang === 'id' ? 'ID' : 'EN'}</span>
    </button>
  );
}
