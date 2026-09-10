# Cindy 在学习机器学习

14 篇机器学习可视化文章，全部使用 [MLU-Explain](https://mlu-explain.github.io/) 发布稿（CC BY-SA 4.0）。交互和版式与原作相同。

**线上地址：** [https://cindy00f.github.io/cindy-ml/](https://cindy00f.github.io/cindy-ml/)

语言切换、亮/暗主题始终固定在每一页最顶部。文章目录在右侧，做成类似 Time Machine / Codex 的刻度滑轮。GitHub Pages 上的站点不需要登录。

如果这个链接还是 404，到仓库 **Settings → Pages**：Source 选 **Deploy from a branch**，Branch 选 **`gh-pages`**，文件夹选 **`/` (root)**，保存后再等一两分钟。

## 先说清楚：127.0.0.1 是哪台电脑

`http://127.0.0.1:4321` **只属于正在跑这个网站的那台机器**。

- 云端 Agent 预览里打开，连的是云端那台机器上的服务。
- 你自己电脑的 Chrome 地址栏里输入同一个地址，连的是**你的电脑**。如果本机没有启动这个项目，页面就会打不开。这不是文章丢了，是浏览器找错了电脑。

文章不是一个可以双击的 `.html`。它是 Next.js 站点里的一页，正文在 `public/essays/train-test-validation/`，必须先启动开发服务器。

## Windows：用 bat 启动

1. 安装 [Node.js 20+](https://nodejs.org)（装好后重开一次命令行或资源管理器）。
2. 把本项目放到电脑上（克隆仓库，或从 Cursor 把文件夹同步下来）。
3. 双击项目根目录的 `start.bat`。
4. 等几秒，浏览器会打开训练/验证/测试集这篇。不要关掉那个黑色窗口。

本地开发需要登录：`xinyi00f@outlook.com` / `cindy`。也可以点「访客进入」。GitHub Pages 上的站点不需要登录。

## macOS / Linux

```bash
npm install
npm run dev
```

然后打开 [http://127.0.0.1:4321](http://127.0.0.1:4321)。

## 文章

训练/验证/测试集、神经网络、几率均等、逻辑回归、线性回归、强化学习、ROC & AUC、交叉验证、精确率与召回率、随机森林、决策树、偏差–方差权衡、双重下降。
