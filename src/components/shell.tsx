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
  ArrowUpRight,
  Leaf,
  X,
} from "lucide-react";
import { ProgressProvider, useProgress } from "@/hooks/use-progress";
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
            aksharam
            <span className="brand-sub" lang="ml">
              അക്ഷരം · a little, every day
            </span>
          </span>
        </Link>
        <div className="nav-label">YOUR LEARNING SPACE</div>
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
          <div className="little-note">
            <Leaf size={21} />
            <p>
              A new script.
              <br />A new way to see.
            </p>
            <span>
              Your journey starts with
              <br />
              one letter.
            </span>
          </div>
          <Link
            href="/settings"
            className={`nav-item ${path === "/settings" ? "active" : ""}`}
          >
            <Settings size={18} />
            Settings & progress
          </Link>
          <div className="profile">
            <div className="avatar">Y</div>
            <div>
              Your learning journey<small>{total} letters practiced</small>
            </div>
            <ArrowUpRight size={16} />
          </div>
        </div>
      </aside>
      <div className="content-shell">
        <div className="topbar">
          <span>MALAYALAM, ONE LETTER AT A TIME</span>
          <span className="topbar-right">
            <span className="status-dot" /> Made for the curious{" "}
            <span lang="ml">നമസ്കാരം</span>
          </span>
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
        <footer>
          <span>Small steps. A whole new alphabet.</span>
          <span>
            Made with care, for Malayalam <span lang="ml">മലയാളം</span>
          </span>
        </footer>
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
        <Link href="/settings" aria-label="Settings">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
}
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <Layout>{children}</Layout>
    </ProgressProvider>
  );
}
