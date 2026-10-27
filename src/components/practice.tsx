"use client";
import { useState } from "react";
import { ArrowRight, BookOpen, Check, Layers } from "lucide-react";
import { categories, coreLetters, letterById } from "@/data/alphabet";
import { useProgress } from "@/hooks/use-progress";
import { mastered } from "@/lib/progress";
import {
  makeQuestion,
  shuffled,
  type Question,
  type QuestionType,
  type Answer,
} from "@/lib/quiz";
import type { Deck, Letter } from "@/types";
import { PageHeading, ProgressBar } from "./ui";
import { DeckSelector } from "./deck-selector";
import { QuizQuestion } from "./quiz-question";
import { Results } from "./results";
import { AudioButton } from "./audio-button";
type Step =
  | { kind: "read"; letter: Letter }
  | { kind: "question"; question: Question; retry?: boolean };
export function Practice({ lesson = false }: { lesson?: boolean }) {
  const { progress, answer, introduce } = useProgress();
  const suggested = categories.find((c) =>
    coreLetters.some(
      (l) => l.category === c.id && !mastered(progress.cards[l.id]),
    ),
  );
  const [deck, setDeck] = useState<Deck>(suggested?.id ?? "vowels");
  const [count, setCount] = useState(10);
  const [types, setTypes] = useState<QuestionType[]>([
    "recognition",
    "reverse",
  ]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [phase, setPhase] = useState<"setup" | "session" | "results">("setup");
  function start(custom?: Letter[]) {
    let pool = coreLetters.filter((l) => deck === "all" || l.category === deck);
    let chosen: Letter[];
    if (custom) chosen = custom;
    else if (lesson) {
      pool = pool.sort((a, b) => {
        const ap = progress.cards[a.id];
        const bp = progress.cards[b.id];
        const priority = (p: typeof ap) =>
          !p ? 1 : p.nextReview <= Date.now() ? 0 : 2;
        return priority(ap) - priority(bp);
      });
      chosen = pool.slice(0, progress.preferences.lessonSize);
    } else chosen = shuffled(pool).slice(0, count);
    const next: Step[] =
      lesson && !custom
        ? [
            ...chosen.map((letter) => ({ kind: "read" as const, letter })),
            ...chosen.map((letter) => ({
              kind: "question" as const,
              question: makeQuestion(letter, "recognition"),
            })),
            ...shuffled(chosen).map((letter) => ({
              kind: "question" as const,
              question: makeQuestion(letter, "reverse"),
            })),
          ]
        : chosen.map((letter, i) => ({
            kind: "question" as const,
            question: makeQuestion(
              letter,
              lesson ? "recognition" : types[i % types.length],
            ),
          }));
    setSteps(next);
    setIndex(0);
    setAnswers([]);
    setPhase("session");
  }
  function record(response: string, correct: boolean) {
    const step = steps[index];
    if (step.kind !== "question") return;
    setAnswers((a) => [...a, { question: step.question, response, correct }]);
    answer(step.question.letter.id, correct);
    if (lesson && !correct && !step.retry)
      setSteps((s) => [
        ...s,
        {
          kind: "question",
          question: makeQuestion(step.question.letter, step.question.type),
          retry: true,
        },
      ]);
  }
  function next() {
    if (index === steps.length - 1) setPhase("results");
    else setIndex((i) => i + 1);
  }
  const step = steps[index];
  const poolCount = coreLetters.filter(
    (l) => deck === "all" || l.category === deck,
  ).length;
  return (
    <>
      <PageHeading
        eyebrow={
          lesson ? "SMALL STEPS, STRONG FOUNDATIONS" : "A FRIENDLY CHECK-IN"
        }
        title={
          lesson ? "Let’s make it familiar." : "See what’s staying with you."
        }
        description={
          lesson
            ? "Meet a few letters, find their sounds, and bring them back to mind."
            : "A little recall goes a long way. No Malayalam keyboard needed."
        }
      />
      {phase === "setup" ? (
        <div className="practice-setup">
          <section className="panel setup-panel">
            <div className={`setup-icon ${lesson ? "sage" : "peach"}`}>
              {lesson ? <BookOpen size={28} /> : <Check size={28} />}
            </div>
            <h2>
              {lesson ? "Your next little lesson" : "Make this practice yours"}
            </h2>
            <p>
              {lesson
                ? `Up to ${progress.preferences.lessonSize} letters. A moment to read, then a little recognition and recall. Due reviews come first.`
                : "Choose a collection and a way to practice. We’ll explain every answer as you go."}
            </p>
            <DeckSelector value={deck} onChange={setDeck} review={false} />
            {!lesson && (
              <>
                <div className="select-field">
                  <label htmlFor="question-count">Number of questions</label>
                  <select
                    id="question-count"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                  >
                    {[5, 10, 15, 20, 30].map((n) => (
                      <option key={n} value={n}>
                        {n} questions
                      </option>
                    ))}
                  </select>
                  <small>
                    Up to {Math.min(poolCount, count)} distinct cards in this
                    collection.
                  </small>
                </div>
                <fieldset className="type-options">
                  <legend>Question types</legend>
                  {(
                    [
                      {
                        id: "recognition",
                        name: "Recognize the sound",
                        sub: "Malayalam → romanization",
                      },
                      {
                        id: "reverse",
                        name: "Find the letter",
                        sub: "Romanization → Malayalam",
                      },
                      {
                        id: "typing",
                        name: "Type the romanization",
                        sub: "Exact accents required; case and outer spaces ignored",
                      },
                    ] as const
                  ).map((t) => (
                    <label key={t.id}>
                      <input
                        type="checkbox"
                        checked={types.includes(t.id)}
                        onChange={(e) =>
                          setTypes((v) =>
                            e.target.checked
                              ? [...v, t.id]
                              : v.filter((x) => x !== t.id),
                          )
                        }
                      />
                      <span>
                        {t.name}
                        <small>{t.sub}</small>
                      </span>
                    </label>
                  ))}
                </fieldset>
                {types.includes("typing") && (
                  <p className="typing-note">
                    Typing uses ISO-style diacritics: ā is different from a, and
                    ṇ is different from n. An OS accent picker or pasted Unicode
                    is accepted. Use recognition modes for keyboard-free
                    practice.
                  </p>
                )}
              </>
            )}
            <button
              className="button primary wide"
              disabled={!lesson && !types.length}
              onClick={() => start()}
            >
              {lesson ? "Begin lesson" : "Start practice"}
              <ArrowRight size={18} />
            </button>
          </section>
          <aside>
            <div className="panel learning-path">
              <div className="section-caption">YOUR LEARNING PATH</div>
              <h3>A script, step by step.</h3>
              {categories.map((c, i) => (
                <button
                  className={deck === c.id ? "path-step current" : "path-step"}
                  key={c.id}
                  onClick={() => setDeck(c.id)}
                >
                  <span className="path-number">{i + 1}</span>
                  <span>
                    <strong>{c.name}</strong>
                    <small>{c.description}</small>
                  </span>
                  {coreLetters
                    .filter((l) => l.category === c.id)
                    .every((l) => mastered(progress.cards[l.id])) && (
                    <Check size={18} />
                  )}
                </button>
              ))}
            </div>
            <div className="gentle-note">
              <Layers size={20} />
              <p>
                {lesson
                  ? "Reading comes first. Then recognition and recall. Missed letters return once more before the lesson ends."
                  : "Results include your answers, explanations, and a chance to revisit just the letters you missed."}
              </p>
            </div>
          </aside>
        </div>
      ) : phase === "results" ? (
        <Results
          lesson={lesson}
          answers={answers}
          onRestart={() => setPhase("setup")}
          onRetry={() =>
            start(
              Array.from(
                new Set(
                  answers
                    .filter((a) => !a.correct)
                    .map((a) => a.question.letter.id),
                ),
              ).map((id) => letterById[id]),
            )
          }
        />
      ) : (
        <div className="session-wrap">
          <div className="session-heading">
            <button
              className="text-link"
              onClick={() => {
                if (
                  window.confirm(
                    "End this session? Your completed answers are already saved.",
                  )
                )
                  setPhase("setup");
              }}
            >
              End session
            </button>
            <span>
              {lesson ? "A LITTLE LESSON" : "YOUR PRACTICE"} · Step {index + 1}{" "}
              of {steps.length}
            </span>
          </div>
          <ProgressBar
            value={(index / steps.length) * 100}
            label="Session progress"
          />
          {step?.kind === "read" ? (
            <div className="panel reading-card" key={index}>
              <span className="eyebrow">MEET YOUR NEXT LETTER</span>
              <span className="reading-glyph" lang="ml">
                {step.letter.display}
              </span>
              <h2>{step.letter.romanization}</h2>
              <span className="pronunciation">
                {step.letter.approximation ?? step.letter.subgroup}
              </span>
              <p>{step.letter.note}</p>
              <AudioButton letter={step.letter} />
              <button
                className="button primary"
                onClick={() => {
                  introduce(step.letter.id);
                  next();
                }}
              >
                I’ve met this letter <ArrowRight size={18} />
              </button>
            </div>
          ) : step?.kind === "question" ? (
            <QuizQuestion
              key={index}
              question={step.question}
              onAnswer={record}
              onNext={next}
              number={index + 1}
              total={steps.length}
            />
          ) : null}
        </div>
      )}
    </>
  );
}
