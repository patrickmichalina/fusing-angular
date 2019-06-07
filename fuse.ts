import { fuseAngular } from './tools/runner/bundle'
import { argv } from 'yargs'
import { task, context, watch, src } from 'fuse-box/sparky'
import { SparkyFile } from 'fuse-box/sparky/SparkyFile'
import { Options } from './tools/runner/interfaces'
import { mergeOptions, removeUndefinedValuesFromObj } from './tools/runner/merge'
import { DEFAULT_FUSEBOX_CONFIG } from './tools/runner/config'
import { compressStatic } from './tools/scripts/compress'
import { spawn } from 'child_process'
import { resolve } from 'path'
import { ensureDir } from 'fuse-box/Utils'
import * as cleancss from 'clean-css'


interface IAppArgs {
  readonly serve?: boolean
  readonly watch?: boolean
  readonly aot?: boolean
  readonly optimize?: boolean
  readonly prod?: boolean
  readonly minify?: boolean
  readonly treeshake?: boolean
  readonly electron?: boolean
  readonly universal?: boolean
  readonly pwa?: boolean
}

interface Config {
  readonly cliArgs: IAppArgs
  readonly bundle: Options
}

const cliArgs = {
  aot: argv.aot,
  electron: argv.electron,
  minify: argv.minify,
  optimize: argv.optimize,
  prod: argv.prod,
  serve: argv.serve,
  treeshake: argv.treeshake,
  universal: argv.universal,
  watch: argv.watch,
  pwa: argv.pwa
}

const opts = {
  serve: cliArgs.serve,
  watch: cliArgs.watch,
  universal: {
    enabled: cliArgs.universal
  },
  electron: {
    enabled: cliArgs.electron
  },
  optimizations: {
    enabled: cliArgs.optimize || cliArgs.prod,
    minify: cliArgs.minify || cliArgs.prod,
    treeshake: cliArgs.treeshake || cliArgs.prod
  },
  enableAotCompilaton: cliArgs.aot || cliArgs.prod,
  pwa: cliArgs.pwa
}

context(() => {
  return {
    cliArgs,
    bundle: mergeOptions(DEFAULT_FUSEBOX_CONFIG)(removeUndefinedValuesFromObj(opts))
  } as Config
})

task('clean.fusebox', () => src('.fusebox').clean('.fusebox'))
task('clean.dist', (ctx: Config) => src(ctx.bundle.outputDirectory).clean(ctx.bundle.outputDirectory))
task('clean', ['&clean.fusebox', '&clean.dist'])
task('build', ['&app', '&assets', '&css'])
task('compress', (ctx: Config) => compressStatic([
  `${ctx.bundle.outputDirectory}/${ctx.bundle.wwwroot}`,
  `${ctx.bundle.outputDirectory}/electron/${ctx.bundle.wwwroot}`
]))
task('build.prod', ['clean', 'build', 'sw-js', 'sw-json', 'compress'])
task('build.dev', ['clean', 'build', 'sw-js', 'sw-json'])
task('app', (ctx: Config) => fuseAngular(ctx.bundle))
task('css', (ctx: Config) => {
  const cssc = new cleancss()
  const ref = '**/**'
  const base = 'src/browser/styles'
  const staticOrWatch = () => ctx.cliArgs.watch ? watch(ref, { base }) : src(ref, { base })

  return staticOrWatch()
    .file("*.css", (file: SparkyFile) => {
      file.read()
      file.setContent(cssc.minify(file.contents.toString()).styles)
    })
    .dest(`${ctx.bundle.outputDirectory}/${ctx.bundle.wwwroot}/css`)
    .dest(`${ctx.bundle.outputDirectory}/electron/${ctx.bundle.wwwroot}/css`)
})

task("assets", async (ctx: Config) => {
  const base = `${ctx.bundle.srcRoot}/${ctx.bundle.assetRoot}`
  const dest = `${ctx.bundle.outputDirectory}/${ctx.bundle.wwwroot}`
  const destElectron = `${ctx.bundle.outputDirectory}/electron/${ctx.bundle.wwwroot}`

  if (ctx.cliArgs.watch) {
    await watch("**/**.**", { base }).dest(dest).exec()
    if (ctx.bundle.electron.enabled) await watch("**/**.**", { base }).dest(destElectron).exec()
  } else {
    await src("**/**.**", { base }).dest(dest).exec()
    if (ctx.bundle.electron.enabled) await src("**/**.**", { base }).dest(destElectron).exec()
  }
})

task('sw-json', async (ctx: Config) => {
  if (!ctx.cliArgs.pwa) return
  const defer = (ngsw: string, out: string) => new Promise((res, rej) => {
    ensureDir(out)
    const proc = spawn(resolve('node_modules/.bin/ngsw-config'), [out, ngsw])
    proc.stdout.on('data', a => console.log(`${a}`))
    proc.stderr.on('data', a => console.log(`${a}`))
    proc.once('close', (e) => {
      res(e)
      proc.kill()
    })
    proc.once('error', (err) => {
      rej(err)
      proc.kill()
    })
  })

  const ngswPath = `${'src/browser/ngsw.json'}`
  const webPath = `${ctx.bundle.outputDirectory}/${ctx.bundle.wwwroot}`
  const electronPath = `${ctx.bundle.outputDirectory}/electron/${ctx.bundle.wwwroot}`

  const toExecute = ctx.cliArgs.electron ? [webPath, electronPath] : [webPath]
  const toWatch = toExecute.map(p => `${p}/**/!(*ngsw.json)`)
  const promises = () => Promise.all(toExecute.map(p => defer(ngswPath, p)))

  await ctx.cliArgs.watch
    ? watch(toWatch).completed(() => promises()).exec()
    : promises()
})

task('sw-js', (ctx: Config) => {
  if (!ctx.cliArgs.pwa) return

  const webPath = `${ctx.bundle.outputDirectory}/${ctx.bundle.wwwroot}`
  const electronPath = `${ctx.bundle.outputDirectory}/electron/${ctx.bundle.wwwroot}`
  const toExecute = ctx.cliArgs.electron ? [webPath, electronPath] : [webPath]

  return Promise.all(toExecute.map(p => src('ngsw-worker.js', { base: './node_modules/@angular/service-worker' }).dest(p).exec()))
})