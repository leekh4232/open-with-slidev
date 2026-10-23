<script setup lang="ts">
// 본문 슬라이드. 프런트매터: eyebrow(제목 위 작은 머리말), part(1~4, 파트 시그니처 색), source(아래 출처 각주)
defineProps<{ eyebrow?: string; part?: number | string; source?: string }>()
</script>

<template>
  <div class="slidev-layout jussam default" :class="part ? `part-${part}` : ''">
    <div v-if="eyebrow" class="eyebrow acc">{{ eyebrow }}</div>
    <slot />
    <div v-if="source" class="src">출처 · {{ source }}</div>
  </div>
</template>
