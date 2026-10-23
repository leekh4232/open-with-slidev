<script setup lang="ts">
// 파트 표지. 프런트매터: part(1~4) → 머리말 "part 0N" 과 파트 시그니처 색. eyebrow 를 주면 머리말을 그 글로 바꾼다.
const props = defineProps<{ part?: number | string; eyebrow?: string }>()
const label = props.eyebrow ?? (props.part ? `part ${String(props.part).padStart(2, '0')}` : '')
</script>

<template>
  <div class="slidev-layout jussam section" :class="part ? `part-${part}` : ''">
    <div class="mesh" />
    <div v-if="label" class="eyebrow">{{ label }}</div>
    <div class="spacer" />
    <slot />
    <div class="spacer" />
  </div>
</template>
