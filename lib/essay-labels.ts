import type { Locale } from "@/lib/messages";

export type EssayTick = {
  id: string;
  en: string;
  zh?: string;
};

const byId: Record<string, { zh: string; en: string }> = {
  intro: { zh: "开头", en: "Introduction" },
  introduction: { zh: "开头", en: "Introduction" },
  split: { zh: "切开", en: "The Split" },
  train: { zh: "训练集", en: "Train Set" },
  model: { zh: "模型", en: "Model" },
  validation: { zh: "验证集", en: "Validation Set" },
  test: { zh: "测试集", en: "Test Set" },
  all: { zh: "写在最后", en: "Summary" },
  summary: { zh: "写在最后", en: "Summary" },
  conclusion: { zh: "小结", en: "Conclusion" },
  ensemble: { zh: "集成学习", en: "Ensemble" },
  "random-forest": { zh: "随机森林", en: "Random Forest" },
  barcode: { zh: "组成方差", en: "Variance in Composition" },
  "cantor-section": { zh: "预测方差", en: "Variance in Predictions" },
  startsplit: { zh: "开始切分", en: "Start Splitting" },
  moresplit: { zh: "继续切分", en: "Split Some More" },
  moremoresplit: { zh: "再切一次", en: "And Some More" },
  moremoremoresplit: { zh: "还要再切", en: "And Yet Some More" },
  variance: { zh: "不要切太深", en: "Don't Go Too Deep" },
  splits: { zh: "切在哪里", en: "Where To Partition?" },
  informationgain: { zh: "信息增益", en: "Information Gain" },
  anotherlook: { zh: "再看一遍树", en: "Another Look" },
  pertubations: { zh: "扰动问题", en: "Perturbations" },
  limitations: { zh: "树的局限", en: "Beyond Trees" },
  final: { zh: "结尾", en: "The End" },
  scrolly: { zh: "过拟合", en: "Overfitting" },
  outro: { zh: "小结", en: "Outro" },
  section2: { zh: "插值之后", en: "Past Interpolation" },
  "scrolly-side": { zh: "侧写", en: "A Closer Look" },
  gap: { zh: "间隙", en: "The Gap" },
  "how-it-works": { zh: "它怎么工作", en: "How It Works" },
  "how-it-works-briefly": { zh: "先看它怎么算", en: "How It Works, Briefly" },
  "evaluating-our-model": { zh: "怎么评价", en: "Evaluating Our Model" },
  "estimating-coefficients": { zh: "系数怎么来", en: "Estimating Coefficients" },
  "interpreting-logistic-regression-models": { zh: "怎么读懂系数", en: "Interpreting Models" },
  "learning-the-coefficients": { zh: "系数是怎么学来的", en: "Learning Coefficients" },
  "model-evaluation": { zh: "模型评价", en: "Model Evaluation" },
  "interpreting-regression-models": { zh: "怎么读回归", en: "Interpreting Regression" },
  "regression-model-assumptions": { zh: "模型假设", en: "Assumptions" },
  "a-visual-introduction": { zh: "图解入门", en: "A Visual Introduction" },
  "what-is-a-network": { zh: "什么是网络", en: "What Is A Network" },
  "building-blocks-computational-graphs": { zh: "计算图", en: "Computational Graphs" },
  "activation-functions-artificial-neurons": { zh: "激活与神经元", en: "Activations" },
  "backpropagation-how-networks-learn": { zh: "反向传播", en: "Backpropagation" },
  "see-for-yourself": { zh: "自己试一次", en: "See For Yourself" },
  "problem-structure": { zh: "问题结构", en: "Problem Structure" },
  "choosing-between-two-trees": { zh: "两棵树里选", en: "Two Trees" },
  "navigating-in-a-line-world": { zh: "线世界", en: "Line World" },
  "navigating-in-a-grid-world": { zh: "格子世界", en: "Grid World" },
  "what-makes-a-good-roc-curve": { zh: "怎样算好的 ROC", en: "A Good ROC" },
  "auc-area-under-the-curve": { zh: "AUC", en: "AUC" },
  "reduce-reuse-resample": { zh: "折上再折", en: "Reduce, Reuse, Resample" },
  "gt-our-previous-approach": { zh: "以前的做法", en: "Previous Approach" },
  "gt-k-fold-cross-validation": { zh: "K 折交叉验证", en: "K-Fold CV" },
  "gt-leave-one-out-cross-validation-loocv": { zh: "留一法", en: "LOOCV" },
  "gt-see-for-yourself": { zh: "自己试一次", en: "See For Yourself" },
  "accuracy-is-not-enough": { zh: "准确率不够", en: "Accuracy Is Not Enough" },
  "the-f1-score": { zh: "F1 分数", en: "F1 Score" },
  "the-tradeoff-again": { zh: "权衡又来了", en: "The Tradeoff" },
};

const byTitle: Record<string, { zh: string; en: string }> = {
  introduction: { zh: "引言", en: "Introduction" },
  "the split": { zh: "划分", en: "The Split" },
  "train set": { zh: "训练集", en: "Train Set" },
  model: { zh: "模型", en: "Model" },
  "validation set": { zh: "验证集", en: "Validation Set" },
  "test set": { zh: "测试集", en: "Test Set" },
  summary: { zh: "小结", en: "Summary" },
  "the importance of data splitting": { zh: "数据为什么要切开", en: "Data Splitting" },
  "train, test, and validation splits": { zh: "三份数据，三种用途", en: "The Split" },
  "the training set": { zh: "训练集", en: "Train Set" },
  "building our model": { zh: "建立模型", en: "Model" },
  "the validation set": { zh: "验证集", en: "Validation Set" },
  "the testing set": { zh: "测试集", en: "Test Set" },
  "let's build a decision tree": { zh: "先建一棵树", en: "Build a Tree" },
  "start splitting": { zh: "开始切分", en: "Start Splitting" },
  "split some more": { zh: "继续切分", en: "Split Some More" },
  "and some more": { zh: "再切一次", en: "And Some More" },
  "and yet some more": { zh: "还要再切", en: "And Yet Some More" },
  "don't go too deep!": { zh: "不要切太深", en: "Don't Go Too Deep" },
  "where to partition?": { zh: "切在哪里", en: "Where To Partition?" },
  "information gain": { zh: "信息增益", en: "Information Gain" },
  "another look at our decision tree": { zh: "再看一遍树", en: "Another Look" },
  "the problem of pertubations": { zh: "扰动问题", en: "Perturbations" },
  "the need to go beyond decision trees": { zh: "树的局限", en: "Beyond Trees" },
  "the end": { zh: "结尾", en: "The End" },
  "but first: a theorem from 1785": { zh: "先看 1785 年的定理", en: "A Theorem From 1785" },
  "ensemble learning": { zh: "集成学习", en: "Ensemble Learning" },
  "random forest": { zh: "随机森林", en: "Random Forest" },
  "variance in composition": { zh: "组成方差", en: "Variance in Composition" },
  "variance in predictions": { zh: "预测方差", en: "Variance in Predictions" },
  conclusion: { zh: "小结", en: "Conclusion" },
  "a sketch of the mathematics": { zh: "数学速写", en: "The Mathematics" },
  "our piecewise linear model": { zh: "分段线性模型", en: "Piecewise Linear" },
  "below the interpolation threshold": { zh: "插值阈值之下", en: "Below Interpolation" },
  "at the interpolation threshold": { zh: "恰好插值", en: "At Interpolation" },
  "to infinity! (but not beyond)": { zh: "到无穷（但别越过）", en: "To Infinity" },
  "accuracy is not enough": { zh: "准确率不够", en: "Accuracy Is Not Enough" },
  accuracy: { zh: "准确率", en: "Accuracy" },
  problems: { zh: "问题", en: "Problems" },
  precision: { zh: "精确率", en: "Precision" },
  recall: { zh: "召回率", en: "Recall" },
  tradeoff: { zh: "权衡", en: "Tradeoff" },
  "a visual introduction": { zh: "图解入门", en: "A Visual Introduction" },
  "what is a network": { zh: "什么是网络", en: "What Is A Network" },
  "building blocks: computational graphs": { zh: "计算图", en: "Computational Graphs" },
  "model outputs": { zh: "模型输出", en: "Model Outputs" },
  "activation functions & artificial neurons": { zh: "激活与神经元", en: "Activations" },
  "neural networks": { zh: "神经网络", en: "Neural Networks" },
  architecture: { zh: "结构", en: "Architecture" },
  "no limits": { zh: "没有上限", en: "No Limits" },
  "reduce, reuse, resample": { zh: "折上再折", en: "Reduce, Reuse, Resample" },
  "the validation set approach": { zh: "验证集做法", en: "Validation Set Approach" },
  "problem structure": { zh: "问题结构", en: "Problem Structure" },
  environment: { zh: "环境", en: "Environment" },
  "two options": { zh: "两种选择", en: "Two Options" },
  "line world": { zh: "线世界", en: "Line World" },
  considerations: { zh: "注意", en: "Considerations" },
  "roc curve": { zh: "ROC 曲线", en: "ROC Curve" },
  "regression for classification": { zh: "用来分类的回归", en: "Regression for Classification" },
  "how it works": { zh: "它怎么工作", en: "How It Works" },
  "how it works, briefly": { zh: "先看它怎么算", en: "How It Works, Briefly" },
  "evaluating our model": { zh: "怎么评价模型", en: "Evaluating Our Model" },
  "estimating coefficients": { zh: "系数怎么来", en: "Estimating Coefficients" },
  "interpreting logistic regression models": { zh: "怎么读懂系数", en: "Interpreting Models" },
  "learning the coefficients": { zh: "系数是怎么学来的", en: "Learning Coefficients" },
  "model evaluation": { zh: "模型评价", en: "Model Evaluation" },
  "interpreting regression models": { zh: "怎么读回归", en: "Interpreting Regression" },
  "regression model assumptions": { zh: "模型假设", en: "Assumptions" },
  "backpropagation: how networks learn": { zh: "反向传播：网络怎么学", en: "Backpropagation" },
  "see for yourself": { zh: "自己试一次", en: "See For Yourself" },
  "choosing between two trees": { zh: "两棵树里选一棵", en: "Two Trees" },
  "navigating in a line world": { zh: "线世界里走路", en: "Line World" },
  "navigating in a grid world": { zh: "格子世界里走路", en: "Grid World" },
  "what makes a good roc curve": { zh: "怎样算好的 ROC", en: "A Good ROC" },
  "auc: area under the curve": { zh: "AUC：曲线下面积", en: "AUC" },
  "our previous approach": { zh: "以前的做法", en: "Previous Approach" },
  "k-fold cross-validation": { zh: "K 折交叉验证", en: "K-Fold CV" },
  "leave-one-out cross validation (loocv)": { zh: "留一法交叉验证", en: "LOOCV" },
  "the f1-score": { zh: "F1 分数", en: "F1 Score" },
  "the tradeoff... again": { zh: "权衡又来了", en: "The Tradeoff" },
  "equality of odds": { zh: "几率均等", en: "Equality of Odds" },
  "logistic regression": { zh: "逻辑回归", en: "Logistic Regression" },
  "linear regression": { zh: "线性回归", en: "Linear Regression" },
  "reinforcement learning": { zh: "强化学习", en: "Reinforcement Learning" },
  "precision & recall": { zh: "精确率与召回率", en: "Precision & Recall" },
  "cross validation": { zh: "交叉验证", en: "Cross Validation" },
  "double descent": { zh: "双重下降", en: "Double Descent" },
  "double descent 2": { zh: "双重下降：数学", en: "Double Descent 2" },
  "bias variance tradeoff": { zh: "偏差–方差权衡", en: "Bias–Variance" },
};

function normalize(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .trim()
    .toLowerCase();
}

export function tickLabel(locale: Locale, tick: EssayTick) {
  if (locale === "zh" && tick.zh) return tick.zh;
  const fromId = byId[tick.id.toLowerCase()];
  if (fromId) return fromId[locale];
  const fromTitle = byTitle[normalize(tick.en)];
  if (fromTitle) return fromTitle[locale];
  return locale === "en" ? tick.en : tick.zh || tick.en;
}

const SKIP_ID =
  /^(title-section|title|intro-mobile|intro-icon|intro-text|intro-hed|intro__date|intro-date|intro-author|resources|final-resources|gap|mlu-explain)$/i;
const SKIP_LABEL =
  /^(cindy|mlu-expl|references?\b|resources?\b|jared|by |open source|authors?)$/i;

export function shouldSkipTick(id: string, label: string) {
  if (SKIP_ID.test(id)) return true;
  if (SKIP_LABEL.test(label.trim())) return true;
  if (label.trim().length < 2) return true;
  return false;
}

export function cleanHeading(raw: string) {
  return raw.replace(/\s+/g, " ").trim();
}
