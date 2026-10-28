# 변경 이력

이 프로젝트의 주요 변경 사항을 기록합니다.

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)를, 버전은 [유의적 버전](https://semver.org/lang/ko/)을 따릅니다.

## [0.8.2] - 2026-10-28

### 변경
- **Slidev를 저장소마다 설치하지 않고 전역 Slidev를 씁니다.** 프로젝트에 `node_modules/@slidev/cli`가 있으면 지금처럼 그것을 쓰고, 없으면 전역(`npm install -g`)에 설치된 Slidev로 실행·빌드합니다. 전역에도 없으면 처음 한 번 VS Code 터미널에서 `npm install -g @slidev/cli @slidev/theme-default`를 실행합니다(환경에 따라 sudo 비밀번호를 물을 수 있어 터미널에서 돌립니다). 저장소에 `package.json`·`node_modules`를 만들거나 `.gitignore`를 고치지 않습니다.
- 새 설정 **`openWithSlidev.slidevPath`**(기본 `""`, 사용자 설정·기기별): 전역 Slidev의 `@slidev/cli` 패키지 폴더. 처음 실행 때 자동으로 찾아(`npm root -g` → PATH의 `slidev`) 기록하고, 설치했을 때도 기록합니다. 미리 적어 둘 수 있습니다.
- **`openWithSlidev.command` 기본값이 `npx slidev "${file}"`에서 `node "${slidev}" "${file}"`로 바뀌었습니다.** `${slidev}`는 쓸 Slidev 실행 파일(프로젝트 또는 전역의 `bin/slidev.mjs`)로 바뀌어 PATH에 기대지 않습니다. 설정에 옛 기본값이 그대로 적혀 있으면 기본값으로 봅니다. 직접 바꾼 명령(`pnpm exec slidev "${file}"` 등)은 지금처럼 그대로 씁니다.
- **Build with Slidev**(HTML · PDF · PPTX · PNG · Markdown · Teacher Mode)도 같은 Slidev로 빌드합니다. 내보내기에 필요한 `playwright-chromium`은 프로젝트에 없으면 전역에서 찾고, 그것도 없으면 터미널에서 `npm install -g playwright-chromium`으로 전역에 설치합니다(전에는 프로젝트 `devDependencies`에 설치했습니다). 전역 하나로 모든 프로젝트에서 씁니다.

## [0.8.1] - 2026-10-28

### 변경
- **빌드·내보내기(HTML·PDF·PPTX·PNG·Markdown·Teacher Mode)를 할 때 출력 창 Open with Slidev가 자동으로 열리지 않습니다.** 상태는 전부터 있던 우측 하단 진행 알림(경과 시간·취소)으로 보여 줍니다. 빌드 로그는 출력 창에 그대로 쌓이고, **빌드가 실패했을 때만** 출력 창이 자동으로 열려 원인을 보여 줍니다. (처음 한 번 Slidev·Playwright·qpdf를 내려받는 설치 과정은 그대로 출력 창에 진행 상황이 보입니다.)

## [0.8.0] - 2026-10-28

### 추가
- **Teacher Mode (설정 `openWithSlidev.teacherMode`, 기본 꺼짐).** 켜면 **Build with Slidev** 하위 메뉴 끝에 구분선과 함께 **hossam build**·**jussam build**가 생깁니다(편집기 본문·편집기 탭·탐색기 메뉴 모두). 두 메뉴는 원본 md를 그대로 두고, 강사명 자리(`{teacher}` 또는 상대 강사 이름)를 해당 강사 이름으로 바꾼 복사본으로 빌드해 HTML 한 파일과 **비밀번호가 걸린 PDF**를 만듭니다. 결과는 `slides.hossam.html`·`slides.hossam.pdf`(jussam은 `slides.jussam.*`)처럼 선생님별로 따로 나와 서로 덮지 않습니다. hossam은 **이광호**, jussam은 **주영아**로 치환합니다.
- PDF 비밀번호는 Slidev가 직접 걸지 못해, 내보낸 PDF를 qpdf로 AES-256 암호화합니다. 처음 한 번 `@neslinesli93/qpdf-wasm`를 익스텐션 전역 저장소(`globalStorage/leekh.open-with-slidev/tools`)에 내려받습니다(시스템에 qpdf를 따로 깔 필요 없음). 비밀번호를 거는 데 실패하면 암호화되지 않은 PDF를 남기지 않습니다.

## [0.7.0] - 2026-10-27

### 추가
- **Build with Slidev가 하위 메뉴가 되어 여러 형식으로 내보냅니다.** HTML(기존과 같은 한 파일) · PDF(`slides.pdf`) · PowerPoint(`slides.pptx`) · PNG(`slides-png/` 폴더) · Markdown(`slides-md/slides.md`와 슬라이드 PNG) 중에서 고릅니다. 편집기 본문 · 편집기 탭 · 탐색기 메뉴에 있고, 명령 팔레트에서는 `Build with Slidev: PDF (.pdf)`처럼 형식마다 명령이 있습니다.
- PDF · PPTX · PNG · Markdown은 Slidev의 `slidev export`로 만듭니다. 프로젝트에 `playwright-chromium`이 없으면 처음 한 번 루트에 `devDependencies`로 설치하고 Chromium도 받습니다. 진행 상황은 알림과 출력 창 **Open with Slidev**에 보이고 취소할 수 있습니다.

### 변경
- HTML 빌드 명령의 팔레트 이름이 `Slidev: Build with Slidev`에서 `Build with Slidev: HTML (.html, 서버 없이 열리는 한 파일)`로 바뀌었습니다.

## [0.6.1] - 2026-10-27

### 수정
- **Build with Slidev**로 만든 HTML을 열 때 브라우저 콘솔에 뜨던 `Failed to patch FloatingVue` 경고가 나오지 않습니다. Slidev 53이 쓰는 코드 타입 힌트 플러그인이 floating-vue 5.4와 맞지 않아 모든 페이지에서 내던 경고로, 슬라이드 동작에는 영향이 없었습니다.

## [0.6.0] - 2026-10-27

### 추가
- **우클릭 메뉴 Build with Slidev**: md 파일 옆에 같은 이름의 HTML 파일 하나(`slides.md` → `slides.html`)를 만듭니다. JS · CSS · 테마 · md 기준 상대 경로 이미지가 모두 들어가 서버 없이 더블클릭으로 열리고, 클릭 애니메이션과 발표자 모드(`#/presenter/1`)도 됩니다. 편집기 본문 · 편집기 탭 · 탐색기 메뉴와 명령 팔레트(`Slidev: Build with Slidev`)에 있습니다. 빌드 중에는 알림에 경과 시간이, 출력 창 **Open with Slidev**에 빌드 출력이 보이고 취소할 수 있습니다. `public/` 폴더의 파일은 들어가지 않아 끝난 뒤 알려 줍니다. 같은 이름의 HTML이 Slidev로 만든 파일이 아니면 덮어쓰기 전에 묻습니다.

## [0.5.3] - 2026-10-26

### 변경
- **터미널 출력을 정리했습니다.** 긴 `echo …; npx …` 명령줄과 한글 안내 대신, 확장에 든 실행기(`launch.js`)가 파일 · 루트 · 포트 · 테마 · 미리보기 위치 · 실행 명령을 색이 입혀진 영어 배너로 보여 주고 같은 터미널에서 Slidev를 띄웁니다. Slidev의 출력과 단축키는 그대로이고, 종료 코드도 그대로 전달됩니다. `NO_COLOR`가 설정돼 있거나 터미널이 아니면 색을 쓰지 않습니다.

## [0.5.2] - 2026-10-26

### 변경
- **프로젝트에 Slidev가 없으면 처음 한 번 그 프로젝트 폴더에 설치하고, 그 안의 Slidev로 띄웁니다.** 0.5.1의 전역 `slidev` 탐색과 설치 안내는 뺐습니다(전역 설치는 시작이 느렸습니다). 루트(워크스페이스 폴더, 없으면 md 파일 폴더)에 `@slidev/cli`와 기본 테마를 `devDependencies`로 넣고, `package.json`이 없으면 만들며, git 저장소인데 `.gitignore`에 `node_modules`가 없으면 한 줄 보탭니다. `package.json`에 `@slidev/cli`만 적혀 있고 `node_modules`가 없으면 `npm install`로 채웁니다. 설치 중에는 알림에 경과 시간과 받은 패키지 수가, 출력 창 **Open with Slidev**에 npm 출력이 보이고, 취소와 **다시 시도**가 됩니다. 다음부터는 바로 뜹니다.

## [0.5.1] - 2026-10-26

### 변경
- **프로젝트에 Slidev가 없으면 전역 설치된 `slidev`로 실행합니다.** PATH에서 자동으로 찾으며 설정이 필요 없습니다. 전역에 기본 테마가 없으면 한 번 안내합니다.
- **확장이 Slidev를 대신 내려받지 않습니다.** 전에는 터미널에서 `npx -p @slidev/cli …`로 매번 임시 설치했는데, 윈도우에서 너무 오래 걸리고 중간에 깨져 끝내 뜨지 않는 일이 있었습니다. 이제 프로젝트에도 전역에도 Slidev가 없으면 설치 명령 `npm install -g @slidev/cli @slidev/theme-default`를 안내하고 멈춥니다. 알림의 **터미널에서 설치**는 그 명령을 터미널에 넣어 주고, **명령 복사**는 클립보드에 복사합니다. 한 번 설치하면 이후 실행은 바로 뜹니다.
- 내장 테마를 내려받을 때 알림에 경과 시간과 받은 패키지 수가, 출력 창 **Open with Slidev**에 npm 출력이 보이고, 알림에서 취소할 수 있습니다. 테마 캐시의 npm 설정에 재시도(`fetch-retries=5`)와 넉넉한 시간(`fetch-timeout=600000`)을 두어 느린 회선에서 덜 끊깁니다.
- 확장 자동 업데이트(VS Code 설정 `extensions.autoUpdate`)가 꺼져 있으면 확장이 처음 켜질 때 한 번만 켜기를 권하는 알림을 띄웁니다. **켜기**를 누르면 설정이 켜집니다.

### 수정
- 같은 파일의 서버가 아직 시작 중일 때 다시 열면 터미널을 닫고 처음부터 시작하지 않고, 그 터미널을 보여 줍니다.
- 서버 응답 대기 시간을 3분에서 5분으로 늘렸습니다.

## [0.5.0] - 2026-10-26

### 변경
- **프런트매터의 `theme`가 경로면(`theme: ./slidev-themes/hossam`) 그 폴더를 그대로 씁니다.** 강의 · 발표용 hossam 테마는 [slidev-themes](https://github.com/leekh4232/slidev-themes) 저장소를 받아 이렇게 적습니다. 테마 폴더를 고치면 다시 열 때 바로 반영됩니다.
- `openWithSlidev.defaultTheme` 기본값이 `jussam`에서 `""`(지정 안 함, Slidev 기본 동작)으로 바뀌었습니다.
- 프런트매터에 `theme: hossam`이나 `theme: jussam`처럼 이름만 적으면, 저장소를 받아 경로로 적으라는 안내를 띄웁니다.

### 제거
- 내장 목록에서 jussam · hossam을 뺐습니다(34종 → 32종). 확장이 GitHub 테마 저장소를 내려받아 캐시(`themes/repo`)에 두던 동작도 없앴습니다.

## [0.4.0] - 2026-10-26

### 변경
- **전용 테마 jussam · hossam을 테마 저장소 [slidev-themes](https://github.com/leekh4232/slidev-themes)에서 받습니다.** 처음 쓸 때 저장소를 내려받아 캐시(`globalStorage/…/themes/repo`)에 두고, VS Code를 켠 뒤 처음 실행할 때 새 커밋이 있으면 갱신합니다. 인터넷에 연결되지 않으면 받아 둔 것을 씁니다. 테마를 고쳐도 확장을 다시 배포할 필요가 없습니다.
- **Slidev: 내장 테마 미리 내려받기** 명령에 jussam · hossam도 나옵니다. 고르면 저장소의 최신 테마로 다시 받습니다.
- 소개 페이지 https://open-with-slidev.hossam.kr 를 열었습니다(다크 테마). 테마 매뉴얼과 예제 덱은 테마 사이트 https://slidev-themes.hossam.kr 로 옮겼습니다.
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
