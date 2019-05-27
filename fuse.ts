import { fuseAngular } from './tools/runner/fuse'

fuseAngular({
  serve: true,
  watch: true,
  // optimizations: {
  //   enabled: true,
  //   minify: true,
  //   treeshake: true
  // },
  // universal: {
  //   enabled: false,
  //   bundle: {
  //     // outputPath: ''
  //     // name: ''
  //   }
  // },
  // electron: {
  //   enabled: false,
  //   // bundle: {
  //   //   name: ''
  //   // }
  //   // bundle: {}
  // },
  // enableAotCompilaton: true
})