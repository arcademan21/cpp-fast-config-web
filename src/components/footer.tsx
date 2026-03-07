"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useI18n } from "./i18n-provider";

export function SiteFooter() {
  const { t } = useI18n();
  const { status } = useSession();
  const isUnauthenticated = status === "unauthenticated";

  return (
    <footer className="border-t border-slate-200 py-10 dark:border-slate-800">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-slate-300">
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
    </footer>
  );
}
