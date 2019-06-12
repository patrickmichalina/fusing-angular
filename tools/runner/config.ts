import { Options } from "./interfaces"

export const DEFAULT_FUSEBOX_CONFIG: Options = {
  enableAotCompilaton: false,
  enableServiceWorker: false,
  enableAngularBuildOptimizer: false,
  watch: false,
  serve: false,
  log: false,
  srcRoot: 'src',
  assetRoot: 'assets',
  wwwroot: 'public',
  outputDirectory: 'dist',
  jsOutputDir: 'js',
  jsLazyModuleDir: 'modules',
  vendorBundleName: 'vendor',
  logFilters: ['WARNING: Textured window'],
  browser: {
    supportIE11: false,
    supportIE11Animations: false,
    indexTemplatePath: 'index.pug',
    rootDir: 'browser',
    bundle: {
      name: 'app',
      inputPath: 'main.ts',
      aotInputPath: 'main.aot.ts',
      outputPath: 'public/js',
      ignoredModules: []
    }
  },
  universal: {
    enabled: true,
    rootDir: 'server',
    bundle: {
      name: 'server',
      inputPath: 'server.ts',
      aotInputPath: '',
      outputPath: '/public/js/',
      ignoredModules: ['express', 'domino', 'express-static-gzip', 'compression']
    }
  },
  electron: {
    enabled: false,
    rootDir: 'electron',
    bundle: {
      name: 'electron',
      inputPath: 'angular/main.ts',
      aotInputPath: 'angular/main.aot.ts',
      outputPath: '/',
      ignoredModules: ['electron']
    }
  },
  optimizations: {
    enabled: false,
    minify: false,
    treeshake: false
  }
}
