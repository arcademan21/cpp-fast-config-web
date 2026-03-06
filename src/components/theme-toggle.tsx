"use client";

import { useEffect, useState } from "react";
import { useI18n } from "./i18n-provider";

const THEME_KEY = "cppfc-theme";

const applyThemeToDocument = (theme: "light" | "dark") => {
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const saved = window.localStorage.getItem(THEME_KEY);
    return saved === "light" || saved === "dark" ? saved : "dark";
  });
  const { t } = useI18n();

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    applyThemeToDocument(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 items-center rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
      aria-label={t.common.theme}
    >
      {theme === "dark" ? t.common.light : t.common.dark}
    </button>
  );
}
