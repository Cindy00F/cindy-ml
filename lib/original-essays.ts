export const originalEssayFolders: Record<string, string> = {
  "train-test-validation": "train-test-validation",
  "neural-networks": "neural-networks",
  "equality-of-odds": "equality-of-odds",
  "logistic-regression": "logistic-regression",
  "linear-regression": "linear-regression",
  "reinforcement-learning": "reinforcement-learning",
  "roc-auc": "roc-auc",
  "cross-validation": "cross-validation",
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
