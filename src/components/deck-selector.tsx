import { categories } from "@/data/alphabet";
import type { Deck } from "@/types";
export function DeckSelector({
  value,
  onChange,
  review = true,
  id = "deck",
}: {
  value: Deck;
  onChange: (deck: Deck) => void;
  review?: boolean;
  id?: string;
}) {
  return (
    <div className="select-field">
      <label htmlFor={id}>Choose a deck</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as Deck)}
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
        <option value="all">All cards</option>
        {review && <option value="review">Custom review</option>}
      </select>
    </div>
  );
}
