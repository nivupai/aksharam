"use client";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Layers,
  BookOpen,
  ClipboardCheck,
  Flame,
  Target,
  Sprout,
  Check,
  Clock,
  TrendingUp,
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
        eyebrow="YOUR EVERYDAY EXPLORATION"
        title={
          progress.introduced.length
            ? "Welcome back, curious mind."
            : "A little Malayalam, every day."
        }
        description="A beautiful script. A fresh perspective. Let’s make a little progress."
        action={
          <div className="streak-chip">
            <Flame size={18} />
            <strong>{currentStreak}-day</strong> streak
          </div>
        }
      />
      <div className="dashboard-top">
        <section className="hero-panel">
          <div className="hero-copy">
            <div className="pill">
              <span className="status-dot" /> YOUR NEXT CHAPTER
            </div>
            <h2>
              Every letter opens
              <br />a little <em>possibility.</em>
            </h2>
            <p>
              From unfamiliar shapes to familiar sounds.
              <br />
              Your Malayalam journey, one card at a time.
            </p>
            <Link
              className="button primary"
              href={`/flashcards?deck=${due ? "review" : (first?.category ?? "vowels")}`}
            >
              {progress.introduced.length
                ? "Resume learning"
                : "Start learning"}
              <ArrowRight size={18} />
            </Link>
            <span className="hero-footnote">
              Just a few minutes. A meaningful little step.
            </span>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span className="orbit orbit-one" />
            <span className="orbit orbit-two" />
            <div className="art-doodle doodle-one">✧</div>
            <div className="art-card art-card-back" lang="ml">
              ക
            </div>
            <div className="art-card art-card-front">
              <span className="art-card-label">IT ALL BEGINS WITH</span>
              <span lang="ml">അ</span>
              <span className="art-roman">
                a <span>·</span> the first vowel
              </span>
            </div>
            <div className="art-doodle doodle-two">✳</div>
            <span className="art-caption">a whole new world of words</span>
          </div>
        </section>
        <section className="daily-goal panel">
          <div className="panel-heading">
            <span className="section-caption">A LITTLE EVERY DAY</span>
            <Target size={18} />
          </div>
          <h3>Your daily rhythm</h3>
          <div
            className="goal-circle"
            style={{
              background: `conic-gradient(var(--sage-dark) ${Math.min(100, (today / goal) * 100)}%, #eceee4 0)`,
            }}
          >
            <div>
              <strong>
                {today}
                <span> / {goal}</span>
              </strong>
              <small>cards practiced</small>
            </div>
          </div>
          <p>
            {today >= goal
              ? "Today’s goal, beautifully done."
              : "A few quiet minutes can go a long way."}
          </p>
          <Link href="/settings">
            Adjust your daily goal <ArrowUpRight size={15} />
          </Link>
        </section>
      </div>
      <div className="stats-grid">
        <div className="stat">
          <div className="stat-icon sage">
            <Layers size={19} />
          </div>
          <div>
            <span>Letters introduced</span>
            <strong>
              {progress.introduced.length}
              <small> / {letters.length}</small>
            </strong>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon yellow">
            <Check size={19} />
          </div>
          <div>
            <span>Feeling familiar</span>
            <strong>
              {masteredCount}
              <small> mastered</small>
            </strong>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon peach">
            <Clock size={19} />
          </div>
          <div>
            <span>Ready for review</span>
            <strong>
              {due}
              <small> cards due</small>
            </strong>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon lavender">
            <TrendingUp size={19} />
          </div>
          <div>
            <span>Practice accuracy</span>
            <strong>
              {progress.attempts.length
                ? `${Math.round((correct / progress.attempts.length) * 100)}%`
                : "—"}
              <small>
                {progress.attempts.length
                  ? " all quizzes"
                  : " take your first quiz"}
              </small>
            </strong>
          </div>
        </div>
      </div>
      <section className="alphabet-section">
        <div className="section-header">
          <div>
            <h2>Find your way through the alphabet</h2>
            <p>Six small collections. A world of expression.</p>
          </div>
          <Link href="/reference">
            Explore all letters <ArrowRight size={16} />
          </Link>
        </div>
        <div className="deck-grid">
          {categories.map((c, i) => {
            const group = letters.filter((l) => l.category === c.id);
            const done = group.filter((l) =>
              mastered(progress.cards[l.id]),
            ).length;
            return (
              <Link
                href={`/flashcards?deck=${c.id}`}
                key={c.id}
                className="deck-card"
              >
                <div className="deck-card-top">
                  <span className={`deck-symbol ${c.color}`} lang="ml">
                    {c.glyph}
                  </span>
                  <ArrowUpRight size={19} />
                </div>
                <div className="deck-kicker">
                  COLLECTION 0{i + 1}
                  <span>{group.length} cards</span>
                </div>
                <h3>
                  {c.name}
                  <span lang="ml">{c.malayalam}</span>
                </h3>
                <p>{c.description}</p>
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
      <section className="practice-section">
        <div className="section-header">
          <div>
            <h2>A practice for every kind of day</h2>
            <p>Find a pace and a way that feels like you.</p>
          </div>
          <Sprout size={27} />
        </div>
        <div className="mode-grid">
          {[
            {
              name: "Find your flow",
              label: "Flashcards",
              copy: "Flip, explore, and make the letters familiar.",
              href: "/flashcards",
              icon: Layers,
              color: "sage",
            },
            {
              name: "A little guidance",
              label: "Learn",
              copy: "Small lessons that build on what you know.",
              href: "/learn",
              icon: BookOpen,
              color: "yellow",
            },
            {
              name: "See what’s sticking",
              label: "Test yourself",
              copy: "A friendly check-in with your growing skills.",
              href: "/test",
              icon: ClipboardCheck,
              color: "peach",
            },
          ].map((m) => (
            <Link href={m.href} className="mode-card" key={m.href}>
              <span className={`stat-icon ${m.color}`}>
                <m.icon size={21} />
              </span>
              <div>
                <span className="eyebrow">{m.label}</span>
                <h3>{m.name}</h3>
                <p>{m.copy}</p>
              </div>
              <ArrowRight size={19} />
            </Link>
          ))}
        </div>
      </section>
      <div className="bottom-note">
        <span lang="ml">അക്ഷരം</span>
        <p>
          “Aksharam” means letter.
          <br />
          <strong>And every letter is a beginning.</strong>
        </p>
        <span className="note-flower">✳</span>
      </div>
    </>
  );
}
