"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { SessionProvider } from "next-auth/react";
import type { Locale } from "@/i18n/messages";
import { messages } from "@/i18n/messages";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof messages)[Locale];
};

const I18nContext = createContext<I18nContextValue | null>(null);
const LOCALE_KEY = "cppfc-locale";
const LOCALE_EVENT = "cppfc-locale-change";

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorage = () => callback();
  const onLocaleEvent = () => callback();

  window.addEventListener("storage", onStorage);
  window.addEventListener(LOCALE_EVENT, onLocaleEvent);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LOCALE_EVENT, onLocaleEvent);
  };
};

const getClientSnapshot = (): Locale => {
  if (typeof window === "undefined") {
    return "en";
  }
  const saved = localStorage.getItem(LOCALE_KEY);
  return saved === "es" || saved === "en" ? saved : "en";
};

const getServerSnapshot = (): Locale => "en";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const setLocale = (value: Locale) => {
    localStorage.setItem(LOCALE_KEY, value);
    window.dispatchEvent(new Event(LOCALE_EVENT));
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: messages[locale],
    }),
    [locale],
  );

  return (
    <SessionProvider>
      <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    </SessionProvider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
