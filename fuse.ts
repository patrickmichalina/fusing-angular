import { argv } from 'yargs'
import { fusebox, sparky } from 'fuse-box'
import { ngc, ngcWatch } from './tools/scripts/ngc.spawn'
import { IMaybe, maybe } from 'typescript-monads'
import { ServerLauncher } from 'fuse-box/user-handler/ServerLauncher'
import { ChildProcess } from 'child_process'
import { compressStatic } from './tools/scripts/compress'

class BuildContext {
  minify = argv.minify ? true : false
  lint = argv.lint ? true : false
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
      logging: { level: 'disabled' },
      target: 'server',
      entry: 'ngc/server/server.js',
      watch: this.watch,
      devServer: false,
      dependencies: {
        ignorePackages: ['domino', 'throng'],
        ignoreAllExternal: false
      },
      cache: { enabled: true, root: '.fusebox/server' }
    }),
    browser: fusebox({
      watch: this.watch,
      target: 'browser',
      output: 'dist/wwwroot/js',
      logging: { level: 'disabled' },
      entry: this.prod ? 'ngc/browser/main.prod.js' : 'ngc/browser/main.js',
      webIndex: { template: 'src/browser/index.html', distFileName: '../index.html', publicPath: 'assets/js' },
      cache: { enabled: true, root: '.fusebox/browser' },
      devServer: {
        hmrServer: { port: 4200 },
        httpServer: { port: 4200 },
        proxy: [
          {
            path: "/",
            options: {
              target: "http://localhost:4201",
              changeOrigin: true,
              followRedirects: true
            }
          }
        ]
      }
    }),
    electron: fusebox({
      target: 'electron'
    })
  }
}

const { task, exec, rm, src } = sparky(BuildContext)

task('assets.copy', _ctx =>
  src('./src/assets/**/*.*')
    .dest('./dist/wwwroot', 'assets')
    .exec())

task('assets.compress', ctx => {
  return compressStatic(['dist/wwwroot']).catch(err => {
    console.log(err)
    process.exit(-1)
  })
})

task('ngc', ctx => {
  return (ctx.watch ? ngcWatch().then(proc => ctx.ngcProcess = maybe(proc)) : ngc())
    .catch(err => {
      console.log(err.toString())
      process.exit(-1)
    })
})

task('build', ctx => exec('ngc')
  .then(() => exec('assets.copy'))
  .then(() => ctx.prod ? exec('build.prod') : exec('build.dev')))

task('build.dev', _ctx => exec('build.dev.server').then(() => exec('build.dev.browser')))
task('build.dev.browser', ctx => { return ctx.fusebox.browser.runDev() })
task('build.dev.server', ctx => ctx.fusebox.server.runDev(handler => {
  if (ctx.serve) {
    ctx.killServer()
    handler.onComplete(complete => {
      ctx.setServerRef(complete.server)
      exec('assets.copy').then(() => complete.server.handleEntry())
    })
  }
}))

task('build.prod', _ctx => exec('build.prod.server')
  .then(() => exec('build.prod.browser'))
  .then(() => exec('assets.compress')))
task('build.prod.browser', ctx => ctx.fusebox.browser.runProd())
task('build.prod.server', ctx => ctx.fusebox.server.runProd())

task('default', ctx => {
  rm('dist')
  rm('ngc')

  process.on('exit', () => {
    ctx.killServer()
    ctx.killNgc()
  })

  return exec('build')
})
