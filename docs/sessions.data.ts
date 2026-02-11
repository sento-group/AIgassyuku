import { createContentLoader } from 'vitepress'

export interface SessionData {
  title: string
  date: string
  url: string
}

declare const data: SessionData[]
export { data }

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
        date: String(page.frontmatter.date || ''),
        url: page.url,
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  },
})
