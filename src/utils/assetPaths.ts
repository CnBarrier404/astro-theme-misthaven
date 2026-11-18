export function getSiteAssetPath(configuredPath: string) {
  const normalizedPath = configuredPath.trim().replaceAll("\\", "/");
  if (!normalizedPath) return null;

  return `/src/assets/${normalizedPath.replace(/^\/?src\/assets\//, "")}`;
}
