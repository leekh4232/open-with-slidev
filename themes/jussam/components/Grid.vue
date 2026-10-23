<script setup lang="ts">
// 격자 배치. cols: 열 수(2, 3) 또는 grid-template-columns 값("1fr 400px"), gap: px, align: start 등, title: 위에 붙는 작은 차트 제목.
const props = withDefaults(defineProps<{ cols?: number | string; gap?: number | string; align?: string; title?: string }>(), { cols: 2, gap: 20 })
const columns = /^\d+$/.test(String(props.cols)) ? `repeat(${props.cols}, 1fr)` : String(props.cols)
</script>

<template>
  <div class="grid-box stagger-box">
    <div v-if="title" class="chart-title">{{ title }}</div>
    <div class="grid-cells stagger" :style="{ gridTemplateColumns: columns, gap: `${gap}px`, alignItems: align }">
      <slot />
    </div>
  </div>
</template>
