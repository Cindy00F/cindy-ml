export type Category = "models" | "evaluation" | "theory" | "fairness" | "deep" | "applied";

export type LocaleText = { zh: string; en: string };

export type ArticleSection = {
  heading: LocaleText;
  body: LocaleText;
  formula?: string;
  playground?: boolean;
  id?: string;
};

export type Article = {
  slug: string;
  category: Category;
  minutes: number;
  accent: string;
  sourcePath: string;
  title: LocaleText;
  summary: LocaleText;
  sections: ArticleSection[];
};

export const articles: Article[] = [
  {
    slug: "train-test-validation",
    category: "evaluation",
    minutes: 9,
    accent: "#2D3142",
    sourcePath: "train-test-validation",
    title: { zh: "数据为什么要切成训练、验证和测试？", en: "Why split data into train, validation, and test?" },
    summary: {
      zh: "拿小猫小狗来练：用体重和毛量分猫狗。只看训练分数会偏高，所以要另留验证集来选模型，再留测试集估一次没见过的数据。这里正确率大概 92%。\n分错的小动物可以拖过去，分界线会重新算。",
      en: "A kitten-and-puppy task, using weight and fluff. Training accuracy runs high if you tune on it, so we hold out validation to pick a model and a test set for unseen data. Accuracy here is about 92%.\nDrag a misplaced animal and the boundary recomputes.",
    },
    sections: [
      {
        id: "intro",
        heading: { zh: "数据为什么要切开", en: "The Importance of Data Splitting" },
        body: {
          zh: "学监督模型的时候，我常把数据先分成三份，各做各的：训练集、验证集、测试集。\n为什么要这样切？我拿一批假想的宠物来试，只有猫和狗。每只我只知道体重和毛量。接下来就试着猜：它是猫，还是狗。",
          en: "In most supervised tasks, best practice is to split data into three independent sets: training, validation, and testing.\nTo see why, pretend we have a dataset of two kinds of pets: cats and dogs. Each pet has two features: weight and fluffiness. The job is to choose and evaluate a model that classifies a pet as cat or dog.",
        },
      },
      {
        id: "split",
        heading: { zh: "三份数据，三种用途", en: "Train, Test, and Validation Splits" },
        body: {
          zh: "第一步很简单：把宠物随机分成三堆。\n训练集：拿来上课，让模型自己摸规律。\n验证集：换模型、改参数，看谁更稳。\n测试集：藏到最后才打开，估一估到了外面会怎样。",
          en: "First, randomly split the pets into three independent sets.\nTraining set: the data the model learns from.\nValidation set: an unbiased look at how different models and hyperparameters compare.\nTest set: an estimate of accuracy in the wild. Random assignment keeps each split as representative as possible.",
        },
      },
      {
        id: "train",
        heading: { zh: "训练集", en: "The Training Set" },
        body: {
          zh: "训练集是模型真正「上课」的地方。它要从这里抓住以后做预测所需要的模式。因此训练集应当尽量代表我们想建模的总体，并且尽量不要带进偏差——这一阶段的偏差会一路传到推断。为了给模型足够的信息，通常把大部分数据（大约 60%–80%）分给训练。",
          en: "The training set is what the model learns from. It should be as representative as possible of the population we care about, and as unbiased as possible — bias here travels downstream. To give the model enough to learn from, we typically assign the majority of the data (about 60–80%) to training.",
        },
      },
      {
        id: "model",
        heading: { zh: "建立模型", en: "Building Our Model" },
        body: {
          zh: "判断猫还是狗是二分类。这里用逻辑回归：在所选特征上（无 / 体重 / 毛量 / 两者）学一条分界线，线的一侧是猫，另一侧是狗。\n点选特征，看分界线怎么画。把训练集里的动物拖到新位置，分界线会跟着更新。",
          en: "Cat versus dog is binary classification, so we use logistic regression. Given a feature choice (none, weight, fluffiness, or both), it draws a decision boundary: one side cats, the other dogs.\nSelect a feature to see the boundary. Drag animals in the training set and watch it update.",
        },
        playground: true,
      },
      {
        id: "validation",
        heading: { zh: "验证集", en: "The Validation Set" },
        body: {
          zh: "四种特征组合就是四个模型。如果用训练集上的准确率来选，等于用同一份数据既训练又调参，容易过拟合，泛化会差。验证集是一份独立、尽量无偏的数据，专门用来比较这些选择。\n在表里看验证准确率。把动物拖过分界线，数字会变。",
          en: "Four feature choices mean four models. Comparing them on training accuracy uses the same data for learning and tuning, so the model overfits. The validation set is an independent, unbiased set for that comparison.\nRead validation accuracy in the table. Drag pets across the line and the numbers move.",
        },
      },
      {
        id: "test",
        heading: { zh: "测试集", en: "The Testing Set" },
        body: {
          zh: "验证集选定模型和超参数之后，才用测试集去近似上线后的表现。测试集是最后一步，用来评估在未见数据上的表现。\n选定模型之前，绝不该看测试集的分数。偷看测试集也是一种过拟合，会让你对上线表现过于乐观。它只该在验证集已经挑好模型之后，作为最终检查打开一次。",
          en: "After validation has chosen the algorithm and parameters, the test set approximates performance in the wild. It is the last look at unseen data.\nNever inspect test performance before selecting a model. Peeking is a form of overfitting and makes production numbers unreliable. Open it once, after validation has already named the winner.",
        },
      },
      {
        id: "summary",
        heading: { zh: "小结", en: "Summary" },
        body: {
          zh: "你可能会看到：只看毛量的模型在测试集上比「两个特征都用」更高，尽管验证集选的是后者。验证和测试不完全一致，这并不坏。测试分数不是拿来优化的数字，而是对未来表现的估计。\n记住三份数据的分工。训练集：学。验证集：无偏地比较。测试集：最终评估。这样我们对模型有更现实的预期，也更有机会做出能泛化的模型。🐾",
          en: "You may notice the fluffiness-only model scoring higher on test than the both-features model, even if validation picked both. That mismatch can happen, and it is not a failure. Test accuracy is not a number to optimize — it estimates future performance.\nKeep the three roles: train to learn, validate to compare without bias, test to evaluate at the end. That is how we get a realistic picture, and a model that might actually generalize. 🐾",
        },
      },
    ],
  },
  {
    slug: "neural-networks",
    category: "deep",
    minutes: 12,
    accent: "#c45c26",
    sourcePath: "neural-networks",
    title: { zh: "神经网络一层层叠上去，在算什么？", en: "What is a neural net doing when it stacks layers?" },
    summary: {
      zh: "每个神经元先做加权和，再加一层非线性激活，再传给下一层。没有激活，叠再深也只是一条直线。\n改隐藏层宽度，看分界线怎么从直线折成一块一块。",
      en: "Each neuron takes a weighted sum, then a nonlinear activation, then passes it on. Without that bend, a deep stack is still one straight map.\nChange the hidden width and watch the boundary fold into patches.",
    },
    sections: [
      {
        heading: { zh: "一个神经元在做什么", en: "What a neuron computes" },
        body: {
          zh: "人工神经元把输入做成加权和，再加一个偏置，最后送进非线性激活。没有非线性，再深的网络也只是一个大线性变换。ReLU、sigmoid、tanh 的作用，就是让网络能弯折空间。",
          en: "An artificial neuron takes a weighted sum of its inputs, adds a bias, then pushes the result through a nonlinearity. Without that bend, a deep stack is still one linear map. ReLU, sigmoid, and tanh exist so the network can fold space.",
        },
        formula: "z = w · x + b,    a = σ(z)",
      },
      {
        heading: { zh: "层是在组合特征", en: "Layers compose features" },
        body: {
          zh: "第一层往往抓住局部、简单的模式；后一层把这些模式再组合。图像里这表现为边 → 部件 → 物体；表格数据里则是交互项的自动发现。宽度决定这一层能同时记住多少种模式，深度决定组合能走多远。",
          en: "Early layers tend to catch local, simple patterns; later layers recombine them. In images that is edge → part → object. In tabular data it is the automatic discovery of interactions. Width is how many patterns a layer can hold; depth is how far composition can travel.",
        },
      },
      {
        heading: { zh: "学习就是调权重", en: "Learning is moving the weights" },
        body: {
          zh: "损失函数衡量预测和标签的距离。反向传播把这个距离对每个权重的梯度算出来，优化器沿梯度下山。下面的实验把隐藏层宽度和激活函数交给你：观察决策边界如何从直线变成弯曲的区域。",
          en: "A loss measures the gap between prediction and label. Backprop writes that gap as a gradient on every weight; the optimizer walks downhill. The playground below lets you change hidden width and activation so you can watch a straight boundary fold into regions.",
        },
      },
    ],
  },
  {
    slug: "equality-of-odds",
    category: "fairness",
    minutes: 10,
    accent: "#2f6f64",
    sourcePath: "equality-of-odds",
    title: { zh: "准确率很高，漏报和误报对每个群体都一样吗？", en: "High accuracy — are misses and false alarms equal across groups?" },
    summary: {
      zh: "几率均等看的是：真实标签相同时，各群体被判成正的比例该接近，也就是召回率和假正例率要对齐。平均准确率会把这种差别藏起来。\n两边的阈值可以分开拖，看两条错误曲线能不能靠拢。",
      en: "Equality of odds asks that, given the true label, groups have similar true-positive and false-positive rates. Overall accuracy can hide that gap.\nDrag each group's threshold and see if the two error curves can meet.",
    },
    sections: [
      {
        heading: { zh: "准确率会掩盖伤害", en: "Accuracy can hide harm" },
        body: {
          zh: "整体准确率很高，并不代表每个群体都被同样对待。如果模型对群体 A 几乎不漏报、对群体 B 却大量漏报，平均数字仍然可以很好看。公平度量要按群体切开看错误的形状。",
          en: "A high overall accuracy can still treat groups differently. If group A is rarely missed and group B is often missed, the average still looks fine. Fairness metrics slice errors by group.",
        },
      },
      {
        heading: { zh: "几率均等在要求什么", en: "What equality of odds asks" },
        body: {
          zh: "几率均等要求：在真实标签相同的条件下，预测为正的概率不依赖敏感属性。也就是各群体的 TPR（召回）和 FPR 应当接近。它比「人口统计均等」（各组正例率相同）更关注错误的条件分布。",
          en: "Equality of odds asks that, given the true label, the chance of a positive prediction does not depend on a sensitive attribute. In practice, TPR and FPR should match across groups. Unlike demographic parity, it conditions on the actual outcome.",
        },
        formula: "P(Ŷ=1 | Y=y, A=a) = P(Ŷ=1 | Y=y, A=a')",
      },
      {
        heading: { zh: "阈值不是中性的", en: "Thresholds are not neutral" },
        body: {
          zh: "同一个分数阈值，落到不同分数分布的群体上，会产生不同的 TPR/FPR。下面可以分别为两个群体选阈值，看看能否同时拉近两条曲线——这正是后处理公平方法在做的事。",
          en: "The same score threshold, applied to groups with different score distributions, yields different TPR/FPR. Try separate thresholds below and see if the two curves can be pulled together — that is what post-hoc fairness methods attempt.",
        },
      },
    ],
  },
  {
    slug: "logistic-regression",
    category: "models",
    minutes: 11,
    accent: "#3d5a99",
    sourcePath: "logistic-regression",
    title: { zh: "怎么把一条直线，收成 0 到 1 的概率？", en: "How does a straight line become a probability between 0 and 1?" },
    summary: {
      zh: "线性打分没有上下界，不能直接当概率。逻辑回归在外面套一层 sigmoid，输出就落在 0 和 1 之间；再用阈值（常用 0.5）收成是或不是。这里用气温猜晴雨。\n拖阈值，看分类怎么变。",
      en: "A linear score is unbounded, so it is not a probability. Logistic regression wraps it in a sigmoid to land in (0, 1), then a threshold (often 0.5) turns that into yes or no. Here we guess rain from temperature.\nDrag the threshold and watch the labels change.",
    },
    sections: [
      {
        heading: { zh: "为什么不用直线去分类", en: "Why not a straight line" },
        body: {
          zh: "线性回归的输出没有界，不能直接当概率。逻辑回归在线性打分外面套上 sigmoid，强迫输出落在 0 和 1 之间，于是我们可以谈论「属于正类的概率」。",
          en: "Linear regression is unbounded, so it is a poor probability. Logistic regression wraps a linear score in a sigmoid, forcing the output into (0, 1). Now we can talk about the probability of the positive class.",
        },
        formula: "P(y=1 | x) = σ(w · x + b) = 1 / (1 + e^{−(w·x+b)})",
      },
      {
        heading: { zh: "决策边界是一条等概率线", en: "The boundary is an iso-probability" },
        body: {
          zh: "σ(z)=0.5 发生在 z=0，也就是 w·x+b=0 的超平面。阈值不一定是 0.5：提高阈值会更保守，减少假正例、增加漏报。下面的一维实验让你拖动权重、偏置和阈值。",
          en: "σ(z) = 0.5 at z = 0, which is the hyperplane w·x + b = 0. The decision threshold need not be 0.5: raising it is more conservative — fewer false positives, more misses. The 1-D playground lets you drag weight, bias, and threshold.",
        },
      },
      {
        heading: { zh: "用似然而不是平方误差", en: "Likelihood, not squared error" },
        body: {
          zh: "逻辑回归通常最大化伯努利似然，等价于最小化交叉熵。平方误差在概率饱和区梯度消失得更厉害，交叉熵更适合分类。",
          en: "Training typically maximizes Bernoulli likelihood — equivalently, minimizes cross-entropy. Squared error starves the gradient when probabilities saturate; cross-entropy is the better fit for classification.",
        },
      },
    ],
  },
  {
    slug: "linear-regression",
    category: "models",
    minutes: 10,
    accent: "#b4532a",
    sourcePath: "linear-regression",
    title: { zh: "怎么用一条直线去拟合一串数字？", en: "How do you fit a line to a list of numbers?" },
    summary: {
      zh: "线性回归假设目标大约是特征的加权和。常用最小二乘：让每个点和线的竖直距离平方和最小，得到斜率和截距。\n在图上加点，斜率和截距会重新算。",
      en: "Linear regression treats the target as a weighted sum of features. Least squares picks the slope and intercept that minimize the squared vertical gaps.\nAdd a point and those two numbers recompute.",
    },
    sections: [
      {
        heading: { zh: "模型假设很薄，但很有用", en: "A thin, useful assumption" },
        body: {
          zh: "线性回归假设目标大约是特征的加权和，外加噪声。它不要求世界真的是直线，只要求在你关心的区域内，直线是够用的局部故事。可解释性来自系数：其他条件不变时，某特征增加 1，预测大约变化多少。",
          en: "Linear regression assumes the target is roughly a weighted sum of features plus noise. The world need not be a line — only locally linear in the region you care about. Coefficients are the payoff: holding the rest fixed, a one-unit rise in a feature moves the prediction by about that much.",
        },
        formula: "ŷ = w · x + b,    w*, b* = argmin Σ (yᵢ − ŷᵢ)²",
      },
      {
        heading: { zh: "最小二乘的几何", en: "The geometry of least squares" },
        body: {
          zh: "普通最小二乘把残差向量投影到特征张成的空间。解析解是正规方程；特征共线时矩阵病态，需要正则或丢掉冗余列。点击下面的画布加点，看斜率、截距和均方误差一起更新。",
          en: "Ordinary least squares projects the residual onto the span of the features. The closed form is the normal equation; collinear columns make it ill-conditioned, so we regularize or drop redundancy. Click the canvas to add points and watch slope, intercept, and MSE move together.",
        },
      },
      {
        heading: { zh: "残差比 R² 更诚实", en: "Residuals are more honest than R²" },
        body: {
          zh: "R² 只说「解释了多少方差」，不说弯折、扇形异方差或杠杆点。看残差图：系统的曲线意味着该加非线性；喇叭口意味着方差不齐。",
          en: "R² only reports explained variance. It will not confess curvature, fan-shaped heteroscedasticity, or leverage points. Residual plots will: a systematic curve wants a nonlinearity; a trumpet wants a better noise model.",
        },
      },
    ],
  },
  {
    slug: "reinforcement-learning",
    category: "deep",
    minutes: 12,
    accent: "#6b4ea1",
    sourcePath: "reinforcement-learning",
    title: { zh: "没有对错标签，怎么靠奖励学会选？", en: "With no right-or-wrong labels, how do rewards teach a choice?" },
    summary: {
      zh: "强化学习没有成对的 (x, y)，每走一步只有奖励。目标是让长期回报尽量大。没试过的要去试（探索），已经赚得多的也要用（利用）。\n拉几下老虎机，看 ε 怎么在乱试和吃老本之间换。",
      en: "Reinforcement learning has no (x, y) pairs — only a reward after each action. The aim is long-run return. You try unknown arms (explore) and also use the one that already pays (exploit).\nPull the bandits and see how ε trades those two.",
    },
    sections: [
      {
        heading: { zh: "没有标签，只有后果", en: "No labels, only consequences" },
        body: {
          zh: "监督学习和强化学习的分界是反馈的形状。这里没有成对的 (x, y)，只有动作之后的奖励，以及可能被推迟的、被环境动态搅乱的奖励。目标是策略：在每个状态下选动作，使折扣回报的期望最大。",
          en: "The split from supervised learning is the shape of feedback. There are no (x, y) pairs — only rewards after actions, often delayed and tangled in dynamics. The object is a policy: pick an action in each state to maximize expected discounted return.",
        },
        formula: "Gₜ = Rₜ₊₁ + γ Rₜ₊₂ + γ² Rₜ₊₃ + ⋯",
      },
      {
        heading: { zh: "探索与利用", en: "Explore versus exploit" },
        body: {
          zh: "已经尝过的高回报动作很诱人，但也许还有更好的臂没试过。ε-greedy 用很小的概率随机探索，其余时间贪婪地选当前最优。ε 太大则永远在浪费；太小则可能锁死在次优臂上。",
          en: "A familiar high-reward action is tempting, but a better arm may still be untried. ε-greedy explores uniformly with small probability and otherwise picks the current best. Too large an ε wastes pulls; too small an ε can lock onto a mediocre arm.",
        },
      },
      {
        heading: { zh: "价值估计在平均中收敛", en: "Value estimates average toward truth" },
        body: {
          zh: "样本平均 Q(a) 是该臂回报的均值。拉的次数足够多，估计会靠近真实期望。下面五臂老虎机让你调 ε，看累积奖励和每臂的 Q 如何变化。",
          en: "The sample-average Q(a) is the mean return of that arm. With enough pulls it tracks the true expectation. The five-armed bandit below lets you set ε and watch cumulative reward and per-arm Q evolve.",
        },
      },
    ],
  },
  {
    slug: "roc-auc",
    category: "evaluation",
    minutes: 11,
    accent: "#8a3a4a",
    sourcePath: "roc-auc",
    title: { zh: "为什么不能只看一个阈值上的对错？", en: "Why isn't one cutoff enough to judge a model?" },
    summary: {
      zh: "换分数线，真正例率（召回）和假正例率会一起变。ROC 把所有阈值画成一条曲线；AUC 衡量排序好不好，并不指定该用哪条线。\n拖阈值，看工作点在曲线上移动。",
      en: "Move the cutoff and both the true-positive rate and the false-positive rate move. A ROC curve traces every threshold; AUC scores ranking, not which cutoff to use.\nDrag the threshold and watch the operating point travel.",
    },
    sections: [
      {
        heading: { zh: "一个阈值只是一个点", en: "One threshold is one point" },
        body: {
          zh: "混淆矩阵依赖你把分数切成「正/负」的那条线。换阈值，TPR 和 FPR 会一起走。ROC 把所有阈值下的 (FPR, TPR) 连成曲线，避免只汇报某一个工作点。",
          en: "A confusion matrix is hostage to the cut you place on a score. Move the cut and TPR and FPR move with it. A ROC curve traces (FPR, TPR) across every threshold so you are not married to one operating point.",
        },
        formula: "TPR = TP / (TP+FN),    FPR = FP / (FP+TN)",
      },
      {
        heading: { zh: "AUC 在比较排序能力", en: "AUC compares ranking, not calibration" },
        body: {
          zh: "AUC=1 表示完美排序；0.5 相当于抛硬币。它对类别不平衡比原始准确率更稳，但仍然不关心概率是否校准，也不指定你该用哪个阈值。医疗漏报成本高时，要沿着曲线找合适的工作点，而不是只看 AUC。",
          en: "AUC = 1 is perfect ranking; 0.5 is a coin flip. It is more stable than raw accuracy under class imbalance, but it does not care if probabilities are calibrated, and it does not pick a threshold. When misses are costly, walk the curve for an operating point — do not stop at the area.",
        },
      },
      {
        heading: { zh: "动手扫阈值", en: "Sweep it yourself" },
        body: {
          zh: "下面用两类分数模拟一个评分器。拖动阈值，左侧混淆矩阵和右侧 ROC 上的工作点会同步移动。",
          en: "The playground simulates two class-conditional score clouds. Drag the threshold: the confusion matrix on the left and the operating point on the ROC move together.",
        },
      },
    ],
  },
  {
    slug: "cross-validation",
    category: "evaluation",
    minutes: 9,
    accent: "#2d6a4f",
    sourcePath: "cross-validation",
    title: { zh: "只切一次训练和验证，分数会不会太看运气？", en: "Is one train/validation cut just luck?" },
    summary: {
      zh: "交叉验证把数据分成 K 块，轮流拿一块当验证、其余训练，再把 K 个分数平均。常见是 5 折或 10 折。一次随便切，难例扎堆就会偏。\n看色块轮换：每一折都会当一次验证集。",
      en: "Cross-validation splits data into K blocks, holds one out each time, and averages the K scores. Five or ten folds is common. A single cut can lie if hard examples pile up.\nWatch the blocks rotate — each fold is validation once.",
    },
    sections: [
      {
        heading: { zh: "一次划分的运气", en: "Luck in a single split" },
        body: {
          zh: "把数据随手切成训练/验证，误差会跟着这一刀的运气跳。样本少时尤其明显：某一折里难例扎堆，分数就会骗人。交叉验证让每一块数据都当过一次验证。",
          en: "A single train/validation cut inherits the luck of that cut. With small n this is loud: a hard pocket of examples in the holdout lies to you. Cross-validation lets every block serve as validation once.",
        },
      },
      {
        heading: { zh: "K 折的做法", en: "The K-fold recipe" },
        body: {
          zh: "数据分成 K 块。每次拿一块做验证、其余训练，得到 K 个分数再平均。K=5 或 10 最常见。K=n 是留一法，几乎无偏但方差大、算得慢。",
          en: "Split into K blocks. Each round holds one block out, trains on the rest, then averages the K scores. K = 5 or 10 is the usual compromise. K = n is leave-one-out: nearly unbiased, high variance, and slow.",
        },
        formula: "CV = (1/K) Σₖ Error(model trained on all but fold k)",
      },
      {
        heading: { zh: "嵌套，才能选模型", en: "Nest it if you select models" },
        body: {
          zh: "如果用交叉验证挑超参数，再把同一份 CV 分数当最终表现，你会乐观。外层 CV 估泛化，内层 CV 做选择。无论怎样，测试集只看一次。",
          en: "If you use CV to pick hyperparameters and then report that same CV score, you will be optimistic. Outer CV estimates generalization; inner CV selects. Either way, look at the test set once.",
        },
      },
    ],
  },
  {
    slug: "precision-recall",
    category: "evaluation",
    minutes: 10,
    accent: "#9c4a1a",
    sourcePath: "precision-recall",
    title: { zh: "负例特别多的时候，为什么准确率会虚高？", en: "When negatives dominate, why does accuracy look too good?" },
    summary: {
      zh: "负例占 99% 时，全猜「不是」也能到 99% 准确率。精确率问：报出来的有多少是真的。召回率问：真的里面找回了多少。癌症筛查更怕漏诊，所以更看召回。\n拖阈值，看这两项怎么此消彼长。",
      en: "If 99% of rows are negative, always saying no scores 99% accuracy. Precision asks how many raised flags are true; recall asks how many true cases you found. A cancer screen cares more about recall.\nDrag the threshold and watch the two trade.",
    },
    sections: [
      {
        heading: { zh: "先把四个格子叫准", en: "Name the four cells" },
        body: {
          zh: "真正例 TP、假正例 FP、假负例 FN、真负例 TN。准确率是对角线之和除以总数。当负例占 99% 时，永远预测负类也能得到 99% 准确率——这个数字没有决策价值。",
          en: "True positives, false positives, false negatives, true negatives. Accuracy is the diagonal over the total. If negatives are 99%, always saying negative scores 99% — a number with no decision value.",
        },
      },
      {
        heading: { zh: "精确率、召回、F1", en: "Precision, recall, F1" },
        body: {
          zh: "精确率 = TP/(TP+FP)：你报警时有多可信。召回率 = TP/(TP+FN)：漏了多少。F1 惩罚二者中较差的那个。垃圾邮件更在乎精确率（别把正常信扔了）；筛查疾病更在乎召回（别漏掉患者）。",
          en: "Precision = TP/(TP+FP): how trustworthy a raised flag is. Recall = TP/(TP+FN): how many you missed. F1 punishes the worse of the two. Spam filters guard precision (do not bury real mail); screening guards recall (do not miss a patient).",
        },
        formula: "P = TP/(TP+FP),   R = TP/(TP+FN),   F1 = 2PR/(P+R)",
      },
      {
        heading: { zh: "阈值是一种价值判断", en: "A threshold is a value judgment" },
        body: {
          zh: "提高阈值，精确率往往上升、召回下降。没有免费的同时变好，除非模型本身变强。下面用滑块选阈值，观察混淆矩阵和三项指标。",
          en: "Raise the threshold and precision often rises while recall falls. You do not get both for free unless the model itself improves. Use the slider to pick a threshold and watch the matrix and the three scores.",
        },
      },
    ],
  },
  {
    slug: "random-forest",
    category: "models",
    minutes: 11,
    accent: "#1f6b3a",
    sourcePath: "random-forest",
    title: { zh: "一棵树容易记死样本，多棵一起投票会怎样？", en: "One tree memorizes. What happens when many trees vote?" },
    summary: {
      zh: "随机森林给每棵树不同的抽样和特征，最后少数服从多数。单棵树对数据扰动很敏感；合在一起，正好用这种差异把方差压下去。这里用路牌分类来看。\n把树加多，看多数表决的准确率怎么上来。",
      en: "A random forest grows each tree on a different sample and feature subset, then majority-votes. One tree is brittle; together, that disagreement lowers variance. The example is road-sign classification.\nAdd trees and watch majority accuracy climb.",
    },
    sections: [
      {
        heading: { zh: "孔多塞陪审团", en: "Condorcet’s jury" },
        body: {
          zh: "如果每位陪审员独立且正确率高于 50%，多数表决会随人数增加而更准。机器学习里，这要求基学习器既别太差，也别完全同步犯错。随机森林把「有差异」写进训练过程。",
          en: "If each juror is independent and better than chance, majority vote improves with the size of the jury. In machine learning that means base learners must not be terrible, and must not fail in lockstep. Random forests bake disagreement into training.",
        },
      },
      {
        heading: { zh: "两处随机", en: "Randomness in two places" },
        body: {
          zh: "Bagging：每棵树在有放回抽样的 bootstrap 集上生长，有些样本会重复、有些永远进不了这棵树（OOB）。特征随机：每次分裂只看见特征的一个子集。两处扰动降低树与树的相关。",
          en: "Bagging: each tree grows on a bootstrap sample, so some rows repeat and some never appear (the OOB set). Feature randomness: each split sees only a subset of columns. The two perturbations lower tree-to-tree correlation.",
        },
      },
      {
        heading: { zh: "把单树的缺陷变成燃料", en: "Turn a flaw into fuel" },
        body: {
          zh: "单棵决策树对数据扰动极其敏感——这是缺点。森林却需要这种敏感性来制造差异。下面用陪审团定理：调树的数量和单树准确率，看多数表决的准确率如何爬升。",
          en: "A single tree is brittle to small data jitters — a flaw. The forest needs that brittleness to create diversity. The playground is Condorcet’s theorem: change the jury size and per-tree accuracy, and watch majority accuracy climb.",
        },
      },
    ],
  },
  {
    slug: "decision-tree",
    category: "models",
    minutes: 12,
    accent: "#4a7c2c",
    sourcePath: "decision-tree",
    title: { zh: "决策树是怎么一刀一刀把数据切开的？", en: "How does a decision tree cut the data, one question at a time?" },
    summary: {
      zh: "每个节点问一个特征够不够某个值。切在哪里，通常看信息增益：哪一刀最能把标签分开。切到每片都纯，就会把噪声也记住。苹果、樱桃、橡树只是例子。\n看分割线怎么重画；切太深时边界会碎。",
      en: "Each node asks whether a feature is below a threshold. The cut is usually the one with the largest information gain. Pure leaves memorize noise. Apples, cherries, and oaks are just the example.\nWatch the partitions redraw; too deep and they shatter.",
    },
    sections: [
      {
        heading: { zh: "从根走到叶子", en: "Root to leaf" },
        body: {
          zh: "每个内部节点问一个问题：某特征是否小于某阈值。是与否把样本送到两个子节点。叶子给出预测——分类是多数类，回归是均值。新样本从根下落到叶，路径本身就是解释。",
          en: "Each internal node asks whether a feature is below a threshold. Yes and no send examples to two children. A leaf predicts — majority class, or a mean. A new row falls from root to leaf; the path is the explanation.",
        },
      },
      {
        heading: { zh: "熵与信息增益", en: "Entropy and information gain" },
        body: {
          zh: "熵衡量一袋标签有多乱。纯袋（全是一类）熵为 0；两类各半则最大。信息增益是分裂前的熵减去分裂后子袋熵的加权和。ID3 / CART 贪婪地选增益最大的切。",
          en: "Entropy measures how mixed a bag of labels is. A pure bag has entropy 0; a 50/50 bag is maximal. Information gain is parent entropy minus the weighted entropy of the children. ID3 / CART greedily pick the cut with the largest gain.",
        },
        formula: "H = −Σ pₖ log₂ pₖ,    IG = H(parent) − Σ (|c|/|p|) H(c)",
      },
      {
        heading: { zh: "不要切到最后一颗钉子", en: "Do not cut to the last nail" },
        body: {
          zh: "若允许树一直切到每叶纯净，它会记住噪声，换一批数据结构就崩。限制深度、叶最小样本、或事后剪枝，都是在偏差和方差之间刹车。下面可以改两类的数量，观察熵如何起伏。",
          en: "If every leaf must be pure, the tree memorizes noise and shatters when the sample jitters. Cap depth, require a minimum leaf size, or prune after the fact — brakes on the bias-variance see-saw. Change the two-class counts below and watch entropy move.",
        },
      },
    ],
  },
  {
    slug: "bias-variance",
    category: "theory",
    minutes: 11,
    accent: "#7a3e6d",
    sourcePath: "bias-variance",
    title: { zh: "模型太简单或太复杂，测试误差分别会怎样？", en: "If a model is too simple or too complex, what happens to test error?" },
    summary: {
      zh: "平方误差可以拆成偏差、方差和噪声。太简单：平均瞄偏，偏差大。太复杂：换一批训练数据就跳，方差大。中间常有一个谷。打靶只是这个意思的图。\n拖复杂度，看测试误差先降再升。",
      en: "Squared error splits into bias, variance, and noise. Too simple: the aim is off (bias). Too complex: a new sample makes the fit jump (variance). A valley often sits in the middle.\nDrag complexity and watch test error fall, then rise.",
    },
    sections: [
      {
        heading: { zh: "误差的三种来源", en: "Three sources of error" },
        body: {
          zh: "平方误差可以拆成偏差平方、方差、以及不可约噪声。偏差：模型族平均而言瞄错了目标。方差：换一批训练数据，模型跳得很厉害。噪声：即使是完美模型也消不掉的随机性。",
          en: "Squared error splits into bias², variance, and irreducible noise. Bias: the model class aims at the wrong place on average. Variance: a new training draw makes the fitted model leap. Noise: randomness no perfect model can erase.",
        },
        formula: "E[(y − ŷ)²] = Bias² + Variance + Noise",
      },
      {
        heading: { zh: "U 形从哪来", en: "Where the U comes from" },
        body: {
          zh: "模型太简单：偏差主导，训练和测试误差都高。模型太复杂：训练误差继续降，测试误差因方差反升。经典故事的谷底在中间。KNN 的 k、树的深度、多项式次数，都是这条轴上的旋钮。",
          en: "Too simple: bias dominates, train and test error both sit high. Too complex: train error keeps falling while test error rises on variance. The classic valley is in the middle. KNN’s k, tree depth, polynomial degree — knobs on that same axis.",
        },
      },
      {
        heading: { zh: "现代模型没有废除这条曲线", en: "Modern models do not repeal it" },
        body: {
          zh: "下一篇会看到双重下降：过了插值点，测试误差可能再次下降。那不是「方差不存在了」，而是过参数化改变了插值的方式。先在下面把经典 U 形摸熟。",
          en: "The next essay shows double descent: past the interpolation point, test error can fall again. That is not “variance vanished”; over-parameterization changes how interpolation happens. First get the classic U under your fingers.",
        },
      },
    ],
  },
  {
    slug: "double-descent",
    category: "theory",
    minutes: 12,
    accent: "#1f4e79",
    sourcePath: "double-descent",
    title: { zh: "过了刚好记满训练集的点，测试误差为什么还能再降？", en: "Past the point of a perfect training fit, why can test error fall again?" },
    summary: {
      zh: "参数刚好够把训练误差打到零，叫插值点。这附近测试误差常鼓起来；再增加参数，更平滑的插值可能让测试误差再降。这就是双重下降。它没有说越复杂越好，只说明复杂度轴在插值点附近不平滑。\n看插值点附近那座峰。",
      en: "The interpolation point is where training error first hits zero. Test error often peaks there; with still more parameters, a smoother interpolator can bring it down again. That is double descent — not “bigger is always better.”\nWatch the peak near interpolation.",
    },
    sections: [
      {
        heading: { zh: "插值点", en: "The interpolation point" },
        body: {
          zh: "当模型参数多到刚好能把训练集误差打到零，我们就进入插值区。经典直觉说：再复杂只会记噪声，测试误差应继续变差。实验里却常看到第二段下降。",
          en: "When a model has just enough parameters to drive training error to zero, we enter the interpolation regime. Classical instinct says more complexity only memorizes noise, so test error should keep worsening. Experiments often show a second descent instead.",
        },
      },
      {
        heading: { zh: "两种过拟合", en: "Two kinds of overfit" },
        body: {
          zh: "在插值点附近，能完美记住训练数据的方式很多，其中一些非常扭曲，泛化很差——这是峰值。再增加参数，隐式正则（比如最小范数解）会偏向更平滑的插值，测试误差反而下来。",
          en: "Near interpolation there are many ways to memorize the training set; some are wild and generalize poorly — that is the peak. Add still more parameters and implicit regularization (a minimum-norm interpolator, for example) prefers smoother interpolations, so test error falls.",
        },
      },
      {
        heading: { zh: "和偏差–方差共存", en: "It lives with bias–variance" },
        body: {
          zh: "双重下降没有宣布「越复杂越好」。它说明：复杂度轴在插值点附近不平滑，U 形右边还可以再弯一次。深度网络经常工作在这个过参数区，所以经典「先停在谷底」的处方并不完整。",
          en: "Double descent does not say “bigger is always better.” It says the complexity axis is not smooth at interpolation; the right side of the U can bend again. Deep nets often live in that over-parameterized regime, so “stop in the valley” is an incomplete prescription.",
        },
      },
    ],
  },
  {
    slug: "double-descent-2",
    category: "theory",
    minutes: 13,
    accent: "#153e66",
    sourcePath: "double-descent2",
    title: { zh: "多项式刚好穿过每个点时，为什么线最抖？", en: "When a polynomial hits every point, why is the curve the wobbliest?" },
    summary: {
      zh: "次数加一刚好等于点数时，插值多项式往往在点之间晃得很凶。再升高次数，解不唯一，可以选系数更小、更平滑的那条，测试误差常会下来。这是双重下降的一个干净例子。\n拖多项式次数，看测试误差在插值点附近鼓包。",
      en: "When degree + 1 equals the number of points, the interpolating polynomial often thrashes between them. Higher degree is underdetermined, so a smaller-norm, smoother fit can lower test error. A clean toy for double descent.\nDrag the degree and watch the hump near interpolation.",
    },
    sections: [
      {
        heading: { zh: "从曲线拟合看插值", en: "Interpolation as curve fitting" },
        body: {
          zh: "n 个点、次数 d 的多项式：d+1 < n 时是最小二乘，通常过不了所有点；d+1 = n 时存在唯一插值多项式，往往在点之间剧烈振荡（Runge 现象的亲戚）；d+1 > n 时解不唯一，我们可以选系数范数最小的那条。",
          en: "n points, polynomial degree d: if d+1 < n we least-squares and usually miss some points; if d+1 = n a unique interpolant exists and often thrashes between points (a cousin of Runge); if d+1 > n the solution is not unique and we may pick the smallest coefficient norm.",
        },
        formula: "min ||w||²  s.t.  Φw = y     (when p > n)",
      },
      {
        heading: { zh: "峰值是最敏感的插值", en: "The peak is the most fragile interpolant" },
        body: {
          zh: "刚好能插值时，模型没有多余自由度去「选一个更平滑的故事」，噪声被硬编进系数，测试误差最高。过参数之后，最小范数约束像一层隐式平滑，振荡被压住。",
          en: "At exact interpolation there is no spare freedom to choose a smoother story, so noise is baked into the coefficients and test error peaks. Once over-parameterized, a minimum-norm constraint acts like implicit smoothing and damps the oscillation.",
        },
      },
      {
        heading: { zh: "下面用次数当复杂度", en: "Degree as complexity" },
        body: {
          zh: "拖动多项式次数。观察训练 MSE 何时碰到零，以及测试 MSE 如何在插值点附近鼓起、再在更高次数处落下。这是双重下降最干净的玩具模型之一。",
          en: "Drag polynomial degree. Watch when training MSE hits zero, and how test MSE humps near interpolation then eases at higher degree. It is one of the cleanest toys for double descent.",
        },
      },
    ],
  },
  {
    slug: "rfm-pharmacy",
    category: "applied",
    minutes: 10,
    accent: "#2f6f64",
    sourcePath: "rfm-pharmacy",
    title: { zh: "RFM 怎么给中国零售药店做价值分层？", en: "How does RFM rank retail pharmacies in China?" },
    summary: {
      zh: "把每家店看成一个客户：R 是最近一次进货隔了几天，F 是一年进了几次，M 是进货金额。三个分数各打 1 到 5，用来分开核心店、潜力店、沉睡大户和边缘店。\n点一家店看 RFM 码；把日期往后推，看分层怎么变。",
      en: "Treat each pharmacy as a customer: Recency is days since the last order, Frequency is orders per year, Monetary is purchase amount. Each gets a 1–5 score, then stores split into core, grow, sleeping, and edge.\nClick a store for its RFM code; shift the calendar and watch segments move.",
    },
    sections: [
      {
        id: "rfm-intro",
        heading: { zh: "药店也可以是「客户」", en: "A pharmacy is also a customer" },
        body: {
          zh: "药企或商业公司看零售药店，和药店看会员，用的是同一套账。RFM 只问三件事：最近一次买是什么时候（Recency），买了多少次（Frequency），花了多少钱（Monetary）。\n在中国零售药店里，这三列常常来自流向或订单：最近一次开单日期、年内订单次数、年内回款或开票金额。连锁总部和单体店要分开看，因为连锁的 F 和 M 往往被集中采购抬高，并不等于门店自己更勤。",
          en: "A manufacturer or wholesaler looking at retail pharmacies is doing the same job as a pharmacy looking at members. RFM asks three things: how recently they bought, how often, and how much.\nIn China that usually comes from chargeback or order files: last invoice date, orders in the year, and amount. Chains and independents should be read apart: a chain’s F and M are often inflated by central purchasing.",
        },
      },
      {
        id: "rfm-score",
        heading: { zh: "三个数怎么打成 1 到 5", en: "How three numbers become 1 to 5" },
        body: {
          zh: "每一列在当批药店里排序，再切成五段。金额高、次数多，分数高。最近进货正好相反：间隔越短，R 越高。常见写法是三个分数连在一起，比如 545，而不是先加总成一个数。加总会把「很久没来的大户」和「刚来的小单」混成相近的总分，分层就糊了。",
          en: "Each column is ranked in the current batch and cut into five bins. Higher money and frequency score higher. Recency is reversed: fewer days since the last order scores higher. The usual code is the three digits together, such as 545, not a single sum. A sum can make a lapsed big buyer look like a new small one.",
        },
        formula: "R, F, M ∈ {1,2,3,4,5}    码 = R||F||M",
      },
      {
        id: "rfm-seg",
        heading: { zh: "分层对应什么动作", en: "What each segment is for" },
        body: {
          zh: "核心药店：近、勤、金额大，适合稳住首推和库存深度。潜力药店：近、金额不小，但次数偏少，值得加拜访或补品种。沉睡大户：金额或次数曾经高，但已经很久没进货，先问断货原因，而不是继续压指标。边缘药店：又远又少又小，不一定要和核心店用同一套政策。\n医保定点、慢病续方会把 F 和 M 托起来；旅游店、新开业店的 R 很好，却不能当成核心。分数只是排序，不是利润。",
          en: "Core stores are recent, frequent, and large — hold the primary SKU and depth. Grow stores are recent and sizable but infrequent — more calls or a broader list. Sleeping accounts used to be large and have gone quiet — ask why before pushing a quota. Edge stores are distant, rare, and small; they do not need the core policy.\nNRDL / chronic refill can lift F and M; a tourist shop or a new opening can look recent without being core. The scores rank; they are not profit.",
        },
      },
      {
        id: "rfm-try",
        heading: { zh: "十六家店", en: "Sixteen stores" },
        body: {
          zh: "下面是一组示意数据，不是某家公司的真实流向。点店名看三个分数；把「今天」往后推，所有店的 R 都会变差，核心店会往下掉。",
          en: "The table is a sketch, not a real chargeback file. Click a store to see the three scores. Push the calendar forward and every R worsens; core stores slip.",
        },
        playground: true,
      },
    ],
  },
  {
    slug: "kmeans-territory",
    category: "applied",
    minutes: 10,
    accent: "#c45c26",
    sourcePath: "kmeans-territory",
    title: { zh: "K-means 怎么给医药代表划辖区？", en: "How can K-means cut sales territories for pharma reps?" },
    summary: {
      zh: "把医院和药店看成地图上的点，K 是代表人数。算法把每家机构分给最近的中心，再把中心挪到该组的平均位置，重复到不再动。\n拖机构、改人数，看片区怎么裂开；也看各片点的数量并不均匀。",
      en: "Treat hospitals and pharmacies as points, and K as the number of reps. The algorithm assigns each site to the nearest center, moves the center to the group mean, and repeats.\nDrag sites or change K and watch territories split; the counts will not stay even.",
    },
    sections: [
      {
        id: "km-intro",
        heading: { zh: "辖区先是一张距离图", en: "A territory starts as a distance map" },
        body: {
          zh: "医药代表的辖区，本质是：这些医院和药店由谁覆盖。手工划片常按行政区、熟人或历史配额，结果是有人跑不完，有人吃不饱。K-means 的输入很瘦：每个点的坐标，以及你打算设几个中心。这里的中心可以理解成代表的驻点。",
          en: "A rep territory is the question of who covers which hospitals and pharmacies. Hand-drawn maps follow districts, relationships, or old quotas, and one person is overloaded while another is idle. K-means takes little: coordinates, and how many centers you want. A center can be read as a rep’s base.",
        },
      },
      {
        id: "km-algo",
        heading: { zh: "两步循环：先分人，再挪驻点", en: "Two steps: assign, then move" },
        body: {
          zh: "先随便（或尽量分散地）放 K 个中心。第一步：每家机构归最近的中心。第二步：每个中心挪到自己名下那些点的平均位置。两步轮流做，直到分组不再变。它最小化的是组内距离的平方和，不是开车时间，也不是各人的工作量。",
          en: "Place K centers, preferably spread out. Assign every site to the nearest center, then move each center to the mean of its sites. Repeat until the groups stop changing. The thing being minimized is within-cluster sum of squares — not drive time, and not workload.",
        },
        formula: "argmin_{C,S}  Σ_k Σ_{x∈S_k} ||x − c_k||²",
      },
      {
        id: "km-try",
        heading: { zh: "一座示意的城", en: "A sketch of a city" },
        body: {
          zh: "图上有医院（大点）和药店（小点），大致落在老城、大学城、开发区和江北。改代表人数，或把一家店拖过江，片区会重算。方块是算法给出的驻点。",
          en: "Hospitals are the larger dots, pharmacies the smaller ones, roughly in the old town, campus, development zone, and the north bank. Change the number of reps, or drag a store across the river, and the map recomputes. Squares are the implied bases.",
        },
        playground: true,
      },
      {
        id: "km-limit",
        heading: { zh: "它不会替你做的事", en: "What it will not do for you" },
        body: {
          zh: "直线近，过江可能要绕桥；三甲医院和单体店的工作量也不一样。K-means 默认各片差不多圆，对初始中心也敏感，所以同一张图多跑几次，片区会跳。真正落地还要加约束：尽量不拆同一连锁、工作量接近、少跨区。算法给出的是一张距离草稿，不是最后的人事命令。",
          en: "A short straight line can still mean a long bridge. A tertiary hospital is not the same workload as an independent shop. K-means likes round blobs and jumps when you reseed. A real map still needs constraints: keep a chain together, even the load, avoid crossing districts. The algorithm drafts a distance map; it does not issue the roster.",
        },
      },
    ],
  },
];

export const categories: { id: Category | "all"; label: LocaleText }[] = [
  { id: "all", label: { zh: "全部", en: "All" } },
  { id: "models", label: { zh: "模型", en: "Models" } },
  { id: "evaluation", label: { zh: "评估", en: "Evaluation" } },
  { id: "theory", label: { zh: "理论", en: "Theory" } },
  { id: "deep", label: { zh: "深度", en: "Depth" } },
  { id: "fairness", label: { zh: "公平", en: "Fairness" } },
  { id: "applied", label: { zh: "应用", en: "Applied" } },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function neighbors(slug: string) {
  const i = articles.findIndex((a) => a.slug === slug);
  return {
    prev: i > 0 ? articles[i - 1] : null,
    next: i >= 0 && i < articles.length - 1 ? articles[i + 1] : null,
  };
}
