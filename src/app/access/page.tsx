"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";

export default function AccessPage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="space-y-5 rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight">
          {t.accessPortal.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          {t.accessPortal.subtitle}
        </p>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>{t.accessPortal.step1}</li>
          <li>{t.accessPortal.step2}</li>
          <li>{t.accessPortal.step3}</li>
        </ul>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t.accessPortal.note}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/login"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            {t.accessPortal.login}
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            {t.accessPortal.register}
          </Link>
          <Link
            href="/docs"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            {t.accessPortal.docs}
          </Link>
        </div>
      </section>
    </main>
  );
}
