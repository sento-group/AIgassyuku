<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useData } from 'vitepress'

const route = useRoute()
const { isDark } = useData()
const container = ref<HTMLElement | null>(null)

function loadGiscus() {
  if (!container.value) return
  container.value.innerHTML = ''

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'sento-group/AIgassyuku')
  script.setAttribute('data-repo-id', 'R_kgDOQOLJFw')
  script.setAttribute('data-category', 'General')
  script.setAttribute('data-category-id', 'DIC_kwDOQOLJF84C2OsF')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  script.setAttribute('data-lang', 'ja')
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true
  container.value.appendChild(script)
}

onMounted(() => {
  // repo-id と category-id が未設定の場合は表示しない（Giscus側で自動取得）
  loadGiscus()
})

watch(() => route.path, () => {
  nextTick(loadGiscus)
})

watch(isDark, () => {
  const iframe = container.value?.querySelector('iframe')
  if (iframe) {
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: isDark.value ? 'dark' : 'light' } } },
      'https://giscus.app'
    )
  }
})
</script>

<template>
  <div class="giscus-wrap">
    <h3 class="giscus-heading">質問・コメント</h3>
    <div ref="container" />
  </div>
</template>

<style scoped>
.giscus-wrap {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}

.giscus-heading {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--vp-c-text-2);
}
</style>
