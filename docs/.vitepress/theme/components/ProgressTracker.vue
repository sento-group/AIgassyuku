<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const STORAGE_KEY = 'aiclub-progress'

const completed = ref(false)

function getProgress(): Record<string, boolean> {
  if (typeof localStorage === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch { return {} }
}

function saveProgress(data: Record<string, boolean>) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function load() {
  const progress = getProgress()
  completed.value = !!progress[route.path]
}

function toggle() {
  const progress = getProgress()
  completed.value = !completed.value
  if (completed.value) {
    progress[route.path] = true
  } else {
    delete progress[route.path]
  }
  saveProgress(progress)
}

onMounted(load)
watch(() => route.path, load)
</script>

<template>
  <div class="progress-tracker" :class="{ done: completed }">
    <button class="progress-btn" @click="toggle">
      <span class="check-box" :class="{ checked: completed }">
        <svg v-if="completed" viewBox="0 0 16 16" width="14" height="14">
          <path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
        </svg>
      </span>
      <span class="progress-label">{{ completed ? '受講完了' : 'この講義を受講完了にする' }}</span>
    </button>
  </div>
</template>

<style scoped>
.progress-tracker {
  margin: 32px 0 16px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  transition: all 0.2s ease;
}

.progress-tracker.done {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.06);
}

.progress-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  padding: 0;
  width: 100%;
}

.check-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.check-box.checked {
  border-color: #10b981;
  background: #10b981;
  color: #fff;
}

.progress-label {
  font-weight: 500;
}

.progress-tracker.done .progress-label {
  color: #10b981;
  font-weight: 600;
}
</style>
