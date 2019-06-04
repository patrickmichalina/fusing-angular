import { Options } from "./interfaces"
import { FuseBox, QuantumPlugin, WebIndexPlugin, EnvPlugin } from "fuse-box"
import { NgCompilerPlugin } from "../plugins/ng.compiler.plugin"
import { NgPolyfillPlugin } from "../plugins/ng.polyfill.plugin"
import { NgAotFactoryPlugin } from "../plugins/ng.aot-factory.plugin"
import { NgProdPlugin } from "../plugins/ng.prod.plugin"
import { spawn, ChildProcessWithoutNullStreams } from "child_process"
import { NgTemplatePlugin } from "../plugins/ng.template.plugin"
import { NgAotServerPlugin } from "../plugins/ng.aot-server.plugin"
// import { FuseProcess } from "fuse-box/FuseProcess"

export const fuseAngular = (opts: Options) => {
  // let universalFuseProcess: FuseProcess | undefined

  const shared = {
    sourceMaps: opts.optimizations.enabled,
    cache: false, // !opts.optimizations.enabled,
    homeDir: opts.srcRoot,
    output: `${opts.outputDirectory}/$name.js`,
    log: true
  }

  const httpServer = opts.serve && !opts.universal.enabled
  const UNIVERSAL_PORT = 4200
  const port = httpServer ? UNIVERSAL_PORT : 4201

  const mainAppEntry = opts.enableAotCompilaton
    ? `${opts.browserAotEntry}`
    : `${opts.browser.bundle.inputPath}`

  const browser = FuseBox.init({
    ...shared,
    ignoreModules: opts.browser.bundle.ignoredModules,
    output: `${opts.outputDirectory}/${opts.browser.bundle.outputPath}/$name.js`,
    plugins: [
      NgProdPlugin({ enabled: opts.optimizations.enabled }),
      NgPolyfillPlugin({ isAot: opts.enableAotCompilaton }),
      NgTemplatePlugin(),
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

  const electronBrowser = FuseBox.init({
    ...shared,
    target: 'electron',
    ignoreModules: opts.browser.bundle.ignoredModules,
    output: `${opts.outputDirectory}/${'electron'}/public/js/$name.js`,
    plugins: [
      NgProdPlugin({ enabled: opts.optimizations.enabled }),
      NgPolyfillPlugin({ isAot: opts.enableAotCompilaton }),
      NgTemplatePlugin({ enabled: !opts.enableAotCompilaton }),
      NgAotFactoryPlugin({ enabled: opts.enableAotCompilaton }),
      NgCompilerPlugin({ enabled: opts.enableAotCompilaton, tsconfig: 'tsconfig.electron.aot.json' }),
      opts.optimizations.enabled && QuantumPlugin({
        uglify: opts.optimizations.minify,
        treeshake: opts.optimizations.treeshake,
        bakeApiIntoBundle: opts.vendorBundleName,
        processPolyfill: opts.enableAotCompilaton,
        replaceProcessEnv: false
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
      NgAotServerPlugin({ useAot: opts.enableAotCompilaton, file: /app.ts/g }),
      NgPolyfillPlugin({ isServer: true, fileTest: /server.ts|server.js/ }),
      NgTemplatePlugin({ enabled: !opts.enableAotCompilaton }),
      opts.optimizations.enabled && QuantumPlugin({
        replaceProcessEnv: false,
        uglify: opts.optimizations.minify,
        bakeApiIntoBundle: opts.universal.bundle.name,
        treeshake: opts.optimizations.treeshake
      }) as any
    ]
  })

  const electronVars = Object
    .keys(process.env)
    .filter(k => k.includes('NG_'))
    .reduce((acc, curr) => ({ ...acc, [curr.replace('NG_', '')]: process.env[curr] }), {
      NG_SERVER_HOST: `http://localhost:${UNIVERSAL_PORT}`
    })

  const electron = FuseBox.init({
    ...shared,
    target: 'electron',
    output: `${opts.outputDirectory}/${'electron'}/$name.js`,
    ignoreModules: opts.electron.bundle.ignoredModules,
    plugins: [
      EnvPlugin(electronVars)
    ]
  })

  browser
    .bundle(opts.vendorBundleName)
    .instructions(` ~ ${mainAppEntry}`)

  electronBrowser
    .bundle(opts.vendorBundleName)
    .instructions(` ~ ${'electron/angular/main.aot.ts'}`)

  electronBrowser
    .bundle(opts.browser.bundle.name)
    .splitConfig({ dest: opts.jsLazyModuleDir, browser: `/${opts.jsOutputDir}/` })
    .instructions(` !> [${'electron/angular/main.aot.ts'}]`)

  const appBundle = browser
    .bundle(opts.browser.bundle.name)
    .splitConfig({ dest: opts.jsLazyModuleDir, browser: `/${opts.jsOutputDir}/` })
    .instructions(` !> [${mainAppEntry}]`)

  const serverBundle = server
    .bundle(opts.universal.bundle.name)
    .splitConfig({ dest: opts.jsLazyModuleDir })
    .instructions(` > ${opts.universal.rootDir}/${opts.universal.bundle.inputPath}`)
    .completed(svr => {
      if (opts.serve && opts.universal.enabled) {
        // universalFuseProcess = 
        svr.start()
      }
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
          electronref.stdout.on('data', e => console.log(`${e}`))
          electronref.stderr.on('data', e => console.log(`${e}`))

          // electronref.on('close', () => {
          //   if (universalFuseProcess) { universalFuseProcess.node.kill() }
          //   process.exit(0)
          // })
        })
      }
    }
  }

  const electronPromise = () => opts.electron.enabled
    ? electronBrowser.run().then(() => electron.run()) as Promise<void>
    : Promise.resolve()

  return Promise.all([browser.run(), electronPromise()])
    .then(() => {
      if (opts.universal.enabled) { server.run() }
    })
}