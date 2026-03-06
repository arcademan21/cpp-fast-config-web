"use client";

import { useMemo, useState } from "react";
import { useI18n } from "./i18n-provider";
import { CommandBlock } from "./command-block";

type SnippetTab = {
  key: string;
  label: string;
  code: string;
};

export function SnippetTabs() {
  const { locale } = useI18n();

  const tabs: SnippetTab[] = useMemo(
    () => [
      {
        key: "install",
        label: locale === "es" ? "Acceso" : "Access",
        code: "# 1) Create account in the portal\n# 2) Generate API key\ncurl -fsSL <INSTALLER_URL> | sh -s -- --key <YOUR_KEY>",
      },
      {
        key: "init",
        label: "Init",
        code: "cpp init my-app\ncpp init --minimal my-app-min\ncpp init --no-vscode my-app-terminal",
      },
      {
        key: "build-test",
        label: locale === "es" ? "Build/Test" : "Build/Test",
        code: "cpp configure\ncpp build\ncpp test\ncpp all",
      },
      {
        key: "run",
        label: "Run",
        code: "cpp run\ncpp run --explain\ncpp run --verbose\ncpp targets\ncpp doctor",
      },
      {
        key: "adopt",
        label: locale === "es" ? "Adoptar" : "Adopt",
        code: "cpp init --adopt\ncpp init --adopt --safe .\ncpp init --adopt --force .",
      },
    ],
    [locale],
  );

  const [active, setActive] = useState("install");

  const selected = useMemo(
    () => tabs.find((tab) => tab.key === active) ?? tabs[0],
    [active, tabs],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
              active === tab.key
                ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                : "border-slate-400 text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <CommandBlock code={selected.code} title={selected.label} />
    </div>
  );
}
