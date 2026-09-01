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
      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
    >
      <span className="leading-none text-[11px]">{lang === 'id' ? 'ID' : 'EN'}</span>
    </button>
  );
}
