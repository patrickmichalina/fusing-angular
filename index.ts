import { FuseBox, QuantumPlugin } from "fuse-box"
import { PORT } from "./src/config"
import { NgcPlugin } from "./tools/plugins/ng.compiler.plugin"
import { argv } from 'yargs'
import { NgPolyfillPlugin } from "./tools/plugins/ng.polyfill.plugin"
import { NgProdPlugin } from "./tools/plugins/ng.prod.plugin";

export interface FusingAngularConfig {
  productionBuild?: boolean
  supportIE11?: boolean
  supportIE11Animations?: boolean
  enableAotCompilaton?: boolean
  enableAngularAnimations?: boolean
  enableAngularForms?: boolean
  enableServiceWorker?: boolean
}

const DEFAULT_CONFIG: FusingAngularConfig = {
  enableAotCompilaton: argv.aot,
  productionBuild: argv.prod,
  supportIE11: true,
  supportIE11Animations: false,
  enableAngularAnimations: false,
  enableAngularForms: false,
  enableServiceWorker: false
}

export const fusingAngular = (opts = DEFAULT_CONFIG) => {
  const fuseBrowser = FuseBox.init({
    homeDir: "src/browser",
    output: "./.dist/public/js/$name.js",
    target: 'browser@es5',
    plugins: [
      NgProdPlugin(),
      NgPolyfillPlugin(),
      opts.enableAotCompilaton && NgcPlugin(),
      opts.productionBuild && QuantumPlugin({
        warnings: false,
        uglify: true,
        treeshake: true,
        removeUseStrict: true,
        bakeApiIntoBundle: 'vendor'
        // replaceProcessEnv: false,
        // processPolyfill: true,
        // ensureES5: true
      })
    ] as any
  })

  const mainAppEntry = opts.enableAotCompilaton
    ? 'main.aot.ts'
    : 'main.ts'

  const fuseServer = FuseBox.init({
    target: 'server@es5',
    homeDir: "./src",
    output: "./.dist/$name.js",
    plugins: [
      // NgProdPlugin({ fileTest: 'server.angular.module' }),
      NgPolyfillPlugin({ isServer: true, fileTest: 'server.angular.module' })
    ]
  })

  fuseBrowser
    .bundle('vendor')
    .instructions(` ~ ${mainAppEntry}`)

  fuseBrowser
    .bundle('app')
    .watch('src/**')
    .instructions(` !> [${mainAppEntry}]`)

  fuseServer
    .bundle("server")
    .watch("src/**")
    .instructions(" > [server/server.ts]")
    .completed(proc => proc.start())

  !opts.productionBuild && fuseServer.dev({
    root: './.dist',
    port: PORT,
    httpServer: false
  })

  fuseBrowser.run()
  fuseServer.run()
}

fusingAngular({
  // productionBuild: true,
  // enableAotCompilaton: true
})