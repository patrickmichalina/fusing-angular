import { argv } from 'yargs'
import { fusebox, sparky, pluginReplace, pluginAngular, pluginCSS, pluginLess } from 'fuse-box'
import { ngc, ngcWatch } from './tools/scripts/ngc.spawn'
import { IMaybe, maybe } from 'typescript-monads'
import { ServerLauncher } from 'fuse-box/user-handler/ServerLauncher'
import { ChildProcess, spawnSync } from 'child_process'
import { compressStatic } from './tools/scripts/compress'
import { minify } from 'terser'
import { ILoggerProps } from 'fuse-box/logging/logging'
import { UserHandler } from 'fuse-box/user-handler/UserHandler'
import * as packageJson from './package.json'

const argToBool = (arg: string) => argv[arg] ? true : false

const angularPlugins = [
  pluginAngular('*.component.ts'),
  pluginCSS('*.component.css', { asText: true })
]

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
    watch: this.watch,
    turboMode: true,
    logging: { level: 'disabled' } as ILoggerProps,
    plugins: [pluginReplace('fusing.module.ts', {
      "__APPVERSION__": packageJson.version,
      "__NODE_DEBUG__": `${process.env.NODE_DEBUG}`
    })]
  }
  fusebox = {
    server: fusebox({
      target: 'server',
      entry: this.aot ? 'ngc/server/server.js' : 'src/server/server.ts',
      devServer: false,
      dependencies: this.prod
        ? { ignorePackages: packageJson.fuse.server, ignoreAllExternal: false }
        : {},
      cache: { enabled: true, FTL: true, root: '.fusebox/server' },
      ...this.shared,
      plugins: [...this.aot ? [] : angularPlugins, ...this.shared.plugins]
    }),
    browser: fusebox({
      target: 'browser',
      output: 'dist/wwwroot/assets/js',
      entry: this.aot
        ? this.prod ? 'ngc/browser/main.aot.prod.js' : 'ngc/browser/main.aot.js'
        : this.prod ? 'src/browser/main.prod.ts' : 'src/browser/main.ts',
      webIndex: { template: 'src/browser/index.html', distFileName: '../../index.html', publicPath: 'assets/js' },
      cache: { enabled: true, FTL: true, root: '.fusebox/browser' },
      dependencies: { ignorePackages: packageJson.fuse.browser },
      hmr: this.watch,
      devServer: !this.serve ? false : {
        hmrServer: this.watch ? { port: 4200 } : false,
        httpServer: this.watch ? { port: 4200 } : false,
        proxy: !this.watch ? [] : [
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
      ...this.shared,
      plugins: [...this.aot ? [] : angularPlugins, ...this.shared.plugins]
    }),
    electron: {
      renderer: fusebox({
        target: 'browser',
        output: 'dist/desktop/wwwroot/assets/js',
        entry: this.aot
          ? this.prod ? 'ngc/electron/angular/main.aot.prod.js' : 'ngc/electron/angular/main.aot.js'
          : this.prod ? 'src/electron/angular/main.prod.ts' : 'src/electron/angular/main.ts',
        webIndex: { template: 'src/browser/index.html', distFileName: '../../index.html', publicPath: 'assets/js' },
        cache: { enabled: true, FTL: true, root: '.fusebox/electron/renderer' },
        dependencies: { ignorePackages: packageJson.fuse.browser },
        devServer: false,
        ...this.shared,
        plugins: [...this.aot ? [] : angularPlugins, ...this.shared.plugins]
      }),
      main: fusebox({
        target: 'electron',
        entry: 'src/electron/app.ts',
        output: 'dist/desktop',
        useSingleBundle: true,
        devServer: false,
        dependencies: {
          ignoreAllExternal: false,
          ignorePackages: packageJson.fuse.electron
        },
        cache: { enabled: true, FTL: true, root: '.fusebox/electron/main' },
        ...this.shared
      })
    },
    serveHandler: (handler: UserHandler) => {
      if (this.serve) {
        this.killServer()
        handler.onComplete(complete => {
          this.setServerRef(complete.server)
          if (!this.prod) {
            const scriptArgs = this.watch ? ['--port=4201'] : []
            exec('assets.pwa.ngsw.config').then(() => {
              complete.server.handleEntry({ nodeArgs: [], scriptArgs })
            })
          }
        })
      }
    }
  }
}

const { task, exec, rm, src } = sparky(BuildContext)

task('assets.copy', ctx => Promise.all([
  src('./src/assets/**/*.*').dest('./dist/wwwroot/assets', 'assets').exec(),
  ctx.electron ? src('./src/assets/**/*.*').dest('./dist/desktop/wwwroot/assets', 'assets').exec() : Promise.resolve<string[]>([])
]))

task('assets.compress', async ctx => {
  return await compressStatic(['dist/wwwroot']).catch(err => {
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
  ctx.electron ? exec('build.dev.electron') : Promise.resolve()])
  .then(() => exec('assets.pwa.ngsw.config'))

))
task('build.dev.electron', ctx => ctx.fusebox.electron.renderer.runDev().then(() => ctx.fusebox.electron.main.runDev(h => {
  if (ctx.serve) {
    h.onComplete(b => {
      b.electron.handleMainProcess()
    })
  }
})))
task('build.dev.browser', ctx => { return ctx.fusebox.browser.runDev() })
task('build.dev.server', ctx => ctx.fusebox.server.runDev(ctx.fusebox.serveHandler))

task('build.prod', ctx => exec('build.prod.server')
  .then(() => Promise.all([exec('build.prod.browser'), ctx.electron ? exec('build.prod.electron') : Promise.resolve()]))
  .then(() => exec('assets.pwa.ngsw.config'))
  .then(() => exec('assets.compress'))
  .then(() => {
    if (ctx.serve && ctx.prod) {
      // assets.compress Promise is not working!
      ctx.serverRef.tapSome(a => a.handleEntry())
    }
  }))

task('build.prod.browser', ctx => ctx.fusebox.browser.runProd())
task('build.prod.server', ctx => ctx.fusebox.server.runProd({
  handler: ctx.fusebox.serveHandler
}))
task('build.prod.electron', ctx => ctx.fusebox.electron.renderer.runProd({ uglify: true }).then(() => ctx.fusebox.electron.main.runProd({
  handler: handler => {
    if (ctx.serve) {
      handler.onComplete(b => {
        b.electron.handleMainProcess()
      })
    }
  }
})))

task('assets.pwa.ngsw', _ctx => src('./node_modules/@angular/service-worker/ngsw-worker.js')
  .contentsOf(/ngsw-worker.js/, content => minify(content).code || content) // MINIFY?
  .dest('./dist/wwwroot', 'node_modules/@angular/service-worker')
  .exec())

task('assets.pwa.ngsw.config', _ctx => {
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
