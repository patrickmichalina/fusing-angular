import { main as ngc } from '@angular/compiler-cli/src/main'
import { Plugin } from 'fuse-box'
import { resolve } from 'path';

const defaults: NgcPluginOptions = {}

export interface NgcPluginOptions { }

export class NgcPluginClass implements Plugin {
  constructor(opts: NgcPluginOptions = defaults) { }

  bundleStart() {
    return ngc(['-p', resolve('tsconfig.aot.json')])
  }
}

export const NgcPlugin = (options?: NgcPluginOptions) => new NgcPluginClass(options);
