"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";

type DashboardOverviewProps = {
  email?: string | null;
};

export function DashboardOverview({ email }: DashboardOverviewProps) {
  const { t } = useI18n();

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
      <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.title}</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {t.dashboard.signedInAs} <span className="font-semibold">{email}</span>
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/api-keys"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          {t.dashboard.manageApiKeys}
        </Link>
        <Link
          href="/docs/getting-started"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          {t.dashboard.installationGuide}
        </Link>
      </div>
    </section>
  );
}
