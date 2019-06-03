import { Plugin, File } from 'fuse-box'

const defaults: NgPolyfillPluginOptions = {
  isAot: false,
  isServer: false,
  fileTest: /(main.ts|main.aot.ts)/
}

export interface NgPolyfillPluginOptions {
  isServer: boolean
  isAot: boolean
  fileTest?: RegExp
}

export const NG_POLY_BASE = [
  'core-js/proposals/reflect-metadata'
]
export const NG_POLY_SERVER = [
  ...NG_POLY_BASE,
  'zone.js/dist/zone-node',
  'zone.js/dist/long-stack-trace-zone'
]
export const NG_POLY_BROWSER = [
  ...NG_POLY_BASE,
  'zone.js/dist/zone'
]
export const NG_POLY_BROWSER_IE_ANIMATIONS = [
  'web-animations-js'
]
export const NG_POLY_BROWSER_IE = [
  'core-js/features/symbol',
  'core-js/features/object',
  'core-js/features/function',
  'core-js/features/parse-int',
  'core-js/features/parse-float',
  'core-js/features/number',
  'core-js/features/math',
  'core-js/features/string',
  'core-js/features/date',
  'core-js/features/array',
  'core-js/features/regexp',
  'core-js/features/map',
  'core-js/features/weak-map',
  'core-js/features/set'
]

const REMOVE_FROM_AOT = [
  'core-js/proposals/reflect-metadata'
]

const prepForTransform = (deps: string[]) => {
  return deps.map(dep => {
    return `import '${dep}'`
  }).join('\n')
}

export class NgPolyfillPluginClass implements Plugin {
  constructor(private opts: NgPolyfillPluginOptions = defaults) { }
  public test = this.opts.fileTest
  public dependencies: ['zone.js', 'core-js']

  onTypescriptTransform(file: File) {
    if (!this.test || !this.test.test(file.relativePath)) return
    file.contents = `${prepForTransform(this.buildSet())}\n${file.contents}`
  }

  buildSet() {
    if (this.opts.isServer) {
      return NG_POLY_SERVER
    } else {
      return this.opts.isAot
        ? NG_POLY_BROWSER.filter(a => !REMOVE_FROM_AOT.includes(a))
        : NG_POLY_BROWSER
    }
  }
}

export const NgPolyfillPlugin = (options?: Partial<NgPolyfillPluginOptions>) =>
  new NgPolyfillPluginClass({
    ...defaults,
    ...options,
  })
