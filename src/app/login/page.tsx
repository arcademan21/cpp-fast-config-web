"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setLoading(false);

    if (result?.error) {
      setError(t.loginForm.invalidCredentials);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-14 sm:px-6 lg:px-8">
      <section className="space-y-5 rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight">
          {t.loginForm.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t.loginForm.subtitle}
        </p>

        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t.loginForm.emailPlaceholder}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t.loginForm.passwordPlaceholder}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            {loading ? t.loginForm.submitLoading : t.loginForm.submitIdle}
          </button>
        </form>

        <Link href="/access" className="text-sm font-semibold underline">
          {t.loginForm.backToAccess}
        </Link>
      </section>
    </main>
  );
}
