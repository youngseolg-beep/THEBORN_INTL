const alreadyMobileOptimized = new Set([
  "/assets/home-v2-assets/saemaeul/image-01.webp",
]);

export function getMobileImageSource(source: string) {
  if (alreadyMobileOptimized.has(source)) return source;

  const separatorIndex = source.lastIndexOf("/");
  const extensionIndex = source.lastIndexOf(".");

  if (separatorIndex === -1 || extensionIndex <= separatorIndex) return source;

  return `${source.slice(0, separatorIndex)}/mobile/${source.slice(separatorIndex + 1, extensionIndex)}.webp`;
}
