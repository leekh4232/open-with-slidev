<script setup lang="ts">
// 분기 도식: 위 알약(src)에서 n 갈래로 선이 내려와 슬롯의 카드(n 개)에 닿는다. 슬라이드 전체 폭(1136px) 기준.
const props = withDefaults(defineProps<{ src: string; n?: number }>(), { n: 3 })
const W = 1136, GAP = 20
const col = (W - GAP * (props.n - 1)) / props.n
const cx = Array.from({ length: props.n }, (_, i) => i * (col + GAP) + col / 2)
</script>

<template>
  <div class="brx stagger-box">
    <div class="brx-src">{{ src }}</div>
    <svg class="brx-wire" viewBox="0 0 1136 46" preserveAspectRatio="none" aria-hidden="true">
      <g stroke="rgba(255,255,255,.14)" stroke-width="1" fill="none">
        <path :d="`M${W / 2} 0 V20`" vector-effect="non-scaling-stroke" />
        <path :d="`M${cx[0]} 20 H${cx[cx.length - 1]}`" vector-effect="non-scaling-stroke" />
        <path v-for="x in cx" :key="x" :d="`M${x} 20 V46`" vector-effect="non-scaling-stroke" />
      </g>
    </svg>
    <div class="grid-cells stagger" :style="{ gridTemplateColumns: `repeat(${n}, 1fr)`, gap: `${GAP}px`, width: '100%' }"><slot /></div>
  </div>
</template>
