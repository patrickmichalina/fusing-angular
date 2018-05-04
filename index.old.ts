// import 'zone.js/dist/zone-node';
// import 'reflect-metadata';
// // const compress = require('iltorb').compress;
// import { createSecureServer } from 'http2'
// import { readFileSync } from 'fs'
// import { renderModuleFactory, platformDynamicServer, INITIAL_CONFIG } from '@angular/platform-server'
// import { CompilerFactory, Compiler, Type, NgModuleFactory } from '@angular/core'
// import { AppServerModule } from './angular/server/server.module';
// import {
//   // FuseBox,
//   // QuantumPlugin,
//   // SassPlugin,
//   // RawPlugin
//   // QuantumPlugin
// } from 'fuse-box'
// // import { Sparky } from 'fuse-box'
// // import { main as ngc } from '@angular/compiler-cli/src/main'
// // import { readFile } from 'fs/promises';
// import { resolve } from 'path';
// // import { createHash } from 'crypto';
// // import { Ng2TemplatePlugin } from 'ng2-fused'
// import * as fs from 'fs';
// import { ResourceLoader } from '@angular/compiler';
// // import { readFile } from 'fs/promises';
// import { REQUEST, RESPONSE } from './angular/tokens'
// // import { taskName } from '../../config/build.config'
// // watchMode('angular/main.ts', {}, console.log)

// const server = createSecureServer({
//   key: readFileSync('localhost-privkey.pem'),
//   cert: readFileSync('localhost-cert.pem')
// });
// server.on('error', (err) => console.error(err));

// const factoryCacheMap = new Map<Type<{}>, NgModuleFactory<{}>>();
// const compilerFactory: CompilerFactory = platformDynamicServer().injector.get(CompilerFactory);

// export class FileLoader implements ResourceLoader {
//   get(url: string): Promise<string> {
//     return new Promise((res, reject) => {
//       fs.readFile(resolve('angular', url), (err: NodeJS.ErrnoException, buffer: Buffer) => {
//         if (err) {
//           return reject(err);
//         }

//         res(buffer.toString());
//       });
//     });
//   }
// }
// const compiler: Compiler = compilerFactory.createCompiler([
//   {
//     providers: [
//       { provide: ResourceLoader, useClass: FileLoader, deps: [] },
//       { provide: REQUEST, useValue: 'esfsdfsdf' }
//     ]
//   }
// ]);
// function getFactory(
//   moduleOrFactory: Type<{}> | NgModuleFactory<{}>, compiler: Compiler
// ): Promise<NgModuleFactory<{}>> {
//   return new Promise<NgModuleFactory<{}>>((resolve, reject) => {
//     // If module has been compiled AoT
//     if (moduleOrFactory instanceof NgModuleFactory) {
//       resolve(moduleOrFactory);
//       return;
//     } else {
//       let moduleFactory = factoryCacheMap.get(moduleOrFactory);

//       // If module factory is cached
//       if (moduleFactory) {
//         resolve(moduleFactory);
//         return;
//       }

//       // Compile the module and cache it
//       compiler.compileModuleAsync(moduleOrFactory)
//         .then((factory) => {
//           factoryCacheMap.set(moduleOrFactory, factory);
//           resolve(factory);
//         }, (err => {
//           reject(err);
//         }));
//     }
//   });
// }


// // server.on('stream', (stream, headers) => {
// //   console.log(stream)
// //   stream.respond({
// //     'content-type': 'text/html',
// //     ':status': 200
// //   });
// //   stream.end('<h1>Hello World</h1>');
// // });
// // const brDict: { [key: string]: string } = {}

// // const isProd = false

// server.on('request', (req, res) => {
//   // const fuseApp = FuseBox.init({
//   //   output: `.scratch/$name.js`,
//   //   target: 'browser@es5',
//   //   cache: true,
//   //   plugins: [
//   //     Ng2TemplatePlugin(),
//   //     ['*.component.html', RawPlugin()],
//   //     [
//   //       '*.component.css',
//   //       SassPlugin({
//   //         indentedSyntax: false,
//   //         importer: true,
//   //         sourceMap: false,
//   //         outputStyle: 'compressed'
//   //       } as any),
//   //       RawPlugin()
//   //     ],
//   //     isProd && QuantumPlugin({
//   //       warnings: false,
//   //       // uglify: true,
//   //       // treeshake: true,
//   //       bakeApiIntoBundle: 'vendor',
//   //       replaceProcessEnv: false,
//   //       processPolyfill: true,
//   //       ensureES5: true
//   //     })
//   //   ] as any
//   // })
//   // console.log(req.url)
//   // if (req.url === '/app.js') {
//   //   return readFile(resolve('.scratch/app.js')).then(file => {
//   //     res.statusCode = 200
//   //     res.end(file)
//   //   })
//   // }

//   // Promise.all([
//   //   readFile(resolve('.scratch/app.js')),
//   //   readFile(resolve('.scratch/vendor.js'))
//   // ]).then(a => {
//   //   return {
//   //     appBundle: a[0].toString(),
//   //     vendorBundle: a[1].toString()
//   //   }
//   // }, err => {
//   // console.log(err)

//   return getFactory(AppServerModule, compiler).then(fact => {
//     renderModuleFactory(fact, {
//       extraProviders: [
//         { provide: REQUEST, useValue: req },
//         { provide: RESPONSE, useValue: res },
//         {
//           provide: INITIAL_CONFIG,
//           useValue: {
//             url: req.url,
//             document: `
//           <!doctype html>
//             <html lang="en">
//             <head>
//               <meta charset="utf-8">
//               <title>Fusing Angular Demo</title>
//               <base href="/">
//               <meta name="viewport" content="width=device-width, initial-scale=1">
//             </head>
//             <body>
//               <app-root></app-root>
//               <script src="/js/vendor.js"></script>
//               <script src="/js/app.js"></script>
//             </body>
//             </html> 
//           `,
//           }
//         }
//       ]
//     }).then(file => {
//       const regex = RegExp(/ng-custom-response/, 'g')
//       if(!regex.test(file)) {
//         res.statusCode = 200
//         res.end(file)
//       }
//       // res.
//       // console.log(res.)
//       // res.getHeader('content-ty')
      
//       // var md5sum = createHash('md5');
//       // var hash = md5sum.digest('hex')
//       // var comb = `${hash}-${req.url}`
//       // if (brDict[comb]) {
//       //   res.statusCode = 200
//       //   res.setHeader('content-encoding', 'br')
//       //   res.end(brDict[comb])
//       //   return Promise.resolve()
//       // } else {
//       //   return compress(Buffer.from(file))
//       //     .then((output: any) => {
//       //       brDict[comb] = output
//       //       res.statusCode = 200
//       //       res.setHeader('content-encoding', 'br')
//       //       res.end(output)
//       //     })
//       // }
//     })
//   })


//   // ngc(['p', 'tsconfig.aot.json'])
//   // fuseApp.bundle('app').instructions(' !> [angular/main.ts]')
//   // fuseApp.bundle('vendor').instructions(' ~ angular/main.ts')
//   // return fuseApp.run().then(a => {
//   //   const appBundle = a.bundles.get('app')
//   //   const vendorBundle = a.bundles.get('vendor')
//   //   const info = appBundle && appBundle.context.output.lastPrimaryOutput
//   //   console.log(`${info && `${info.path}`}`)
//   //   return {
//   //     appBundle: appBundle && appBundle.name,
//   //     vendorBundle: vendorBundle && vendorBundle.name
//   //   }
//   // })
//   //   .then(files => {
      
//   //   })

//   // readFile('', (err, data) => {
//   //   if (err) {

//   //   } else {

//   //   }
//   // })
// })

// server.listen(5000);
