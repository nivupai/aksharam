import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Practice } from "@/components/practice";
import { ProgressProvider } from "@/hooks/use-progress";
import { letters } from "@/data/alphabet";
import { emptyProgress, reviewCard, STORAGE_KEY, DAY } from "@/lib/progress";
import type { Progress } from "@/types";
function view(p = emptyProgress()) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  return render(
    <ProgressProvider>
      <Practice lesson />
    </ProgressProvider>,
  );
}
async function chooseMode(name: string) {
  await userEvent.click(await screen.findByRole("button", { name }));
}
async function correctAnswer(glyph: string, reverse = false) {
  const letter = letters.find((l) => l.glyph === glyph)!;
  const choices = screen
    .getAllByRole("button")
    .filter((b) => b.classList.contains("answer-option"));
  const choice = choices.find((b) =>
    b.textContent?.endsWith(reverse ? letter.display! : letter.romanization),
  )!;
  await userEvent.click(choice);
}
describe("Learn modes and sessions", () => {
  it("shows actual counts and new sessions exclude old letters", async () => {
    const p = emptyProgress();
    p.introduced = [letters[0].id];
    view(p);
    const metrics = screen.getByLabelText("Learning counts");
    expect(metrics).toHaveTextContent(`New${letters.length - 1}`);
    expect(metrics).toHaveTextContent("Learned1");
    await userEvent.selectOptions(
      screen.getByLabelText("New letters per session"),
      "1",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Start learning" }),
    );
    expect(screen.getByRole("heading", { name: "ā" })).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Practice this letter" }),
    );
    await correctAnswer("ആ");
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(
      screen.getByRole("heading", { name: "Learn new letters results" }),
    ).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!) as Progress;
    expect(stored.introduced).toContain(letters[1].id);
    expect(stored.cards[letters[1].id].history).toHaveLength(1);
    await userEvent.click(
      screen.getByRole("button", { name: "Start another session" }),
    );
    expect(screen.getByLabelText("New letters per session")).toHaveValue("1");
  });
  it("reviews only due learned cards, keeps history, and completes a review", async () => {
    let p = reviewCard(
      emptyProgress(),
      letters[0].id,
      "good",
      Date.now() - 2 * DAY,
    );
    p = reviewCard(p, letters[1].id, "easy", Date.now());
    view(p);
    await chooseMode("Review learned letters");
    expect(screen.getByRole("status")).toHaveTextContent(
      "1 due letter available",
    );
    await userEvent.click(screen.getByRole("button", { name: "Start review" }));
    expect(
      screen.queryByRole("button", { name: "Practice this letter" }),
    ).not.toBeInTheDocument();
    await correctAnswer("അ");
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(
      screen.getByRole("heading", { name: "Review learned letters results" }),
    ).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!) as Progress;
    expect(stored.cards[letters[0].id].history).toHaveLength(2);
    expect(stored.cards[letters[0].id].interval).toBe(2);
    expect(stored.cards[letters[1].id]).toEqual(p.cards[letters[1].id]);
    await userEvent.click(
      screen.getByRole("button", { name: "Back to Learn" }),
    );
    expect(
      screen.queryByRole("button", { name: "Start review" }),
    ).not.toBeInTheDocument();
  });
  it("requires an explicit choice to review non-due and unscheduled introduced letters", async () => {
    const p = reviewCard(emptyProgress(), letters[0].id, "easy", Date.now());
    p.introduced.push(letters[1].id);
    view(p);
    await chooseMode("Review learned letters");
    expect(
      screen.queryByRole("button", { name: "Start review" }),
    ).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: "Include all learned letters, even if not due",
      }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "2 learned letters available",
    );
    await userEvent.click(screen.getByRole("button", { name: "Start review" }));
    expect(screen.getByText(/Step 1 of 2/)).toBeInTheDocument();
  });
  it("offers difficult practice based on ratings, not introduction", async () => {
    const p = emptyProgress();
    p.introduced = [letters[0].id];
    view(p);
    await chooseMode("Practice difficult letters");
    expect(
      screen.getByText("No difficult letters in this selection."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Start difficult practice" }),
    ).not.toBeInTheDocument();
    await userEvent.click(
      screen.getAllByRole("button", { name: "Learn new letters" })[1],
    );
    expect(
      screen.getByRole("button", { name: "Start learning" }),
    ).toBeInTheDocument();
  });
  it("starts difficult practice for a Hard-rated card without reading it as new", async () => {
    view(reviewCard(emptyProgress(), letters[0].id, "hard", Date.now()));
    await chooseMode("Practice difficult letters");
    await userEvent.click(
      screen.getByRole("button", { name: "Start difficult practice" }),
    );
    expect(
      screen.queryByRole("button", { name: "Practice this letter" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/Practice difficult letters · 1 letter/),
    ).toBeInTheDocument();
  });
  it("offers Review when all letters are introduced and never starts an empty lesson", async () => {
    const p = emptyProgress();
    p.introduced = letters.map((l) => l.id);
    view(p);
    expect(
      await screen.findByText("All letters have been introduced."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Start learning" }),
    ).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Review all learned letters" }),
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(
      screen.getByRole("button", { name: "Start review" }),
    ).toBeInTheDocument();
  });
  it("does not introduce a reference-only or unacknowledged reading card", async () => {
    view();
    await userEvent.click(
      await screen.findByRole("button", { name: "Start learning" }),
    );
    vi.spyOn(window, "confirm").mockReturnValue(true);
    await userEvent.click(
      screen.getByRole("button", { name: "Back to Learn" }),
    );
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).introduced).toEqual(
      [],
    );
    vi.restoreAllMocks();
  });
  it("preserves unreadable saved data while temporary session answers are made", async () => {
    const raw = '{"version":99,"saved":"untouched"}';
    localStorage.setItem(STORAGE_KEY, raw);
    render(
      <ProgressProvider>
        <Practice lesson />
      </ProgressProvider>,
    );
    await userEvent.click(
      await screen.findByRole("button", { name: "Start learning" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Practice this letter" }),
    );
    await correctAnswer("അ");
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  });
});
