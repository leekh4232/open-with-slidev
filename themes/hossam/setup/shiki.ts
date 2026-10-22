import { defineShikiSetup } from '@slidev/types'
// 흰 슬라이드 위의 어두운 코드 상자에 잘 보이도록 고대비 테마를 쓴다(주석도 밝은 회색).
export default defineShikiSetup(() => ({
  themes: { dark: 'github-dark-high-contrast', light: 'github-dark-high-contrast' },
}))
