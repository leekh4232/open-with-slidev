<script setup lang="ts">
// 두 점 기울기 차트 카드. from/to: [x 라벨, 값], max: 세로축 최댓값, unit: 값 단위, k/t: 카드 머리말·제목.
const props = withDefaults(defineProps<{ k?: string; t?: string; from: [string, number]; to: [string, number]; max: number; unit?: string }>(), { unit: '%' })
const gid = `slg-${Math.random().toString(36).slice(2, 8)}`
const y = (v: number) => 170 - (v / props.max) * 150
</script>

<template>
  <div class="card slope">
    <div v-if="k" class="k">{{ k }}</div>
    <div v-if="t" class="t">{{ t }}</div>
    <svg viewBox="0 0 738 200" style="width:100%; height:auto; margin-top:6px" aria-hidden="true">
      <defs>
        <linearGradient :id="gid" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style="stop-color:var(--g1)" /><stop offset="1" style="stop-color:var(--g2)" />
        </linearGradient>
      </defs>
      <g stroke="rgba(255,255,255,.08)" stroke-width="1"><line x1="60" y1="20" x2="718" y2="20" /><line x1="60" y1="95" x2="718" y2="95" /></g>
      <line x1="60" y1="170" x2="718" y2="170" stroke="rgba(255,255,255,.14)" stroke-width="1" />
      <g class="svg-axis" text-anchor="end"><text x="48" y="24">{{ max }}{{ unit }}</text><text x="48" y="99">{{ max / 2 }}{{ unit }}</text><text x="48" y="174">0</text></g>
      <line class="ln" x1="100" :y1="y(from[1])" x2="678" :y2="y(to[1])" :stroke="`url(#${gid})`" stroke-width="2.5" stroke-linecap="round" />
      <g class="marks">
        <circle cx="100" :cy="y(from[1])" r="6" style="fill:var(--g1)" stroke="#0a0a0a" stroke-width="2" />
        <circle cx="678" :cy="y(to[1])" r="7" style="fill:var(--g2)" stroke="#0a0a0a" stroke-width="2" />
        <text class="svg-val" x="100" :y="y(from[1]) - 16" text-anchor="middle" fill="#a1a1a1">{{ from[1] }}{{ unit }}</text>
        <text class="svg-val big" x="678" :y="y(to[1]) - 15" text-anchor="middle" fill="#ffffff">{{ to[1] }}{{ unit }}</text>
      </g>
      <g class="svg-axis" text-anchor="middle"><text x="100" y="190">{{ from[0] }}</text><text x="678" y="190">{{ to[0] }}</text></g>
    </svg>
  </div>
</template>
