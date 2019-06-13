import { Plugin, File } from 'fuse-box'

const DEFAULTS: NgAotServerPluginOptions = {
  useAot: false,
  key: /require.*.AppServerModule/g,
  file: /server.ts/
}

export interface NgAotServerPluginOptions {
  useAot: boolean
  file: RegExp
  key: RegExp
}

export class NgAotServerPluginClass implements Plugin {
  constructor(private opts: Partial<NgAotServerPluginOptions>) { }

  private _opts = {
    ...DEFAULTS,
    ...this.opts
  }


  onTypescriptTransform?(file: File) {
    if (!this._opts.file.test(file.relativePath)) return
    if (!this._opts.useAot) return
    file.loadContents()

    // TODO: this are hardcoded paths but can be changed based on fuse options!
    file.contents = file.contents.replace(this._opts.key, `require('../browser/.ngc/src/server/angular/server.angular.module.ngfactory.js').AppServerModuleNgFactory`)
  }
}

export const NgAotServerPlugin = (options: Partial<NgAotServerPluginOptions>) =>
  new NgAotServerPluginClass(options)
