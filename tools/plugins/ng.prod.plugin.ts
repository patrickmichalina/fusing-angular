import { Plugin, File } from 'fuse-box'

const defaults: NgProdPluginOptions = {
  enabled: true
}

export interface NgProdPluginOptions {
  isServer?: boolean
  enabled?: boolean
  fileTest?: string
}

export class NgProdPluginClass implements Plugin {
  constructor(public opts: NgProdPluginOptions = defaults) {
    this.opts = {
      ...defaults,
      ...opts
    }
  }

  public test = this.regex || /(main.ts|main.aot.ts)/

  get regex() {
    return this.opts &&
      this.opts.fileTest &&
      new RegExp(this.opts.fileTest) || undefined
  }

  onTypescriptTransform(file: File) {
    // console.log(file.context)
    // console.log(this.regex)
    // file.contents = `import { enableProdMode } from '@angular/core';
    // enableProdMode()
    // ${file.contents}`
  }
}

export const NgProdPlugin = (options?: NgProdPluginOptions) => new NgProdPluginClass(options);
