"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  BookOpen,
  ClipboardCheck,
  Grid2X2,
  Settings,
  X,
} from "lucide-react";
import { ProgressProvider, useProgress } from "@/hooks/use-progress";
import { AppearanceProvider } from "@/hooks/use-appearance";
import { ThemeToggle } from "./appearance";
import { Backwaters } from "./kerala-motifs";
const nav = [
  { href: "/", name: "Overview", icon: LayoutDashboard },
  { href: "/flashcards", name: "Flashcards", icon: Layers },
  { href: "/learn", name: "Learn", icon: BookOpen },
  { href: "/test", name: "Test yourself", icon: ClipboardCheck },
  { href: "/reference", name: "Alphabet", icon: Grid2X2 },
];
function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { progress, error, dismissError } = useProgress();
  const total = Object.keys(progress.cards).length;
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-icon" lang="ml">
            അ
          </span>
          <span>
            Aksharam
            <span className="brand-sub" lang="ml">
              അക്ഷരം
            </span>
          </span>
        </Link>

        <nav aria-label="Main navigation">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`nav-item ${path === n.href ? "active" : ""}`}
              aria-current={path === n.href ? "page" : undefined}
            >
              <n.icon size={19} />
              {n.name}
              {path === n.href && <span className="nav-dot" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Backwaters className="sidebar-backwaters" />
          <ThemeToggle />
          <Link
            href="/settings"
            className={`nav-item ${path === "/settings" ? "active" : ""}`}
          >
            <Settings size={18} />
            Settings & progress
          </Link>
          <p className="sidebar-progress">{total} letters practiced</p>
        </div>
      </aside>
      <div className="content-shell">
        <div className="mobile-header">
          <Link href="/" className="mobile-brand">
            Aksharam <span lang="ml">അക്ഷരം</span>
          </Link>
          <ThemeToggle />
        </div>
        <main id="main">
          {error && (
            <div className="notice" role="alert">
              {error}
              <button aria-label="Dismiss message" onClick={dismissError}>
                <X size={17} />
              </button>
            </div>
          )}
          {children}
        </main>
      </div>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-label={n.name}
            aria-current={path === n.href ? "page" : undefined}
            className={path === n.href ? "active" : ""}
          >
            <n.icon size={20} />
            <span>{n.name === "Test yourself" ? "Test" : n.name}</span>
          </Link>
        ))}
        <Link
          href="/settings"
          aria-label="Settings"
          aria-current={path === "/settings" ? "page" : undefined}
          className={path === "/settings" ? "active" : ""}
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
}
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AppearanceProvider>
      <ProgressProvider>
        <Layout>{children}</Layout>
      </ProgressProvider>
    </AppearanceProvider>
  );
}
