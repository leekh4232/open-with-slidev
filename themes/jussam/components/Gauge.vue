<script setup lang="ts">
// 아크 게이지 카드. value: 0~100, label: 숫자 아래 설명, note: 카드 아래쪽 한 줄.
const props = defineProps<{ value: number | string; label?: string; note?: string }>()
const gid = `gg-${Math.random().toString(36).slice(2, 8)}`   // 슬라이드마다 그라디언트 id 가 겹치지 않게
const dash = Math.round((Number(props.value) / 100) * 377)
</script>

<template>
  <div class="card gauge-card">
    <div class="gauge">
      <svg viewBox="0 0 210 170" aria-hidden="true">
        <defs>
          <linearGradient :id="gid" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style="stop-color:var(--g1)" /><stop offset="1" style="stop-color:var(--g2)" />
          </linearGradient>
        </defs>
        <circle cx="105" cy="90" r="80" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="14" stroke-linecap="round" stroke-dasharray="377 503" transform="rotate(135 105 90)" />
        <circle class="gv" cx="105" cy="90" r="80" fill="none" :stroke="`url(#${gid})`" stroke-width="14" stroke-linecap="round" transform="rotate(135 105 90)" :style="{ '--d': dash }" />
      </svg>
      <div class="cap">{{ value }}%</div>
      <div v-if="label" class="cap-s">{{ label }}</div>
    </div>
    <div v-if="note" class="body-s" style="margin-top:6px; text-align:center">{{ note }}</div>
  </div>
</template>
