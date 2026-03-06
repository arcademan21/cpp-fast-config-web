import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string | null;
    user?: DefaultSession["user"];
  }

  interface User {
    accessToken?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string | null;
  }
}
