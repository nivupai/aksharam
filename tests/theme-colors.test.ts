import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
const css = readFileSync("src/app/globals.css", "utf8");
function tokens(selector: string) {
  const block = css.slice(css.indexOf(selector)).split("}")[0];
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[a-f\d]{6})\s*;/gi)].map((m) => [
      m[1],
      m[2],
    ]),
  );
}
function luminance(hex: string) {
  const values = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
for (const [name, selector] of [
  ["light", ":root {"],
  ["dark", ':root[data-theme="dark"] {'],
])
  describe(`${name} color contrast`, () => {
    const t = tokens(selector);
    it("keeps normal text, muted text, glyphs, buttons and feedback legible", () => {
      for (const [fg, bg] of [
        ["ink", "bg"],
        ["ink", "paper"],
        ["ink", "card-back"],
        ["ink", "input-bg"],
        ["ink", "dialog-bg"],
        ["muted", "bg"],
        ["muted", "paper"],
        ["muted", "card-back"],
        ["muted", "selected-bg"],
        ["glyph", "paper"],
        ["glyph", "card-back"],
        ["on-accent", "sage-dark"],
        ["on-burgundy", "burgundy"],
        ["on-burgundy", "burgundy-hover"],
        ["burgundy-ink", "bg"],
        ["burgundy-ink", "paper"],
        ["burgundy-ink", "selected-bg"],
        ["correct-text", "correct-bg"],
        ["incorrect-text", "incorrect-bg"],
        ["warning-text", "warning-bg"],
        ["sage-text", "sage"],
        ["peach-text", "peach"],
        ["yellow-text", "yellow"],
        ["lavender-text", "lavender"],
        ["blue-text", "blue"],
        ["pink-text", "pink"],
      ])
        expect(contrast(t[fg], t[bg]), `${fg} on ${bg}`).toBeGreaterThanOrEqual(
          4.5,
        );
    });
    it("keeps focus rings and form boundaries visible", () => {
      for (const [fg, bg] of [
        ["focus", "paper"],
        ["focus", "bg"],
        ["input-border", "input-bg"],
        ["progress-fill", "progress-track"],
      ])
        expect(contrast(t[fg], t[bg]), `${fg} on ${bg}`).toBeGreaterThanOrEqual(
          3,
        );
    });
  });
