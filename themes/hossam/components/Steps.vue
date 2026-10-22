<script setup lang="ts">
// 번호 동그라미 단계 목록. 슬롯에 <li> 들을 넣는다. color: py | ai | ok
withDefaults(defineProps<{ color?: string }>(), { color: 'py' })
</script>

<template>
  <ol class="steps" :class="color"><slot /></ol>
</template>

<style scoped>
.steps { list-style: none; padding: 0; margin: 0.4rem 0; counter-reset: step; }
.steps :deep(li) { counter-increment: step; position: relative; padding-left: 2.6rem; margin: 0.5rem 0; min-height: 2.1rem; font-size: 1rem; }
.steps :deep(li)::before { content: counter(step); position: absolute; left: 0; top: 0; width: 2.1rem; height: 2.1rem; border-radius: 50%; color: #06101f; font-weight: 800; display: grid; place-items: center; font-size: 1rem; }
.steps.py :deep(li)::before { background: var(--py); }
.steps.ai :deep(li)::before { background: var(--ai); }
.steps.ok :deep(li)::before { background: var(--ok); }
</style>
