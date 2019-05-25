import { FuseBox, QuantumPlugin, WebIndexPlugin } from "fuse-box"
import { NgCompilerPlugin } from "./tools/plugins/ng.compiler.plugin"
import { NgPolyfillPlugin } from "./tools/plugins/ng.polyfill.plugin"
import { CompressionPlugin } from "./tools/plugins/compression.plugin"
import { NgProdPlugin } from "./tools/plugins/ng.prod.plugin"
import { NgAotFactoryPlugin } from "./tools/plugins/ng.aot-factory.plugin"

export interface IBundleOptions {
  readonly name: string
}

export interface IBundledOutput {
  readonly bundle: IBundleOptions
}

export interface IUniversalServerOptions {
  readonly enabled: boolean
}

export interface IElectronOptions {
  readonly enabled: boolean
}

export interface IProductionBuildOptions {
  readonly enabled: boolean
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
  readonly serverBundleName: string
  readonly browserEntry: string
  readonly browserAotEntry: string
  readonly jsOutputDir: string
  readonly jsLazyModuleDir: string
  readonly devServer: boolean


  readonly electron: Partial<IElectronOptions>
  readonly optimizations: Partial<IProductionBuildOptions>
}

const DEFAULT_CONFIG: FusingAngularConfig = {
  enableAotCompilaton: false,
  supportIE11: true,
  supportIE11Animations: false,
  enableAngularAnimations: false,
  enableAngularForms: false,
  enableServiceWorker: false,
  enableAngularBuildOptimizer: false,
  watch: false,
  devServer: false,
  homeDir: 'src',
  outputDir: '.dist',
  jsOutputDir: 'js',
  jsLazyModuleDir: 'modules',
  serverSrcDir: 'server',
  browserSrcDir: 'browser',
  vendorBundleName: 'vendor',
  appBundleName: 'app',
  serverBundleName: 'server',
  browserEntry: 'main',
  browserAotEntry: 'main.aot',
  electron: {
    enabled: false
  },
  optimizations: {
    enabled: false,
    minify: false,
    treeshake: false
  }
}

const mergeOptions =
  (defaultsOptions: FusingAngularConfig) =>
    (incomingOptions: Partial<FusingAngularConfig>): FusingAngularConfig => ({
      ...defaultsOptions,
      ...incomingOptions,
      electron: {
        ...defaultsOptions.electron,
        ...incomingOptions.electron
      },
      optimizations: {
        ...defaultsOptions.optimizations,
        ...incomingOptions.optimizations
      }
    })

export const fusingAngular = (opts: Partial<FusingAngularConfig>) => {
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
      NgProdPlugin({ enabled: settings.optimizations.enabled, fileTest: 'server.angular.module' }),
      NgPolyfillPlugin({ isServer: true, fileTest: /server.angular.module/ }),
      settings.optimizations.enabled && QuantumPlugin({
        replaceProcessEnv: false,
        uglify: settings.optimizations.minify,
        bakeApiIntoBundle: settings.serverBundleName,
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
    .bundle(settings.serverBundleName)
    .splitConfig({ dest: settings.jsLazyModuleDir })
    .instructions(` > ${settings.serverSrcDir}/server.ts`)
    .completed(proc => settings.devServer && proc.start())

  if (settings.watch) {
    appBundle.watch(`${settings.homeDir}/**`)
    serverBundle.watch(`${settings.homeDir}/**`)
    if (settings.electron.enabled) { electronBundle.watch(`${settings.homeDir}/**`) }
  }

  browser.run().then(() => {
    server.run()
    if (settings.electron.enabled) { electron.run() }
  })
}

fusingAngular({
  // devServer: true,
  // watch: true,
  // minify: true,
  // treeshake: true,
  // productionBuild: true,
  electron: {
    enabled: false
  },
  optimizations: {
    enabled: true
  }
  // enableAotCompilaton: true
})