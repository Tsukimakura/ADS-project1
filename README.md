# ADS Project 1 · Search Tree Presentation

这是课程项目的独立网页幻灯片仓库，使用 [Reveal.js](https://revealjs.com/) 实现二维演示结构：

- `←` / `→`：切换大章节；
- `↑` / `↓`：浏览当前章节的详细页面；
- `Esc` 或 `O`：打开二维总览并跳转；
- `F`：进入全屏；
- `S`：打开 speaker view 和讲稿备注。

仓库只保存演示文稿、实验数据副本、图表脚本和部署配置，不修改原 C 项目。

## 项目结构

```text
.
├── index.html                  # Reveal.js 页面和二维分隔规则
├── main.js                     # Reveal.js 初始化与插件配置
├── style.css                  # 演示文稿视觉样式
├── public/
│   ├── slides.md              # 6 个水平章节、34 页和 speaker notes
│   └── charts/                # 自动生成的性能图
├── data/
│   └── benchmark-results.csv  # 原始性能测试数据副本
├── scripts/
│   ├── generate-charts.mjs    # CSV → SVG
│   └── validate-slides.mjs    # 检查章节、备注和资源
├── docs/
│   └── PRESENTATION_GUIDE.md  # 讲解节奏和分工建议
└── .github/workflows/         # PR 检查与 Pages 部署
```

## 本地运行

推荐 Node.js 22：

```bash
npm install
npm run dev
```

终端会显示本地网址，通常为 `http://localhost:5173/`。

生产构建：

```bash
npm run check:slides
npm run build
```

构建结果位于 `dist/`，该目录不提交到 Git。

## 修改章节

主要内容位于 `public/slides.md`。使用以下注释分隔页面：

```markdown
# Chapter 1

<!-- v -->

## Detail page inside Chapter 1

<!-- h -->

# Chapter 2
```

- `<!-- h -->` 创建新的水平章节；
- `<!-- v -->` 创建当前章节中的垂直页面；
- `Note:` 后面的内容是当前页面的 speaker notes。

修改后运行：

```bash
npm run check:slides
```

校验脚本会检查六个章节的结构、34 页讲稿备注和图片路径。

## 更新实验数据

替换 `data/benchmark-results.csv` 后运行：

```bash
npm run charts
```

随后同时提交 CSV 与 `public/charts/` 中重新生成的 SVG。不要直接手工编辑 SVG。

## GitHub 协作与部署

每项修改使用独立分支和 Pull Request。示例：

```bash
git switch -c slides/revise-splay
# 修改并检查
git add public/slides.md
git commit -m "docs: clarify splay tree explanation"
git push -u origin slides/revise-splay
```

连接一个空 GitHub 仓库：

```bash
git remote add origin git@github.com:<owner>/ADS-project1.git
git push -u origin main
```

Pull Request 会自动检查图表、二维结构和生产构建；合并到 `main` 后会自动部署 GitHub Pages。网页地址通常为：

```text
https://<owner>.github.io/ADS-project1/
```

如果 Pages 没有自动启用，在仓库 `Settings → Pages` 中将构建来源设为 `GitHub Actions`。
