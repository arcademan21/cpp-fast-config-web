import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const baseAppUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
const authLoginEndpoint = process.env.AUTH_LOGIN_ENDPOINT ?? "/auth/login";
const externalApiBaseUrl = process.env.EXTERNAL_API_BASE_URL?.replace(
  /\/$/,
  "",
);
const accessTokenGraceMs = 60_000;
const fallbackAccessTtlMs = 14 * 60 * 1000;

type JwtPayload = {
  exp?: unknown;
};

type RefreshResponsePayload = {
  accessToken?: unknown;
  refreshToken?: unknown;
  data?: {
    accessToken?: unknown;
    refreshToken?: unknown;
  };
};

type AuthorizedUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpires: number;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = Buffer.from(parts[1], "base64url").toString("utf8");
    const parsed: unknown = JSON.parse(payload);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as JwtPayload)
      : null;
  } catch {
    return null;
  }
}

function inferAccessTokenExpires(accessToken: string | null): number {
  if (!accessToken) {
    return 0;
  }

  const payload = decodeJwtPayload(accessToken);
  if (typeof payload?.exp === "number" && Number.isFinite(payload.exp)) {
    return payload.exp * 1000;
  }

  return Date.now() + fallbackAccessTtlMs;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken || !externalApiBaseUrl) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }

  try {
    const response = await fetch(`${externalApiBaseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    const payload = (await response.json()) as RefreshResponsePayload;
    const nextAccessToken =
      typeof payload.accessToken === "string"
        ? payload.accessToken
        : typeof payload.data?.accessToken === "string"
          ? payload.data.accessToken
          : null;

    const nextRefreshToken =
      typeof payload.refreshToken === "string"
        ? payload.refreshToken
        : typeof payload.data?.refreshToken === "string"
          ? payload.data.refreshToken
          : token.refreshToken;

    if (!nextAccessToken) {
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    return {
      ...token,
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
      accessTokenExpires: inferAccessTokenExpires(nextAccessToken),
      error: undefined,
    };
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 10 * 60,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const response = await fetch(`${baseAppUrl}/api/proxy`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            method: "POST",
            endpoint: authLoginEndpoint,
            data: {
              email: credentials.email,
              password: credentials.password,
            },
          }),
        });

        if (!response.ok) {
          return null;
        }

        const payload = await response.json();
        const userData = payload?.user ?? payload?.data?.user ?? payload;
        const token =
          payload?.accessToken ?? payload?.token ?? payload?.data?.token;
        const refreshToken =
          payload?.refreshToken ?? payload?.data?.refreshToken;

        if (!userData?.email) {
          return null;
        }

        const authorizedUser: AuthorizedUser = {
          id: String(userData.id ?? userData.email),
          name: userData.name ?? userData.fullName ?? userData.email,
          email: userData.email,
          image: userData.image ?? null,
          accessToken: token ?? null,
          refreshToken: refreshToken ?? null,
          accessTokenExpires: inferAccessTokenExpires(token ?? null),
        };

        return authorizedUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken ?? token.accessToken;
        token.refreshToken = user.refreshToken ?? token.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;
        token.error = undefined;
        return token;
      }

      if (
        typeof token.accessTokenExpires === "number" &&
        Date.now() < token.accessTokenExpires - accessTokenGraceMs
      ) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
};
