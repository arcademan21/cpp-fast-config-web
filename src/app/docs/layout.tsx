import type { ReactNode } from "react";
import { DocsSidebar } from "@/components/docs-sidebar";
import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-45 [background-image:radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.24)_1px,transparent_0)] [background-size:24px_24px] dark:opacity-30 dark:[background-image:radial-gradient(circle_at_1px_1px,rgba(71,85,105,0.35)_1px,transparent_0)]"
      />
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <DocsSidebar />
        <div className="min-w-0 space-y-8">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
