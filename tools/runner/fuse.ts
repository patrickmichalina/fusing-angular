import { PartialOptions, Options, IRequiredBrowserOptions, IRequiredUniversalServerOptions, IRequiredElectronOptions } from "./interfaces";
import { FuseBox, QuantumPlugin, WebIndexPlugin } from "fuse-box"
import { NgCompilerPlugin } from "../plugins/ng.compiler.plugin"
import { NgPolyfillPlugin } from "../plugins/ng.polyfill.plugin"
import { CompressionPlugin } from "../plugins/compression.plugin"
import { NgAotFactoryPlugin } from "../plugins/ng.aot-factory.plugin"
import { NgProdPlugin } from "../plugins/ng.prod.plugin"

const DEFAULT_CONFIG: Options = {
  enableAotCompilaton: false,
  enableAngularAnimations: false,
  enableAngularForms: false,
  enableServiceWorker: false,
  enableAngularBuildOptimizer: false,
  watch: false,
  serve: false,
  srcRoot: 'src',
  outputDirectory: '.dist',
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

const mergeOptions =
  (defaultsOptions: Options) =>
    (incomingOptions: PartialOptions): Options => ({
      ...defaultsOptions,
      ...incomingOptions,
      browser: {
        ...defaultsOptions.browser,
        ...incomingOptions.browser as IRequiredBrowserOptions,
        bundle: {
          ...defaultsOptions.browser.bundle,
          ...((incomingOptions.browser || {})).bundle
        }
      },
      universal: {
        ...defaultsOptions.universal,
        ...incomingOptions.universal as IRequiredUniversalServerOptions,
        bundle: {
          ...defaultsOptions.universal.bundle,
          ...((incomingOptions.universal || {})).bundle
        }
      },
      electron: {
        ...defaultsOptions.electron,
        ...incomingOptions.electron as IRequiredElectronOptions,
        bundle: {
          ...defaultsOptions.electron.bundle,
          ...((incomingOptions.electron || {})).bundle
        }
      },
      optimizations: {
        ...defaultsOptions.optimizations,
        ...incomingOptions.optimizations
      }
    })

export const fuseAngular = (opts: PartialOptions) => {
  const settings = mergeOptions(DEFAULT_CONFIG)(opts)

  const shared = {
    sourceMaps: settings.optimizations.enabled,
    cache: !settings.optimizations.enabled,
    homeDir: settings.srcRoot,
    output: `${settings.outputDirectory}/$name.js`
  }

  const browser = FuseBox.init({
    ...shared,
    ignoreModules: settings.browser.bundle.ignoredModules,
    output: `${settings.outputDirectory}/${settings.browser.bundle.outputPath}/$name.js`,
    plugins: [
      NgAotFactoryPlugin({ enabled: settings.enableAotCompilaton }),
      NgPolyfillPlugin({ isAot: settings.enableAotCompilaton }),
      NgCompilerPlugin({ enabled: settings.enableAotCompilaton }),
      NgProdPlugin({ enabled: settings.optimizations.enabled, fileTest: settings.browser.bundle.inputPath }),
      settings.optimizations.enabled && QuantumPlugin({
        uglify: settings.optimizations.minify,
        treeshake: settings.optimizations.treeshake,
        bakeApiIntoBundle: settings.vendorBundleName,
        processPolyfill: settings.enableAotCompilaton
      }) as any,
      CompressionPlugin({ enabled: settings.optimizations.enabled }),
      WebIndexPlugin({
        path: `${settings.jsOutputDir}`,
        template: `${settings.srcRoot}/${settings.browser.rootDir}/${settings.browser.indexTemplatePath}`,
        target: '../index.html'
      })
    ]
  })

  const server = FuseBox.init({
    ...shared,
    target: 'server',
    ignoreModules: settings.universal.bundle.ignoredModules,
    plugins: [
      NgPolyfillPlugin({ isServer: true, fileTest: /server.ts/ }),
      settings.optimizations.enabled && QuantumPlugin({
        replaceProcessEnv: false,
        uglify: settings.optimizations.minify,
        bakeApiIntoBundle: settings.universal.bundle.name,
        treeshake: settings.optimizations.treeshake
      }) as any
    ]
  })

  const electron = FuseBox.init({
    ...shared,
    target: 'server',
    ignoreModules: settings.electron.bundle.ignoredModules,
    plugins: [
      settings.optimizations.enabled && QuantumPlugin({
        replaceProcessEnv: false,
        uglify: settings.optimizations.minify,
        bakeApiIntoBundle: settings.electron.bundle.name,
        treeshake: settings.optimizations.treeshake
      }) as any
    ]
  })

  const mainAppEntry = opts.enableAotCompilaton
    ? `${settings.browserAotEntry}`
    : `${settings.browser.bundle.inputPath}`

  const httpServer = settings.serve && !settings.universal.enabled
  const UNIVERSAL_PORT = 5000
  const port = httpServer ? UNIVERSAL_PORT : 5001

  browser
    .bundle(settings.vendorBundleName)
    .instructions(` ~ ${mainAppEntry}`)

  const appBundle = browser
    .bundle(settings.browser.bundle.name)
    .splitConfig({ dest: settings.jsLazyModuleDir, browser: `/${settings.jsOutputDir}/` })
    .instructions(` !> [${mainAppEntry}]`)

  const serverBundle = server
    .bundle(settings.universal.bundle.name)
    .splitConfig({ dest: settings.jsLazyModuleDir })
    .instructions(` > ${settings.universal.rootDir}/${settings.universal.bundle.inputPath}`)
    .completed(svr => {
      if (settings.serve && settings.universal.enabled) { svr.start() }
    })

  const electronBundle = electron
    .bundle(settings.electron.bundle.name)
    .instructions(` > ${settings.electron.rootDir}/${settings.electron.bundle.inputPath}`)

  if (settings.serve) {
    browser.dev({
      port,
      httpServer,
      root: '.dist/public',
      fallback: "index.html"
    })
  }

  if (settings.watch) {
    const watchDir = `${settings.srcRoot}/**`
    appBundle.watch(watchDir)

    if (settings.serve) { appBundle.hmr({ port }) }
    if (settings.universal.enabled) { serverBundle.watch(watchDir) }
    if (settings.electron.enabled) { electronBundle.watch(watchDir) }
  }

  browser.run().then(_ => {
    if (settings.electron.enabled) { electron.run() }
    if (settings.universal.enabled) { server.run() }
  })
}