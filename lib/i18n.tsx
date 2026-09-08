"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

export type Locale = "zh" | "en";

const STORAGE_KEY = "wangchen-locale";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof messages.zh) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const messages = {
  zh: {
    brand: "望尘",
    brandEn: "Explain",
    tagline: "核心机器学习概念的可视化文章",
    loginTitle: "进入学习台",
    loginSubtitle: "个人可视化机器学习文库。用交互把抽象概念摊开。",
    email: "邮箱",
    password: "密码",
    signIn: "登录",
    guest: "以访客身份进入",
    fillDemo: "填入演示账号",
    demoHint: "演示账号 guest@wangchen.dev / explain",
    invalidCreds: "邮箱或密码不正确。",
    dashboard: "学习台",
    articles: "文章",
    about: "关于",
    search: "搜索文章…",
    allTopics: "全部主题",
    models: "模型",
    evaluation: "评估",
    theory: "理论",
    fairness: "公平",
    deep: "深度",
    started: "已开始",
    completed: "已读完",
    minutes: "分钟",
    articlesCount: "篇文章",
    lastVisited: "最近阅读",
    noneYet: "还没有阅读记录",
    diveIn: "开始阅读",
    continueReading: "继续阅读",
    markDone: "标记已读",
    marked: "已读完",
    back: "返回学习台",
    interactive: "交互实验",
    readingTime: "阅读约",
    logout: "退出登录",
    light: "亮色",
    dark: "暗色",
    system: "跟随系统",
    language: "语言",
    chinese: "中文",
    english: "English",
    emptySearch: "没有匹配的文章。换个关键词试试。",
    aboutTitle: "关于望尘 Explain",
    aboutBody:
      "望尘 Explain 是一份个人学习台，把机器学习里最值得反复咀嚼的概念做成可视化文章。文章主题受 Amazon MLU-Explain 启发，文案与交互均为重新撰写与实现，不使用任何企业品牌。",
    credit:
      "概念谱系受 aws-samples/aws-mlu-explain 启发，原文以 CC BY-SA 4.0 发布。本仓库为独立个人作品。",
    next: "下一篇",
    prev: "上一篇",
    playgroundHint: "拖动滑块、点击画布，观察数字如何跟着概念一起动。",
    reset: "重置",
    addPoint: "点击画布添加点",
    sourceNote: "原文参考",
    signedInAs: "当前用户",
    welcomeBack: "欢迎回来",
    dashboardLead: "十四篇可视化文章，覆盖回归、树模型、评估指标、偏差方差与双重下降。",
    noPhilips: "个人项目 · 无企业标识",
  },
  en: {
    brand: "Wangchen",
    brandEn: "Explain",
    tagline: "Visual essays on core machine learning",
    loginTitle: "Enter the studio",
    loginSubtitle:
      "A personal library of visual machine-learning essays. Make the abstract move.",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    guest: "Continue as guest",
    fillDemo: "Use demo account",
    demoHint: "Demo account guest@wangchen.dev / explain",
    invalidCreds: "Email or password is incorrect.",
    dashboard: "Studio",
    articles: "Articles",
    about: "About",
    search: "Search articles…",
    allTopics: "All topics",
    models: "Models",
    evaluation: "Evaluation",
    theory: "Theory",
    fairness: "Fairness",
    deep: "Depth",
    started: "Started",
    completed: "Finished",
    minutes: "min",
    articlesCount: "articles",
    lastVisited: "Last read",
    noneYet: "No reading history yet",
    diveIn: "Dive in",
    continueReading: "Continue",
    markDone: "Mark as read",
    marked: "Finished",
    back: "Back to studio",
    interactive: "Playground",
    readingTime: "About",
    logout: "Sign out",
    light: "Light",
    dark: "Dark",
    system: "System",
    language: "Language",
    chinese: "中文",
    english: "English",
    emptySearch: "No matching articles. Try another keyword.",
    aboutTitle: "About Wangchen Explain",
    aboutBody:
      "Wangchen Explain is a personal studio that turns stubborn machine-learning ideas into visual essays. The topic list is inspired by Amazon MLU-Explain; the writing and interactive demos are original. There is no corporate branding.",
    credit:
      "The concept map is inspired by aws-samples/aws-mlu-explain, originally released under CC BY-SA 4.0. This repository is an independent personal project.",
    next: "Next",
    prev: "Previous",
    playgroundHint:
      "Drag sliders and click the canvas. Watch the numbers follow the idea.",
    reset: "Reset",
    addPoint: "Click the canvas to add a point",
    sourceNote: "Inspired by",
    signedInAs: "Signed in as",
    welcomeBack: "Welcome back",
    dashboardLead:
      "Fourteen visual essays covering regression, trees, metrics, bias-variance, and double descent.",
    noPhilips: "Personal project · no corporate mark",
  },
} as const;

const localeListeners = new Set<() => void>();
let localeMemory: Locale | undefined;

function emitLocale() {
  localeListeners.forEach((fn) => fn());
}

function readLocale(): Locale {
  if (typeof window === "undefined") return "zh";
  if (localeMemory) return localeMemory;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  localeMemory = stored === "en" ? "en" : "zh";
  return localeMemory;
}

function subscribeLocale(fn: () => void) {
  localeListeners.add(fn);
  return () => localeListeners.delete(fn);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    readLocale,
    (): Locale => "zh",
  );

  const setLocale = useCallback((next: Locale) => {
    localeMemory = next;
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
    emitLocale();
  }, []);

  const t = useCallback(
    (key: keyof typeof messages.zh) => messages[locale][key],
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
