# Open with Slidev

[![Marketplace](https://vsmarketplacebadges.dev/version-short/leekh.open-with-slidev.svg?label=Marketplace&color=0066b8)](https://marketplace.visualstudio.com/items?itemName=leekh.open-with-slidev)
[![Installs](https://vsmarketplacebadges.dev/installs-short/leekh.open-with-slidev.svg?color=0066b8)](https://marketplace.visualstudio.com/items?itemName=leekh.open-with-slidev)
[![Release](https://img.shields.io/github/v/release/leekh4232/open-with-slidev?label=release&color=7c5cff)](https://github.com/leekh4232/open-with-slidev/releases)
![VS Code ^1.80](https://img.shields.io/badge/VS%20Code-%5E1.80-007ACC)
![Node.js ≥ 18](https://img.shields.io/badge/Node.js-%E2%89%A5%2018-339933)
[![Slidev themes 32](https://img.shields.io/badge/Slidev-themes%2032-2b90b6)](https://sli.dev)
[![License MIT](https://img.shields.io/badge/license-MIT-2ea44f)](LICENSE)

🌐 **소개 페이지 · [open-with-slidev.hossam.kr](https://open-with-slidev.hossam.kr/)**

마크다운 파일을 우클릭하고 **Open with Slidev** 를 누르면 그 파일이 [Slidev](https://sli.dev) 슬라이드로 열립니다. 터미널을 열고, 프로젝트 폴더로 이동하고, 명령을 입력하는 과정이 메뉴 하나로 줄어듭니다. **Build with Slidev** 하위 메뉴에서는 슬라이드를 HTML 파일 하나, PDF, PPTX, PNG, Markdown으로 내보냅니다.

## 할 수 있는 것

- **우클릭 한 번으로 실행**: 편집기 본문, 편집기 탭, 탐색기의 `.md` 파일 어디서든 메뉴가 보입니다.
- **설치 없이 시작**: Slidev가 설치된 프로젝트가 md 파일 위쪽에 있으면 그 Slidev로, 없으면 전역(`npm -g`) Slidev로 실행합니다. 전역에도 없으면 처음 한 번 터미널에서 설치하고 그 경로를 설정에 기록합니다. 저장소마다 `node_modules`를 만들지 않습니다.
- **한 번에 하나**: 다른 md를 열면 이전에 띄운 서버를 끄고 새 파일로 다시 띄웁니다. 설정한 포트가 다른 프로그램에 막혀 있으면 1씩 올려 최대 3회 다시 시도합니다.
- **진행 상황 표시**: 터미널에 파일·루트·포트·테마·실행 명령을 색이 입혀진 영어 배너로 보여 주고, 서버가 뜰 때까지 경과 시간이 보이는 알림을 띄웁니다(취소 가능).
- **미리보기 위치 선택**: 외부 브라우저 또는 VS Code 안 Simple Browser 탭(편집기 옆) 중 고를 수 있습니다.
- **내장 테마 32종**: 공식 갤러리 테마 28종과 추천 테마 4종을 이름만으로 씁니다. 프로젝트에 설치돼 있지 않아도 처음 쓸 때 npm에서 내려받아 캐시에 두고, 프런트매터에 `theme`가 없는 파일에는 설정에서 고른 기본 테마를 적용합니다.
- **폴더 테마**: 프런트매터에 `theme: ./slidev-themes/hossam`처럼 경로를 적으면 그 폴더를 그대로 씁니다. 테마를 고치면 다시 열 때 바로 반영됩니다.
- **발표자 모드**: 원하면 `/presenter` 화면도 함께 엽니다.
- **HTML 파일 하나로 빌드**: md 옆에 같은 이름의 `.html` 하나를 만듭니다. 서버 없이 더블클릭으로 열리고, 메일이나 메신저로 그 파일만 보내면 됩니다. 탐색기에서 md를 여러 개 선택하면 차례로 모두 만듭니다.
- **PDF · PPTX · PNG · Markdown으로 내보내기**: 같은 하위 메뉴에서 고릅니다. 처음 한 번 Playwright(Chromium)를 전역으로 설치합니다.
- **Teacher Mode(선택)**: 켜면 하위 메뉴에 `hossam build`·`jussam build`가 더 보입니다. 강사명 자리를 선생님 이름으로 바꾼 복사본으로 HTML과 비밀번호가 걸린 PDF를 만듭니다(원본 md는 그대로).
- **터미널에서 실행**: 서버는 `Slidev: 파일명` 터미널에서 돌고, 같은 파일을 다시 열면 그 터미널을 보여 주고 슬라이드를 브라우저(또는 Simple Browser)에 다시 띄우거나(기본) 서버를 다시 띄웁니다.

## 준비물

Node.js 18 이상만 있으면 됩니다. **Slidev를 미리 설치하지 않아도 됩니다.**

- Slidev가 설치된 프로젝트(`node_modules/@slidev/cli`)가 md 파일 위쪽에 있으면 그 Slidev로 실행합니다. 버전을 고정한 저장소를 그대로 존중합니다.
- 없으면 전역 Slidev(`npm install -g`로 설치한 `@slidev/cli`)로 실행합니다. 설정 `openWithSlidev.slidevPath`에 적힌 경로 → `npm root -g` → PATH의 `slidev` 순으로 찾고, 찾은 `@slidev/cli` 패키지 폴더를 그 설정에 기록해 다음부터는 바로 씁니다. 미리 적어 둘 수도 있습니다.
- 전역에도 없으면 처음 한 번 VS Code 터미널에서 `npm install -g @slidev/cli @slidev/theme-default`를 실행합니다(환경에 따라 sudo 비밀번호를 물을 수 있어 터미널에서 돌립니다). 끝나면 경로를 설정에 기록하고 바로 띄웁니다. 알림에서 취소할 수 있고, 실패하면 직접 설치할 명령을 안내합니다. 확장이 저장소에 `package.json`이나 패키지를 설치하지는 않습니다.
- 프런트매터의 `theme: ./내테마`처럼 폴더로 가리키는 테마는 그대로 되고, npm 테마 패키지는 Slidev가 터미널에서 설치 여부를 묻습니다.
- `openWithSlidev.command`를 바꾸면(예: `pnpm exec slidev "${file}"`) 그 명령을 그대로 씁니다.

## 사용법

1. 슬라이드 md 파일을 엽니다.
2. 편집기 안에서 우클릭 → **Open with Slidev**. 탐색기에서 파일을 우클릭해도 됩니다.
3. 저장하지 않은 내용이 있으면 먼저 저장하고, 터미널에서 서버가 뜬 뒤 브라우저(또는 Simple Browser 탭)에 슬라이드가 열립니다.

명령 팔레트(`Cmd/Ctrl+Shift+P`)에서 `Slidev: Open with Slidev`로도 실행할 수 있습니다. md 편집기가 열려 있지 않으면 워크스페이스의 md 파일 목록이 떠서 고를 수 있습니다.

다른 md를 열면 이전 서버는 자동으로 꺼지고 새 파일로 다시 뜹니다. 서버를 끄려면 해당 터미널에서 `Ctrl+C`를 누르거나 터미널을 닫습니다. `openWithSlidev.stopOnClose`를 켜면 md 편집기를 닫을 때 서버도 함께 꺼집니다.

### 빌드 · 내보내기

우클릭 → **Build with Slidev** 하위 메뉴에서 형식을 고릅니다. 명령 팔레트의 `Build with Slidev: PDF (.pdf)`처럼 `Build with Slidev:`로 시작하는 명령으로도 실행합니다.

탐색기에서 md 파일을 여러 개 선택하고 실행하면 선택한 파일을 차례로 처리합니다. 진행 알림에 `(2/5)`처럼 순서가 보이고, 끝나면 완료·실패 개수를 한 번에 알립니다. 하나를 취소하면 남은 파일은 하지 않습니다.

| 메뉴 | 결과 (`slides.md` 기준) |
|:--|:--|
| HTML | `slides.html` 한 파일. 서버 없이 더블클릭으로 열림 |
| PDF | `slides.pdf` |
| PowerPoint | `slides.pptx`. 슬라이드마다 이미지 한 장(클릭 단계별로 나뉨), 발표자 노트 포함 |
| PNG | `slides-png/` 폴더에 슬라이드별 PNG |
| Markdown | `slides-md/slides.md`와 같은 폴더의 슬라이드별 PNG. 발표자 노트는 본문으로 들어감 |

#### HTML

- **파일 하나에 모두 들어갑니다.** JS · CSS · 테마 · md 기준 상대 경로로 넣은 이미지(`![](./img/a.png)`)가 HTML 안에 들어가, 그 파일만 있으면 더블클릭으로 열립니다. 클릭 애니메이션과 발표자 모드(주소 끝 `#/presenter/1`)도 됩니다.
- **`public/` 폴더의 파일은 들어가지 않습니다.** `/pic.png`처럼 `public/`을 가리킨 이미지는 깨지므로, 빌드 뒤 알림으로 알려 주고 어떤 파일인지는 출력 창 **Open with Slidev**의 로그(`SKIPPED …`)에 남습니다. 이미지는 md 기준 상대 경로로 적으세요.
- 글꼴은 Slidev 기본 설정대로 Google Fonts에서 받으므로, 인터넷이 없으면 대체 글꼴로 보입니다.
- 같은 이름의 HTML이 이미 있는데 Slidev로 만든 파일이 아니면 덮어쓰기 전에 묻습니다.
- 빌드하는 동안 우측 하단 알림에 경과 시간이 보이고 거기서 취소할 수 있습니다. 출력 창 **Open with Slidev**은 자동으로 열리지 않고(빌드 출력은 거기에 쌓이며, 실패했을 때만 자동으로 열립니다) 끝나면 **브라우저로 열기** · **폴더에서 보기** 버튼이 나옵니다.
- **Open with Slidev**와 같은 Slidev(프로젝트의 `@slidev/cli`, 없으면 전역)로 빌드하고, 테마도 같은 규칙으로 정합니다.

#### PDF · PPTX · PNG · Markdown

- **Open with Slidev**와 같은 Slidev(프로젝트의 `@slidev/cli`, 없으면 전역)로 `slidev export --format <형식> --output <결과>`를 실행합니다. 테마도 같은 규칙으로 정합니다. 프런트매터의 `exportFilename`보다 위 표의 이름이 우선합니다.
- **처음 한 번 Playwright를 설치합니다.** Slidev는 브라우저로 슬라이드를 찍어 내보내므로 `playwright-chromium`이 필요합니다. 프로젝트에 있으면 그것을, 없으면 전역(`npm -g`)에서 찾고, 그것도 없으면 터미널에서 `npm install -g playwright-chromium`을 실행합니다(Chromium도 함께 받아 수백 MB, 수 분 걸릴 수 있음). 전역 하나로 모든 프로젝트에서 씁니다. 알림에서 취소할 수 있습니다.
- `slides-png/` 폴더는 내보낼 때마다 비우고 다시 만듭니다. PNG가 아닌 파일이 들어 있으면 먼저 묻습니다. PDF · PPTX는 같은 이름 파일을 덮어씁니다.
- 내보내는 동안 우측 하단 알림에 경과 시간이 보이고 거기서 취소할 수 있습니다. 출력 창 **Open with Slidev**은 자동으로 열리지 않고(Slidev 출력은 거기에 쌓이며, 실패했을 때만 자동으로 열립니다) 끝나면 **열기** · **폴더에서 보기** 버튼이 나옵니다. HTML · PDF 등 서로 다른 형식은 동시에 내보낼 수 있습니다.

#### Teacher Mode (hossam · jussam build)

설정 `openWithSlidev.teacherMode`를 켜면 **Build with Slidev** 하위 메뉴 끝에 구분선과 함께 `hossam build`·`jussam build`가 보입니다(편집기 본문 · 편집기 탭 · 탐색기 메뉴 모두). 강의 덱 하나로 선생님별 배포본을 만들 때 씁니다.

- **강사명 치환**: `hossam build`는 `{teacher}`와 `주영아`를 **이광호**로, `jussam build`는 `{teacher}`와 `이광호`를 **주영아**로 바꿉니다. 덱에서 강사 이름이 들어갈 자리에 `{teacher}`를 적어 두면 두 배포본을 한 소스로 관리할 수 있습니다.
- **원본은 그대로**: 치환은 같은 폴더에 만든 임시 복사본에서만 일어나고, 빌드가 끝나면 지웁니다. 원본 md와 `{teacher}` 자리는 건드리지 않습니다.
- **결과**(`slides.md` 기준): `slides.hossam.html`·`slides.hossam.pdf`(jussam은 `slides.jussam.*`). 선생님별로 이름이 달라 서로 덮지 않습니다. HTML은 위 [HTML](#html)과 같은 한 파일이고, 테마는 **Open with Slidev**와 같은 규칙으로 정합니다.
- **PDF 비밀번호**: Slidev는 PDF에 비밀번호를 걸지 못해, 내보낸 PDF를 [qpdf](https://github.com/qpdf/qpdf)로 AES-256 암호화합니다. 선생님마다 익스텐션에 정해진 비밀번호가 있고, 열 때 그 비밀번호를 물어봅니다. 처음 한 번 `@neslinesli93/qpdf-wasm`를 전역 저장소(`globalStorage/leekh.open-with-slidev/tools`)에 내려받습니다(시스템에 qpdf를 깔 필요 없음). 비밀번호를 거는 데 실패하면 암호화되지 않은 PDF를 남기지 않습니다.
- 비밀번호는 익스텐션 소스에 고정돼 있어, 소스를 볼 수 있는 사람에게는 가려지지 않습니다. 아무나 바로 열지 못하게 막는 용도입니다.

## 내장 테마

아래 이름을 md 프런트매터에 쓰거나(`theme: terminal`), 설정 `openWithSlidev.defaultTheme` 드롭다운에서 고르면 됩니다. 프로젝트에 해당 패키지가 이미 설치돼 있으면 그것을 쓰고, 없으면 처음 한 번 내려받아 캐시에 둔 뒤 `--theme` 절대 경로로 넘깁니다.

- 폴더 테마: 프런트매터의 `theme`가 경로(`./`, `../`, `/`로 시작)면 내장 목록을 보지 않고 Slidev에 그대로 넘깁니다. 코딩 강의용 [hossam 테마](https://slidev-themes.hossam.kr/)는 [slidev-themes](https://github.com/leekh4232/slidev-themes) 저장소를 받은 뒤 `theme: ./slidev-themes/hossam`으로 씁니다. 사용법은 아래 [테마 매뉴얼](#테마-매뉴얼).
- 공식: `default`, `seriph`, `apple-basic`, `bricks`, `shibainu`
- 갤러리: `geist`, `light-icons`, `eloc`, `purplin`, `unicorn`, `zhozhoba`, `penguin`, `vuetiful`, `takahashi`, `academic`, `mokkapps`, `the-unnamed`, `dracula`, `frankfurt`, `hep`, `excali-slide`, `mint`, `neversink`, `nord`, `scholarly`, `field-manual`, `touying`, `tahta`
- 추천: `terminal`, `bestony2026`, `zhibai`, `legible`

- 캐시 위치는 VS Code의 익스텐션 전역 저장소(`globalStorage/leekh.open-with-slidev/themes`)이며, 명령 팔레트의 **Slidev: 내장 테마 미리 내려받기**로 여러 개를 한 번에 받아 둘 수 있습니다(오프라인 강의 전에 유용). 내려받는 동안 알림에 경과 시간과 받은 패키지 수가, 출력 창 **Open with Slidev**에 npm 출력이 보이고, 알림에서 취소할 수 있습니다.
- 일부 테마(purplin, light-icons, unicorn, zhozhoba)는 Slidev 전체를 의존성으로 끌어와 캐시가 수백 MB가 됩니다. 처음 내려받을 때 수 분 걸릴 수 있습니다.
- 목록에 없는 테마는 Slidev가 터미널에서 설치 여부를 묻는 기존 방식대로 동작하고, `openWithSlidev.defaultThemePath`로 경로나 npm 이름을 직접 지정할 수도 있습니다. 프런트매터의 테마가 프로젝트에도 내장 목록에도 없으면 실행 전에 경고를 띄웁니다(npm에 없는 이름이면 Slidev 설치가 404로 실패합니다).

## 테마 매뉴얼

폴더 테마 `hossam`의 사용법과 예제 덱은 테마 사이트에 있습니다. 흰 바탕 코딩 강의용 테마이고, 덱 헤더의 `sidebar: true | false`로 목차 사이드바를 켜고 끕니다.

```md
---
theme: ./slidev-themes/hossam
sidebar: true      # 생략하면 켬
---
```

| 문서 | URL |
|---|---|
| Slidev Themes (테마 사이트) | https://slidev-themes.hossam.kr/ |
| hossam 테마 (설정 · 사이드바 · 컴포넌트) | https://slidev-themes.hossam.kr/hossam.html |
| 예제 덱 | [lecture-example.md](https://github.com/leekh4232/slidev-themes/blob/main/docs/examples/lecture-example.md) |

## 설정

설정 화면에서 "Open with Slidev"로 검색하거나 `settings.json`에 적습니다.

| 설정 | 기본값 | 설명 |
|---|---|---|
| `openWithSlidev.previewIn` | `browser` | `browser`: 외부 브라우저에서 엽니다. `vscode`: VS Code 안 Simple Browser 탭을 편집기 옆에 엽니다. |
| `openWithSlidev.command` | `node "${slidev}" "${file}"` | 실행 명령. `${slidev}`는 쓸 Slidev 실행 파일(프로젝트의 `node_modules/@slidev/cli`가 있으면 그것, 없으면 전역 설치의 `bin/slidev.mjs`), `${file}`은 프로젝트 루트 기준 md 상대 경로, `${root}`는 프로젝트 루트로 바뀝니다. 포트, `--open`, 테마, 추가 인자는 뒤에 자동으로 붙습니다. 직접 바꾸면 그 명령을 그대로 씁니다. 예: `pnpm exec slidev "${file}"` |
| `openWithSlidev.slidevPath` | (자동) | 전역 Slidev의 `@slidev/cli` 패키지 폴더(예: `/opt/homebrew/lib/node_modules/@slidev/cli`). 비우면 처음 실행 때 자동으로 찾아 기록하고, 없으면 터미널에서 설치한 뒤 기록합니다. 미리 적어 둘 수 있습니다. 사용자 설정에 기기별로 저장됩니다. |
| `openWithSlidev.extraArgs` | (없음) | 명령 끝에 덧붙일 인자. 예: `--remote`(다른 기기에서 접속), `--log info` |
| `openWithSlidev.onRerun` | `focus` | 같은 파일을 다시 열 때 `focus`는 기존 터미널을 보여 주고 슬라이드를 `previewIn`에 맞춰 다시 엽니다(`browser`면 브라우저 새 탭, `vscode`면 Simple Browser). `restart`는 서버를 끄고 다시 띄웁니다. |
| `openWithSlidev.port` | `3030` | 시작 포트. 다른 프로그램이 쓰고 있으면 1씩 올려 최대 3회 다시 시도합니다. |
| `openWithSlidev.projectRoot` | (자동) | 프로젝트 루트. md 상대 경로와 테마 경로의 기준이고, 여기(또는 위쪽)에 `node_modules/@slidev/cli`가 있으면 그것으로 실행합니다. 비우면 md 파일 위쪽에서 Slidev가 설치된 폴더를 찾고, 없으면 워크스페이스 폴더입니다. 절대 경로 또는 워크스페이스 기준 상대 경로. |
| `openWithSlidev.defaultTheme` | `""` (지정 안 함) | 프런트매터에 `theme`가 없을 때 쓸 내장 테마(드롭다운). 처음 쓸 때 npm에서 내려받습니다. "지정 안 함"이면 Slidev 기본 동작입니다. 프런트매터의 `theme`가 우선합니다. |
| `openWithSlidev.defaultThemePath` | (없음) | 내장 목록에 없는 기본 테마: 폴더 경로(절대 또는 프로젝트 루트 기준) 또는 npm 테마 이름. 값이 있으면 드롭다운보다 우선합니다. |
| `openWithSlidev.openPresenter` | `false` | 발표자 모드(`/presenter`)도 외부 브라우저로 함께 엽니다. |
| `openWithSlidev.filePatterns` | `["**/*.md"]` | 편집기 우클릭 메뉴를 보일 파일(glob, 워크스페이스 기준). 폴더 없이 쓰면 파일 이름만 비교합니다. 탐색기 메뉴는 `.md` 전체에 보이고 실행 시 검사합니다. |
| `openWithSlidev.stopOnClose` | `false` | md 편집기를 닫으면 그 파일의 서버(터미널)도 끕니다. |
| `openWithSlidev.teacherMode` | `false` | 켜면 **Build with Slidev** 하위 메뉴 끝에 구분선과 함께 `hossam build`·`jussam build`가 보입니다. 아래 [Teacher Mode](#teacher-mode-hossam--jussam-build) 참고. |

설정 예시:

```jsonc
{
  "openWithSlidev.previewIn": "vscode",
  "openWithSlidev.projectRoot": "slides",
  "openWithSlidev.defaultTheme": "terminal",
  "openWithSlidev.filePatterns": ["slides/**/*.md"],
  "openWithSlidev.onRerun": "restart"
}
```

## 동작 순서

1. 파일이 `filePatterns`에 맞는지 확인하고, 수정 중이면 저장합니다.
2. 프로젝트 루트를 정합니다. `projectRoot` 설정 → 자동 탐색 → 워크스페이스 폴더 → 파일 폴더 순입니다. 같은 파일의 서버가 아직 시작 중이면 새로 띄우지 않고 그 터미널을 보여 줍니다. 다른 파일의 서버가 돌고 있으면 그 터미널을 닫아 끕니다(한 번에 하나).
3. 쓸 Slidev를 정합니다. 루트(또는 위쪽)의 `node_modules/@slidev/cli`가 있으면 그것, 없으면 전역 Slidev입니다. 전역은 `slidevPath` 설정 → `npm root -g` → PATH 순으로 찾아 설정에 기록하고, 없으면 터미널에서 `npm install -g`로 설치합니다.
4. `port`부터 비어 있는 포트를 찾습니다(다른 프로그램이 쓰고 있으면 +1, 최대 3회).
5. 테마를 정합니다. 프런트매터의 테마 이름이 프로젝트에 없고 내장 목록에 있으면 캐시에서, 프런트매터에 테마가 없으면 `defaultThemePath` 또는 `defaultTheme`에서 가져와 `--theme`로 넘깁니다.
6. 루트에서 `command`(`${slidev}`는 3번의 실행 파일, `${file}`은 상대 경로)에 `--port`, `--open`(브라우저 모드), `--theme`(필요할 때), `extraArgs`를 붙여 터미널에서 실행합니다. 터미널에는 확장에 든 실행기(`node launch.js …`) 한 줄만 보내고, 실행기가 배너를 찍은 뒤 그 명령을 같은 터미널에서 돌립니다.
7. 서버가 HTTP 응답을 줄 때까지(최대 5분) 경과 시간 알림을 보여 준 뒤 미리보기와 발표자 모드를 엽니다. 서버가 뜨기 전에 Slidev 명령이 끝나면(테마 설치 실패, 문법 오류 등) 기다리지 않고 종료 코드와 함께 바로 알립니다(터미널 셸 통합이 켜진 경우).

**Build with Slidev**는 1 ~ 3, 5번까지 같고, 그 뒤 확장에 든 빌더(`node build.js …`)를 루트에서 실행합니다. 빌더는 3번에서 정한 Slidev로 해시 라우팅(`#/2`)과 코드 분할 없이 빌드하면서 이미지 등 자원을 모두 data URI로 넣고, JS와 CSS를 `index.html` 안으로 옮긴 뒤 md 옆 `<이름>.html`로 복사합니다. 그 Slidev의 `@slidev/cli` 패키지 폴더는 환경 변수 `SLIDEV_CLI_PATH`로 넘기므로, 테마가 Slidev에 든 패키지(예: 코드 문법 파일)를 찾을 때 이 경로를 쓸 수 있습니다. PDF · PPTX · PNG · Markdown은 3번 뒤 `playwright-chromium`을 준비하고(프로젝트 → 전역 순으로 찾고, 없으면 터미널에서 전역 설치), 5번으로 정한 테마를 `--theme`로 넘겨 루트에서 `node <slidev.mjs> export …`를 실행합니다.

## 설치

Marketplace에서 "Open with Slidev"를 검색해 설치하거나, [Releases](https://github.com/leekh4232/open-with-slidev/releases)에서 `.vsix`를 받아 설치합니다.

새 버전은 VS Code의 확장 자동 업데이트(설정 `extensions.autoUpdate`, 기본 켜짐)로 설치됩니다. 이 설정이 꺼져 있으면 확장이 처음 켜질 때 한 번만 켜기를 권하는 알림을 띄웁니다.

```bash
code --install-extension open-with-slidev-<버전>.vsix
```

## 개발

빌드 도구 없이 순수 JavaScript로 되어 있습니다. 파일은 `package.json`(메뉴·설정 정의), `extension.js`(동작), `build.js`(HTML 한 파일 빌더, 다른 형식은 `slidev export`를 그대로 씁니다), `themes.json`(내장 테마 목록), `docs/`(소개 페이지, GitHub Pages로 게시)입니다. `hossam` 테마는 별도 저장소 [slidev-themes](https://github.com/leekh4232/slidev-themes)에 있습니다.

```bash
npm install                                   # 패키징 도구(@vscode/vsce) 설치
node -e "require('./extension.js')"            # 문법 확인
npx vsce package --no-dependencies            # .vsix 만들기
```

`main` 브랜치에 push한 커밋 메시지에 `build`가 들어 있으면 GitHub Actions가 버전을 올리고(`major`/`minor`가 있으면 그 단위, 없으면 patch) VSIX를 만들어 Marketplace에 게시한 뒤, 버전 태그와 Release를 만듭니다.

## 라이선스

MIT
