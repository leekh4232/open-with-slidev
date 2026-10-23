<script setup lang="ts">
// 퍼널 도식. rows: [라벨, 값, 폭 %][] (마지막 줄은 그라디언트로 강조), title: 위 차트 제목, note: 아래 작은 주석.
defineProps<{ title?: string; rows: [string, string, number][]; note?: string }>()
</script>

<template>
  <div class="funnel-box stagger-box">
    <div v-if="title" class="chart-title" style="margin-bottom:16px">{{ title }}</div>
    <div class="funnel stagger">
      <div v-for="(r, i) in rows" :key="i" class="fn-row" :class="{ 'is-final': i === rows.length - 1 }" :style="{ width: `${r[2]}%` }">
        <span class="fl">{{ r[0] }}</span><span class="fv">{{ r[1] }}</span>
      </div>
    </div>
    <div v-if="note" class="note" style="margin-top:16px">{{ note }}</div>
  </div>
</template>
