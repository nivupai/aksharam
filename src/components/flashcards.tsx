"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Shuffle,
  ArrowLeftRight,
  Check,
  Layers,
  Keyboard,
} from "lucide-react";
import { letters, categories } from "@/data/alphabet";
import { useProgress } from "@/hooks/use-progress";
import { shuffled } from "@/lib/quiz";
import type { Deck, Rating } from "@/types";
import { Card } from "./card";
import { DeckSelector } from "./deck-selector";
import { AudioButton } from "./audio-button";
import { PageHeading, ProgressBar } from "./ui";
export function Flashcards() {
  const { ready } = useProgress();
  return ready ? (
    <FlashcardsSession />
  ) : (
    <p className="muted">Getting your cards ready…</p>
  );
}
function FlashcardsSession() {
  const params = useSearchParams();
  const initial = params.get("deck");
  const valid = (v: string | null): v is Deck =>
    v === "all" || v === "review" || categories.some((c) => c.id === v);
  const [deck, setDeck] = useState<Deck>(valid(initial) ? initial : "vowels");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [includeRare, setIncludeRare] = useState(false);
  const [order, setOrder] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const { progress, rate, introduce, favorite } = useProgress();
  // Freeze the custom review selection for this session, so rating a due card does not remove it mid-flip.
  const [reviewIds] = useState(() =>
    letters
      .filter(
        (l) =>
          progress.favorites.includes(l.id) ||
          (progress.cards[l.id]?.nextReview ?? Infinity) <= Date.now(),
      )
      .sort(
        (a, b) =>
          (progress.cards[a.id]?.nextReview ?? Infinity) -
          (progress.cards[b.id]?.nextReview ?? Infinity),
      )
      .map((l) => l.id),
  );
  const pool = useMemo(
    () =>
      letters.filter(
        (l) =>
          (deck === "all" ||
            (deck === "review" && reviewIds.includes(l.id)) ||
            l.category === deck) &&
          (includeRare || l.usage === "core"),
      ),
    [deck, includeRare, reviewIds],
  );
  const cards = useMemo(
    () =>
      deck === "review" && !order.length
        ? [...pool].sort(
            (a, b) => reviewIds.indexOf(a.id) - reviewIds.indexOf(b.id),
          )
        : order.length
          ? [...pool].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
          : pool,
    [order, pool, deck, reviewIds],
  );
  const letter = cards[index % Math.max(1, cards.length)];
  const navigate = useCallback(
    (by: number) => {
      setIndex((i) => (i + by + cards.length) % Math.max(1, cards.length));
      setFlipped(false);
      setFeedback("");
    },
    [cards.length],
  );
  const flip = useCallback(() => {
    setFlipped((f) => !f);
    if (letter) introduce(letter.id);
  }, [letter, introduce]);
  const rating = useCallback(
    (value: Rating) => {
      if (!letter) return;
      rate(letter.id, value);
      setFeedback(`${letter.romanization} saved as ${value}.`);
      if (index < cards.length - 1) {
        setIndex((i) => i + 1);
        setFlipped(false);
      }
    },
    [letter, rate, index, cards.length],
  );
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLElement &&
        (e.target.matches("input,textarea,select") ||
          e.target.isContentEditable)
      )
        return;
      if (
        e.code === "Space" &&
        !(e.target instanceof HTMLElement && e.target.closest("button,a"))
      ) {
        e.preventDefault();
        flip();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigate(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        navigate(1);
      }
      const r: Record<string, Rating> = {
        "1": "again",
        "2": "hard",
        "3": "good",
        "4": "easy",
      };
      if (r[e.key]) rating(r[e.key]);
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [flip, navigate, rating]);
  function changeDeck(d: Deck) {
    setDeck(d);
    setIndex(0);
    setFlipped(false);
    setOrder([]);
    setFeedback("");
  }
  return (
    <>
      <PageHeading
        eyebrow="MAKE YOURSELF FAMILIAR"
        title="One letter. A little closer."
        description="Take your time, turn a card, and let the shapes become familiar."
      />
      <div className="study-layout">
        <section className="study-main" aria-label="Flashcard study">
          <div className="study-toolbar">
            <DeckSelector value={deck} onChange={changeDeck} />
            <div className="toolbar-actions">
              <button
                className={`icon-button ${order.length ? "selected" : ""}`}
                aria-label={
                  order.length ? "Use alphabet order" : "Shuffle cards"
                }
                title={order.length ? "Use alphabet order" : "Shuffle cards"}
                onClick={() => {
                  setOrder(order.length ? [] : shuffled(pool).map((c) => c.id));
                  setIndex(0);
                  setFlipped(false);
                }}
              >
                <Shuffle size={18} />
              </button>
              <button
                className={`icon-button ${reverse ? "selected" : ""}`}
                aria-label="Reverse card direction"
                aria-pressed={reverse}
                title="Reverse card direction"
                onClick={() => {
                  setReverse((v) => !v);
                  setFlipped(false);
                }}
              >
                <ArrowLeftRight size={18} />
              </button>
            </div>
          </div>
          {letter ? (
            <>
              <div className="study-meta">
                <span>
                  {order.length ? "Shuffled" : "Alphabet order"}{" "}
                  <span className="small-dot">·</span>{" "}
                  {reverse ? "English → Malayalam" : "Malayalam → English"}
                </span>
                <button
                  className={`bookmark-button ${progress.favorites.includes(letter.id) ? "selected" : ""}`}
                  aria-label={
                    progress.favorites.includes(letter.id)
                      ? "Remove bookmark"
                      : "Bookmark letter"
                  }
                  aria-pressed={progress.favorites.includes(letter.id)}
                  onClick={() => favorite(letter.id)}
                >
                  <Bookmark
                    size={17}
                    fill={
                      progress.favorites.includes(letter.id)
                        ? "currentColor"
                        : "none"
                    }
                  />
                  {progress.favorites.includes(letter.id)
                    ? "Bookmarked"
                    : "Save for later"}
                </button>
              </div>
              <Card
                key={letter.id}
                letter={letter}
                flipped={flipped}
                onFlip={flip}
                reverse={reverse}
              />
              <div className="card-navigation">
                <button
                  className="round-button"
                  aria-label="Previous card"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft size={20} />
                </button>
                <span>
                  <strong>{(index % cards.length) + 1}</strong> / {cards.length}{" "}
                  cards
                </span>
                <button
                  className="round-button"
                  aria-label="Next card"
                  onClick={() => navigate(1)}
                >
                  <ArrowRight size={20} />
                </button>
              </div>
              <ProgressBar
                value={((index + 1) / cards.length) * 100}
                label="Position in deck"
              />
              <div className="rating-area">
                <div className="section-caption">
                  HOW WELL DID YOU KNOW THIS LETTER?
                </div>
                <div className="rating-grid">
                  {(["again", "hard", "good", "easy"] as const).map((r, i) => (
                    <button
                      key={r}
                      onClick={() => rating(r)}
                      className={`rating ${r}`}
                    >
                      <span>{i + 1}</span>
                      {r[0].toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="save-feedback" role="status">
                  {feedback ||
                    "Your honest rating helps us find the right time to review."}
                </p>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Check size={32} />
              <h2>A little breathing room.</h2>
              <p>
                No cards in this review deck. Bookmark letters or come back when
                a review is due.
              </p>
              <button
                className="button primary"
                onClick={() => changeDeck("vowels")}
              >
                Explore vowels <ArrowRight size={17} />
              </button>
            </div>
          )}
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeRare}
              onChange={(e) => {
                setIncludeRare(e.target.checked);
                setIndex(0);
                setFlipped(false);
              }}
            />{" "}
            Include uncommon, historic & scholarly forms
          </label>
        </section>
        <aside className="study-aside">
          <div className="panel study-tip">
            <div className="section-caption">
              <LeafIcon /> A LITTLE LANGUAGE NOTE
            </div>
            <h3>Longer is different.</h3>
            <div className="tip-glyphs" lang="ml">
              അ <span>→</span> ആ
            </div>
            <p>
              Vowel length matters in Malayalam. A short sound and its longer
              partner can change a word’s meaning.
            </p>
            <Link href="/reference">
              Explore the alphabet <ArrowRight size={15} />
            </Link>
          </div>
          {letter && (
            <div className="panel audio-panel">
              <h3>Find the sound</h3>
              <p>
                Read the pronunciation tip on the back. Native recordings can be
                added as they become available.
              </p>
              <AudioButton key={letter.id} letter={letter} />
            </div>
          )}
          <div className="keyboard-guide">
            <Keyboard size={18} />
            <span>
              <kbd>space</kbd> flip <kbd>←</kbd>
              <kbd>→</kbd> navigate
              <br />
              <kbd>1</kbd>–<kbd>4</kbd> rate your recall
            </span>
          </div>
          <Link href="/learn" className="quiet-link">
            <Layers size={16} />
            Prefer a little guidance? Try Learn <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
    </>
  );
}
function LeafIcon() {
  return <span aria-hidden="true">✦</span>;
}
