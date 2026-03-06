"use client";

import { CommandBlock } from "@/components/command-block";
import { useI18n } from "@/components/i18n-provider";

const scaffoldExamples = `# full scaffold\ncpp init my-app\n\n# minimal scaffold\ncpp init --minimal my-app-min\n\n# terminal-only scaffold\ncpp init --no-vscode my-app-terminal`;

const adoptExamples = `cpp init --adopt\ncpp init --adopt --safe .\ncpp init --adopt --force .`;

export default function ScaffoldingPage() {
  const { t } = useI18n();

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t.scaffolding.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          {t.scaffolding.subtitle}
        </p>
      </header>

      <section id="full" className="scroll-mt-24 space-y-2">
        <h2 className="text-xl font-semibold">{t.scaffolding.fullTitle}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t.scaffolding.fullBody}
        </p>
      </section>

      <section id="minimal" className="scroll-mt-24 space-y-2">
        <h2 className="text-xl font-semibold">{t.scaffolding.minimalTitle}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t.scaffolding.minimalBody}
        </p>
      </section>

      <section id="no-vscode" className="scroll-mt-24 space-y-2">
        <h2 className="text-xl font-semibold">{t.scaffolding.noVscodeTitle}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t.scaffolding.noVscodeBody}
        </p>
      </section>

      <section id="examples" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold">{t.scaffolding.commandsTitle}</h2>
        <CommandBlock
          code={scaffoldExamples}
          title={t.scaffolding.commandsBlock}
        />
      </section>

      <section id="adopt" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold">{t.scaffolding.adoptTitle}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t.scaffolding.adoptBody}
        </p>
        <CommandBlock code={adoptExamples} title={t.scaffolding.adoptBlock} />
      </section>
    </article>
  );
}
