import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const csv = readFileSync(join(root, 'data/benchmark-results.csv'), 'utf8').trim()
const [header, ...lines] = csv.split(/\r?\n/)
const columns = header.split(',')
const rows = lines.map((line) => {
  const values = line.split(',')
  return Object.fromEntries(columns.map((name, index) => [name, values[index]]))
})

const trees = [
  ['Unbalanced BST', '普通 BST', '#c43d4f'],
  ['AVL', 'AVL 树', '#3274b5'],
  ['Splay', '伸展树', '#16877c'],
  ['Red-Black', '红黑树', '#7b55aa'],
  ['B+ (order 3)', '3 阶 B+ 树', '#cf6f21'],
  ['B+ (order 100)', '100 阶 B+ 树', '#9a7b00'],
]

const scenarios = {
  increasing_same: '递增插入 · 同序删除',
  increasing_reverse: '递增插入 · 逆序删除',
  random_random: '随机插入 · 随机删除',
}

const width = 1200
const height = 520
const margin = { left: 88, right: 34, top: 58, bottom: 98 }
const plotWidth = width - margin.left - margin.right
const plotHeight = height - margin.top - margin.bottom
const font = `'Microsoft YaHei','Noto Sans CJK SC',Arial,sans-serif`
const escapeXml = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
const log10 = (value) => Math.log(value) / Math.LN10

function makeChart(scenario, title) {
  const selected = rows.filter((row) => row.scenario === scenario)
  const sizes = [...new Set(selected.map((row) => Number(row.n)))].sort((a, b) => a - b)
  const values = selected.map((row) => Number(row.total_ns) / 1_000_000)
  const xMin = log10(sizes[0])
  const xMax = log10(sizes.at(-1))
  const yMinPower = Math.floor(log10(Math.min(...values)))
  const yMaxPower = Math.ceil(log10(Math.max(...values)))
  const x = (value) => margin.left + ((log10(value) - xMin) / (xMax - xMin)) * plotWidth
  const y = (value) => margin.top + ((yMaxPower - log10(value)) / (yMaxPower - yMinPower)) * plotHeight
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(title)}">`,
    `<rect width="${width}" height="${height}" fill="#fff"/>`,
    `<text x="${margin.left}" y="25" fill="#222" font-family="${font}" font-size="18" font-weight="600">${escapeXml(title)}</text>`,
    `<text x="${width - margin.right}" y="25" text-anchor="end" fill="#667085" font-family="${font}" font-size="14">总时间 · 双对数坐标 · 越低越好</text>`,
  ]

  for (let power = yMinPower; power <= yMaxPower; power += 1) {
    const value = 10 ** power
    const py = y(value)
    const label = value >= 1000 ? `${value / 1000} 秒` : `${value} ms`
    svg.push(`<line x1="${margin.left}" y1="${py}" x2="${width - margin.right}" y2="${py}" stroke="#d9dee5"/>`)
    svg.push(`<text x="${margin.left - 12}" y="${py + 5}" text-anchor="end" fill="#667085" font-family="${font}" font-size="13">${label}</text>`)
  }

  for (const size of sizes) {
    const px = x(size)
    svg.push(`<line x1="${px}" y1="${margin.top}" x2="${px}" y2="${height - margin.bottom}" stroke="#edf0f3"/>`)
    svg.push(`<text x="${px}" y="${height - margin.bottom + 24}" text-anchor="middle" fill="#667085" font-family="${font}" font-size="13">${size / 1000}k</text>`)
  }

  for (const [sourceName, label, color] of trees) {
    const points = selected
      .filter((row) => row.tree === sourceName)
      .sort((a, b) => Number(a.n) - Number(b.n))
      .map((row) => ({ n: Number(row.n), ms: Number(row.total_ns) / 1_000_000 }))
    const path = points.map((point, index) => `${index ? 'L' : 'M'} ${x(point.n).toFixed(1)} ${y(point.ms).toFixed(1)}`).join(' ')
    svg.push(`<path d="${path}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`)
    for (const point of points) {
      svg.push(`<circle cx="${x(point.n).toFixed(1)}" cy="${y(point.ms).toFixed(1)}" r="4.5" fill="#fff" stroke="${color}" stroke-width="2.5"><title>${escapeXml(label)}：N=${point.n}，${point.ms.toFixed(3)} ms</title></circle>`)
    }
  }

  trees.forEach(([, label, color], index) => {
    const lx = margin.left + (index % 3) * 350
    const ly = height - 58 + Math.floor(index / 3) * 25
    svg.push(`<line x1="${lx}" y1="${ly}" x2="${lx + 26}" y2="${ly}" stroke="${color}" stroke-width="4"/>`)
    svg.push(`<text x="${lx + 36}" y="${ly + 5}" fill="#344054" font-family="${font}" font-size="14">${escapeXml(label)}</text>`)
  })

  svg.push('</svg>')
  return svg.join('\n')
}

mkdirSync(join(root, 'public/charts'), { recursive: true })
for (const [scenario, title] of Object.entries(scenarios)) {
  writeFileSync(join(root, `public/charts/${scenario}.svg`), makeChart(scenario, title))
}

console.log('已在 public/charts/ 中生成 3 张性能图表。')
