"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { callBackendProxy } from "@/lib/proxy-client";
import { useI18n } from "@/components/i18n-provider";

const authRegisterEndpoint =
  process.env.NEXT_PUBLIC_AUTH_REGISTER_ENDPOINT ?? "/auth/register";

export default function RegisterPage() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await callBackendProxy({
        method: "POST",
        endpoint: authRegisterEndpoint,
        data: { email, password },
      });
      setMessage(t.registerForm.success);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : t.registerForm.failed,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-14 sm:px-6 lg:px-8">
      <section className="space-y-5 rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight">
          {t.registerForm.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t.registerForm.subtitle}
        </p>

        <div className="space-y-2 border-b border-slate-200 pb-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-rose-400 bg-rose-500 px-4 text-sm font-semibold text-white transition hover:bg-rose-400 dark:border-rose-500 dark:bg-rose-600 dark:text-white dark:hover:bg-rose-500"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-white"
              fill="currentColor"
            >
              <path d="M12 11.9v3.3h4.7c-.2 1.1-1.3 3.3-4.7 3.3-2.8 0-5.2-2.4-5.2-5.4s2.4-5.4 5.2-5.4c1.6 0 2.6.7 3.2 1.3l2.2-2.1C15.9 5.4 14.1 4.6 12 4.6 7.6 4.6 4 8.3 4 12.8S7.6 21 12 21c6.9 0 8-6.5 7.6-9.1H12Z" />
            </svg>
            {t.registerForm.google}
          </button>
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-900 bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-black dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
            >
              <path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.6 2.9 8.5 6.9 9.8.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.6-1.1-1.6-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5.2 0-1.2.4-2.2 1-3-.1-.3-.4-1.4.1-2.9 0 0 .9-.3 3 .9a10 10 0 0 1 5.4 0c2.1-1.2 3-.9 3-.9.5 1.5.2 2.6.1 2.9.7.8 1 1.8 1 3 0 4.1-2.4 4.9-4.7 5.2.4.3.7 1 .7 2v2.9c0 .3.2.6.7.5A10.4 10.4 0 0 0 22 12.3C22 6.6 17.5 2 12 2Z" />
            </svg>
            {t.registerForm.github}
          </button>
        </div>

        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t.registerForm.fullNamePlaceholder}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t.registerForm.emailPlaceholder}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t.registerForm.passwordPlaceholder}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          {message ? (
            <p className="text-sm text-emerald-600">{message}</p>
          ) : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            {loading ? t.registerForm.submitLoading : t.registerForm.submitIdle}
          </button>
        </form>

        <Link href="/access" className="text-sm font-semibold underline">
          {t.registerForm.backToAccess}
        </Link>
      </section>
    </main>
  );
}
