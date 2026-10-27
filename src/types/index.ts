export type Category =
  "vowels" | "consonants" | "chillu" | "signs" | "special" | "conjuncts";
export type Usage = "core" | "uncommon" | "historic" | "scholarly";
export interface Letter {
  id: string;
  glyph: string;
  category: Category;
  subgroup: string;
  romanization: string;
  approximation?: string;
  note: string;
  order: number;
  usage: Usage;
  display?: string;
  audioUrl?: string;
  example?: { word: string; romanization: string; meaning: string };
}
export type Rating = "again" | "hard" | "good" | "easy";
export interface Review {
  rating: Rating;
  at: number;
}
export interface CardProgress {
  lastReviewed: number;
  nextReview: number;
  interval: number;
  lapses: number;
  successStreak: number;
  history: Review[];
}
export interface Attempt {
  at: number;
  cardId: string;
  correct: boolean;
  category: Category;
}
export interface Progress {
  version: 1;
  cards: Record<string, CardProgress>;
  favorites: string[];
  introduced: string[];
  attempts: Attempt[];
  studyDays: string[];
  preferences: { dailyGoal: number; lessonSize: number };
}
export type Deck = Category | "all" | "review";
