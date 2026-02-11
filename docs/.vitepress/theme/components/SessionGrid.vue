<script setup lang="ts">
import { computed } from 'vue'
import { data as sessions } from '../../../sessions.data'

function getCategoryInfo(title: string) {
  if (title.includes('Claude'))
    return { name: 'Claude', color: '#7c3aed', bg: '#ede9fe' }
  if (title.includes('NotebookLM'))
    return { name: 'NotebookLM', color: '#059669', bg: '#d1fae5' }
  if (title.includes('ChatGPT'))
    return { name: 'ChatGPT', color: '#0891b2', bg: '#cffafe' }
  if (title.includes('Gemini'))
    return { name: 'Gemini', color: '#2563eb', bg: '#dbeafe' }
  if (title.includes('AI部'))
    return { name: 'AI部', color: '#dc2626', bg: '#fee2e2' }
  if (title.includes('Genspark'))
    return { name: 'Genspark', color: '#d97706', bg: '#fef3c7' }
  if (title.includes('Manus'))
    return { name: 'Manus', color: '#ea580c', bg: '#ffedd5' }
  if (title.includes('プロンプト'))
    return { name: 'プロンプト', color: '#4f46e5', bg: '#e0e7ff' }
  if (title.includes('Google'))
    return { name: 'Google', color: '#16a34a', bg: '#dcfce7' }
  return { name: 'AI活用', color: '#475569', bg: '#f1f5f9' }
}

function getSessionType(title: string) {
  if (title.includes('3分クッキング')) return '3分クッキング'
  if (title.includes('実践')) return '実践ワーク'
  if (title.includes('講義')) return '講義'
  if (title.includes('活用術')) return '活用術'
  return 'セッション'
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${m}/${day}`
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
  <div class="session-list">
    <div v-for="[year, items] in groupedByYear" :key="year" class="year-section">
      <h2 class="year-heading">{{ year }}年<span class="year-count">{{ items.length }}件</span></h2>
      <div class="list-container">
        <a
          v-for="session in items"
          :key="session.url"
          :href="session.url"
          class="session-row"
        >
          <span class="row-date">{{ session.formattedDate }}</span>
          <span
            class="row-badge"
            :style="{ color: session.category.color, backgroundColor: session.category.bg }"
          >{{ session.category.name }}</span>
          <span class="row-title">{{ session.displayTitle }}</span>
          <span class="row-type">{{ session.type }}</span>
          <span class="row-arrow">→</span>
        </a>
      </div>
    </div>

    <div v-if="references.length > 0" class="year-section">
      <h2 class="year-heading">リファレンス</h2>
      <div class="list-container">
        <a
          v-for="ref in references"
          :key="ref.url"
          :href="ref.url"
          class="session-row"
        >
          <span class="row-date"></span>
          <span
            class="row-badge"
            :style="{ color: ref.category.color, backgroundColor: ref.category.bg }"
          >{{ ref.category.name }}</span>
          <span class="row-title">{{ ref.displayTitle }}</span>
          <span class="row-type"></span>
          <span class="row-arrow">→</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.session-list {
  max-width: 860px;
}

.year-section {
  margin-bottom: 36px;
}

.year-heading {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  padding: 0 0 8px 0;
  border-bottom: 2px solid var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.year-count {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

.list-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
}

.session-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  text-decoration: none !important;
  color: inherit;
  transition: background 0.15s ease;
  border-bottom: 1px solid var(--vp-c-divider);
}

.session-row:last-child {
  border-bottom: none;
}

.session-row:hover {
  background: var(--vp-c-bg-soft);
}

.row-date {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
  width: 42px;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.row-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  flex-shrink: 0;
  white-space: nowrap;
  min-width: 72px;
  text-align: center;
}

.row-title {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row-type {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  white-space: nowrap;
}

.row-arrow {
  font-size: 0.9rem;
  color: var(--vp-c-brand-1);
  opacity: 0;
  transition: opacity 0.15s, transform 0.15s;
  transform: translateX(-4px);
  flex-shrink: 0;
}

.session-row:hover .row-arrow {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 640px) {
  .session-row {
    flex-wrap: wrap;
    gap: 6px 10px;
    padding: 10px 14px;
  }

  .row-date {
    width: auto;
  }

  .row-title {
    width: 100%;
    order: 10;
    white-space: normal;
  }

  .row-type {
    display: none;
  }

  .row-arrow {
    display: none;
  }
}
</style>
