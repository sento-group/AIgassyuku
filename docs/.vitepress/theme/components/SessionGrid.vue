<script setup lang="ts">
import { computed } from 'vue'
import { data as sessions } from '../../../sessions.data'

function getCategoryInfo(title: string) {
  if (title.includes('Claude'))
    return { name: 'Claude', color: '#7c3aed', bg: '#ede9fe', icon: '🤖' }
  if (title.includes('NotebookLM'))
    return { name: 'NotebookLM', color: '#059669', bg: '#d1fae5', icon: '📓' }
  if (title.includes('ChatGPT'))
    return { name: 'ChatGPT', color: '#0891b2', bg: '#cffafe', icon: '💬' }
  if (title.includes('Gemini'))
    return { name: 'Gemini', color: '#2563eb', bg: '#dbeafe', icon: '✨' }
  if (title.includes('AI部'))
    return { name: 'AI部', color: '#dc2626', bg: '#fee2e2', icon: '🎓' }
  if (title.includes('Genspark'))
    return { name: 'Genspark', color: '#d97706', bg: '#fef3c7', icon: '🔍' }
  if (title.includes('Manus'))
    return { name: 'Manus', color: '#ea580c', bg: '#ffedd5', icon: '🤝' }
  if (title.includes('プロンプト'))
    return { name: 'プロンプト', color: '#4f46e5', bg: '#e0e7ff', icon: '✏️' }
  if (title.includes('Google'))
    return { name: 'Google', color: '#16a34a', bg: '#dcfce7', icon: '🌐' }
  return { name: 'AI活用', color: '#475569', bg: '#f1f5f9', icon: '🚀' }
}

function getSessionType(title: string) {
  if (title.includes('3分クッキング')) return { label: '3分クッキング', icon: '🍳' }
  if (title.includes('実践')) return { label: '実践ワーク', icon: '💪' }
  if (title.includes('セッション設計')) return { label: 'セッション', icon: '📋' }
  if (title.includes('講義')) return { label: '講義', icon: '🎓' }
  if (title.includes('活用術')) return { label: '活用術', icon: '🛠' }
  return { label: 'レッスン', icon: '📖' }
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()
  return `${y}/${m}/${day}`
}

function cleanTitle(title: string) {
  return title
    .replace(/_/g, ' ')
    .replace(/\s*3分クッキング版?\s*$/, '')
    .replace(/\s*セッション設計\s*$/, '')
    .replace(/\s*講義資料\s*$/, '')
    .trim()
}

const groupedByYear = computed(() => {
  const groups = new Map<string, any[]>()

  for (const session of sessions) {
    if (!session.date) continue
    const year = String(session.date).substring(0, 4)
    if (!groups.has(year)) groups.set(year, [])
    groups.get(year)!.push({
      ...session,
      category: getCategoryInfo(session.title),
      type: getSessionType(session.title),
      displayTitle: cleanTitle(session.title),
      formattedDate: formatDate(session.date),
    })
  }

  return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]))
})

const references = computed(() => {
  return sessions
    .filter(s => !s.date)
    .map(s => ({
      ...s,
      category: getCategoryInfo(s.title),
      displayTitle: s.title.replace(/_/g, ' '),
    }))
})
</script>

<template>
  <div class="session-catalog">
    <div class="catalog-stats">
      <span class="stat">
        📚 {{ sessions.filter(s => s.date).length }} レッスン
      </span>
    </div>

    <div v-for="[year, items] in groupedByYear" :key="year" class="year-section">
      <div class="year-header">
        <h2 class="year-heading">{{ year }}年</h2>
        <span class="year-count">{{ items.length }} レッスン</span>
      </div>
      <div class="course-grid">
        <a
          v-for="session in items"
          :key="session.url"
          :href="session.url"
          class="course-card"
        >
          <div class="card-top">
            <span
              class="category-badge"
              :style="{ color: session.category.color, backgroundColor: session.category.bg }"
            >
              {{ session.category.icon }} {{ session.category.name }}
            </span>
            <span class="type-badge">{{ session.type.icon }} {{ session.type.label }}</span>
          </div>
          <h3 class="card-title">{{ session.displayTitle }}</h3>
          <div class="card-bottom">
            <span class="card-date">{{ session.formattedDate }}</span>
            <span class="card-arrow">→</span>
          </div>
        </a>
      </div>
    </div>

    <div v-if="references.length > 0" class="year-section">
      <div class="year-header">
        <h2 class="year-heading">📚 リファレンス</h2>
      </div>
      <div class="course-grid">
        <a
          v-for="ref in references"
          :key="ref.url"
          :href="ref.url"
          class="course-card ref-card"
        >
          <div class="card-top">
            <span
              class="category-badge"
              :style="{ color: ref.category.color, backgroundColor: ref.category.bg }"
            >
              {{ ref.category.icon }} {{ ref.category.name }}
            </span>
          </div>
          <h3 class="card-title">{{ ref.displayTitle }}</h3>
          <div class="card-bottom">
            <span class="card-arrow">→</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.session-catalog {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0 48px;
}

.catalog-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  padding: 16px 20px;
  background: var(--vp-c-brand-soft);
  border-radius: 12px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.stat {
  font-size: 0.95rem;
}

.year-section {
  margin-bottom: 40px;
}

.year-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--vp-c-brand-1);
}

.year-heading {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  color: var(--vp-c-text-1);
  border: none;
  padding: 0;
}

.year-count {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.course-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  text-decoration: none !important;
  color: inherit;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  min-height: 140px;
}

.course-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.1);
  transform: translateY(-3px);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 8px;
}

.category-badge {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  white-space: nowrap;
  letter-spacing: 0.02em;
}

.type-badge {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.45;
  margin: 0;
  color: var(--vp-c-text-1);
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid var(--vp-c-divider);
}

.card-date {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

.card-arrow {
  font-size: 1rem;
  color: var(--vp-c-brand-1);
  font-weight: 600;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s ease;
}

.course-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
}

.ref-card {
  min-height: auto;
  background: var(--vp-c-bg-soft);
}

@media (max-width: 640px) {
  .course-grid {
    grid-template-columns: 1fr;
  }

  .catalog-stats {
    font-size: 0.85rem;
  }
}
</style>
