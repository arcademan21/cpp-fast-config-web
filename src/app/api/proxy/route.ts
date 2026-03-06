import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type ProxyPayload = {
  method?: string;
  endpoint?: string;
  data?: unknown;
};

function normalizeMethod(method?: string): string {
  const normalized = method?.trim().toUpperCase() ?? "GET";
  return normalized.length > 0 ? normalized : "GET";
}

function buildTargetUrl(endpoint: string): string {
  const baseUrl = process.env.EXTERNAL_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("EXTERNAL_API_BASE_URL is not configured");
  }

  const safeEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl.replace(/\/$/, "")}${safeEndpoint}`;
}

function parseErrorMessage(payload: unknown): string {
  if (typeof payload !== "object" || payload === null) {
    return "Proxy request failed";
  }

  const record = payload as Record<string, unknown>;
  const message = record.message;

  if (Array.isArray(message)) {
    return message.map(String).join("; ");
  }

  if (typeof message === "string") {
    return message;
  }

  return "Proxy request failed";
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ProxyPayload;
    const method = normalizeMethod(payload.method);
    const endpoint = payload.endpoint?.trim();

    if (!endpoint) {
      return NextResponse.json(
        { error: "Missing endpoint in proxy payload" },
        { status: 400 },
      );
    }

    const targetUrl = buildTargetUrl(endpoint);
    const session = await getServerSession(authOptions);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (session?.accessToken) {
      headers.Authorization = `Bearer ${session.accessToken}`;
    }

    const response = await fetch(targetUrl, {
      method,
      headers,
      body:
        payload.data === undefined ? undefined : JSON.stringify(payload.data),
      cache: "no-store",
    });

    const responsePayload = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        {
          error: parseErrorMessage(responsePayload),
          status: response.status,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(responsePayload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected proxy error",
      },
      { status: 500 },
    );
  }
}
