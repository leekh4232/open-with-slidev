// Open with Slidev — 우클릭한 md 파일을 Slidev 개발 서버로 띄운다.
// 동작: md 파일 폴더에서 위로 올라가며 Slidev 가 설치된 프로젝트(node_modules/.bin/slidev 또는 package.json 의 @slidev/cli)를 찾고
//       (projectRoot 설정이 있으면 그 폴더), 빈 포트를 골라 그 폴더의 터미널에서 `npx slidev <상대경로> --port N …` 을 실행한다.
//       Slidev 가 설치된 곳이 없으면 처음 한 번 그 프로젝트 루트에 npm 으로 @slidev/cli 와 기본 테마를 devDependencies 로 설치하고(package.json 이 없으면 만든다),
//       그 뒤로는 프로젝트 안의 Slidev 로 바로 띄운다. 설치는 확장이 직접 돌려(시간 제한 없음, 취소 가능) 진행 상황을 알림과 출력 창에 보여 준다.
//       (npx 임시 설치는 윈도우에서 너무 느리고 중간에 깨지기 쉬웠고, 전역 설치는 시작이 느렸다.)
//       내장 테마(themes.json): 프런트매터 theme 이름이나 defaultTheme 설정이 목록에 있으면 캐시 폴더에 npm 으로 내려받아 --theme 절대 경로로 넘긴다.
//       프런트매터 theme 가 경로(./hossam 등)면 손대지 않고 Slidev 가 그대로 읽는다.
//       서버가 응답하면 설정에 따라 외부 브라우저(--open) 또는 VS Code Simple Browser 에 띄우고, 발표자 모드도 열 수 있다.
//       파일마다 터미널 하나를 쓴다. 설정 목록은 package.json 의 contributes.configuration.
const path = require('path')
const fs = require('fs')
const net = require('net')
const http = require('http')
const { exec, spawn } = require('child_process')

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
  // legacy-peer-deps: 테마의 peer(@slidev/cli 등)를 끌어오지 않게. fetch-*: 느린 회선·큰 tarball 에서 끊기지 않게 재시도와 시간을 넉넉히
  fs.writeFileSync(path.join(cacheDir, '.npmrc'), 'legacy-peer-deps=true\naudit=false\nfund=false\nprogress=false\nfetch-retries=5\nfetch-timeout=600000\n')
}
function cachedThemePath(cacheDir, pkg) {
  const p = path.join(cacheDir, 'node_modules', pkg)
  return fs.existsSync(path.join(p, 'package.json')) ? p : null
}
/** 프로젝트에 Slidev 가 없을 때 그 루트에 설치하는 패키지 */
const SLIDEV_PKGS = ['@slidev/cli', '@slidev/theme-default']
/** root 안에 실행할 수 있는 Slidev 가 있는가 (node_modules/.bin/slidev). package.json 에 적혀만 있고 node_modules 가 없으면 false. */
function hasSlidevBin(root) { return fs.existsSync(path.join(root, 'node_modules', '.bin', 'slidev')) }
/** 자식 프로세스와 그 아래(npm → node …)를 모두 끝낸다. */
function killTree(child) {
  if (process.platform === 'win32') exec(`taskkill /pid ${child.pid} /T /F`)
  else { try { process.kill(-child.pid, 'SIGTERM') } catch { child.kill('SIGTERM') } }
}
/** dir 에서 `npm <args>` 를 돌린다. 한 번에 하나씩만(npm 둘이 겹치지 않게). opts.onOutput(line) 으로 출력을 받고, opts.token 이 취소되면 중단한다('cancelled' 로 reject).
 *  시간 제한은 없다: 윈도우 첫 설치는 수 분이 걸릴 수 있다. 실패하면 npm 의 마지막 오류 줄들을 담은 Error 로 reject. */
let installQueue = Promise.resolve()
function runNpm(dir, args, opts = {}) {
  const run = () => new Promise((resolve, reject) => {
    // shell: 윈도우의 npm.cmd 를 찾기 위해. detached(POSIX): 취소할 때 프로세스 그룹째 끝내기 위해
    const child = spawn(`npm ${args}`, { cwd: dir, shell: true, detached: process.platform !== 'win32', windowsHide: true })
    const lines = []
    const take = chunk => { for (const l of chunk.toString().split(/\r?\n/)) if (l.trim()) { lines.push(l); opts.onOutput?.(l) } }
    child.stdout.on('data', take); child.stderr.on('data', take)
    const sub = opts.token?.onCancellationRequested(() => killTree(child))
    child.on('error', e => { sub?.dispose(); reject(new Error(e.message)) })
    child.on('close', code => {
      sub?.dispose()
      if (opts.token?.isCancellationRequested) return reject(new Error('cancelled'))
      if (code === 0) return resolve(lines.join('\n'))
      const errs = lines.filter(l => !/^npm (http|warn|notice)/i.test(l)).slice(-8)
      reject(new Error(errs.join('\n') || `npm 종료 코드 ${code}`))
    })
  })
  const p = installQueue.then(run, run)
  installQueue = p.catch(() => {})
  return p
}
/** 테마 캐시 폴더에 패키지를 설치한다. vite 는 vite.config 를 가진 테마(neversink 등)가 필요로 해 함께 둔다. */
function npmInstall(cacheDir, pkgs, opts = {}) {
  cacheInit(cacheDir)
  const list = [...new Set([...pkgs, 'vite'])].map(p => `"${p}"`).join(' ')
  return runNpm(cacheDir, `install --save --loglevel=http ${list}`, opts)
}
/** 프로젝트 루트에 Slidev 를 설치한다. package.json 에 @slidev/cli 가 이미 적혀 있으면(받아 둔 저장소 등) `npm install` 로 의존성만 받고,
 *  아니면 @slidev/cli 와 기본 테마를 devDependencies 로 더한다. package.json 이 없으면 최소한으로 만든다 (없으면 npm 이 위 폴더의 package.json 을 찾아 거기 설치한다).
 *  git 저장소인데 .gitignore 에 node_modules 가 없으면 한 줄 보탠다. 돌려주는 값: { added: 패키지를 새로 더했는가, gitignore: .gitignore 를 고쳤는가 } */
async function installSlidevLocal(root, opts = {}) {
  const pkgFile = path.join(root, 'package.json')
  if (!fs.existsSync(pkgFile)) {
    const name = path.basename(root).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^[-.]+|[-.]+$/g, '') || 'slides'
    fs.writeFileSync(pkgFile, JSON.stringify({ name, private: true }, null, 2) + '\n')
  }
  const added = !hasSlidevDep(root)
  const common = '--no-audit --no-fund --loglevel=http'
  await runNpm(root, added ? `install --save-dev ${common} ${SLIDEV_PKGS.map(p => `"${p}"`).join(' ')}` : `install ${common}`, opts)
  let gitignore = false
  if (fs.existsSync(path.join(root, '.git'))) {
    const gi = path.join(root, '.gitignore')
    const cur = fs.existsSync(gi) ? fs.readFileSync(gi, 'utf8') : ''
    if (!/^\/?node_modules\/?\s*$/m.test(cur)) { fs.writeFileSync(gi, cur + (cur && !cur.endsWith('\n') ? '\n' : '') + 'node_modules/\n'); gitignore = true }
  }
  return { added, gitignore }
}

/** defaultTheme 설정값 → 폴더가 실제로 있으면 절대 경로, 아니면 테마 이름 그대로. */
function resolveTheme(value, root) {
  const v = (value || '').trim()
  if (!v) return ''
  const abs = path.isAbsolute(v) ? v : path.resolve(root, v)
  return fs.existsSync(abs) ? abs : v
}

/** host 에서 port 를 열 수 있는가. 이미 쓰는 중(EADDRINUSE)일 때만 false — IPv6 가 없는 환경의 ::1 오류 등은 비어 있는 것으로 본다. */
function portFree(port, host) {
  return new Promise(resolve => {
    const s = net.createServer()
    s.once('error', e => resolve(e.code !== 'EADDRINUSE'))
    s.once('listening', () => s.close(() => resolve(true)))
    s.listen(port, host)
  })
}
/** start 부터 1씩 올리며 비어 있는 포트를 찾는다 (최대 tries 회). { port, busy: [사용 중이던 포트…] }, 다 막혀 있으면 port 는 null.
 *  Slidev(Vite) 는 localhost 를 IPv6 [::1] 에 묶는 일이 많아(macOS·Node 17+), 127.0.0.1 과 ::1 둘 다 비어 있어야 빈 포트로 친다. */
async function findFreePort(start, tries = 3) {
  const busy = []
  for (let p = start; p < start + tries; p++) {
    if (await portFree(p, '127.0.0.1') && await portFree(p, '::1')) return { port: p, busy }
    busy.push(p)
  }
  return { port: null, busy }
}
/** 서버가 HTTP 응답을 줄 때까지 기다린다 (0.5초 간격, timeoutMs 까지). isCancelled() 가 true 가 되면 'cancelled'. */
function waitForServer(url, timeoutMs = 300000, isCancelled = () => false) {
  return new Promise(resolve => {
    const t0 = Date.now()
    const tick = () => {
      if (isCancelled()) return resolve('cancelled')
      const req = http.get(url, res => { res.resume(); resolve(true) })
      req.on('error', () => (Date.now() - t0 > timeoutMs ? resolve(false) : setTimeout(tick, 500)))
      req.setTimeout(2000, () => req.destroy())
    }
    tick()
  })
}

// ---------- 익스텐션 ----------
const sessions = new Map()   // 파일 경로 → { terminal, port, url }
const starting = new Set()   // 아직 시작하는 중인 파일 경로 (Slidev 내려받기 ~ 서버 응답 전). 그동안 같은 파일을 다시 열면 새로 띄우지 않는다
const notified = new Set()   // "Slidev 를 설치합니다" 안내를 띄운 루트
const DEFAULT_COMMAND = 'npx slidev "${file}"'

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

  // 확장 자동 업데이트(VS Code 설정 extensions.autoUpdate, 기본 켜짐)가 꺼져 있으면 처음 한 번만 켜기를 권한다.
  // 확장이 매니페스트로 정할 수 있는 값이 아니라 사용자가 버튼을 눌렀을 때만 설정을 바꾼다. 'onlyEnabledExtensions' 는 이 확장이 켜져 있으면 갱신되므로 그대로 둔다.
  const askedKey = 'autoUpdateAsked'
  const autoUpdate = vscode.workspace.getConfiguration('extensions').get('autoUpdate')
  if (!context.globalState.get(askedKey) && (autoUpdate === false || autoUpdate === 'onlySelectedExtensions')) {
    context.globalState.update(askedKey, true)
    vscode.window.showInformationMessage('Open with Slidev: 확장 자동 업데이트가 꺼져 있습니다. 켜면 새 버전이 나올 때 자동으로 설치됩니다.', '켜기', '그대로 두기').then(pick => {
      if (pick === '켜기') vscode.workspace.getConfiguration('extensions').update('autoUpdate', true, vscode.ConfigurationTarget.Global)
    })
  }

  const cacheDir = path.join(context.globalStorageUri.fsPath, 'themes')    // 내장 테마 캐시
  const launcher = path.join(context.extensionPath, 'launch.js')            // 터미널 실행기 (배너 출력 + Slidev 실행)
  const out = vscode.window.createOutputChannel('Open with Slidev')   // npm 설치 출력
  context.subscriptions.push(out)
  /** npm 설치를 돌리며 경과 시간과 받은 패키지 수를 알림에, npm 출력을 출력 창에 보여 준다. run(opts) 가 실제 설치. 취소하면 'cancelled' 로 던진다. */
  const withInstallProgress = (what, manual, run) => {
    out.show(true)
    out.appendLine(`[Open with Slidev] ${what} 내려받기 (직접 하려면: ${manual})`)
    return vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: 'Open with Slidev', cancellable: true }, (progress, token) => {
      const t0 = Date.now(); let fetched = 0
      const tick = () => progress.report({ message: `${what} 내려받는 중 (처음 한 번, 수 분 걸릴 수 있음) · ${Math.round((Date.now() - t0) / 1000)}초 · 패키지 ${fetched}개` })
      tick(); const timer = setInterval(tick, 1000)
      const onOutput = l => { out.appendLine(l); if (/^npm http (fetch|cache) .*\.tgz/.test(l)) fetched++ }   // tarball 하나 = 패키지 하나 (내려받음·캐시 모두)
      return run({ token, onOutput }).finally(() => clearInterval(timer))
    })
  }
  const installWithProgress = (what, pkgs) => withInstallProgress(what, `cd "${cacheDir}" && npm install --save ${pkgs.join(' ')}`, opts => npmInstall(cacheDir, pkgs, opts))
  /** 프로젝트 루트에 실행할 수 있는 Slidev 를 준비한다 (없으면 설치). 성공하면 true, 실패·취소하면 false (안내 표시).
   *  같은 루트의 파일 여럿을 연달아 열어도 설치는 한 번만 돌고 모두 그 결과를 기다린다. */
  const slidevInstalls = new Map()   // root → 진행 중인 설치 Promise
  const ensureSlidevLocal = (root) => {
    if (hasSlidevBin(root)) return Promise.resolve(true)
    if (slidevInstalls.has(root)) return slidevInstalls.get(root)
    const manual = `cd "${root}" && npm install --save-dev ${SLIDEV_PKGS.join(' ')}`
    const p = (async () => {
      for (;;) {
        let r
        try {
          r = await withInstallProgress(`Slidev (${path.basename(root)} 에 설치)`, manual, opts => installSlidevLocal(root, opts))
        } catch (e) {
          if (e.message === 'cancelled') { out.appendLine('[Open with Slidev] 설치를 취소했습니다. 다시 열면 이어서 받습니다.'); return false }
          out.appendLine(`[Open with Slidev] 설치 실패: ${e.message}`)
          const pick = await vscode.window.showErrorMessage(`Open with Slidev: Slidev 설치 실패. 출력 창을 확인하세요. 터미널에서 직접: ${manual}`, '다시 시도')
          if (pick !== '다시 시도') return false
          continue   // npm 은 받다 만 node_modules 를 이어서 고친다
        }
        if (!hasSlidevBin(root)) { vscode.window.showErrorMessage(`Open with Slidev: 설치는 끝났지만 ${root} 에서 node_modules/.bin/slidev 를 찾지 못했습니다. 터미널에서 직접: ${manual}`); return false }
        vscode.window.showInformationMessage(`Open with Slidev: ${path.basename(root)} 에 Slidev 를 설치했습니다 (package.json devDependencies, node_modules).${r.gitignore ? ' .gitignore 에 node_modules/ 를 추가했습니다.' : ''} 다음부터는 바로 뜹니다.`)
        return true
      }
    })().finally(() => slidevInstalls.delete(root))
    slidevInstalls.set(root, p)
    return p
  }
  /** 카탈로그 테마를 캐시에 준비하고 그 경로를 돌려준다. 실패·취소하면 null (안내 메시지 표시). */
  const ensureTheme = async (entry) => {
    const have = cachedThemePath(cacheDir, entry.pkg)
    if (have) return have
    try {
      await installWithProgress(`테마 '${entry.name}'`, [entry.pkg])
      return cachedThemePath(cacheDir, entry.pkg)
    } catch (e) {
      if (e.message === 'cancelled') return null
      out.appendLine(`[Open with Slidev] 설치 실패: ${e.message}`)
      vscode.window.showErrorMessage(`Open with Slidev: 테마 '${entry.name}' 설치 실패. 출력 창을 확인하세요. 터미널에서 직접: cd "${cacheDir}" && npm install --save ${entry.pkg}`)
      return null
    }
  }
  context.subscriptions.push(vscode.commands.registerCommand('openWithSlidev.downloadThemes', async () => {
    const picks = await vscode.window.showQuickPick(
      CATALOG.map(t => ({ label: t.name, description: t.id, detail: t.description, picked: Boolean(cachedThemePath(cacheDir, t.pkg)), entry: t })),
      { canPickMany: true, title: '미리 내려받을 Slidev 테마 (이미 받은 것은 체크됨)', placeHolder: '여러 개 선택 가능' })
    if (!picks) return
    // 아직 받지 않은 것만 받는다.
    const todo = picks.map(p => p.entry).filter(t => !cachedThemePath(cacheDir, t.pkg))
    if (!todo.length) { vscode.window.showInformationMessage('선택한 테마는 모두 이미 내려받았습니다.'); return }
    try {
      await installWithProgress(`테마 ${todo.length}개`, todo.map(t => t.pkg))
      vscode.window.showInformationMessage(`테마 ${todo.map(t => t.name).join(', ')} 준비 완료 (${cacheDir})`)
    } catch (e) {
      if (e.message === 'cancelled') return
      out.appendLine(`[Open with Slidev] 설치 실패: ${e.message}`)
      vscode.window.showErrorMessage(`테마 설치 실패. 출력 창을 확인하세요. 터미널에서 직접: cd "${cacheDir}" && npm install --save ${todo.map(t => t.pkg).join(' ')}`)
    }
  }))
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => { if (e.affectsConfiguration('openWithSlidev')) updateContext() }))

  /** 명령 팔레트에서 md 편집기 없이 실행했을 때: 워크스페이스의 md 파일(filePatterns 에 맞는 것) 중에서 고른다. 없거나 취소하면 null. */
  const pickMarkdown = async () => {
    const patterns = cfg().get('filePatterns', ['**/*.md'])
    const found = await vscode.workspace.findFiles('**/*.md', '**/node_modules/**', 2000)
    const items = found
      .map(u => { const ws = vscode.workspace.getWorkspaceFolder(u)?.uri.fsPath; return { uri: u, rel: ws ? path.relative(ws, u.fsPath) : path.basename(u.fsPath) } })
      .filter(i => matchesPatterns(i.rel, patterns))
      .sort((a, b) => a.rel.localeCompare(b.rel))
      .map(i => ({ label: path.basename(i.rel), description: path.dirname(i.rel) === '.' ? '' : path.dirname(i.rel), uri: i.uri }))
    if (!items.length) {
      vscode.window.showWarningMessage(found.length
        ? `Open with Slidev: filePatterns 설정(${patterns.join(', ')})에 맞는 md 파일이 워크스페이스에 없습니다.`
        : 'Open with Slidev: 마크다운(.md) 파일을 열고 실행하거나, md 파일이 있는 폴더를 여세요.')
      return null
    }
    const pick = await vscode.window.showQuickPick(items, { title: 'Slidev 로 열 마크다운 파일', placeHolder: '파일 이름이나 폴더로 검색', matchOnDescription: true })
    return pick ? pick.uri : null
  }

  /** 실행 대상 md 파일과 프로젝트 루트를 정한다 (Open · Build 공통). 대상이 아니거나 취소하면 null. */
  const prepare = async (uri) => {
    const c = cfg()
    const isMd = u => u && u.scheme === 'file' && /\.md$/i.test(u.fsPath)
    let target = uri instanceof vscode.Uri ? uri : vscode.window.activeTextEditor?.document.uri
    if (!isMd(target)) {
      if (uri instanceof vscode.Uri) { vscode.window.showWarningMessage('Open with Slidev: 마크다운(.md) 파일에서 실행하세요.'); return }
      target = await pickMarkdown()
      if (!target) return
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
    // 프로젝트에 Slidev 가 없으면 처음 한 번 루트에 설치한 뒤 그것으로 띄운다 (launch 에서). command 를 직접 바꾼 사용자는 그 명령을 그대로 쓴다 (예: pnpm exec slidev).
    const customCommand = c.get('command') && c.get('command') !== DEFAULT_COMMAND
    if (!customCommand && !hasSlidevBin(root) && !notified.has(root)) {
      notified.add(root)
      vscode.window.showInformationMessage(`Open with Slidev: ${path.basename(root)} 에 Slidev 가 없어 그 폴더에 설치합니다 (처음 한 번, 수 분 걸릴 수 있음). 진행 상황은 알림과 출력 창에 보입니다.`)
    }
    return { file, root, customCommand }
  }

  const open = async (uri) => {
    const t = await prepare(uri)
    if (!t) return
    const { file, root, customCommand } = t
    const previewIn = cfg().get('previewIn', 'browser')
    // 같은 파일을 아직 시작하는 중이면(Slidev 내려받기, 서버 대기) 새로 띄우지 않고 터미널만 보여 준다 — 다시 클릭할 때마다 처음부터 시작하거나 둘이 겹치지 않게.
    if (starting.has(file)) {
      sessions.get(file)?.terminal.show(previewIn === 'vscode')
      vscode.window.showInformationMessage(`Open with Slidev: ${path.basename(file)} 를 아직 시작하는 중입니다. 기다리거나 알림에서 취소하세요.`)
      return
    }
    starting.add(file)
    try { await launch(file, root, previewIn, customCommand) } finally { starting.delete(file) }
  }

  /** 테마: ① 프런트매터에 이름이 있고 프로젝트에 그 패키지가 없는데 내장 목록에 있으면 캐시에서 ② 프런트매터에 없으면 defaultThemePath > defaultTheme(내장).
   *  { fm: 프런트매터 theme, themeArg: --theme 로 넘길 값, themeMissing: 프로젝트에도 내장 목록에도 없는 프런트매터 테마 이름 } */
  const themeFor = async (file, root) => {
    const c = cfg()
    let text = ''
    try { text = fs.readFileSync(file, 'utf8') } catch { /* 읽기 실패: 테마 처리 생략 */ }
    const fm = frontmatterTheme(text)
    let themeArg = ''
    let themeMissing = ''   // Slidev 가 npm 설치를 묻고, 패키지가 없으면 실패한다
    if (fm) {
      if (!isPathLike(fm) && !themeCandidates(fm).some(cand => findLocalPackage(path.dirname(file), cand) || findLocalPackage(root, cand))) {
        const entry = catalogEntry(fm)
        if (entry) themeArg = (await ensureTheme(entry)) || ''
        else themeMissing = fm
      }
    } else {
      const custom = (c.get('defaultThemePath') || '').trim()
      const sel = c.get('defaultTheme', '')
      if (custom) themeArg = resolveTheme(custom, root)
      else if (sel && BY_ID.has(sel)) themeArg = (await ensureTheme(BY_ID.get(sel))) || ''
    }
    return { fm, themeArg, themeMissing }
  }

  /** 파일 하나를 Slidev 로 띄운다 (open 에서 검사가 끝난 뒤). */
  const launch = async (file, root, previewIn, customCommand) => {
    const c = cfg()
    // 프로젝트의 Slidev 준비 (없으면 설치: 시간 제한 없음, 알림에서 취소 가능)
    if (!customCommand && !(await ensureSlidevLocal(root))) return
    const existing = sessions.get(file)
    if (existing && existing.terminal.exitStatus === undefined) {
      // 서버가 실제로 응답하는지 먼저 확인한다. 응답하면(살아 있음) 그 터미널·탭을 보여 주고,
      // 죽어 있으면(이전 실행이 실패해 셸만 남은 경우) 그 터미널을 닫고 아래에서 새로 띄운다 — 재실행이 막히지 않게.
      const alive = (await waitForServer(existing.url, 1500)) === true
      if (alive && c.get('onRerun', 'focus') !== 'restart') {
        existing.terminal.show(previewIn === 'vscode')
        if (previewIn === 'vscode') await vscode.commands.executeCommand('simpleBrowser.show', existing.url, { viewColumn: vscode.ViewColumn.Beside, preserveFocus: false })
        return
      }
      existing.terminal.dispose(); sessions.delete(file)
    }

    const startPort = Number(c.get('port', 3030)) || 3030
    const { port, busy } = await findFreePort(startPort, 3)        // 사용 중이면 +1, 최대 3회
    if (!port) {
      vscode.window.showErrorMessage(`Open with Slidev: 포트 ${startPort}~${startPort + 2} 가 모두 사용 중입니다. 다른 Slidev 터미널을 닫거나 openWithSlidev.port 를 바꾸세요.`)
      return
    }
    const url = `http://localhost:${port}/`
    const rel = path.relative(root, file)
    const template = customCommand ? c.get('command') : DEFAULT_COMMAND
    const command = template.replace(/\$\{file\}/g, rel).replace(/\$\{root\}/g, root)
    const flags = [`--port ${port}`]
    if (previewIn === 'browser') flags.push('--open')
    const { fm, themeArg, themeMissing } = await themeFor(file, root)
    if (themeArg) flags.push(`--theme "${themeArg}"`)
    // 터미널 배너에 보여 줄 테마 설명
    const themeLabel = fm
      ? (themeArg ? `${fm}  ${'(built-in, cached)'}` : isPathLike(fm) ? `${fm}  (folder, from frontmatter)` : `${fm}  (from frontmatter)`)
      : themeArg ? `${themeArg}  (from settings)` : 'default'
    const extra = (c.get('extraArgs') || '').trim()
    if (extra) flags.push(extra)
    // hossam(옛 jussam 포함)은 npm 에 없는 테마라 저장소를 받아 경로로 적어야 한다
    const pathHint = /^(hossam|jussam)$/.test(themeMissing)
      ? ` hossam 테마는 github.com/leekh4232/slidev-themes 를 받은 뒤 theme: ./slidev-themes/hossam 처럼 경로로 적으세요.`
      : ' 내장 테마 이름(seriph, terminal …)을 쓰면 바로 됩니다.'
    if (themeMissing && !notified.has(`theme:${themeMissing}`)) {
      notified.add(`theme:${themeMissing}`)
      vscode.window.showWarningMessage(`Open with Slidev: 프런트매터의 theme '${themeMissing}' 가 프로젝트에 설치돼 있지 않고 내장 목록에도 없습니다. Slidev 가 터미널에서 npm 설치 여부를 묻고, npm 에 그 패키지가 없으면 실패합니다.${pathHint}`)
    }

    const terminal = vscode.window.createTerminal({ name: `Slidev: ${path.basename(file)}`, cwd: root })
    sessions.set(file, { terminal, port, url })
    terminal.show(previewIn === 'vscode')
    // 터미널에는 실행기(launch.js) 한 줄만 보낸다. 실행기가 색이 입혀진 영어 배너(파일·루트·포트·테마·명령)를 찍고 같은 터미널에서 Slidev 명령을 돌린다.
    // 인자는 base64url JSON 이라 셸(bash·zsh·PowerShell·cmd)마다 다른 따옴표 규칙을 타지 않는다. 서버가 뜬 뒤에는 아무것도 보내지 않는다 (Slidev 가 키 입력을 단축키로 받는다).
    const full = `${command} ${flags.join(' ')}`
    const info = { file: rel, root, port, busy, url, theme: themeLabel, preview: previewIn === 'browser' ? 'browser (--open)' : 'VS Code Simple Browser', command: full }
    const token = Buffer.from(JSON.stringify(info), 'utf8').toString('base64url')
    // 서버가 뜨기 전에 명령이 끝나면(테마 설치 실패, 문법 오류 …) 5분을 기다리지 않고 바로 알린다. 실행기는 Slidev 의 종료 코드를 그대로 돌려준다.
    // 셸 통합이 켜진 터미널에서만 감지되고(VS Code 1.93+), 아니면 아래 대기 시간 초과로 넘어간다.
    let ended = null   // { exitCode }
    const endSub = vscode.window.onDidEndTerminalShellExecution?.(e => { if (e.terminal === terminal && !ended) ended = { exitCode: e.exitCode } })
    terminal.sendText(`node "${launcher}" ${token}`)

    // 로딩 알림: 경과 시간을 1초마다 갱신하고, 취소하면 터미널을 닫는다
    const up = await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: 'Open with Slidev', cancellable: true },
      (progress, token) => {
        const t0 = Date.now()
        const tickMsg = () => progress.report({ message: `Slidev 서버 시작 중 · 포트 ${port} · ${Math.round((Date.now() - t0) / 1000)}초` })
        tickMsg(); const timer = setInterval(tickMsg, 1000)
        return waitForServer(url, 300000, () => token.isCancellationRequested || ended !== null).finally(() => clearInterval(timer))
      })
    endSub?.dispose()
    if (ended) {   // 터미널은 오류 출력을 볼 수 있게 남겨 둔다
      sessions.delete(file)
      const hint = themeMissing
        ? ` 프런트매터의 theme '${themeMissing}' 를 npm 에서 찾지 못해 실패했을 수 있습니다.${pathHint}`
        : ''
      vscode.window.showErrorMessage(`Open with Slidev: Slidev 가 서버를 띄우지 못하고 종료됐습니다(종료 코드 ${ended.exitCode ?? '알 수 없음'}). 터미널 출력을 확인하세요.${hint}`)
      return
    }
    if (up === 'cancelled') { terminal.dispose(); sessions.delete(file); return }
    if (!up) { vscode.window.showWarningMessage(`Open with Slidev: ${url} 이 5분 안에 응답하지 않습니다. 터미널 출력을 확인하세요.`); return }
    if (previewIn === 'vscode') await vscode.commands.executeCommand('simpleBrowser.show', url, { viewColumn: vscode.ViewColumn.Beside, preserveFocus: false })
    if (c.get('openPresenter', false)) vscode.env.openExternal(vscode.Uri.parse(url + 'presenter/'))
  }

  /** md 옆에 같은 이름의 .html 한 파일로 빌드한다 (build.js: JS·CSS·이미지를 모두 넣고 해시 라우팅이라 더블클릭으로 열린다).
   *  터미널 대신 자식 프로세스로 돌려 끝난 것을 알고, 출력은 출력 창에, 경과 시간은 알림에 보여 준다. */
  const builder = path.join(context.extensionPath, 'build.js')
  const building = new Set()   // 빌드 중인 파일 경로
  const buildHtml = async (uri) => {
    const t = await prepare(uri)
    if (!t) return
    const { file, root } = t
    if (building.has(file)) { vscode.window.showInformationMessage(`Build with Slidev: ${path.basename(file)} 를 아직 빌드하는 중입니다.`); return }
    const outFile = file.replace(/\.md$/i, '.html')
    // 같은 이름의 html 이 Slidev 로 만든 것이 아니면 덮어쓰기 전에 묻는다
    if (fs.existsSync(outFile) && !fs.readFileSync(outFile, 'utf8').slice(0, 4000).includes('property="slidev:version"')) {
      const pick = await vscode.window.showWarningMessage(`${path.basename(outFile)} 가 이미 있습니다. Slidev 로 만든 파일이 아닌데 덮어쓸까요?`, { modal: true }, '덮어쓰기')
      if (pick !== '덮어쓰기') return
    }
    building.add(file)
    try {
      if (!(await ensureSlidevLocal(root))) return
      const { themeArg } = await themeFor(file, root)
      const token = Buffer.from(JSON.stringify({ entry: file, root, out: outFile, theme: themeArg }), 'utf8').toString('base64url')
      out.show(true)
      out.appendLine(`[Build with Slidev] ${file} → ${outFile}`)
      const skipped = []
      const result = await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: 'Build with Slidev', cancellable: true }, (progress, ctoken) => new Promise(resolve => {
        const t0 = Date.now()
        const tick = () => progress.report({ message: `${path.basename(file)} 빌드 중 · ${Math.round((Date.now() - t0) / 1000)}초` })
        tick(); const timer = setInterval(tick, 1000)
        // shell: 윈도우에서도 PATH 의 node 를 찾기 위해. detached(POSIX): 취소할 때 프로세스 그룹째 끝내기 위해
        const child = spawn(`node "${builder}" ${token}`, { cwd: root, shell: true, detached: process.platform !== 'win32', windowsHide: true })
        const take = chunk => { for (const l of chunk.toString().split(/\r?\n/)) if (l.trim()) { out.appendLine(l); if (l.startsWith('SKIPPED ')) skipped.push(l.slice(8)) } }
        child.stdout.on('data', take); child.stderr.on('data', take)
        const sub = ctoken.onCancellationRequested(() => killTree(child))
        const done = r => { clearInterval(timer); sub.dispose(); resolve(r) }
        child.on('error', e => { out.appendLine(e.message); done(false) })
        child.on('close', code => done(ctoken.isCancellationRequested ? 'cancelled' : code === 0))
      }))
      if (result === 'cancelled') return
      if (!result) { vscode.window.showErrorMessage('Build with Slidev: 빌드에 실패했습니다. 출력 창 Open with Slidev 를 확인하세요.'); return }
      const note = skipped.length ? ` public 폴더 파일 ${skipped.length}개는 넣지 못했습니다(출력 창의 SKIPPED).` : ''
      const pick = await vscode.window.showInformationMessage(`Build with Slidev: ${path.basename(outFile)} 를 만들었습니다. 이 파일 하나만 있으면 더블클릭으로 열립니다.${note}`, '브라우저로 열기', '폴더에서 보기')
      if (pick === '브라우저로 열기') vscode.env.openExternal(vscode.Uri.file(outFile))
      else if (pick === '폴더에서 보기') vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(outFile))
    } finally { building.delete(file) }
  }

  context.subscriptions.push(vscode.commands.registerCommand('openWithSlidev.open', open))
  context.subscriptions.push(vscode.commands.registerCommand('openWithSlidev.build', buildHtml))
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

module.exports = { activate, deactivate, findSlidevRoot, globToRegExp, matchesPatterns, frontmatterHasTheme, frontmatterTheme, isPathLike, themeCandidates, catalogEntry, findLocalPackage, resolveTheme, findFreePort, waitForServer, cacheInit, cachedThemePath, hasSlidevBin, runNpm, npmInstall, installSlidevLocal, SLIDEV_PKGS, CATALOG }
