# 望尘 Explain

个人可视化机器学习学习台。把回归、树模型、评估指标、偏差–方差和双重下降做成可交互的文章，在浏览器里直接玩弄那些概念。

主题谱系受 [Amazon MLU-Explain](https://mlu-explain.github.io/)（[aws-samples/aws-mlu-explain](https://github.com/aws-samples/aws-mlu-explain)，CC BY-SA 4.0）启发；文案与交互均为重新撰写与实现。这是一份个人项目，没有企业标识。

## 功能

- 14 篇中英双语文章，每篇带一个可动手的实验
- 登录页（本机演示账号，无第三方品牌）
- 亮 / 暗模式
- 学习台：检索、分类、阅读进度

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://127.0.0.1:4321](http://127.0.0.1:4321)。

演示账号：`guest@wangchen.dev` / `explain`。也可以点「以访客身份进入」。

登录状态和阅读进度只存在当前浏览器的 `localStorage`。

## 文章

神经网络、几率均等、逻辑回归、线性回归、强化学习、ROC & AUC、交叉验证、训练/验证/测试集、精确率与召回率、随机森林、决策树、偏差–方差权衡、双重下降（直观）、双重下降（数学）。

## 许可

原创代码与文案可按仓库许可使用。MLU-Explain 原文仍遵循其 CC BY-SA 4.0。
