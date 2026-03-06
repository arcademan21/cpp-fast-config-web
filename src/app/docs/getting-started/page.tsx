"use client";

import { CommandBlock } from "@/components/command-block";
import { useI18n } from "@/components/i18n-provider";

const quickInstall = `1) Open the access portal\n2) Register or login\n3) Request approval if your account is pending`;
const manualInstall = `1) Open your dashboard\n2) Go to API Keys\n3) Create and copy your key\n4) Keep the key private`;
const authenticatedInstall = `curl -fsSL <INSTALLER_URL> | sh -s -- --key <YOUR_KEY>`;

export default function GettingStartedPage() {
  const { t } = useI18n();

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t.gettingStarted.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          {t.gettingStarted.subtitle}
        </p>
      </header>

      <section id="quick-install" className="space-y-3 scroll-mt-24">
        <h2 className="text-xl font-semibold">
          {t.gettingStarted.quickInstall}
        </h2>
        <CommandBlock code={quickInstall} title={t.gettingStarted.bootstrap} />
      </section>

      <section id="manual-install" className="space-y-3 scroll-mt-24">
        <h2 className="text-xl font-semibold">
          {t.gettingStarted.manualInstall}
        </h2>
        <CommandBlock
          code={manualInstall}
          title={t.gettingStarted.manualInstallTitle}
        />
      </section>

      <section id="shell-reload" className="space-y-3 scroll-mt-24">
        <h2 className="text-xl font-semibold">
          {t.gettingStarted.shellReload}
        </h2>
        <CommandBlock code={authenticatedInstall} title="Installer" />
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t.gettingStarted.shellReloadBody}
        </p>
      </section>
    </article>
  );
}
