<script setup lang="ts">
// 큰 숫자 카드. n: 숫자, unit: 단위, label: 설명, fill: 미터 채움 %(있으면 미터 표시), mark: 미터 위 기준선 %, scale: 미터 오른쪽 끝 라벨, sm: 작은 흰 숫자.
// 슬롯: 미터 아래 작은 보충 설명.
withDefaults(defineProps<{ n: string | number; unit?: string; label?: string; fill?: number | string; mark?: number | string; scale?: string; sm?: boolean }>(), { scale: '100%' })
</script>

<template>
  <div class="card stat" :class="sm ? 'card-sm' : 'card-lg'">
    <div class="n" :class="sm ? 'sm' : 'gp'">{{ n }}<span v-if="unit" class="u">{{ unit }}</span></div>
    <div v-if="label" class="l">{{ label }}</div>
    <template v-if="fill !== undefined">
      <div class="meter-track" style="margin-top:18px">
        <div v-if="mark !== undefined" class="meter-ref" :style="{ left: `${mark}%` }" />
        <div class="meter-fill is-part" :style="{ '--w': `${fill}%` }" />
      </div>
      <div class="meter-scale"><span class="axis-t">0</span><span class="axis-t">{{ scale }}</span></div>
    </template>
    <div v-if="$slots.default" class="s" style="margin-top:10px"><slot /></div>
  </div>
</template>
