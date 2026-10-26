// Build with Slidev — single-file HTML builder.
// The extension runs `node build.js <base64url JSON>` with cwd = project root. It loads the project's own @slidev/cli,
// builds the deck with hash routing, no code splitting and every asset inlined, then moves the JS and CSS into index.html
// and copies that one file to info.out. The result opens by double-click (file://), no server needed.
// Exits 0 on success, 1 on failure. Prints "SKIPPED <file>" lines for build outputs that could not be inlined (public/ files).
const path = require('path')
const fs = require('fs')
const os = require('os')
const { createRequire } = require('module')
const { pathToFileURL } = require('url')

const info = JSON.parse(Buffer.from(process.argv[2] || '', 'base64url').toString('utf8'))

/** Vite plugin: one JS chunk and one CSS file, inlined into index.html. */
const singleFile = {
  name: 'open-with-slidev:single-file',
  enforce: 'post',
  // Slidev splits chunks with manualChunks; turn splitting off so dynamic imports land in the one chunk.
  outputOptions(o) {
    delete o.manualChunks
    if (this.meta.rolldownVersion) { delete o.advancedChunks; o.codeSplitting = false } else o.inlineDynamicImports = true
    return o
  },
  // Slidev adds <link rel="preload" as="image"> for slide images; Vite would then emit those images as files
  // (and reuse that for the JS import), so drop the tags before Vite processes the HTML.
  transformIndexHtml: {
    order: 'pre',
    handler: html => html.replace(/<link\b[^>]*>\s*/g, tag => /rel="preload"/.test(tag) && /as="image"/.test(tag) ? '' : tag),
  },
  // order 'post': run after Vite has filled in its preload placeholders (__VITE_PRELOAD__) in the chunk code.
  generateBundle: {
    order: 'post',
    handler(_, bundle) {
      const html = bundle['index.html']
      if (!html) return
      const used = []
      let src = html.source.toString()
      src = src.replace(/<link[^>]*rel="modulepreload"[^>]*>\s*/g, '')
      src = src.replace(/<script([^>]*?)\ssrc="(?:\.\/|\/)?([^"]+)"([^>]*)><\/script>/g, (m, a, file, b) => {
        const chunk = bundle[file]
        if (!chunk || chunk.type !== 'chunk') return m
        used.push(file)
        const attrs = (a + b).replace(/\s*crossorigin(="[^"]*")?/g, '')
        return `<script${attrs}>${chunk.code.replace(/<\/script/gi, '<\\/script')}</script>`
      })
      src = src.replace(/<link[^>]*rel="stylesheet"[^>]*href="(?:\.\/|\/)?([^"]+)"[^>]*>/g, (m, file) => {
        const asset = bundle[file]
        if (!asset || asset.type !== 'asset') return m
        used.push(file)
        return `<style>${asset.source.toString().replace(/<\/style/gi, '<\\/style')}</style>`
      })
      html.source = src
      for (const f of used) delete bundle[f]
    },
  },
}

;(async () => {
  // The project's Slidev (installed by the extension or by the user). build() is not exported, so load its chunk file.
  const req = createRequire(path.join(info.root, 'index.js'))
  const dist = path.join(path.dirname(req.resolve('@slidev/cli/package.json')), 'dist')
  const buildFile = fs.readdirSync(dist).find(f => /^build-.*\.mjs$/.test(f))
  if (!buildFile) throw new Error(`build chunk not found in ${dist}. Update Slidev: npm install -D @slidev/cli@latest`)
  const { resolveOptions } = await import(pathToFileURL(path.join(dist, 'index.mjs')).href)
  const { build } = await import(pathToFileURL(path.join(dist, buildFile)).href)

  const options = await resolveOptions({ entry: info.entry, theme: info.theme || undefined, routerMode: 'hash', base: './' }, 'build')
  options.data.config.routerMode = 'hash'   // file:// has no server to answer /2, /3 …
  options.data.config.download = false      // PDF export would need Playwright and a separate file

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'slidev-html-'))
  try {
    await build(options, {
      base: './',
      logLevel: 'warn',
      plugins: [singleFile],
      build: { outDir: tmp, emptyOutDir: true, assetsInlineLimit: () => true, cssCodeSplit: false },
    }, {})
    fs.copyFileSync(path.join(tmp, 'index.html'), info.out)
    const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
    for (const f of walk(tmp).map(f => path.relative(tmp, f))) if (!/^(index\.html|404\.html|_redirects)$/.test(f)) console.log(`SKIPPED ${f}`)
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }
  console.log(`DONE ${info.out} (${Math.round(fs.statSync(info.out).size / 1024)} KB)`)
})().then(() => process.exit(0),e => { console.error(e && e.stack || e); process.exit(1) })   // exit: Vite can leave handles open
