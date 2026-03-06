"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
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
