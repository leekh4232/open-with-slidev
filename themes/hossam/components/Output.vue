<script setup lang="ts">
// 프로그램 출력 상자. 슬롯에 출력 텍스트를 그대로 넣는다.
defineProps<{ label?: string }>()
</script>

<template>
  <div class="output">
    <div class="output-label">{{ label ?? '출력' }}</div>
    <div class="output-pre"><slot /></div>
  </div>
</template>

<style scoped>
.output { position: relative; background: #0f1830; box-shadow: 0 6px 20px rgba(11,18,32,0.12); border: 1px solid var(--line); border-left: 4px solid var(--ok); border-radius: 14px; padding: 1.5rem 1rem 0.8rem; margin: 0.4rem 0; }
.output-label { position: absolute; top: 0; left: 1rem; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.06em; color: var(--ok); background: var(--surface-2); padding: 0.15em 0.6em; border-radius: 0 0 8px 8px; }
.output-pre, .output-pre :deep(pre) { margin: 0; padding: 0; background: none; font-family: "JetBrains Mono", Consolas, "Apple SD Gothic Neo", "Malgun Gothic", monospace; font-size: 1.1rem; line-height: 1.55; white-space: pre-wrap; color: #dbe4f3; font-variant-ligatures: none; }
.output-pre :deep(p) { margin: 0; }
</style>
