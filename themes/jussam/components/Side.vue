<script setup lang="ts">
// BeforeAfter 의 한쪽. from: 흐린 왼쪽, to: 강조된 오른쪽, k: 작은 머리말, v: 큰 글. 슬롯: 설명(마크다운 목록 가능).
defineProps<{ from?: boolean; to?: boolean; k?: string; v?: string }>()
</script>

<template>
  <div class="side" :class="{ from, to }">
    <div v-if="k" class="k">{{ k }}</div>
    <div v-if="v" class="v">{{ v }}</div>
    <div class="d"><slot /></div>
  </div>
</template>
