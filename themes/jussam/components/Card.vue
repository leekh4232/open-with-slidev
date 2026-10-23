<script setup lang="ts">
// 카드. k: 작은 머리말(모노), t: 제목, acc: 위쪽 그라디언트 선, sm/lg: 여백, dim: 흐린 카드(위험 신호 등). 본문은 슬롯(마크다운 가능).
defineProps<{ k?: string; t?: string; acc?: boolean; sm?: boolean; lg?: boolean; dim?: boolean }>()
</script>

<template>
  <div class="card" :class="{ acc, 'card-sm': sm, 'card-lg': lg, dim }">
    <div v-if="k" class="k">{{ k }}</div>
    <div v-if="t" class="t">{{ t }}</div>
    <div class="d"><slot /></div>
  </div>
</template>
