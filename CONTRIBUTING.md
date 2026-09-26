# Collaboration Guide

## 分支与 Pull Request

1. 从最新 `main` 创建短期分支；
2. 一次 PR 只处理一种内容；
3. 使用原子提交，不把数据、样式、部署配置混在一个提交中；
4. 本地检查通过后再推送；
5. 至少由另一位组员 review 后合并。

推荐分支名：

```text
slides/update-avl
data/rerun-benchmark
style/improve-result-table
fix/chapter-navigation
```

推荐提交信息：

```text
docs: clarify red-black deletion repair
data: update benchmark measurements
style: improve chart contrast
fix: restore vertical chapter separator
```

## 内容修改规则

- 幻灯片内容只修改 `public/slides.md`；
- 水平章节使用 `<!-- h -->`；
- 章节内页面使用 `<!-- v -->`；
- 每一页都保留一个 `Note:` 讲稿区域；
- 图片放入 `public/`，并使用相对路径；
- 页面内容尽量只表达一个主要结论。

当前结构必须保持：

```text
6 个水平章节
垂直页数：1, 4, 8, 5, 12, 4
总计：34 页
```

如果确实需要增加或删除页面，请同步修改 `scripts/validate-slides.mjs` 中的 `expectedPages`。

## 提交前检查

```bash
npm install
npm run charts
npm run check:slides
npm run build
git status
```

确认没有提交：

- `node_modules/`；
- `dist/`；
- 导出的 PDF；
- 与当前 PR 无关的修改。

## 推荐仓库保护

在 GitHub 中保护 `main`：

- 只允许通过 Pull Request 合并；
- 要求 `Check presentation / build` 通过；
- 至少需要一位组员批准；
- 禁止对 `main` 强制推送。
