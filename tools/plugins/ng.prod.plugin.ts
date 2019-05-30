import { Plugin, File } from 'fuse-box'

const defaults: NgProdPluginOptions = {
  enabled: true
}

export interface NgProdPluginOptions {
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

  public dependencies: ['@angular/core']
  public test = this.regex || /(main.ts|main.js|main.aot.ts|main.aot.js)/

  get regex() {
    return this.opts &&
      this.opts.fileTest &&
      new RegExp(this.opts.fileTest) || undefined
  }

  onTypescriptTransform(file: File) {
    if (!this.opts.enabled || !this.test.test(file.relativePath)) return
    file.loadContents()
    file.contents = `import { enableProdMode } from '@angular/core';
    enableProdMode()
    ${file.contents}`
  }
}

export const NgProdPlugin = (options?: NgProdPluginOptions) => new NgProdPluginClass(options);
