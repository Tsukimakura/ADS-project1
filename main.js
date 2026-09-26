import Reveal from 'reveal.js'
import Markdown from 'reveal.js/plugin/markdown'
import Highlight from 'reveal.js/plugin/highlight'
import Notes from 'reveal.js/plugin/notes'

import 'reveal.js/reveal.css'
import 'reveal.js/theme/black.css'
import 'reveal.js/plugin/highlight/monokai.css'
import './style.css'

const deck = new Reveal({
  hash: true,
  history: true,
  controls: true,
  controlsTutorial: true,
  progress: true,
  center: false,
  transition: 'slide',
  backgroundTransition: 'fade',
  navigationMode: 'default',
  plugins: [Markdown, Highlight, Notes],
})

deck.initialize()
