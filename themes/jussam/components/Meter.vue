<script setup lang="ts">
// 라벨 + 값 + 가로 미터. fill: 채움 %, scale: 오른쪽 끝 라벨, foot: 아래 한 줄.
withDefaults(defineProps<{ label: string; value: string | number; fill: number | string; scale?: string; foot?: string }>(), { scale: '100%' })
</script>

<template>
  <div class="meter">
    <div class="meter-head"><span class="meter-label">{{ label }}</span><span class="meter-value">{{ value }}</span></div>
    <div class="meter-track"><div class="meter-fill" :style="{ '--w': `${fill}%` }" /></div>
    <div class="meter-scale"><span class="axis-t">0</span><span class="axis-t">{{ scale }}</span></div>
    <div v-if="foot" class="meter-foot">{{ foot }}</div>
  </div>
</template>
