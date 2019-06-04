import { Plugin, File } from 'fuse-box'

const DEFAULTS: NgAotServerPluginOptions = {
  useAot: false,
  key: /bootstrap.*\$ngServerBootstrap/g,
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
    file.loadContents()

    // TODO: this are hardcoded paths but can be changed based on fuse options!
    file.contents = this.opts.useAot
      ? file.contents.replace(this._opts.key, `bootstrap: require('../browser/.ngc/src/server/angular/server.angular.module.ngfactory.js').AppServerModuleNgFactory`)
      : file.contents.replace(this._opts.key, `bootstrap: require('./angular/server.angular.module').AppServerModule`)
  }
}

export const NgAotServerPlugin = (options: Partial<NgAotServerPluginOptions>) =>
  new NgAotServerPluginClass(options)
