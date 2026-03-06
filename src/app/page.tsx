"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { CommandBlock } from "@/components/command-block";
import { SiteFooter } from "@/components/footer";
import { HomeInstallerCommandCard } from "@/components/home-installer-command-card";
import {
  InstallerFlowTerminal,
  type InstallerFlow,
} from "@/components/installer-flow-terminal";
import { useI18n } from "@/components/i18n-provider";
import { SiteHeader } from "@/components/site-header";
import { SnippetTabs } from "@/components/snippet-tabs";

const heroFlow = `cpp init my-app\ncd my-app\ncpp all\ncpp run`;

export default function Home() {
  const { t, locale } = useI18n();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const flowButtons =
    locale === "es"
      ? {
          fastest: "Más rápido",
          wizardVsCode: "VS Code",
          wizardTerminal: "Terminal",
          quickstart: "Quickstart sin scaffold",
          terminalTitle: "ASÍ SE SIENTE",
        }
      : {
          fastest: "Fastest",
          wizardVsCode: "VS Code",
          wizardTerminal: "Terminal",
          quickstart: "Quickstart no scaffold",
          terminalTitle: "THIS IS HOW IT FEELS",
        };

  const flowProject = "my-app";
  const installerFlows: InstallerFlow[] = [
    {
      id: "fastest",
      label: flowButtons.fastest,
      steps: [
        {
          kind: "system",
          text: "=============================================",
        },
        { kind: "system", text: "  Cpp Fast Config v1.0.0" },
        {
          kind: "system",
          text: "=============================================",
        },
        {
          kind: "system",
          text: "Will you use VS Code for this project? [Y/n] ",
        },
        { kind: "input", text: "n", appendToPrevious: true },
        {
          kind: "system",
          text: "Create a new CMake project scaffold now? [y/N] ",
        },
        { kind: "input", text: "n", appendToPrevious: true },
        { kind: "system", text: "" },
        { kind: "system", text: "Now you can use:" },
        { kind: "system", text: "  cpp run or cpp all" },
        { kind: "system", text: "" },
        { kind: "system", text: "Setup complete." },
        { kind: "system", text: "" },
        { kind: "command", text: "cpp run", delayBefore: 700 },
        { kind: "system", text: "Hello, World", delayBefore: 500 },
      ],
    },
    {
      id: "wizard-vscode",
      label: flowButtons.wizardVsCode,
      steps: [
        {
          kind: "system",
          text: "=============================================",
        },
        { kind: "system", text: "  Cpp Fast Config v1.0.0" },
        {
          kind: "system",
          text: "=============================================",
        },
        {
          kind: "system",
          text: "Will you use VS Code for this project? [Y/n] ",
        },
        { kind: "input", text: "y", appendToPrevious: true },
        {
          kind: "system",
          text: "Install recommended VS Code extensions now? [Y/n] ",
        },
        { kind: "input", text: "y", appendToPrevious: true },
        {
          kind: "system",
          text: "Installing: emeraldwalk.RunOnSave",
        },
        {
          kind: "system",
          text: "Installing: vadimcn.vscode-lldb",
        },
        { kind: "system", text: "Extension setup complete." },
        {
          kind: "system",
          text: "Create a new CMake project scaffold now? [y/N] ",
        },
        { kind: "input", text: "y", appendToPrevious: true },
        { kind: "system", text: "Project name: " },
        { kind: "input", text: "my-app", appendToPrevious: true },
        {
          kind: "system",
          text: "Use ultra-minimal scaffold (src/main.cpp only)? [y/N] ",
        },
        { kind: "input", text: "y", appendToPrevious: true },
        {
          kind: "system",
          text: "Hide generated/tooling files in VS Code Explorer for this new project? [y/N] ",
        },
        { kind: "input", text: "y", appendToPrevious: true },
        { kind: "system", text: "" },
        { kind: "system", text: "Next steps:" },
        { kind: "system", text: `  cd ${flowProject}` },
        { kind: "system", text: "  code . or run your VS Code app" },
        {
          kind: "system",
          text: "  cpp run or cpp all on the integrated VS Code terminal",
        },
        { kind: "system", text: "" },
        { kind: "system", text: "Setup complete." },
        { kind: "system", text: "" },
        { kind: "command", text: "code .", delayBefore: 700 },
      ],
    },
    {
      id: "wizard-terminal",
      label: flowButtons.wizardTerminal,
      steps: [
        {
          kind: "system",
          text: "=============================================",
        },
        { kind: "system", text: "  Cpp Fast Config v1.0.0" },
        {
          kind: "system",
          text: "=============================================",
        },
        {
          kind: "system",
          text: "Will you use VS Code for this project? [y/n] ",
        },
        { kind: "input", text: "n", appendToPrevious: true },
        {
          kind: "system",
          text: "Create a new CMake project scaffold now? [y/n] ",
        },
        { kind: "input", text: "y", appendToPrevious: true },
        { kind: "system", text: "Project name: " },
        { kind: "input", text: "my-app", appendToPrevious: true },
        {
          kind: "system",
          text: "Use ultra-minimal scaffold (src/main.cpp only)? [y/n] ",
        },
        { kind: "input", text: "y", appendToPrevious: true },
        { kind: "system", text: "" },
        { kind: "system", text: "Next steps:" },
        { kind: "system", text: `  cd ${flowProject}` },
        { kind: "system", text: "  cpp run or cpp all" },
        { kind: "system", text: "" },
        { kind: "system", text: "Setup complete." },
        { kind: "system", text: "" },
        { kind: "command", text: "cd my-app", delayBefore: 700 },
        { kind: "command", text: "cpp run", delayBefore: 700 },
        { kind: "system", text: "...", delayBefore: 500 },
        { kind: "system", text: "...", delayBefore: 500 },
        { kind: "system", text: "Hello, World", delayBefore: 500 },
      ],
    },
    {
      id: "quickstart",
      label: flowButtons.quickstart,
      steps: [
        {
          kind: "system",
          text: "=============================================",
        },
        { kind: "system", text: "  Cpp Fast Config v1.0.0" },
        {
          kind: "system",
          text: "=============================================",
        },
        {
          kind: "system",
          text: "Will you use VS Code for this project? [y/n] ",
        },
        { kind: "input", text: "y", appendToPrevious: true },
        {
          kind: "system",
          text: "Install recommended VS Code extensions now? [y/n] ",
        },
        { kind: "input", text: "n", appendToPrevious: true },
        {
          kind: "system",
          text: "Create a new CMake project scaffold now? [y/n] ",
        },
        { kind: "input", text: "n", appendToPrevious: true },
        { kind: "system", text: "" },
        { kind: "system", text: "Now you can use:" },
        { kind: "system", text: "  cpp run or cpp all" },
        { kind: "system", text: "" },
        { kind: "system", text: "Setup complete." },
        { kind: "system", text: "" },
        { kind: "command", text: "cpp run", delayBefore: 700 },
        { kind: "system", text: "...", delayBefore: 500 },
        { kind: "system", text: "...", delayBefore: 500 },
        { kind: "system", text: "Hello, World", delayBefore: 500 },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-clip bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-45 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.24)_1px,transparent_0)] bg-size-[24px_24px] dark:opacity-30 dark:bg-[radial-gradient(circle_at_1px_1px,rgba(71,85,105,0.35)_1px,transparent_0)]"
      />
      <SiteHeader />
      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="min-w-0 space-y-6">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-slate-300 px-3 py-1 dark:border-slate-700">
                v1.0.0
              </span>
              <span className="rounded-full border border-slate-300 px-3 py-1 dark:border-slate-700">
                macOS/Linux/Windows
              </span>
              <span className="rounded-full border border-slate-300 px-3 py-1 dark:border-slate-700">
                CMake + VS Code
              </span>
            </div>
            <h1 className="wrap-break-word text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t.landing.heroTitle}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {t.landing.heroSubtitle}
            </p>
            {isAuthenticated ? (
              <HomeInstallerCommandCard />
            ) : (
              <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {t.landing.quickInstall}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {t.landing.accessDescription}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/access"
                    className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                  >
                    {t.common.getStarted}
                  </Link>
                  <Link
                    href="/docs"
                    className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                  >
                    {t.common.viewDocs}
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="min-w-0 space-y-4">
            <InstallerFlowTerminal
              title={flowButtons.terminalTitle}
              flows={installerFlows}
            />
            <CommandBlock
              code={heroFlow}
              title={t.landing.quickWorkflow}
              showCopy={false}
            />
            <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t.landing.workflowDescription}
              </p>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl font-bold">{t.landing.whyTitle}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {t.landing.whyCards.map((item) => (
              <article
                key={item}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {item}
                </p>
              </article>
            ))}
          </div>
        </section>
        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">{t.landing.featuresTitle}</h2>
          <ul className="mt-6 space-y-3">
            {t.landing.featureItems.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-slate-200 px-4 py-3 text-sm dark:border-slate-800"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section
          id="examples"
          className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl font-bold">{t.landing.examplesTitle}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {t.landing.examplesSubtitle}
          </p>
          <div className="mt-6">
            <SnippetTabs />
          </div>
        </section>

        <section
          id="docs"
          className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl font-bold">{t.landing.docsPreviewTitle}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
              <h3 className="text-base font-semibold">
                {t.landing.docsCard1Title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {t.landing.docsCard1Body}
              </p>
              <Link
                href="/docs/getting-started"
                className="mt-3 inline-block text-sm font-semibold underline"
              >
                {t.common.readDocumentation}
              </Link>
            </article>
            <article className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
              <h3 className="text-base font-semibold">
                {t.landing.docsCard2Title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {t.landing.docsCard2Body}
              </p>
              <Link
                href="/docs/cli"
                className="mt-3 inline-block text-sm font-semibold underline"
              >
                {t.landing.docsCard2Cta}
              </Link>
            </article>
          </div>
        </section>

        <section
          id="ci"
          className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl font-bold">CI</h2>
          <div className="mt-4 rounded-xl border border-slate-200 p-5 dark:border-slate-800">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {t.landing.ciBody}
            </p>
          </div>
        </section>

        <section
          id="license"
          className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl font-bold">License</h2>
          <div className="mt-4 rounded-xl border border-slate-200 p-5 dark:border-slate-800">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {t.landing.licenseBody}
            </p>
            <Link
              href="/docs/license"
              className="mt-3 inline-block text-sm font-semibold underline"
            >
              {t.landing.licenseCta}
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
            <h2 className="text-2xl font-bold">{t.landing.startNow}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {t.landing.startNowBody}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/access"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
              >
                {t.common.getStarted}
              </Link>
              <Link
                href="/access"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700"
              >
                {t.header.access}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
