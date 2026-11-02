"use client";
import { useId, useState } from "react";
import { Check, ArrowRight, X } from "lucide-react";
import { isCorrect, type Question } from "@/lib/quiz";
export function QuizQuestion({
  question,
  onAnswer,
  onNext,
  number,
  total,
}: {
  question: Question;
  onAnswer: (response: string, correct: boolean) => void;
  onNext: () => void;
  number: number;
  total: number;
}) {
  const [response, setResponse] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const feedbackId = useId();
  const correct = response !== null && isCorrect(question, response);
  function submit(value: string) {
    if (response !== null) return;
    setResponse(value);
    onAnswer(value, isCorrect(question, value));
  }
  return (
    <div
      className={`quiz-panel panel${response !== null ? " quiz-answered" : ""}`}
    >
      <div className="quiz-kicker">
        <span>
          {question.type === "reverse"
            ? "RECALL THE LETTER"
            : question.type === "typing"
              ? "RECALL THE SOUND"
              : "RECOGNIZE THE SOUND"}
        </span>
        <span>
          {number} / {total}
        </span>
      </div>
      <h2>
        {question.type === "reverse"
          ? "Which letter makes this sound?"
          : question.type === "typing"
            ? "How is this written in romanization?"
            : "What sound does this letter make?"}
      </h2>
      <div
        className={
          question.type === "reverse" ? "question-roman" : "question-glyph"
        }
        lang={question.type === "reverse" ? "en" : "ml"}
      >
        {question.type === "reverse"
          ? question.letter.romanization
          : question.letter.display}
      </div>
      {question.type === "typing" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (typed.trim()) submit(typed);
          }}
        >
          <label className="typing-label" htmlFor="typed-answer">
            Your romanization
          </label>
          <input
            id="typed-answer"
            autoComplete="off"
            autoCapitalize="off"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={response !== null}
            required
          />
          <p className="muted">
            Accents and vowel length matter. Case and outer spaces are ignored;
            Unicode equivalents are accepted.
          </p>
          <button
            className="button primary"
            disabled={response !== null || !typed.trim()}
          >
            Check answer <Check size={17} />
          </button>
        </form>
      ) : (
        <div className="answer-grid">
          {question.options.map((o, i) => (
            <button
              key={o.id}
              disabled={response !== null}
              className={`answer-option ${question.type === "reverse" ? "glyph-option" : ""} ${response !== null && o.id === question.letter.id ? "answer-correct" : ""} ${response === o.id && !correct ? "answer-wrong" : ""}`}
              onClick={() => submit(o.id)}
            >
              <span className="option-number">
                {String.fromCharCode(65 + i)}
              </span>
              <span lang={question.type === "reverse" ? "ml" : "en"}>
                {question.type === "reverse" ? o.display : o.romanization}
              </span>
              {response !== null && o.id === question.letter.id && (
                <Check size={20} />
              )}
            </button>
          ))}
        </div>
      )}
      {response !== null && (
        <div className="answer-dock">
          <div
            className={`answer-feedback ${correct ? "correct" : "incorrect"}`}
          >
            <div className="answer-feedback-copy" role="status" id={feedbackId}>
              <div className="answer-feedback-result">
                {correct ? <Check size={21} /> : <X size={21} />}
                <strong>{correct ? "Correct" : "Incorrect"}</strong>
              </div>
              <p>
                <strong>
                  <span lang="ml">{question.letter.glyph}</span> ·{" "}
                  {question.letter.romanization}
                </strong>{" "}
                — {question.letter.note}
              </p>
            </div>
            <button
              className="button primary"
              aria-describedby={feedbackId}
              ref={(button) => {
                // Move keyboard focus out of disabled answers without scrolling
                // the page; this also dismisses the typing keyboard on phones.
                button?.focus({ preventScroll: true });
              }}
              onClick={onNext}
            >
              Continue <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
