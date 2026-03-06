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

export function ApiKeysManager() {
  const { t } = useI18n();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [latestKey, setLatestKey] = useState<string | null>(null);

  const selectedKey = useMemo(
    () => keys.find((key) => key.id === selectedId) ?? null,
    [keys, selectedId],
  );

  const installCommand = useMemo(() => {
    const keyForCommand = latestKey ?? t.apiKeys.commandKeyPlaceholder;
    return `curl -fsSL ${installerUrl} | bash -s -- "$PWD" --key ${keyForCommand} --api-base-url "${installerApiBaseUrl}" --version "${installerVersion}"`;
  }, [latestKey, t.apiKeys.commandKeyPlaceholder]);

  const loadKeys = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = await callBackendProxy<unknown>({
        method: normalizeMethod(listMethod),
        endpoint: apiKeysEndpoint,
      });

      const normalized = normalizeApiKeys(payload, t.apiKeys.fallbackPrefix);
      setKeys(normalized);

      if (normalized.length === 0) {
        setSelectedId("");
      } else if (!normalized.some((item) => item.id === selectedId)) {
        setSelectedId(normalized[0].id);
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : t.apiKeys.errLoad,
      );
    } finally {
      setLoading(false);
    }
  }, [selectedId, t.apiKeys.errLoad, t.apiKeys.fallbackPrefix]);

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

      const createdKey = extractCreatedKey(payload);
      setLatestKey(createdKey);
      setMessage(
        createdKey ? t.apiKeys.msgCreatedWithToken : t.apiKeys.msgCreated,
      );
      await loadKeys();
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
      setLatestKey(rotatedKey);
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

  const onRevoke = async () => {
    if (!selectedKey) {
      return;
    }

    setActionLoading(true);
    setError(null);
    setMessage(null);

    try {
      await callBackendProxy({
        method: normalizeMethod(revokeMethod),
        endpoint: buildActionEndpoint(
          selectedKey.id,
          revokeEndpointTemplate,
          revokeSuffix,
        ),
      });

      setMessage(t.apiKeys.msgRevoked);
      setLatestKey(null);
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
        <button
          type="button"
          onClick={onRevoke}
          disabled={actionLoading || !selectedKey}
          className="rounded-md border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-950/40"
        >
          {t.apiKeys.revoke}
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
            </tr>
          </thead>
          <tbody>
            {keys.length === 0 ? (
              <tr className="border-t border-slate-200 dark:border-slate-800">
                <td className="px-4 py-3 text-slate-500" colSpan={4}>
                  {t.apiKeys.noKeys}
                </td>
              </tr>
            ) : (
              keys.map((key) => (
                <tr
                  key={key.id}
                  className="border-t border-slate-200 dark:border-slate-800"
                >
                  <td className="px-4 py-3">
                    <input
                      type="radio"
                      name="selected-api-key"
                      checked={selectedId === key.id}
                      onChange={() => setSelectedId(key.id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-mono">{key.prefix}</td>
                  <td className="px-4 py-3">{key.status}</td>
                  <td className="px-4 py-3">{key.createdAt}</td>
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
        <pre className="command-scrollbar mt-2 overflow-x-auto text-sm text-slate-700 dark:text-slate-300">
          <code>{installCommand}</code>
        </pre>
      </div>
    </section>
  );
}
