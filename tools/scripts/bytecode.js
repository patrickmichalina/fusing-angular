const join = require('path').join
const fs = require('fs')
const v8 = require('v8')
const bytecode = require('bytenode')
const app = require('electron').app
const appPath = app.getAppPath()

v8.setFlagsFromString('--no-lazy')

fs.readdir(appPath, (err, files) => {
  const sourcefile = files.find(a => a.match(/app.js$/))
  const bytefile = files.find(a => a.match(/app.jsc$/))

  if (err) {
    throw new Error(err)
  }

  if (sourcefile) {
    const srcPath = join(appPath, sourcefile)
    const bytecodePath = join(appPath, sourcefile.replace('.js', '.jsc'))
    bytecode.compileFile(srcPath, bytecodePath)
    fs.unlinkSync(srcPath)
    if (process.env.BUILD_BYTECODE) process.exit(0)
    require(bytecodePath)
  } else if (bytefile) {
    require(join(appPath, bytefile))
  } else {
    throw new Error('No application file')
  }
})
