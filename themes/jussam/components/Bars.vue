<script setup lang="ts">
// 나란한 세로 막대 패널(스몰 멀티플). labels: x 라벨, groups: { name, legend(범례 글, 없으면 name), color('c1'|'c2'), values(null 이면 "자료 미제공"), foot }[], max: 세로축 최댓값, unit: 범례 오른쪽 단위.
const props = withDefaults(defineProps<{ labels: string[]; groups: { name: string; legend?: string; color?: string; values: (number | null)[]; foot?: string }[]; max: number; unit?: string; na?: string }>(), { unit: '', na: '자료 미제공' })
const color = (g: { color?: string }, i: number) => `var(--${g.color ?? (i === 0 ? 'c1' : 'c2')})`
</script>

<template>
  <div class="bars">
    <div class="legend stagger" style="margin-bottom:16px">
      <div v-for="(g, i) in groups" :key="g.name" class="li"><span class="dot" :style="{ '--k': color(g, i) }" />{{ g.legend ?? g.name }}</div>
      <div v-if="unit" class="li axis-t" style="margin-left:auto">단위 · {{ unit }}</div>
    </div>
    <div class="sm">
      <div class="sm-y">
        <div class="sm-head" style="visibility:hidden">&nbsp;</div>
        <div class="sm-ruler">
          <div class="yt axis-t" style="bottom:100%">{{ max }}</div><div class="yt axis-t" style="bottom:50%">{{ max / 2 }}</div><div class="yt axis-t" style="bottom:0">0</div>
        </div>
      </div>
      <div class="sm-panels" :style="{ gridTemplateColumns: `repeat(${groups.length}, 1fr)` }">
        <div v-for="(g, i) in groups" :key="g.name" class="sm-panel">
          <div class="sm-head"><span class="dot" :style="{ '--k': color(g, i) }" />{{ g.name }}</div>
          <div class="sm-plot">
            <div class="sm-grid" style="bottom:100%" /><div class="sm-grid" style="bottom:50%" /><div class="sm-grid base" style="bottom:0" />
            <div class="sm-cols">
              <div v-for="(v, j) in g.values" :key="j" class="sm-col">
                <div v-if="v === null || v === undefined" class="sm-val is-na">{{ na }}</div>
                <template v-else>
                  <div class="sm-val">{{ v }}</div>
                  <div class="sm-bar" :style="{ '--h': `${(v / max) * 100}%`, background: color(g, i) }" />
                </template>
              </div>
            </div>
          </div>
          <div class="sm-xrow"><div v-for="l in labels" :key="l" class="sm-x axis-t">{{ l }}</div></div>
          <div v-if="g.foot" class="sm-foot">{{ g.foot }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
