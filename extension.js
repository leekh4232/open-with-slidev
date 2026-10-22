// Open with Slidev — 우클릭한 md 파일을 Slidev 개발 서버로 띄운다.
// 동작: md 파일 폴더에서 위로 올라가며 Slidev 가 설치된 프로젝트(node_modules/.bin/slidev 또는 package.json 의 @slidev/cli)를 찾고
//       (projectRoot 설정이 있으면 그 폴더), 빈 포트를 골라 그 폴더의 터미널에서 `npx slidev <상대경로> --port N …` 을 실행한다.
//       Slidev 가 설치된 곳이 없으면 npx 가 @slidev/cli 와 기본 테마를 내려받아 실행한다 (설치 없이 동작).
//       내장 테마(themes.json): 프런트매터 theme 이름이나 defaultTheme 설정이 목록에 있으면 캐시 폴더에 내려받아 --theme 절대 경로로 넘긴다.
//       서버가 응답하면 설정에 따라 외부 브라우저(--open) 또는 VS Code Simple Browser 에 띄우고, 발표자 모드도 열 수 있다.
//       파일마다 터미널 하나를 쓴다. 설정 목록은 package.json 의 contributes.configuration.
const path = require('path')
const fs = require('fs')
const net = require('net')
const http = require('http')
const { exec } = require('child_process')

// 내장 테마 카탈로그 (themes.json): 공식 갤러리 + 추천. 이름만으로 쓸 수 있고, 처음 쓸 때 캐시 폴더에 npm 으로 내려받는다.
const CATALOG = require('./themes.json')
const BY_ID = new Map(CATALOG.map(t => [t.id, t]))
const BY_PKG = new Map(CATALOG.map(t => [t.pkg, t]))

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
/** md 프런트매터의 theme 값 (없으면 null). */
function frontmatterTheme(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return null
  const t = m[1].match(/^theme\s*:\s*(.+?)\s*$/m)
  return t ? t[1].replace(/^['"]|['"]$/g, '') : null
}
/** 경로처럼 보이는 테마 값인가 (./, ../, /, C:\, ~). */
function isPathLike(v) { return /^(\.{1,2}[\\/]|[\\/]|[A-Za-z]:[\\/]|~)/.test(v) }
/** Slidev 규칙대로 테마 이름 → 패키지 이름 후보. */
function themeCandidates(name) {
  if (name.startsWith('@') || name.startsWith('slidev-theme-')) return [name]
  return [`@slidev/theme-${name}`, `slidev-theme-${name}`]
}
/** 이름(짧은 id, 패키지 이름)으로 카탈로그 항목 찾기. 없으면 null. */
function catalogEntry(name) {
  if (BY_ID.has(name)) return BY_ID.get(name)
  for (const c of themeCandidates(name)) if (BY_PKG.has(c)) return BY_PKG.get(c)
  return null
}
/** startDir 에서 위로 올라가며 node_modules/<pkg> 가 있는지. */
function findLocalPackage(startDir, pkg) {
  let dir = startDir
  for (;;) {
    if (fs.existsSync(path.join(dir, 'node_modules', pkg, 'package.json'))) return path.join(dir, 'node_modules', pkg)
    const parent = path.dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}

// ---------- 테마 캐시 (globalStorage/themes): npm 으로 내려받아 두고 --theme 절대 경로로 넘긴다 ----------
function cacheInit(cacheDir) {
  fs.mkdirSync(cacheDir, { recursive: true })
  const pkg = path.join(cacheDir, 'package.json')
  if (!fs.existsSync(pkg)) fs.writeFileSync(pkg, JSON.stringify({ name: 'open-with-slidev-themes', private: true, description: 'Open with Slidev 익스텐션이 내려받은 Slidev 테마 캐시' }, null, 2))
  fs.writeFileSync(path.join(cacheDir, '.npmrc'), 'legacy-peer-deps=true\naudit=false\nfund=false\n')   // 테마의 peer(@slidev/cli 등)를 끌어오지 않게
}
function cachedThemePath(cacheDir, pkg) {
  const p = path.join(cacheDir, 'node_modules', pkg)
  return fs.existsSync(path.join(p, 'package.json')) ? p : null
}
/** 캐시 폴더에 패키지를 설치한다. vite 는 vite.config 를 가진 테마(neversink 등)가 필요로 해 함께 둔다. */
function npmInstall(cacheDir, pkgs) {
  cacheInit(cacheDir)
  const list = [...new Set([...pkgs, 'vite'])].map(p => `"${p}"`).join(' ')
  return new Promise((resolve, reject) => {
    exec(`npm install --save ${list}`, { cwd: cacheDir, maxBuffer: 16 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) reject(new Error((stderr || stdout || err.message).trim().split('\n').slice(-6).join('\n')))
      else resolve(stdout)
    })
  })
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
const notified = new Set()   // "npx 로 내려받아 실행" 안내를 띄운 루트
const DEFAULT_COMMAND = 'npx slidev "${file}"'
// 프로젝트에 Slidev 가 없을 때: npm 에 "slidev" 패키지는 없으므로 @slidev/cli 와 기본 테마를 이름으로 지정해 받아 실행한다
const FALLBACK_COMMAND = 'npx -y -p @slidev/cli -p @slidev/theme-default slidev "${file}"'

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

  const cacheDir = path.join(context.globalStorageUri.fsPath, 'themes')
  /** 카탈로그 테마를 캐시에 준비하고 그 경로를 돌려준다. 실패하면 null (안내 메시지 표시). */
  const ensureTheme = async (entry) => {
    const have = cachedThemePath(cacheDir, entry.pkg)
    if (have) return have
    try {
      await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: `Slidev 테마 '${entry.name}' 내려받는 중… (처음 한 번)` },
        () => npmInstall(cacheDir, [entry.pkg]))
      return cachedThemePath(cacheDir, entry.pkg)
    } catch (e) {
      vscode.window.showErrorMessage(`Open with Slidev: 테마 '${entry.name}' 설치 실패. 터미널에서 직접: cd "${cacheDir}" && npm install --save ${entry.pkg}\n${e.message}`)
      return null
    }
  }
  context.subscriptions.push(vscode.commands.registerCommand('openWithSlidev.downloadThemes', async () => {
    const picks = await vscode.window.showQuickPick(
      CATALOG.map(t => ({ label: t.name, description: t.id, detail: t.description, picked: Boolean(cachedThemePath(cacheDir, t.pkg)), entry: t })),
      { canPickMany: true, title: '미리 내려받을 Slidev 테마 (이미 받은 것은 체크됨)', placeHolder: '여러 개 선택 가능' })
    if (!picks) return
    const todo = picks.map(p => p.entry).filter(t => !cachedThemePath(cacheDir, t.pkg))
    if (!todo.length) { vscode.window.showInformationMessage('선택한 테마는 모두 이미 내려받았습니다.'); return }
    try {
      await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: `Slidev 테마 ${todo.length}개 내려받는 중…` },
        () => npmInstall(cacheDir, todo.map(t => t.pkg)))
      vscode.window.showInformationMessage(`테마 ${todo.map(t => t.name).join(', ')} 준비 완료 (${cacheDir})`)
    } catch (e) { vscode.window.showErrorMessage(`테마 설치 실패: ${e.message}`) }
  }))
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
    // 프로젝트에 Slidev 가 없으면 npx 로 @slidev/cli 와 기본 테마를 내려받아 실행한다 (처음 한 번만 느리고 이후는 캐시).
    // command 를 직접 바꾼 사용자는 그 명령을 그대로 쓴다 (예: 전역 설치 slidev).
    const localSlidev = isSlidevRoot(root)
    const customCommand = c.get('command') && c.get('command') !== DEFAULT_COMMAND
    if (!localSlidev && !customCommand && !notified.has(root)) {
      notified.add(root)
      vscode.window.showInformationMessage(`Open with Slidev: ${path.basename(root)} 에 Slidev 가 없어 npx 로 내려받아 실행합니다. 첫 실행은 시간이 걸릴 수 있습니다.`)
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
    const template = customCommand ? c.get('command') : (localSlidev ? DEFAULT_COMMAND : FALLBACK_COMMAND)
    const command = template.replace(/\$\{file\}/g, rel).replace(/\$\{root\}/g, root)
    const flags = [`--port ${port}`]
    if (previewIn === 'browser') flags.push('--open')
    // 테마: ① 프런트매터에 이름이 있고 프로젝트에 그 패키지가 없는데 내장 목록에 있으면 캐시에서 ② 프런트매터에 없으면 defaultThemePath > defaultTheme(내장)
    let text = ''
    try { text = fs.readFileSync(file, 'utf8') } catch { /* 읽기 실패: 테마 처리 생략 */ }
    const fm = frontmatterTheme(text)
    let themeArg = ''
    if (fm) {
      if (!isPathLike(fm) && !themeCandidates(fm).some(cand => findLocalPackage(path.dirname(file), cand) || findLocalPackage(root, cand))) {
        const entry = catalogEntry(fm)
        if (entry) themeArg = (await ensureTheme(entry)) || ''
      }
    } else {
      const custom = (c.get('defaultThemePath') || '').trim()
      const sel = c.get('defaultTheme', '')
      if (custom) themeArg = resolveTheme(custom, root)
      else if (sel && BY_ID.has(sel)) themeArg = (await ensureTheme(BY_ID.get(sel))) || ''
    }
    if (themeArg) flags.push(`--theme "${themeArg}"`)
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

module.exports = { activate, deactivate, findSlidevRoot, globToRegExp, matchesPatterns, frontmatterHasTheme, frontmatterTheme, isPathLike, themeCandidates, catalogEntry, findLocalPackage, resolveTheme, findFreePort, cacheInit, cachedThemePath, npmInstall, CATALOG }
