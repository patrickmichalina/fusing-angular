import { fuseAngular } from './tools/runner/fuse'
import { argv } from 'yargs'
import { task, context, watch, src } from 'fuse-box/sparky'

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

context(() => {
  return {
    aot: argv.aot,
    electron: argv.electron,
    minify: argv.minify,
    optimize: argv.optimize,
    prod: argv.prod,
    serve: argv.serve,
    treeshake: argv.treeshake,
    universal: argv.universal,
    watch: argv.watch
  } as IAppArgs
});

task('build', ['&app', '&assets'])

task('app', (ctx: IAppArgs) => {
  fuseAngular({
    serve: ctx.serve,
    watch: ctx.watch,
    universal: {
      enabled: ctx.universal
    },
    electron: {
      enabled: ctx.electron
    },
    optimizations: {
      enabled: ctx.optimize || ctx.prod,
      minify: ctx.minify || ctx.prod,
      treeshake: ctx.treeshake || ctx.prod
    },
    enableAotCompilaton: ctx.aot || ctx.prod
  })
})

task("assets", async (ctx: IAppArgs) => {
  if (ctx.watch) {
    await watch("**/**.**", { base: 'src/assets' })
      .dest('dist/public')
      .exec();
  } else {
    await src("**/**.**", { base: 'src/assets' })
      .dest('dist/public')
      .exec();
  }
})
