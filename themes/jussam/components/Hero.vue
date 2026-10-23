<script setup lang="ts">
// 왼쪽 큰 숫자(n + unit, 아래 caption) + 오른쪽 슬롯(제목·설명 마크다운).
defineProps<{ n: string | number; unit?: string; caption?: string }>()
</script>

<template>
  <div class="hero">
    <div class="hero-left">
      <div class="hero-n"><span class="grad">{{ n }}</span><span v-if="unit" class="hero-u">{{ unit }}</span></div>
      <div v-if="caption" class="body-s" style="margin-top:16px">{{ caption }}</div>
    </div>
    <div class="hero-right"><slot /></div>
  </div>
</template>
