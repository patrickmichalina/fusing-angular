import { fuseAngular } from './tools/runner/fuse'

fuseAngular({
  serve: false,
  watch: false,
  // optimizations: {
  //   enabled: true,
  //   minify: true,
  //   treeshake: true
  // },
  universal: {
    enabled: false
  },
  electron: {
    enabled: true,
    // bundle: {
    //   name: ''
    // }
    // bundle: {}
  }
  // enableAotCompilaton: true
})