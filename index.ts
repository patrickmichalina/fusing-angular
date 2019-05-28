import { fuseAngular } from './tools/runner/fuse'

fuseAngular({
  serve: true,
  watch: true,
  universal: {
    enabled: true
  },
  electron: {
    enabled: false
  },
  optimizations: {
    enabled: false,
    // minify: true,
    // treeshake: true
  }
  // enableAotCompilaton: true
})