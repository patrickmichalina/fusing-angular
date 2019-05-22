import { Plugin, File } from 'fuse-box'

// tslint:disable:no-class
// tslint:disable:no-this
// tslint:disable:no-if-statement
// tslint:disable:no-object-mutation
// tslint:disable:readonly-keyword
const defaults: NgAotFactoryPluginOptions = {}

export interface NgAotFactoryPluginOptions {}

export class NgAotFactoryPluginClass implements Plugin {
  constructor(public opts: NgAotFactoryPluginOptions = defaults) {}

  public test: RegExp = /-routing.module.js/

  onTypescriptTransform?(file: File) {
    if (!this.test.test(file.relativePath)) return
    const regex1 = new RegExp(/.module'/, 'g')
    const regex2 = new RegExp(/Module\);/, 'g')
    file.contents = file.contents.replace(regex1, ".module.ngfactory'")
    file.contents = file.contents.replace(regex2, 'ModuleNgFactory);')
  }
}

export const NgAotFactoryPlugin = (options?: NgAotFactoryPluginOptions) =>
  new NgAotFactoryPluginClass(options)
