"use client";

import { useState } from "react";
import { useI18n } from "./i18n-provider";

type CommandBlockProps = {
  code: string;
  title?: string;
  showCopy?: boolean;
};

export function CommandBlock({
  code,
  title,
  showCopy = true,
}: CommandBlockProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const onCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-w-0 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900 dark:border-slate-700">
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {title ?? t.common.terminal}
        </p>
        {showCopy ? (
          <button
            type="button"
            onClick={onCopy}
            className="rounded-md border border-slate-500 px-2 py-1 text-xs font-medium text-slate-100 transition hover:bg-slate-800"
          >
            {copied ? t.common.copied : t.common.copy}
          </button>
        ) : null}
      </div>
      <pre className="command-scrollbar max-w-full overflow-x-auto p-4 text-sm leading-relaxed text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
