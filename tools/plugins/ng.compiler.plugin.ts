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
    this.opts.enabled && this.opts.tsconfig && ngc(['-p', resolve(this.opts.tsconfig)])
  }
}

export const NgCompilerPlugin = (options?: NgcPluginOptions) => new NgcPluginClass(options);
