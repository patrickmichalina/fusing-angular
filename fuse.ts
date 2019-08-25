import { argv } from 'yargs'

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
}

const cliArgs = {
  electron: argv.electron,
  minify: argv.minify,
  prod: argv.prod,
  serve: argv.serve,
  watch: argv.watch,
  pwa: argv.pwa
}

const opts = {
  serve: cliArgs.serve,
  watch: cliArgs.watch,
  electron: {
    enabled: cliArgs.electron
  },
  pwa: cliArgs.pwa
}

