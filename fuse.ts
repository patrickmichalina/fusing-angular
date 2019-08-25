import { argv } from 'yargs'
import { fusebox, sparky } from 'fuse-box'

class BuildContext {
  minify = argv.minify ? true : false
  prod = argv.prod ? true : false
  serve = argv.serve ? true : false
  watch = argv.watch ? true : false
  pwa = argv.pwa ? true : false
  fusebox = {
    server: fusebox({
      target: 'server'
    }),
    browser: fusebox({
      target: 'browser'
    }),
    electron: fusebox({
      target: 'electron'
    })
  }
}

const { task, exec, rm } = sparky(BuildContext)

task('assets.copy', ctx => { })
task('assets.compress', ctx => { })

task('build', ctx => { })
task('build.dev', ctx => { })
task('build.dev.browser', ctx => { })
task('build.dev.server', ctx => { })

task('default', ctx => {
  rm('dist')
  rm('ngc')
  return exec('build')
  // ctx.fusebox.browser.runDev({})
 })