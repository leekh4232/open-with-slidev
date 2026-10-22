# Open with Slidev

마크다운 파일을 우클릭하고 **Open with Slidev** 를 누르면 그 파일이 [Slidev](https://sli.dev) 슬라이드로 열립니다. 터미널을 열고, 프로젝트 폴더로 이동하고, 명령을 입력하는 과정이 메뉴 하나로 줄어듭니다.

## 할 수 있는 것

- **우클릭 한 번으로 실행**: 편집기 본문, 편집기 탭, 탐색기의 `.md` 파일 어디서든 메뉴가 보입니다.
- **설치 없이 동작**: Slidev가 설치된 폴더가 md 파일 위쪽에 있으면 그곳에서, 없으면 `npx`가 Slidev를 내려받아 실행합니다.
- **빈 포트 자동 선택**: 3030부터 비어 있는 포트를 골라 덱 여러 개를 동시에 띄울 수 있습니다.
- **미리보기 위치 선택**: 외부 브라우저 또는 VS Code 안 Simple Browser 탭(편집기 옆) 중 고를 수 있습니다.
- **내장 테마 32종**: 공식 갤러리 테마 28종과 추천 테마 4종을 이름만으로 씁니다. 프로젝트에 설치돼 있지 않아도 처음 쓸 때 내려받아 캐시에 두고, 프런트매터에 `theme`가 없는 파일에는 설정에서 고른 기본 테마를 적용합니다.
- **발표자 모드**: 원하면 `/presenter` 화면도 함께 엽니다.
- **파일마다 터미널 하나**: 서버는 `Slidev: 파일명` 터미널에서 돌고, 같은 파일을 다시 열면 그 터미널을 보여 주거나(기본) 서버를 다시 띄웁니다.

## 준비물

Node.js 18 이상만 있으면 됩니다. **프로젝트에 Slidev를 설치하지 않아도 동작합니다.**

- Slidev가 설치된 프로젝트(`node_modules/.bin/slidev`)가 md 파일 위쪽에 있으면 그곳에서 실행합니다. 시작이 빠르고 버전이 고정됩니다.
- 없으면 `npx`가 `@slidev/cli`와 기본 테마를 내려받아 실행합니다. 첫 실행은 1~2분 걸릴 수 있고 이후에는 캐시를 씁니다. 프런트매터의 `theme: ./내테마`처럼 폴더로 가리키는 테마는 그대로 되고, npm 테마 패키지는 Slidev가 터미널에서 설치 여부를 묻습니다.
- 전역 설치(`npm i -g @slidev/cli @slidev/theme-default`)를 쓰고 싶으면 `openWithSlidev.command`를 `slidev "${file}"`로 바꿉니다.

## 사용법

1. 슬라이드 md 파일을 엽니다.
2. 편집기 안에서 우클릭 → **Open with Slidev**. 탐색기에서 파일을 우클릭해도 됩니다.
3. 저장하지 않은 내용이 있으면 먼저 저장하고, 터미널에서 서버가 뜬 뒤 브라우저(또는 Simple Browser 탭)에 슬라이드가 열립니다.

명령 팔레트(`Cmd/Ctrl+Shift+P`)에서 `Slidev: Open with Slidev`로도 실행할 수 있습니다.

서버를 끄려면 해당 터미널에서 `Ctrl+C`를 누르거나 터미널을 닫습니다. `openWithSlidev.stopOnClose`를 켜면 md 편집기를 닫을 때 서버도 함께 꺼집니다.

## 내장 테마

아래 이름을 md 프런트매터에 쓰거나(`theme: terminal`), 설정 `openWithSlidev.defaultTheme` 드롭다운에서 고르면 됩니다. 프로젝트에 해당 패키지가 이미 설치돼 있으면 그것을 쓰고, 없으면 처음 한 번 npm으로 내려받아 캐시에 둔 뒤 `--theme` 절대 경로로 넘깁니다.

- 공식: `default`, `seriph`, `apple-basic`, `bricks`, `shibainu`
- 갤러리: `geist`, `light-icons`, `eloc`, `purplin`, `unicorn`, `zhozhoba`, `penguin`, `vuetiful`, `takahashi`, `academic`, `mokkapps`, `the-unnamed`, `dracula`, `frankfurt`, `hep`, `excali-slide`, `mint`, `neversink`, `nord`, `scholarly`, `field-manual`, `touying`, `tahta`
- 추천: `terminal`, `bestony2026`, `zhibai`, `legible`

- 캐시 위치는 VS Code의 익스텐션 전역 저장소(`globalStorage/leekh.open-with-slidev/themes`)이며, 명령 팔레트의 **Slidev: 내장 테마 미리 내려받기**로 여러 개를 한 번에 받아 둘 수 있습니다(오프라인 강의 전에 유용).
- 일부 테마(purplin, light-icons, unicorn, zhozhoba)는 Slidev 전체를 의존성으로 끌어와 캐시가 수백 MB가 됩니다. 처음 내려받을 때 1~2분 걸릴 수 있습니다.
- 목록에 없는 테마는 Slidev가 터미널에서 설치 여부를 묻는 기존 방식대로 동작하고, `openWithSlidev.defaultThemePath`로 경로나 npm 이름을 직접 지정할 수도 있습니다.

## 설정

설정 화면에서 "Open with Slidev"로 검색하거나 `settings.json`에 적습니다.

| 설정 | 기본값 | 설명 |
|---|---|---|
| `openWithSlidev.previewIn` | `browser` | `browser`: 외부 브라우저에서 엽니다. `vscode`: VS Code 안 Simple Browser 탭을 편집기 옆에 엽니다. |
| `openWithSlidev.command` | `npx slidev "${file}"` | 실행 명령. `${file}`은 프로젝트 루트 기준 md 상대 경로, `${root}`는 프로젝트 루트로 바뀝니다. 포트, `--open`, 테마, 추가 인자는 뒤에 자동으로 붙습니다. 예: `pnpm exec slidev "${file}"` |
| `openWithSlidev.extraArgs` | (없음) | 명령 끝에 덧붙일 인자. 예: `--remote`(다른 기기에서 접속), `--log info` |
| `openWithSlidev.onRerun` | `focus` | 같은 파일을 다시 열 때 `focus`는 기존 터미널을 보여 주고, `restart`는 서버를 끄고 다시 띄웁니다. |
| `openWithSlidev.port` | `3030` | 시작 포트. 사용 중이면 다음 번호를 자동으로 찾습니다. |
| `openWithSlidev.projectRoot` | (자동) | Slidev가 설치된 폴더. 비우면 md 파일 위쪽으로 자동 탐색합니다. 절대 경로 또는 워크스페이스 기준 상대 경로. |
| `openWithSlidev.defaultTheme` | (없음) | 프런트매터에 `theme`가 없을 때 쓸 내장 테마(드롭다운). 처음 쓸 때 내려받습니다. 프런트매터의 `theme`가 우선합니다. |
| `openWithSlidev.defaultThemePath` | (없음) | 내장 목록에 없는 기본 테마: 폴더 경로(절대 또는 프로젝트 루트 기준) 또는 npm 테마 이름. 값이 있으면 드롭다운보다 우선합니다. |
| `openWithSlidev.openPresenter` | `false` | 발표자 모드(`/presenter`)도 외부 브라우저로 함께 엽니다. |
| `openWithSlidev.filePatterns` | `["**/*.md"]` | 편집기 우클릭 메뉴를 보일 파일(glob, 워크스페이스 기준). 폴더 없이 쓰면 파일 이름만 비교합니다. 탐색기 메뉴는 `.md` 전체에 보이고 실행 시 검사합니다. |
| `openWithSlidev.stopOnClose` | `false` | md 편집기를 닫으면 그 파일의 서버(터미널)도 끕니다. |

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
2. 프로젝트 루트를 정합니다. `projectRoot` 설정 → 자동 탐색 → 워크스페이스 폴더 → 파일 폴더 순입니다. 루트에 Slidev가 없으면 내려받아 실행하는 명령으로 바꿉니다.
3. `port`부터 비어 있는 포트를 찾습니다.
4. 테마를 정합니다. 프런트매터의 테마 이름이 프로젝트에 없고 내장 목록에 있으면 캐시에서, 프런트매터에 테마가 없으면 `defaultThemePath` 또는 `defaultTheme`에서 가져와 `--theme`로 넘깁니다.
5. 루트에서 `command`에 `--port`, `--open`(브라우저 모드), `--theme`(필요할 때), `extraArgs`를 붙여 터미널에서 실행합니다.
6. 서버가 HTTP 응답을 줄 때까지(최대 60초) 기다린 뒤 미리보기와 발표자 모드를 엽니다.

## 설치

Marketplace에서 "Open with Slidev"를 검색해 설치하거나, [Releases](https://github.com/leekh4232/open-with-slidev/releases)에서 `.vsix`를 받아 설치합니다.

```bash
code --install-extension open-with-slidev-<버전>.vsix
```

## 개발

빌드 도구 없이 순수 JavaScript로 되어 있습니다. 파일은 `package.json`(메뉴·설정 정의), `extension.js`(동작), `themes.json`(내장 테마 목록) 셋뿐입니다.

```bash
npm install                                   # 패키징 도구(@vscode/vsce) 설치
node -e "require('./extension.js')"            # 문법 확인
npx vsce package --no-dependencies            # .vsix 만들기
```

`main` 브랜치에 push한 커밋 메시지에 `build`가 들어 있으면 GitHub Actions가 버전을 올리고(`major`/`minor`가 있으면 그 단위, 없으면 patch) VSIX를 만들어 Marketplace에 게시한 뒤, 버전 태그와 Release를 만듭니다.

## 라이선스

MIT
