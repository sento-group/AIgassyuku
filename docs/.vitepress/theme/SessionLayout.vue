<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { computed } from 'vue'
import ProgressTracker from './components/ProgressTracker.vue'
import GiscusComments from './components/GiscusComments.vue'

const route = useRoute()
const isSession = computed(() =>
  route.path.startsWith('/sessions/') &&
  !route.path.endsWith('/') &&
  !route.path.includes('index')
)
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-after>
      <ProgressTracker v-if="isSession" />
      <GiscusComments v-if="isSession" />
    </template>
  </DefaultTheme.Layout>
</template>
