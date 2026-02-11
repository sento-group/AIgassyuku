<script setup lang="ts">
defineProps<{
  id: string
  title?: string
}>()
</script>

<template>
  <div class="youtube-embed">
    <iframe
      :src="`https://www.youtube-nocookie.com/embed/${id}`"
      :title="title || 'YouTube動画'"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>

<style scoped>
.youtube-embed {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  margin: 24px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.youtube-embed iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
