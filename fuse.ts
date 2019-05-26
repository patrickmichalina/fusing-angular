import { FuseBox, QuantumPlugin, WebIndexPlugin } from "fuse-box"
import { NgCompilerPlugin } from "./tools/plugins/ng.compiler.plugin"
import { NgPolyfillPlugin } from "./tools/plugins/ng.polyfill.plugin"
import { CompressionPlugin } from "./tools/plugins/compression.plugin"
import { NgProdPlugin } from "./tools/plugins/ng.prod.plugin"
import { NgAotFactoryPlugin } from "./tools/plugins/ng.aot-factory.plugin"

export interface IBundleOptions {
  readonly name: string
}

export interface IBundleable {
  readonly bundle: Partial<IBundleOptions>
}

export interface IRequiredBundleable extends IBundleable {
  readonly bundle: Required<IBundleOptions>
}

export interface IEnableable {
  readonly enabled: boolean
}

export interface IUniversalServerOptions extends IBundleable, IEnableable { }
export interface IRequiredUniversalServerOptions extends IRequiredBundleable, IEnableable { }
export interface IElectronOptions extends IBundleable, IEnableable { }
export interface IRequiredElectronOptions extends IRequiredBundleable, IEnableable { }

export interface IProductionBuildOptions extends IEnableable {
  readonly minify: boolean
  readonly treeshake: boolean
}

export interface FusingAngularConfig {
  readonly supportIE11: boolean
  readonly supportIE11Animations: boolean
  readonly enableAotCompilaton: boolean
  readonly enableAngularAnimations: boolean
  readonly enableAngularForms: boolean
  readonly enableServiceWorker: boolean
  readonly enableAngularBuildOptimizer: boolean

  readonly watch: boolean
  readonly homeDir: string
  readonly serverSrcDir: string
  readonly browserSrcDir: string
  readonly outputDir: string
  readonly vendorBundleName: string
  readonly appBundleName: string
  readonly browserEntry: string
  readonly browserAotEntry: string
  readonly jsOutputDir: string
  readonly jsLazyModuleDir: string
  readonly serve: boolean


  readonly electron: Partial<IElectronOptions>
  readonly universal: Partial<IUniversalServerOptions>
  readonly optimizations: Partial<IProductionBuildOptions>
}

type UserOptions = Partial<FusingAngularConfig>

interface RequiredFusingAngularConfig extends FusingAngularConfig {
  readonly electron: Required<IRequiredElectronOptions>
  readonly universal: Required<IRequiredUniversalServerOptions>
  readonly optimizations: Required<IProductionBuildOptions>
}

const DEFAULT_CONFIG: RequiredFusingAngularConfig = {
  enableAotCompilaton: false,
  supportIE11: true,
  supportIE11Animations: false,
  enableAngularAnimations: false,
  enableAngularForms: false,
  enableServiceWorker: false,
  enableAngularBuildOptimizer: false,
  watch: false,
  serve: false,
  homeDir: 'src',
  outputDir: '.dist',
  jsOutputDir: 'js',
  jsLazyModuleDir: 'modules',
  serverSrcDir: 'server',
  browserSrcDir: 'browser',
  vendorBundleName: 'vendor',
  appBundleName: 'app',
  browserEntry: 'main',
  browserAotEntry: 'main.aot',
  electron: {
    enabled: false,
    bundle: {
      name: ''
    }
  },
  universal: {
    enabled: true,
    bundle: {
      name: 'server'
    }
  },
  optimizations: {
    enabled: false,
    minify: false,
    treeshake: false
  }
}


const mergeOptions =
  (defaultsOptions: RequiredFusingAngularConfig) =>
    (incomingOptions: UserOptions): RequiredFusingAngularConfig => ({
      ...defaultsOptions,
      ...incomingOptions,
      universal: {
        ...defaultsOptions.universal,
        ...incomingOptions.universal as IRequiredUniversalServerOptions
      },
      electron: {
        ...defaultsOptions.electron,
        ...incomingOptions.electron as IRequiredElectronOptions,
      },
      optimizations: {
        ...defaultsOptions.optimizations,
        ...incomingOptions.optimizations
      }
    })

export const fusingAngular = (opts: UserOptions) => {
  const settings = mergeOptions(DEFAULT_CONFIG)(opts)

  const shared = {
    sourceMaps: settings.optimizations.enabled,
    cache: !settings.optimizations.enabled
  }

  const browser = FuseBox.init({
    ...shared,
    target: 'browser',
    homeDir: `${settings.homeDir}/${settings.browserSrcDir}`,
    output: `${settings.outputDir}/public/js/$name.js`,
    plugins: [
      NgAotFactoryPlugin({ enabled: settings.enableAotCompilaton }),
      NgPolyfillPlugin({ isAot: settings.enableAotCompilaton }),
      NgCompilerPlugin({ enabled: settings.enableAotCompilaton }),
      NgProdPlugin({ enabled: settings.optimizations.enabled, fileTest: settings.browserEntry }),
      settings.optimizations.enabled && QuantumPlugin({
        uglify: settings.optimizations.minify,
        treeshake: settings.optimizations.treeshake,
        bakeApiIntoBundle: settings.vendorBundleName,
        processPolyfill: settings.enableAotCompilaton
      }) as any,
      CompressionPlugin({ enabled: settings.optimizations.enabled }),
      WebIndexPlugin({
        path: `${settings.jsOutputDir}`,
        template: `${settings.homeDir}/${settings.browserSrcDir}/index.html`,
        target: '../index.html'
      })
    ]
  })

  const server = FuseBox.init({
    ...shared,
    target: 'server',
    homeDir: settings.homeDir,
    output: `${settings.outputDir}/$name.js`,
    ignoreModules: ['express', 'domino', 'express-static-gzip'],
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
    homeDir: `${settings.homeDir}/${'electron'}`,
    output: `${'.dist'}/$name.js`,
    plugins: [
      settings.optimizations.enabled && QuantumPlugin({
        replaceProcessEnv: false,
        uglify: settings.optimizations.minify,
        bakeApiIntoBundle: 'electron',
        treeshake: settings.optimizations.treeshake
      }) as any
    ]
  })

  const mainAppEntry = opts.enableAotCompilaton
    ? `${settings.browserAotEntry}.ts`
    : `${settings.browserEntry}.ts`

  browser
    .bundle(settings.vendorBundleName)
    .instructions(` ~ ${mainAppEntry}`)

  const electronBundle = electron
    .bundle('electron')
    .instructions(` > [main.ts]`)

  const appBundle = browser
    .bundle(settings.appBundleName)
    .splitConfig({ dest: settings.jsLazyModuleDir, browser: `/${settings.jsOutputDir}/` })
    .instructions(` !> [${mainAppEntry}]`)

  const serverBundle = server
    .bundle(settings.universal.bundle.name)
    .splitConfig({ dest: settings.jsLazyModuleDir })
    .instructions(` > ${settings.serverSrcDir}/server.ts`)
    .completed(proc => settings.serve && proc.start())

  if (settings.watch) {
    appBundle.watch(`${settings.homeDir}/**`)
    serverBundle.watch(`${settings.homeDir}/**`)
    if (settings.electron.enabled) { electronBundle.watch(`${settings.homeDir}/**`) }
  }

  browser.run().then(() => {
    if (settings.electron.enabled) { electron.run() }
    server.run()
  })
}

fusingAngular({
  serve: true,
  // watch: true,
  // minify: true,
  // treeshake: true,
  // productionBuild: true,
  optimizations: {
    enabled: true
  },
  // universal: {
  //   bundle: {
  //     // name: ''
  //   }
  // },
  electron: {
    enabled: false,
    // bundle: {
    //   name: ''
    // }
    // bundle: {}
  },
  enableAotCompilaton: true
})