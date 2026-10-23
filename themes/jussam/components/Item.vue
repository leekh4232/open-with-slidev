<script setup lang="ts">
// Agenda / NumList 의 한 줄. title: 제목, part: 번호 색(파트 1~4), 슬롯: 설명.
defineProps<{ title: string; part?: number | string }>()
</script>

<template>
  <div class="item" :class="part ? `part-${part}` : ''">
    <div class="no" />
    <div class="item-body">
      <div class="tt">{{ title }}</div>
      <div class="dd"><slot /></div>
    </div>
  </div>
</template>
