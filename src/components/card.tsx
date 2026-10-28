"use client";
import { RotateCw } from "lucide-react";
import { useId, useRef, type TouchEvent } from "react";
import { categories } from "@/data/alphabet";
import type { Letter } from "@/types";
export function Card({
  letter,
  flipped,
  onFlip,
  reverse = false,
  onNavigate,
}: {
  letter: Letter;
  flipped: boolean;
  onFlip: () => void;
  reverse?: boolean;
  onNavigate?: (direction: number) => void;
}) {
  const noteId = useId();
  const start = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  function touchStart(event: TouchEvent<HTMLButtonElement>) {
    swiped.current = false;
    const touch = event.touches[0];
    start.current =
      event.touches.length === 1
        ? { x: touch.clientX, y: touch.clientY }
        : null;
  }
  function touchEnd(event: TouchEvent<HTMLButtonElement>) {
    const origin = start.current;
    start.current = null;
    if (!origin || !onNavigate || event.touches.length) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - origin.x;
    const dy = touch.clientY - origin.y;
    if (Math.abs(dx) >= 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      swiped.current = true;
      onNavigate(dx < 0 ? 1 : -1);
    }
  }
  const glyph = (
    <span className="card-glyph" lang="ml">
      {letter.display ?? letter.glyph}
    </span>
  );
  const description = (
    <>
      <span className="roman-large">{letter.romanization}</span>
      <span className="pronunciation">
        {letter.approximation ?? letter.subgroup}
      </span>
      <span className="card-note" id={noteId}>
        {letter.note}
      </span>
      {letter.category === "signs" && (
        <span className="combination" lang="ml">
          ക + {letter.display} → ക{letter.glyph}
        </span>
      )}
    </>
  );
  return (
    <button
      className={`flashcard ${flipped ? "flipped" : ""}`}
      onClick={() => {
        if (swiped.current) {
          swiped.current = false;
          return;
        }
        onFlip();
      }}
      onTouchStart={touchStart}
      onTouchEnd={touchEnd}
      onTouchCancel={() => {
        start.current = null;
      }}
      aria-label={`${flipped ? "Back" : "Front"} of flashcard. ${flipped ? letter.romanization : reverse ? letter.romanization : letter.glyph}. Tap or press Space to flip`}
      aria-pressed={flipped}
      aria-describedby={flipped !== reverse ? noteId : undefined}
    >
      <span className="card-inner">
        <span className="card-face card-front" aria-hidden={flipped}>
          <span className="card-top">
            <span>{reverse ? "ROMANIZATION" : "MALAYALAM"}</span>
            <span>
              {categories.find((c) => c.id === letter.category)?.name} ·{" "}
              {letter.usage === "core" ? "Core" : letter.usage}
            </span>
          </span>
          <span className="card-center">{reverse ? description : glyph}</span>
          <span className="flip-prompt">
            <RotateCw size={14} /> Tap to reveal <kbd>space</kbd>
          </span>
        </span>
        <span className="card-face card-back" aria-hidden={!flipped}>
          <span className="card-top">
            <span>{reverse ? "MALAYALAM" : "PRONUNCIATION"}</span>
            <span>{letter.subgroup}</span>
          </span>
          <span className="card-center">{reverse ? glyph : description}</span>
          <span className="flip-prompt">
            <RotateCw size={14} /> Tap to flip back
          </span>
        </span>
      </span>
    </button>
  );
}
