<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { data as sessions } from '../../../sessions.data'

const STORAGE_KEY = 'aiclub-progress'

const total = ref(0)
const done = ref(0)

onMounted(() => {
  total.value = sessions.filter(s => s.date).length
  if (typeof localStorage === 'undefined') return
  try {
    const progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    done.value = Object.keys(progress).length
  } catch { /* ignore */ }
})
</script>

<template>
  <div v-if="total > 0" class="progress-bar-wrap">
    <div class="progress-info">
      <span class="progress-text">受講進捗</span>
      <span class="progress-count">{{ done }} / {{ total }}</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: `${Math.round((done / total) * 100)}%` }" />
    </div>
  </div>
</template>

<style scoped>
.progress-bar-wrap {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.progress-count {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  font-variant-numeric: tabular-nums;
}

.progress-track {
  height: 8px;
  border-radius: 4px;
  background: var(--vp-c-bg-mute);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  transition: width 0.5s ease;
  min-width: 0;
}
</style>
