import { Options } from "./interfaces";

export const DEFAULT_CONFIG: Options = {
  enableAotCompilaton: false,
  enableServiceWorker: false,
  enableAngularBuildOptimizer: false,
  watch: false,
  serve: false,
  srcRoot: 'src',
  assetRoot: 'assets',
  wwwroot: 'public',
  outputDirectory: 'dist',
  jsOutputDir: 'js',
  jsLazyModuleDir: 'modules',
  vendorBundleName: 'vendor',
  browserAotEntry: 'browser/main.aot.ts',
  browser: {
    supportIE11: false,
    supportIE11Animations: false,
    indexTemplatePath: 'index.html',
    rootDir: 'browser',
    bundle: {
      name: 'app',
      inputPath: 'browser/main.ts',
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
      outputPath: '/public/js/',
      ignoredModules: ['express', 'domino', 'express-static-gzip']
    }
  },
  electron: {
    enabled: false,
    rootDir: 'electron',
    bundle: {
      name: 'electron',
      inputPath: 'main.ts',
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
