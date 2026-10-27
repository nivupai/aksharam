"use client";
import { RotateCw } from "lucide-react";
import { categories } from "@/data/alphabet";
import type { Letter } from "@/types";
export function Card({
  letter,
  flipped,
  onFlip,
  reverse = false,
}: {
  letter: Letter;
  flipped: boolean;
  onFlip: () => void;
  reverse?: boolean;
}) {
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
      <span className="card-note">{letter.note}</span>
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
      onClick={onFlip}
      aria-label={`${flipped ? "Back" : "Front"} of flashcard. ${flipped ? letter.romanization : reverse ? letter.romanization : letter.glyph}. Click to flip`}
      aria-pressed={flipped}
    >
      <span className="card-inner">
        <span className="card-face card-front">
          <span className="card-top">
            <span>{reverse ? "ROMANIZATION" : "MALAYALAM"}</span>
            <span>
              {categories.find((c) => c.id === letter.category)?.name} ·{" "}
              {letter.usage === "core" ? "Core" : letter.usage}
            </span>
          </span>
          <span className="card-center">{reverse ? description : glyph}</span>
          <span className="flip-prompt">
            <RotateCw size={14} /> Click to reveal <kbd>space</kbd>
          </span>
        </span>
        <span className="card-face card-back">
          <span className="card-top">
            <span>{reverse ? "MALAYALAM" : "THE SOUND & THE STORY"}</span>
            <span>{letter.subgroup}</span>
          </span>
          <span className="card-center">{reverse ? glyph : description}</span>
          <span className="flip-prompt">
            <RotateCw size={14} /> Click to flip back
          </span>
        </span>
      </span>
    </button>
  );
}
