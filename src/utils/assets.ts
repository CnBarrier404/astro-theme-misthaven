import { getSiteAssetPath } from "@/utils/assetPaths";

const assetModules = import.meta.glob<ImageMetadata>("/src/assets/**/*", {
  eager: true,
  import: "default",
});

export function resolveSiteAsset(configuredPath: string): ImageMetadata | null {
  const assetPath = getSiteAssetPath(configuredPath);
  if (!assetPath) return null;
  const asset = assetModules[assetPath];

  if (!asset) {
    throw new Error(`Asset not found: ${configuredPath}. Store it in src/assets/.`);
  }

  return asset;
}
