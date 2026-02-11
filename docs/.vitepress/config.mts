import { defineConfig } from 'vitepress'
import { deflateSync } from 'node:zlib'
import { execSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'fs'
import path from 'path'

const CACHE_DIR = path.resolve(__dirname, '../../.plantuml-cache')

// PlantUML → Kroki.io SVG URL
function plantumlToKrokiUrl(source: string): string {
  const data = Buffer.from(source, 'utf8')
  const compressed = deflateSync(data, { level: 9 })
  return `https://kroki.io/plantuml/svg/${compressed.toString('base64url')}`
}

// ビルド時にKroki.ioからSVGを取得してインラインに（キャッシュ付き）
function getPlantUmlSvg(source: string): string {
  const hash = crypto.createHash('md5').update(source).digest('hex')
  const cachePath = path.join(CACHE_DIR, `${hash}.svg`)

  if (fs.existsSync(cachePath)) {
    return fs.readFileSync(cachePath, 'utf-8')
  }

  const url = plantumlToKrokiUrl(source)
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
    const svg = execSync(`curl -sf "${url}"`, { encoding: 'utf-8', timeout: 15000 })
    if (svg && svg.includes('<svg')) {
      fs.writeFileSync(cachePath, svg)
      return svg
    }
  } catch { /* fallback to external img */ }
  return `<img src="${url}" alt="PlantUML Diagram" loading="lazy" />`
}

// 授業セッションのサイドバー自動生成
function getSessionSidebar() {
  const sessionsDir = path.resolve(__dirname, '../sessions')
  if (!fs.existsSync(sessionsDir)) return []

  const files = fs.readdirSync(sessionsDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('.') && f !== 'index.md')
    .sort()
    .reverse()

  const dated: { text: string; link: string; date: string }[] = []
  const other: { text: string; link: string }[] = []

  for (const file of files) {
    const name = file.replace('.md', '')
    const dateMatch = name.match(/^(\d{4})(\d{2})(\d{2})[_]?(.+)/)

    if (dateMatch) {
      const [, y, m, d, title] = dateMatch
      const displayTitle = title.replace(/_/g, ' ').replace(/^_/, '').trim()
      dated.push({
        text: `${m}/${d} ${displayTitle}`,
        link: `/sessions/${name}`,
        date: `${y}${m}${d}`,
      })
    } else if (!name.includes('ロープレボット')) {
      other.push({
        text: name.replace(/_/g, ' '),
        link: `/sessions/${name}`,
      })
    }
  }

  const items: any[] = []
  const years = new Map<string, typeof dated>()
  for (const item of dated) {
    const year = item.date.substring(0, 4)
    if (!years.has(year)) years.set(year, [])
    years.get(year)!.push(item)
  }

  for (const [year, yearItems] of years) {
    items.push({
      text: `${year}年`,
      collapsed: year !== '2026',
      items: yearItems.map(({ text, link }) => ({ text, link })),
    })
  }

  if (other.length > 0) {
    items.push({
      text: 'リファレンス',
      collapsed: true,
      items: other,
    })
  }

  return items
}

export default defineConfig({
  title: 'AIクラブ',
  description: 'sento.group AI部の授業セッション・講義資料',
  lang: 'ja',

  srcExclude: ['ai-camp/**', 'ideas/**'],

  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap',
      rel: 'stylesheet',
    }],
  ],

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'AIクラブ',

    nav: [
      { text: 'ホーム', link: '/' },
    ],

    sidebar: {
      '/sessions/': [
        {
          text: '授業セッション',
          items: getSessionSidebar(),
        },
      ],
    },

    outline: {
      level: [2, 3],
      label: '目次',
    },

    docFooter: {
      prev: '前の講義',
      next: '次の講義',
    },

    lastUpdated: {
      text: '最終更新',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sento-group/AIgassyuku' },
    ],
  },

  markdown: {
    config: (md) => {
      // PlantUML fenced code blocks → ビルド時にSVGインライン化
      const defaultFence = md.renderer.rules.fence!.bind(md.renderer.rules)
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        if (token.info.trim() === 'plantuml') {
          const source = token.content.trim()
          const svg = getPlantUmlSvg(source)
          return `<div class="plantuml-diagram">${svg}</div>\n`
        }
        return defaultFence(tokens, idx, options, env, self)
      }
    },
  },

  lastUpdated: true,
  ignoreDeadLinks: true,

  vite: {
    resolve: {
      preserveSymlinks: true,
    },
  },
})
