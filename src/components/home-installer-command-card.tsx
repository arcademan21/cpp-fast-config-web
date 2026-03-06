"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { callBackendProxy } from "@/lib/proxy-client";
import { useI18n } from "@/components/i18n-provider";

type ApiKey = {
  id: string;
  prefix: string;
  status: string;
};

const apiKeysEndpoint =
  process.env.NEXT_PUBLIC_API_KEYS_ENDPOINT ?? "/api-keys";
const listMethod = process.env.NEXT_PUBLIC_API_KEYS_LIST_METHOD ?? "GET";
const installerUrl =
  process.env.NEXT_PUBLIC_INSTALLER_URL ??
  "https://raw.githubusercontent.com/arcademan21/cpp-fast-config/main/install.sh";
const installerApiBaseUrl =
  process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL ??
  "https://cpp-fast-config-backend.vercel.app/api";
const installerVersion = process.env.NEXT_PUBLIC_INSTALLER_VERSION ?? "latest";
const revealedKeysStorageKey = "cppfc.revealedApiKeysByPrefix.v1";
const selectedApiKeyStorageKey = "cppfc.selectedApiKeyId.v1";

function asObject(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeMethod(value: string): string {
  const method = value.trim().toUpperCase();
  return method.length > 0 ? method : "GET";
}

function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const root = asObject(payload);
  if (!root) {
    return [];
  }

  if (Array.isArray(root.items)) {
    return root.items;
  }

  if (Array.isArray(root.keys)) {
    return root.keys;
  }

  const data = asObject(root.data);
  if (!data) {
    return [];
  }

  if (Array.isArray(data.items)) {
    return data.items;
  }

  if (Array.isArray(data.keys)) {
    return data.keys;
  }

  return [];
}

function normalizeApiKeys(payload: unknown, fallbackPrefix: string): ApiKey[] {
  return extractArray(payload)
    .map((item) => asObject(item))
    .filter((item): item is Record<string, unknown> => item !== null)
    .map((item) => ({
      id: asString(item.id) || asString(item.keyId) || asString(item.uuid),
      prefix:
        asString(item.prefix) ||
        asString(item.keyPrefix) ||
        asString(item.name) ||
        fallbackPrefix,
      status: asString(item.status) || asString(item.state) || "unknown",
    }))
    .filter((item) => item.id.length > 0);
}

export function HomeInstallerCommandCard() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [showCommand, setShowCommand] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [revealedKeysByPrefix, setRevealedKeysByPrefix] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(revealedKeysStorageKey);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null) {
          const entries = Object.entries(parsed as Record<string, unknown>);
          const nextRevealedKeys = entries.reduce<Record<string, string>>(
            (acc, [prefix, value]) => {
              if (
                /^cfk_[a-f0-9]{8}$/i.test(prefix) &&
                typeof value === "string" &&
                value.startsWith("cfk_")
              ) {
                acc[prefix] = value;
              }
              return acc;
            },
            {},
          );
          setRevealedKeysByPrefix(nextRevealedKeys);
        }
      }

      const storedSelectedId = localStorage.getItem(selectedApiKeyStorageKey);
      if (storedSelectedId) {
        setSelectedId(storedSelectedId);
      }
    } catch {
      localStorage.removeItem(revealedKeysStorageKey);
      localStorage.removeItem(selectedApiKeyStorageKey);
    }
  }, []);

  const loadKeys = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await callBackendProxy<unknown>({
        method: normalizeMethod(listMethod),
        endpoint: apiKeysEndpoint,
      });

      const normalized = normalizeApiKeys(payload, t.apiKeys.fallbackPrefix);
      const active = normalized.filter(
        (item) => item.status.toUpperCase() !== "REVOKED",
      );

      setKeys(active);

      if (active.length === 0) {
        setSelectedId("");
        return;
      }

      const selectedStillExists = active.some((item) => item.id === selectedId);
      if (selectedStillExists) {
        return;
      }

      const preferredByStoredValue = active.find(
        (item) =>
          typeof revealedKeysByPrefix[item.prefix] === "string" &&
          revealedKeysByPrefix[item.prefix].length > 0,
      );

      setSelectedId(preferredByStoredValue?.id ?? active[0].id);
    } finally {
      setLoading(false);
    }
  }, [revealedKeysByPrefix, selectedId, t.apiKeys.fallbackPrefix]);

  useEffect(() => {
    void loadKeys();
  }, [loadKeys]);

  const selectedKey = useMemo(
    () => keys.find((item) => item.id === selectedId) ?? null,
    [keys, selectedId],
  );

  const selectedResolvedKey = useMemo(() => {
    if (!selectedKey) {
      return t.apiKeys.commandKeyPlaceholder;
    }
    return (
      revealedKeysByPrefix[selectedKey.prefix] ??
      t.apiKeys.commandKeyPlaceholder
    );
  }, [revealedKeysByPrefix, selectedKey, t.apiKeys.commandKeyPlaceholder]);

  const installCommand = useMemo(() => {
    return `tmp_cppfc_dir="$(mktemp -d)" && curl -fsSL ${installerUrl} | bash -s -- "$tmp_cppfc_dir" --key ${selectedResolvedKey} --api-base-url "${installerApiBaseUrl}" --version "${installerVersion}" && bash "$tmp_cppfc_dir/install.sh" "$PWD" --cleanup-source && rm -rf "$tmp_cppfc_dir"`;
  }, [selectedResolvedKey]);

  const copyCommand = useCallback(async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }, [installCommand]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t.landing.loadingInstallerCommand}
        </p>
      </div>
    );
  }

  if (keys.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {t.landing.quickInstall}
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {t.landing.noApiKeyYet}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/api-keys"
            className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            {t.landing.goToApiKeys}
          </Link>
          <Link
            href="/docs"
            className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            {t.common.viewDocs}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {t.apiKeys.installerCommand}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowCommand((current) => !current)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          {showCommand ? t.apiKeys.hideCommand : t.apiKeys.showCommand}
        </button>
        {showCommand ? (
          <pre className="command-scrollbar flex-1 overflow-x-auto text-sm text-slate-700 dark:text-slate-300">
            <code>{installCommand}</code>
          </pre>
        ) : (
          <p className="flex-1 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            {t.apiKeys.commandHidden}
          </p>
        )}
        <button
          type="button"
          onClick={() => void copyCommand()}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          {copied ? t.common.copied : t.common.copy}
        </button>
      </div>
    </div>
  );
}
