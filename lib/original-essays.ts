export const originalEssayFolders: Record<string, string> = {
  "train-test-validation": "train-test-validation",
  "precision-recall": "precision-recall",
  "random-forest": "random-forest",
  "decision-tree": "decision-tree",
  "bias-variance": "bias-variance",
  "double-descent": "double-descent",
  "double-descent-2": "double-descent2",
};

export function originalEssayFolder(slug: string) {
  return originalEssayFolders[slug] ?? null;
}
