<script setup lang="ts">
// 표지·마무리 슬라이드. 프런트매터: eyebrow(위 머리말), footer(아래 머리말), mesh(soft = 옅게, none = 없음), source
defineProps<{ eyebrow?: string; footer?: string; mesh?: string; source?: string }>()
</script>

<template>
  <div class="slidev-layout jussam cover">
    <div v-if="mesh !== 'none'" class="mesh" :class="{ 'is-soft': mesh === 'soft' }" />
    <div v-if="eyebrow" class="eyebrow">{{ eyebrow }}</div>
    <div class="spacer" />
    <slot />
    <div class="spacer" />
    <div v-if="footer" class="eyebrow foot">{{ footer }}</div>
    <div v-if="source" class="src">출처 · {{ source }}</div>
  </div>
</template>
