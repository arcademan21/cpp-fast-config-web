import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const baseAppUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
const authLoginEndpoint = process.env.AUTH_LOGIN_ENDPOINT ?? "/auth/login";

type AuthorizedUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  accessToken: string | null;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
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

        if (!userData?.email) {
          return null;
        }

        const authorizedUser: AuthorizedUser = {
          id: String(userData.id ?? userData.email),
          name: userData.name ?? userData.fullName ?? userData.email,
          email: userData.email,
          image: userData.image ?? null,
          accessToken: token ?? null,
        };

        return authorizedUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken ?? token.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};
