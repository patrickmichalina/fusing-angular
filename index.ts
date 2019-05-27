import { fuseAngular } from './tools/runner/fuse'

fuseAngular({
  serve: true,
  watch: true,
  universal: {
    enabled: false
  },
  electron: {
    enabled: true
  },
  // optimizations: {
  //   enabled: true,
  //   minify: true,
  //   treeshake: true
  // },
  enableAotCompilaton: true
})