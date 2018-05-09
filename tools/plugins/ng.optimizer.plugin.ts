import { File } from 'fuse-box/core/File'
import { buildOptimizer } from '@angular-devkit/build-optimizer'

const defaults = {}

export interface NgOptimizerPluginOptions {
  enabled?: boolean
}

export class NgOptimizerPluginClass {
  public test: RegExp = /.js/

  constructor(private opts: NgOptimizerPluginOptions = defaults) {}

  transform(file: File) {
    if (!this.opts.enabled) return
    const transpiledContent = buildOptimizer({
      content: file.contents,
      isSideEffectFree: true
    }).content
    if (transpiledContent) {
      file.contents = transpiledContent
    }
  }
}

export const NgOptimizerPlugin = (options?: NgOptimizerPluginOptions) =>
  new NgOptimizerPluginClass(options)