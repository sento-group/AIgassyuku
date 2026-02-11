import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import SessionGrid from './components/SessionGrid.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('SessionGrid', SessionGrid)
  },
} satisfies Theme
