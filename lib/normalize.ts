export function parseImages(imagesJson: string | null | undefined): string[] {
  if (!imagesJson) return [];
  try {
    const v = JSON.parse(imagesJson);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
