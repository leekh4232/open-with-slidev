# Open with Slidev

마크다운 편집기 안이나 탐색기의 `.md` 파일에서 **우클릭 → Open with Slidev** 를 누르면, 그 파일을 Slidev 개발 서버로 띄우고 브라우저를 연다. Live Preview 의 "Show Preview" 와 같은 쓰임새.

- 파일 위쪽 폴더에서 Slidev 가 설치된 프로젝트(`node_modules/.bin/slidev`)를 찾아 그 폴더에서 `npx slidev <파일> --open` 을 실행한다.
- 파일마다 터미널 하나(`Slidev: 파일명`)를 쓴다. 다시 누르면 그 터미널을 보여 주고, 서버를 새로 띄우려면 터미널을 닫고 다시 누른다.
- 끝낼 때는 터미널에서 Ctrl+C 또는 터미널 닫기.

## 설정 (Settings → "Open with Slidev")
| 설정 | 기본값 | 뜻 |
|---|---|---|
| `openWithSlidev.previewIn` | `browser` | `browser` = 외부 브라우저(`--open`), `vscode` = VS Code 안 Simple Browser 탭을 편집기 옆에 |
| `openWithSlidev.command` | `npx slidev "${file}"` | 실행 명령. `${file}` = 프로젝트 루트 기준 md 상대 경로, `${root}` = 프로젝트 루트. 포트·`--open`·테마·extraArgs 는 뒤에 자동으로 붙는다 |
| `openWithSlidev.extraArgs` | (없음) | 명령 끝에 덧붙일 인자. 예: `--remote`, `--log info` |
| `openWithSlidev.onRerun` | `focus` | 같은 파일을 다시 열 때 `focus` = 기존 터미널 표시, `restart` = 서버를 끄고 다시 띄움 |
| `openWithSlidev.port` | `3030` | 시작 포트. 사용 중이면 다음 번호를 자동으로 찾는다 |
| `openWithSlidev.projectRoot` | (자동) | Slidev 가 설치된 폴더. 비우면 md 위쪽으로 자동 탐색. 절대 경로 또는 워크스페이스 기준 상대 경로 |
| `openWithSlidev.defaultTheme` | (없음) | md 프런트매터에 `theme` 가 없을 때 쓸 테마. 폴더 경로(절대 또는 프로젝트 루트 기준) 또는 테마 이름. 프런트매터의 `theme` 가 우선 |
| `openWithSlidev.openPresenter` | `false` | 발표자 모드(`/presenter`)도 외부 브라우저로 함께 연다 |
| `openWithSlidev.filePatterns` | `["**/*.md"]` | 편집기 우클릭 메뉴를 보일 파일(glob). 탐색기 메뉴는 `.md` 전체에 보이되 실행 시 검사한다 |
| `openWithSlidev.stopOnClose` | `false` | md 편집기를 닫으면 그 파일의 서버(터미널)도 끈다 |

## 설치
```bash
npx --yes @vscode/vsce package --allow-missing-repository   # 저장소 루트에서, open-with-slidev-0.1.0.vsix 생성
code --install-extension open-with-slidev-0.1.0.vsix
```
그다음 VS Code 창을 다시 연다(Developer: Reload Window).

## 배포
main 에 push 한 커밋 메시지에 `build` 가 들어 있으면 GitHub Actions 가 버전을 올려(메시지에 `major`/`minor` 가 있으면 그 단위, 아니면 patch) VSIX 를 만들고, `VSCE_PAT` 시크릿으로 VS Code Marketplace 에 publish 한 뒤 v태그와 Release 를 만든다.
