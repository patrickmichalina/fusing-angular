import { File } from 'fuse-box/core/File'

const defaults = {}

export interface NgSwPluginOptions {}

export class NgSwPluginClass {
  public test: RegExp = /app.browser.module/

  constructor(opts: NgSwPluginOptions = defaults) {}

  transform(file: File) {
    const regex = new RegExp(/enabled: false/, 'g')
    file.contents = file.contents.replace(regex, 'enabled: true')
  }
}

export const NgSwPlugin = (options?: NgSwPluginOptions) =>
  new NgSwPluginClass(options)
