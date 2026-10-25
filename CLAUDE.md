# Open with Slidev 작업 지침

VS Code 확장 **Open with Slidev**(`leekh.open-with-slidev`) 저장소입니다. md 파일을 우클릭해 Slidev 개발 서버로 띄웁니다. 빌드 도구 없이 순수 JavaScript `extension.js` 하나로 동작하며, 테마 목록은 `themes.json`에 있습니다.

전용 테마 `jussam` · `hossam`은 이 저장소에 없습니다. 별도 저장소 **slidev-themes**(`/Users/leekh/slidev-themes`, `git@github.com:leekh4232/slidev-themes.git`)에 있고, 확장이 실행 중에 그 저장소의 `main`을 내려받아 씁니다(`ensureRepoTheme`). 나머지 테마는 npm에서 받습니다.

응답과 문서는 한글로 씁니다. 코드, 커밋 메시지, 설정 이름은 원래 언어를 유지합니다.

## 코드를 고친 뒤에는 항상 아래 1~4를 이 순서로 합니다

### 1. CHANGELOG에 반영

- 파일: `CHANGELOG.md` (저장소 루트)
- 맨 위 `## [미배포]` 섹션에 적습니다. 없으면 버전 섹션들 위에 새로 만듭니다.
- 하위 제목은 `### 추가` · `### 변경` · `### 수정` · `### 제거` 중 해당하는 것만 씁니다.
- 한글로, 사용자가 체감하는 결과 위주로 씁니다. 바뀐 설정 이름과 기본값은 정확히 적습니다.
- **배포할 때** `## [미배포]`를 `## [x.y.z] - YYYY-MM-DD`로 바꿉니다. 버전은 현재 `package.json` 버전에 커밋 메시지의 올림 단위(`patch` · `minor` · `major`)를 적용한 값입니다.
- 테마만 바뀐 경우(slidev-themes 저장소)는 이 CHANGELOG가 아니라 그 저장소의 커밋으로 남습니다. 확장 배포도 필요 없습니다.

### 2. README와 소개 페이지 갱신

기능이나 설정이 바뀌면 아래 파일을 모두 맞춥니다.

| 파일 | 내용 |
|:--|:--|
| `README.md` | Marketplace와 GitHub에 보이는 설명. 할 수 있는 것, 사용법, 테마 목록, 설정 표, 동작 순서 |
| `docs/index.html` | 소개 페이지 https://open-with-slidev.hossam.kr (`docs/CNAME`). 확장이 하는 일만 짧게 |
| `docs/themes.html` | 테마 매뉴얼 개요와 빠른 시작, 예제 덱 링크 |
| `docs/jussam.html` · `docs/hossam.html` | 전용 테마 매뉴얼 (레이아웃 · 컴포넌트 · 프롭 · 예제 코드 · 화면) |
| `docs/style.css` | 네 페이지 공통 스타일 (다크 테마, 왼쪽 고정 사이드바) |
| `docs/img/` · `docs/examples/` | 매뉴얼 화면 캡처와 예제 덱 |
| `package.json` | 설정 설명 · 드롭다운 설명(`enumDescriptions`) · 명령 이름 |
| `themes.json` | 테마 목록. 드롭다운(`defaultTheme`의 `enum`)과 같은 순서 · 같은 항목을 유지 |

- **제거된 기능은 "제거됨"이라고 쓰지 않고 아예 언급하지 않습니다.** 문서에서 그 기능에 대한 문장, 표 행, 그림 설명을 지웁니다. 제거 기록은 CHANGELOG에만 남깁니다.
- 소개 페이지(`index.html`)는 **이 확장이 무슨 일을 하는지만** 짧게 씁니다. 설정 이름 · 기본값 · 내부 동작은 README에 둡니다. 기능 카드는 짝수 개(지금 6개)를 유지합니다.
- **사이드바는 네 페이지에 같은 내용으로 복사되어 있습니다.** 페이지를 더하거나 빼면 네 파일의 `<aside class="sidebar">`를 모두 고칩니다. 지금 페이지의 `<a class="current">` 아래 `<ul class="subnav">`는 그 페이지의 `<h2 id>` 목록과 같아야 하니, `h2`를 더하거나 바꾸면 사이드바도 맞춥니다.
- slidev-themes에서 테마의 레이아웃 · 컴포넌트 · 프롭이 바뀌면 `docs/jussam.html` · `docs/hossam.html`과 예제 덱도 함께 고칩니다.
- 바꾼 뒤 예전 표현이 남았는지 검색합니다 (예: 제거한 설정 이름, 옛 주소).
- `docs/**`, `*.html`, `CLAUDE.md`는 `.vscodeignore`로 VSIX에서 빠집니다.

### 3. 로컬에 설치해서 테스트

```sh
node --check extension.js
npx vsce package --no-dependencies -o open-with-slidev-local.vsix
unzip -l open-with-slidev-local.vsix        # docs · CLAUDE.md · 테스트 파일이 들어가지 않았는지
code --install-extension open-with-slidev-local.vsix --force
```

- 설치 뒤 VS Code에서 **Developer: Reload Window**를 실행해야 새 버전이 적용됩니다.
- `.vsix`는 `.gitignore`에 있어 커밋되지 않습니다.
- 바뀐 기능을 실제로 돌려 봅니다. 최소한 아래를 확인합니다.
  - `docs/examples/jussam-example.md`와 `hossam-example.md`를 우클릭 → **Open with Slidev**로 열면 서버가 뜨고 테마가 맞게 나온다.
  - 테마를 처음 받는 상황(캐시가 빈 상태)에서도 된다. 캐시는 `~/Library/Application Support/Code/User/globalStorage/leekh.open-with-slidev/themes`입니다.
  - 프런트매터에 npm 테마(예: `theme: seriph`)를 적은 덱도 열린다 (테마 처리를 건드렸다면 필수).
- `extension.js`의 순수 함수는 `vscode` 없이 Node로 바로 시험할 수 있습니다. 예: `node -e "const e=require('./extension.js'); e.ensureRepoTheme('/tmp/c', e.CATALOG[0], {}).then(console.log)"`
- 직접 클릭할 수 없을 때는 `@vscode/test-electron`으로 별도 VS Code를 내려받아, VSIX를 푼 `extension/` 폴더를 `extensionDevelopmentPath`로 띄우고 `openWithSlidev.open` 명령을 파일 URI로 실행합니다. 서버 포트(3030부터)에 HTTP 200이 오는지 확인합니다. 외부 브라우저가 열리지 않게 `openWithSlidev.previewIn`을 `vscode`로 둡니다. 이때 함정이 세 가지 있습니다.
  - VS Code 터미널에서 실행하면 `ELECTRON_RUN_AS_NODE`가 설정돼 있어 Node로 뜹니다. `env -u ELECTRON_RUN_AS_NODE`로 실행합니다.
  - 최신 VS Code는 실행 파일이 `Contents/MacOS/Code`라서 `vscodeExecutablePath`를 직접 지정해야 합니다.
  - `--user-data-dir` 경로가 길면 소켓 경로 제한(macOS 104자)에 걸립니다. 짧은 경로를 씁니다.
- 테스트가 끝나면 Slidev 서버가 남아 있지 않은지 확인합니다 (`lsof -iTCP:3030 -sTCP:LISTEN`).
- 테스트에 실패하면 고치고 1~3을 다시 합니다. 실패한 상태로 push하지 않습니다.

### 4. 테스트에 성공하면 push

```sh
git add -A && git commit -m "<type>: <요약>" && git push origin main
```

- 커밋 메시지는 영어 Conventional Commits 형식(`feat:` · `fix:` · `docs:` · `chore:`)을 씁니다.
- **`main`에 push한 커밋 메시지에 `build`가 들어가면 Marketplace 배포가 시작됩니다** (`.github/workflows/build-and-publish.yml`). `rebuild` 같은 단어에도 걸리니, 배포하지 않을 때는 이 글자를 넣지 않습니다.
- 배포는 사용자가 요청할 때만 합니다. 그때 메시지에 `build`와 올림 단위를 함께 씁니다. 예: `feat: themes from slidev-themes (minor build)`. 단위가 없으면 `patch`입니다.
- 확장이 slidev-themes의 새 테마 구조에 기대는 변경이면, **slidev-themes를 먼저 push**한 뒤 확장을 배포합니다.
- 워크플로가 버전을 올려 `chore: release vX.Y.Z [skip ci]` 커밋과 태그를 push합니다. 다음 작업 전에 `git pull`합니다.
- 배포 후 Marketplace에 새 버전이 보이는지 확인합니다. 반영까지 몇 분 걸립니다.
- 저장소 루트에 사용자의 작업 파일(예: `*.nb.md`)이 있을 수 있습니다. 내가 만들지 않은 파일은 커밋하지 않습니다.

## 참고

- 전용 테마 내려받기: `latestThemesSha`(GitHub API로 `main` 최신 커밋) → 다르면 `downloadThemesRepo`(codeload에서 tar.gz를 받아 `tar`로 풀고 `themes/repo`로 바꿔 끼움). 세션마다 한 번 확인하며, 실패해도 캐시가 있으면 그것을 씁니다.
- GitHub API는 인증 없이 IP당 시간당 60회까지입니다. 확인을 실행마다 하지 않고 세션마다 한 번만 하는 이유입니다.
- 전용 테마는 `@slidev/theme-default`의 스타일을 가져오므로 캐시의 `node_modules`에 그 패키지를 함께 둡니다.
