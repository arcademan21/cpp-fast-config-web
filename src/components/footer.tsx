"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useI18n } from "./i18n-provider";

export function SiteFooter() {
  const { t } = useI18n();
  const { status } = useSession();
  const isUnauthenticated = status === "unauthenticated";
  const currentYear = new Date().getFullYear();
  const copyrightText = t.footer.copyright
    .replace("{year}", String(currentYear))
    .replace("{author}", "Arcademan21");

  return (
    <footer className="border-t border-slate-200 py-10 dark:border-slate-800">
      <div className="mx-auto w-full max-w-6xl px-4 text-sm text-slate-600 sm:px-6 lg:px-8 dark:text-slate-300">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/logo.svg"
              alt="Cpp Fast Config"
              width={600}
              height={200}
              className="h-14 w-auto max-w-[320px] object-contain object-left"
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/docs">{t.common.docs}</Link>
            {isUnauthenticated ? (
              <Link href="/access">{t.header.access}</Link>
            ) : null}
          </div>
          <p>{t.footer.nonCommercial}</p>
        </div>
        <p className="mt-4 text-center text-xs tracking-wide text-slate-500 dark:text-slate-400">
          {copyrightText}
        </p>
      </div>
    </footer>
  );
}
