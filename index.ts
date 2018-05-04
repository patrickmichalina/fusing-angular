import { FuseBox, QuantumPlugin } from "fuse-box";
import { PORT } from "./src/config";
import { NgcPlugin } from "./tools/plugins/ngc.plugin";
import { argv } from 'yargs'

const isProd = argv.prod
const isAot = argv.aot

const fuseBrowser = FuseBox.init({
  homeDir: "src/browser",
  output: "./.dist/public/js/$name.js",
  target: 'browser@es5',
  plugins: [
    isAot && NgcPlugin(),
    // WebIndexPlugin({
    //   title: 'FuseBox + Angular',
    //   template: 'angular/index.html',
    // }),
    // Ng2TemplatePlugin(),
    // ['*.component.html', RawPlugin()],
    // [
    //   '*.component.css',
    //   SassPlugin({
    //     indentedSyntax: false,
    //     importer: true,
    //     sourceMap: false,
    //     outputStyle: 'compressed'
    //   } as any),
    //   RawPlugin()
    // ],
    isProd && QuantumPlugin({
      warnings: false,
      uglify: true,
      treeshake: true,
      bakeApiIntoBundle: 'vendor'
      // replaceProcessEnv: false,
      // processPolyfill: true,
      // ensureES5: true
    })
  ] as any
});

const mainAppEntry = isAot
  ? 'main.aot.ts'
  : 'main.ts'

const fuseServer = FuseBox.init({
  target: 'server@es5',
  homeDir: "./src",
  output: "./.dist/$name.js"
})

fuseBrowser
  .bundle('vendor')
  .instructions(` ~ ${mainAppEntry}`)

fuseBrowser
  .bundle('app')
  .watch('src/browser/**')
  .instructions(` !> [${mainAppEntry}]`)

fuseServer
  .bundle("server")
  .watch("src/server/**")
  .instructions(" > [server/server.ts]")
  .completed(proc => proc.start())

fuseServer.dev({
  root: './.dist',
  port: PORT,
  httpServer: false
})

fuseBrowser.run()
fuseServer.run()