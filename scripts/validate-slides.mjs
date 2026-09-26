import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(join(root, 'public/slides.md'), 'utf8')
const chapters = source.split('<!-- h -->')
const slides = chapters.flatMap((chapter) => chapter.split('<!-- v -->'))
const expectedPages = [1, 4, 8, 5, 12, 4]
const actualPages = chapters.map((chapter) => chapter.split('<!-- v -->').length)

if (chapters.length !== expectedPages.length || actualPages.some((count, index) => count !== expectedPages[index])) {
  throw new Error(`Unexpected chapter structure: ${actualPages.join(', ')}`)
}

slides.forEach((slide, index) => {
  if (!/^Note:/m.test(slide)) throw new Error(`Slide ${index + 1} has no speaker note`)
})

for (const [, sourcePath] of source.matchAll(/src="([^"]+)"/g)) {
  if (/^(https?:|data:)/.test(sourcePath)) continue
  if (!existsSync(join(root, 'public', sourcePath))) throw new Error(`Missing slide asset: ${sourcePath}`)
}

console.log(`Validated ${chapters.length} horizontal chapters and ${slides.length} total slides.`)
