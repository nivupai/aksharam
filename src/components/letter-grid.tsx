import type { Letter } from "@/types";
export function LetterGrid({
  letters,
  onSelect,
}: {
  letters: Letter[];
  onSelect: (letter: Letter) => void;
}) {
  return (
    <div className="letter-grid">
      {letters.map((l) => (
        <button
          className="letter-tile"
          key={l.id}
          onClick={() => onSelect(l)}
          aria-label={`${l.romanization}, ${l.subgroup}, ${l.usage}`}
        >
          <span lang="ml">{l.display}</span>
          <strong>{l.romanization}</strong>
          {l.usage !== "core" && <small>{l.usage}</small>}
        </button>
      ))}
    </div>
  );
}
