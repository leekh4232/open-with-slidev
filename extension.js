// Open with Slidev — 우클릭한 md 파일을 Slidev 개발 서버로 띄운다.
// 동작: md 파일이 있는 폴더에서 위로 올라가며 Slidev 가 설치된 프로젝트(node_modules/.bin/slidev 또는 package.json 의 @slidev/cli)를 찾고,
//       그 폴더를 작업 폴더로 하는 터미널에서 `npx slidev <상대경로> --open` 을 실행한다. 파일마다 터미널 하나를 재사용한다.
const path = require('path')
const fs = require('fs')

function hasSlidevDep(dir) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'))
    return Boolean((pkg.dependencies || {})['@slidev/cli'] || (pkg.devDependencies || {})['@slidev/cli'])
  } catch { return false }
}

/** md 파일 폴더에서 위로 올라가며 Slidev 프로젝트 루트를 찾는다. stopDir(워크스페이스 루트)를 지나면 null. */
function findSlidevRoot(startDir, stopDir) {
  let dir = startDir
  for (;;) {
    if (fs.existsSync(path.join(dir, 'node_modules', '.bin', 'slidev')) || hasSlidevDep(dir)) return dir
    const parent = path.dirname(dir)
    if (parent === dir || dir === stopDir) return null
    dir = parent
  }
}

const terminals = new Map()   // 파일 경로 → 터미널

function activate(context) {
  const vscode = require('vscode')

  const open = async (uri) => {
    const target = uri instanceof vscode.Uri ? uri : vscode.window.activeTextEditor?.document.uri
    if (!target || target.scheme !== 'file' || !/\.md$/i.test(target.fsPath)) {
      vscode.window.showWarningMessage('Open with Slidev: 마크다운(.md) 파일에서 실행하세요.')
      return
    }
    const file = target.fsPath
    const doc = vscode.workspace.textDocuments.find(d => d.uri.fsPath === file)
    if (doc && doc.isDirty) await doc.save()

    const ws = vscode.workspace.getWorkspaceFolder(target)?.uri.fsPath
    const root = findSlidevRoot(path.dirname(file), ws) || ws || path.dirname(file)
    if (!fs.existsSync(path.join(root, 'node_modules', '.bin', 'slidev')) && !hasSlidevDep(root)) {
      vscode.window.showWarningMessage(`Open with Slidev: 이 파일 위쪽에서 Slidev 가 설치된 폴더를 찾지 못했습니다. ${root} 에서 npx 가 Slidev 를 내려받아 실행합니다.`)
    }
    const rel = path.relative(root, file)

    const existing = terminals.get(file)
    if (existing && existing.exitStatus === undefined) {   // 이미 띄운 서버가 있으면 그 터미널을 보여 준다 (다시 띄우려면 터미널을 닫고 실행)
      existing.show()
      return
    }
    const terminal = vscode.window.createTerminal({ name: `Slidev: ${path.basename(file)}`, cwd: root })
    terminals.set(file, terminal)
    terminal.show()
    terminal.sendText(`npx slidev "${rel}" --open`)
  }

  context.subscriptions.push(vscode.commands.registerCommand('openWithSlidev.open', open))
  context.subscriptions.push(vscode.window.onDidCloseTerminal(t => {
    for (const [k, v] of terminals) if (v === t) terminals.delete(k)
  }))
}

function deactivate() {}

module.exports = { activate, deactivate, findSlidevRoot }
