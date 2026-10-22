# Open with Slidev

마크다운 편집기 안이나 탐색기의 `.md` 파일에서 **우클릭 → Open with Slidev** 를 누르면, 그 파일을 Slidev 개발 서버로 띄우고 브라우저를 연다. Live Preview 의 "Show Preview" 와 같은 쓰임새.

- 파일 위쪽 폴더에서 Slidev 가 설치된 프로젝트(`node_modules/.bin/slidev`)를 찾아 그 폴더에서 `npx slidev <파일> --open` 을 실행한다.
- 파일마다 터미널 하나(`Slidev: 파일명`)를 쓴다. 다시 누르면 그 터미널을 보여 주고, 서버를 새로 띄우려면 터미널을 닫고 다시 누른다.
- 끝낼 때는 터미널에서 Ctrl+C 또는 터미널 닫기.

## 설치
```bash
npx --yes @vscode/vsce package --allow-missing-repository   # 저장소 루트에서, open-with-slidev-0.1.0.vsix 생성
code --install-extension open-with-slidev-0.1.0.vsix
```
그다음 VS Code 창을 다시 연다(Developer: Reload Window).
