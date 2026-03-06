"use client";

import Link from "next/link";
import { useI18n } from "./i18n-provider";

export function DocsSidebar() {
  const { t } = useI18n();

  const docsLinks = [
    { href: "/docs", label: t.docsSidebar.overview },
    { href: "/docs/getting-started", label: t.docsSidebar.gettingStarted },
    { href: "/docs/cli", label: t.docsSidebar.cli },
    { href: "/docs/scaffolding", label: t.docsSidebar.scaffolding },
    { href: "/docs/ci", label: t.docsSidebar.ci },
    { href: "/docs/license", label: t.docsSidebar.license },
  ];

  return (
    <aside className="top-20 h-fit rounded-xl border border-slate-200 p-4 dark:border-slate-800 lg:sticky">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {t.docsSidebar.title}
      </p>
      <nav className="space-y-1">
        {docsLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-md px-2 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
