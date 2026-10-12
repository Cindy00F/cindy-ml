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
    slug: "bulk-rna-seq-pipeline",
    category: "applied",
    minutes: 18,
    accent: "#2f6f64",
    sourcePath: "bulk-rna-seq-pipeline",
    title: {
      zh: "一组疾病样本里，哪些基因值得继续验证？",
      en: "Which genes in a disease study are worth validating?",
    },
    summary: {
      zh: "分析流程：bulk RNA-seq 差异分析、功能富集、候选筛选与表达验证。把一套常见研究拆成九个模块：从数据下载、差异基因、Venn 交集，到富集、PPI、机器学习、免疫浸润和 GSEA。\n这不是按一遍按钮就能得到结论，而是看懂每一步在回答什么、需要什么输入、输出能支持什么决策，以及哪里最容易误读。",
      en: "Workflow: bulk RNA-seq differential expression, enrichment, candidate prioritization, and expression validation. A common study is split into nine modules: download and preprocessing, DEGs, Venn overlap, enrichment, PPI, machine-learning feature selection, immune infiltration, and GSEA.\nThis is not a button-clicking recipe. It explains each question, input, decision value, and common failure mode.",
    },
    sections: [
      {
        id: "bulk-start",
        heading: { zh: "先别急着跑：这条流水线要回答什么", en: "Start with the question, not the software" },
        body: {
          zh: "bulk RNA-seq 可以理解成：把一批样本里的基因表达量放在一起比较。它通常不直接告诉你“哪个基因就是病因”，而是帮助你逐层缩小范围：哪些基因在两组之间变化？这些基因集中在哪些生物过程？哪些蛋白可能互相作用？能不能找到一小组稳定的候选标志物？它们在独立数据里是否还成立？\n\n所以这套流程更像一条证据链，而不是九张漂亮图片。前面的统计结果决定后面分析的入口；后面的网络和机器学习可以帮助排序，但不能把弱数据变成强结论。最有价值的交付物通常不是“筛出 10 个基因”，而是一个可复现的候选清单：每个候选基因为什么入选、在哪些数据中出现、证据是否独立、下一步要花什么成本验证。",
          en: "Bulk RNA-seq compares gene-expression measurements across a set of samples. It rarely proves that one gene is the cause. Instead, it narrows the search: which genes differ, which biological processes contain them, which proteins may interact, whether a smaller marker panel can be learned, and whether it survives independent data.\n\nThink of the workflow as an evidence chain, not nine attractive figures. Early statistical choices define later inputs. Networks and machine learning can prioritize candidates, but they cannot turn weak data into strong claims. The valuable deliverable is a reproducible candidate list: why each gene was selected, where it appeared, whether the evidence is independent, and what validation will cost next.",
        },
      },
      {
        id: "bulk-data",
        heading: { zh: "模块 1：数据下载与预处理，先确认“账本”没错", en: "Module 1: download and preprocessing" },
        body: {
          zh: "先明确物种、组织、疾病或处理条件、对照组和病例组，以及每个样本的编号。下载的数据可能是原始测序 reads、基因层面的 count matrix，或已经标准化的表达矩阵；它们不能混着当成同一种输入。原始 counts 才适合交给 DESeq2、edgeR 这类模型做测序深度和离散度处理，TPM 或 FPKM 更适合展示，不应直接替代 count-based 差异分析。\n\n预处理的重点不是把图画得更平滑，而是检查样本是否可靠：样本总 reads、检测到的基因数、异常样本、批次、重复设计和分组标签。批次效应如果和病例/对照完全重合，统计模型很难把它们分开；这不是换一个画图配色能解决的问题。建议把样本信息表、过滤规则、基因注释版本和软件版本一起保存，后面每一步都从固定文件读入。",
          en: "First confirm species, tissue, condition, case/control labels, and sample IDs. Downloaded data may be raw reads, gene-level counts, or an already normalized matrix; they are not interchangeable. Raw counts can be modeled by DESeq2 or edgeR for library size and dispersion. TPM or FPKM is useful for display, but should not replace count-based differential testing.\n\nPreprocessing is quality control, not cosmetic smoothing. Check library size, detected genes, outliers, batch, replicate design, and labels. If batch and disease status are perfectly confounded, a model cannot reliably separate them. Save the sample sheet, filtering rule, annotation release, and software versions so every later step reads from fixed inputs.",
        },
      },
      {
        id: "bulk-deg",
        heading: { zh: "模块 2：差异基因分析，先问“变化是否超过噪声”", en: "Module 2: differential expression" },
        body: {
          zh: "差异分析比较的是两组或多组的表达分布，不是挑出两组平均值最大的基因。常见输出包括 log2 Fold Change、P 值、调整后 P 值（通常是 FDR）和表达量。火山图里，横轴表示变化方向和幅度，纵轴表示统计证据；点越靠上不等于生物学影响一定越大，样本量、离散度和多重检验都会影响结果。\n\n阈值要在看结果前写下来，例如 FDR < 0.05，再结合 |log2FC| 和最低表达量。不要为了得到“刚好 20 个基因”而反复调阈值。还要保留完整结果表，因为“未达到阈值”不等于“没有变化”，而是当前样本和噪声下证据还不够。",
          en: "Differential expression compares distributions, not just the largest difference between two means. Typical outputs include log2 fold change, P value, adjusted P value (often FDR), and expression level. In a volcano plot, the x-axis shows direction and magnitude; the y-axis shows statistical evidence. A high point is not automatically a large biological effect.\n\nWrite thresholds before looking at the results, for example FDR < 0.05 together with a |log2FC| and minimum-expression rule. Do not keep changing cutoffs until exactly 20 genes remain. Keep the full table: failing a threshold means the current evidence is insufficient, not that the gene never changes.",
        },
      },
      {
        id: "bulk-venn",
        heading: { zh: "模块 3：Venn 交集，交集是候选入口，不是“真理名单”", en: "Module 3: Venn overlap" },
        body: {
          zh: "Venn 图适合回答一个直观问题：疾病差异基因、某个应激相关基因集、以及其他先验清单之间，有哪些共同成员？图中的交集越小，不代表生物学关系越弱；它也可能只是不同数据集、阈值和注释版本造成的结果。把一个基因放进或移出 Venn，往往只需要改变一个 cutoff。\n\n更稳妥的做法是同时保存“严格交集”和“排名/富集层面的重叠”。如果两个列表方向相反，还要区分上调和下调，不能只按基因名去重。Venn 负责缩小搜索空间，不负责证明这些基因共同驱动了疾病。",
          en: "A Venn plot answers a simple question: which genes are shared by the disease DEG list, a stress-related gene set, and another prior list? A small overlap does not prove a weak relationship. It may reflect different datasets, cutoffs, or annotation versions; one cutoff change can move a gene across the boundary.\n\nKeep both a strict overlap and a rank- or enrichment-based overlap. If directions disagree, separate up- and down-regulated genes instead of matching names only. Venn narrows the search space; it does not prove that the shared genes drive the disease.",
        },
      },
      {
        id: "bulk-enrichment",
        heading: { zh: "模块 4：富集分析，把基因名单翻译成生物过程", en: "Module 4: enrichment analysis" },
        body: {
          zh: "富集分析解决的是“这些基因集中在什么功能里”。GO 常按 BP（生物过程）、CC（细胞组分）、MF（分子功能）组织；KEGG 更像通路地图。点图里常见的 GeneRatio 表示命中基因占输入基因的比例，Count 是命中数量，颜色通常表示调整后 P 值。一个通路点很大，不一定比另一个通路更可信，要同时看背景基因集、FDR、命中数和基因方向。\n\n背景集很重要：如果你的实验只检测到一部分基因，却拿全基因组做背景，富集结果可能被系统性扭曲。相似的 GO term 也常常是同一个信号的不同描述，应该做语义去冗余后再讲故事。富集结果适合生成机制假设，不等同于通路被实验直接激活。",
          en: "Enrichment translates a gene list into biological processes. GO is organized into BP, CC, and MF; KEGG is closer to a pathway map. In a dot plot, GeneRatio is the fraction of input genes that hit a term, Count is the hit count, and color often represents adjusted P value. A large dot is not automatically more credible: inspect the background, FDR, hit count, and direction.\n\nThe background matters. If your experiment could detect only a subset of genes but you use the whole genome as background, enrichment can be biased. Similar GO terms may describe one signal in different words, so reduce redundancy before writing the story. Enrichment generates mechanism hypotheses; it does not directly prove pathway activation.",
        },
      },
      {
        id: "bulk-ppi",
        heading: { zh: "模块 5：PPI 网络，从“共同出现”走向“可能相互作用”", en: "Module 5: PPI networks" },
        body: {
          zh: "PPI 网络把候选蛋白和已知或预测的相互作用连起来。节点越大、连线越多，通常表示网络中心性更高；STRING score 越高，代表数据库对这条关联的支持更强。但网络边可能来自实验、数据库整理、共表达或文本挖掘，不能直接翻译成“两个蛋白在你的样本里发生了物理结合”。\n\n因此 PPI 的商业和科研价值都在于优先级：它可以帮助你决定先验证哪几个节点、先买哪类抗体或先做哪组实验，而不是替你宣布一个新机制。记录物种、STRING 版本、置信度阈值和孤立节点处理方式，才能让网络可以复查。",
          en: "A PPI network connects candidate proteins using known or predicted interactions. A node with many edges may have high network centrality; a higher STRING score means stronger database support. But edges can come from experiments, curation, co-expression, or text mining. They do not prove that two proteins physically bind in your samples.\n\nThe value of PPI is prioritization: which nodes should be validated first, which reagents to buy, or which experiment to run next. It should not announce a new mechanism by itself. Record species, STRING version, confidence cutoff, and how isolated nodes were handled.",
        },
      },
      {
        id: "bulk-ml",
        heading: { zh: "模块 6：机器学习筛特征，预测能力和机制不是一回事", en: "Module 6: machine-learning feature selection" },
        body: {
          zh: "LASSO、随机森林、XGBoost、SVM-RFE 解决的是“在一堆候选基因里，哪些组合更有助于区分病例和对照”。LASSO 会把部分系数压到 0；树模型按分裂带来的信息贡献排序；SVM-RFE 逐步删掉影响较小的特征。它们是不同的筛选视角，不是三位专家投票就自动得到真基因。\n\n最危险的错误是数据泄漏：先用全部样本筛基因，再把筛后的数据交叉验证，准确率会虚高。特征筛选、标准化和模型调参都必须放在训练折里，测试集或独立队列只能最后使用。样本数很小时，模型可能只记住批次和队列；所以同时报告交叉验证、特征数量、随机种子、类别平衡和独立验证结果。机器学习筛的是预测候选，不能单独证明因果机制。",
          en: "LASSO, random forest, XGBoost, and SVM-RFE ask which candidate genes help separate cases from controls. LASSO shrinks some coefficients to zero; tree models rank split-based contribution; SVM-RFE removes weaker features step by step. They are different selection views, not three votes that automatically reveal causal genes.\n\nThe most dangerous mistake is leakage: select genes on all samples, then cross-validate the already-selected matrix. Feature selection, scaling, and tuning must happen inside each training fold; a test set or independent cohort is opened only at the end. With few samples, a model can memorize batch or cohort. Report cross-validation, feature count, seed, class balance, and independent validation. Machine learning prioritizes predictive candidates; it does not prove mechanism.",
        },
      },
      {
        id: "bulk-validation",
        heading: { zh: "模块 7：Hub gene 表达验证，问“换一批样本还成立吗”", en: "Module 7: validate hub-gene expression" },
        body: {
          zh: "Hub gene 往往是根据 PPI 中心性、机器学习入选或多种结果交集得到的候选。表达验证要回到样本层面：在独立队列或留出的测试集里画每个基因的分布，而不是只展示两组均值。箱线图、散点、效应量、置信区间和 P 值要一起看，还要确认方向是否一致。\n\n如果最终目标是诊断或分层，单看 P 值远远不够，还要看 AUC、敏感度、特异度、校准和决策阈值。外部验证的价值在于模拟真实采购和上线场景：换平台、换中心、换人群后，模型是否仍然可用？如果不能，下一步可能是收窄适用人群，而不是继续堆更多基因。",
          en: "Hub genes are often candidates selected by PPI centrality, machine learning, or overlap across analyses. Validation returns to the sample level: use an independent cohort or held-out test set and show distributions, not only group means. Read boxplots, points, effect size, confidence intervals, and P values together, and check whether the direction is consistent.\n\nIf the goal is diagnosis or stratification, P values are not enough. Report AUC, sensitivity, specificity, calibration, and decision thresholds. External validation simulates the real deployment setting: does the model survive a new platform, site, or population? If not, narrow the intended population instead of adding more genes.",
        },
      },
      {
        id: "bulk-immune",
        heading: { zh: "模块 8：免疫浸润，表达矩阵不是细胞计数器", en: "Module 8: immune infiltration" },
        body: {
          zh: "免疫浸润分析根据 bulk 表达矩阵和参考 signature，估计不同免疫细胞的相对丰度。相关性热图可以帮助发现细胞群之间的共变关系，但“估计比例”不是病理切片里的真实细胞数。肿瘤纯度、组织组成、平台差异和 signature 选择都会影响结果。\n\n因此不要只挑一格显著相关就写成“某细胞促进了某基因”。先说明算法和参考集，再检查关键细胞类型是否有合理的生物学方向，并尽量用流式、免疫组化或单细胞数据验证。对项目决策而言，免疫浸润更适合帮助分层和提出验证假设，不适合单独决定治疗方案。",
          en: "Immune-infiltration tools estimate relative cell abundance from bulk expression and reference signatures. A correlation heatmap can reveal co-varying cell programs, but an estimated proportion is not a cell count from a tissue slide. Tumor purity, tissue composition, platform, and signature choice all matter.\n\nDo not turn one significant cell–gene correlation into a causal statement. State the algorithm and reference set, check whether key cell types have plausible directions, and validate with flow cytometry, immunohistochemistry, or single-cell data when possible. For decisions, infiltration analysis is useful for stratification and hypothesis generation, not as a stand-alone treatment rule.",
        },
      },
      {
        id: "bulk-gsea",
        heading: { zh: "模块 9：GSEA，不只看“过线的基因”", en: "Module 9: GSEA looks beyond a cutoff" },
        body: {
          zh: "ORA/GO 富集通常先把基因切成“显著”和“不显著”；GSEA 则把所有基因按统计量排序，问某个基因集是否集中出现在列表顶部或底部。富集曲线的峰值是 running enrichment score，底部的 ranked list 显示基因排序方向。它特别适合样本量不大、单个基因变化不够显著但整体通路有一致偏移的场景。\n\nGSEA 也会继承排序统计量和基因集定义的偏差。要报告排序指标、基因集数据库版本、置换方式、NES 和 FDR；不要把一条曲线写成“通路被激活”，除非方向和实验背景一致。GSEA 和 ORA 互补：一个看全排名的整体趋势，一个看阈值后的命中集合。",
          en: "ORA or GO enrichment first cuts genes into significant and non-significant lists. GSEA ranks all genes by a statistic and asks whether a gene set accumulates near the top or bottom. The peak is the running enrichment score; the ranked-list panel shows direction. This is useful when individual genes miss a cutoff but a pathway shifts coherently.\n\nGSEA still inherits bias from the ranking statistic and gene-set definition. Report the ranking metric, gene-set database version, permutation method, NES, and FDR. Do not call a curve “pathway activation” without checking direction and biological context. GSEA and ORA are complementary: one sees a whole-ranked-list trend, the other sees a thresholded hit set.",
        },
      },
      {
        id: "bulk-delivery",
        heading: { zh: "最后怎么交付：让结果能复现、能解释、能继续投资", en: "How to deliver a result others can trust" },
        body: {
          zh: "建议把每个模块固定成三类文件：输入清单、参数与日志、可审计输出。输入清单回答“用了哪些样本和数据库”；参数与日志回答“为什么得到这个结果”；输出表回答“哪些候选值得下一步验证”。图只是摘要，完整的 DEG 表、富集表、PPI 边表、模型系数和验证指标才是资产。\n\n一个适合新手的执行顺序是：先跑通一套小数据，确认每个模块的输入输出，再替换成自己的队列；每完成一步就保存版本，不要把九个模块塞进一段无法重跑的脚本。每次换数据集时，优先检查样本设计、物种和基因 ID、批次、平台及外部验证条件。这样你得到的不是一次性的“生信图片包”，而是一条可复用的分析产品线：发现信号、排序候选、估算验证成本，再决定是否进入实验或临床研究。",
          en: "For every module, keep three kinds of files: an input manifest, parameters and logs, and auditable outputs. The manifest says which samples and databases were used; the log explains why the result looks this way; the tables say which candidates deserve validation. Figures summarize the work, but the full DEG, enrichment, PPI, model-coefficient, and validation tables are the reusable assets.\n\nA beginner-friendly execution order is to run a small example first, verify every input and output, then replace the dataset. Save a version after each module instead of putting nine opaque steps in one script. When changing cohorts, check design, species and gene IDs, batch, platform, and external-validation conditions first. The result is not a one-off figure pack but a reusable analysis product line: discover signals, prioritize candidates, estimate validation cost, and decide whether to invest in experiments or clinical research.",
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
    title: { zh: "药店客户这么多，下一次该先拜访谁？", en: "With so many pharmacies, whom should we visit next?" },
    summary: {
      zh: "方法：RFM 药店分层（最近进货 Recency、进货频次 Frequency、采购金额 Monetary）。把每家店看成一个客户，三个分数各打 1 到 5，用来区分核心店、潜力店、沉睡大户和边缘店。\n点一家店看 RFM 码；把日期往后推，看分层怎么变。",
      en: "Method: RFM pharmacy segmentation (Recency, Frequency, and Monetary value). Treat each pharmacy as a customer and score each dimension from 1 to 5 to distinguish core, growth, dormant, and edge accounts.\nClick a store for its RFM code; shift the date and watch segments change.",
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
    title: { zh: "代表总在绕路，怎么把辖区划得更合理？", en: "How can we redraw territories to cut rep travel?" },
    summary: {
      zh: "模型：K-means 聚类，用机构坐标生成辖区草案；它优化的是几何距离，不是实际车程或工作量。把医院和药店看成地图上的点，K 是代表人数，算法反复分配机构并移动中心。\n拖机构、改人数，看片区怎么变化；也看各片点数并不均匀。",
      en: "Model: K-means clustering creates a draft territory map from site coordinates; it optimizes geometric distance, not actual drive time or workload. Hospitals and pharmacies are points, K is the number of reps, and the algorithm repeatedly reassigns sites and moves centers.\nDrag sites or change K to see territories change and site counts vary.",
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
        heading: { zh: "从距离草稿到可执行辖区", en: "From a distance sketch to a workable territory" },
        body: {
          zh: "过桥绕江，不要再用经纬度直线距离：先用驾车时间或路网距离做成本矩阵，给跨江、拥堵和禁行路段加上真实代价。这样算法比较的是“这家店要跑多久”，而不是“地图上离得多近”。\n\n三甲医院、普通医院和药店也不能各算一个点。可以把机构先换成工作量：医院按等级、科室数和预计拜访频次设权重；药店则接上 RFM-pharmacy，把最近进货（R）、进货频次（F）和金额（M）合成价值分层。核心店提高拜访权重，沉睡店降低频次但保留唤醒任务；连锁的 RFM 要按门店看，不能让总部集中采购把整条链的工作量虚增。单体店没有连锁协同，通常还要额外计入覆盖成本。\n\n实际做法是：先用 K-means 生成候选片区，再把路网时间、工作量上限、同一连锁不拆分、尽量不跨江等规则放进二次调整。若某片超载，就把边界上的低成本机构移给邻片；若跨江只为一两家高价值店，再比较“增加一名代表”与“保留跨江拜访”的成本。最后多换几组初始中心，选择路程、覆盖价值和负载最均衡的一版。K-means 给的是起点，RFM 和业务约束才把它变成可执行的人事方案。",
          en: "Do not use straight-line coordinates for a bridge or river. Build a cost matrix from driving time or a road network, adding the real cost of crossings, congestion, and restricted roads. The model should compare how long a visit takes, not how close two points look on a map.\n\nA tertiary hospital, a regular hospital, and a pharmacy are not equal points. Turn sites into workload first: weight hospitals by tier, departments, and expected visit frequency; for pharmacies, connect the territory model to RFM-pharmacy. Use recency, frequency, and monetary value to set visit intensity: raise the weight of core stores, lower the cadence for dormant stores while keeping a reactivation task, and score chain stores at the outlet level so central purchasing does not inflate the whole chain. An independent store may need extra coverage cost because it has no chain-level coordination.\n\nIn practice, use K-means to create candidate territories, then adjust them with road time, workload caps, chain indivisibility, and a preference not to cross the river. When a territory is overloaded, move boundary sites with low travel cost to a neighbor. When a river crossing serves only one high-value store, compare adding a rep with keeping that visit across the river. Reseed several times and keep the version with the best balance of travel, covered value, and workload. K-means is the starting point; RFM and business constraints turn it into a workable staffing plan.",
        },
      },
    ],
  },
  {
    slug: "train-test-validation",
    category: "evaluation",
    minutes: 9,
    accent: "#2D3142",
    sourcePath: "train-test-validation",
    title: { zh: "数据为什么要切成训练、验证和测试？", en: "Why split data into training, validation, and test sets?" },
    summary: {
      zh: "主题：监督学习的数据切分（训练集、验证集、测试集）。拿小猫小狗来练：用体重和毛量分猫狗。只看训练分数会偏高，所以要另留验证集来选模型，再留测试集估一次没见过的数据。这里正确率大约 92%。\n分错的小动物可以拖过去，分界线会重新算。",
      en: "Topic: data splitting for supervised learning (training, validation, and test sets). Use weight and fluff to classify kittens and puppies. Training scores can be optimistic, so validation selects the model and a held-out test set estimates performance on unseen data. Accuracy here is about 92%.\nDrag an animal across the boundary and the model updates.",
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
    slug: "game-theory-house",
    category: "applied",
    minutes: 14,
    accent: "#8a3a4a",
    sourcePath: "game-theory-house",
    title: {
      zh: "两个人都想买房，为什么最后可能谁也不买？",
      en: "If both want a home, why might neither person buy?",
    },
    summary: {
      zh: "理论：博弈论（收益矩阵、占优策略、纳什均衡与帕累托改进）。从“要不要和对象一起买房”这个生活问题出发，看看双方选择如何互相影响。\n数字只是解释决策结构的示意，不是房价预测或买房建议；同样的分析也能用于谈判、定价和竞争。",
      en: "Theory: game theory (payoff matrices, dominant strategies, Nash equilibrium, and Pareto improvement). Start with the question of buying a home with a partner and see how each person’s choice affects the other.\nThe numbers are illustrative, not a housing forecast or financial advice. The same reasoning applies to negotiation, pricing, and competition.",
    },
    sections: [
      {
        id: "game-question",
        heading: { zh: "一个人做选择，为什么要想别人？", en: "Why does another person change my decision?" },
        body: {
          zh: "如果买不买只影响你自己，这是个人决策；如果结果还取决于对象买不买，它就成了策略互动。博弈论研究的正是这种情况：参与者各自做选择，每个人的结果都受到自己和别人选择的共同影响。\n\n房子只是一个好懂的故事。这里先假设两个人同时决定买或不买，暂时不考虑首付来源、贷款资格、房屋产权和市场涨跌。真实决策当然复杂得多；我们用一个简化模型，不是替任何人做买房建议，而是看清“我的最好选择，为什么会随着你的选择改变”。",
          en: "If buying affects only you, it is an individual decision. If the outcome also depends on whether your partner buys, it becomes a strategic interaction. Game theory studies situations like this: each participant chooses, and everyone’s outcome depends on the combination of choices.\n\nA home is just an intuitive story. For now, assume both people decide simultaneously to buy or not buy, and set aside down payment, mortgage eligibility, ownership, and market changes. Real decisions are more complex. This simplified model is not financial advice; it helps us see why my best move can depend on yours.",
        },
      },
      {
        id: "game-payoff",
        heading: { zh: "先把“值不值得”写成收益表", en: "Turn “is it worth it?” into a payoff table" },
        body: {
          zh: "博弈论里的收益，不一定是钱，而是一个人认为结果有多好。它可以同时包含居住便利、月供压力、流动性、家庭关系和情绪价值。下面每格按“你，伴侣”的顺序写两个示意分数；分数只表达各自的偏好排序，不是人民币，也不是客观测量。\n\n假设两个人都买，双方各得 2；只有一人买，买的人承担较重负担得 −1，暂时不买的一方因仍能共享居住便利得 4；两个人都不买，各得 0。这个设定很简化，也不一定适合你的情况，但足以演示分析方法。",
          en: "A payoff in game theory is not necessarily money. It represents how much a person values an outcome and can combine convenience, mortgage burden, liquidity, family expectations, and emotional value. Each pair below is ordered as “you, partner.” These illustrative scores express preferences, not yuan or objective measurements.\n\nSuppose both buying gives each person 2. If only one buys, the buyer bears a heavy burden and gets −1, while the other can still share some housing benefit and gets 4. If neither buys, both get 0. This is deliberately simple and may not fit your situation; it is enough to show the method.",
        },
        formula: "                         伴侣买        伴侣不买\n你买                     (2, 2)        (−1, 4)\n你不买                   (4, −1)       (0, 0)",
      },
      {
        id: "game-dominant",
        heading: { zh: "占优策略：不管对方怎么选，我都不吃亏吗？", en: "Dominant strategy: is one move better either way?" },
        body: {
          zh: "先只看你的收益。假如伴侣买，你不买得 4，自己也买得 2；假如伴侣不买，你不买得 0，自己买得 −1。按这张示意表，无论伴侣选什么，“不买”都比“买”对你更好，所以“不买”是你的严格占优策略。若伴侣的偏好完全对称，对伴侣也一样。\n\n这不是说现实中总该不买，而是说结论由收益表的假设推出来。把月供压力调低、给共同居住赋予更高价值，或者把产权和风险安排写进合同，收益表就会变，策略也可能跟着变。先问“这些分数从哪里来”，比背“理性人总选不买”重要得多。",
          en: "Look only at your payoff. If your partner buys, not buying gives you 4 versus 2 if you also buy. If your partner does not buy, not buying gives you 0 versus −1 if you buy. Under this illustrative table, “not buy” is better no matter what your partner chooses, so it is your strictly dominant strategy. If your partner’s preferences are symmetric, it is theirs too.\n\nThis does not mean people should never buy. The conclusion follows from the assumptions in the table. Lower mortgage pressure, greater value placed on living together, or a contract that changes ownership and risk can change the payoffs and the strategy. Asking where the scores came from matters more than memorizing “rational people do not buy.”",
        },
      },
      {
        id: "game-equilibrium",
        heading: { zh: "纳什均衡：稳定，不等于两个人都最满意", en: "Nash equilibrium: stable does not mean best for both" },
        body: {
          zh: "如果两个人都按这套偏好选择“不买”，结果是 (0, 0)。这叫纳什均衡：在对方的选择不变时，任何一个人单独改变策略，都不能让自己过得更好。它描述的是一种稳定状态，不是道德判断，也不是社会总收益最高的状态。\n\n注意，两个人一起买得到 (2, 2)，对双方都比 (0, 0) 好；这个结果对双方构成帕累托改进。但如果每个人单独买都会承担 −1，而对方不买时自己得到 0，那么只靠“总收益更高”不足以让任何一方先承担风险。两个人想抵达更好的结果，可能需要可信承诺、共同预算、产权约定或分担风险的协议。合作不是一句“应该”，它需要可执行的安排。",
          en: "If both follow these preferences and choose not to buy, the outcome is (0, 0). This is a Nash equilibrium: holding the other person’s choice fixed, neither can improve by changing strategy alone. It describes stability, not morality or the outcome with the highest total payoff.\n\nBoth buying gives (2, 2), which is better for each than (0, 0); it is a Pareto improvement. But if buying alone costs −1 while not buying when the other does not buy gives 0, a higher combined payoff does not make either person willing to take the risk first. Reaching the better outcome may require credible commitment, a shared budget, clear ownership, or an agreement on risk. Cooperation needs an enforceable arrangement, not just good intentions.",
        },
      },
      {
        id: "game-beliefs",
        heading: { zh: "别只猜对方是什么人：把“我相信”说出来", en: "Make your beliefs explicit instead of guessing personalities" },
        body: {
          zh: "生活故事里常把人分成“精于计算”和“愿意为爱付出”。博弈论不必给人贴标签；更有用的问题是：对方重视什么、掌握什么信息、相信我会怎么做？如果你只改对方的收益，不改自己的收益，你直接比较自己两种选择的数字通常不会变；但你对对方反应的预测可能改变，尤其当你的选择会影响对方的选择时。\n\n若真实偏好未知，就不是“大家都知道收益表”的完全信息模型，而要考虑类型和信念：你认为对方有多大概率愿意共同承担？对方又如何判断你？把不确定性写成几个情景或概率，再看结论是否稳健，比武断地说“站在对方立场想”更可操作。现实里，沟通和承诺还可能改变收益本身。",
          en: "Everyday stories may label someone “calculating” or “willing to sacrifice for love.” Game theory does not need those labels. Ask instead: what does the other person value, what information do they have, and what do they believe you will do? If only their payoff changes while yours stays fixed, your direct comparison between your own two moves usually does not change. But your prediction of their response may change, especially when your move affects theirs.\n\nIf preferences are unknown, the game has incomplete information: players have beliefs about one another’s types. Represent uncertainty with scenarios or probabilities, then test whether the conclusion is robust. That is more useful than casually saying “put yourself in their shoes.” Communication and commitments can also change payoffs.",
        },
      },
      {
        id: "game-business",
        heading: { zh: "商业里也有“买不买”：定价、谈判和竞争", en: "The same structure appears in pricing and negotiation" },
        body: {
          zh: "企业也会遇到类似互动：两家竞争者要不要降价，供应商和采购方要不要让步，平台和商家要不要共同补贴，新品上市时竞品会不会跟进。每一方都不只在问“这一步赚不赚钱”，还在问“对手看到后会怎么回应”。\n\n用收益表做商业分析，可以把讨论从“我觉得对方会降价”变成可检验的情景：谁是参与者？各自有哪些可选动作？利润、份额、客户留存和现金流分别如何变化？哪些收益是短期的，哪些会在重复交易中累积？接着再检查均衡是否稳健，以及承诺是否可信。收益表不能替代市场数据，但可以帮助团队发现：看似合理的单方策略，是否会把双方都拖进低价、低利润的局面。",
          en: "Companies face similar interactions: whether two competitors cut prices, whether a supplier or buyer concedes, whether a platform and sellers co-fund a promotion, or whether a rival responds to a launch. Each side asks not only “does this move pay?” but also “how will the other side react?”\n\nA payoff table turns “I think they will cut prices” into testable scenarios. Who are the players? What actions can each take? How do profit, share, retention, and cash flow change? Which gains are short-term, and which compound over repeated transactions? Then check whether the equilibrium is robust and commitments credible. A payoff table cannot replace market data, but it can reveal when individually sensible moves push everyone into a low-price, low-margin outcome.",
        },
      },
      {
        id: "game-checklist",
        heading: { zh: "自己分析一场博弈，可以从四个问题开始", en: "A four-question checklist for your next decision" },
        body: {
          zh: "第一，谁在做决定？把受结果影响的人和机构写全。第二，每个人真的能选什么？区分可控动作和外部条件。第三，各种组合对每个人意味着什么？把金钱、时间、风险、关系和长期影响分开列，再说明哪些是事实、哪些是估计。第四，在别人按自己的偏好行动时，我的最佳回应是什么？逐格找最佳回应，看看有没有占优策略和纳什均衡。\n\n然后做敏感性检查：把最不确定的收益上下调一档，结论还成立吗？如果一变就翻转，答案就不是“模型告诉我该怎么做”，而是“我需要先弄清这个关键假设”。这一步能把分析变成下一项行动：去问、去谈、查数据，或设计一个更安全的试验。",
          en: "First, who makes decisions? Include everyone affected by the outcome. Second, what can each person actually choose? Separate controllable actions from outside conditions. Third, what does each combination mean for each person? List money, time, risk, relationships, and long-term effects, and label facts separately from estimates. Fourth, what is my best response when others act according to their own preferences? Mark best responses and look for dominant strategies and Nash equilibria.\n\nThen test sensitivity: move the most uncertain payoff up or down. Does the conclusion change? If a small change flips it, the model is not telling you what to do; it is telling you which assumption to investigate. That points to a next action: ask, negotiate, gather data, or run a safer pilot.",
        },
      },
      {
        id: "game-limits",
        heading: { zh: "模型帮你想清楚，不替你过日子", en: "A model can clarify a choice; it cannot live it for you" },
        body: {
          zh: "博弈论的结论只对写进模型的参与者、选项、信息和收益负责。一次性的静态收益表，装不下感情、法规、贷款风险和多年后的生活变化；真实的人也未必完全理性，承诺更不一定可信。买房这种重大决策还需要独立核实财务承受能力、产权、合同和风险，不能因为一个示意矩阵就下结论。\n\n它真正给新手的能力，是把“我觉得应该这样”拆成几条可以讨论的假设：我想要什么？对方想要什么？什么安排能让合作可信？结果对关键假设有多敏感？学会提出这些问题，才是把博弈论从一张表带回生活和商业现场。",
          en: "A game-theoretic conclusion is only as good as its players, actions, information, and payoffs. A one-shot static table cannot capture a relationship, regulations, mortgage risk, or years of changing circumstances. People may not be perfectly rational, and promises may not be credible. A major purchase also requires independent checks on affordability, ownership, contracts, and risk; never decide from an illustrative matrix alone.\n\nWhat game theory gives a beginner is a way to unpack “I think this is what we should do” into discussable assumptions: what do I value, what does the other person value, what would make cooperation credible, and how sensitive is the result? Asking those questions is how a payoff table becomes useful in life and business.",
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
    title: { zh: "照片太复杂，模型怎样一步步看懂里面是什么？", en: "How can a model make sense of a complicated picture?" },
    summary: {
      zh: "模型：前馈神经网络，由多层加权计算与非线性激活组成。它逐层组合简单特征，形成更复杂的判断；如果没有非线性，叠再多层也仍像一次线性变换。\n改隐藏层宽度，看分类边界如何从直线弯成不同形状。",
      en: "Model: a feed-forward neural network, built from layers of weighted computations and nonlinear activations. It combines simple features into more complex decisions; without nonlinearities, stacking layers still behaves like one linear transformation.\nChange the hidden-layer width and watch the classification boundary bend.",
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
    title: { zh: "模型判得准，为什么有些人还是更容易被误判？", en: "If a model is accurate, why are some people still misjudged?" },
    summary: {
      zh: "公平指标：几率均等（Equality of Odds），在真实标签相同时比较不同群体的召回率和假正例率。整体准确率可能把误差差距藏起来。\n分别拖动两组阈值，看错误率曲线能否靠近。",
      en: "Fairness metric: Equality of Odds compares true-positive and false-positive rates across groups at the same true label. Overall accuracy can hide gaps in error rates.\nAdjust each group’s threshold and see whether the error curves can move closer.",
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
    title: { zh: "明天下雨的概率怎么算？", en: "How can we estimate the chance of rain tomorrow?" },
    summary: {
      zh: "模型：逻辑回归，把特征转成 0 到 1 之间的分类概率。这里用气温估计是否下雨，再通过阈值决定报“雨”还是“不雨”。\n拖动阈值，看分类结果如何变化。",
      en: "Model: logistic regression turns features into a classification probability between 0 and 1. Here, temperature helps estimate whether it will rain; a threshold turns that score into a yes-or-no prediction.\nMove the threshold and watch the classifications change.",
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
    title: { zh: "买房前想估个价：一条直线能帮上什么忙？", en: "Estimating a home’s price: what can a straight line tell us?" },
    summary: {
      zh: "模型：线性回归，用一组特征估计连续数值。最小二乘会找到一条让预测误差平方和尽量小的线；系数描述关联，不自动证明因果。\n在图上加点，看斜率和截距如何重新计算。",
      en: "Model: linear regression estimates a continuous value from features. Least squares finds a line that minimizes squared prediction errors; its coefficients describe associations, not automatic proof of causation.\nAdd a point and watch the slope and intercept update.",
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
    title: { zh: "推荐系统该继续尝新，还是多推用户喜欢的？", en: "Should a recommender try something new or repeat what users like?" },
    summary: {
      zh: "方法：强化学习中的多臂老虎机与 ε-greedy 策略。系统要在尝试新选项（探索）和重复已知受欢迎的选项（利用）之间权衡，争取长期回报。\n拉几次老虎机，看 ε 如何改变探索与利用的比例。",
      en: "Method: the multi-armed bandit and ε-greedy strategy from reinforcement learning. A system balances trying new options (exploration) with repeating known favorites (exploitation) to improve long-run reward.\nPull the bandits and see how ε changes that balance.",
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
    title: { zh: "筛查分数线定多高，才能少漏报又少误报？", en: "Where should a screening cutoff sit to balance misses and false alarms?" },
    summary: {
      zh: "评估工具：ROC 曲线与 AUC，用来比较分类器在不同阈值下的召回率和假正例率。AUC 衡量排序能力，但不会替你选出合适的分数线。\n拖动阈值，看工作点如何沿 ROC 曲线移动。",
      en: "Evaluation tools: the ROC curve and AUC compare true-positive and false-positive rates across thresholds. AUC measures ranking ability, but it does not choose the right cutoff for you.\nMove the threshold and watch the operating point travel along the ROC curve.",
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
    title: { zh: "样本不多，怎么知道模型分数不是碰巧？", en: "With few samples, how do we know the score isn’t luck?" },
    summary: {
      zh: "评估方法：K 折交叉验证。把数据分成 K 份，轮流用一份验证、其余训练，再汇总分数，减少结果对单次切分的依赖。\n看色块轮换：每一折都会当一次验证集。",
      en: "Evaluation method: K-fold cross-validation. Split data into K folds, validate on each fold in turn, and summarize the scores to reduce dependence on one lucky split.\nWatch the blocks rotate — each fold serves as validation once.",
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
    title: { zh: "一千封邮件里只有几封垃圾邮件，准确率还有用吗？", en: "With few spam emails, is accuracy still useful?" },
    summary: {
      zh: "评估指标：精确率、召回率与 F1，专门看类别不平衡时“报出来的有多少是真的”和“真正例找回了多少”。在垃圾邮件或疾病筛查里，漏报和误报的代价并不一样。\n拖动阈值，看精确率与召回率如何此消彼长。",
      en: "Evaluation metrics: precision, recall, and F1 help assess imbalanced classification. They ask how many alerts are correct and how many true cases were found. In spam filtering or screening, false alarms and misses have different costs.\nMove the threshold and watch precision trade off against recall.",
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
    title: { zh: "一棵树判断不稳，多棵树投票能更可靠吗？", en: "If one tree is unreliable, can a forest vote more reliably?" },
    summary: {
      zh: "模型：随机森林，由不同样本和特征训练出的多棵决策树共同投票。它利用树之间的差异降低预测波动；这里用路牌分类作例子。\n增加树的数量，看多数表决的准确率如何变化。",
      en: "Model: a random forest combines votes from decision trees trained on different samples and feature subsets. Diversity between trees can reduce prediction variance; the example uses road-sign classification.\nAdd trees and watch majority-vote accuracy change.",
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
    title: { zh: "苹果、樱桃和橡树混在一起，模型怎么一步步分开？", en: "How can a model sort apples, cherries, and oaks step by step?" },
    summary: {
      zh: "模型：决策树，用一连串“是否满足条件”的问题逐步分类。它优先选择能更好区分标签的切分；树长得太深，也可能把噪声当规律记住。\n看分割区域如何重画；切得太细时，边界会变得零碎。",
      en: "Model: a decision tree classifies items through a sequence of yes-or-no questions. It prefers splits that separate labels, but a tree that grows too deep can memorize noise.\nWatch the regions redraw; overly fine splits make the boundary fragmented.",
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
    title: { zh: "模型太简单学不会、太复杂又爱记答案，怎么拿捏？", en: "How do we avoid a model that underlearns or memorizes?" },
    summary: {
      zh: "理论框架：偏差—方差分解，帮助理解模型为什么会欠拟合或过拟合。简单模型可能抓不住规律，复杂模型则可能过度适应训练样本。\n拖动模型复杂度，看测试误差怎样变化。",
      en: "Theory: the bias–variance decomposition helps explain underfitting and overfitting. A simple model may miss patterns; a complex one may adapt too closely to its training sample.\nChange model complexity and watch test error move.",
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
    title: { zh: "训练集都背下来了，模型变得更大为什么有时反而更准？", en: "If a model memorizes training data, why can making it bigger sometimes help?" },
    summary: {
      zh: "现象：双重下降。模型刚好拟合训练数据时，测试误差可能升高；继续增加模型规模后，测试误差有时又会下降。这不代表模型越大越好。\n看测试误差在插值点附近形成的峰。",
      en: "Phenomenon: double descent. Test error may rise when a model first fits the training data perfectly, then sometimes fall again as model size grows. This does not mean bigger is always better.\nWatch the test-error peak near interpolation.",
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
    title: { zh: "曲线非要穿过每个样本点，为什么预测反而会乱跳？", en: "Why can a curve that hits every sample make jumpy predictions?" },
    summary: {
      zh: "示例模型：多项式回归，用来观察双重下降。曲线刚好穿过所有训练点时，点与点之间可能剧烈振荡；继续提高次数并选择更平滑的解，测试误差有时反而下降。\n拖动多项式次数，观察插值点附近的误差峰。",
      en: "Example model: polynomial regression, used to illustrate double descent. A curve that passes through every training point can oscillate sharply between them; a smoother solution at higher degree may sometimes lower test error.\nChange the polynomial degree and watch the error peak near interpolation.",
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
];

export const categories: { id: Category | "all"; label: LocaleText }[] = [
  { id: "all", label: { zh: "全部", en: "All" } },
  { id: "applied", label: { zh: "应用", en: "Applied" } },
  { id: "models", label: { zh: "模型", en: "Models" } },
  { id: "evaluation", label: { zh: "评估", en: "Evaluation" } },
  { id: "theory", label: { zh: "理论", en: "Theory" } },
  { id: "deep", label: { zh: "深度", en: "Depth" } },
  { id: "fairness", label: { zh: "公平", en: "Fairness" } },
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
