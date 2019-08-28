import { argv } from 'yargs'
import { fusebox, sparky } from 'fuse-box'
import { ngc, ngcWatch } from './tools/scripts/ngc.spawn'
import { IMaybe, maybe } from 'typescript-monads'
import { ServerLauncher } from 'fuse-box/user-handler/ServerLauncher'
import { ChildProcess, spawnSync } from 'child_process'
import { compressStatic } from './tools/scripts/compress'
import { minify } from 'terser'
import { ILoggerProps } from 'fuse-box/logging/logging'

const argToBool = (arg: string) => argv[arg] ? true : false

class BuildContext {
  minify = argToBool('minify')
  lint = argToBool('lint')
  aot = argToBool('aot')
  prod = argToBool('prod')
  serve = argToBool('serve')
  watch = argToBool('watch')
  pwa = argToBool('pwa')
  electron = argToBool('electron')
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
  shared = {
    logging: { level: 'succinct' } as ILoggerProps
  }
  fusebox = {
    server: fusebox({
      target: 'server',
      entry: this.aot ? 'ngc/server/server.js' : 'src/server/server.ts',
      watch: this.watch,
      devServer: false,
      dependencies: this.prod
        ? { ignorePackages: ['domino', 'throng'], ignoreAllExternal: false }
        : {},
      cache: { enabled: true, root: '.fusebox/server' },
      ...this.shared
    }),
    browser: fusebox({
      watch: this.watch,
      target: 'browser',
      output: 'dist/wwwroot/assets/js',
      entry: this.aot
        ? this.prod ? 'ngc/browser/main.prod.js' : 'ngc/browser/main.js'
        : this.prod ? 'src/browser/main.prod.ts' : 'src/browser/main.ts',
      webIndex: { template: 'src/browser/index.html', distFileName: '../../index.html', publicPath: 'assets/js' },
      cache: { enabled: true, root: '.fusebox/browser' },
      devServer: !this.serve ? false : {
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
      },
      ...this.shared
    }),
    electron: {
      renderer: fusebox({
        watch: this.watch,
        target: 'browser',
        output: 'dist/desktop/wwwroot/assets/js',
        entry: this.aot
          ? this.prod ? 'ngc/electron/angular/main.prod.js' : 'ngc/electron/angular/main.js'
          : this.prod ? 'src/electron/angular/main.prod.ts' : 'src/electron/angular/main.ts',
        webIndex: { template: 'src/browser/index.html', distFileName: '../../index.html', publicPath: 'assets/js' },
        cache: { enabled: true, root: '.fusebox/electron/renderer' },
        ...this.shared
      }),
      main: fusebox({
        watch: this.watch,
        target: 'electron',
        output: './dist/desktop/$name',
        entry: 'src/electron/app.ts',
        useSingleBundle: true,
        dependencies: {
          ignoreAllExternal: true
        },
        cache: { enabled: true, root: '.fusebox/electron/main' },
        ...this.shared
      })
    }
  }
}

const { task, exec, rm, src } = sparky(BuildContext)

task('assets.copy', ctx => Promise.all([
  src('./src/assets/**/*.*').dest('./dist/wwwroot/assets', 'assets').exec(),
  ctx.electron ? src('./src/assets/**/*.*').dest('./dist/desktop/wwwroot/assets', 'assets').exec() : Promise.resolve<string[]>([])
]))

task('assets.compress', ctx => {
  return compressStatic(['dist/wwwroot']).catch(err => {
    console.log(err)
    process.exit(-1)
  })
})

task('assets', ctx => Promise.all([
  exec('assets.copy'),
  !ctx.pwa ? Promise.resolve() : exec('assets.pwa.ngsw')
]))

task('ngc', ctx => {
  return (ctx.watch ? ngcWatch().then(proc => ctx.ngcProcess = maybe(proc)) : ngc())
    .catch(err => {
      console.log(err.toString())
      process.exit(-1)
      
    })
})

task('build', ctx => (ctx.aot ? exec('ngc') : Promise.resolve())
  .then(() => exec('assets'))
  .then(() => ctx.prod ? exec('build.prod') : exec('build.dev')))

task('build.dev', ctx => exec('build.dev.server').then(() => Promise.all([
  exec('build.dev.browser'),
  ctx.electron ? exec('build.dev.electron') : Promise.resolve()])))
task('build.dev.electron', ctx => ctx.fusebox.electron.renderer.runDev().then(() => ctx.fusebox.electron.main.runDev(h => {
  h.onComplete(b => {
    b.electron.handleMainProcess()
  })
})))
task('build.dev.browser', ctx => { return ctx.fusebox.browser.runDev() })
task('build.dev.server', ctx => ctx.fusebox.server.runDev(handler => {
  if (ctx.serve) {
    ctx.killServer()
    handler.onComplete(complete => {
      ctx.setServerRef(complete.server)
      Promise.all([exec('assets.copy')])
        .then(() => ctx.pwa ? exec('assets.pwa.ngsw.config') : Promise.resolve())
        .then(() => complete.server.handleEntry())
    })
  }
}))

task('build.prod', ctx => exec('build.prod.server')
  .then(() => Promise.all([exec('build.prod.browser'), ctx.electron ? exec('build.prod.electron') : Promise.resolve()]))
  .then(() => exec('assets.pwa.ngsw.config'))
  .then(() => exec('assets.compress')))

task('build.prod.browser', ctx => ctx.fusebox.browser.runProd())
task('build.prod.server', ctx => ctx.fusebox.server.runProd())
task('build.prod.electron', ctx => ctx.fusebox.electron.renderer.runProd({ uglify: true }).then(() => ctx.fusebox.electron.main.runProd({
  uglify: false
})))

task('assets.pwa.ngsw', ctx => src('./node_modules/@angular/service-worker/ngsw-worker.js')
  .contentsOf(/ngsw-worker.js/, content => minify(content).code || content) // MINIFY?
  .dest('./dist/wwwroot', 'node_modules/@angular/service-worker')
  .exec())

task('assets.pwa.ngsw.config', ctx => {
  // TODO: convert to promise
  spawnSync('node_modules/.bin/ngsw-config', ['dist/wwwroot', 'src/browser/ngsw.json'])
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
