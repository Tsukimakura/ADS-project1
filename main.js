import Reveal from 'reveal.js'
import Markdown from 'reveal.js/plugin/markdown'
import Highlight from 'reveal.js/plugin/highlight'
import Notes from 'reveal.js/plugin/notes'

import 'reveal.js/reveal.css'
import 'reveal.js/theme/simple.css'
import 'reveal.js/plugin/highlight/monokai.css'
import './style.css'

const deck = new Reveal({
  width: 1280,
  height: 720,
  margin: 0,
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
  backgroundTransition: 'fade',
  navigationMode: 'default',
  pdfSeparateFragments: false,
  plugins: [Markdown, Highlight, Notes],
})

deck.initialize()
