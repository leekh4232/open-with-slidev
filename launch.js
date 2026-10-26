// Open with Slidev — terminal launcher.
// The extension runs `node launch.js <base64url JSON>` in the terminal. This prints a short colored banner
// (file, root, port, theme, preview, the exact command), then runs the Slidev command in the same terminal
// with stdio inherited, so Slidev's own output, colors and keyboard shortcuts work as usual.
// Exits with Slidev's exit code so the extension can tell when the server died before it answered.
const { spawn } = require('child_process')

const info = JSON.parse(Buffer.from(process.argv[2] || '', 'base64url').toString('utf8'))
const color = process.stdout.isTTY && !process.env.NO_COLOR
const c = (code, s) => color ? `\x1b[${code}m${s}\x1b[0m` : s
const dim = s => c('2', s), bold = s => c('1', s), cyan = s => c('36', s), green = s => c('32', s), yellow = s => c('33', s), red = s => c('31', s), magenta = s => c('35', s)
const rule = dim('─'.repeat(48))
const row = (k, v) => console.log(`  ${dim(k.padEnd(8))} ${v}`)

console.log()
console.log(`  ${magenta('◆')} ${bold('Open with Slidev')}`)
console.log(`  ${rule}`)
row('File', cyan(info.file))
row('Root', info.root)
row('Port', `${green(String(info.port))}${info.busy && info.busy.length ? dim(`   (${info.busy.join(', ')} in use)`) : ''}`)
row('Theme', info.theme)
row('Preview', info.preview)
console.log(`  ${rule}`)
console.log(`  ${dim('$')} ${info.command}`)
console.log(`  ${dim(`Waiting for ${info.url} — the preview opens when the server answers.`)}`)
console.log()

process.on('SIGINT', () => { /* Ctrl+C reaches Slidev too; exit with its code below */ })
const child = spawn(info.command, { cwd: info.root, shell: true, stdio: 'inherit' })
child.on('error', e => { console.error(`\n  ${red('✖')} Could not start Slidev: ${e.message}`); process.exit(1) })
child.on('exit', (code, signal) => {
  if (code !== 0) console.log(`\n  ${yellow('■')} Slidev exited ${signal ? `on ${signal}` : `with code ${code}`}.`)
  process.exit(code ?? 1)
})
