export function getElapsedDays(date: number) {
  return Math.max(0, Math.floor((Date.now() - date) / 86_400_000));
}
