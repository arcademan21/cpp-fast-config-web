"use client";

import { CommandBlock } from "@/components/command-block";
import { useI18n } from "@/components/i18n-provider";

const examples = `cpp init my-app\ncpp configure\ncpp build\ncpp test\ncpp all\ncpp run\ncpp run --explain\ncpp run --verbose\ncpp targets\ncpp doctor`;

export default function CliPage() {
  const { t } = useI18n();

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t.cli.title}</h1>
        <p className="text-slate-600 dark:text-slate-300">{t.cli.subtitle}</p>
      </header>

      <section id="commands" className="scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold">{t.cli.commands}</h2>
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-2 font-semibold">{t.cli.command}</th>
                <th className="px-4 py-2 font-semibold">{t.cli.description}</th>
              </tr>
            </thead>
            <tbody>
              {t.cli.rows.map(([command, description]) => (
                <tr
                  key={command}
                  className="border-t border-slate-200 dark:border-slate-800"
                >
                  <td className="px-4 py-2 font-mono text-xs">cpp {command}</td>
                  <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                    {description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="examples" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold">{t.cli.examples}</h2>
        <CommandBlock code={examples} title={t.cli.examplesTitle} />
      </section>
    </article>
  );
}
