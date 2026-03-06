"use client";

import Link from "next/link";
import { CommandBlock } from "@/components/command-block";
import { useI18n } from "@/components/i18n-provider";

export default function DocsOverviewPage() {
  const { t } = useI18n();

  const sections = [
    {
      title: t.docsSidebar.gettingStarted,
      href: "/docs/getting-started",
      description: t.docsOverview.cards.gettingStartedDesc,
    },
    {
      title: t.docsSidebar.cli,
      href: "/docs/cli",
      description: t.docsOverview.cards.cliDesc,
    },
    {
      title: t.docsSidebar.scaffolding,
      href: "/docs/scaffolding",
      description: t.docsOverview.cards.scaffoldingDesc,
    },
    {
      title: t.docsSidebar.ci,
      href: "/docs/ci",
      description: t.docsOverview.cards.ciDesc,
    },
    {
      title: t.docsSidebar.license,
      href: "/docs/license",
      description: t.docsOverview.cards.licenseDesc,
    },
  ];

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t.docsOverview.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          {t.docsOverview.subtitle}
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <a href="#guides" className="underline">
            {t.docsOverview.guides}
          </a>
          <a href="#how-to-run-locally" className="underline">
            {t.docsOverview.howToRunLocally}
          </a>
        </div>
      </header>
      <section id="guides" className="grid gap-4 scroll-mt-24 md:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
          >
            <h2 className="font-semibold">{section.title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {section.description}
            </p>
          </Link>
        ))}
      </section>
      <section id="how-to-run-locally" className="space-y-3 scroll-mt-24">
        <h2 className="text-xl font-semibold">
          {t.docsOverview.howToRunLocally}
        </h2>
        <CommandBlock
          title={t.docsOverview.localTitle}
          code={`pnpm install\npnpm dev\n# open http://localhost:3000`}
        />
      </section>
    </article>
  );
}
