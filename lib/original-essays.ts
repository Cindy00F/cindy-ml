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
  "logistic-regression": [
    { id: "intro-hed", en: "Logistic Regression" },
    { id: "how-it-works", en: "How It Works" },
    { id: "evaluating-our-model", en: "Evaluating Our Model" },
    { id: "estimating-coefficients", en: "Estimating Coefficients" },
    { id: "interpreting-logistic-regression-models", en: "Interpreting Logistic Regression Models" },
    { id: "conclusion", en: "Conclusion" },
  ],
  "linear-regression": [
    { id: "intro-hed", en: "Linear Regression" },
    { id: "how-it-works-briefly", en: "How It Works, Briefly" },
    { id: "learning-the-coefficients", en: "Learning The Coefficients" },
    { id: "model-evaluation", en: "Model Evaluation" },
    { id: "interpreting-regression-models", en: "Interpreting Regression Models" },
    { id: "regression-model-assumptions", en: "Regression Model Assumptions" },
  ],
  "neural-networks": [
    { id: "intro-hed", en: "Neural Networks" },
    { id: "a-visual-introduction", en: "A Visual Introduction" },
    { id: "what-is-a-network", en: "What Is A Network" },
    { id: "building-blocks-computational-graphs", en: "Building Blocks: Computational Graphs" },
    { id: "activation-functions-artificial-neurons", en: "Activation Functions & Artificial Neurons" },
    { id: "backpropagation-how-networks-learn", en: "Backpropagation: How Networks Learn" },
    { id: "see-for-yourself", en: "See for yourself" },
  ],
  "equality-of-odds": [
    { id: "intro-hed", en: "Equality Of Odds" },
    { id: "intro-sub", en: "A Visual Introduction to Measuring and Mitigating Bias in Machine Learning" },
  ],
  "reinforcement-learning": [
    { id: "intro-hed", en: "Reinforcement Learning" },
    { id: "problem-structure", en: "Problem Structure" },
    { id: "choosing-between-two-trees", en: "Choosing Between Two Trees" },
    { id: "navigating-in-a-line-world", en: "Navigating in a Line World" },
    { id: "navigating-in-a-grid-world", en: "Navigating in a Grid World" },
    { id: "conclusion", en: "Conclusion" },
  ],
  "roc-auc": [
    { id: "intro-hed", en: "ROC & AUC" },
    { id: "what-makes-a-good-roc-curve", en: "What Makes A Good ROC Curve?" },
    { id: "auc-area-under-the-curve", en: "AUC: Area Under the Curve" },
    { id: "considerations", en: "Considerations" },
  ],
  "cross-validation": [
    { id: "intro-hed", en: "Cross Validation" },
    { id: "reduce-reuse-resample", en: "Reduce, Reuse, Resample" },
    { id: "gt-our-previous-approach", en: "Our Previous Approach" },
    { id: "gt-k-fold-cross-validation", en: "K-Fold Cross-Validation" },
    { id: "gt-leave-one-out-cross-validation-loocv", en: "Leave-One-Out Cross Validation (LOOCV)" },
    { id: "gt-see-for-yourself", en: "See For Yourself" },
  ],
  "precision-recall": [
    { id: "intro-hed", en: "Precision & Recall" },
    { id: "accuracy-is-not-enough", en: "Accuracy Is Not Enough" },
    { id: "the-f1-score", en: "The F1-Score" },
    { id: "the-tradeoff-again", en: "The Tradeoff... Again" },
  ],
  "bias-variance": [
    { id: "intro", en: "Introduction" },
    { id: "scrolly", en: "Overfitting" },
    { id: "outro", en: "Outro" },
  ],
  "double-descent": [
    { id: "intro", en: "Introduction" },
    { id: "section2", en: "Past Interpolation" },
    { id: "scrolly-side", en: "A Closer Look" },
  ],
  "double-descent2": [
    { id: "intro", en: "Introduction" },
    { id: "math", en: "The Mathematics" },
    { id: "conclusion", en: "Conclusion" },
  ],
};
