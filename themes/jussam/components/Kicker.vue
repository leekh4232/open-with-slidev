<script setup lang="ts">
// 왼쪽에 그라디언트 세로선이 붙는 맺음말. 기본은 굵은 26px, lead 면 20px 설명 톤, muted 면 회색.
defineProps<{ lead?: boolean; muted?: boolean }>()
</script>

<template>
  <div class="kicker acc" :class="[lead ? 'lead' : 'title-sub', { muted }]"><slot /></div>
</template>
