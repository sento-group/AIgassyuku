<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  question: string
  options: string[]
  answer: number
  explanation?: string
}>()

const selected = ref<number | null>(null)
const answered = ref(false)

const isCorrect = computed(() => selected.value === props.answer)

function select(idx: number) {
  if (answered.value) return
  selected.value = idx
  answered.value = true
}
</script>

<template>
  <div class="quiz-card">
    <div class="quiz-header">
      <span class="quiz-icon">Q</span>
      <span class="quiz-question">{{ question }}</span>
    </div>
    <div class="quiz-options">
      <button
        v-for="(opt, idx) in options"
        :key="idx"
        class="quiz-option"
        :class="{
          selected: selected === idx,
          correct: answered && idx === answer,
          wrong: answered && selected === idx && idx !== answer,
          disabled: answered,
        }"
        @click="select(idx)"
      >
        <span class="option-label">{{ String.fromCharCode(65 + idx) }}</span>
        <span class="option-text">{{ opt }}</span>
        <span v-if="answered && idx === answer" class="option-mark correct-mark">&#10003;</span>
        <span v-else-if="answered && selected === idx && idx !== answer" class="option-mark wrong-mark">&#10007;</span>
      </button>
    </div>
    <div v-if="answered" class="quiz-result" :class="{ correct: isCorrect, wrong: !isCorrect }">
      <span class="result-icon">{{ isCorrect ? '&#127881;' : '&#128161;' }}</span>
      <span class="result-text">{{ isCorrect ? '正解！' : '不正解' }}</span>
      <p v-if="explanation" class="result-explanation">{{ explanation }}</p>
    </div>
  </div>
</template>

<style scoped>
.quiz-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
  background: var(--vp-c-bg);
}

.quiz-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.quiz-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.quiz-question {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.6;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quiz-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  width: 100%;
}

.quiz-option:not(.disabled):hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.quiz-option.disabled {
  cursor: default;
}

.quiz-option.correct {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.08);
}

.quiz-option.wrong {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}

.option-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--vp-c-bg-mute);
  font-weight: 600;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.quiz-option.correct .option-label {
  background: #10b981;
  color: #fff;
}

.quiz-option.wrong .option-label {
  background: #ef4444;
  color: #fff;
}

.option-text {
  flex: 1;
}

.option-mark {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.correct-mark { color: #10b981; }
.wrong-mark { color: #ef4444; }

.quiz-result {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.quiz-result.correct {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.quiz-result.wrong {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.result-icon {
  font-size: 1.2rem;
}

.result-text {
  font-weight: 600;
  font-size: 0.95rem;
}

.quiz-result.correct .result-text { color: #10b981; }
.quiz-result.wrong .result-text { color: #ef4444; }

.result-explanation {
  width: 100%;
  margin: 4px 0 0 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
</style>
