"use client";

import { CommandBlock } from "@/components/command-block";
import { useI18n } from "@/components/i18n-provider";

const localCheck = `bash tests/e2e/run.sh`;

export default function CiPage() {
  const { t } = useI18n();

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t.ci.title}</h1>
        <p className="text-slate-600 dark:text-slate-300">{t.ci.subtitle}</p>
      </header>

      <section id="cmake-ci" className="scroll-mt-24 space-y-2">
        <h2 className="text-xl font-semibold">{t.ci.cmakeTitle}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t.ci.cmakeBody}
        </p>
      </section>

      <section id="e2e-matrix" className="scroll-mt-24 space-y-2">
        <h2 className="text-xl font-semibold">{t.ci.matrixTitle}</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          {t.ci.matrixItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="run-locally" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold">{t.ci.runLocally}</h2>
        <CommandBlock code={localCheck} title={t.ci.runLocallyBlock} />
      </section>
    </article>
  );
}
