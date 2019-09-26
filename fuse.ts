import { argv } from 'yargs'
import { fusebox, sparky, pluginReplace, pluginAngular, pluginCSS, pluginConsolidate } from 'fuse-box'
import { ngc, ngcWatch } from './tools/scripts/ngc.spawn'
import { IMaybe, maybe } from 'typescript-monads'
import { ServerLauncher } from 'fuse-box/user-handler/ServerLauncher'
import { ChildProcess, spawnSync, spawn } from 'child_process'
import { compressStatic } from './tools/scripts/compress'
import { minify } from 'terser'
import { UserHandler } from 'fuse-box/user-handler/UserHandler'
import { IFuseLoggerProps } from 'fuse-box/config/IFuseLoggerProps'
import { readdirSync } from 'fs'
import * as packageJson from './package.json'

const argToBool = (arg: string) => argv[arg] ? true : false

const files = readdirSync('src/assets/icons')
const ios = files.filter(b => b.match(/apple-icon-/g))
  .map(a => +a.split('.').reverse()[1].split('-')[2])
  .sort((a, b) => b - a)
  .map(a => {
  return {
    size: `${a}x${a}`,
    href: `/assets/icons/apple-icon-${a}.png`
  }
})

const favicons = files.filter(b => b.match(/icon-*.*x/g)).map(a => +a.split('x')[1].split('.')[0])
  .sort((a, b) => b - a)
  .map(size => {
    return {
      size: `${size}x${size}`,
      href: `/assets/icons/icon-${size}x${size}.png`
    }
  })

const pugSharedLocals = { 
  title: 'Fusing Angular',
  icons: {
    ios,
    favicons
  }
}

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
  devServerPort = 4200
  ngServerPort = 4201
  shared = {
    watch: this.watch,
    turboMode: true,
    logging: { level: 'disabled' } as IFuseLoggerProps,
    cache: { enabled: true, FTL: true, root: '.fusebox' },
    plugins: [
      ...this.aot ? [] : [
        pluginAngular('*.component.ts'),
        pluginCSS('*.component.css', { asText: true })
      ],
      pluginReplace(/fusing.module.(ts|js)/, {
        "__APP_VERSION__": packageJson.version,
        "__NODE_DEBUG__": `${process.env.NODE_DEBUG}`
      }),
    ]
  }
  fusebox = {
    server: fusebox({
      target: 'server',
      entry: this.aot ? 'ngc/common/server/server.js' : 'src/server/server.ts',
      devServer: false,
      dependencies: this.prod
        ? { ignorePackages: packageJson.fusebox.ignore.server, ignoreAllExternal: false }
        : {},
      ...this.shared,
      plugins: this.shared.plugins
    }),
    browser: fusebox({
      target: 'browser',
      output: 'dist/wwwroot/assets/js',
      entry: this.aot
        ? this.prod ? 'ngc/esnext/browser/main.aot.prod.js' : 'ngc/esnext/browser/main.aot.js'
        : this.prod ? 'src/browser/main.prod.ts' : 'src/browser/main.ts',
      webIndex: { template: 'src/browser/index.pug', distFileName: '../../index.html', publicPath: '/assets/js' },
      dependencies: { ignorePackages: packageJson.fusebox.ignore.browser },
      codeSplitting: { useHash: false, maxPathLength: 0 },
      hmr: this.watch,
      devServer: !this.serve ? false : {
        hmrServer: this.watch ? { port: this.devServerPort } : false,
        httpServer: this.watch ? { port: this.devServerPort } : false,
        proxy: !this.watch ? [] : [
          {
            path: "/",
            options: {
              target: `http://localhost:${this.ngServerPort}`,
              changeOrigin: true,
              followRedirects: true
            }
          }
        ]
      },
      env: { pwa: this.pwa ? "true": "false" },
      ...this.shared,
      plugins: [pluginConsolidate('pug', { ...pugSharedLocals, isElectron: false }), ...this.shared.plugins]
    }),
    electron: {
      renderer: fusebox({
        target: 'browser',
        output: 'dist/desktop/wwwroot/assets/js',
        entry: this.aot
          ? this.prod ? 'ngc/esnext/electron/angular/main.aot.prod.js' : 'ngc/esnext/electron/angular/main.aot.js'
          : this.prod ? 'src/electron/angular/main.prod.ts' : 'src/electron/angular/main.ts',
        webIndex: { template: 'src/browser/index.pug', distFileName: '../../index.html', publicPath: '/assets/js' },
        dependencies: { ignorePackages: packageJson.fusebox.ignore.browser },
        codeSplitting: { useHash: false, maxPathLength: 0 },
        devServer: false,
        env: Object
          .keys(process.env)
          .filter(k => k.includes('NG_'))
          .reduce((acc, curr) => ({ ...acc, [curr.replace('NG_', '')]: process.env[curr] }), {
            NG_SERVER_HOST: maybe(process.env.HOSTNAME).valueOr(`http://localhost:${this.ngServerPort}`)
          }),
        ...this.shared,
        plugins: [pluginConsolidate('pug', { ...pugSharedLocals, isElectron: true }), ...this.shared.plugins]
      }),
      main: fusebox({
        target: 'electron',
        entry: 'src/electron/app.ts',
        output: 'dist/desktop',
        useSingleBundle: true,
        devServer: false,
        sourceMap: false,
        dependencies: {
          ignoreAllExternal: false,
          ignorePackages: packageJson.fusebox.ignore.electron
        },
        ...this.shared
      })
    },
    serveHandler: (handler: UserHandler) => {
      if (this.serve) {
        this.killServer()
        handler.onComplete(complete => {
          this.setServerRef(complete.server)
          if (!this.prod) {
            const scriptArgs = this.watch ? [`--port=${this.ngServerPort}`] : []
            if (this.pwa) {
              exec('assets.pwa.ngsw.config').then(() => {
                complete.server.handleEntry({ nodeArgs: [], scriptArgs })
              })
            } else {
              complete.server.handleEntry({ nodeArgs: [], scriptArgs })
            }
          }
        })
      }
    }
  }
}

const { task, exec, rm, src } = sparky(BuildContext)

task('assets.copy', ctx => Promise.all([
  src('./src/assets/**/*.*').dest('./dist/wwwroot/assets', 'assets').exec(),
  ctx.electron 
    ? Promise.all([
      exec('icns'),
      src('./src/assets/**/*.*').dest('./dist/desktop/wwwroot/assets', 'assets').exec(),
      src('./tools/scripts/bytecode.js').dest('./dist/desktop', 'scripts').exec(),
    ]) as any
    : Promise.resolve<string[]>([])
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

task('ngc.common', ctx => {
  return (ctx.watch ? ngcWatch('src/tsconfig.common.json').then(proc => ctx.ngcProcess = maybe(proc)) : ngc('src/tsconfig.common.json'))
    .catch(err => {
      console.log(err.toString())
      process.exit(-1)
    })
})
task('ngc.esnext', ctx => {
  return (ctx.watch ? ngcWatch().then(proc => ctx.ngcProcess = maybe(proc)) : ngc())
    .catch(err => {
      console.log(err.toString())
      process.exit(-1)
    })
})

task('build', ctx => (ctx.aot ? Promise.all([exec('ngc.common'), exec('ngc.esnext')]) : Promise.all([Promise.resolve()]))
  .then(() => exec('assets'))
  .then(() => ctx.prod ? exec('build.prod') : exec('build.dev')))

task('build.dev', ctx => exec('build.dev.server').then(() => Promise.all([
  exec('build.dev.browser'),
  ctx.electron ? exec('build.dev.electron') : Promise.resolve()])
  .then(() => ctx.pwa ? exec('assets.pwa.ngsw.config') : Promise.resolve())

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
  .contentsOf(/ngsw-worker.js/, content => minify(content).code || content)
  .dest('./dist/wwwroot', 'node_modules/@angular/service-worker')
  .exec())

task('assets.pwa.ngsw.config', _ctx => {
  // TODO: convert to promise
  spawnSync('node_modules/.bin/ngsw-config', ['dist/wwwroot', 'src/browser/ngsw.json'])
})

task('icns', _ctx => spawn('./tools/scripts/icns.sh', ['dist/desktop/icon', 'src/assets/img/logo.png']))

task('default', ctx => {
  rm('dist')
  rm('ngc')

  process.on('exit', () => {
    ctx.killServer()
    ctx.killNgc()
  })

  return exec('build')
})
