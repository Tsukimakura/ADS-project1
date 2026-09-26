# Presentation Guide

本演示使用 Reveal.js 二维导航，由 6 个水平章节和 34 页组成，适合约 12–15 分钟的课堂展示。

## 二维导航

```text
封面  →  Foundations  →  Trees  →  Experiment  →  Results  →  Conclusions
            ↓              ↓            ↓             ↓              ↓
          详细页          详细页        详细页         详细页          详细页
```

- 左右方向键只切换大章节；
- 上下方向键浏览当前章节；
- 按 `Esc` 可以看到完整二维结构；
- 按 `S` 打开 speaker view，查看当前页备注和下一页预览。

## 建议节奏

| 水平章节 | 内容 | 建议时间 |
|---|---|---:|
| Cover | 研究主题和导航方式 | 0.5 分钟 |
| Foundations | 问题、范围与统一接口 | 1.5 分钟 |
| Tree Implementations | 五类树与复杂度 | 4–5 分钟 |
| Experiment Design | 输入、计时与公平性 | 2 分钟 |
| Results | 三种场景、解释与局限 | 5–6 分钟 |
| Conclusions | 总结、复现与问答 | 1 分钟 |

时间不足时，在章节封面直接按右方向键跳过该章节的部分详细页面。

## 多人分工示例

- 组员 A：Cover 与 Foundations；
- 组员 B：Tree Implementations；
- 组员 C：Experiment Design；
- 组员 D：Results 与 Conclusions。

推荐过渡语：

- “接口统一以后，真正产生差异的是各树维护结构的方式。”
- “理解实现后，我们来看如何让这些结构接受完全相同的测试。”
- “测试边界确定后，接下来比较三种操作顺序产生的曲线。”
- “最后把理论增长、实际常数和实验局限放在一起总结。”

## 必须讲清楚的内容

1. 普通 BST 在递增插入下退化为右链；
2. Splay 使用 bottom-up 实现，查询会伸展，但当前实验不测查询；
3. 所有树复用相同输入序列，数据准备不计入时间；
4. 图表使用对数坐标，同时展示极端差距与其他树；
5. B+ order 100 在本次数据中最快，不代表所有平台都最优；
6. 当前结果每组只运行一次，应明确说明实验局限。

## 演示前检查

```bash
npm install
npm run charts
npm run check:slides
npm run build
npm run dev
```

在投影设备上检查：二维箭头、Esc 总览、三张图表、代码字号、全屏模式和 speaker notes。
