import { fuseAngular } from './tools/runner/bundle'
import { argv } from 'yargs'
import { task, context, watch, src } from 'fuse-box/sparky'
import { Options } from './tools/runner/interfaces'
import { mergeOptions, removeUndefinedValuesFromObj } from './tools/runner/merge'
import { DEFAULT_CONFIG } from './tools/runner/config'
import { compressStatic } from './tools/scripts/compress'
import { spawn } from 'child_process'

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
    bundle: mergeOptions(DEFAULT_CONFIG)(removeUndefinedValuesFromObj(opts))
  } as Config
});

task('clean', (ctx: Config) => src(ctx.bundle.outputDirectory).clean(ctx.bundle.outputDirectory))
task('build', ['&app', '&assets'])
task('compress', async (ctx: Config) => await compressStatic([`${ctx.bundle.outputDirectory}/${ctx.bundle.wwwroot}`]))
task('build.prod', ['clean', 'build', 'compress'])
task('build.dev', ['clean', 'build'], (ctx: Config) => {
  if (ctx.cliArgs.electron) {
    spawn('npm', ['run', 'electron'])
  }
})
task('app', (ctx: Config) => fuseAngular(ctx.bundle))

task("assets", async (ctx: Config) => {
  const base = `${ctx.bundle.srcRoot}/${ctx.bundle.assetRoot}`
  const dest = `${ctx.bundle.outputDirectory}/${ctx.bundle.wwwroot}`

  if (ctx.cliArgs.watch) {
    await watch("**/**.**", { base }).dest(dest).exec();
  } else {
    await src("**/**.**", { base }).dest(dest).exec()
  }
})
