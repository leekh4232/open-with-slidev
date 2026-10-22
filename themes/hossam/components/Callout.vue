<script setup lang="ts">
// 콜아웃 상자. kind: eli5 | real | tip | warn | danger | ai
const props = withDefaults(defineProps<{ kind?: string; title?: string }>(), { kind: 'eli5' })
const meta: Record<string, { icon: string; title: string; color: string; bg: string }> = {
  eli5:   { icon: '💡', title: '쉽게 말하면',   color: 'var(--yellow)', bg: 'var(--yellow-soft)' },
  real:   { icon: '🧭', title: '현업에서는',     color: 'var(--py)',     bg: 'var(--py-soft)' },
  tip:    { icon: '✅', title: '막히면',         color: 'var(--ok)',     bg: 'var(--ok-soft)' },
  warn:   { icon: '⚠️', title: '주의',           color: 'var(--warn)',   bg: 'var(--surface)' },
  danger: { icon: '⛔', title: 'AI에게 주면 안 되는 것', color: 'var(--danger)', bg: 'var(--danger-soft)' },
  ai:     { icon: '🤖', title: 'AI와 함께',      color: 'var(--ai)',     bg: 'var(--ai-soft)' },
}
const m = meta[props.kind] ?? meta.eli5
</script>

<template>
  <div class="callout" :style="{ borderLeftColor: m.color, background: m.bg }">
    <div class="callout-head" :style="{ color: m.color }">{{ m.icon }} {{ title ?? m.title }}</div>
    <div class="callout-body"><slot /></div>
  </div>
</template>

<style scoped>
.callout { border: 1px solid var(--line); border-left-width: 5px; border-radius: 14px; padding: 0.7rem 1rem; margin: 0.6rem 0; }
.callout-head { font-size: 0.9rem; font-weight: 800; letter-spacing: 0.04em; margin-bottom: 0.2rem; }
.callout-body { font-size: 1rem; }
.callout-body :deep(p) { margin: 0; }
</style>
