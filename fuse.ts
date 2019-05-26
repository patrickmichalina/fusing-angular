import { FuseBox, QuantumPlugin, WebIndexPlugin } from "fuse-box"
import { NgCompilerPlugin } from "./tools/plugins/ng.compiler.plugin"
import { NgPolyfillPlugin } from "./tools/plugins/ng.polyfill.plugin"
import { CompressionPlugin } from "./tools/plugins/compression.plugin"
import { NgAotFactoryPlugin } from "./tools/plugins/ng.aot-factory.plugin"
import { NgProdPlugin } from "./tools/plugins/ng.prod.plugin"

export interface IBundleOptions {
  readonly name: string
  readonly inputPath: string
  readonly outputPath: string
  readonly ignoredModules: string[]
}

export interface IBundleable<T extends Partial<IBundleOptions> | Required<IBundleOptions> = Partial<IBundleOptions>> {
  readonly bundle: T
}

type IRequiredBundleable = IBundleable<Required<IBundleOptions>>

export interface IEnableable {
  readonly enabled: boolean
}

export interface IUniversalServerOptions extends IBundleable, IEnableable { }
export interface IElectronOptions extends IBundleable, IEnableable { }
export interface IRequiredUniversalServerOptions extends IRequiredBundleable, IEnableable { }
export interface IRequiredElectronOptions extends IRequiredBundleable, IEnableable { }

interface BaseBrowserOptions {
  readonly supportIE11: boolean
  readonly supportIE11Animations: boolean
}

export interface IBrowserOptions extends BaseBrowserOptions, IBundleable { }
export interface IRequiredBrowserOptions extends BaseBrowserOptions, IRequiredBundleable { }

export interface IProductionBuildOptions extends IEnableable {
  readonly minify: boolean
  readonly treeshake: boolean
}

export interface BaseOptions {
  readonly enableAotCompilaton: boolean
  readonly enableAngularAnimations: boolean
  readonly enableAngularForms: boolean
  readonly enableServiceWorker: boolean
  readonly enableAngularBuildOptimizer: boolean
  readonly watch: boolean
  readonly srcRoot: string
  readonly browserSrcDir: string
  readonly outputDirectory: string
  readonly vendorBundleName: string
  readonly browserAotEntry: string
  readonly jsOutputDir: string
  readonly jsLazyModuleDir: string
  readonly serve: boolean
  readonly browser: Partial<IBrowserOptions>
  readonly electron: Partial<IElectronOptions>
  readonly universal: Partial<IUniversalServerOptions>
  readonly optimizations: Partial<IProductionBuildOptions>
}

type PartialOptions = Partial<BaseOptions>

interface Options extends BaseOptions {
  readonly browser: Required<IRequiredBrowserOptions>
  readonly electron: Required<IRequiredElectronOptions>
  readonly universal: Required<IRequiredUniversalServerOptions>
  readonly optimizations: Required<IProductionBuildOptions>
}

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
  browserSrcDir: 'browser',
  vendorBundleName: 'vendor',
  browserAotEntry: 'main.aot.ts',
  browser: {
    supportIE11: false,
    supportIE11Animations: false,
    bundle: {
      name: 'app',
      inputPath: 'main.ts',
      outputPath: 'public/js',
      ignoredModules: []
    }
  },
  electron: {
    enabled: false,
    bundle: {
      name: 'electron',
      inputPath: '',
      outputPath: '.',
      ignoredModules: []
    }
  },
  universal: {
    enabled: true,
    bundle: {
      name: 'server',
      inputPath: 'server.ts',
      outputPath: '/public/js/',
      ignoredModules: ['express', 'domino', 'express-static-gzip']
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

export const fusingAngular = (opts: PartialOptions) => {
  const settings = mergeOptions(DEFAULT_CONFIG)(opts)

  const shared = {
    sourceMaps: settings.optimizations.enabled,
    cache: !settings.optimizations.enabled,
    homeDir: settings.srcRoot,
    output: `${settings.outputDirectory}/$name.js`
  }

  const browser = FuseBox.init({
    ...shared,
    homeDir: `${shared.homeDir}/${settings.browserSrcDir}`,
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
        template: `${settings.srcRoot}/${settings.browserSrcDir}/index.html`,
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
    target: 'electron',
    // homeDir: `${settings.srcRoot}/${'electron'}`,
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
    .instructions(` > ${settings.universal.bundle.inputPath}`)
    .completed(proc => settings.serve && proc.start())

  const electronBundle = electron
    .bundle(settings.electron.bundle.name)
    .instructions(` > ${settings.electron.bundle.inputPath}`)

  if (settings.watch) {
    const watchDir = `${settings.srcRoot}/**`
    appBundle.watch(watchDir)

    if (settings.universal.enabled) { serverBundle.watch(watchDir) }
    if (settings.electron.enabled) { electronBundle.watch(watchDir) }
  }

  browser.run().then(_ => {
    if (settings.electron.enabled) { electron.run() }
    if (settings.universal.enabled) { server.run() }
  })
}

fusingAngular({
  // serve: true,
  // watch: true,
  // optimizations: {
  //   enabled: true
  // },
  // browser: {},
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