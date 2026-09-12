(function () {
  if (window.__cindyBridge) return;
  window.__cindyBridge = true;

  function siteBase() {
    var path = window.location.pathname || "";
    var i = path.indexOf("/essays/");
    if (i >= 0) return path.slice(0, i);
    if (window.top && window.top !== window) {
      try {
        var topPath = window.top.location.pathname || "";
        if (topPath.indexOf("/cindy-ml") === 0) return "/cindy-ml";
      } catch (e) {
        /* ignore */
      }
    }
    return "";
  }

  function dashboardUrl() {
    return siteBase() + "/dashboard/";
  }

  var currentLocale = "zh";
  var currentTheme = "light";
  var originals = typeof WeakMap === "function" ? new WeakMap() : null;
  var headingOriginals = typeof WeakMap === "function" ? new WeakMap() : null;
  var applying = false;
  var scheduled = null;
  var announcedReady = false;

  var EXTRA = window.__cindyI18n || {};

  var EN_TO_ZH = {
    "The Importance of Data Splitting": "数据为什么要切开",
    "Train, Test, and Validation Splits": "三份数据，三种用途",
    "The Training Set": "训练集",
    "Building Our Model": "先建一个小模型",
    "The Validation Set": "验证集",
    "The Testing Set": "测试集",
    "Key Takeaways": "我记下的几句",
    "Select feature:": "换个特征看看：",
    Introduction: "开头",
    "The Split": "切开",
    "Train Set": "训练集",
    "Validation Set": "验证集",
    "Test Set": "测试集",
    Summary: "写在最后",
    Model: "模型",
    "Training Set": "训练集",
    "training set": "训练集",
    "testing set": "测试集",
    "validation set": "验证集",
    Fluffiness: "蓬松度",
    fluffiness: "蓬松度",
    Weight: "体重",
    weight: "体重",
    None: "不用",
    Both: "两个都要",
    both: "两个都要",
    Cats: "猫",
    Dogs: "狗",
    Intro: "开头",
    Train: "训练",
    Validation: "验证",
    Test: "测试",
    "logistic regression": "逻辑回归",
    "By Jared Wilber & Brent Werness.": "",
    "In most supervised machine learning tasks, best practice recommends to split your data into three independent sets: a":
      "学监督模型的时候，我常把数据先分成三份，各做各的：",
    "To demo the reasons for splitting data in this manner, we will pretend that we have a dataset made of pets of the following two types:":
      "为什么要这样切？我拿一批假想的宠物来试，只有两类：",
    "Our goal is to make use of the different data splits and identify a best model for classifying a given pet as either a cat or a dog, based on the available features.":
      "我想用这三份数据，凭手头仅有的特征，给每只宠物猜一猜：它是猫，还是狗。",
    "To see why, let's pretend that we have a dataset of two types of pets:":
      "先假装我手头有两类宠物：",
    "Our goal is to identify and evaluate suitable models for classifying a given pet as either a cat or a dog. We'll use train/test/validations splits to do this!":
      "接下来就靠训练 / 验证 / 测试这三份数据，试着找出一个能分清猫狗的模型。",
    "For each pet in the dataset we know only two features:": "每只宠物我只知道两件事：",
    "For each pet in our dataset, we have two features:": "每只宠物有两个特征：",
    "The first step in our classification task is to randomly split our pets into three independent sets:":
      "第一步很简单：把宠物随机分成三堆。",
    "The dataset that we feed our model to learn potential underlying patterns and relationships.":
      "拿来「上课」的那堆，让模型自己去摸规律。",
    "The dataset that we use to understand our model's performance across different model types and parameter choices.":
      "拿来比较的那堆：换模型、改参数，看谁更稳。",
    "The dataset that we use to approximate our model's accuracy in the wild.":
      "藏到最后才打开的那堆，用来估一估到了外面会怎样。",
    "The training set is the dataset that we employ to train our model.":
      "训练集就是模型真正坐下来学的那份。",
    "It is this dataset that our model uses to learn every potential underlying pattern or relationship that will enable making predictions later on.":
      "以后要靠它认猫认狗，所以模型会把这里能抓住的线索都记下来。",
    "Since our model learns from it, it is very important that the training set be as representative as possible of the population that we are trying to model.":
      "它从哪儿学，就会长成什么样。所以这堆最好能像真实世界的缩影。",
    "Additionally, we need to be careful and ensure that it is as unbiased as possible, as any bias at this stage will be propagated downstream during inference.":
      "这里要是偏了，后面怎么调都补不回来——偏差会一路跟着走。",
    "To give our model as much information to learn from as possible, we typically assign the majority (e.g. 60–80%) of our original data to the training set.":
      "为了让它多看一点，我通常会把大部分数据（大概 60%–80%）都留给训练。",
    "Our goal is to determine whether a given pet is a cat or a dog. This is a binary classification task, so we will use a simple but effective model appropriate for this task:":
      "现在只要回答一件事：这只是猫还是狗。二分类，我先用一个够用、也好玩的模型：",
    "Given a particular combination of the available features (": "选定要用的特征（",
    "), the logistic regression classifier will generate a decision boundary to partition the pets into either cats or dogs. Each pet will be classified based on its position relative to the decision boundary: one side for dogs, the other for cats.":
      "）之后，逻辑回归会在图上画出一条分界线。落在哪一侧，就被标成猫或狗。",
    "Select the feature set of your choice to visualize the corresponding logistic regression model's decision boundary.":
      "点一下特征，就能看见对应那条分界线。",
    "Drag each animal in the training set to a new position to see how the boundary updates!":
      "把训练集里的小动物拖到别处，线会跟着挪。",
    "For logistic regression, we can build four different classifiers — one for each choice of features to be included in the model: none , just weight, just fluffiness, or both weight and fluffiness.":
      "特征怎么选，就能变出四个小模型：什么都不用、只用体重、只用蓬松度、两个都用。",
    "How should we decide which model to select?": "那我该留哪一个？",
    "We could compare the accuracy of each model on the training set, but doing so will result in a biased outcome — if we use the same exact dataset for both training and tuning, the model will overfit and will not generalize well beyond that dataset.":
      "看着训练集上的分数来挑，其实有点作弊：同一份数据既拿来学又拿来打分，模型容易把这份的脾气背下来，换一批就不灵。",
    "This is where the validation set comes in": "所以才要验证集",
    "it acts as an independent, unbiased dataset for comparing the performance of different algorithm and hyperparameter choices trained on our training set.":
      "它是另开的一小叠，专门用来比较：在训练集上学来的那些选择，谁更经得起看。",
    "In our case, we are only looking at one algorithm (logistic regression), but we can view the number of considered features as a hyperparameter that we would like to tune":
      "这里我只玩一种算法（逻辑回归），不过「用几个特征」也可以当成要调的旋钮",
    "For expository purposes, we won't worry about other choices for our logistic regression model, such as specific solvers or regularization penalties":
      "求解器、正则这些我先按下不表，免得把故事讲岔",
    "Select a feature to view the model's performance on the validation set in the table below.":
      "选一个特征，下面这张表会告诉你它在验证集上的样子。",
    "Drag the feature across the line to see how the performance updates!":
      "把小动物拖过那条线，数字会跟着跳。",
    "So, assuming you did not go too crazy moving the pets around, our best model (according to the validation set) is the model that takes both features into account.":
      "如果你没有把宠物拖得太离谱，验证集多半会站在「两个特征都用」这边。",
    "Once we have used the validation set to determine the algorithm and parameter choices that we would like to use in production, the test set is used to approximate the models's true performance in the wild.":
      "等验证集帮我敲定要用哪个，才轮到测试集：估一估拿到没见过的数据上，大概会怎样。",
    "Let's repeat that again:": "我想再叮嘱一句：",
    "the test set is used as the final step in evaluating our model's performance on unseen data.":
      "测试集是最后才拆的信封，用来看模型遇见新数据时的表现。",
    "We should never, under any circumstance, look at the test set's performance before selecting a model.":
      "模型还没选定之前，我不会去翻测试集的分数。",
    "The role of model selection and parameter tuning is strictly for the validation set.":
      "选哪个、调什么，都只发生在验证集上。",
    "Peeking at our test set performance ahead of time is a form of overfitting, and will likely lead to unreliable performance expectations in production. It should only be checked as the final form of evaluation, after the validation set has been used to identify the best model.":
      "提前偷看，也是一种过拟合：你会以为自己很准，上了真环境才发现数字不可信。等验证集已经挑好了，再打开一次就够。",
    'You may have noticed that the test accuracy of the "just fluffiness" model was higher than that of the "both features" model, despite the validation set selecting the latter model as the best. This occurrence of the validation performance not exactly matching the test performance might happen, yet it is not a bad thing. Remember that the test performance is not a number to optimize over — it is a metric to assess future performance. It allows us to estimate, with confidence, that our model can distinguish between cats and dogs with 87.5% accuracy.':
      "你也许会看到：只用蓬松度的模型，测试分数反而比「两个都用」更高，尽管验证集选的是后者。两份成绩对不上，其实很正常。测试分数不是拿来刷的，它更像一句对未来的估计——比如，我大概能有八成把握，说出这是猫还是狗。",
    "It is best practice in machine learning to split our data into the following three groups:":
      "所以我给自己记下这个习惯，数据分成三份：",
    "For training of the model.": "用来学。",
    "For unbiased evaluation of the model.": "用来比较，尽量别偏心。",
    "For final evaluation of the model.": "用来做最后一次检查。",
    "Adhering to this setup helps ensure that we have a realistic understanding of our model's performance, and that we (hopefully) built a model that generalizes well to unseen data.":
      "按这个节奏走，我对模型的感觉会更老实一点，也更有机会做出遇见新数据还不慌的东西。",
    "Thanks for reading! To learn more about machine learning, check out":
      "今天先写到这里。想接着看可以回",
    "our website": "画廊",
    "our videos": "",
    "D2L book": "《动手学深度学习》",
    ", watch": "",
    ", or read the": "，也可以翻翻",
    ", a": "，",
    ", and a": "，还有",
    and: "和",
    or: "或",
    ",": "，",
    ".": "。",
    "Train,Test,Validation": "训练、测试、验证",
    "Majority Vote: Cat": "多数：猫",
    "Majority Vote: Dog": "多数：狗",
    "Majority Vote:": "多数：",
    "Logistic Regression": "逻辑回归",
    "Linear Regression": "线性回归",
    "Neural Networks": "神经网络",
    "Reinforcement Learning": "强化学习",
    "Precision & Recall": "精确率与召回率",
    Precision: "精确率",
    Recall: "召回率",
    Accuracy: "准确率",
    Problems: "问题",
    Perceptrons: "感知机",
    Perceptron: "感知机",
    "Classification Threshold:": "分类阈值：",
    "Classification Threshold": "分类阈值",
    Interpretation: "怎么读",
    "Rainy Day": "雨天",
    "Sunny Day": "晴天",
    "F1-Score": "F1 分数",
    "Precision:": "精确率：",
    "Recall:": "召回率：",
    "Random Forest": "随机森林",
    "Decision Trees": "决策树",
    "Bias Variance Tradeoff": "偏差–方差权衡",
    "Double Descent": "双重下降",
    "Double Descent 2": "双重下降：数学",
    "ROC & AUC": "ROC 与 AUC",
    "K-Fold Cross-Validation": "K 折交叉验证",
    "Cross-Validation": "交叉验证",
    "Equality of Odds": "几率均等",
    "Regression for Classification": "用来分类的回归",
    "References + Open Source": "参考与开源",
    "MLU-EXPLAIN": "Cindy",
    "MLU-EXPL": "Cindy",
    "MLU-Explain": "Cindy",
    "MLU-Explain articles": "这些笔记",
  };

  for (var extraKey in EXTRA) {
    if (Object.prototype.hasOwnProperty.call(EXTRA, extraKey) && !Object.prototype.hasOwnProperty.call(EN_TO_ZH, extraKey)) {
      EN_TO_ZH[extraKey] = EXTRA[extraKey];
    }
  }

  var SUBS = [
    ["The Importance of Data Splitting", "数据为什么要切开"],
    ["Train, Test, and Validation Splits", "三份数据，三种用途"],
    ["Select feature:", "换个特征看看："],
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
    [", and a", "，还有"],
    [", a", "，"],
    [" and ", "和"],
    [" or ", "或"],
    ["By Jared Wilber & Brent Werness.", ""],
    ["Jared Wilber", ""],
    ["Erin Bugbee", ""],
    ["Brent Werness", ""],
    ["MLU-EXPLAIN", "Cindy"],
    ["MLU-Explain", "Cindy"],
    ["Classification Threshold:", "分类阈值："],
    ["Classification Threshold", "分类阈值"],
    ["Perceptrons", "感知机"],
    ["Perceptron", "感知机"],
    ["Try moving the threshold for yourself!", "自己拖一下阈值试试！"],
    ["We need other metrics.", "所以还得看别的指标。"],
    ["Decision Boundary Threshold", "决策边界阈值"],
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
    var hit = lookupZh(core);
    if (hit != null) return lead + hit + trail;
    hit = lookupZh(compact);
    if (hit != null) return lead + hit + trail;
    var next = core;
    for (var i = 0; i < SUBS.length; i++) {
      if (next.indexOf(SUBS[i][0]) !== -1) next = next.split(SUBS[i][0]).join(SUBS[i][1]);
    }
    return lead + next + trail;
  }

  var LOWER_INDEX = null;
  function lookupZh(key) {
    if (Object.prototype.hasOwnProperty.call(EN_TO_ZH, key)) return EN_TO_ZH[key];
    if (!LOWER_INDEX) {
      LOWER_INDEX = {};
      for (var k in EN_TO_ZH) {
        if (Object.prototype.hasOwnProperty.call(EN_TO_ZH, k)) LOWER_INDEX[k.toLowerCase()] = EN_TO_ZH[k];
      }
    }
    var lower = key.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(LOWER_INDEX, lower)) return LOWER_INDEX[lower];
    return null;
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

  function applyHeadingLocales(root) {
    if (!root || !root.querySelectorAll) return;
    var els = root.querySelectorAll("h1, h2, h3, .intro-hed, .intro-sub, .body-header");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.classList && el.classList.contains("logo")) continue;
      if (el.querySelector && el.querySelector(".katex, .katex-html, math, svg")) continue;
      if (headingOriginals && !headingOriginals.has(el)) headingOriginals.set(el, el.innerHTML);
      var html = headingOriginals ? headingOriginals.get(el) : el.innerHTML;
      if (html != null && el.innerHTML !== html) el.innerHTML = html;
      if (currentLocale !== "zh") continue;
      var compact = String(el.textContent || "").replace(/\s+/g, " ").trim();
      var hit = lookupZh(compact);
      if (hit != null) el.textContent = hit;
    }
  }

  function applyLocale(locale) {
    currentLocale = locale === "en" ? "en" : "zh";
    document.documentElement.setAttribute("lang", currentLocale === "zh" ? "zh-CN" : "en");
    applyHeadingLocales(document.body);
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

  function hideAuthorByline() {
    var dates = document.querySelectorAll("#intro__date, #intro-date");
    for (var d = 0; d < dates.length; d++) dates[d].style.display = "none";
    var logos = document.querySelectorAll("h2.logo, #intro-icon h2");
    for (var L = 0; L < logos.length; L++) logos[L].textContent = "Cindy";

    walk(document.body, function (textNode) {
      var value = textNode.nodeValue || "";
      if (!/Jared\s+Wilber|Brent\s+Werness|Erin\s+Bugbee/i.test(value)) return;
      textNode.nodeValue = value
        .replace(/By\s+Jared\s+Wilber\s*(&|and|、|,)?\s*(Brent\s+Werness|Erin\s+Bugbee)?\.?/gi, "")
        .replace(/Erin\s+Bugbee\s*(&|and|、|,)?\s*Jared\s+Wilber\.?/gi, "")
        .replace(/Jared\s+Wilber/gi, "")
        .replace(/Brent\s+Werness/gi, "")
        .replace(/Erin\s+Bugbee/gi, "")
        .replace(/^[、，,.\s]+|[、，,.\s]+$/g, "");
      if (String(textNode.nodeValue || "").trim()) return;
      var node = textNode.nextSibling;
      var hidden = 0;
      while (node && hidden < 6) {
        var next = node.nextSibling;
        if (node.nodeType === 3 && !String(node.nodeValue || "").trim()) {
          node = next;
          continue;
        }
        if (node.nodeName === "BR") {
          node.style.display = "none";
          hidden += 1;
          node = next;
          continue;
        }
        break;
      }
    });
  }

  function retargetPromo() {
    var links = document.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute("href") || "";
      if (href.indexOf("youtube.com/channel/UC12LqyqTQYbXatYS9AA7Nuw") !== -1) {
        a.style.display = "none";
        continue;
      }
      if (
        href.indexOf("aws.amazon.com/machine-learning/mlu") !== -1 ||
        href.indexOf("mlu-explain") !== -1 ||
        href.indexOf("github.com/aws-samples") !== -1 ||
        href.indexOf("aws-mlu-explain") !== -1
      ) {
        a.removeAttribute("href");
        a.style.display = "none";
        a.setAttribute("aria-hidden", "true");
        continue;
      }
    }
  }

  function announceReady() {
    if (announcedReady || window.parent === window) return;
    announcedReady = true;
    window.parent.postMessage({ type: "cindy-ready" }, "*");
  }

  function applyAll() {
    if (applying) return;
    applying = true;
    try {
      applyTheme(currentTheme);
      hideAuthorByline();
      retargetPromo();
      applyLocale(currentLocale);
      hideAuthorByline();
      fitChartLabels();
      announceReady();
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
  currentLocale =
    readCookie("cindy-locale") === "en" || query.get("lang") === "en" ? "en" : "zh";
  currentTheme =
    readCookie("cindy-theme") === "dark" || query.get("theme") === "dark" ? "dark" : "light";

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

  function wrapSvgLabel(text, rect) {
    if (!text || !rect || typeof text.getBBox !== "function") return;
    var bbox;
    try {
      bbox = text.getBBox();
    } catch (err) {
      return;
    }
    if (!bbox || bbox.width < 2) return;
    rect.removeAttribute("transform");
    rect.setAttribute("x", bbox.x - 12);
    rect.setAttribute("y", bbox.y - 5);
    rect.setAttribute("width", bbox.width + 24);
    rect.setAttribute("height", bbox.height + 10);
  }

  function fitChartLabels() {
    var labels = document.querySelectorAll(".bubble-label");
    var rects = document.querySelectorAll(".bubble-rect");
    var count = Math.min(labels.length, rects.length);
    for (var i = 0; i < count; i++) wrapSvgLabel(labels[i], rects[i]);
    wrapSvgLabel(document.getElementById("hull-text"), document.querySelector("#hull-g > rect"));
  }

  function compactIntroBreaks() {
    var intro = document.getElementById("intro-mobile");
    if (!intro) return;
    var nodes = intro.querySelectorAll("p br");
    var prevBr = false;
    for (var i = 0; i < nodes.length; i++) {
      var br = nodes[i];
      if (prevBr) br.style.display = "none";
      prevBr = true;
      var next = br.nextSibling;
      while (next && next.nodeType === 3 && !String(next.nodeValue || "").trim()) next = next.nextSibling;
      if (next && next.nodeName !== "BR") prevBr = false;
    }
  }

  function fitScrollyChart() {
    var svg = document.getElementById("bubble-svg") || document.querySelector("#scrolly #chart svg");
    if (!svg) return;
    svg.style.width = "";
    svg.style.height = "";
  }

  function scheduleFit() {
    window.setTimeout(function () {
      fitScrollyChart();
      fitChartLabels();
    }, 40);
    window.setTimeout(function () {
      fitScrollyChart();
      fitChartLabels();
    }, 250);
    window.setTimeout(function () {
      fitScrollyChart();
      fitChartLabels();
    }, 800);
  }

  compactIntroBreaks();
  scheduleFit();
  [80, 250, 800, 2000].forEach(function (ms) {
    window.setTimeout(applyAll, ms);
  });
  window.addEventListener("resize", scheduleFit, { passive: true });
  if (typeof ResizeObserver === "function") {
    var figure = document.querySelector("#scrolly figure");
    if (figure) new ResizeObserver(scheduleFit).observe(figure);
  }
  var chartSvg = document.getElementById("bubble-svg");
  if (chartSvg && typeof MutationObserver === "function") {
    new MutationObserver(function () {
      if (applying) return;
      fitChartLabels();
    }).observe(chartSvg, { childList: true, subtree: true, characterData: true });
  }
})();
