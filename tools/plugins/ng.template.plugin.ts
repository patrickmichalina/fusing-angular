import { Plugin, File } from 'fuse-box'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const defaults: NgTemplateOptions = {
  enabled: true
}

export interface NgTemplateOptions {
  readonly enabled?: boolean
}

const removeExtension = (str: string) => str.replace(str.substr(str.lastIndexOf('.')), '')

export class NgTemplateClass implements Plugin {
  test = /.+?.component.ts/
  constructor(public opts: NgTemplateOptions = defaults) { }

  transform(file: File) {
    if (!this.opts.enabled || !this.test.test(file.relativePath)) return

    if (file.context.useCache && !file.context.initialLoad) {
      let cached = file.context.cache.getStaticCache(file)
      const lastChanged = removeExtension(file.relativePath.replace('src/', '')).includes(removeExtension(file.context.bundle.lastChangedFile || ''))
      if (file.loadFromCache() && !lastChanged) {
        file.isLoaded = true
        file.contents = cached.contents
        return
      }
    }

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

    if (file.context.useCache) {
      file.context.emitJavascriptHotReload(file)
      file.context.cache.writeStaticCache(file, file.sourceMap)
    }
  }
}

export const NgTemplatePlugin = (options?: NgTemplateOptions) => new NgTemplateClass(options)
