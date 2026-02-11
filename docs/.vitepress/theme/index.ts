import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import SessionGrid from './components/SessionGrid.vue'
import YouTube from './components/YouTube.vue'
import Quiz from './components/Quiz.vue'
import ProgressTracker from './components/ProgressTracker.vue'
import ProgressBar from './components/ProgressBar.vue'
import SessionLayout from './SessionLayout.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('SessionGrid', SessionGrid)
    app.component('YouTube', YouTube)
    app.component('Quiz', Quiz)
    app.component('ProgressTracker', ProgressTracker)
    app.component('ProgressBar', ProgressBar)
  },
  Layout: SessionLayout,
} satisfies Theme
