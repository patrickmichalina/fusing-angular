import { fuseAngular } from './tools/runner/fuse'
import { argv, Arguments } from 'yargs'

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

type Args = Arguments<IAppArgs>
const args = argv as Args

fuseAngular({
  serve: args.serve,
  watch: args.watch,
  universal: {
    enabled: args.universal
  },
  electron: {
    enabled: args.electron
  },
  optimizations: {
    enabled: args.optimize || args.prod,
    minify: args.minify || args.prod,
    treeshake: args.treeshake || args.prod
  },
  enableAotCompilaton: args.aot || args.prod
})