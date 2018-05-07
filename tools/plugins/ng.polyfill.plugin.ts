import { Plugin } from 'fuse-box'

const defaults = {}

export interface NgPolyfillPluginOptions { }

export class NgPolyfillPluginClass implements Plugin {
  constructor(opts: NgPolyfillPluginOptions = defaults) { }
}

export const NgPolyfillPlugin = (options?: NgPolyfillPluginOptions) => new NgPolyfillPluginClass(options);
