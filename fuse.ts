import { argv } from 'yargs'

const cliArgs = {
  electron: argv.electron,
  minify: argv.minify,
  prod: argv.prod,
  serve: argv.serve,
  watch: argv.watch,
  pwa: argv.pwa
}
