import { describe, it, expect, vi } from "vitest";
import { categories, letters, coreLetters } from "@/data/alphabet";
import {
  DAY,
  emptyProgress,
  schedule,
  reviewCard,
  mastered,
  parseProgress,
  loadProgress,
  saveProgress,
  streak,
  localDay,
  STORAGE_KEY,
} from "@/lib/progress";
import { makeQuestion, isCorrect, normalizeAnswer, score } from "@/lib/quiz";
describe("dataset integrity", () => {
  it("has unique stable IDs, valid glyphs, metadata and ordered categories", () => {
    expect(new Set(letters.map((l) => l.id)).size).toBe(letters.length);
    expect(new Set(letters.map((l) => l.glyph)).size).toBe(letters.length);
    for (const category of categories) {
      const rows = letters.filter((l) => l.category === category.id);
      expect(rows.length).toBeGreaterThan(0);
      rows.forEach((l, i) => {
        expect(l.order).toBe(i);
        expect(l.romanization.length).toBeGreaterThan(0);
        expect(l.note.trim().length).toBeGreaterThan(0);
        expect(l.subgroup).toBeTruthy();
        expect(
          Array.from(l.glyph).every((c) => {
            const cp = c.codePointAt(0)!;
            return cp >= 0xd00 && cp <= 0xd7f;
          }),
        ).toBe(true);
      });
    }
  });
  it("separates vowels from combining signs and retains the dental/retroflex distinctions", () => {
    expect(letters.find((l) => l.glyph === "ാ")?.category).toBe("signs");
    expect(letters.find((l) => l.glyph === "ആ")?.category).toBe("vowels");
    for (const glyph of ["ന", "ണ", "ൻ", "ല", "ള", "ഴ"])
      expect(letters.find((l) => l.glyph === glyph)).toBeDefined();
    expect(letters.find((l) => l.glyph === "ക്ഷ")?.glyph).toBe(
      "\u0d15\u0d4d\u0d37",
    );
    expect(letters.find((l) => l.glyph === "ൟ")?.usage).toBe("historic");
  });
  it("uses atomic chillu code points and keeps signs grapheme-safe", () => {
    for (const l of letters.filter((l) => l.category === "chillu"))
      expect(Array.from(l.glyph)).toHaveLength(1);
    const segmenter = new Intl.Segmenter("ml", { granularity: "grapheme" });
    expect([...segmenter.segment("ക്ഷ")]).toHaveLength(1);
  });
});
describe("deterministic review schedule", () => {
  const now = 1_700_000_000_000;
  it("sets exact first intervals and does not mutate previous history", () => {
    const good = schedule(undefined, "good", now);
    expect(good.nextReview).toBe(now + DAY);
    const easy = schedule(good, "easy", now + DAY);
    expect(easy.interval).toBe(3);
    expect(good.history).toHaveLength(1);
    expect(easy.history).toHaveLength(2);
    expect(schedule(undefined, "again", now).nextReview).toBe(now + 600_000);
    expect(schedule(undefined, "hard", now).interval).toBe(1);
  });
  it("requires repeated success and resets mastery on failure or hard", () => {
    let card = schedule(undefined, "good", now);
    expect(mastered(card)).toBe(false);
    card = schedule(card, "good", now + DAY);
    card = schedule(card, "good", now + 3 * DAY);
    expect(mastered(card)).toBe(false);
    card = schedule(card, "good", now + 7 * DAY);
    expect(mastered(card)).toBe(true);
    const failed = schedule(card, "again", now + 15 * DAY);
    expect(mastered(failed)).toBe(false);
    expect(failed.lapses).toBe(1);
    expect(schedule(card, "hard", now).successStreak).toBe(0);
  });
  it("tracks local-calendar streaks including yesterday and year transitions", () => {
    const now = new Date(2026, 0, 1, 12).getTime();
    expect(streak(["2025-12-30", "2025-12-31", "2026-01-01"], now)).toBe(3);
    expect(streak(["2025-12-31"], now)).toBe(1);
    expect(streak(["2025-12-30"], now)).toBe(0);
    expect(localDay(now)).toBe("2026-01-01");
  });
});
describe("versioned persistence", () => {
  const id = letters[0].id;
  it("round-trips review history and preferences", () => {
    const p = reviewCard(emptyProgress(), id, "good", 1_700_000_000_000);
    p.favorites = [id];
    saveProgress(localStorage, p);
    expect(loadProgress(localStorage).progress).toEqual(p);
    expect(parseProgress(JSON.stringify(p))).toEqual(p);
    expect(p.studyDays).toHaveLength(1);
  });
  it("recovers from corrupt, stale or inaccessible storage", () => {
    for (const raw of [
      "{",
      "null",
      '{"version":2}',
      JSON.stringify({ ...emptyProgress(), cards: { bad: {} } }),
    ]) {
      localStorage.setItem(STORAGE_KEY, raw);
      expect(loadProgress(localStorage).error).toBeTruthy();
      expect(loadProgress(localStorage).progress).toEqual(emptyProgress());
    }
    expect(
      loadProgress({
        getItem: () => {
          throw new Error("blocked");
        },
      }).error,
    ).toBeTruthy();
  });
  it("rejects invalid imports without accepting malformed nested data", () => {
    const p = reviewCard(emptyProgress(), id, "good", 100);
    const invalid = [
      { ...p, favorites: ["unknown"] },
      { ...p, preferences: { dailyGoal: 0, lessonSize: 5 } },
      {
        ...p,
        attempts: [{ at: 100, cardId: id, correct: "yes", category: "vowels" }],
      },
      { ...p, cards: { [id]: { ...p.cards[id], nextReview: -5 } } },
      { ...p, cards: { [id]: { ...p.cards[id], history: [] } } },
    ];
    for (const value of invalid)
      expect(() => parseProgress(JSON.stringify(value))).toThrow();
  });
  it("reports save errors to the caller", () => {
    expect(() =>
      saveProgress(
        {
          setItem: vi.fn(() => {
            throw new Error("full");
          }),
        },
        emptyProgress(),
      ),
    ).toThrow("full");
  });
});
describe("quiz scoring", () => {
  const a = coreLetters[0];
  it("makes unambiguous questions with same-category distractors", () => {
    for (const letter of coreLetters) {
      const q = makeQuestion(letter, "recognition", () => 0.4);
      expect(q.options).toContain(letter);
      expect(q.options.every((o) => o.category === letter.category)).toBe(true);
      expect(new Set(q.options.map((o) => o.romanization)).size).toBe(
        q.options.length,
      );
      expect(q.options.length).toBeGreaterThan(1);
      expect(isCorrect(q, letter.id)).toBe(true);
      expect(isCorrect(q, "wrong")).toBe(false);
    }
  });
  it("normalizes case, Unicode and whitespace without erasing meaningful accents", () => {
    const long = coreLetters.find((l) => l.glyph === "ആ")!;
    const q = makeQuestion(long, "typing");
    expect(isCorrect(q, " Ā  ")).toBe(true);
    expect(isCorrect(q, "a\u0304")).toBe(true);
    expect(isCorrect(q, "a")).toBe(false);
    expect(normalizeAnswer(" A ")).toBe("a");
  });
  it("calculates percentages from actual scored attempts", () => {
    const q = makeQuestion(a, "recognition");
    expect(score([])).toBe(0);
    expect(
      score([
        { question: q, response: a.id, correct: true },
        { question: q, response: "no", correct: false },
        { question: q, response: a.id, correct: true },
      ]),
    ).toBe(67);
  });
});
