"use client";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { coreLetters, letterById } from "@/data/alphabet";
import { useProgress } from "@/hooks/use-progress";
import {
  makeQuestion,
  shuffled,
  type QuestionType,
  type Answer,
} from "@/lib/quiz";
import type { Deck, Letter } from "@/types";
import { PageHeading, ProgressBar } from "./ui";
import { DeckSelector } from "./deck-selector";
import { QuizQuestion } from "./quiz-question";
import { Results } from "./results";
import { AudioButton } from "./audio-button";
import { LearnSetup } from "./learn-setup";
import {
  learnModes,
  learnSteps,
  selectLearnLetters,
  type LearnMode,
  type LearnDeck,
  type StudyStep,
} from "@/lib/learn";
export function Practice({ lesson = false }: { lesson?: boolean }) {
  const { ready } = useProgress();
  return ready ? (
    <PracticeSession lesson={lesson} />
  ) : (
    <p role="status">Loading progress…</p>
  );
}
function PracticeSession({ lesson }: { lesson: boolean }) {
  const { progress, answer, introduce, now } = useProgress();
  const [deck, setDeck] = useState<Deck>(lesson ? "all" : "vowels");
  const [count, setCount] = useState(
    lesson ? progress.preferences.lessonSize : 10,
  );
  const [mode, setMode] = useState<LearnMode>("new");
  const [includeNotDue, setIncludeNotDue] = useState(false);
  const [sessionTitle, setSessionTitle] = useState(
    lesson ? "Learn new letters" : "Test",
  );
  const [sessionCount, setSessionCount] = useState(0);
  const [types, setTypes] = useState<QuestionType[]>([
    "recognition",
    "reverse",
  ]);
  const [steps, setSteps] = useState<StudyStep[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [phase, setPhase] = useState<"setup" | "session" | "results">("setup");
  function start(custom?: Letter[]) {
    const chosen =
      custom ??
      (lesson
        ? selectLearnLetters(
            progress,
            Date.now(),
            mode,
            count,
            deck as LearnDeck,
            includeNotDue,
          )
        : shuffled(
            coreLetters.filter((l) => deck === "all" || l.category === deck),
          ).slice(0, count));
    if (!chosen.length || (!lesson && !types.length)) return;
    const next: StudyStep[] =
      lesson && !custom
        ? learnSteps(chosen, mode)
        : chosen.map((letter, i) => ({
            kind: "question",
            question: makeQuestion(
              letter,
              lesson ? "recognition" : types[i % types.length],
            ),
          }));
    setSessionTitle(
      `${lesson ? learnModes.find((m) => m.id === mode)!.title : "Test"}${custom ? " · Retry" : ""}`,
    );
    setSessionCount(chosen.length);
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
        title={lesson ? "Learn" : "Test"}
        description={
          lesson
            ? "Choose new letters, scheduled reviews, or difficult-letter practice."
            : "Choose question types. No Malayalam keyboard is required."
        }
      />
      {phase === "setup" && lesson ? (
        <LearnSetup
          progress={progress}
          now={now}
          mode={mode}
          setMode={setMode}
          deck={deck as LearnDeck}
          setDeck={setDeck}
          count={count}
          setCount={setCount}
          includeNotDue={includeNotDue}
          setIncludeNotDue={setIncludeNotDue}
          onStart={() => start()}
        />
      ) : phase === "setup" ? (
        <div className="test-setup">
          <section className="panel setup-panel">
            <div className="setup-icon peach">
              <Check size={28} />
            </div>
            <h2>Test setup</h2>
            <p>Choose a collection, question count, and question types.</p>
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
        </div>
      ) : phase === "results" ? (
        <Results
          lesson={lesson}
          sessionTitle={sessionTitle}
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
              {lesson ? "Back to Learn" : "End session"}
            </button>
            <span>
              {sessionTitle} · {sessionCount}{" "}
              {sessionCount === 1 ? "letter" : "letters"} · Step {index + 1} of{" "}
              {steps.length}
            </span>
          </div>
          <ProgressBar
            value={(index / steps.length) * 100}
            label="Session progress"
          />
          {step?.kind === "read" ? (
            <div className="panel reading-card" key={index}>
              <span className="eyebrow">NEW LETTER · {step.letter.usage}</span>
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
                Practice this letter <ArrowRight size={18} />
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
