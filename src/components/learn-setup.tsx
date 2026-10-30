import { ArrowRight } from "lucide-react";
import {
  learnModes,
  learnPools,
  type LearnMode,
  type LearnDeck,
} from "@/lib/learn";
import type { Progress } from "@/types";
import { DeckSelector } from "./deck-selector";
export function LearnSetup({
  progress,
  now,
  mode,
  setMode,
  deck,
  setDeck,
  count,
  setCount,
  includeNotDue,
  setIncludeNotDue,
  onStart,
}: {
  progress: Progress;
  now: number;
  mode: LearnMode;
  setMode: (m: LearnMode) => void;
  deck: LearnDeck;
  setDeck: (d: LearnDeck) => void;
  count: number;
  setCount: (n: number) => void;
  includeNotDue: boolean;
  setIncludeNotDue: (v: boolean) => void;
  onStart: () => void;
}) {
  const all = learnPools(progress, now);
  const pools = learnPools(progress, now, deck);
  const available =
    mode === "new"
      ? pools.new
      : mode === "difficult"
        ? pools.difficult
        : includeNotDue
          ? pools.learned
          : pools.due;
  return (
    <div className="learn-setup">
      <dl className="learn-counts" aria-label="Learning counts">
        {[
          { name: "New", count: all.new.length },
          { name: "Learned", count: all.learned.length },
          { name: "Due", count: all.due.length },
          { name: "Difficult", count: all.difficult.length },
        ].map((item) => (
          <div key={item.name}>
            <dt>{item.name}</dt>
            <dd>{item.count}</dd>
          </div>
        ))}
      </dl>
      <div className="learn-modes" role="group" aria-label="Learn mode">
        {learnModes.map((item) => (
          <button
            key={item.id}
            className={`learn-mode panel ${mode === item.id ? "selected" : ""}`}
            aria-label={item.title}
            aria-pressed={mode === item.id}
            onClick={() => setMode(item.id)}
          >
            <strong>{item.title}</strong>
            <span>{item.description}</span>
            <small>
              {
                (item.id === "new"
                  ? all.new
                  : item.id === "review"
                    ? all.learned
                    : all.difficult
                ).length
              }{" "}
              letters
            </small>
          </button>
        ))}
      </div>
      <section className="panel setup-panel" aria-label="Session options">
        <h2>{learnModes.find((m) => m.id === mode)!.title}</h2>
        <div className="learn-options">
          <DeckSelector
            value={deck}
            onChange={(d) => {
              if (d !== "review") setDeck(d);
            }}
            review={false}
          />
          <div className="select-field">
            <label htmlFor="learn-count">
              {mode === "new"
                ? "New letters per session"
                : "Letters per session"}
            </label>
            <select
              id="learn-count"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "letter" : "letters"}
                </option>
              ))}
            </select>
          </div>
        </div>
        {mode === "review" && (
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeNotDue}
              onChange={(e) => setIncludeNotDue(e.target.checked)}
            />
            Include all learned letters, even if not due
          </label>
        )}
        <p role="status">
          {available.length}{" "}
          {mode === "new"
            ? "new"
            : mode === "difficult"
              ? "difficult"
              : includeNotDue
                ? "learned"
                : "due"}{" "}
          {available.length === 1 ? "letter" : "letters"} available
          {available.length
            ? ` · ${Math.min(count, available.length)} in this session`
            : ""}
          .
        </p>
        {mode === "new" && (
          <p className="muted">
            Core forms come first. Uncommon, historic, and scholarly forms are
            labeled.
          </p>
        )}
        {available.length ? (
          <button className="button primary wide" onClick={onStart}>
            {mode === "new"
              ? "Start learning"
              : mode === "review"
                ? "Start review"
                : "Start difficult practice"}
            <ArrowRight size={18} />
          </button>
        ) : (
          <div className="learn-empty">
            <p>
              {mode === "new"
                ? all.new.length
                  ? "No new letters in this collection."
                  : "All letters have been introduced."
                : mode === "difficult"
                  ? "No difficult letters in this selection."
                  : pools.learned.length
                    ? "No reviews are due in this selection."
                    : "No letters have been studied in this selection."}
            </p>
            <div className="button-row">
              {deck !== "all" && (
                <button
                  className="button secondary"
                  onClick={() => setDeck("all")}
                >
                  All collections
                </button>
              )}
              {mode === "new" ? (
                <button
                  className="button secondary"
                  onClick={() => {
                    setMode("review");
                    setIncludeNotDue(true);
                  }}
                >
                  Review all learned letters
                </button>
              ) : mode === "review" &&
                pools.learned.length &&
                !includeNotDue ? (
                <button
                  className="button secondary"
                  onClick={() => setIncludeNotDue(true)}
                >
                  Review all learned letters
                </button>
              ) : (
                <button
                  className="button secondary"
                  onClick={() => setMode("new")}
                >
                  Learn new letters
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
