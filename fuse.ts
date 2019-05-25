import { FuseBox, QuantumPlugin, WebIndexPlugin } from "fuse-box"
import { NgCompilerPlugin } from "./tools/plugins/ng.compiler.plugin"
import { NgPolyfillPlugin } from "./tools/plugins/ng.polyfill.plugin"
import { CompressionPlugin } from "./tools/plugins/compression.plugin"
import { NgProdPlugin } from "./tools/plugins/ng.prod.plugin"
import { maybe } from 'typescript-monads'
import { NgAotFactoryPlugin } from "./tools/plugins/ng.aot-factory.plugin"

export interface FusingAngularConfig {
  readonly productionBuild: boolean
  readonly supportIE11: boolean
  readonly supportIE11Animations: boolean
  readonly enableAotCompilaton: boolean
  readonly enableAngularAnimations: boolean
  readonly enableAngularForms: boolean
  readonly enableServiceWorker: boolean
  readonly enableAngularBuildOptimizer: boolean
  readonly minify: boolean
  readonly treeshake: boolean
  readonly watch: boolean
  readonly port: number
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
}

const DEFAULT_CONFIG: FusingAngularConfig = {
  enableAotCompilaton: false,
  productionBuild: false,
  supportIE11: true,
  supportIE11Animations: false,
  enableAngularAnimations: false,
  enableAngularForms: false,
  enableServiceWorker: false,
  enableAngularBuildOptimizer: false,
  minify: false,
  treeshake: false,
  watch: false,
  devServer: false,
  port: maybe(process.env.PORT).map(v => +v).valueOr(5000),
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
  browserAotEntry: 'main.aot'
}

export const fusingAngular = (opts: Partial<FusingAngularConfig>) => {
  const settings = { ...DEFAULT_CONFIG, ...opts }
  const shared = {
    sourceMaps: settings.productionBuild,
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
      NgProdPlugin({ enabled: settings.productionBuild, fileTest: settings.browserEntry }),
      settings.productionBuild && QuantumPlugin({
        uglify: settings.minify,
        treeshake: settings.treeshake,
        bakeApiIntoBundle: settings.vendorBundleName,
        processPolyfill: settings.enableAotCompilaton
      }) as any,
      CompressionPlugin({ enabled: settings.productionBuild }),
      WebIndexPlugin({
        path: `/${settings.jsOutputDir}`,
        template: `${settings.homeDir}/${settings.browserSrcDir}/index.html`,
        target: '../index.html'
      })
    ]
  })

  const mainAppEntry = opts.enableAotCompilaton
    ? `${settings.browserAotEntry}.ts`
    : `${settings.browserEntry}.ts`

  const server = FuseBox.init({
    ...shared,
    target: 'server',
    homeDir: settings.homeDir,
    output: `${settings.outputDir}/$name.js`,
    ignoreModules: ['express', 'domino', 'express-static-gzip'],
    plugins: [
      NgProdPlugin({ enabled: opts.productionBuild, fileTest: 'server.angular.module' }),
      NgPolyfillPlugin({ isServer: true, fileTest: /server.angular.module/ }),
      settings.productionBuild && QuantumPlugin({
        replaceProcessEnv: false,
        uglify: settings.minify,
        bakeApiIntoBundle: settings.serverBundleName,
        treeshake: settings.treeshake
      }) as any
    ]
  })

  browser
    .bundle(settings.vendorBundleName)
    .instructions(` ~ ${mainAppEntry}`)

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
  }

  browser.run().then(() => server.run())
}

fusingAngular({
  devServer: true,
  watch: true,
  // minify: true,
  // treeshake: true,
  // productionBuild: true,
  // enableAotCompilaton: true
})