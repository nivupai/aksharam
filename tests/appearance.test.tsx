import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppearanceProvider } from "@/hooks/use-appearance";
import { AppearanceSettings, ThemeToggle } from "@/components/appearance";
import {
  APPEARANCE_KEY,
  appearanceScript,
  parseAppearance,
  resolveTheme,
} from "@/lib/appearance";

function mediaMock(initial = false) {
  let dark = initial;
  const callbacks = new Set<() => void>();
  const media = {
    get matches() {
      return dark;
    },
    addEventListener: vi.fn((_name: string, cb: () => void) =>
      callbacks.add(cb),
    ),
    removeEventListener: vi.fn((_name: string, cb: () => void) =>
      callbacks.delete(cb),
    ),
  };
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => media),
  );
  return {
    change(value: boolean) {
      dark = value;
      act(() => callbacks.forEach((cb) => cb()));
    },
    callbacks,
  };
}
function view() {
  return render(
    <AppearanceProvider>
      <ThemeToggle />
      <AppearanceSettings />
    </AppearanceProvider>,
  );
}
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.documentElement.removeAttribute("data-theme");
});
describe("appearance initialization and preference", () => {
  it("validates preferences and resolves explicit/System choices", () => {
    expect(parseAppearance("invalid")).toBe("system");
    expect(parseAppearance(null)).toBe("system");
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
  it("applies stored Dark before hydration, including direct-route refreshes", () => {
    mediaMock(false);
    localStorage.setItem(APPEARANCE_KEY, "dark");
    new Function(appearanceScript)();
    expect(document.documentElement.dataset.theme).toBe("dark");
    const first = view();
    expect(screen.getByLabelText("Color theme")).toHaveValue("dark");
    first.unmount();
    new Function(appearanceScript)();
    view();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
  it("bootstraps System from the OS and follows OS changes without changing the preference", () => {
    const media = mediaMock(true);
    new Function(appearanceScript)();
    expect(document.documentElement.dataset.theme).toBe("dark");
    const mounted = view();
    expect(screen.getByLabelText("Color theme")).toHaveValue("system");
    media.change(false);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(screen.getByLabelText("Color theme")).toHaveValue("system");
    mounted.unmount();
    expect(media.callbacks.size).toBe(0);
  });
  it("persists accessible toggle and Settings choices and ignores OS changes in explicit mode", async () => {
    const media = mediaMock(false);
    view();
    await userEvent.click(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    );
    expect(localStorage.getItem(APPEARANCE_KEY)).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    media.change(true);
    media.change(false);
    expect(document.documentElement.dataset.theme).toBe("dark");
    await userEvent.selectOptions(
      screen.getByLabelText("Color theme"),
      "system",
    );
    expect(document.documentElement.dataset.theme).toBe("light");
    media.change(true);
    expect(document.documentElement.dataset.theme).toBe("dark");
    await userEvent.selectOptions(
      screen.getByLabelText("Color theme"),
      "light",
    );
    expect(localStorage.getItem(APPEARANCE_KEY)).toBe("light");
  });
  it("handles blocked storage in the bootstrap and user controls", async () => {
    mediaMock(true);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => new Function(appearanceScript)()).not.toThrow();
    view();
    await userEvent.selectOptions(
      screen.getByLabelText("Color theme"),
      "light",
    );
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(screen.getByRole("alert")).toHaveTextContent("could not be saved");
  });
  it("synchronizes preference changes from another tab", () => {
    mediaMock(false);
    view();
    act(() =>
      window.dispatchEvent(
        new StorageEvent("storage", { key: APPEARANCE_KEY, newValue: "dark" }),
      ),
    );
    expect(screen.getByLabelText("Color theme")).toHaveValue("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});

it("hydrates without replacing the saved Dark theme or reporting mismatches", async () => {
  mediaMock(false);
  localStorage.setItem(APPEARANCE_KEY, "dark");
  const { renderToString } = await import("react-dom/server");
  const { hydrateRoot } = await import("react-dom/client");
  const markup = (
    <AppearanceProvider>
      <ThemeToggle />
      <AppearanceSettings />
    </AppearanceProvider>
  );
  const container = document.createElement("div");
  container.innerHTML = renderToString(markup);
  document.body.appendChild(container);
  new Function(appearanceScript)();
  const error = vi.fn();
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, markup, { onRecoverableError: error });
  });
  expect(error).not.toHaveBeenCalled();
  expect(document.documentElement.dataset.theme).toBe("dark");
  await act(async () => root.unmount());
  container.remove();
});
