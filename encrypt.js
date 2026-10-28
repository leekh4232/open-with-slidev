// Build with Slidev — PDF 비밀번호 설정기 (Teacher Mode 전용).
// 확장이 `node encrypt.js <base64url JSON>` 로 돌린다. info = { pkgDir, input, output, password }.
// qpdf-wasm(@neslinesli93/qpdf-wasm)를 별도 프로세스에서 돌려 input PDF 를 AES-256 으로 암호화한다.
// qpdf 는 깨진 입력을 만나면 process.exit() 로 프로세스를 끝내기도 해서, 확장 호스트가 아니라 이 자식 프로세스에서 돌린다.
// 성공하면 output 에 암호화된 PDF 를 쓰고 "DONE" 을 찍고 0 으로, 아니면 1 로 끝낸다.
const fs = require('fs')
const path = require('path')

const info = JSON.parse(Buffer.from(process.argv[2] || '', 'base64url').toString('utf8'))
const createModule = require(path.join(info.pkgDir, 'dist', 'qpdf.js'))
const wasmPath = path.join(info.pkgDir, 'dist', 'qpdf.wasm')

;(async () => {
  const qpdf = await createModule({ locateFile: () => wasmPath, noInitialRun: true, print: () => {}, printErr: s => process.stderr.write(String(s) + '\n') })
  qpdf.FS.writeFile('/in.pdf', fs.readFileSync(info.input))
  // qpdf input --encrypt <user> <owner> 256 -- output : 열 때 user 암호를 요구하는 AES-256 암호화.
  // user 와 owner 를 같게 둬 둘 다 같은 암호로 통일한다. 종료 코드는 못 믿어서(이 빌드는 성공·실패 모두 0 을 주기도 한다) 결과 PDF 로 판단한다.
  try { qpdf.callMain(['/in.pdf', '--encrypt', info.password, info.password, '256', '--', '/out.pdf']) } catch { /* 아래에서 결과로 판단 */ }
  let outBuf = null
  try { outBuf = Buffer.from(qpdf.FS.readFile('/out.pdf')) } catch { /* 아래에서 처리 */ }
  if (!outBuf || outBuf.length === 0 || outBuf.slice(0, 5).toString('latin1') !== '%PDF-' || !outBuf.includes(Buffer.from('/Encrypt'))) {
    console.error('qpdf 가 암호화된 PDF 를 만들지 못했습니다.')
    process.exit(1)
  }
  fs.writeFileSync(info.output, outBuf)
  console.log(`DONE ${info.output} (${Math.round(outBuf.length / 1024)} KB, encrypted)`)
  process.exit(0)
})().catch(e => { console.error(e && e.stack || e); process.exit(1) })
