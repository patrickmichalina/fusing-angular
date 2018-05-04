import { renderModuleFactory, platformDynamicServer, INITIAL_CONFIG } from '@angular/platform-server'
import { CompilerFactory, Compiler, Type, NgModuleFactory } from '@angular/core'

const factoryCacheMap = new Map<Type<{}>, NgModuleFactory<{}>>();
const compilerFactory: CompilerFactory = platformDynamicServer().injector.get(CompilerFactory);

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
const compiler: Compiler = compilerFactory.createCompiler([
  {
    providers: [
    //   { provide: ResourceLoader, useClass: FileLoader, deps: [] },
    ]
  }
]);
function getFactory(
  moduleOrFactory: Type<{}> | NgModuleFactory<{}>, compiler: Compiler
): Promise<NgModuleFactory<{}>> {
  return new Promise<NgModuleFactory<{}>>((resolve, reject) => {
    // If module has been compiled AoT
    if (moduleOrFactory instanceof NgModuleFactory) {
      resolve(moduleOrFactory);
      return;
    } else {
      let moduleFactory = factoryCacheMap.get(moduleOrFactory);

      // If module factory is cached
      if (moduleFactory) {
        resolve(moduleFactory);
        return;
      }

      // Compile the module and cache it
      compiler.compileModuleAsync(moduleOrFactory)
        .then((factory) => {
          factoryCacheMap.set(moduleOrFactory, factory);
          resolve(factory);
        }, (err => {
          reject(err);
        }));
    }
  });
}