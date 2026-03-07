"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { callBackendProxy } from "@/lib/proxy-client";
import { useI18n } from "@/components/i18n-provider";

type ApiKey = {
  id: string;
  prefix: string;
  status: string;
  createdAt: string;
};

const apiKeysEndpoint =
  process.env.NEXT_PUBLIC_API_KEYS_ENDPOINT ?? "/api-keys";
const listMethod = process.env.NEXT_PUBLIC_API_KEYS_LIST_METHOD ?? "GET";
const createMethod = process.env.NEXT_PUBLIC_API_KEYS_CREATE_METHOD ?? "POST";
const rotateMethod = process.env.NEXT_PUBLIC_API_KEYS_ROTATE_METHOD ?? "POST";
const revokeMethod = process.env.NEXT_PUBLIC_API_KEYS_REVOKE_METHOD ?? "POST";

const rotateEndpointTemplate =
  process.env.NEXT_PUBLIC_API_KEYS_ROTATE_ENDPOINT ?? "";
const revokeEndpointTemplate =
  process.env.NEXT_PUBLIC_API_KEYS_REVOKE_ENDPOINT ?? "";

const rotateSuffix =
  process.env.NEXT_PUBLIC_API_KEYS_ROTATE_SUFFIX ?? "/rotate";
const revokeSuffix =
  process.env.NEXT_PUBLIC_API_KEYS_REVOKE_SUFFIX ?? "/revoke";

const installerUrl =
  process.env.NEXT_PUBLIC_INSTALLER_URL ??
  "https://raw.githubusercontent.com/arcademan21/cpp-fast-config/main/install.sh";
const installerApiBaseUrl =
  process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL ??
  "https://cpp-fast-config-backend.vercel.app/api";
const installerVersion = process.env.NEXT_PUBLIC_INSTALLER_VERSION ?? "latest";
const revealedKeysStorageKey = "cppfc.revealedApiKeysByPrefix.v1";
const selectedApiKeyStorageKey = "cppfc.selectedApiKeyId.v1";

function normalizeMethod(value: string): string {
  const method = value.trim().toUpperCase();
  return method.length > 0 ? method : "POST";
}

function buildActionEndpoint(
  keyId: string,
  endpointTemplate: string,
  suffix: string,
): string {
  if (endpointTemplate.trim().length > 0) {
    return endpointTemplate.includes(":id")
      ? endpointTemplate.replace(":id", keyId)
      : endpointTemplate;
  }

  return `${apiKeysEndpoint}/${keyId}${suffix}`;
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
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
    .map((item) => {
      const id =
        asString(item.id) || asString(item.keyId) || asString(item.uuid) || "";

      const prefix =
        asString(item.prefix) ||
        asString(item.keyPrefix) ||
        asString(item.name) ||
        fallbackPrefix;

      const status = asString(item.status) || asString(item.state) || "unknown";

      const createdAt =
        asString(item.createdAt) ||
        asString(item.created_at) ||
        asString(item.date) ||
        "-";

      return {
        id,
        prefix,
        status,
        createdAt,
      };
    })
    .filter((key) => key.id.length > 0);
}

function extractCreatedKey(payload: unknown): string | null {
  const root = asObject(payload);
  if (!root) {
    return null;
  }

  const direct =
    asString(root.key) || asString(root.apiKey) || asString(root.accessToken);
  if (direct) {
    return direct;
  }

  const data = asObject(root.data);
  if (!data) {
    return null;
  }

  return (
    asString(data.key) ||
    asString(data.apiKey) ||
    asString(data.accessToken) ||
    null
  );
}

function extractCreatedKeyId(payload: unknown): string | null {
  const root = asObject(payload);
  if (!root) {
    return null;
  }

  const direct = asString(root.id);
  if (direct) {
    return direct;
  }

  const data = asObject(root.data);
  if (!data) {
    return null;
  }

  return asString(data.id) || null;
}

function derivePrefixFromRawKey(rawKey: string): string | null {
  const match = rawKey.match(/^(cfk_[a-f0-9]{8})/i);
  return match ? match[1] : null;
}

export function ApiKeysManager() {
  const { t } = useI18n();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<"command" | null>(null);
  const [revealedKeysByPrefix, setRevealedKeysByPrefix] = useState<
    Record<string, string>
  >({});
  const [showCommand, setShowCommand] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(revealedKeysStorageKey);
      if (!raw) {
        return;
      }

      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed !== "object" || parsed === null) {
        return;
      }

      const entries = Object.entries(parsed as Record<string, unknown>).filter(
        ([prefix, value]) =>
          typeof prefix === "string" &&
          /^cfk_[a-f0-9]{8}$/i.test(prefix) &&
          typeof value === "string" &&
          value.startsWith("cfk_"),
      );

      const nextRevealedKeys = entries.reduce<Record<string, string>>(
        (acc, [prefix, value]) => {
          if (typeof value === "string") {
            acc[prefix] = value;
          }
          return acc;
        },
        {},
      );

      setRevealedKeysByPrefix(nextRevealedKeys);
    } catch {
      localStorage.removeItem(revealedKeysStorageKey);
    }
  }, []);

  useEffect(() => {
    const storedSelectedId = localStorage.getItem(selectedApiKeyStorageKey);
    if (storedSelectedId) {
      setSelectedId(storedSelectedId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      revealedKeysStorageKey,
      JSON.stringify(revealedKeysByPrefix),
    );
  }, [revealedKeysByPrefix]);

  useEffect(() => {
    if (!selectedId) {
      localStorage.removeItem(selectedApiKeyStorageKey);
      return;
    }

    localStorage.setItem(selectedApiKeyStorageKey, selectedId);
  }, [selectedId]);

  const selectedKey = useMemo(
    () => keys.find((key) => key.id === selectedId) ?? null,
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

  const visibleKeys = useMemo(
    () => keys.filter((key) => key.status.toUpperCase() !== "REVOKED"),
    [keys],
  );

  const copyText = useCallback(
    async (field: "command", text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(
          () =>
            setCopiedField((current) => (current === field ? null : current)),
          1200,
        );
      } catch {
        setError(t.apiKeys.errCopy);
      }
    },
    [t.apiKeys.errCopy],
  );

  const loadKeys = useCallback(
    async (preferredSelectedId?: string) => {
      setLoading(true);
      setError(null);

      try {
        const payload = await callBackendProxy<unknown>({
          method: normalizeMethod(listMethod),
          endpoint: apiKeysEndpoint,
        });

        const normalized = normalizeApiKeys(payload, t.apiKeys.fallbackPrefix);
        setKeys(normalized);

        const normalizedVisible = normalized.filter(
          (item) => item.status.toUpperCase() !== "REVOKED",
        );

        const nextSelectedId =
          preferredSelectedId &&
          normalizedVisible.some((item) => item.id === preferredSelectedId)
            ? preferredSelectedId
            : selectedId;

        if (normalizedVisible.length === 0) {
          setSelectedId("");
        } else if (
          !normalizedVisible.some((item) => item.id === nextSelectedId)
        ) {
          const withStoredValue = normalizedVisible.find(
            (item) =>
              typeof revealedKeysByPrefix[item.prefix] === "string" &&
              revealedKeysByPrefix[item.prefix].length > 0,
          );

          setSelectedId(withStoredValue?.id ?? normalizedVisible[0].id);
        } else if (nextSelectedId !== selectedId) {
          setSelectedId(nextSelectedId);
        }
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : t.apiKeys.errLoad,
        );
      } finally {
        setLoading(false);
      }
    },
    [
      revealedKeysByPrefix,
      selectedId,
      t.apiKeys.errLoad,
      t.apiKeys.fallbackPrefix,
    ],
  );

  useEffect(() => {
    void loadKeys();
  }, [loadKeys]);

  const onCreate = async () => {
    setActionLoading(true);
    setError(null);
    setMessage(null);

    try {
      const payload = await callBackendProxy<unknown>({
        method: normalizeMethod(createMethod),
        endpoint: apiKeysEndpoint,
      });

      const createdKeyId = extractCreatedKeyId(payload);
      const createdKey = extractCreatedKey(payload);
      if (createdKey) {
        const prefix = derivePrefixFromRawKey(createdKey);
        if (prefix) {
          setRevealedKeysByPrefix((current) => ({
            ...current,
            [prefix]: createdKey,
          }));
        }
      }
      setMessage(
        createdKey ? t.apiKeys.msgCreatedWithToken : t.apiKeys.msgCreated,
      );
      await loadKeys(createdKeyId ?? undefined);
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : t.apiKeys.errCreate,
      );
    } finally {
      setActionLoading(false);
    }
  };

  const onRotate = async () => {
    if (!selectedKey) {
      return;
    }

    setActionLoading(true);
    setError(null);
    setMessage(null);

    try {
      const payload = await callBackendProxy<unknown>({
        method: normalizeMethod(rotateMethod),
        endpoint: buildActionEndpoint(
          selectedKey.id,
          rotateEndpointTemplate,
          rotateSuffix,
        ),
      });

      const rotatedKey = extractCreatedKey(payload);
      if (rotatedKey) {
        const prefix = derivePrefixFromRawKey(rotatedKey);
        if (prefix) {
          setRevealedKeysByPrefix((current) => ({
            ...current,
            [prefix]: rotatedKey,
          }));
        }
      }
      setMessage(
        rotatedKey ? t.apiKeys.msgRotated : t.apiKeys.msgRotatedRequested,
      );
      await loadKeys();
    } catch (rotateError) {
      setError(
        rotateError instanceof Error
          ? rotateError.message
          : t.apiKeys.errRotate,
      );
    } finally {
      setActionLoading(false);
    }
  };

  const onRevoke = async (key: ApiKey) => {
    if (!key) {
      return;
    }

    setActionLoading(true);
    setError(null);
    setMessage(null);

    try {
      await callBackendProxy({
        method: normalizeMethod(revokeMethod),
        endpoint: buildActionEndpoint(
          key.id,
          revokeEndpointTemplate,
          revokeSuffix,
        ),
      });

      setMessage(t.apiKeys.msgRevoked);
      setRevealedKeysByPrefix((current) => {
        if (!(key.prefix in current)) {
          return current;
        }

        const next = { ...current };
        delete next[key.prefix];
        return next;
      });
      await loadKeys();
    } catch (revokeError) {
      setError(
        revokeError instanceof Error
          ? revokeError.message
          : t.apiKeys.errRevoke,
      );
    } finally {
      setActionLoading(false);
    }
  };

  const onSelectKey = (keyId: string) => {
    setSelectedId(keyId);
    setShowCommand(false);
    setMessage(t.apiKeys.msgSelected);
  };

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
      <h1 className="text-3xl font-bold tracking-tight">{t.apiKeys.title}</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {t.apiKeys.subtitle}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onCreate}
          disabled={actionLoading}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          {t.apiKeys.create}
        </button>
        <button
          type="button"
          onClick={onRotate}
          disabled={actionLoading || !selectedKey}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          {t.apiKeys.rotate}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">{t.apiKeys.loading}</p>
      ) : null}
      {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">
                {t.apiKeys.select}
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                {t.apiKeys.keyPrefix}
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                {t.apiKeys.status}
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                {t.apiKeys.created}
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                {t.apiKeys.actions}
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleKeys.length === 0 ? (
              <tr className="border-t border-slate-200 dark:border-slate-800">
                <td className="px-4 py-3 text-slate-500" colSpan={5}>
                  {t.apiKeys.noKeys}
                </td>
              </tr>
            ) : (
              visibleKeys.map((key) => (
                <tr
                  key={key.id}
                  className="border-t border-slate-200 dark:border-slate-800"
                >
                  <td className="px-4 py-3">
                    <input
                      type="radio"
                      name="selected-api-key"
                      checked={selectedId === key.id}
                      onChange={() => onSelectKey(key.id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-mono">{key.prefix}</td>
                  <td className="px-4 py-3">{key.status}</td>
                  <td className="px-4 py-3">{key.createdAt}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => void onRevoke(key)}
                      disabled={actionLoading}
                      aria-label={`${t.apiKeys.revoke} ${key.prefix}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-rose-300 text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-950/40"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
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
            onClick={() => void copyText("command", installCommand)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            {copiedField === "command" ? t.common.copied : t.common.copy}
          </button>
        </div>
      </div>
    </section>
  );
}
