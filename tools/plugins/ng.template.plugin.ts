import { Plugin, File } from 'fuse-box'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const defaults: NgTemplateOptions = {
  enabled: true
}

export interface NgTemplateOptions {
  readonly enabled?: boolean
}

export class NgTemplateClass implements Plugin {
  test = /.+?.component.ts/
  constructor(public opts: NgTemplateOptions = defaults) { }

  onTypescriptTransform(file: File) {
    if (!this.opts.enabled || !this.test.test(file.relativePath)) return

    file.loadContents()

    const templatePath = resolve(file.relativePath.replace('.ts', '.html'))
    const cssPath = resolve(file.relativePath.replace('.ts', '.css'))

    try {
      const templateFile = readFileSync(templatePath)
      file.contents = file.contents.replace(/templateUrl(.*?)(["'`])(.*?)(["'`])/g, `template: '${templateFile.toString().replace(/\r?\n|\r/g, '')}'`)
    } catch { }

    try {
      const cssFile = readFileSync(cssPath)
      file.contents = file.contents.replace(/styleUrls(.*?)(["'`])]/g, `styles: ['${cssFile.toString().replace(/\r?\n|\r/g, '')}']`)
    } catch { }
  }
}

export const NgTemplatePlugin = (options?: NgTemplateOptions) => new NgTemplateClass(options)
