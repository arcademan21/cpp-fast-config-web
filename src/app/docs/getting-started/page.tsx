"use client";

import { CommandBlock } from "@/components/command-block";
import { useI18n } from "@/components/i18n-provider";

const installerUrl =
  process.env.NEXT_PUBLIC_INSTALLER_URL ??
  "https://raw.githubusercontent.com/arcademan21/cpp-fast-config/main/install.sh";
const installerApiBaseUrl =
  process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL ??
  "https://cpp-fast-config-backend.vercel.app/api";
const installerVersion = process.env.NEXT_PUBLIC_INSTALLER_VERSION ?? "latest";

export default function GettingStartedPage() {
  const { t, locale } = useI18n();

  const authenticatedInstall =
    locale === "es"
      ? `tmp_cppfc_dir="$(mktemp -d)" && curl -fsSL ${installerUrl} | bash -s -- "$tmp_cppfc_dir" --key <TU_KEY> --api-base-url "${installerApiBaseUrl}" --version "${installerVersion}" && bash "$tmp_cppfc_dir/install.sh" "$PWD" --cleanup-source && rm -rf "$tmp_cppfc_dir"`
      : `tmp_cppfc_dir="$(mktemp -d)" && curl -fsSL ${installerUrl} | bash -s -- "$tmp_cppfc_dir" --key <YOUR_KEY> --api-base-url "${installerApiBaseUrl}" --version "${installerVersion}" && bash "$tmp_cppfc_dir/install.sh" "$PWD" --cleanup-source && rm -rf "$tmp_cppfc_dir"`;

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
        <CommandBlock
          code={t.gettingStarted.quickInstallSteps}
          title={t.gettingStarted.bootstrap}
        />
      </section>

      <section id="manual-install" className="space-y-3 scroll-mt-24">
        <h2 className="text-xl font-semibold">
          {t.gettingStarted.manualInstall}
        </h2>
        <CommandBlock
          code={t.gettingStarted.manualInstallSteps}
          title={t.gettingStarted.manualInstallTitle}
        />
      </section>

      <section id="shell-reload" className="space-y-3 scroll-mt-24">
        <h2 className="text-xl font-semibold">
          {t.gettingStarted.shellReload}
        </h2>
        <CommandBlock
          code={authenticatedInstall}
          title={t.gettingStarted.shellReloadTitle}
        />
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t.gettingStarted.shellReloadBody}
        </p>
      </section>
    </article>
  );
}
