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
  ['Unbalanced BST', '#fb7185'],
  ['AVL', '#60a5fa'],
  ['Splay', '#2dd4bf'],
  ['Red-Black', '#c084fc'],
  ['B+ (order 3)', '#fb923c'],
  ['B+ (order 100)', '#facc15'],
]

const scenarios = {
  increasing_same: 'Increasing insert · increasing delete',
  increasing_reverse: 'Increasing insert · reverse delete',
  random_random: 'Random insert · random delete',
}

const width = 1200
const height = 620
const margin = { left: 92, right: 42, top: 90, bottom: 116 }
const plotWidth = width - margin.left - margin.right
const plotHeight = height - margin.top - margin.bottom
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
    '<rect width="1200" height="620" rx="24" fill="#0b1220"/>',
    `<text x="${margin.left}" y="42" fill="#f8fafc" font-family="Inter,Arial,sans-serif" font-size="27" font-weight="700">${escapeXml(title)}</text>`,
    `<text x="${margin.left}" y="69" fill="#94a3b8" font-family="Inter,Arial,sans-serif" font-size="16">Total time · logarithmic axes · lower is better</text>`,
  ]

  for (let power = yMinPower; power <= yMaxPower; power += 1) {
    const value = 10 ** power
    const py = y(value)
    svg.push(`<line x1="${margin.left}" y1="${py}" x2="${width - margin.right}" y2="${py}" stroke="#243148"/>`)
    svg.push(`<text x="${margin.left - 14}" y="${py + 5}" text-anchor="end" fill="#94a3b8" font-family="Inter,Arial,sans-serif" font-size="14">${value >= 1000 ? `${value / 1000}s` : `${value}ms`}</text>`)
  }

  for (const size of sizes) {
    const px = x(size)
    svg.push(`<line x1="${px}" y1="${margin.top}" x2="${px}" y2="${height - margin.bottom}" stroke="#18243a"/>`)
    svg.push(`<text x="${px}" y="${height - margin.bottom + 28}" text-anchor="middle" fill="#94a3b8" font-family="Inter,Arial,sans-serif" font-size="14">${size / 1000}k</text>`)
  }

  for (const [tree, color] of trees) {
    const points = selected
      .filter((row) => row.tree === tree)
      .sort((a, b) => Number(a.n) - Number(b.n))
      .map((row) => ({ n: Number(row.n), ms: Number(row.total_ns) / 1_000_000 }))
    const path = points.map((point, index) => `${index ? 'L' : 'M'} ${x(point.n).toFixed(1)} ${y(point.ms).toFixed(1)}`).join(' ')
    svg.push(`<path d="${path}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linejoin="round"/>`)
    for (const point of points) {
      svg.push(`<circle cx="${x(point.n).toFixed(1)}" cy="${y(point.ms).toFixed(1)}" r="5" fill="${color}" stroke="#0b1220" stroke-width="2"><title>${escapeXml(tree)}: N=${point.n}, ${point.ms.toFixed(3)} ms</title></circle>`)
    }
  }

  trees.forEach(([tree, color], index) => {
    const lx = margin.left + (index % 3) * 340
    const ly = height - 62 + Math.floor(index / 3) * 27
    svg.push(`<line x1="${lx}" y1="${ly}" x2="${lx + 28}" y2="${ly}" stroke="${color}" stroke-width="4"/>`)
    svg.push(`<text x="${lx + 38}" y="${ly + 5}" fill="#cbd5e1" font-family="Inter,Arial,sans-serif" font-size="15">${escapeXml(tree)}</text>`)
  })

  svg.push('</svg>')
  return svg.join('\n')
}

mkdirSync(join(root, 'public/charts'), { recursive: true })
for (const [scenario, title] of Object.entries(scenarios)) {
  writeFileSync(join(root, `public/charts/${scenario}.svg`), makeChart(scenario, title))
}

console.log('Generated 3 benchmark charts in public/charts/')
