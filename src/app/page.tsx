"use client";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Layers,
  BookOpen,
  ClipboardCheck,
  Clock,
} from "lucide-react";
import { categories, letters, coreLetters } from "@/data/alphabet";
import { useProgress } from "@/hooks/use-progress";
import { mastered, streak, localDay } from "@/lib/progress";
import { PageHeading, ProgressBar } from "@/components/ui";

export default function Dashboard() {
  const { progress, now } = useProgress();
  const reviewed = Object.values(progress.cards);
  const masteredCount = reviewed.filter(mastered).length;
  const due = reviewed.filter((c) => c.nextReview <= now).length;
  const correct = progress.attempts.filter((a) => a.correct).length;
  const today = reviewed.reduce(
    (sum, c) =>
      sum + c.history.filter((h) => localDay(h.at) === localDay(now)).length,
    0,
  );
  const goal = progress.preferences.dailyGoal;
  const currentStreak = streak(progress.studyDays, now);
  const first = coreLetters.find((l) => !mastered(progress.cards[l.id]));
  return (
    <>
      <PageHeading
        title="Overview"
        action={<span className="streak-chip">{currentStreak}-day streak</span>}
      />
      <section className="dashboard-study panel" aria-label="Study actions">
        <div className="review-summary">
          <div>
            <h2>{due} cards due</h2>
            <p>
              {due ? "Review scheduled cards." : "No scheduled reviews due."}
            </p>
          </div>
          <Clock size={24} aria-hidden="true" />
        </div>
        <Link
          className="button primary"
          href={`/flashcards?deck=${due ? "review" : (first?.category ?? "vowels")}`}
        >
          {due
            ? "Review due cards"
            : progress.introduced.length
              ? "Resume flashcards"
              : "Study vowels"}
          <ArrowRight size={18} />
        </Link>
        <nav className="mode-grid" aria-label="Study modes">
          {[
            { label: "Flashcards", href: "/flashcards", icon: Layers },
            { label: "Learn", href: "/learn", icon: BookOpen },
            { label: "Test", href: "/test", icon: ClipboardCheck },
          ].map((m) => (
            <Link key={m.href} href={m.href} className="mode-card">
              <m.icon size={20} />
              <span>{m.label}</span>
              <ArrowRight size={18} />
            </Link>
          ))}
        </nav>
      </section>
      <div className="stats-grid" aria-label="Learning statistics">
        <div className="stat">
          <div>
            <span>Introduced</span>
            <strong>
              {progress.introduced.length}
              <small> / {letters.length}</small>
            </strong>
          </div>
        </div>
        <div className="stat">
          <div>
            <span>Mastered</span>
            <strong>{masteredCount}</strong>
          </div>
        </div>
        <div className="stat">
          <div>
            <span>Due</span>
            <strong>{due}</strong>
          </div>
        </div>
        <div className="stat">
          <div>
            <span>Quiz accuracy</span>
            <strong>
              {progress.attempts.length
                ? `${Math.round((correct / progress.attempts.length) * 100)}%`
                : "—"}
            </strong>
          </div>
        </div>
      </div>
      <section className="daily-goal panel" aria-label="Daily practice goal">
        <div>
          <h2>Daily goal</h2>
          <p>
            {today} / {goal} cards practiced
            {today >= goal ? " · Goal reached" : ""}
          </p>
        </div>
        <ProgressBar value={(today / goal) * 100} label="Daily practice goal" />
        <Link href="/settings">
          Change goal <ArrowUpRight size={16} />
        </Link>
      </section>
      <section className="alphabet-section">
        <div className="section-header">
          <h2>Collections</h2>
          <Link href="/reference">
            Alphabet reference <ArrowRight size={16} />
          </Link>
        </div>
        <div className="deck-grid">
          {categories.map((c) => {
            const group = letters.filter((l) => l.category === c.id);
            const done = group.filter((l) =>
              mastered(progress.cards[l.id]),
            ).length;
            return (
              <Link
                href={`/flashcards?deck=${c.id}`}
                key={c.id}
                className="deck-card"
                aria-label={`Study ${c.name.toLowerCase()}`}
              >
                <div className="deck-card-top">
                  <span className={`deck-symbol ${c.color}`} lang="ml">
                    {c.glyph}
                  </span>
                  <ArrowUpRight size={19} aria-hidden="true" />
                </div>
                <h3>
                  {c.name}
                  <span lang="ml">{c.malayalam}</span>
                </h3>
                <p>{group.length} cards</p>
                <ProgressBar
                  value={(done / group.length) * 100}
                  label={`${c.name} mastery`}
                />
                <div className="deck-progress">
                  <span>
                    {done} of {group.length} mastered
                  </span>
                  <span>{Math.round((done / group.length) * 100)}%</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
