// import { setFlagsFromString } from 'v8'
import { existsSync, unlinkSync, readdir } from 'fs'
import { join } from 'path'
import { app } from 'electron'

// setFlagsFromString('--no-lazy')

readdir(app.getAppPath(), (err, files) => {
  const filename = (files[0].split('/').pop() || '')
  const bytecodePath = join(app.getAppPath(), `/${filename.replace('.js', '')}.jsc`)
  const srcPath = join(app.getAppPath(), `/${filename}`)

  const bytecode = require('bytenode')

  if (existsSync(srcPath)) {
    bytecode.compileFile(srcPath, bytecodePath)
    unlinkSync(srcPath)
    if (process.env.BUILD_BYTECODE) process.exit(0)
  }

  require(bytecodePath)
})

