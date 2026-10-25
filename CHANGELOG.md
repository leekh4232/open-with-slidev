# 변경 이력

이 프로젝트의 주요 변경 사항을 기록합니다.

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)를, 버전은 [유의적 버전](https://semver.org/lang/ko/)을 따릅니다.

## [미배포]

### 변경
- **전용 테마 jussam · hossam을 테마 저장소 [slidev-themes](https://github.com/leekh4232/slidev-themes)에서 받습니다.** 처음 쓸 때 저장소를 내려받아 캐시(`globalStorage/…/themes/repo`)에 두고, VS Code를 켠 뒤 처음 실행할 때 새 커밋이 있으면 갱신합니다. 인터넷에 연결되지 않으면 받아 둔 것을 씁니다. 테마를 고쳐도 확장을 다시 배포할 필요가 없습니다.
- **Slidev: 내장 테마 미리 내려받기** 명령에 jussam · hossam도 나옵니다. 고르면 저장소의 최신 테마로 다시 받습니다.
- 소개 페이지 https://open-with-slidev.hossam.kr 를 열었습니다. 확장 소개 아래에 테마 매뉴얼(개요 · jussam · hossam)을 두고, 왼쪽에 고정 사이드바 메뉴를 붙였습니다. 다크 테마입니다.
- 확장 패키지가 테마 파일만큼 작아졌습니다.

## 0.3.2
- 같은 파일을 다시 열 때 서버가 실제로 응답하는지 확인: 이전 실행이 실패해 터미널만 남아 있으면 그 터미널을 닫고 새로 띄운다 (재가동이 막히던 문제)
- 내장 테마(hossam·jussam) 준비에 실패하면 실행을 멈추고 안내한다 (전에는 그대로 띄워 Slidev 가 npm 에서 테마를 못 찾아 404 로 죽었다)
- 패키지에서 *.nb.md 제외

## 0.3.1
- 테마 매뉴얼(jussam·hossam 사용법, 컴포넌트 프롭, 예제 코드, 화면)을 docs/ 에 추가하고 GitHub Pages 로 게시. README 에 URL 정리
- 예제 덱 docs/examples/jussam-example.md(가상 수치)·hossam-example.md. 강의 덱 샘플은 저장소에서 제거
- VSIX 에서 docs/ 제외

## 0.3.0
- 동봉 테마 jussam 추가(특강·발표용 다크 테마: 메시 그라디언트 표지, 파트별 시그니처 색, 카드·스탯·차트 상자)하고 기본 테마로 지정. 내장 테마 34종
- jussam 컴포넌트 22종(Grid·Card·Stat·Kicker·Agenda/NumList·BeforeAfter·Timeline·Gauge·Slope·Funnel·Branch·HBar·Meter·Bars·Mul·Formula 등): md 에 HTML 없이 태그만으로 구성
- 샘플 덱 samples/itwill-lecture.md (2026-07-27 아이티윌 특강, jussam 테마·컴포넌트 사용 예)
- 탐색기 우클릭 메뉴를 마크다운 언어로도 판정(resourceLangId), 명령 팔레트에서 md 편집기 없이 실행하면 워크스페이스의 md 파일을 골라 연다
- 서버가 뜨기 전에 Slidev 명령이 끝나면 3분을 기다리지 않고 종료 코드와 원인 힌트를 바로 알림(셸 통합 터미널). 프런트매터 테마가 프로젝트에도 내장 목록에도 없으면 실행 전에 경고
- 마켓플레이스 아이콘(icon.png)과 검정 배너 추가
- 빈 포트 검사가 IPv6(::1)도 보도록 수정: Slidev 가 [::1] 에 묶여 있어도 다음 포트로 넘어간다 (전에는 두 번째 덱이 같은 포트를 받아 첫 덱 서버를 자기 것으로 착각)

## 0.2.1
- 포트가 사용 중이면 1씩 올려 최대 3회 재시도, 모두 막혀 있으면 안내
- 터미널에 진행 과정(파일·루트·포트·테마) 출력, 서버가 뜰 때까지 경과 시간이 보이는 로딩 알림(취소 가능), 대기 한도 3분

## 0.2.0
- 설정 10개 추가: previewIn(VS Code Simple Browser 미리보기), command, extraArgs, onRerun(restart), port(빈 포트 자동 탐색), projectRoot, defaultTheme(프런트매터에 theme 가 없을 때 기본 테마), openPresenter, filePatterns, stopOnClose
- 서버가 응답할 때까지 기다린 뒤 미리보기·발표자 모드를 연다
- 프로젝트에 Slidev 가 없어도 동작: npx 가 @slidev/cli 와 기본 테마를 내려받아 실행
- 동봉 테마 hossam(파이썬 기초 과정 테마)을 드롭다운 첫 항목이자 기본값으로 추가
- 내장 테마 32종(공식 갤러리 28 + 추천 4): 프런트매터 `theme: 이름` 또는 defaultTheme 드롭다운으로 사용, 처음 쓸 때 캐시에 내려받음. defaultThemePath(직접 지정)와 '내장 테마 미리 내려받기' 명령 추가

## 0.1.0
- 첫 공개: 마크다운 편집기·편집기 탭·탐색기 우클릭 메뉴 'Open with Slidev' 로 현재 md 파일을 Slidev 개발 서버로 띄운다.
