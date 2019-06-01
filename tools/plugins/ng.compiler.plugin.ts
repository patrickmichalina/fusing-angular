import { main as ngc } from '@angular/compiler-cli/src/main'
import { Plugin } from 'fuse-box'
import { resolve } from 'path'

const defaults: NgcPluginOptions = {
  tsconfig: 'tsconfig.aot.json'
}

export interface NgcPluginOptions {
  enabled?: boolean,
  tsconfig?: string
}

export class NgcPluginClass implements Plugin {
  constructor(private opts: NgcPluginOptions = defaults) { }

  bundleStart() {
    const opts = { ...defaults, ...this.opts }
    opts.enabled && opts.tsconfig && ngc(['-p', resolve(opts.tsconfig)])
  }
}

export const NgCompilerPlugin = (options?: NgcPluginOptions) => new NgcPluginClass(options);
