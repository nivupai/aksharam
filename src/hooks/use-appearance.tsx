"use client";
/* eslint-disable react-hooks/set-state-in-effect -- Synchronizes stored appearance and OS media-query changes with the document theme. */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  APPEARANCE_KEY,
  parseAppearance,
  resolveTheme,
  type Appearance,
  type ResolvedTheme,
} from "@/lib/appearance";
interface AppearanceStore {
  preference: Appearance;
  resolved: ResolvedTheme;
  ready: boolean;
  error: string;
  setPreference: (value: Appearance) => void;
}
const Context = createContext<AppearanceStore | null>(null);
export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<Appearance>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      setPreferenceState(
        parseAppearance(window.localStorage.getItem(APPEARANCE_KEY)),
      );
    } catch {
      setError(
        "Appearance storage is unavailable. Changes apply to this tab only.",
      );
    }
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key === APPEARANCE_KEY || event.key === null)
        setPreferenceState(parseAppearance(event.newValue));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const media =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;
    const apply = () => {
      const theme = resolveTheme(preference, media?.matches ?? false);
      document.documentElement.dataset.theme = theme;
      setResolved(theme);
    };
    apply();
    if (media?.addEventListener) {
      media.addEventListener("change", apply);
      return () => media.removeEventListener("change", apply);
    }
    if (media?.addListener) {
      media.addListener(apply);
      return () => media.removeListener(apply);
    }
  }, [preference, ready]);
  function setPreference(value: Appearance) {
    setPreferenceState(value);
    try {
      window.localStorage.setItem(APPEARANCE_KEY, value);
      setError("");
    } catch {
      setError(
        "Appearance could not be saved. Changes apply to this tab only.",
      );
    }
  }
  return (
    <Context.Provider
      value={{ preference, resolved, ready, error, setPreference }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAppearance() {
  const value = useContext(Context);
  if (!value) throw new Error("AppearanceProvider is missing");
  return value;
}
