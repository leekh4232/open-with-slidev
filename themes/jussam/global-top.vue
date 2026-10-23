<script setup lang="ts">
// 슬라이드 맨 아래 진행 바 (현재 쪽 / 전체). 슬라이드 위에 겹치므로 global-top 에 둔다.
import { useNav } from '@slidev/client'
const { currentPage, total } = useNav()
</script>

<template>
  <div class="jussam-bar"><i :style="{ width: `${(currentPage / total) * 100}%` }" /></div>
</template>

<style scoped>
.jussam-bar { position: absolute; left: 0; bottom: 0; width: 100%; height: 2px; background: rgba(255, 255, 255, 0.07); pointer-events: none; z-index: 20; }
.jussam-bar i { display: block; height: 2px; background: #e5e5e5; transition: width 0.22s ease; }
</style>
