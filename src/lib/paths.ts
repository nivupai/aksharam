// Shared by Next.js configuration and public-file consumers. Rebuild if changed.
export const BASE_PATH = "/aksharam";

/** Prefix public files (audio, images, downloads); Next Link handles routes itself. */
export function publicAssetPath(path: string): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) return path;
  const rooted = path.startsWith("/") ? path : `/${path}`;
  if (
    rooted === BASE_PATH ||
    rooted.startsWith(`${BASE_PATH}/`) ||
    rooted.startsWith(`${BASE_PATH}?`)
  )
    return rooted;
  return `${BASE_PATH}${rooted}`;
}
