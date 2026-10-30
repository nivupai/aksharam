export type Appearance = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
export const APPEARANCE_KEY = "aksharam.appearance.v1";
export function parseAppearance(value: string | null): Appearance {
  return value === "light" || value === "dark" ? value : "system";
}
export function resolveTheme(
  preference: Appearance,
  systemDark: boolean,
): ResolvedTheme {
  return preference === "system" ? (systemDark ? "dark" : "light") : preference;
}
// Runs in <head> before the body paints. It contains no user-controlled input.
export const appearanceScript = `(function(){var p='system';try{var v=localStorage.getItem(${JSON.stringify(APPEARANCE_KEY)});if(v==='light'||v==='dark')p=v}catch(e){}var d=p==='dark'||(p==='system'&&typeof matchMedia==='function'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';})();`;
