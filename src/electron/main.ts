import { setFlagsFromString } from 'v8'
import { join } from 'path'
import { app } from 'electron'
import { existsSync, unlinkSync } from 'fs'

setFlagsFromString('--no-lazy')

const bytecodePath = join(app.getAppPath(), 'dist/electron/window.jsc')
const srcPath = join(app.getAppPath(), 'dist/electron/window.js')
const bytecode = require('bytenode')

if (existsSync(srcPath)) {
  bytecode.compileFile(srcPath, bytecodePath)
  unlinkSync(srcPath)
  if (process.env.BUILD_BYTECODE) process.exit(0)
}

require(bytecodePath)