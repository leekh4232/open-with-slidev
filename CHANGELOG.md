# Changelog

## 0.2.0
- 설정 10개 추가: previewIn(VS Code Simple Browser 미리보기), command, extraArgs, onRerun(restart), port(빈 포트 자동 탐색), projectRoot, defaultTheme(프런트매터에 theme 가 없을 때 기본 테마), openPresenter, filePatterns, stopOnClose
- 서버가 응답할 때까지 기다린 뒤 미리보기·발표자 모드를 연다
- 프로젝트에 Slidev 가 없어도 동작: npx 가 @slidev/cli 와 기본 테마를 내려받아 실행
- 내장 테마 32종(공식 갤러리 28 + 추천 4): 프런트매터 `theme: 이름` 또는 defaultTheme 드롭다운으로 사용, 처음 쓸 때 캐시에 내려받음. defaultThemePath(직접 지정)와 '내장 테마 미리 내려받기' 명령 추가

## 0.1.0
- 첫 공개: 마크다운 편집기·편집기 탭·탐색기 우클릭 메뉴 'Open with Slidev' 로 현재 md 파일을 Slidev 개발 서버로 띄운다.
