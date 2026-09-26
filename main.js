import Reveal from 'reveal.js'
import Markdown from 'reveal.js/plugin/markdown'
import Highlight from 'reveal.js/plugin/highlight'
import Notes from 'reveal.js/plugin/notes'

import 'reveal.js/reveal.css'
import 'reveal.js/theme/simple.css'
import './style.css'
import './components.css'

const deck = new Reveal({
  width: 1000,
  height: 700,
  margin: 0.04,
  hash: true,
  history: true,
  controls: true,
  controlsTutorial: false,
  controlsBackArrows: 'faded',
  progress: true,
  slideNumber: 'c/t',
  showSlideNumber: 'all',
  center: false,
  touch: true,
  overview: true,
  transition: 'slide',
  transitionSpeed: 'fast',
  backgroundTransition: 'fade',
  navigationMode: 'default',
  pdfSeparateFragments: false,
  plugins: [Markdown, Highlight, Notes],
})

function syncSlideFrame() {
  const slides = document.querySelector('.slides')
  const backgrounds = document.querySelector('.backgrounds')
  if (slides && backgrounds) backgrounds.style.cssText = slides.style.cssText
}

deck.initialize().then(() => {
  syncSlideFrame()
  if (globalThis.Heti) new globalThis.Heti('.slides').autoSpacing()
})

deck.on('overviewshown', () => {
  document.querySelector('.backgrounds')?.removeAttribute('style')
})
deck.on('overviewhidden', syncSlideFrame)
deck.on('resize', syncSlideFrame)
