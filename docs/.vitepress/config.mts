import { defineConfig } from 'vitepress'
import plantuml from 'markdown-it-plantuml'
import fs from 'fs'
import path from 'path'

// 授業セッションのファイルからサイドバーを自動生成
function getSessionSidebar() {
  const sessionsDir = path.resolve(__dirname, '../sessions')
  if (!fs.existsSync(sessionsDir)) return []

  const files = fs.readdirSync(sessionsDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('.'))
    .sort()
    .reverse() // 新しい順

  // 日付付きファイルとそれ以外を分離
  const dated: { text: string; link: string; date: string }[] = []
  const other: { text: string; link: string }[] = []

  for (const file of files) {
    const name = file.replace('.md', '')
    const dateMatch = name.match(/^(\d{4})(\d{2})(\d{2})[_]?(.+)/)

    if (dateMatch) {
      const [, y, m, d, title] = dateMatch
      const displayTitle = title
        .replace(/_/g, ' ')
        .replace(/^_/, '')
        .trim()
      dated.push({
        text: `${y}/${m}/${d} ${displayTitle}`,
        link: `/sessions/${name}`,
        date: `${y}${m}${d}`,
      })
    } else if (name !== '2025xxxx_ロープレボット実践セッション') {
      other.push({
        text: name.replace(/_/g, ' '),
        link: `/sessions/${name}`,
      })
    }
  }

  const items: any[] = []

  // 年ごとにグループ化
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
      text: 'その他',
      collapsed: true,
      items: other,
    })
  }

  return items
}

// AI合宿v2のサイドバー
function getAiCampSidebar() {
  const dir = path.resolve(__dirname, '../ai-camp')
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .map(f => ({
      text: f.replace('.md', '').replace(/_/g, ' '),
      link: `/ai-camp/${f.replace('.md', '')}`,
    }))
}

export default defineConfig({
  title: 'AI合宿 講義ライブラリ',
  description: 'sento.group AI部の授業セッション・講義資料をまとめたサイト',
  lang: 'ja',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
  ],

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'AI合宿',

    nav: [
      { text: 'ホーム', link: '/' },
      { text: '授業セッション', link: '/sessions/' },
      { text: 'AI合宿v2', link: '/ai-camp/' },
    ],

    sidebar: {
      '/sessions/': [
        {
          text: '授業セッション',
          items: getSessionSidebar(),
        },
      ],
      '/ai-camp/': [
        {
          text: 'AI合宿v2',
          items: getAiCampSidebar(),
        },
      ],
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '検索', buttonAriaLabel: '検索' },
          modal: {
            noResultsText: '見つかりませんでした',
            resetButtonTitle: 'リセット',
            footer: { selectText: '選択', navigateText: '移動', closeText: '閉じる' },
          },
        },
      },
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
      // PlantUMLレンダリング（Kroki.io 経由でSVG変換）
      md.use(plantuml, {
        openMarker: '@startuml',
        closeMarker: '@enduml',
        server: 'https://kroki.io/plantuml/svg',
      })
    },
  },

  lastUpdated: true,

  // リポジトリ内の他フォルダ(.cursor, governance等)へのリンクは解決不可のため無視
  ignoreDeadLinks: true,

  vite: {
    resolve: {
      preserveSymlinks: true,
    },
  },
})
