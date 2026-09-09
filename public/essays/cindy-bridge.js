(function () {
  if (window.__cindyBridge) return;
  window.__cindyBridge = true;

  var currentLocale = "zh";
  var currentTheme = "light";
  var originals = typeof WeakMap === "function" ? new WeakMap() : null;
  var applying = false;
  var scheduled = null;

  var EN_TO_ZH = {
    "The Importance of Data Splitting": "为什么要把数据切开",
    "Train, Test, and Validation Splits": "训练、验证与测试划分",
    "The Training Set": "训练集",
    "Building Our Model": "建立模型",
    "The Validation Set": "验证集",
    "The Testing Set": "测试集",
    "Key Takeaways": "要点",
    "Select feature:": "选择特征：",
    Introduction: "引言",
    "The Split": "划分",
    "Train Set": "训练集",
    "Validation Set": "验证集",
    "Test Set": "测试集",
    Summary: "小结",
    Model: "模型",
    "Training Set": "训练集",
    "training set": "训练集",
    "testing set": "测试集",
    "validation set": "验证集",
    Fluffiness: "蓬松度",
    fluffiness: "蓬松度",
    Weight: "体重",
    weight: "体重",
    None: "无",
    Both: "两者",
    both: "两者",
    Cats: "猫",
    Dogs: "狗",
    Intro: "引言",
    Train: "训练",
    Validation: "验证",
    Test: "测试",
    "logistic regression": "逻辑回归",
    "By Jared Wilber & Brent Werness.": "Jared Wilber、Brent Werness。",
    "In most supervised machine learning tasks, best practice recommends to split your data into three independent sets: a":
      "在大多数监督学习任务里，常见做法是把数据分成三份互不重叠的集合：",
    "To demo the reasons for splitting data in this manner, we will pretend that we have a dataset made of pets of the following two types:":
      "为了说明为什么要这样切，我们假装手头有一批宠物数据，只有两类：",
    "Our goal is to make use of the different data splits and identify a best model for classifying a given pet as either a cat or a dog, based on the available features.":
      "我们要用这三份数据，根据已有特征，找出最适合把宠物分成猫或狗的模型。",
    "To see why, let's pretend that we have a dataset of two types of pets:":
      "先假装我们有两类宠物：",
    "Our goal is to identify and evaluate suitable models for classifying a given pet as either a cat or a dog. We'll use train/test/validations splits to do this!":
      "目标是找出并评估能把宠物分成猫或狗的模型。训练 / 验证 / 测试集就是用来做这件事的。",
    "For each pet in the dataset we know only two features:": "每只宠物我们只知道两个特征：",
    "For each pet in our dataset, we have two features:": "每只宠物有两个特征：",
    "The first step in our classification task is to randomly split our pets into three independent sets:":
      "分类的第一步，是把宠物随机分成三份互不重叠的集合：",
    "The dataset that we feed our model to learn potential underlying patterns and relationships.":
      "喂给模型、让它学习潜在规律和关系的那份数据。",
    "The dataset that we use to understand our model's performance across different model types and parameter choices.":
      "用来比较不同模型和参数、看谁表现更好的那份数据。",
    "The dataset that we use to approximate our model's accuracy in the wild.":
      "用来近似模型在真实环境里准不准的那份数据。",
    "The training set is the dataset that we employ to train our model.":
      "训练集就是我们拿来训练模型的那份数据。",
    "It is this dataset that our model uses to learn every potential underlying pattern or relationship that will enable making predictions later on.":
      "模型靠这份数据学习之后做预测时可能用到的规律。",
    "Since our model learns from it, it is very important that the training set be as representative as possible of the population that we are trying to model.":
      "因为模型是从这里学的，训练集必须尽量代表我们真正想描述的整体。",
    "Additionally, we need to be careful and ensure that it is as unbiased as possible, as any bias at this stage will be propagated downstream during inference.":
      "还要尽量减少偏差：这里一旦偏了，后面推理都会跟着偏。",
    "To give our model as much information to learn from as possible, we typically assign the majority (e.g. 60–80%) of our original data to the training set.":
      "为了让模型多看一些例子，通常会把原始数据的大部分（例如 60–80%）分给训练集。",
    "Our goal is to determine whether a given pet is a cat or a dog. This is a binary classification task, so we will use a simple but effective model appropriate for this task:":
      "我们要判断一只宠物是猫还是狗。这是二分类，所以用一个简单够用的模型：",
    "Given a particular combination of the available features (": "给定一组可用特征（",
    "), the logistic regression classifier will generate a decision boundary to partition the pets into either cats or dogs. Each pet will be classified based on its position relative to the decision boundary: one side for dogs, the other for cats.":
      "），逻辑回归会画出一条决策边界，把宠物分成猫和狗。每只宠物落在边界的哪一侧，就被标成那一类。",
    "Select the feature set of your choice to visualize the corresponding logistic regression model's decision boundary.":
      "选一组特征，就能看到对应逻辑回归模型的决策边界。",
    "Drag each animal in the training set to a new position to see how the boundary updates!":
      "把训练集里的动物拖到新位置，边界会跟着改。",
    "For logistic regression, we can build four different classifiers — one for each choice of features to be included in the model: none , just weight, just fluffiness, or both weight and fluffiness.":
      "逻辑回归可以做出四个分类器，分别对应：不用特征、只用体重、只用蓬松度、两个都用。",
    "How should we decide which model to select?": "那该选哪一个模型？",
    "We could compare the accuracy of each model on the training set, but doing so will result in a biased outcome — if we use the same exact dataset for both training and tuning, the model will overfit and will not generalize well beyond that dataset.":
      "可以看它们在训练集上的准确率，但这样会偏：同一批数据既训练又调参，模型容易过拟合，换一批数据就不灵。",
    "This is where the validation set comes in": "验证集就是为这件事准备的",
    "it acts as an independent, unbiased dataset for comparing the performance of different algorithm and hyperparameter choices trained on our training set.":
      "它是一份独立、不偏的数据，用来比较在训练集上学来的不同算法和超参数。",
    "In our case, we are only looking at one algorithm (logistic regression), but we can view the number of considered features as a hyperparameter that we would like to tune":
      "这里只看一种算法（逻辑回归），但用几个特征可以当成要调的超参数",
    "For expository purposes, we won't worry about other choices for our logistic regression model, such as specific solvers or regularization penalties":
      "为了讲清楚，这里先不管求解器和正则这些细节",
    "Select a feature to view the model's performance on the validation set in the table below.":
      "选一个特征，下面表格会显示模型在验证集上的表现。",
    "Drag the feature across the line to see how the performance updates!":
      "把特征在轴上拖动，数字会跟着变。",
    "So, assuming you did not go too crazy moving the pets around, our best model (according to the validation set) is the model that takes both features into account.":
      "如果你没有把动物拖得太离谱，验证集选中的最好模型就是两个特征都用的那个。",
    "Once we have used the validation set to determine the algorithm and parameter choices that we would like to use in production, the test set is used to approximate the models's true performance in the wild.":
      "用验证集定下算法和参数之后，测试集才用来近似模型在真实环境里的表现。",
    "Let's repeat that again:": "再说一遍：",
    "the test set is used as the final step in evaluating our model's performance on unseen data.":
      "测试集只用于最后一步，评估模型在没见过的数据上的表现。",
    "We should never, under any circumstance, look at the test set's performance before selecting a model.":
      "在选定模型之前，任何情况下都不该先看测试集成绩。",
    "The role of model selection and parameter tuning is strictly for the validation set.":
      "选模型和调参，只发生在验证集上。",
    "Peeking at our test set performance ahead of time is a form of overfitting, and will likely lead to unreliable performance expectations in production. It should only be checked as the final form of evaluation, after the validation set has been used to identify the best model.":
      "提前偷看测试集也是一种过拟合，上线后的预期会不可信。只有验证集挑出最好模型之后，才看测试集做最终评估。",
    'You may have noticed that the test accuracy of the "just fluffiness" model was higher than that of the "both features" model, despite the validation set selecting the latter model as the best. This occurrence of the validation performance not exactly matching the test performance might happen, yet it is not a bad thing. Remember that the test performance is not a number to optimize over — it is a metric to assess future performance. It allows us to estimate, with confidence, that our model can distinguish between cats and dogs with 87.5% accuracy.':
      "你可能发现：只用蓬松度的模型，测试准确率反而高于双特征模型，尽管验证集选的是后者。验证成绩和测试成绩不完全一样，并不算坏事。测试成绩不是拿来优化的数字，而是对未来表现的估计。它让我们有把握地说：这个模型大约能以 87.5% 的准确率区分猫和狗。",
    "It is best practice in machine learning to split our data into the following three groups:":
      "机器学习里的常见做法，是把数据分成下面三组：",
    "For training of the model.": "用来训练模型。",
    "For unbiased evaluation of the model.": "用来不偏地评估模型。",
    "For final evaluation of the model.": "用来做最终评估。",
    "Adhering to this setup helps ensure that we have a realistic understanding of our model's performance, and that we (hopefully) built a model that generalizes well to unseen data.":
      "按这个流程走，才能比较真实地理解模型表现，也更有机会做出能泛化到新数据上的模型。",
    "Thanks for reading! To learn more about machine learning, check out":
      "谢谢阅读。想继续学机器学习，可以去看",
    "our website": "网站",
    "our videos": "视频",
    "D2L book": "《动手学深度学习》",
    "Train,Test,Validation": "训练、测试、验证",
  };

  var SUBS = [
    ["The Importance of Data Splitting", "为什么要把数据切开"],
    ["Train, Test, and Validation Splits", "训练、验证与测试划分"],
    ["Select feature:", "选择特征："],
    ["Training Set", "训练集"],
    ["Validation Set", "验证集"],
    ["Test Set", "测试集"],
    ["Fluffiness", "蓬松度"],
    ["fluffiness", "蓬松度"],
    ["Weight", "体重"],
    ["logistic regression", "逻辑回归"],
    ["training set", "训练集"],
    ["validation set", "验证集"],
    ["testing set", "测试集"],
    [", and a ", "，以及"],
    [", a ", "，"],
  ];

  function readCookie(name) {
    var match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : "";
  }

  function looksChinese(text) {
    return /[\u4e00-\u9fff]/.test(text);
  }

  function translateEnglish(raw) {
    if (raw == null) return raw;
    var lead = (raw.match(/^\s*/) || [""])[0];
    var trail = (raw.match(/\s*$/) || [""])[0];
    var core = raw.slice(lead.length, raw.length - trail.length);
    if (!core) return raw;
    var compact = core.replace(/\s+/g, " ").trim();
    if (EN_TO_ZH[core]) return lead + EN_TO_ZH[core] + trail;
    if (EN_TO_ZH[compact]) return lead + EN_TO_ZH[compact] + trail;
    var next = core;
    for (var i = 0; i < SUBS.length; i++) {
      if (next.indexOf(SUBS[i][0]) !== -1) next = next.split(SUBS[i][0]).join(SUBS[i][1]);
    }
    return lead + next + trail;
  }

  function walk(node, visit) {
    if (!node) return;
    if (node.nodeType === 3) {
      visit(node);
      return;
    }
    if (node.nodeType !== 1) return;
    var tag = node.nodeName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA") return;
    for (var child = node.firstChild; child; child = child.nextSibling) walk(child, visit);
  }

  function applyLocale(locale) {
    currentLocale = locale === "en" ? "en" : "zh";
    document.documentElement.setAttribute("lang", currentLocale === "zh" ? "zh-CN" : "en");
    walk(document.body, function (textNode) {
      var value = textNode.nodeValue;
      if (value == null || !value.trim()) return;
      if (originals) {
        if (!originals.has(textNode) || !looksChinese(value)) originals.set(textNode, value);
        value = originals.get(textNode);
      }
      textNode.nodeValue = currentLocale === "zh" ? translateEnglish(value) : value;
    });
  }

  function applyTheme(theme) {
    currentTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.classList.toggle("cindy-dark", currentTheme === "dark");
    if (document.body) document.body.classList.toggle("cindy-dark", currentTheme === "dark");
  }

  function applyAll() {
    if (applying) return;
    applying = true;
    try {
      applyTheme(currentTheme);
      applyLocale(currentLocale);
    } finally {
      applying = false;
    }
  }

  function scheduleApply() {
    if (scheduled) return;
    scheduled = setTimeout(function () {
      scheduled = null;
      applyAll();
    }, 30);
  }

  function go(id) {
    if (!id) return false;
    var el = document.getElementById(id);
    if (!el) el = document.querySelector('section[id="' + id + '"]');
    if (!el) return false;
    var html = document.documentElement;
    var prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    var root = document.scrollingElement || html;
    var y = el.getBoundingClientRect().top + (window.pageYOffset || root.scrollTop || 0) - 8;
    if (y < 0) y = 0;
    if (window.scrollTo) window.scrollTo(0, y);
    root.scrollTop = y;
    html.scrollTop = y;
    if (document.body) document.body.scrollTop = y;
    try {
      el.scrollIntoView({ block: "start", inline: "nearest" });
    } catch (err) {}
    html.style.scrollBehavior = prev;
    notifyTick(id);
    return true;
  }

  window.__cindyGo = go;

  function notifyTick(explicitId) {
    var id = explicitId;
    if (!id) {
      var selected =
        document.querySelector("#toc a.selected") ||
        document.querySelector("#toc .selected a") ||
        document.querySelector("#toc li.selected a");
      if (selected) {
        id = (selected.getAttribute("href") || "").replace("#", "") || selected.getAttribute("data-page");
      }
    }
    if (!id || window.parent === window) return;
    window.parent.postMessage({ type: "cindy-tick", id: id }, "*");
  }

  window.addEventListener("message", function (event) {
    var data = event.data || {};
    if (data.type === "cindy-go") go(data.id);
    if (data.type === "cindy-prefs") {
      if (data.locale) currentLocale = data.locale;
      if (data.theme) currentTheme = data.theme;
      applyAll();
    }
  });

  window.addEventListener(
    "scroll",
    function () {
      notifyTick();
    },
    { passive: true },
  );

  var query = new URLSearchParams(window.location.search);
  currentLocale = query.get("lang") || readCookie("cindy-locale") || currentLocale;
  currentTheme = query.get("theme") || readCookie("cindy-theme") || currentTheme;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyAll);
  } else {
    applyAll();
  }

  var toc = document.getElementById("toc");
  if (toc && typeof MutationObserver === "function") {
    new MutationObserver(function () {
      notifyTick();
    }).observe(toc, { attributes: true, subtree: true, attributeFilter: ["class"] });
  }

  if (document.body && typeof MutationObserver === "function") {
    new MutationObserver(function () {
      if (applying) return;
      scheduleApply();
    }).observe(document.body, { childList: true, subtree: true });
  }
})();
