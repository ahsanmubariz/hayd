import { useEffect, useState, useCallback } from 'react';
import { t, defaultLang, type Lang, type TranslationKey } from './translations';

const STORAGE_KEY = 'hayd-lang';
const COOKIE_KEY = 'hayd-lang';

function getCookieLang(): Lang | null {
  try {
    const match = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_KEY + '=([^;]*)'));
    if (match) {
      const val = match[1];
      if (val === 'id' || val === 'en') return val;
    }
  } catch {
    // cookies not available
  }
  return null;
}

function getStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'id' || stored === 'en') return stored;
  } catch {
    // localStorage not available
  }
  return defaultLang;
}

function persistLang(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // localStorage not available
  }
  try {
    document.cookie = `${COOKIE_KEY}=${lang};path=/;max-age=31536000`;
  } catch {
    // cookies not available
  }
}

// Global state for non-React usage (.astro files)
// Initialize from cookie (works on both server and client)
let currentLang: Lang = getCookieLang() ?? getStoredLang();
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function getLang(): Lang {
  return currentLang;
}

export function setLang(lang: Lang) {
  currentLang = lang;
  persistLang(lang);
  notifyListeners();
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(currentLang);

  useEffect(() => {
    // On mount, re-read from cookie in case server had a different value
    const cookieLang = getCookieLang();
    if (cookieLang && cookieLang !== currentLang) {
      currentLang = cookieLang;
      setLangState(cookieLang);
    }
    const handler = () => setLangState(currentLang);
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  const changeLang = useCallback((newLang: Lang) => {
    setLang(newLang);
  }, []);

  return { lang, setLang: changeLang };
}

export function useTranslation() {
  const { lang, setLang } = useLang();

  const translate = useCallback(
    (key: TranslationKey, ...args: (string | number)[]) => t(key, lang, ...args),
    [lang],
  );

  return { t: translate, lang, setLang };
}

// For use in .astro files (non-React)
export function translate(key: TranslationKey, ...args: (string | number)[]): string {
  return t(key, currentLang, ...args);
}
