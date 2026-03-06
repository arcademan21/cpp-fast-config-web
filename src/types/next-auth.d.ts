import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string | null;
    error?: "RefreshAccessTokenError";
    user?: DefaultSession["user"];
  }

  interface User {
    accessToken?: string | null;
    refreshToken?: string | null;
    accessTokenExpires?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string | null;
    refreshToken?: string | null;
    accessTokenExpires?: number;
    error?: "RefreshAccessTokenError";
  }
}
