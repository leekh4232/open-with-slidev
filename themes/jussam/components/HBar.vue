<script setup lang="ts">
// 가로 막대. rows: [라벨, 값, 강조?][], max: 막대 길이 기준 최댓값, title: 위 차트 제목.
defineProps<{ title?: string; rows: [string, number, boolean?][]; max: number }>()
</script>

<template>
  <div class="hbar-box">
    <div v-if="title" class="chart-title" style="margin-bottom:22px">{{ title }}</div>
    <div class="hbar">
      <div v-for="r in rows" :key="r[0]" class="hbar-row">
        <div class="hbar-key">{{ r[0] }}</div>
        <div class="hbar-track">
          <div class="hbar-fill" :class="{ 'is-hi': r[2] }" :style="{ '--w': `${(r[1] / max) * 100}%` }" />
          <div class="hbar-val" :class="{ 'is-mute': !r[2] }" :style="{ '--w': `${(r[1] / max) * 100}%` }">{{ r[1] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
