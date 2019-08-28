// import { setFlagsFromString } from 'v8'
import { existsSync, unlinkSync } from 'fs'
import { join } from 'path'
import { app } from 'electron'

// setFlagsFromString('--no-lazy')

const bytecodePath = join(app.getAppPath(), 'dist/desktop/6fca4d71_app.jsc')
const srcPath = join(app.getAppPath(), 'dist/desktop/6fca4d71_app')
const bytecode = require('bytenode')

if (existsSync(srcPath)) {
  bytecode.compileFile(srcPath, bytecodePath)
  unlinkSync(srcPath)
  if (process.env.BUILD_BYTECODE) process.exit(0)
}

require(bytecodePath)