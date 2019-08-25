import { argv } from 'yargs'
import { fusebox, sparky } from 'fuse-box'
import { ngc, ngcWatch } from './tools/scripts/ngc.spawn'
import { IMaybe, maybe } from 'typescript-monads'
import { ServerLauncher } from 'fuse-box/user-handler/ServerLauncher'
import { ChildProcess } from 'child_process'

class BuildContext {
  minify = argv.minify ? true : false
  prod = argv.prod ? true : false
  serve = argv.serve ? true : false
  watch = argv.watch ? true : false
  pwa = argv.pwa ? true : false
  ngcProcess: IMaybe<ChildProcess> = maybe()
  serverRef: IMaybe<ServerLauncher> = maybe()
  setServerRef(val?: ServerLauncher) {
    this.serverRef = maybe(val)
  }
  killNgc = () => this.ngcProcess.tapSome(ref => ref.kill())
  killServer = () => this.serverRef.tapSome(ref => {
    ref.kill()
    this.setServerRef()
  })
  fusebox = {
    server: fusebox({
      target: 'server',
      entry: 'ngc/server/server.js'
    }),
    browser: fusebox({
      target: 'browser',
      entry: 'ngc/browser/main.js',
      output: 'dist/wwwroot/js',
      webIndex: { template: 'src/browser/index.html', distFileName: '../index.html', publicPath: 'assets/js' }
    }),
    electron: fusebox({
      target: 'electron'
    })
  }
}

const { task, exec, rm } = sparky(BuildContext)

task('assets.copy', ctx => { })
task('assets.compress', ctx => { })

task('ngc', ctx => {
  return (ctx.watch ? ngcWatch().then(proc => ctx.ngcProcess = maybe(proc)) : ngc())
    .catch(err => {
      console.log(err.toString())
      process.exit(-1)
    })
})

task('build', ctx => exec('ngc').then(() => ctx.prod ? exec('build.prod') : exec('build.dev')))

task('build.dev', ctx => {
  exec('build.dev.server').then(() => exec('build.dev.browser'))
})
task('build.dev.browser', ctx => { return ctx.fusebox.browser.runDev() })
task('build.dev.server', ctx => {
  return ctx.fusebox.server.runDev(handler => {
    if (ctx.serve) {
      ctx.killServer()
      handler.onComplete(complete => {
        ctx.setServerRef(complete.server)
        complete.server.handleEntry()
      })
    }
  })
})

task('default', ctx => {
  rm('dist')
  rm('ngc')

  process.on('exit', () => {
    ctx.killServer()
    ctx.killNgc()
  })

  return exec('build')
})
