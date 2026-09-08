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

export type KnownTick = { id: string; en: string };

export const originalEssayTicks: Record<string, KnownTick[]> = {
  "train-test-validation": [
    { id: "intro", en: "Introduction" },
    { id: "split", en: "The Split" },
    { id: "train", en: "Train Set" },
    { id: "model", en: "Model" },
    { id: "validation", en: "Validation Set" },
    { id: "test", en: "Test Set" },
    { id: "all", en: "Summary" },
  ],
  "decision-tree": [
    { id: "intro", en: "Let's Build a Decision Tree" },
    { id: "startsplit", en: "Start Splitting" },
    { id: "moresplit", en: "Split Some More" },
    { id: "moremoresplit", en: "And Some More" },
    { id: "moremoremoresplit", en: "And Yet Some More" },
    { id: "variance", en: "Don't Go Too Deep" },
    { id: "splits", en: "Where To Partition?" },
    { id: "informationgain", en: "Information Gain" },
    { id: "anotherlook", en: "Another Look" },
    { id: "pertubations", en: "Perturbations" },
    { id: "limitations", en: "Beyond Trees" },
    { id: "final", en: "The End" },
  ],
  "random-forest": [
    { id: "introduction", en: "Introduction" },
    { id: "ensemble", en: "Ensemble Learning" },
    { id: "random-forest", en: "Random Forest" },
    { id: "barcode", en: "Variance in Composition" },
    { id: "cantor-section", en: "Variance in Predictions" },
    { id: "conclusion", en: "Conclusion" },
  ],
};
