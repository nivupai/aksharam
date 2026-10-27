"use client";
/* eslint-disable react-hooks/set-state-in-effect -- LocalStorage hydration and storage failure reporting synchronize with an external browser system. */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  emptyProgress,
  loadProgress,
  saveProgress,
  reviewCard,
  localDay,
} from "@/lib/progress";
import { letterById } from "@/data/alphabet";
import type { Progress, Rating } from "@/types";
interface Store {
  progress: Progress;
  ready: boolean;
  now: number;
  error: string;
  dismissError: () => void;
  rate: (id: string, rating: Rating) => void;
  introduce: (id: string) => void;
  answer: (id: string, correct: boolean) => void;
  favorite: (id: string) => void;
  replace: (p: Progress) => void;
  preferences: (p: Partial<Progress["preferences"]>) => void;
}
const Context = createContext<Store | null>(null);
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      const loaded = loadProgress(window.localStorage);
      setProgress(loaded.progress);
      setError(loaded.error ?? "");
    } catch {
      setError(
        "Browser storage is unavailable. You can study in this tab and export a backup in Settings.",
      );
    }
    setNow(Date.now());
    setReady(true);
  }, []); // Hydrate only after the server and initial client renders agree.
  useEffect(() => {
    if (ready)
      try {
        saveProgress(window.localStorage, progress);
      } catch {
        setError(
          "Your browser could not save progress. Export a backup before closing this tab.",
        );
      }
  }, [progress, ready]);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = window.setInterval(tick, 30000);
    window.addEventListener("focus", tick);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", tick);
    };
  }, []);
  const rate = useCallback(
    (id: string, rating: Rating) =>
      setProgress((p) => reviewCard(p, id, rating)),
    [],
  );
  const introduce = useCallback(
    (id: string) =>
      setProgress((p) =>
        p.introduced.includes(id)
          ? p
          : { ...p, introduced: [...p.introduced, id] },
      ),
    [],
  );
  const answer = useCallback(
    (id: string, correct: boolean) =>
      setProgress((p) => ({
        ...reviewCard(p, id, correct ? "good" : "again"),
        attempts: [
          ...p.attempts,
          {
            at: Date.now(),
            cardId: id,
            correct,
            category: letterById[id].category,
          },
        ],
        studyDays: Array.from(new Set([...p.studyDays, localDay()])),
      })),
    [],
  );
  const favorite = useCallback(
    (id: string) =>
      setProgress((p) => ({
        ...p,
        favorites: p.favorites.includes(id)
          ? p.favorites.filter((v) => v !== id)
          : [...p.favorites, id],
      })),
    [],
  );
  return (
    <Context.Provider
      value={{
        progress,
        ready,
        now,
        error,
        dismissError: () => setError(""),
        rate,
        introduce,
        answer,
        favorite,
        replace: setProgress,
        preferences: (p) =>
          setProgress((old) => ({
            ...old,
            preferences: { ...old.preferences, ...p },
          })),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useProgress() {
  const context = useContext(Context);
  if (!context) throw new Error("ProgressProvider is missing");
  return context;
}
