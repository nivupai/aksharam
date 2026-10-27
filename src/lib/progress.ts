import { letterById } from "@/data/alphabet";
import type { CardProgress, Progress, Rating } from "@/types";
export const STORAGE_KEY = "aksharam.progress.v1";
export const DAY = 86_400_000;
export function emptyProgress(): Progress {
  return {
    version: 1,
    cards: {},
    favorites: [],
    introduced: [],
    attempts: [],
    studyDays: [],
    preferences: { dailyGoal: 10, lessonSize: 5 },
  };
}
export function localDay(now = Date.now()): string {
  const d = new Date(now);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function schedule(
  previous: CardProgress | undefined,
  rating: Rating,
  now: number,
): CardProgress {
  const old = previous?.interval ?? 0;
  const interval =
    rating === "again"
      ? 10 / 1440
      : rating === "hard"
        ? Math.max(1, old * 1.2)
        : rating === "good"
          ? Math.max(1, old * 2)
          : Math.max(3, old * 2.5);
  return {
    lastReviewed: now,
    nextReview: now + interval * DAY,
    interval,
    lapses: (previous?.lapses ?? 0) + (rating === "again" ? 1 : 0),
    successStreak:
      rating === "again" || rating === "hard"
        ? 0
        : (previous?.successStreak ?? 0) + 1,
    history: [...(previous?.history ?? []), { rating, at: now }],
  };
}
export function mastered(card: CardProgress | undefined): boolean {
  return !!card && card.successStreak >= 3 && card.interval >= 7;
}
export function reviewCard(
  progress: Progress,
  id: string,
  rating: Rating,
  now = Date.now(),
): Progress {
  if (!letterById[id]) return progress;
  return {
    ...progress,
    cards: {
      ...progress.cards,
      [id]: schedule(progress.cards[id], rating, now),
    },
    introduced: Array.from(new Set([...progress.introduced, id])),
    studyDays: Array.from(new Set([...progress.studyDays, localDay(now)])),
  };
}
export function streak(days: string[], now = Date.now()): number {
  const date = new Date(now);
  let count = 0;
  if (!days.includes(localDay(date.getTime())))
    date.setDate(date.getDate() - 1);
  while (days.includes(localDay(date.getTime()))) {
    count++;
    date.setDate(date.getDate() - 1);
  }
  return count;
}
const record = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const numeric = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;
const ratings = ["again", "hard", "good", "easy"];
const ids = (v: unknown): v is string[] =>
  Array.isArray(v) &&
  v.every((id) => typeof id === "string" && Object.hasOwn(letterById, id)) &&
  new Set(v).size === v.length;
export function parseProgress(raw: string): Progress {
  if (raw.length > 10_000_000)
    throw new Error(
      "This file is too large. Choose an Aksharam progress export under 10 MB.",
    );
  const p: unknown = JSON.parse(raw);
  if (
    !record(p) ||
    p.version !== 1 ||
    !record(p.cards) ||
    !ids(p.favorites) ||
    !ids(p.introduced) ||
    !Array.isArray(p.attempts) ||
    !Array.isArray(p.studyDays) ||
    !record(p.preferences)
  )
    throw new Error("This is not a supported Aksharam v1 progress file.");
  const pref = p.preferences;
  if (
    !Number.isInteger(pref.dailyGoal) ||
    Number(pref.dailyGoal) < 1 ||
    Number(pref.dailyGoal) > 100 ||
    !Number.isInteger(pref.lessonSize) ||
    Number(pref.lessonSize) < 1 ||
    Number(pref.lessonSize) > 20
  )
    throw new Error("Invalid study preferences.");
  for (const [id, c] of Object.entries(p.cards)) {
    if (
      !Object.hasOwn(letterById, id) ||
      !p.introduced.includes(id) ||
      !record(c) ||
      ![
        "lastReviewed",
        "nextReview",
        "interval",
        "lapses",
        "successStreak",
      ].every((k) => numeric(c[k])) ||
      !Number.isInteger(c.lapses) ||
      !Number.isInteger(c.successStreak) ||
      !Array.isArray(c.history) ||
      !c.history.length ||
      !c.history.every(
        (h) => record(h) && numeric(h.at) && ratings.includes(String(h.rating)),
      )
    )
      throw new Error("Invalid card review data.");
    const history = c.history as { at: number; rating: Rating }[];
    if (
      history.some((h, i) => i > 0 && h.at < history[i - 1].at) ||
      history.at(-1)?.at !== c.lastReviewed
    )
      throw new Error("Review history is inconsistent.");
  }
  if (
    !p.attempts.every(
      (a) =>
        record(a) &&
        numeric(a.at) &&
        typeof a.correct === "boolean" &&
        typeof a.cardId === "string" &&
        Object.hasOwn(letterById, a.cardId) &&
        letterById[a.cardId].category === a.category,
    )
  )
    throw new Error("Invalid quiz history.");
  if (
    !p.studyDays.every(
      (d) =>
        typeof d === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(d) &&
        !Number.isNaN(Date.parse(d)),
    ) ||
    new Set(p.studyDays).size !== p.studyDays.length
  )
    throw new Error("Invalid study dates.");
  // Explicit construction strips unrecognized top-level fields from imported files.
  return {
    version: 1,
    cards: p.cards as Progress["cards"],
    favorites: p.favorites,
    introduced: p.introduced,
    attempts: p.attempts as Progress["attempts"],
    studyDays: p.studyDays as string[],
    preferences: {
      dailyGoal: Number(pref.dailyGoal),
      lessonSize: Number(pref.lessonSize),
    },
  };
}
export function loadProgress(storage: Pick<Storage, "getItem">): {
  progress: Progress;
  error?: string;
} {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return { progress: raw ? parseProgress(raw) : emptyProgress() };
  } catch {
    return {
      progress: emptyProgress(),
      error:
        "Saved progress could not be read. A fresh session has been opened; you can restore a valid export in Settings.",
    };
  }
}
export function saveProgress(
  storage: Pick<Storage, "setItem">,
  p: Progress,
): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(p));
}
