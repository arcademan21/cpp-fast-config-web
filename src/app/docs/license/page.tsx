"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";

export default function LicensePage() {
  const { t } = useI18n();

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t.license.title}</h1>
        <p className="text-slate-600 dark:text-slate-300">
          {t.license.subtitle}
        </p>
      </header>

      <section id="non-commercial" className="scroll-mt-24 space-y-2">
        <h2 className="text-xl font-semibold">
          {t.license.nonCommercialTitle}
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {t.license.nonCommercialBody}
        </p>
      </section>

      <section id="commercial" className="scroll-mt-24 space-y-2">
        <h2 className="text-xl font-semibold">{t.license.commercialTitle}</h2>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {t.license.commercialBody}
        </p>
      </section>

      <section id="source-license" className="scroll-mt-24 space-y-2">
        <h2 className="text-xl font-semibold">{t.license.sourceTitle}</h2>
        <Link href="/access" className="text-sm font-semibold underline">
          {t.license.sourceLink}
        </Link>
      </section>
    </article>
  );
}
