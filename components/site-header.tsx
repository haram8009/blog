"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header className="border-b border-[var(--border)] pb-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--foreground)]">
            JD
          </div>
          <p className="card-title text-xl font-semibold tracking-[-0.03em]">{siteConfig.name}</p>
        </Link>

        <div className="flex flex-col gap-3 lg:items-end">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm">
            {siteConfig.nav.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 transition ${
                    isActive
                      ? "border border-[var(--border-strong)] text-[var(--foreground)]"
                      : "border border-transparent text-[var(--muted)] hover:border-[var(--border)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs text-[var(--muted)]">
              {session?.user ? session.user.name ?? "Signed in" : "GitHub login for comments"}
            </p>
            {session?.user ? (
              <button type="button" onClick={() => signOut()} className="button-secondary px-4 py-2 text-[0.82rem]">
                Sign out
              </button>
            ) : (
              <button type="button" onClick={() => signIn("github")} className="button-secondary px-4 py-2 text-[0.82rem]">
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
