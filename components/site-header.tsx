"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const { data: session } = useSession();

  return (
    <header className="mb-10 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] px-6 py-4 shadow-[0_20px_80px_rgba(28,24,19,0.06)] backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-lg font-bold text-white">
            JD
          </div>
          <div>
            <p className="font-[Trebuchet_MS] text-lg font-semibold">{siteConfig.name}</p>
            <p className="text-sm text-[var(--muted)]">Building in public, one project at a time.</p>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-[var(--muted)] transition hover:bg-white hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
          {session?.user ? (
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-full bg-[var(--foreground)] px-4 py-2 font-[Trebuchet_MS] text-white"
            >
              Sign out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => signIn("github")}
              className="rounded-full bg-[var(--accent)] px-4 py-2 font-[Trebuchet_MS] text-white"
            >
              Sign in with GitHub
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
