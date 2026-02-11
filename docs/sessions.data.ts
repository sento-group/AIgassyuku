import { createContentLoader } from 'vitepress'

export interface SessionData {
  title: string
  date: string
  url: string
}

declare const data: SessionData[]
export { data }

// YAML date: 2026-01-22 (引用符なし) はDate型に変換されるため正規化が必要
function normalizeDate(raw: unknown): string {
  if (!raw) return ''
  if (raw instanceof Date) return raw.toISOString().split('T')[0]
  return String(raw)
}

export default createContentLoader('sessions/**/*.md', {
  transform(rawData): SessionData[] {
    return rawData
      .filter(page => {
        const url = page.url
        return (
          !url.endsWith('/') &&
          !url.includes('index') &&
          !url.includes('ボツ授業') &&
          !url.includes('ロープレボット')
        )
      })
      .map(page => ({
        title: String(page.frontmatter.title || ''),
        date: normalizeDate(page.frontmatter.date),
        url: page.url,
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  },
})
