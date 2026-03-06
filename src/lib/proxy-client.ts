export type ProxyRequestPayload = {
  method: string;
  endpoint: string;
  data?: unknown;
};

function extractErrorMessage(value: unknown): string {
  if (typeof value !== "object" || value === null) {
    return "Proxy request failed";
  }

  const record = value as Record<string, unknown>;
  return typeof record.error === "string"
    ? record.error
    : "Proxy request failed";
}

export async function callBackendProxy<T = unknown>(
  payload: ProxyRequestPayload,
) {
  const response = await fetch("/api/proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(extractErrorMessage(json));
  }

  return json as T;
}
