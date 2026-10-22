// Open with Slidev — 우클릭한 md 파일을 Slidev 개발 서버로 띄운다.
// 동작: md 파일 폴더에서 위로 올라가며 Slidev 가 설치된 프로젝트(node_modules/.bin/slidev 또는 package.json 의 @slidev/cli)를 찾고
//       (projectRoot 설정이 있으면 그 폴더), 빈 포트를 골라 그 폴더의 터미널에서 `npx slidev <상대경로> --port N …` 을 실행한다.
//       서버가 응답하면 설정에 따라 외부 브라우저(--open) 또는 VS Code Simple Browser 에 띄우고, 발표자 모드도 열 수 있다.
//       파일마다 터미널 하나를 쓴다. 설정 목록은 package.json 의 contributes.configuration.
const path = require('path')
const fs = require('fs')
const net = require('net')
const http = require('http')

// ---------- vscode 없이도 쓰는 순수 함수 (node 로 테스트 가능) ----------
function hasSlidevDep(dir) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'))
    return Boolean((pkg.dependencies || {})['@slidev/cli'] || (pkg.devDependencies || {})['@slidev/cli'])
  } catch { return false }
}
function isSlidevRoot(dir) { return fs.existsSync(path.join(dir, 'node_modules', '.bin', 'slidev')) || hasSlidevDep(dir) }

/** md 파일 폴더에서 위로 올라가며 Slidev 프로젝트 루트를 찾는다. stopDir(워크스페이스 루트)를 지나면 null. */
function findSlidevRoot(startDir, stopDir) {
  let dir = startDir
  for (;;) {
    if (isSlidevRoot(dir)) return dir
    const parent = path.dirname(dir)
    if (parent === dir || dir === stopDir) return null
    dir = parent
  }
}

/** 간단한 glob → 정규식. `**` 는 폴더 여러 단계, `*` 는 한 이름 안, `?` 는 한 글자. */
function globToRegExp(glob) {
  let re = ''
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i]
    if (c === '*') {
      if (glob[i + 1] === '*') {
        if (glob[i + 2] === '/') { re += '(?:.*/)?'; i += 2 } else { re += '.*'; i += 1 }
      } else re += '[^/]*'
    } else if (c === '?') re += '[^/]'
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&')
  }
  return new RegExp('^' + re + '$')
}
/** 워크스페이스 기준 상대 경로가 패턴 중 하나와 맞는가. 폴더가 없는 패턴(*.nb.md)은 파일 이름만 비교. */
function matchesPatterns(relPath, patterns) {
  const p = relPath.split(path.sep).join('/')
  const base = p.slice(p.lastIndexOf('/') + 1)
  return (patterns || []).some(g => globToRegExp(g).test(g.includes('/') ? p : base))
}

/** md 맨 앞 프런트매터에 theme 키가 있는가. */
function frontmatterHasTheme(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return Boolean(m && /^theme\s*:/m.test(m[1]))
}
/** defaultTheme 설정값 → 폴더가 실제로 있으면 절대 경로, 아니면 테마 이름 그대로. */
function resolveTheme(value, root) {
  const v = (value || '').trim()
  if (!v) return ''
  const abs = path.isAbsolute(v) ? v : path.resolve(root, v)
  return fs.existsSync(abs) ? abs : v
}

/** start 부터 올라가며 비어 있는 포트를 찾는다. */
function findFreePort(start) {
  return new Promise(resolve => {
    const tryPort = p => {
      const s = net.createServer()
      s.once('error', () => tryPort(p + 1))
      s.once('listening', () => s.close(() => resolve(p)))
      s.listen(p, '127.0.0.1')
    }
    tryPort(start)
  })
}
/** 서버가 HTTP 응답을 줄 때까지 기다린다 (0.5초 간격, timeoutMs 까지). */
function waitForServer(url, timeoutMs = 60000) {
  return new Promise(resolve => {
    const t0 = Date.now()
    const tick = () => {
      const req = http.get(url, res => { res.resume(); resolve(true) })
      req.on('error', () => (Date.now() - t0 > timeoutMs ? resolve(false) : setTimeout(tick, 500)))
      req.setTimeout(2000, () => req.destroy())
    }
    tick()
  })
}

// ---------- 익스텐션 ----------
const sessions = new Map()   // 파일 경로 → { terminal, port, url }

function activate(context) {
  const vscode = require('vscode')
  const cfg = () => vscode.workspace.getConfiguration('openWithSlidev')

  // 편집기 우클릭 메뉴 표시 여부: 현재 파일이 filePatterns 에 맞는가 (컨텍스트 키)
  const updateContext = () => {
    const ed = vscode.window.activeTextEditor
    let ok = false
    if (ed && ed.document.uri.scheme === 'file') {
      const ws = vscode.workspace.getWorkspaceFolder(ed.document.uri)?.uri.fsPath
      const rel = ws ? path.relative(ws, ed.document.uri.fsPath) : path.basename(ed.document.uri.fsPath)
      ok = matchesPatterns(rel, cfg().get('filePatterns', ['**/*.md']))
    }
    vscode.commands.executeCommand('setContext', 'openWithSlidev.matches', ok)
  }
  updateContext()
  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateContext))
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => { if (e.affectsConfiguration('openWithSlidev')) updateContext() }))

  const open = async (uri) => {
    const c = cfg()
    const target = uri instanceof vscode.Uri ? uri : vscode.window.activeTextEditor?.document.uri
    if (!target || target.scheme !== 'file' || !/\.md$/i.test(target.fsPath)) {
      vscode.window.showWarningMessage('Open with Slidev: 마크다운(.md) 파일에서 실행하세요.')
      return
    }
    const file = target.fsPath
    const ws = vscode.workspace.getWorkspaceFolder(target)?.uri.fsPath
    const relWs = ws ? path.relative(ws, file) : path.basename(file)
    if (!matchesPatterns(relWs, c.get('filePatterns', ['**/*.md']))) {
      vscode.window.showWarningMessage(`Open with Slidev: 이 파일은 filePatterns 설정(${c.get('filePatterns').join(', ')})에 맞지 않습니다.`)
      return
    }
    const doc = vscode.workspace.textDocuments.find(d => d.uri.fsPath === file)
    if (doc && doc.isDirty) await doc.save()

    // 프로젝트 루트: 설정 > 자동 탐색 > 워크스페이스 > 파일 폴더
    const rootSetting = (c.get('projectRoot') || '').trim()
    const root = rootSetting
      ? path.resolve(ws || path.dirname(file), rootSetting)
      : (findSlidevRoot(path.dirname(file), ws) || ws || path.dirname(file))
    if (!isSlidevRoot(root)) {
      vscode.window.showWarningMessage(`Open with Slidev: ${root} 에 Slidev 가 설치돼 있지 않습니다. npx 가 내려받아 실행을 시도합니다 (projectRoot 설정으로 폴더를 지정할 수 있습니다).`)
    }

    const previewIn = c.get('previewIn', 'browser')
    const existing = sessions.get(file)
    if (existing && existing.terminal.exitStatus === undefined) {
      if (c.get('onRerun', 'focus') === 'restart') {
        existing.terminal.dispose(); sessions.delete(file)
      } else {
        existing.terminal.show(previewIn === 'vscode')
        if (previewIn === 'vscode') await vscode.commands.executeCommand('simpleBrowser.show', existing.url, { viewColumn: vscode.ViewColumn.Beside, preserveFocus: false })
        return
      }
    }

    const port = await findFreePort(Number(c.get('port', 3030)) || 3030)
    const url = `http://localhost:${port}/`
    const rel = path.relative(root, file)
    const command = (c.get('command') || 'npx slidev "${file}"').replace(/\$\{file\}/g, rel).replace(/\$\{root\}/g, root)
    const flags = [`--port ${port}`]
    if (previewIn === 'browser') flags.push('--open')
    const theme = c.get('defaultTheme', '')
    if (theme) {
      let hasTheme = false
      try { hasTheme = frontmatterHasTheme(fs.readFileSync(file, 'utf8')) } catch { /* 읽기 실패면 테마를 넘긴다 */ }
      if (!hasTheme) flags.push(`--theme "${resolveTheme(theme, root)}"`)
    }
    const extra = (c.get('extraArgs') || '').trim()
    if (extra) flags.push(extra)

    const terminal = vscode.window.createTerminal({ name: `Slidev: ${path.basename(file)}`, cwd: root })
    sessions.set(file, { terminal, port, url })
    terminal.show(previewIn === 'vscode')
    terminal.sendText(`${command} ${flags.join(' ')}`)

    const up = await waitForServer(url)
    if (!up) { vscode.window.showWarningMessage(`Open with Slidev: ${url} 이 60초 안에 응답하지 않습니다. 터미널 출력을 확인하세요.`); return }
    if (previewIn === 'vscode') await vscode.commands.executeCommand('simpleBrowser.show', url, { viewColumn: vscode.ViewColumn.Beside, preserveFocus: false })
    if (c.get('openPresenter', false)) vscode.env.openExternal(vscode.Uri.parse(url + 'presenter/'))
  }

  context.subscriptions.push(vscode.commands.registerCommand('openWithSlidev.open', open))
  context.subscriptions.push(vscode.window.onDidCloseTerminal(t => {
    for (const [k, v] of sessions) if (v.terminal === t) sessions.delete(k)
  }))
  context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(doc => {
    if (!cfg().get('stopOnClose', false)) return
    const s = sessions.get(doc.uri.fsPath)
    if (s) { s.terminal.dispose(); sessions.delete(doc.uri.fsPath) }
  }))
}

function deactivate() { for (const s of sessions.values()) s.terminal.dispose(); sessions.clear() }

module.exports = { activate, deactivate, findSlidevRoot, globToRegExp, matchesPatterns, frontmatterHasTheme, resolveTheme, findFreePort }
