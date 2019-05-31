import { Options } from "./interfaces"
import { FuseBox, QuantumPlugin, WebIndexPlugin } from "fuse-box"
import { NgCompilerPlugin } from "../plugins/ng.compiler.plugin"
import { NgPolyfillPlugin } from "../plugins/ng.polyfill.plugin"
import { NgAotFactoryPlugin } from "../plugins/ng.aot-factory.plugin"
import { NgProdPlugin } from "../plugins/ng.prod.plugin"
import { spawn, ChildProcessWithoutNullStreams } from "child_process"

export const fuseAngular = (opts: Options) => {
  const shared = {
    sourceMaps: opts.optimizations.enabled,
    cache: !opts.optimizations.enabled,
    homeDir: opts.srcRoot,
    output: `${opts.outputDirectory}/$name.js`
  }

  const browser = FuseBox.init({
    ...shared,
    ignoreModules: opts.browser.bundle.ignoredModules,
    output: `${opts.outputDirectory}/${opts.browser.bundle.outputPath}/$name.js`,
    plugins: [
      NgProdPlugin({ enabled: opts.optimizations.enabled }),
      NgPolyfillPlugin({ isAot: opts.enableAotCompilaton }),
      NgAotFactoryPlugin({ enabled: opts.enableAotCompilaton }),
      NgCompilerPlugin({ enabled: opts.enableAotCompilaton }),
      opts.optimizations.enabled && QuantumPlugin({
        uglify: opts.optimizations.minify,
        treeshake: opts.optimizations.treeshake,
        bakeApiIntoBundle: opts.vendorBundleName,
        processPolyfill: opts.enableAotCompilaton
      }) as any,
      WebIndexPlugin({
        path: `${opts.jsOutputDir}`,
        template: `${opts.srcRoot}/${opts.browser.rootDir}/${opts.browser.indexTemplatePath}`,
        target: '../index.html',
        scriptAttributes: 'defer'
      })
    ]
  })

  const server = FuseBox.init({
    ...shared,
    target: 'server',
    ignoreModules: opts.universal.bundle.ignoredModules,
    plugins: [
      NgPolyfillPlugin({ isServer: true, fileTest: /server.ts|server.js/ }),
      opts.optimizations.enabled && QuantumPlugin({
        replaceProcessEnv: false,
        uglify: opts.optimizations.minify,
        bakeApiIntoBundle: opts.universal.bundle.name,
        treeshake: opts.optimizations.treeshake
      }) as any
    ]
  })

  const electron = FuseBox.init({
    ...shared,
    target: 'server',
    ignoreModules: opts.electron.bundle.ignoredModules,
    plugins: [
      opts.optimizations.enabled && QuantumPlugin({
        replaceProcessEnv: false,
        uglify: opts.optimizations.minify,
        bakeApiIntoBundle: opts.electron.bundle.name,
        treeshake: opts.optimizations.treeshake
      }) as any
    ]
  })

  const mainAppEntry = opts.enableAotCompilaton
    ? `${opts.browserAotEntry}`
    : `${opts.browser.bundle.inputPath}`

  const httpServer = opts.serve && !opts.universal.enabled
  const UNIVERSAL_PORT = 5000
  const port = httpServer ? UNIVERSAL_PORT : 5001

  browser
    .bundle(opts.vendorBundleName)
    .instructions(` ~ ${mainAppEntry}`)

  const appBundle = browser
    .bundle(opts.browser.bundle.name)
    .splitConfig({ dest: opts.jsLazyModuleDir, browser: `/${opts.jsOutputDir}/` })
    .instructions(` !> [${mainAppEntry}]`)

  const serverBundle = server
    .bundle(opts.universal.bundle.name)
    .splitConfig({ dest: opts.jsLazyModuleDir })
    .instructions(` > ${opts.universal.rootDir}/${opts.universal.bundle.inputPath}`)
    .completed(svr => {
      if (opts.serve && opts.universal.enabled) { svr.start() }
    })

  const electronBundle = electron
    .bundle(opts.electron.bundle.name)
    .instructions(` > ${opts.electron.rootDir}/${opts.electron.bundle.inputPath}`)

  if (opts.serve) {
    browser.dev({
      port,
      httpServer,
      root: `${opts.outputDirectory}/${opts.wwwroot}`,
      fallback: "index.html"
    })
    
    if (opts.watch) {
      const watchDir = `${opts.srcRoot}/**`
      const pathIgnore = (path: string) => !path.match(opts.assetRoot)
      appBundle.watch(watchDir, pathIgnore)

      appBundle.hmr({ port })
      if (opts.universal.enabled) { serverBundle.watch(watchDir, pathIgnore) }
      if (opts.electron.enabled) {
        let electronref: ChildProcessWithoutNullStreams
        electronBundle.watch(watchDir, pathIgnore).completed(() => {
          if (electronref) { electronref.kill() }
          electronref = spawn('electron', ['.'])
        })
       }
    }
  }

  return browser.run().then(_ => {
    if (opts.electron.enabled) { electron.run() }
    if (opts.universal.enabled) { server.run() }
  })
}