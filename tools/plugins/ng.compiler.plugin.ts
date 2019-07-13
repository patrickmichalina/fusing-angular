import { Plugin } from 'fuse-box'
import { spawnSync } from 'child_process'

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
    if (opts.enabled && opts.tsconfig) {
      spawnSync('ngc', ['-p', opts.tsconfig])
    }
  }
}

export const NgCompilerPlugin = (options?: NgcPluginOptions) => new NgcPluginClass(options)
