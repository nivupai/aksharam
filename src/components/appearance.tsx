"use client";
import { Moon, Sun } from "lucide-react";
import { useAppearance } from "@/hooks/use-appearance";
import type { Appearance } from "@/lib/appearance";
export function ThemeToggle() {
  const { resolved, ready, preference, setPreference } = useAppearance();
  const next = resolved === "dark" ? "light" : "dark";
  return (
    <button
      className="theme-toggle"
      disabled={!ready}
      aria-label={`Switch to ${next} mode`}
      title={`Appearance: ${preference}. Switch to ${next} mode`}
      onClick={() => setPreference(next)}
    >
      {resolved === "dark" ? (
        <Sun size={20} aria-hidden="true" />
      ) : (
        <Moon size={20} aria-hidden="true" />
      )}
      <span className="theme-label">
        {next === "dark" ? "Dark mode" : "Light mode"}
      </span>
    </button>
  );
}
export function AppearanceSettings() {
  const { preference, resolved, ready, error, setPreference } = useAppearance();
  return (
    <section className="panel settings-panel">
      <h2>Appearance</h2>
      <label className="setting-row" htmlFor="appearance">
        <span>
          <strong id="appearance-label">Color theme</strong>
          <small id="appearance-help">
            System follows the device appearance.
          </small>
        </span>
        <select
          id="appearance"
          aria-labelledby="appearance-label"
          aria-describedby="appearance-help"
          value={preference}
          disabled={!ready}
          onChange={(e) => setPreference(e.target.value as Appearance)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </label>
      <p role="status">Current theme: {ready ? resolved : "loading"}</p>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
