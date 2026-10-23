<script setup lang="ts">
// 수식 한 줄. tokens: 낱말 배열 — 연산자(× = +)는 그라디언트, 숫자는 흰 굵은 글씨. note: 오른쪽 설명.
defineProps<{ tokens: string[]; note?: string }>()
const kind = (t: string) => (/^[×x*+=÷-]$/.test(t) ? 'gp' : /^[\d.,]+$/.test(t) ? 'z' : '')
</script>

<template>
  <div class="formula">
    <span v-for="(t, i) in tokens" :key="i" :class="kind(t)">{{ t }}</span>
    <span v-if="note" class="formula-note">{{ note }}</span>
  </div>
</template>
