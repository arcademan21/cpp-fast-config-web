"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";
import { useI18n } from "./i18n-provider";

export function SiteHeader() {
  const { t } = useI18n();
  const { status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = status === "authenticated";

  const navItems = [
    { href: "/#features", label: t.header.features },
    { href: "/#docs", label: t.header.docs },
    { href: "/#examples", label: t.header.examples },
    { href: "/#ci", label: t.header.ci },
    { href: "/#license", label: t.header.license },
    {
      href: isAuthenticated ? "/dashboard" : "/access",
      label: isAuthenticated ? t.common.goToDashboard : t.header.access,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/85">
        <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Image
              src="/logo.svg"
              alt="Cpp Fast Config"
              width={600}
              height={200}
              priority
              className="h-14 w-auto max-w-[360px] object-contain object-left sm:h-16"
            />
          </Link>
          <nav className="hidden items-center gap-5 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <LanguageToggle />
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex h-9 items-center rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
                >
                  {t.common.goToDashboard}
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="inline-flex h-9 items-center rounded-md bg-slate-900 px-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                  {t.common.logout}
                </button>
              </>
            ) : (
              <Link
                href="/access"
                className="inline-flex h-9 items-center rounded-md bg-slate-900 px-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                {t.common.getStarted}
              </Link>
            )}
          </div>
          <button
            type="button"
            aria-label={t.header.openMenu}
            onClick={() => setIsMobileMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900 md:hidden"
          >
            <span className="sr-only">{t.header.openMenu}</span>
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <>
          <button
            type="button"
            aria-label={t.header.closeMenuOverlay}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm md:hidden"
          />
          <aside className="fixed right-0 top-0 z-[60] flex h-screen w-72 max-w-[85vw] flex-col border-l border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-950 md:hidden">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t.header.menu}
              </p>
              <button
                type="button"
                aria-label={t.header.closeMenu}
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 space-y-3 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
              </div>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex h-9 w-full items-center justify-center rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
                  >
                    {t.common.goToDashboard}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      void signOut({ callbackUrl: "/" });
                    }}
                    className="inline-flex h-9 w-full items-center justify-center rounded-md bg-slate-900 px-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                  >
                    {t.common.logout}
                  </button>
                </>
              ) : (
                <Link
                  href="/access"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex h-9 w-full items-center justify-center rounded-md bg-slate-900 px-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                  {t.common.getStarted}
                </Link>
              )}
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
              {navItems.map((item) => (
                <a
                  key={`mobile-${item.label}`}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center"
              >
                <Image
                  src="/logo.svg"
                  alt="Cpp Fast Config"
                  width={600}
                  height={200}
                  className="h-14 w-auto max-w-[260px] object-contain object-left"
                />
              </Link>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
