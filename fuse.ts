import { fuseAngular } from './tools/runner/bundle'
import { argv } from 'yargs'
import { task, context, watch, src } from 'fuse-box/sparky'
import { SparkyFile } from 'fuse-box/sparky/SparkyFile'
import { Options } from './tools/runner/interfaces'
import { mergeOptions, removeUndefinedValuesFromObj } from './tools/runner/merge'
import { DEFAULT_FUSEBOX_CONFIG } from './tools/runner/config'
import { compressStatic } from './tools/scripts/compress'
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
  watch: argv.watch
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
  enableAotCompilaton: cliArgs.aot || cliArgs.prod
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
task('compress', async (ctx: Config) => await compressStatic([
  `${ctx.bundle.outputDirectory}/${ctx.bundle.wwwroot}`,
  `${ctx.bundle.outputDirectory}/electron/${ctx.bundle.wwwroot}`
]))
task('build.prod', ['clean', 'build', 'compress'])
task('build.dev', ['clean', 'build'])
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
    if (opts.electron.enabled) await watch("**/**.**", { base }).dest(destElectron).exec()
  } else {
    await src("**/**.**", { base }).dest(dest).exec()
    if (opts.electron.enabled) await src("**/**.**", { base }).dest(destElectron).exec()
  }
})
