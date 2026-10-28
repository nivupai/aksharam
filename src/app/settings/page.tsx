"use client";
import { useRef, useState } from "react";
import {
  Download,
  Upload,
  Trash2,
  Check,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { emptyProgress, parseProgress } from "@/lib/progress";
import { PageHeading } from "@/components/ui";
export default function SettingsPage() {
  const { progress, preferences, replace } = useProgress();
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  function exportData() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(progress, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `aksharam-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setError(false);
    setStatus("Your progress export is ready.");
  }
  async function importData(file: File | undefined) {
    if (!file) return;
    try {
      if (file.size > 10_000_000)
        throw new Error("Choose a progress export under 10 MB.");
      const p = parseProgress(await file.text());
      if (
        window.confirm(
          `Replace this browser’s progress with the imported file? It contains ${p.introduced.length} introduced cards and ${Object.keys(p.cards).length} practiced cards.`,
        )
      ) {
        replace(p);
        setError(false);
        setStatus("Your progress has been restored.");
      }
    } catch (e) {
      setError(true);
      setStatus(e instanceof Error ? e.message : "Could not import this file.");
    } finally {
      if (input.current) input.current.value = "";
    }
  }
  return (
    <>
      <PageHeading title="Settings" />
      <div className="settings-grid">
        <section className="panel settings-panel">
          <div className="settings-title">
            <Settings size={22} />
            <h2>Study preferences</h2>
          </div>
          <label className="setting-row" htmlFor="goal">
            <span>
              <strong>Daily practice goal</strong>
              <small>Rated cards and quiz answers per day.</small>
            </span>
            <select
              id="goal"
              value={progress.preferences.dailyGoal}
              onChange={(e) =>
                preferences({ dailyGoal: Number(e.target.value) })
              }
            >
              {Array.from(
                new Set([5, 10, 15, 20, 30, progress.preferences.dailyGoal]),
              )
                .sort((a, b) => a - b)
                .map((n) => (
                  <option key={n} value={n}>
                    {n} cards
                  </option>
                ))}
            </select>
          </label>
          <label className="setting-row" htmlFor="lesson-size">
            <span>
              <strong>Letters per lesson</strong>
              <small>
                Each letter gets a reading, recognition, and recall step.
              </small>
            </span>
            <select
              id="lesson-size"
              value={progress.preferences.lessonSize}
              onChange={(e) =>
                preferences({ lessonSize: Number(e.target.value) })
              }
            >
              {Array.from(
                new Set([3, 5, 7, 10, progress.preferences.lessonSize]),
              )
                .sort((a, b) => a - b)
                .map((n) => (
                  <option key={n} value={n}>
                    {n} letters
                  </option>
                ))}
            </select>
          </label>
        </section>
        <section className="panel settings-panel">
          <div className="settings-title">
            <ShieldCheck size={22} />
            <h2>Progress backups</h2>
          </div>
          <p>
            Your learning history stays in this browser’s local storage. Export
            a backup to keep it safe or move it to another device. Importing
            replaces this browser’s progress.
          </p>
          <div className="button-row">
            <button className="button primary" onClick={exportData}>
              <Download size={17} />
              Export progress
            </button>
            <button
              className="button secondary"
              onClick={() => input.current?.click()}
            >
              <Upload size={17} />
              Import JSON
            </button>
            <input
              ref={input}
              type="file"
              accept=".json,application/json"
              className="sr-only"
              aria-label="Import progress JSON"
              onChange={(e) => void importData(e.target.files?.[0])}
            />
          </div>
        </section>
        <section className="panel settings-panel">
          <h2>Review schedule</h2>
          <p>
            Again returns in 10 minutes. Hard waits at least a day. Good starts
            at a day and doubles the previous interval. Easy starts at 3 days
            and multiplies by 2.5. Hard grows a previous interval by 1.2.
          </p>
          <p>
            A letter is mastered after at least 3 consecutive Good or Easy
            reviews and an interval of 7 days or more. Again and Hard reset that
            streak. Only Again counts as a lapse. This is a lightweight
            deterministic scheduler, not SM-2 or FSRS.
          </p>
          <p>
            Due cards are prioritized in lessons. Custom Review includes due and
            bookmarked cards, frozen when a flashcard session opens. Quiz
            accuracy uses scored answers; flashcard self-ratings are excluded.
          </p>
        </section>
        <section className="panel settings-panel reset-panel">
          <h2>Reset progress</h2>
          <p>
            Reset all reviews, bookmarks, quiz history, and preferences on this
            browser. Export a backup first if you’d like to return to them.
          </p>
          <button
            className="button danger"
            onClick={() => {
              if (
                window.confirm(
                  "Permanently reset all Aksharam progress in this browser? This cannot be undone without an export.",
                )
              ) {
                replace(emptyProgress());
                setError(false);
                setStatus("Progress has been reset.");
              }
            }}
          >
            <Trash2 size={17} />
            Reset progress
          </button>
        </section>
      </div>
      {status && (
        <div
          className={`notice ${error ? "error" : "success"}`}
          role={error ? "alert" : "status"}
        >
          <Check size={19} />
          {status}
        </div>
      )}
    </>
  );
}
