"use client";

import type { Locale } from "@/i18n/messages";
import { useI18n } from "./i18n-provider";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  const options: Locale[] = ["en", "es"];

  return (
    <div className="inline-flex items-center rounded-md border border-slate-300 p-1 dark:border-slate-700">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          className={`rounded px-2 py-1 text-xs font-semibold uppercase transition ${
            locale === option
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
